<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import { testStaticData } from "@/lib/testStaticData"
import { testDynamicData } from "@/lib/testDynamicData"
import { Button, Input, Switch, Space, Typography } from 'ant-design-vue'
import { ref, watch } from 'vue';

const message = ref('')
const outputRef = ref<HTMLDivElement | null>(null)
const timerDynamicDataEnabled = ref(false)

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

const wss = useWebSocket(import.meta.env.VITE_WS_BACKEND_URL, {
  onConnected: (ws) => {
    log('ONLINE')
    ws.send(JSON.stringify("App"))
    ws.onclose = () => log('OFFLINE')
    ws.onmessage = response => log(JSON.parse(response.data))
  }
})

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
  fetch(`${import.meta.env.VITE_BACKEND_URL}/staticData/getFullData`)
    .then(response => log(response.json()))
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
})

</script>

<template>
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
      <Space>
        <Typography>send dynamic data periodically</Typography>
        <Switch v-model:checked="timerDynamicDataEnabled" style="max-width: 20px; align-self: center;" />
      </Space>
    </div>
  </div>
  <div ref="outputRef" class="output" feedbackMessage rows="10"></div>
</template>

<style>
  textarea {
    resize: vertical;
    min-height: 22px;
    max-height: 200px;
  }
  .form {
    background: #f3f3f3;
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
    background: #eeeeee;
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
