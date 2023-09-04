// Validations
import { 
    getGpusSettingsSchema, 
    getGpusWorkingsSchema, 
    setGpusSettingsSchema, 
    rebootSchema  
} from "../../validation/endpoints/commands.js"

import { clientsData } from "../../temp/clients.js";

import { commandInterface } from "../../classes/commands.js";
import { ApiError } from "../../error/ApiError.js";


class CommandController {
    static getStaticInfo(req, res, next) {
        // Send command
        try {
            const command = new commandInterface({}, "getStaticInfo")
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(command)) 
                res.status(200).json({success: true, msg: "getStaticInfo command send successfully!"})
            } else { 
                return next(ApiError.noneData("App is not connected!"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static getGpusSettings(req, res, next) {
        // Validate request body
        const { error } = getGpusSettingsSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Send command
        try {
            const command = new commandInterface(req.body, "getGpusSettings")
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(command))
                res.status(200).json({success: true, msg: "getGpusSettings command send successfully!"})
            } else { 
                return next(ApiError.noneData("App is not connected!"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static getGpusWorking(req, res, next) {
        // Validate request body
        const { error } = getGpusWorkingsSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // send command
        try {
            const command = new commandInterface(req.body, "getGpusWorkings")
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(command))
                res.status(200).json({success: true, msg: "getGpusWorkings command send successfully!"})
            } else { 
                return next(ApiError.noneData("App is not connected!"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static setGpusSettings(req, res, next) {
        // Validate request body
        const { error } = setGpusSettingsSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // send command
        try {
            const command = new commandInterface(req.body, "setGpusSettings")
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(command))
                res.status(200).json({success: true, msg: "setGpusSettings command send successfully!"})
            } else { 
                return next(ApiError.noneData("App is not connected!"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static stopMining(req, res,next) {
        const command = new commandInterface(req.body, "stopMining")
    }
    static startMining(req, res, next) {
        // send command
        try {
            const command = new commandInterface({}, "startMining")
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(command))
                res.status(200).json({success: true, msg: "startMining command send successfully!"})
            } else { 
                return next(ApiError.noneData("App is not connected!"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static reboot(req, res, next) {
        // Validation request body
        const { error } = rebootSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // send command
        try {
            const command = new commandInterface(req.body, "reboot")
            if (clientsData.app) {
                clientsData.app.send(JSON.stringify(command))
                res.status(200).json({success: true, msg: "reboot command send successfully!"})
            } else { 
                return next(ApiError.noneData("App is not connected!"))
            }
        } catch (err) {
            return next(err)
        }
    }
}

export { CommandController }