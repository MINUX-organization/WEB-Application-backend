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
import { loggerConsole } from "../../utils/logger.js";
// Classes



class CommandController {
    static async waitForResponse(command) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearInterval(timeout)
                reject(ApiError.noneData("No response to the command was received"))
            }, 10000)
            const interval = setInterval(() => {
                if (commandsData[command] != null) {
                    const response = commandsData[command]
                    commandsData[command] = null
                    clearInterval(interval)
                    clearTimeout(timeout)
                    resolve(response)
                }
            }, 10)
        })
    }
    static async getSystemInfo(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending command
            const command = new commandInterface("static", {}, "getSystemInfo",)
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            CommandController.waitForResponse(command.command)
                .then(response => {
                    commandsData[command] = null
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
    static async getGpusSettings(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending command
            const command = new commandInterface("static", {}, "getGpusSettings",)
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            await CommandController.waitForResponse(command.command)
                .then(response => {
                    commandsData[command] = null
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
    static async getGpusWorking(req, res, next) { // Reformated + not tested yet
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending command
            const command = new commandInterface("static", {}, "getGpusWorking",)
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            await CommandController.waitForResponse(command.command)
                .then(response => {
                    commandsData[command] = null
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
    static async setGpusSettings(req, res, next) { // Reformated + not tested yet
        // Validate request body
        const { error } = setGpusSettingsSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending command
            const command = new commandInterface("static", req.body, "setGpusSettings",)
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            CommandController.waitForResponse(command.command)
                .then(response => {
                    commandsData[command] = null
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
    static async startMining(req, res, next) { // Reformated + not tested yet 
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending the command
            const command = new commandInterface("static", {}, "startMining")
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            CommandController.waitForResponse(command.command)
                .then(async response => {
                    console.log(response)
                    commandsData[command] = null
                    const farmState = await mainDatabase.models.FARM_STATE.findOne()
                    // Update farmstate
                    if (farmState) {
                        farmState.mining = true
                        await farmState.save()
                    }
                    else {
                        return next(ApiError.noneData("Unavailable to update farm state!"))
                    }
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
    static async stopMining(req, res, next) { // Reformated + not tested yet 
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending the command
            const command = new commandInterface("static", {}, "stopMining");
            clientsData.app.send(JSON.stringify(command));
            // Wait response
            const response = await CommandController.waitForResponse(command.command)
                .then(async response => {
                    // Checking response
                    if (typeof (responseFromCommand) != "boolean") {
                        return next(ApiError.noneData("Cannot sent command!"));
                    }
                    // Update farm state
                    commandsData[command] = null
                    const farmState = await mainDatabase.models.FARM_STATE.findOne()
                    if (!farmState) {
                        return next(ApiError.noneData("Unavailable to update farm state!"))
                    }
                    farmState.mining = false
                    await farmState.save()

                    return response;
                })
                .catch(err => {
                    return next(err)
                })
            console.log(response);
            res.status(200).json(response);
        } catch (err) {
            return next(err)
        }
    }
    static async reboot(req, res, next) { // Reformated + not tested yet
        // Validation request body
        const { error } = rebootSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected!"))
        }
        try {
            // Sending command
            const command = new commandInterface("static", {}, "reboot")
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            await CommandController.waitForResponse(command.command)
                .then(response => {
                    commandsData[command] = null
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
    static async powerOff(req, res, next) {
        // Check if app is running
        if (!clientsData.app) {
            return next(ApiError.noneData("App is not connected"))
        }
        try {
            // Sending command
            const command = new commandInterface("static", req.body, "powerOff")
            clientsData.app.send(JSON.stringify(command))
            // Wait response
            await CommandController.waitForResponse(command.command)
                .then(response => {
                    commandsData[command] = null
                    res.status(200).json(response)
                })
                .catch(err => {
                    return next(err)
                })
        } catch (err) {
            return next(err)
        }
    }
}

export { CommandController }
