<script setup lang="ts">
import { useDark, useWebSocket } from '@vueuse/core'
import { testStaticData } from "@/lib/testStaticData"
import { testDynamicData } from "@/lib/testDynamicData"
import { testCommandGetGpusWorking } from './lib/testCommandGetGpusWorking';
import { testCommandGetGpusSettings } from './lib/testCommandGetGpusSettings'
import { Button, Input, Switch, Space, Typography, ConfigProvider, theme } from 'ant-design-vue'
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from "uuid";
import { testCommandReboot } from './lib/testCommandReboot';
import { testCommandStartMining } from './lib/testCommandStartMining';
import { backendUrl, backendUrlWs } from './lib/constants';
import { testCommandStopMining } from './lib/testCommandStopMining';

const isDark = useDark()

const message = ref('')
const outputRef = ref<HTMLDivElement | null>(null)
const timerDynamicDataEnabled = ref(false)
const websocketConnected = ref(false)

const logMaxChildrenCount = 10
const log = <T extends Object | string>(message: T) => {
  if (outputRef.value !== null) {
    const logDiv = document.createElement('div')
    logDiv.className = 'output-item'
    logDiv.innerText = (typeof message === 'string' ? message : JSON.stringify(message, null, 2))
    
    const children = Array.from(outputRef.value.children)
    if (children.length > logMaxChildrenCount) {
      const childrenToRemove = children.slice(0, children.length - logMaxChildrenCount)
      childrenToRemove.forEach(child => {
        outputRef.value!.removeChild(child)
      })
    }
    outputRef.value.appendChild(logDiv)
    outputRef.value.scrollTo({ top: outputRef.value.scrollHeight, behavior: 'instant' })
  }
}

const wss = useWebSocket(backendUrlWs, {
  onConnected(ws) {
    log('ONLINE')
    websocketConnected.value = true
    ws.send(JSON.stringify("App"))
    ws.onclose = () => {
      websocketConnected.value = false;
      log('OFFLINE');
    }
    ws.onopen = () => {
      websocketConnected.value = true;
    }
    ws.onmessage = response => {
      try {
        const data = JSON.parse(response.data)
        log(data)
        staticCommandHandler(data)
      } catch (e: any) {
        log(response.data)
      }
    }
  },
})


const staticCommandHandler = (request: any) => {
  if (typeof request !== 'object') return
  if ('command' in request) {
    request.responseId = uuidv4()
    switch(request.command) {
      case 'getGpusWorking':
        wss.send(JSON.stringify({
          ...request,
          payload: testCommandGetGpusWorking
        }))
      case 'getGpusSettings':
        wss.send(JSON.stringify({
          ...request,
          payload: testCommandGetGpusSettings
        }))
      case 'reboot':
        wss.send(JSON.stringify({
          ...request,
          payload: testCommandReboot
        }))
      case 'startMining':
        wss.send(JSON.stringify({
          ...request,
          payload: testCommandStartMining
        }))
      case 'stopMining':
        wss.send(JSON.stringify({
          ...request,
          payload: testCommandStopMining
        }))
    }
  }
}

const sendCommand = () => {
  wss.send(JSON.stringify({
    "command": "static-data"
  }))
}

const sendEnteredMessage = () => {
  wss.send(JSON.stringify(message.value))
}

const sendTestStaticData = () => {
  wss.send(JSON.stringify({
    type: "static",
    requestId: "sdfsdf",
    responseId: "dfgdfg",
    command: "getSystemInfo",
    payload: testStaticData
  }))
}

const sendTestDynamicData = () => {
  wss.send(JSON.stringify({
    type: "dynamic", 
    requestId: "TVWeaE4bP3bfGyccT0hSu7f1rgtkqCDJIfSzPswkE4AYL7IJMf42wRGF5gOqDCIY",
    responseId: "YoLgYdRH2nuBAwtFv8ABeg8TOkvJG7Fw55CK93BeMmT6PHPyZzjgQjxQnZfgBKac",
    command: "getDynamicData",
    payload: testDynamicData
  }))
}

const testRequestGetFullData = () => {
  fetch(`${backendUrl}/staticData/getFullData`)
    .then(response => log(response.json()))
}

const reconnectWebsocket = () => {
  wss.open();
}

const disconnectWebsocket = () => {
  wss.close();
}

const intervalId = ref(0)
watch(timerDynamicDataEnabled, (value, oldValue, onCleanup) => {
  if (timerDynamicDataEnabled.value) {
    log('started sending dynamic data in loop')
    intervalId.value = setInterval(() => sendTestDynamicData(), 1000)
  } else {
    log('stoped sending dynamic data in loop')
    clearInterval(intervalId.value)
  }
  onCleanup(() => clearInterval(intervalId.value))
})

</script>

<template>
  <ConfigProvider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <div class="form">
      <Space.Compact compact>
        <Input v-model:value="message" />
        <Button @click="sendEnteredMessage" type="primary">Send message</Button>
      </Space.Compact>
      <div class="buttons">
        <Button @click="sendTestStaticData" >send static data</Button>
        <Button @click="sendTestDynamicData" >send dynamic data</Button>
        <Button @click="testRequestGetFullData" >test request get full data (http)</Button>
        <Button @click="sendCommand">test send command</Button>
        <Button type="primary" v-if="!websocketConnected" @click="reconnectWebsocket">Reconnect Websocket</Button>
        <Button v-if="websocketConnected" @click="disconnectWebsocket">Disconnect Websocket</Button>
        <Space>
          <Typography>send dynamic data periodically</Typography>
          <Switch v-model:checked="timerDynamicDataEnabled" style="max-width: 20px; align-self: center;" />
        </Space>
      </div>
    </div>
    <div ref="outputRef" class="output" feedbackMessage rows="10"></div>
  </ConfigProvider>
</template>

<style>
  textarea {
    resize: vertical;
    min-height: 22px;
    max-height: 200px;
  }
  .form {
    background: var(--color-background-soft);
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;

    & > * {
      flex-grow: 1;
    }
  }

  .output {
    display: flex;
    flex-grow: 1;
    white-space: pre;
    word-break: break-word;
    overflow-wrap: break-word;
    min-height: 0;
    overflow: auto;
    flex-direction: column;
    gap: 10px;
  }

  .output-item {
    background: var(--color-background-soft);
    padding: 10px;
  }

  @media screen and (max-width: 700px) {
    .buttons {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 500px) {
    .buttons {
      grid-template-columns: 1fr;
    }
  }
</style>
