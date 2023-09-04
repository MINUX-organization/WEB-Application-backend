// Validations
import {
    editCryptocurrencySchema,
    editWalletSchema,
    editPoolSchema,
    editMinerSchema,
    editGPUPresetSchema,
    editFlightSheetSchema
} from '../../validation/endpoints/edit.js'

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";


class EditController {
    static async editCryptocurrency(req, res, next) {
        // Validate request body
        const { error } = editCryptocurrencySchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // editing cryptocurrency
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: req.body })
            if (cryptocurrency) {
                if (req.body.new_name || req.body.new_full_name || req.body.new_algorithm) {
                    if (req.body.new_name) {
                        cryptocurrency.name = req.body.new_name
                    }
                    if (req.body_new_full_name) {
                        cryptocurrency.full_name = req.body.new_full_name
                    }
                    if (req.body_new_algorithm) {
                        cryptocurrency.algorithm = req.body.new_algorithm
                    }
                    cryptocurrency.save().then(() => res.status(200).json({ success : true, msg: "Changes was made", new_data: cryptocurrency }))
                } else {
                    res.status(200).json({ success : false, msg: "No changes was made", data: req.body })
                }
            } else {
                return next(ApiError.noneData("Cryptocurrency not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editWallet(req, res, next) {
        // Validate request body
        const { error } = editWalletSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // editing wallet
        try {
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: req.body })
            if (wallet) {
                if (req.body.new_name || req.body.new_source || req.body.new_address || req.body.new_cryptocurrency_id) {
                    if (req.body.new_name) {
                        wallet.name = req.body.new_name
                    }
                    if (req.body.new_source) {
                        wallet.source = req.body.new_source
                    }
                    if (req.body.new_address) {
                        wallet.address = req.body.new_address
                    }
                    if (req.body.new_cryptocurrency_id) {
                        wallet.cryptocurrency_id = req.body.new_cryptocurrency_id
                    }
                    wallet.save().then(() => res.status(200).json({ success : true, msg: "Changes was made", data: req.body }))
                } else {
                    res.status(200).json({ success : false, msg: "No changes was made", new_data: wallet })
                }
                
            } else {
                return next(ApiError.noneData("Wallet not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editPool(req, res, next) {
        // Validate request body
        const { error } = editPoolSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // editing pool
        try {
            const pool = await mainDatabase.models.POOLs.findOne({ where: req.body})
            if (pool) {
                if (req.body.new_host || req.body.new_port || req.body.new_cryptocurrency_id) {
                    if (req.body.new_host) {
                        pool.host = req.body.new_host
                    }
                    if (req.body.new_port) {
                        pool.port = req.body.new_port
                    }
                    if (req.body.new_cryptocurrency_id) {
                        pool.cryptocurrency_id = req.body.new_cryptocurrency_id
                    }
                    pool.save().then(() => res.status(200).json({ success : true, msg: "Changes was made", data: req.body }))
                }
                else {
                    res.status(200).json({ success : false, msg: "No changes was made", new_data: pool })
                }
            } else {
                return next(ApiError.noneData("Pool not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editMiner(req, res, next) {
        // Validate request body
        const { error } = editMinerSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // editing miner
        try {
            if (req.body.new_name || req.body.new_full_name) {

            } else {
                res.status(200).json({ success : false, msg: "No changes was made", data: req.body })
            }

        } catch (err) {
            return next(err)
        }
    }
    static async editGPUPreset(req, res, next) {
        // Validate request body
        const { error } = editGPUPresetSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // editing GPU preset
        try {
            const gpu_preset = await mainDatabase.models.GPU_PRESETs.findOne({ where: req.body})
            if (gpu_preset) {
                if (req.body.new_memory_clock || req.body.new_core_clock || req.body.new_power_limit || req.body.new_crit_temp || req.body.new_fan_speed ) {
                    if (req.body.new_memory_clock) {
                        gpu_preset.memory_clock = req.body.new_memory_clock
                    }
                    if (req.body.new_core_clock) {
                        gpu_preset.core_clock = req.body.new_core_clock
                    }
                    if (req.body.new_power_limit) {
                        gpu_preset.power_limit = req.body.new_power_limit
                    }
                    if (req.body.new_crit_temp) {
                        gpu_preset.crit_temp = req.body.new_crit_temp
                    }
                    if (req.body.new_fan_speed) {
                        gpu_preset.fan_speed = req.body.new_fan_speed
                    }
                    gpu_preset.save().then(() => res.status(200).json({ success : true, msg: "Changes was made", new_data: gpu_preset }))
                } else {
                    res.status(200).json({ success : false, msg: "No changes was made", data: req.body })
                }
            } else {
                return next(ApiError.noneData("GPU preset not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editFlightSheet(req, res, next) {
        // Validate request body
        const { error } = editFlightSheetSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // editing flight sheet
        try {
            const flight_sheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: req.body })
            if (flight_sheet) {
                if (req.body.new_name || req.body.new_cryptocurrency_id ||req.body.new_miner_id || req.body.new_wallet_id || req.body.new_pool_id) {
                    if (req.body.new_name) {
                        flight_sheet.name = req.body.new_name
                    }
                    if (req.body.new_cryptocurrency_id) {
                        flight_sheet.cryptocurrency_id = req.body.new_cryptocurrency_id
                    }
                    if (req.body.new_miner_id) {
                        flight_sheet.miner_id = req.body.new_miner_id
                    }
                    if (req.body.new_wallet_id) {
                        flight_sheet.wallet_id = req.body.new_wallet_id
                    }
                    if (req.body.new_pool_id) {
                        flight_sheet.pool_id = req.body.new_pool_id
                    }
                    flight_sheet.save().then(() => res.status(200).json({ success : true, msg: "Changes was made",new_data: flight_sheet }))
                }
                else {
                    res.status(200).json({ success : false, msg: "No changes was made", data: req.body })
                }
            }
            else {
                return next(ApiError.noneData("Flight sheet not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
}

export { EditController }