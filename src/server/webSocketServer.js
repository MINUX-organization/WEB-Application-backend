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
                                        case "setCpusSettings":
                                            commandsData.setCpusSettings = msgJSON.payload
                                            loggerConsole.data('Command "setCpusSettings" received on WebSocketServer!')
                                            break
                                        case "setupCustomMiner":
                                            commandsData.setupCustomMiner = msgJSON.payload
                                            loggerConsole.data('Command "setupCustomMiner" received on WebSocketServer!');
                                            break
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
                                                        const transformedGpus = _.compact(await Promise.all(dynamicData.gpus.map(async gpu => {
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
                                                                flightSheetWithCustomMinerName: flightSheetWithCustomMiner?.name ?? null
                                                            }
                                                        })))
                                                        console.log({
                                                            state: dynamicData.state,
                                                            gpus: transformedGpus,
                                                            cpu: dynamicData.cpu,
                                                            harddrives: dynamicData.harddrives,
                                                            rams: dynamicData.rams,
                                                            calculations: dynamicData.calculations
                                                        });
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
                                                    // mainDatabase.createDynamicData()
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
                                    // Sending request for system info TODO: sending 5 times
                                    if (!clientsData.app) {
                                        break;
                                    }
                                    clientsData.app.send(JSON.stringify(new commandInterface('static', {}, "getSystemInfo")))
                                    loggerConsole.basicInfo("Command getSystemInfo sended to app!")
                                    // Sending saved gpu setups
                                    const gpuSetups = await mainDatabase.models.GPU_SETUPs.findAll();
                                    const cpuSetups = await mainDatabase.models.CPU_SETUPs.findAll();

                                    const customGpuSetups = gpuSetups.filter(gpuSetups => gpuSetups.isCustomMiner == true);
                                    const flightSheetIdWithCustomMiner = customGpuSetups.find(gpuSetup => gpuSetup.isCustomMiner === true)?.flight_sheet_id_with_custom_miner;
                                    const multipleGpuSetups = gpuSetups.filter(gpuSetup => gpuSetup.isMultiple === true);
                                    const singleGpuSetups = gpuSetups.filter(gpuSetup => gpuSetup.flight_sheet_id !== null);
                                    const nonFlightSheetsGpuSetups = gpuSetups.filter(gpuSetup => !gpuSetup.isCustomMiner && !gpuSetup.isMultiple && gpuSetup.flight_sheet_id === null);

                                    const reformatedGpuSetups = [];

                                    for (const cpuSetup of cpuSetups) {
                                        try {
                                            if (cpuSetup.flight_sheet_id == null) {
                                                const command = new commandInterface(
                                                    'static',
                                                    {
                                                        cpus: {
                                                            uuid: cpuSetup.cpu_uuid,
                                                            overclock: {
                                                                clockType: "custom",
                                                                autofan: false,
                                                                hugepages: 1000
                                                            },
                                                            crypto: {
                                                                coin: "",
                                                                algorithm: "",
                                                                wallet: "",
                                                                pool: "",
                                                                miner: "",
                                                                additionalString: "",
                                                                configFile: ""
                                                            }
                                                        },
                                                    },
                                                    "setCpusSettings");
                                                clientsData.app.send(JSON.stringify(command));
                                                continue;
                                            }
                                            const flightSheet = await mainDatabase.models.FLIGHT_SHEETs_WITH_CPU.findByPk(cpuSetup.flight_sheet_id);
                                            if (!flightSheet) {
                                                throw new Error(`Flight sheet with id ${cpuSetup.flight_sheet_id} not found for CPU setup with id ${cpuSetup.id}`);
                                            }

                                            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findByPk(flightSheet.cryptocurrency_id);
                                            if (!cryptocurrency) {
                                                throw new Error(`Cryptocurrency with id ${flightSheet.cryptocurrency_id} not found for CPU setup with id ${cpuSetup.id}`);
                                            }

                                            const algorithm = await mainDatabase.models.ALGORITHMs.findByPk(cryptocurrency.algorithm_id);
                                            if (!algorithm) {
                                                throw new Error(`Algorithm with id ${cryptocurrency.algorithm_id} not found for CRYPTOCURRENCY with id ${cryptocurrency.id}!`);
                                            }

                                            const wallet = await mainDatabase.models.WALLETs.findByPk(flightSheet.wallet_id);
                                            if (!wallet) {
                                                throw new Error(`Wallet with id ${flightSheet.wallet_id} not found for CPU setup with id ${cpuSetup.id}!`);
                                            }

                                            const pool = await mainDatabase.models.POOLs.findByPk(flightSheet.pool_id);
                                            if (!pool) {
                                                throw new Error(`Pool with id ${flightSheet.pool_id} not found for CPU setup with id ${cpuSetup.id}!`);
                                            }

                                            const miner = await mainDatabase.models.MINERs.findByPk(flightSheet.miner_id);
                                            if (!miner) {
                                                throw new Error(`Miner with id ${flightSheet.miner_id} not found for CPU setup with id ${cpuSetup.id}!`);
                                            }

                                            if (!clientsData.app) {
                                                throw new Error("App is not available!");
                                            }

                                            const command = new commandInterface(
                                                'static',
                                                {
                                                    cpus: {
                                                        uuid: cpuSetup.dataValues.cpu_uuid,
                                                        overclock: {
                                                            clockType: "custom",
                                                            autofan: false,
                                                            hugepages: flightSheet ? flightSheet : 1000
                                                        },
                                                        crypto: {
                                                            coin: cryptocurrency ? cryptocurrency.name : "",
                                                            algorithm: algorithm ? algorithm.name : "",
                                                            wallet: wallet ? wallet.address : "",
                                                            pool: pool ? `${pool.host}:${pool.port}` : "",
                                                            miner: miner ? miner.name : "",
                                                            additionalString: flightSheet ? flightSheet.additional_string : "",
                                                            configFile: flightSheet ? flightSheet.config_file : ""
                                                        }
                                                    },
                                                },
                                                "setCpusSettings");
                                            clientsData.app.send(JSON.stringify(command));
                                        } catch (err) {
                                            webSocket.send(JSON.stringify(`Received error while sending CPU SETUP init data. Message: ${err}`));
                                            loggerConsole.error(`Received error while sending CPU SETUP init data. Message: ${err}`)
                                        }
                                    }

                                    if (flightSheetIdWithCustomMiner) {
                                        try {
                                            for (const gpuSetup of gpuSetups) {
                                                reformatedGpuSetups.push({
                                                    uuid: gpuSetup.gpu_uuid,
                                                    overclock: {
                                                        clockType: "custom",
                                                        autofan: false,
                                                        coreClockOffset: gpuSetup.core_clock_offset,
                                                        memoryClockOffset: gpuSetup.memory_clock_offset,
                                                        fanSpeed: gpuSetup.fan_speed,
                                                        powerLimit: gpuSetup.power_limit,
                                                        criticalTemp: gpuSetup.crit_temp,
                                                    },
                                                    crypto: {
                                                        miner: "",
                                                        additionalString: "",
                                                        1: {
                                                            cryptocurrency: "",
                                                            algorithm: "",
                                                            wallet: "",
                                                            pool: ""
                                                        },
                                                        2: {
                                                            cryptocurrency: "",
                                                            algorithm: "",
                                                            wallet: "",
                                                            pool: ""
                                                        },
                                                        3: {
                                                            cryptocurrency: "",
                                                            algorithm: "",
                                                            wallet: "",
                                                            pool: ""
                                                        }
                                                    },
                                                });
                                            }

                                            if (!clientsData.app) {
                                                throw new Error("App is not available!");
                                            }

                                            clientsData.app.send(JSON.stringify(new commandInterface('static',
                                                {
                                                    gpus: reformatedGpuSetups,
                                                },
                                                "setGpusSettings")));

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
                                                },
                                                "setupCustomMiner")));
                                        } catch (err) {
                                            webSocket.send(JSON.stringify(`Received error while sending GPU SETUP CUSTOM init data. Message: ${err}`));
                                            loggerConsole.error(`Received error while sending GPU SETUP CUSTOM init data. Message: ${err}`)
                                        }
                                        break;
                                    }
                                    for (const gpuSetup of singleGpuSetups) {
                                        try {
                                            const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findByPk(gpuSetup.flight_sheet_id);
                                            if (!flightSheet) {
                                                throw new Error(`Flight sheet with id ${gpuSetup.flight_sheet_id} not found for GPU setup with id ${gpuSetup.id}`);
                                            }

                                            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findByPk(flightSheet.cryptocurrency_id);
                                            if (!cryptocurrency) {
                                                throw new Error(`Cryptocurrency with id ${flightSheet.cryptocurrency_id} not found for GPU setup with id ${gpuSetup.id}`);
                                            }

                                            const algorithm = await mainDatabase.models.ALGORITHMs.findByPk(cryptocurrency.algorithm_id);
                                            if (!algorithm) {
                                                throw new Error(`Algorithm with id ${cryptocurrency.algorithm_id} not found for CRYPTOCURRENCY with id ${cryptocurrency.id}!`);
                                            }

                                            const wallet = await mainDatabase.models.WALLETs.findByPk(flightSheet.wallet_id);
                                            if (!wallet) {
                                                throw new Error(`Wallet with id ${flightSheet.wallet_id} not found for GPU setup with id ${gpuSetup.id}!`);
                                            }

                                            const pool = await mainDatabase.models.POOLs.findByPk(flightSheet.pool_id);
                                            if (!pool) {
                                                throw new Error(`Pool with id ${flightSheet.pool_id} not found for GPU setup with id ${gpuSetup.id}!`);
                                            }

                                            const miner = await mainDatabase.models.MINERs.findByPk(flightSheet.miner_id);
                                            if (!miner) {
                                                throw new Error(`Miner with id ${flightSheet.miner_id} not found for GPU setup with id ${gpuSetup.id}!`);
                                            }

                                            reformatedGpuSetups.push({
                                                uuid: gpuSetup.dataValues.gpu_uuid,
                                                overclock: {
                                                    clockType: "custom",
                                                    autofan: false,
                                                    coreClockOffset: gpuSetup.core_clock_offset,
                                                    memoryClockOffset: gpuSetup.memory_clock_offset,
                                                    fanSpeed: gpuSetup.fan_speed,
                                                    powerLimit: gpuSetup.power_limit,
                                                    criticalTemp: gpuSetup.crit_temp,
                                                },
                                                crypto: {
                                                    miner: miner ? miner.name : "",
                                                    additionalString: flightSheet ? flightSheet.additional_string : "",
                                                    1: {
                                                        coin: cryptocurrency ? cryptocurrency.name : "",
                                                        algorithm: algorithm ? algorithm.name : "",
                                                        wallet: wallet ? wallet.address : "",
                                                        pool: pool ? `${pool.host}:${pool.port}` : ""
                                                    },
                                                    2: {
                                                        cryptocurrency: "",
                                                        algorithm: "",
                                                        wallet: "",
                                                        pool: ""
                                                    },
                                                    3: {
                                                        cryptocurrency: "",
                                                        algorithm: "",
                                                        wallet: "",
                                                        pool: ""
                                                    }
                                                },
                                            });

                                        } catch (err) {
                                            webSocket.send(JSON.stringify(`Received error while sending GPU SETUP SINGLE init data. Message: ${err}`));
                                            loggerConsole.error(`Received error while sending GPU SETUP SINGLE init data. Message: ${err}`)
                                        }
                                    }
                                    for (const gpuSetup of multipleGpuSetups) {
                                        try {
                                            const flightSheet = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.findByPk(gpuSetup.flight_sheet_id_multiple);
                                            if (!flightSheet) {
                                                throw new Error(`Flight sheet with id ${gpuSetup.flight_sheet_id_multiple} not found for GPU setup with id ${gpuSetup.id}`);
                                            }

                                            const miner = await mainDatabase.models.MINERs.findByPk(flightSheet.miner_id);
                                            if (!miner) {
                                                throw new Error(`Miner with id ${flightSheet.miner_id} not found for GPU setup with id ${gpuSetup.id}!`);
                                            }

                                            const reformatedGpuSetup = {
                                                uuid: gpuSetup.dataValues.gpu_uuid,
                                                overclock: {
                                                    clockType: "custom",
                                                    autofan: false,
                                                    coreClockOffset: gpuSetup.core_clock_offset,
                                                    memoryClockOffset: gpuSetup.memory_clock_offset,
                                                    fanSpeed: gpuSetup.fan_speed,
                                                    powerLimit: gpuSetup.power_limit,
                                                    criticalTemp: gpuSetup.crit_temp,
                                                },
                                                crypto: {
                                                    miner: miner ? miner.name : "",
                                                    additionalString: flightSheet ? flightSheet.additional_string : "",
                                                }
                                            };
                                            const configs = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE_CRYPTOCURRENCIEs.findAll({
                                                where: {
                                                    flight_sheet_multiple_id: flightSheet.id
                                                }
                                            });

                                            for (let i = 0; i <= 2; i++) {
                                                if (!configs[i]) {
                                                    reformatedGpuSetup.crypto[i + 1] = {
                                                        cryptocurrency: "",
                                                        algorithm: "",
                                                        wallet: "",
                                                        pool: ""
                                                    }
                                                    continue;
                                                }
                                                const { cryptocurrency_id, wallet_id, pool_id, config_id } = configs[i];

                                                const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findByPk(cryptocurrency_id);
                                                if (!cryptocurrency) {
                                                    throw new Error(`Cryptocurrency with id ${cryptocurrency_id} not found for GPU MULTIPLE CONFIG with id ${config_id}!`);
                                                }

                                                const algorithm = await mainDatabase.models.ALGORITHMs.findByPk(cryptocurrency.algorithm_id);
                                                if (!algorithm) {
                                                    throw new Error(`Algorithm with id ${cryptocurrency.algorithm_id} not found for CRYPTOCURRENCY with id ${cryptocurrency.id}!`);
                                                }

                                                const wallet = await mainDatabase.models.WALLETs.findByPk(wallet_id);
                                                if (!wallet) {
                                                    throw new Error(`Wallet with id ${wallet_id} not found for GPU MULTIPLE CONFIG with id ${config_id}!`);
                                                }

                                                const pool = await mainDatabase.models.POOLs.findByPk(pool_id);
                                                if (!pool) {
                                                    throw new Error(`Pool with id ${pool_id} not found for GPU MULTIPLE CONFIG with id ${config_id}!`);
                                                }

                                                reformatedGpuSetup.crypto[i + 1] = {
                                                    cryptocurrency: cryptocurrency ? cryptocurrency.name : "",
                                                    algorithm: algorithm ? algorithm.name : "",
                                                    wallet: wallet ? wallet.address : "",
                                                    pool: pool ? `${pool.host}:${pool.port}` : ""
                                                }
                                            }
                                            reformatedGpuSetups.push(reformatedGpuSetup);
                                        } catch (err) {
                                            webSocket.send(JSON.stringify(`Received error while sending GPU SETUP MULTIPLE init data. Message: ${err}`));
                                            loggerConsole.error(`Received error while sending GPU SETUP MULTIPLE init data. Message: ${err}`)
                                        }
                                    }
                                    for (const gpuSetup of nonFlightSheetsGpuSetups) {
                                        try {
                                            reformatedGpuSetups.push({
                                                uuid: gpuSetup.gpu_uuid,
                                                overclock: {
                                                    clockType: "custom",
                                                    autofan: false,
                                                    coreClockOffset: gpuSetup.core_clock_offset,
                                                    memoryClockOffset: gpuSetup.memory_clock_offset,
                                                    fanSpeed: gpuSetup.fan_speed,
                                                    powerLimit: gpuSetup.power_limit,
                                                    criticalTemp: gpuSetup.crit_temp,
                                                },
                                                crypto: {
                                                    miner: "",
                                                    additionalString: "",
                                                    1: {
                                                        cryptocurrency: "",
                                                        algorithm: "",
                                                        wallet: "",
                                                        pool: ""
                                                    },
                                                    2: {
                                                        cryptocurrency: "",
                                                        algorithm: "",
                                                        wallet: "",
                                                        pool: ""
                                                    },
                                                    3: {
                                                        cryptocurrency: "",
                                                        algorithm: "",
                                                        wallet: "",
                                                        pool: ""
                                                    }
                                                },
                                            });
                                        } catch (err) {
                                            webSocket.send(JSON.stringify(`Received error while sending GPU SETUP WITH NON FLIGHT SHEET init data. Message: ${err}`));
                                            loggerConsole.error(`Received error while sending GPU SETUP WITH NON FLIGHT SHEET init data. Message: ${err}`)
                                        }
                                    }


                                    const command = new commandInterface('static', { gpus: reformatedGpuSetups }, 'setGpusSettings');
                                    clientsData.app.send(JSON.stringify(command));

                                    // Sending request for start mining
                                    const farmState = await mainDatabase.models.FARM_STATE.findOne()
                                    if (farmState.mining == true) {
                                        clientsData.app.send(JSON.stringify(new commandInterface('static', {}, "startMining")));
                                        loggerConsole.basicInfo("Command startMining sended to app!");
                                    }
                                    break;
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
                const options = {
                    mask: false,
                    binary: false,
                    compress: false
                };
                webSocket.pong('', options);
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