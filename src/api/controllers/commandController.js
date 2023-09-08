// Validations
import { 
    setGpusSettingsSchema, 
    rebootSchema  
} from "../../validation/endpoints/commands.js"
// Temp
import { clientsData } from "../../temp/clients.js";
import { commandsData } from "../../temp/commands.js"
// Utils
import { commandInterface } from "../../classes/commands.js";
import { ApiError } from "../../error/ApiError.js";
import { mainDatabase } from "../../database/mainDatabase.js";
// Classes



class CommandController {
    static getSystemInfo(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", {}, "getSystemInfo")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(() => {
            if (commandsData.getSystemInfo != null) {
                commandsData.getSystemInfo = null
                res.status(200).json()
                clearInterval(interval)
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
    static getGpusSettings(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", {}, "getGpusSettings")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(() => {
            if (commandsData.getGpusSettings != null) {
                commandsData.getGpusSettings = null
                res.status(200).json()
                clearInterval(interval)
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
    static getGpusWorking(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", {}, "getGpusWorking")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(() => {
            if (commandsData.getGpusWorking != null) {
                commandsData.getGpusWorking = null
                res.status(200).json()
                clearInterval(interval)
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
    static setGpusSettings(req, res, next) { // Reformated + not tested yet
        // Validate request body
        const { error } = setGpusSettingsSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", req.body, "setGpusSettings")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(() => {
            if (commandsData.setGpusSettings != null) {
                commandsData.setGpusSettings = null
                res.status(200).json()
                clearInterval(interval)
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
    static startMining(req, res, next) { // Reformated + not tested yet 
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", {}, "startMining")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(async () => {
            if (commandsData.startMining != null) {
                commandsData.startMining = null
                // Update farm state in db
                const farmState = await mainDatabase.models.FARM_STATE.findOne()
                if (farmState) {
                    farmState.mining = true
                    await farmState.save()
                }
                else {
                    return next(ApiError.noneData("Unavailable to update farm state!"))
                }
                //
                res.status(200).json()
                clearInterval(interval)
                
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
    static stopMining(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", {}, "stopMining")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(async () => {
            if (commandsData.stopMining != null) {
                commandsData.stopMining = null
                // Update farm state in db
                const farmState = await mainDatabase.models.FARM_STATE.findOne()
                if (farmState) {
                    farmState.mining = false
                    await farmState.save()
                }
                else {
                    return next(ApiError.noneData("Unavailable to update farm state!"))
                }
                //
                res.status(200).json()
                clearInterval(interval)
                
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
    static reboot(req, res, next) { // Reformated + not tested yet
        // Validation request body
        const { error } = rebootSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        // Sending the command
        const command = new commandInterface("static", req.body, "reboot")
        clientsData.app.send(JSON.stringify(command))
        // Check if response to the command exists
        const interval = setInterval(() => {
            if (commandsData.reboot != null) {
                commandsData.reboot = null
                res.status(200).json()
                clearInterval(interval)
            }
        }, 10);
        setTimeout(() => {
            clearInterval(interval)
            return next(ApiError.noneData("No response to the command was received"))
        }, 3000)
    }
}

export { CommandController }