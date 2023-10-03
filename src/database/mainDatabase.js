// Libs
import Sequelize from 'sequelize';
// Dotenv
import dotenv from 'dotenv'
dotenv.config()
// Models
import  initOtherModels  from './models/other.js'
import  initGPUModels  from './models/gpu.js'
import  initCPUModels  from './models/cpu.js'
import  initHarddriveModels  from './models/harddrive.js'
import  initRAMModels from './models/ram.js'
// Temp data
import { staticData } from "../temp/static.js"
import { dynamicData } from '../temp/dynamic.js';
// Utils
import { generateRecoveryCode } from '../utils/generatorRecoveryCodes.js';
import { loggerConsole } from '../utils/logger.js';

class Database {
    constructor() {
        this.db = new Sequelize(
            {
                // logging: msg => loggerConsole.database(msg),
                logging: false,
                database: process.env.DB_NAME,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                dialect: process.env.DB_DIALECT,
                dialectOptions: {
                    useUTC: false, 
                },
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                timezone : process.env.DB_TIMEZONE
            }
        )
    }
    async start() {
        // Start the database
        try {
            // Open connection
            await this.db.authenticate()
            loggerConsole.database('Connection with database is successful!')
            // Init models
            const modelsOthers = initOtherModels(this.db)
            const modelsGPU = initGPUModels(this.db)
            const modelsCPU = initCPUModels(this.db)
            const modelsHarddrive = initHarddriveModels(this.db)
            const modelsRAM = initRAMModels(this.db)
            this.models = {...modelsOthers, ...modelsGPU, ...modelsCPU, ...modelsHarddrive, ...modelsRAM}
            loggerConsole.database('Init models is successful!')
            // Synchronize database
            await this.db.sync({force: false})
            loggerConsole.database('Sync with database is successful!') 
        } catch (error) {
            loggerConsole.error(`Unable to connect with database!:  ${error}`)
            return process.exit(1)
        }
        // Creating starting data
        try {
            // User data (login, password)
            const user = await this.db.models.USER.findOne()
            if (!user) {
                await this.db.models.USER.create()
            }
            // Recovery codes 
            const codes = await this.db.models.RECOVERY_CODEs.findOne()
            if (!codes) {
                for (let amount  = 0; amount < 10; amount++) {
                    await this.db.models.RECOVERY_CODEs.create({code: generateRecoveryCode(), used: false});
                }
            }
            // Farm state
            const farmState = await this.db.models.FARM_STATE.findOne()
            if (!farmState) {
                await this.db.models.FARM_STATE.create()
            }
            loggerConsole.database('Creating starting data is successful!')
        }
        catch (error) {
            loggerConsole.error(e)
        }
    }
    async shutdown() {
        await this.db.close()
    }
    async createStaticData() { 
        for (let key in staticData) {
            switch (key) {
                case 'gpus':
                    try {
                        staticData.gpus.forEach(async gpu => {
                            // Log gpu UUIDs
                            loggerConsole.data(`Received GPU: ${gpu.uuid}`)
                            // Check if gpu is already exists
                            const gpuCheck = await this.db.models.GPUs.findOne({where: {uuid: gpu.uuid}})
                            if (!gpuCheck) {
                                await this.db.models.GPUs.create({uuid: gpu.uuid})
                                .catch(error => loggerConsole.error(`Catched error in creating GPU: ${error}`))
                                // Log creating
                                loggerConsole.data(`Created GPU: ${gpu.uuid}`)
                                // Check if gpu setup is already exists
                                const gpuSetupCheck = await this.db.models.GPU_SETUPs.findOne({where: {gpu_uuid: gpu.uuid}})
                                if (!gpuSetupCheck) {
                                    await this.db.models.GPU_SETUPs.create({gpu_uuid: gpu.uuid})
                                    .catch(error => loggerConsole.error(`Catched error in creating GPU Setup: ${error}`))
                                    // Log creating
                                    loggerConsole.data(`Created GPU Setup: ${gpu.uuid}`)
                                }
                            } else {
                                loggerConsole.data(`GPU ${gpu.uuid} already exists.`)
                            }
                        })
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    
                    break 
                case 'cpu': 
                    try {
                        // Log cpu UUID
                        const cpu = staticData.cpu
                        loggerConsole.data(`Received CPU ${cpu.uuid}`)
                        // Check if cpu is already exists
                        const cpuCheck = await this.db.models.CPUs.findOne({where: {uuid: cpu.uuid}})
                        if (!cpuCheck) {
                            await this.db.models.CPUs.create({uuid: cpu.uuid})
                            .catch(error => loggerConsole.error(`Catched error in creating CPU: ${error}`))
                            // Log creating
                            loggerConsole.data(`Created CPU: ${cpu.uuid}`)
                            // Check if cpu setup is already exists
                            const cpuSetupCheck = await this.db.models.CPU_SETUP.findOne({where: {cpu_uuid: cpu.uuid}})
                            if (!cpuSetupCheck) {
                                await this.db.models.CPU_SETUP.create({cpu_uuid: cpu.uuid})
                                .catch(error => loggerConsole.error(`Catched error in creating CPU Setup: ${error}`))
                                // Log creating
                                loggerConsole.data(`Created CPU Setup: ${cpu.uuid}`)
                            }
                        }
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    break 
                case 'harddrives':
                    try {
                        staticData.harddrives.forEach(async harddrive => {
                            // Log harddrive UUID
                            loggerConsole.data(`Received harddrive: ${harddrive.uuid}`)
                            // Check if harddrive is already exists
                            const harddriveCheck = await this.db.models.HARDDRIVEs.findOne({where: {uuid: harddrive.uuid}})
                            if (!harddriveCheck) {
                                await this.db.models.HARDDRIVEs.create({uuid: harddrive.uuid})
                                .catch(error => loggerConsole.error(`Catched error in creating harddrive: ${error}`))
                                // Log creating
                                loggerConsole.data(`Created harddrive: ${harddrive.uuid}`)
                            } else {
                                loggerConsole.data(`Harddrive ${harddrive.uuid} already exists.`)
                            }
                        })
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    break
                case 'rams':
                    try {
                        staticData.rams.forEach(async ram => {
                            // Log ram UUID
                            loggerConsole.data(`Received ram: ${ram.uuid}`)
                            // Check if harddrive is already exists
                            const ramCheck = await this.db.models.RAMs.findOne({where: {uuid: ram.uuid}})
                            if (!ramCheck) {
                                await this.db.models.RAMs.create({uuid: ram.uuid})
                                .catch(error => loggerConsole.error(`Catched error in creating ram: ${error}`))
                                // Log creating
                                loggerConsole.data(`Created ram: ${ram.uuid}`)
                            } else {
                                loggerConsole.data(`Ram ${ram.uuid} already exists.`)
                            }
                        })
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    break
                // TODO:
                case 'miners' :
                    try {
                        for (const miner of staticData.miners) {
                            const [minerDB, _] = await this.db.models.MINERs.findOrCreate({where: {name: miner.name, full_name: miner.fullName}})
                            loggerConsole.data(`Received miner: ${miner.name}`)
                            // if (!checkMiner) {
                            //     const minerDB = await this.db.models.MINERs.create({where: {name: miner.name, full_name: miner.fullName}})
                            //     loggerConsole.data(`Received miner: ${miner.name}`)
                            // }
                            for (const algorithm of miner.algorithms) {
                                const [algorithmDB, _] = await this.db.models.ALGORITHMs.findOrCreate({where: {name: algorithm}})
                                loggerConsole.data(`Received algorithm: ${algorithm}`)
                                // if (!checkAlgorithm) {
                                //     const algorithmDB = await this.db.models.ALGORITHMs.create({name: algorithm})
                                //     loggerConsole.data(`Received algorithm: ${algorithm}`)
                                // }
                                // if (minerDB && algorithmDB) {
                                    await this.db.models.ALGORITHM_MINER.findOrCreate({where: {miner_id: minerDB.id, algorithm_id: algorithmDB.id}})
                                // }
                            }
                        }
                    }
                    catch (error) {
                        console.log(error)
                    }
                    break
            }
        }
    }
    async createDynamicData() { 
        for (let key in dynamicData) {
            switch (key) {
                case 'gpus':
                    try {
                        dynamicData.gpus.forEach(async gpu => {
                            // Check if gpu exists
                            const checkGpu = await this.db.models.GPUs.findOne({where: {uuid: gpu.uuid}})
                            if (checkGpu) {
                                await this.db.models.GPU_GRAPHs.create({
                                    hashrate: gpu.hashrate.value,
                                    power: gpu.powerUsage,
                                    temp: gpu.temperature,
                                    algorithm: gpu.algorithm,
                                    cryptocurrency: gpu.cryptocurrency,
                                    gpu_uuid: gpu.uuid
                                }).then(()=> {
                                    loggerConsole.data(`Received GPU dynamic data from ${gpu.uuid}`)
                                })
                            } else {
                                loggerConsole.data(`Received unknown GPU in dynamic data: ${gpu.uuid}`)
                            }
                        })
                    } catch (e) {
                        loggerConsole.error(`Catched error in creating gpus dynamic data!: ${e.message}`)
                    }
                    break
                case 'cpu':
                    try {
                        const cpu = dynamicData.cpu
                        // Check if cpu exists
                        const checkCpu = await this.db.models.CPUs.findOne({where: {uuid: cpu.uuid}})
                        if (checkCpu) {
                            await this.db.models.CPU_GRAPHs.create({
                                hashrate: cpu.hashrate.value,
                                power: cpu.powerUsage,
                                temp: cpu.temperature,
                                algorithm: cpu.algorithm,
                                cryptocurrency: cpu.cryptocurrency,
                                cpu_uuid: cpu.uuid
                            }).then(() => {
                                loggerConsole.data(`Received CPU dynamic data from ${cpu.uuid}`)
                            })
                        } else {
                            loggerConsole.data(`Received unknown CPU in dynamic data: ${cpu.uuid}`)
                        }
                    } catch (e) {
                        loggerConsole.error(`Catched error in creating cpus dynamic data!: ${e.message}`)
                    }
                    break
            }
        }
    }
}

const mainDatabase = new Database()
export { mainDatabase }