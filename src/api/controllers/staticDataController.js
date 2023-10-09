import { staticData } from "../../temp/static.js";
import { ApiError } from "../../error/ApiError.js";
import { clientsData } from "../../temp/clients.js";
import { commandInterface } from "../../classes/commands.js";
import { loggerConsole } from '../../utils/logger.js';
import { sequelize } from '#src/sequelizeInstance.js'
import _ from 'lodash'

class StaticDataController {
    static getFullData(req, res, next) { // Reformated + worked
        if (!staticData.gpus || !staticData.cpu || !staticData.motherboard || !staticData.harddrives || !staticData.rams || !staticData.miners) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("Full data was not received from the server!"))
        }
        res.status(200).json(staticData)

    }
    static async getGPUData(req, res, next) { // Reformated + worked 
        if (!staticData.gpus) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("GPU data was not received from the server!"))
        }
        
        const dbGpus = await sequelize.models.GPUs.findAll();
        const transformedGpus = _.compact(staticData.gpus.map(staticGpu => {
            const dbGpu = dbGpus.find(v => v.dataValues.uuid === staticGpu.uuid)
            if (dbGpu === undefined) return null
            return { ...staticGpu, id: dbGpu.id }
        }))
        res.status(200).json({ gpus: transformedGpus })
    }
    static getCPUData(req, res, next) { // Reformated + worked
        if (!staticData.cpu) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("CPU data was not received from the server!"))
        }
        res.status(200).json({ cpu: staticData.cpu })
    }
    static getRAMData(req, res, next) { // Reformated + worked
        if (!staticData.rams) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("RAM data was not received from the server!"))
        }
        res.status(200).json({ rams: staticData.rams })
    }
    static getMotherboardData(req, res, next) { // Reformated + worked
        if (!staticData.motherboard) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("Motherboard data was not received from the server!"))
        }
        res.status(200).json({ motherboard: staticData.motherboard })
    }
    static getHarddriveData(req, res, next) { // Reformated + worked
        if (!staticData.harddrives) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("Harddrive data was not received from the server!"))
        }
        res.status(200).json({ harddrives: staticData.harddrives })
    }       
    static getMinersData(req, res, next) { // added + worked
        if (!staticData.miners) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("Miners data was not received from the server!"))
        }
        res.status(200).json({ miners: staticData.miners })
    }
    static getSystemInfoData(req, res, next) {
        if (!staticData.systemInfo || !staticData.motherboard || !staticData.cpu || !staticData.harddrives) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            loggerConsole.basicInfo("Command getSystemInfo sended to app!") 
            return next(ApiError.noneData("System info was not received from the server!"))
        }
        res.status(200).json({ systemInfo: {
            motherboard: `${staticData.motherboard.information.manufacturer} ${staticData.motherboard.information.productName}`,
            cpu: `${staticData.cpu.information.cores.cpus} x ${staticData.cpu.information.manufacturer} ${staticData.cpu.information.modelName}`,
            harddrive: `${staticData.harddrives[0].information.deviceModel} ${staticData.harddrives[0].information.capacity}GB`,
            ...staticData.systemInfo
        }})
    }
    static getCalculationsData(req, res, next) {
        if (!staticData.gpus) {
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(new commandInterface('static',{}, "getSystemInfo")))
            }
            return next(ApiError.noneData("GPU data was not received from the server!"))
        }
        res.status(200).json({ calculations: staticData.calculations})
    }
}

export { StaticDataController }
