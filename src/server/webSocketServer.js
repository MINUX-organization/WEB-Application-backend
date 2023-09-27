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
import { dynamicDataCM } from '../validation/ws/dynamicData.js'
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
                                        const command = new commandInterface('static',{}, "getSystemInfo")  
                                        clientsData.app.send(JSON.stringify(command))
                                        loggerConsole.basicInfo('Type of connection "App" received!')
                                        // Sending gpu setups
                                        const gpuSetups = await mainDatabase.models.GPU_SETUPs.findAll()
                                        const gpuSetupsDB = []
                                        for (const gpuSetup of gpuSetups) {
                                            let cryptocurrency, miner, wallet, pool, algorithm;
                                            
                                            const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: { id: gpuSetup.dataValues.flight_sheet_id } });
                                            if (flightSheet) {
                                                cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheet.cryptocurrency_id } });
                                                miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheet.miner_id } });
                                                wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheet.wallet_id } });
                                                pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheet.pool_id } });
                                                if (cryptocurrency) {
                                                    algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
                                                }
                                            }
                                            gpuSetupsDB.push({
                                                uuid: gpuSetup.dataValues.gpu_uuid,
                                                overclock: {
                                                    clockType: "custom",
                                                    autofan: false,
                                                    coreClock: gpuSetup.dataValues.core_clock,
                                                    memoryClock: gpuSetup.dataValues.memory_clock,
                                                    fanSpeed: gpuSetup.dataValues.fan_speed,
                                                    powerLimit: gpuSetup.dataValues.power_limit,
                                                    criticalTemp: gpuSetup.dataValues.crit_temp,
                                                },
                                                crypto: {
                                                    cryptoType: "custom",
                                                    coin: cryptocurrency ? cryptocurrency.name : null,
                                                    algorithm: algorithm ? algorithm.name : null,
                                                    wallet: wallet ? wallet.address : null,
                                                    pool: pool ? `${pool.host}:${pool.port}` : null,
                                                    miner: miner ? miner.name : null,
                                                },
                                            })
                                        }
                                        if (gpuSetupsDB.length > 0) {
                                            clientsData.app.send(JSON.stringify(new commandInterface('static',
                                            {
                                            gpus: gpuSetupsDB,
                                            }, 
                                            "setGpusSettings")))
                                        }
                                        // Sending start mining 
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
                                    // Validate static data
                                    const validationStatic = staticDataCM.validate(msgJSON.payload)
                                    if (validationStatic.error) {
                                        if (clientsData.app) {
                                            clientsData.app.send(JSON.stringify(validationStatic.error.details[0].message))
                                        }
                                    } else {
                                        try {
                                            // Creating static data on server
                                            for (let key in msgJSON.payload) {
                                                staticData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                                            }
                                            // Log static data
                                            loggerConsole.data(`Static data received on WebSocketServer!: ${JSON.stringify(staticData)}`)
                                            // Sending msg
                                            if (clientsData.app) {
                                                clientsData.app.send(JSON.stringify({
                                                    message: 'WebSocketServer received your static data!'
                                                }))
                                            }
                                        } catch(e) {
                                            loggerConsole.error(`Error in creating static data: ${e.message}`)
                                        }
                                        try {
                                            // Creating static data in database
                                            mainDatabase.createStaticData()
                                        } catch (e) {
                                            loggerConsole.error(`Unable to DB static data!: ${e}`)
                                        }
                                    }
                                    break
                                case 'dynamic':
                                    // Validate dynamic data
                                    const validationDynamic = dynamicDataCM.validate(msgJSON.payload)
                                    if (validationDynamic.error) {
                                        if (clientsData.app) {
                                            clientsData.app.send(JSON.stringify(validationDynamic.error.details[0].message))
                                        }
                                    } else {
                                        try {
                                            
                                            // Creating dynamic data on server
                                            for (let key in msgJSON.payload){
                                                dynamicData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                                            }
                                            // Log dynamic data
                                            loggerConsole.data(`Dynamic data received on WebSocketServer!: ${JSON.stringify(dynamicData)}`)
                                            // Sending dynamic data to client
                                            if (clientsData.front) {
                                                // Sending msg
                                                clientsData.front.send(JSON.stringify(
                                                    {
                                                        state: dynamicData.state,
                                                        gpus: dynamicData.gpus,
                                                        cpu: dynamicData.cpu,
                                                        harddrive: dynamicData.harddrives,
                                                        ram: dynamicData.rams,
                                                        calculations: dynamicData.calculations
                                                    }
                                                ))
                                            }
                                            else {
                                                loggerConsole.error("Unable to send dynamic data to client! Client is not connected")
                                            }
                                        } catch (e) {
                                            loggerConsole.error(`Error in creating dynamic data: ${e.message}`)
                                        }
                                        try {
                                            // Creating dynamic data in database
                                            mainDatabase.createDynamicData()
                                        } catch (e) {
                                            loggerConsole.error(`Unable to DB dynamic data!: ${e.message}`)
                                        }
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