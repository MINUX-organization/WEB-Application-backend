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
            this.models = {...modelsOthers, ...modelsGPU, ...modelsCPU, ...modelsHarddrive}
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
            loggerConsole.database('Creating starting data is successful!')
        }
        catch (error) {
            loggerConsole.error(e)
        }
    }
    async close() {
        await this.db.close()
    }
    async createStaticData() { 
        for (let key in staticData) {
            switch (key) {
                case 'gpu':
                    try {
                        const checkUUID = /^[a-f0-9]{64}$/i
                        staticData.gpu.forEach(async element => {
                            if (element.uuid) {
                                loggerConsole.basicInfo(`Received GPU UUID on DB: ${element.uuid}, checkForUUID: ${checkUUID.test(element.uuid)}`)
                                this.db.models.GPUs.findOne({where: {uuid: element.uuid}})
                                .then(async isFoundUUID => {
                                    if (checkUUID.test(element.uuid) && !isFoundUUID) {
                                        const gpu = await this.db.models.GPUs.create({
                                            uuid: element.uuid
                                        })
                                        .catch(error => loggerConsole.error(`Catched error in creating GPU: ${error}`))
                                        const gpuSetup = await this.db.models.GPU_SETUP.create({
                                            gpu_uuid: element.uuid
                                        })
                                        .catch(error => loggerConsole.error(`Catched error in creating GPU_SETUP: ${error}`))
                                        
                                    }
                                })
                            }
                        })
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    
                    break 
                case 'cpu': 
                    try {
                        const checkUUID = /^[a-f0-9]{64}$/i
                        const cpuUUID = staticData.cpu.uuid
                        if (cpuUUID) {
                            loggerConsole.basicInfo(`Received CPU UUID on DB: ${cpuUUID}, checkForUUID: ${checkUUID.test(cpuUUID)}`)
                            this.db.models.CPUs.findOne({where: {uuid: cpuUUID}})
                            .then(async isFoundUUID => {
                                if (checkUUID.test(cpuUUID) && !isFoundUUID) {
                                    await this.db.models.CPUs.create({
                                        uuid: cpuUUID
                                    })
                                    .catch(error => loggerConsole.error(`Catched error in creating CPU: ${error}`))
                                    await this.db.models.CPU_SETUP.create(
                                        {
                                            cpu_uuid: cpuUUID
                                        }
                                    )
                                    .catch(error => loggerConsole.error(`Catched error in creating CPU_SETUP: ${error}`))
                                }
                            })
                        }
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    break
                case 'harddrive':
                    try {
                        staticData.harddrive.forEach(async element => {
                            const checkUUID = /^[a-f0-9]{64}$/i
                            loggerConsole.basicInfo(`Received HardDrive UUID on DB: ${element.uuid}, checkForUUID: ${checkUUID.test(element.uuid)}`)
                            this.db.models.HARDDRIVEs.findOne({where: {uuid: element.uuid}})
                            .then(async isFoundUUID => {
                                if (checkUUID.test(element.uuid) && !isFoundUUID) {
                                    await this.db.models.HARDDRIVEs.create({
                                        uuid: element.uuid
                                    })
                                    .catch(error => loggerConsole.error(`Catched error in creating HardDrive: ${error}`))
                                }
                            })
                        })
                    }
                    catch (e) {
                        loggerConsole.error(e)
                    }
                    break
                case 'miners' :
                    try {
                        staticData.miners.forEach(async miner => {
                            const checkMiner = await this.db.models.MINERs.findOne({where: {name: miner.name, full_name: miner.fullName}})
                            if (!checkMiner) {
                                const minerDB = await this.db.models.MINERs.create({
                                    name: miner.name,
                                    full_name: miner.fullName
                                })
                                loggerConsole.data(`Received miner: ${miner.name}`)
                            }
                            miner.algorithms.forEach(async algorithm => {
                                console.log(algorithm)
                                const checkAlgorithm = await this.db.models.ALGORITHMs.findOne({where: {name: algorithm}})
                                if (!checkAlgorithm) {
                                    loggerConsole.data(`Received algorithm: ${algorithm}`)
                                    await this.db.models.ALGORITHMs.create({
                                        name: algorithm
                                    })
                                }
                            })
                        })
                    }
                    catch (e) {
                        loggerConsole.error(
                            `Catched error in creating miners: ${e.message}`
                        )
                    }
                    break
            }
        }
    }
    async createDynamicData() { 
        for (let key in dynamicData) {
            switch (key) {
                case 'gpu':
                    const checkUUID = /^[a-f0-9]{64}$/i
                    try {
                        if (!dynamicData.gpus) {
                            throw new Error('Invalid dynamic data!')
                        }
                        if (dynamicDataDB.gpu.length === 0) {
                            dynamicData.gpus.forEach(element => {
                                if (!checkUUID.test(element.uuid)) {
                                    throw new Error("Invalid UUID!")
                                }
                                const gpu = new gpuData(element)
                                dynamicDataDB.gpu.push(gpu)
                                dynamicDataDB.gpuAmountDataReceived++
                            })
                        }
                        else if (dynamicDataDB.gpu.length > 0 && dynamicDataDB.gpu.length < 12) {
                            
                        }
                        else {
                            dynamicDataDB.clearData()
                        }
                    }
                    catch (err) {
                        loggerConsole.error(`Error in DB dynamicData: ${err}`)
                    }
                    break
                case 'cpu':
                    break
                case 'harddrive':
                    break
                case 'ram':
                    break
            }
        }
    }
}

const mainDatabase = new Database()
export { mainDatabase }