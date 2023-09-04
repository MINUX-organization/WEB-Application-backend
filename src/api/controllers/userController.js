// Validations
import {
    loginSchema,
    editNameSchema,
    editPasswordSchema,
    recoveryPasswordSchema
} from '../../validation/endpoints/user.js'

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";


class UserController {
    static async userInfo(req, res, next) { // reformated
        try {
            // Check if user exists
            const user = await mainDatabase.models.USER.findOne()
            if (!user) {
                return next(ApiError.noneData("User not found"))
            }
            res.status(200).json({
                "username": user.name
            })
        } catch (err) {
            return next(err)
        }
    }
    static async login(req, res, next) { // TODO: session
        //  Validate request body
        const { error } = loginSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Check if user exist
        try {
            const user = await mainDatabase.models.USER.findOne()
            // Check login and password
            if (user.name != req.body.name || user.password != req.body.password) {
                return res.status(200).json({ success: false, msg: "Incorrect username or password.", data: req.body })
            }
            res.status(200).json({ success: true, msg: "Logged in successfully.", data: req.body })
        }
        catch (err) {
            return next(err)
        }

    }
    static async editName(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = editNameSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Edit user name
        try {
            const user = await mainDatabase.models.USER.findOne()
            user.name = req.body.newName
            user.save().then(() => {
                res.status(200).json()
            })
        } catch (err) {
            return next(err)
        }
    }
    static async editPassword(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = editPasswordSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Edit user password
        try {
            const user = await mainDatabase.models.USER.findOne()
            // Check old password 
            if (user.password != req.body.oldPassword) {
                return next(ApiError.badRequest("Incorrect old password"))
            }
            // Set password to new
            user.password = req.body.newPassword
            user.save().then(() => {
                res.status(200).json()
            })
        } catch (err) {
            return next(err)
        }
    }
    static async getRecoveryCodes(req, res, next) { // reformated + worked
        // Find all recovery codes
        const recoveryCodes = await mainDatabase.models.RECOVERY_CODEs.findAll()
        // Check if recovery codes exist
        if (!recoveryCodes) {
            return next(ApiError.noneData("Recovery codes not found!"))
        }
        // Reformat response
        const reformatedRecoveryCodes = []
        recoveryCodes.forEach((recoveryCode) => {
            recoveryCode = recoveryCode.dataValues
            const reformatedRecoveryCode = {
                id: recoveryCode.id,
                code: recoveryCode.code,
                used: recoveryCode.used
            }
            reformatedRecoveryCodes.push(reformatedRecoveryCode)
        })
        // Return
        try {
            res.status(200).json({ recoveryCodes: reformatedRecoveryCodes })
        }
        catch (error) {
            return next(err)
        }
    }
    static async recoveryPassword(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = recoveryPasswordSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Recovery user password
        try {
            const recoveryCode = await mainDatabase.models.RECOVERY_CODEs.findOne({ where: { code: req.body.code } })
            // Check if recovery code correct
            if (!recoveryCode) {
                return next(ApiError.badRequest("Incorrect recovery code!"))
            }
            // Check if recovery code used
            if (recoveryCode.used === true) {
                return next(ApiError.badRequest("Recovery code already used!"))
            }
            // Change user password and set recovery code to used
            const user = await mainDatabase.models.USER.findOne()
            user.password = req.body.newPassword
            user.save().then(() => {
                recoveryCode.used = true
                recoveryCode.save().then(() => {
                    res.status(200).json()
                })
            })
        }
        catch (err) {
            return next(err)
        }
    }
}

export { UserController } 