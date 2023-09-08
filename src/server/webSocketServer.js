// Libs
import WebSocket from '../../node_modules/ws/index.js'
// Temp 
import { staticData } from "../temp/static.js"
import { dynamicData } from "../temp/dynamic.js"
import { clientsData } from "../temp/clients.js"
// Services
import { mainDatabase } from "../database/mainDatabase.js"
// Utils
import { loggerConsole } from "../utils/logger.js";
// Classes
import { staticDataCM } from '../validation/ws/staticData.js'
import { commandInterface } from "../classes/commands.js";

import { commandsData } from '../temp/commands.js'

class WebSocketServer {
    constructor(PORT, httpServer) {
        // Start ws server
        try {
            this.webSocketServer = new WebSocket.Server({
                noServer: true 
            })
            httpServer.on('upgrade', (request, socket, head) => {
                this.webSocketServer.handleUpgrade(request, socket, head, socket => {
                    this.webSocketServer.emit('connection', socket, request);
                });
            });
            loggerConsole.basicInfo(`WebSocketServer started on ws://localhost:${PORT}`)     
        }
        catch (error) {
            console.log(error)
        }
        // Start receiving signals
        this.startReceivingMessages()
        this.startReceivingCommands()
        this.startReceivingCloseSignal()
    }
    startReceivingMessages() {
        this.webSocketServer.on('connection', webSocket => {
            webSocket.on('message', async msg => {
                try {
                    const msgJSON = JSON.parse(msg)
                    const flagData = msgJSON.hasOwnProperty("type")
                    switch(flagData) {
                        case false:
                            switch(msgJSON) {
                                case 'Front':
                                    clientsData.front = webSocket
                                    if (clientsData.front) {
                                        clientsData.front.send(JSON.stringify({
                                            message: "Type of connection Front received!"
                                        }))
                                        loggerConsole.basicInfo('Type of connection "Front" received!')
                                    }
                                    break
                                case 'App':
                                    clientsData.app = webSocket
                                    if (clientsData.app) {
                                        clientsData.app.send(JSON.stringify({
                                            message: "Type of connection App received!"
                                        }))
                                        // TODO 5 times command 
                                        const command = new commandInterface('static',{}, "getStaticInfo")  
                                        clientsData.app.send(JSON.stringify(command))
                                        loggerConsole.basicInfo('Type of connection "App" received!')
                                        
                                        const farmState = await mainDatabase.models.FARM_STATE.findOne()
                                        if (farmState.mining == true) {
                                            clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "startMining")))
                                        }
                                    }
                                    break
                                default:
                                    if (webSocket === clientsData.app) {
                                        loggerConsole.basicInfo(`Received message on WebSocketServer:${msg} from app!`)
                                        webSocket.send(JSON.stringify({
                                            message: `WebSocketServer received your message!`
                                        }))
                                    }
                                    else if (webSocket === clientsData.front) {
                                        loggerConsole.basicInfo(`Received message on WebSocketServer:${msg} from front!`)
                                        webSocket.send(JSON.stringify({
                                            message: `WebSocketServer received your message!`
                                        }))
                                    }
                                    else {
                                        loggerConsole.basicInfo(`Received message on WebSocketServer:${msg} from unknown user!`)
                                        webSocket.send(JSON.stringify({
                                            message: `WebSocketServer received your message!`
                                        }))
                                    }
                                    break
                            }
                            break
                        case true:
                            switch(msgJSON.type) {
                                case 'static':
                                    const { error } = staticDataCM.validate(msgJSON.payload)
                                    if (error) {
                                        if (clientsData.app) {
                                            console.log(error)
                                            clientsData.app.send(JSON.stringify(error.details[0].message))
                                        }
                                    } else {
                                        try {
                                            for (let key in msgJSON.payload) {
                                                staticData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                                            }
                                            //
                                            loggerConsole.data(`Static data received on WebSocketServer!: ${JSON.stringify(staticData)}`)
                                            webSocket.send(JSON.stringify({
                                                message: 'WebSocketServer received your static data!'
                                            }))
                                        }
                                        catch(e) {
                                            loggerConsole.error(`Error in creating static data!`)
                                        }
                                        try {
                                            mainDatabase.createStaticData()
                                        }
                                        catch (e) {
                                            loggerConsole.error(`Unable to DB static data!: ${e}`)
                                        }
                                    }
                                    break
                                case 'dynamic':
                                    try {
                                        // console.log(dynamicData.checkGPUData())
                                        // mainDatabase.createDynamicData()
                                    }
                                    catch(e) {
                                        loggerConsole.error(`Unable to DB dynamic data!: ${e}`)
                                    }
                                    try {
                                        for (let key in msgJSON.payload){
                                            dynamicData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                                        }
                                        loggerConsole.data(`Dynamic data received on WebSocketServer!`)
                                        //
                                        if (clientsData.front) {
                                            // calculation
                                            const calculate = () => {
                                                // variables
                                                const result = {
                                                    coinsValue: null,
                                                    totalSharesAccepted: 0,
                                                    totalSharesRejected: 0,
                                                    workingAlgorithms: 0,
                                                    workingMiner: 0,
                                                    totalPower: 0,
                                                    totalRam: 0
                                                }
                                                const miners = []
                                                const algorithms = []
                                                const coins = []
                                                // GPU 
                                                dynamicData.gpus.forEach(element => {
                                                    result.totalSharesAccepted += element.shares.accepted
                                                    result.totalSharesRejected += element.shares.rejected
                                                    result.totalPower += element.powerUsage
                                                    miners.push(element.miner.uuid)
                                                    algorithms.push(element.algorithm)
                                                    coins.push({coin: element.cryptocurrency, algorithm: element.algorithm})
                                                });
                                                // CPU
                                                result.totalSharesAccepted += dynamicData.cpu.shares.accepted
                                                result.totalSharesRejected += dynamicData.cpu.shares.rejected
                                                result.totalPower += dynamicData.cpu.powerUsage 
                                                miners.push(dynamicData.cpu.miner.uuid)
                                                algorithms.push(dynamicData.cpu.algorithm)
                                                coins.push({coin: dynamicData.cpu.cryptocurrency, algorithm: dynamicData.cpu.algorithm})
                                                // RAM  
                                                result.totalRam += dynamicData.ram.free.value
                                                //sort arrays with miners/algorithms
                                                result.workingAlgorithms = [...new Set(algorithms)].length
                                                result.workingMiner = [...new Set(miners)].length
                                                // coins
                                                const coinCount = coins.reduce((acc, item) => {
                                                    if (!acc[item.coin]) {
                                                        acc[item.coin] = { coin: item.coin, algorithm: item.algorithm, value: 1 };
                                                    } else {
                                                        acc[item.coin].value++
                                                    }
                                                    return acc;
                                                }, {});
                                                result.coinsValue = Object.values(coinCount).map((item) => {
                                                    return { coin: item.coin, algorithm: item.algorithm, value: item.value }
                                                });
                                                //
                                                return result
                                            }
                                            const resultCalculations = calculate()
                                            //
                                            clientsData.front.send(JSON.stringify(
                                                {
                                                    state: dynamicData.state,
                                                    gpus: dynamicData.gpus,
                                                    cpu: dynamicData.cpu,
                                                    harddrive: dynamicData.harddrive,
                                                    ram: dynamicData.ram,
                                                    calculations: {
                                                        ...resultCalculations
                                                    }
                                                }
                                            ))
                                        }
                                        else {
                                            throw new Error("Front is not available")
                                        }
                                    }
                                    catch(e) {
                                        loggerConsole.error(`Unable to send dynamic data!: ${e}`)
                                        webSocket.send(JSON.stringify({
                                            error: `${e.message}`
                                        }))
                                    }
                                    
                                    break
                            }
                            break
                    }
                }
                catch(e){
                    webSocket.send(JSON.stringify(`Error: ${e}`))
                    loggerConsole.error(`Received error: ${e}`)
                }
            })
        })
    }
    startReceivingCommands() {
        this.webSocketServer.on('connection', webSocket => {
            webSocket.on('message', msg => {
                try {
                    const msgJSON = JSON.parse(msg)
                    switch(msgJSON.command) {
                        case "getSystemInfo":
                            commandsData.getSystemInfo = msgJSON.payload
                            break
                        case "getGpusSettings":
                            commandsData.getGpusSettings = msgJSON.payload
                            break
                        case "getGpusWorking":
                            commandsData.getGpusWorking = msgJSON.payload
                            break
                        case "setGpusSettings":
                            commandsData.setGpusSettings = msgJSON.payload
                            break
                        case "startMining": 
                            commandsData.startMining = msgJSON.payload
                            break
                        case "stopMining":
                            commandsData.stopMining = msgJSON.payload
                            break
                        case "reboot": 
                            commandsData.reboot = msgJSON.payload
                            break
                    }   
                }
                catch (e) {
                    loggerConsole.error(`Received error: ${e.message}`)
                }
            })
        })
    }
    startReceivingCloseSignal() {
        this.webSocketServer.on('connection', webSocket => {
            webSocket.on('close', () => {
                if (webSocket === clientsData.app){
                    clientsData.app = null
                    loggerConsole.basicInfo(`Type of connection "App" closed!`)
                }
                else if (webSocket === clientsData.front){
                    clientsData.front = null
                    loggerConsole.basicInfo(`Type of connection "Front" closed!`)
                }
                else {
                    loggerConsole.basicInfo('Type of connection "Unknown" closed!')
                }
            })
        })
    }
} 

export { WebSocketServer } 