import { staticData } from "../../temp/static.js";
import { ApiError } from "../../error/ApiError.js";

import { mainDatabase } from "../../database/mainDatabase.js"

class StaticDataController {
    static getFullData(req, res, next) { // Reformated + worked
        if (!staticData.gpus || !staticData.cpu || !staticData.motherboard || !staticData.harddrives || !staticData.rams || !staticData.miners) {
            return next(ApiError.noneData("Full data was not received from the server!"))
        }
        res.status(200).json(staticData)

    }
    static async getGPUData(req, res, next) { // Reformated + worked 
        if (!staticData.gpus) {
            return next(ApiError.noneData("GPU data was not received from the server!"))
        }
        
        res.status(200).json({ gpus: staticData.gpus })
    }
    static getCPUData(req, res, next) { // Reformated + worked
        if (!staticData.cpu) {
            return next(ApiError.noneData("CPU data was not received from the server!"))
        }
        res.status(200).json({ cpu: staticData.cpu })
    }
    static getRAMData(req, res, next) { // Reformated + worked
        if (!staticData.rams) {
            return next(ApiError.noneData("RAM data was not received from the server!"))
        }
        res.status(200).json({ rams: staticData.rams })
    }
    static getMotherboardData(req, res, next) { // Reformated + worked
        if (!staticData.motherboard) {
            return next(ApiError.noneData("Motherboard data was not received from the server!"))
        }
        res.status(200).json({ motherboard: staticData.motherboard })
    }
    static getHarddriveData(req, res, next) { // Reformated + worked
        if (!staticData.harddrives) {
            return next(ApiError.noneData("Harddrive data was not received from the server!"))
        }
        res.status(200).json({ harddrives: staticData.harddrives })
    }       
    static getMinersData(req, res, next) { // added + worked
        if (!staticData.miners) {
            return next(ApiError.noneData("Miners data was not received from the server!"))
        }
        res.status(200).json({ miners: staticData.miners })
    }
    static getSystemInfoData(req, res, next) {
        if (!staticData.systemInfo || !staticData.motherboard || !staticData.cpu || !staticData.harddrives) {
            return next(ApiError.noneData("System info was not received from the server!"))
        }
        res.status(200).json({ systemInfo: {
            motherboard: `${staticData.motherboard.information.manufacturer} ${staticData.motherboard.information.productName}`,
            cpu: `${staticData.cpu.information.cores.cpus} x ${staticData.cpu.information.manufacturer} ${staticData.cpu.information.modelName} @ ${staticData.cpu.clocks.maximum}GHz`,
            harddrive: `${staticData.harddrives[0].information.deviceModel} ${staticData.harddrives[0].information.capacity}GB`,
            ...staticData.systemInfo
        }})
    }
    static getCalculationsData(req, res, next) {
        if (!staticData.gpus) {
            return next(ApiError.noneData("GPU data was not received from the server!"))
        }
        res.status(200).json({ calculations: staticData.calculations})
    }
}

export { StaticDataController }
