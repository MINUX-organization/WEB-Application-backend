import { staticData } from "../../temp/static.js";
import { ApiError } from "../../error/ApiError.js";

import { mainDatabase } from "../../database/mainDatabase.js"

class StaticDataController {
    static getFullData(req, res, next) { // reformated + worked
        if (!staticData.gpus || !staticData.cpu || !staticData.motherboard || !staticData.harddrives || !staticData.rams || !staticData.miners) {
            return next(ApiError.noneData("Full data was not received from the server!"))
        }
        res.status(200).json(staticData)

    }
    static async getGPUData(req, res, next) { // reformated + worked
        if (!staticData.gpus) {
            return next(ApiError.noneData("GPU data was not received from the server!"))
        }
        const updatedGpusData = await Promise.all(staticData.gpus.map(async gpu => {
            const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({where: {gpu_uuid: gpu.uuid}})
            if (gpuSetup) {
                switch (gpuSetup.fan_speed) {
                    case -1:
                        return {...gpu, autoFan: true }
                    default:
                        return {...gpu, autoFan: false }
                }
            }
            else {
                return {...gpu, autoFan: null }
            }
        }))
        res.status(200).json({ gpus: updatedGpusData })
    }
    static getCPUData(req, res, next) { // reformated + worked
        if (!staticData.cpu) {
            return next(ApiError.noneData("CPU data was not received from the server!"))
        }
        res.status(200).json({ cpu: staticData.cpu })
    }
    static getRAMData(req, res, next) { // reformated + worked
        if (!staticData.rams) {
            return next(ApiError.noneData("RAM data was not received from the server!"))
        }
        res.status(200).json({ rams: staticData.rams })
    }
    static getMotherboardData(req, res, next) { // reformated + worked
        if (!staticData.motherboard) {
            return next(ApiError.noneData("Motherboard data was not received from the server!"))
        }
        res.status(200).json({ motherboard: staticData.motherboard })
    }
    static getHarddriveData(req, res, next) { // reformated + worked
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
}

export { StaticDataController }
