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
    static async userInfo(req, res,next) { // reformated
        try {
            const user = await mainDatabase.models.USER.findOne()
            if (!user) {
                return next(ApiError.noneData("User not found"))
            }
            res.status(200).json({
                "username" : user.name
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
        // check if user exist
        try {
            const user = await mainDatabase.models.USER.findOne()
            if (user.name != req.body.name || user.password != req.body.password) {
                return res.status(200).json({success: false, msg: "Incorrect username or password.", data: req.body})
            }
            res.status(200).json({success: true, msg: "Logged in successfully.", data: req.body})
            }
            catch (err) {
                return next(err)
        }
        
    }
    static async editName(req, res, next) { // reformated
        // Validate request body
        const { error } = editNameSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // edit user name
        try {
            const user = await mainDatabase.models.USER.findOne()
            user.name = req.body.new_name
            user.save().then(() => { 
                res.status(200).json()
            })
        } catch (err) {
            return next(err)
        }
    }
    static async editPassword(req, res, next) { // reformated
        // Validate request body
        const { error } = editPasswordSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // edit user password
        try {
            const user = await mainDatabase.models.USER.findOne()
            if (user.password!= req.body.old_password) {
                return next(ApiError.badRequest("Incorrect old password"))
            }
            user.password = req.body.new_password
            user.save().then(() => { 
                res.status(200).json()
            })
        } catch (err) {
            return next(err)
        }
    }
    static async getRecoveryCodes(req, res, next) { // reformated
        const recoveryCodes = await mainDatabase.models.RECOVERY_CODEs.findAll()
        if (!recoveryCodes) {
            return next(ApiError.noneData("Recovery codes not found!"))
        }
        try {
            res.status(200).json({recoveryCodes})
        }
        catch (error) {
            return next(err)
        }
    }
    static async recoveryPassword(req, res, next) { // reformated
        // Validate request body
        const { error } = recoveryPasswordSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // recovery user password
        try {
            const recoveryCode = await mainDatabase.models.RECOVERY_CODEs.findOne({where: {code: req.body.code}})
            if (!recoveryCode) {
                return next(ApiError.badRequest("Incorrect recovery code!"))
            }
            if (recoveryCode.used === true) {
                return next(ApiError.badRequest("Recovery code already used!"))
            }
            const user = await mainDatabase.models.USER.findOne()
            user.password = req.body.new_password
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