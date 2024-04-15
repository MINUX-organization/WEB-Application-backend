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
import { sequelize } from '../sequelizeInstance.js'
import _ from 'lodash'

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
        this.startReceivingCloseSignal()
    }
    startReceivingMessages() {
        this.webSocketServer.on('connection', webSocket => {
            webSocket.on('message', async msg => {
                try {
                    const msgJSON = JSON.parse(msg)
                    switch (msgJSON.hasOwnProperty("type") && msgJSON.hasOwnProperty("command")) {
                        case true:
                            switch (msgJSON.type) {
                                case 'static':
                                    switch (msgJSON.command) {
                                        case "getSystemInfo":
                                            commandsData.getSystemInfo = msgJSON.payload
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
                                                    loggerConsole.data(`Static data received on WebSocketServer!: ${JSON.stringify(staticData, null, 2)}`)
                                                    // Sending msg
                                                    if (clientsData.app) {
                                                        clientsData.app.send(JSON.stringify({
                                                            message: 'WebSocketServer received your static data!'
                                                        }))
                                                    }
                                                } catch (e) {
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
                                        case "getGpusSettings":
                                            commandsData.getGpusSettings = msgJSON.payload
                                            loggerConsole.data('Command "GpusSettings" received on WebSocketServer!')
                                            break
                                        case "getGpusWorking":
                                            commandsData.getGpusWorking = msgJSON.payload
                                            loggerConsole.data('Command "GpusWorking" received on WebSocketServer!')
                                            break
                                        case "setGpusSettings":
                                            commandsData.setGpusSettings = msgJSON.payload
                                            loggerConsole.data('Command "setGpusSettings" received on WebSocketServer!')
                                            break
                                        case "setupCustomMiner":
                                            commandsData.setupCustomMiner = msgJSON.payload
                                            loggerConsole.data('Command "setupCustomMiner" received on WebSocketServer!');
                                        case "startMining":
                                            commandsData.startMining = msgJSON.payload
                                            loggerConsole.data('Command "startMining" received on WebSocketServer!')
                                            break
                                        case "stopMining":
                                            commandsData.stopMining = msgJSON.payload
                                            loggerConsole.data('Command "stopMining "received on WebSocketServer!')
                                            break
                                        case "reboot":
                                            commandsData.reboot = msgJSON.payload
                                            loggerConsole.data('Command "reboot" received on WebSocketServer!')
                                            break
                                        case "powerOff":
                                            commandsData.powerOff = msgJSON.payload
                                            loggerConsole.data('Command "powerOff" received on WebSocketServer!')
                                            break

                                        default:
                                            loggerConsole.error(`Received unknown command: ${msgJSON.command}`)
                                    }
                                    break
                                case 'dynamic':
                                    switch (msgJSON.command) {
                                        case 'getDynamicData':
                                            // Validate dynamic data
                                            const validationDynamic = dynamicDataCM.validate(msgJSON.payload)
                                            if (validationDynamic.error) {
                                                if (clientsData.app) {
                                                    clientsData.app.send(JSON.stringify(validationDynamic.error.details[0].message))
                                                }
                                            } else {
                                                try {
                                                    // Creating dynamic data on server
                                                    for (let key in msgJSON.payload) {
                                                        dynamicData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                                                    }
                                                    // Log dynamic data
                                                    loggerConsole.data(`Dynamic data received on WebSocketServer!: ${JSON.stringify(dynamicData)}`)
                                                    // Sending dynamic data to client
                                                    if (clientsData.front) {
                                                        const dbGpus = await sequelize.models.GPUs.findAll();
                                                        // extending gpus with ids from database, deleting gpus if not found in db
                                                        const transformedGpus = _.compact(dynamicData.gpus.map(async gpu => {
                                                            const dbGpu = dbGpus.find(dbGpu => dbGpu.dataValues.uuid === gpu.uuid)
                                                            if (dbGpu === undefined) return null

                                                            var flightSheet, flightSheetWithCustomMiner
                                                            const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({ where: { gpu_uuid: dbGpu.uuid } });
                                                            if (gpuSetup.flight_sheet_id != null) {
                                                                flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: { id: gpuSetup.flight_sheet_id } })
                                                            }
                                                            if (gpuSetup.flight_sheet_id_with_custom_miner != null) {
                                                                flightSheetWithCustomMiner = await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.findOne({ where: { id: gpuSetup.flight_sheet_id_with_custom_miner } })
                                                            }

                                                            return {
                                                                ...gpu,
                                                                id: dbGpu.id,
                                                                flightSheetName: flightSheet?.name ?? null,
                                                                flightSheetWithCustomMiner: flightSheetWithCustomMiner?.name ?? null
                                                            }
                                                        }))
                                                        // Sending msg
                                                        clientsData.front.send(JSON.stringify(
                                                            {
                                                                state: dynamicData.state,
                                                                gpus: transformedGpus,
                                                                cpu: dynamicData.cpu,
                                                                harddrives: dynamicData.harddrives,
                                                                rams: dynamicData.rams,
                                                                calculations: dynamicData.calculations
                                                            }
                                                        ))
                                                    } else {
                                                        loggerConsole.error("Unable to send dynamic data to client! Client is not connected")
                                                    }
                                                } catch (error) {
                                                    loggerConsole.error(`Error in creating dynamic data: ${error.message}`)
                                                }
                                                try {
                                                    // Creating dynamic data in database
                                                    mainDatabase.createDynamicData()
                                                } catch (error) {
                                                    loggerConsole.error(`Unable to DB dynamic data!: ${error.message}`)
                                                }
                                            }
                                            break
                                        default:
                                            loggerConsole.error(`Received unknown command: ${msgJSON.command}`)
                                            break
                                    }
                                    break
                                default:
                                    loggerConsole.error(`Received unknown type of command: ${msgJSON.type}`)
                            }
                            break
                        case false:
                            switch (msgJSON) {
                                case 'Front':
                                    // Saving connection information
                                    clientsData.front = webSocket
                                    // Sending message about connection
                                    if (clientsData.front) {
                                        clientsData.front.send(JSON.stringify({ message: "Type of connection Front received!" }))
                                        loggerConsole.basicInfo('Type of connection "Front" received!')
                                    }
                                    break
                                case 'App':
                                    // Saving connection information 
                                    clientsData.app = webSocket
                                    // Sending message about connection
                                    if (clientsData.app) {
                                        clientsData.app.send(JSON.stringify({ message: "Type of connection App received!" }))
                                        loggerConsole.basicInfo('Type of connection "App" received!')
                                    }
                                    // Init 
                                    if (clientsData.app) {
                                        // Sending request for system info TODO: sending 5 times
                                        clientsData.app.send(JSON.stringify(new commandInterface('static', {}, "getSystemInfo")))
                                        loggerConsole.basicInfo("Command getSystemInfo sended to app!")
                                        // Sending saved gpu setups
                                        const gpuSetups = await mainDatabase.models.GPU_SETUPs.findAll();

                                        let flightSheetIdWithCustomMiner = null;
                                        const gpuSetupWithCustomMiner = gpuSetups.find(gpuSetup => gpuSetup.isCustomMiner === true);

                                        if (gpuSetupWithCustomMiner) {
                                            flightSheetIdWithCustomMiner = gpuSetupWithCustomMiner.flight_sheet_id_with_custom_miner;
                                            const flightSheetWithCustomMiner = await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.findByPk(flightSheetIdWithCustomMiner);
                                            clientsData.app.send(JSON.stringify(new commandInterface('static',
                                                {
                                                    url: flightSheetWithCustomMiner.installation_url,
                                                    wallet: flightSheetWithCustomMiner.wallet,
                                                    pool: flightSheetWithCustomMiner.pool,
                                                    algorithm: flightSheetWithCustomMiner.algorithm,
                                                    poolTemplate: flightSheetWithCustomMiner.pool_template,
                                                    workerTemplate: flightSheetWithCustomMiner.wallet_and_worker_template,
                                                    additionalArguments: flightSheetWithCustomMiner.extra_config_arguments
                                                }, "setupCustomMiner")))
                                        } else {
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
                                                        coreClockOffset: gpuSetup.dataValues.core_clock_offset,
                                                        memoryClockOffset: gpuSetup.dataValues.memory_clock_offset,
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
                                                        additionalString: flightSheet ? flightSheet.additional_string : ""
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
                                        }
                                        // Sending request for start mining
                                        const farmState = await mainDatabase.models.FARM_STATE.findOne()
                                        if (farmState.mining == true) {
                                            clientsData.app.send(JSON.stringify(new commandInterface('static', {}, "startMining")))
                                            loggerConsole.basicInfo("Command startMining sended to app!")
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
                    }
                } catch (error) {
                    webSocket.send(JSON.stringify(`${error}`));
                    loggerConsole.error(`Received error while parsing msg: ${error}`)
                }
                // try {
                //     const msgJSON = JSON.parse(msg)
                //     const flagData = msgJSON.hasOwnProperty("type")
                //     switch(flagData) {
                //         case false:
                //             switch(msgJSON) {
                //                 case 'Front':
                //                     clientsData.front = webSocket
                //                     if (clientsData.front) {
                //                         clientsData.front.send(JSON.stringify({
                //                             message: "Type of connection Front received!"
                //                         }))
                //                         loggerConsole.basicInfo('Type of connection "Front" received!')
                //                     }
                //                     break
                //                 case 'App':
                //                     clientsData.app = webSocket
                //                     if (clientsData.app) {
                //                         clientsData.app.send(JSON.stringify({
                //                             message: "Type of connection App received!"
                //                         }))
                //                         // TODO 5 times command 
                //                         const command = new commandInterface('static',{}, "getSystemInfo")  
                //                         clientsData.app.send(JSON.stringify(command))
                //                         loggerConsole.basicInfo('Type of connection "App" received!')
                //                         // Sending gpu setups
                //                         const gpuSetups = await mainDatabase.models.GPU_SETUPs.findAll()
                //                         const gpuSetupsDB = []
                //                         for (const gpuSetup of gpuSetups) {
                //                             let cryptocurrency, miner, wallet, pool, algorithm;

                //                             const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: { id: gpuSetup.dataValues.flight_sheet_id } });
                //                             if (flightSheet) {
                //                                 cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheet.cryptocurrency_id } });
                //                                 miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheet.miner_id } });
                //                                 wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheet.wallet_id } });
                //                                 pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheet.pool_id } });
                //                                 if (cryptocurrency) {
                //                                     algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
                //                                 }
                //                             }
                //                             gpuSetupsDB.push({
                //                                 uuid: gpuSetup.dataValues.gpu_uuid,
                //                                 overclock: {
                //                                     clockType: "custom",
                //                                     autofan: false,
                //                                     coreClock: gpuSetup.dataValues.core_clock,
                //                                     memoryClock: gpuSetup.dataValues.memory_clock,
                //                                     fanSpeed: gpuSetup.dataValues.fan_speed,
                //                                     powerLimit: gpuSetup.dataValues.power_limit,
                //                                     criticalTemp: gpuSetup.dataValues.crit_temp,
                //                                 },
                //                                 crypto: {
                //                                     cryptoType: "custom",
                //                                     coin: cryptocurrency ? cryptocurrency.name : null,
                //                                     algorithm: algorithm ? algorithm.name : null,
                //                                     wallet: wallet ? wallet.address : null,
                //                                     pool: pool ? `${pool.host}:${pool.port}` : null,
                //                                     miner: miner ? miner.name : null,
                //                                 },
                //                             })
                //                         }
                //                         if (gpuSetupsDB.length > 0) {
                //                             clientsData.app.send(JSON.stringify(new commandInterface('static',
                //                             {
                //                             gpus: gpuSetupsDB,
                //                             }, 
                //                             "setGpusSettings")))
                //                         }
                //                         // Sending start mining 
                //                         const farmState = await mainDatabase.models.FARM_STATE.findOne()
                //                         if (farmState.mining == true) {
                //                             clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "startMining")))
                //                         }
                //                     }
                //                     break
                //                 default:
                //                     if (webSocket === clientsData.app) {
                //                         loggerConsole.basicInfo(`Received message on WebSocketServer:${msg} from app!`)
                //                         webSocket.send(JSON.stringify({
                //                             message: `WebSocketServer received your message!`
                //                         }))
                //                     }
                //                     else if (webSocket === clientsData.front) {
                //                         loggerConsole.basicInfo(`Received message on WebSocketServer:${msg} from front!`)
                //                         webSocket.send(JSON.stringify({
                //                             message: `WebSocketServer received your message!`
                //                         }))
                //                     }
                //                     else {
                //                         loggerConsole.basicInfo(`Received message on WebSocketServer:${msg} from unknown user!`)
                //                         webSocket.send(JSON.stringify({
                //                             message: `WebSocketServer received your message!`
                //                         }))
                //                     }
                //                     break
                //             }
                //             break
                //         case true:
                //             switch(msgJSON.type) {
                //                 case 'static':
                //                     switch(msgJSON.command) {
                //                         case "getSystemInfo":
                //                             break
                //                         case "getGpusSettings":
                //                             break
                //                         case "getGpusWorking":
                //                             break
                //                         case "setGpusSettings":
                //                             break
                //                         case "startMining":
                //                             break
                //                         case "stopMining":
                //                             break
                //                     }
                //                     // Validate static data
                //                     const validationStatic = staticDataCM.validate(msgJSON.payload)
                //                     if (validationStatic.error) {
                //                         if (clientsData.app) {
                //                             clientsData.app.send(JSON.stringify(validationStatic.error.details[0].message))
                //                         }
                //                     } else {
                //                         try {
                //                             // Creating static data on server
                //                             for (let key in msgJSON.payload) {
                //                                 staticData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                //                             }
                //                             // Log static data
                //                             loggerConsole.data(`Static data received on WebSocketServer!: ${JSON.stringify(staticData)}`)
                //                             // Sending msg
                //                             if (clientsData.app) {
                //                                 clientsData.app.send(JSON.stringify({
                //                                     message: 'WebSocketServer received your static data!'
                //                                 }))
                //                             }
                //                         } catch(e) {
                //                             loggerConsole.error(`Error in creating static data: ${e.message}`)
                //                         }
                //                         try {
                //                             // Creating static data in database
                //                             mainDatabase.createStaticData()
                //                         } catch (e) {
                //                             loggerConsole.error(`Unable to DB static data!: ${e}`)
                //                         }
                //                     }
                //                     break
                //                 case 'dynamic':
                //                     // Validate dynamic data
                //                     const validationDynamic = dynamicDataCM.validate(msgJSON.payload)
                //                     if (validationDynamic.error) {
                //                         if (clientsData.app) {
                //                             clientsData.app.send(JSON.stringify(validationDynamic.error.details[0].message))
                //                         }
                //                     } else {
                //                         try {
                //                             // Creating dynamic data on server
                //                             for (let key in msgJSON.payload){
                //                                 dynamicData[key] = JSON.parse(JSON.stringify(msgJSON.payload[key]))
                //                             }
                //                             // Log dynamic data
                //                             loggerConsole.data(`Dynamic data received on WebSocketServer!: ${JSON.stringify(dynamicData)}`)
                //                             // Sending dynamic data to client
                //                             if (clientsData.front) {
                //                                 // Sending msg
                //                                 clientsData.front.send(JSON.stringify(
                //                                     {
                //                                         state: dynamicData.state,
                //                                         gpus: dynamicData.gpus,
                //                                         cpu: dynamicData.cpu,
                //                                         harddrive: dynamicData.harddrives,
                //                                         ram: dynamicData.rams,
                //                                         calculations: dynamicData.calculations
                //                                     }
                //                                 ))
                //                             }
                //                             else {
                //                                 loggerConsole.error("Unable to send dynamic data to client! Client is not connected")
                //                             }
                //                         } catch (e) {
                //                             loggerConsole.error(`Error in creating dynamic data: ${e.message}`)
                //                         }
                //                         try {
                //                             // Creating dynamic data in database
                //                             mainDatabase.createDynamicData()
                //                         } catch (e) {
                //                             loggerConsole.error(`Unable to DB dynamic data!: ${e.message}`)
                //                         }
                //                     }
                //                     break
                //             }
                //             break
                //     }
                // }
                // catch(e){
                //     webSocket.send(JSON.stringify(`Error: ${e}`))
                //     loggerConsole.error(`Received error: ${e}`)
                // }
            })
            webSocket.on('ping', () => {
                loggerConsole.data("Received PING from app!")
                webSocket.pong('', undefined, true);
            });
        })
    }
    startReceivingCloseSignal() {
        this.webSocketServer.on('connection', webSocket => {
            webSocket.on('close', () => {
                if (webSocket === clientsData.app) {
                    clientsData.app = null
                    loggerConsole.basicInfo(`Type of connection "App" closed!`)
                }
                else if (webSocket === clientsData.front) {
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