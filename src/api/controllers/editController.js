// Validations
import {
    editCryptocurrencySchema,
    editWalletSchema,
    editPoolSchema,
    editMinerSchema,
    editGPUPresetSchema,
    editFlightSheetSchema,
    editGPUSetupSchema
} from '../../validation/endpoints/edit.js'

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";
import { clientsData } from '../../temp/clients.js';
import { commandInterface } from '../../classes/commands.js';

class EditController {
    static async editCryptocurrency(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = editCryptocurrencySchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Editing cryptocurrency
        try {
            // Check if cryptocurrency exists
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: {id: req.body.id} })
            if (cryptocurrency) {
                if (req.body.newName || req.body.newFullName || req.body.newAlgorithmId) {
                    // If new name
                    if (req.body.newName) {
                        cryptocurrency.name = req.body.newName
                    }
                    // If new full name
                    if (req.body.newFullName) {
                        cryptocurrency.full_name = req.body.newFullName
                    }
                    // If new algorithm
                    if (req.body.newAlgorithmId) {
                        // Check FK
                        const algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: {id: req.body.newAlgorithmId}})
                        if (!algorithm) {
                            return next(ApiError.badRequest(`Couldn't find algorithm with id ${req.body.newAlgorithmId}`))
                        }
                        cryptocurrency.algorithm_id = req.body.newAlgorithmId
                    }
                    cryptocurrency.save().then(() => res.status(200).json())
                } else {
                    return next(ApiError.badRequest("There are no new parameters"))
                }
            } else {
                return next(ApiError.noneData("Cryptocurrency not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editWallet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = editWalletSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Editing wallet
        try {
            // Check if wallet exists
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: {id: req.body.id} })
            if (wallet) {
                if (req.body.newName || req.body.newSource || req.body.newAddress || req.body.newCryptocurrencyId) {
                    // If new name
                    if (req.body.newName) {
                        wallet.name = req.body.newName
                    }
                    // If new source
                    if (req.body.newSource) {
                        wallet.source = req.body.newSource
                    }
                    // If new address
                    if (req.body.newAddress) {
                        wallet.address = req.body.newAddress
                    }
                    // If new cryptocurrency id
                    if (req.body.newCryptocurrencyId) {
                        // Check FK
                        const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({where: {id: req.body.newCryptocurrencyId}})
                        if (!cryptocurrency) {
                            return next(ApiError.badRequest(`Couldn't find cryptocurrency with id ${req.body.newCryptocurrencyId}`))
                        }
                        wallet.cryptocurrency_id = req.body.newCryptocurrencyId
                    }
                    wallet.save().then(() => res.status(200).json())
                } else {
                    return next(ApiError.badRequest("There are no new parameters"))
                }
                
            } else {
                return next(ApiError.noneData("Wallet not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editPool(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = editPoolSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Editing pool
        try {
            // Check if pool exists
            const pool = await mainDatabase.models.POOLs.findOne({ where: {id: req.body.id}})
            if (pool) {
                if (req.body.newHost || req.body.newPort || req.body.newCryptocurrencyId) {
                    // If new host
                    if (req.body.newHost) {
                        pool.host = req.body.newHost
                    }
                    // If new port
                    if (req.body.newPort) {
                        pool.port = req.body.newPort
                    }
                    // If new cryptocurrency id
                    if (req.body.newCryptocurrencyId) {
                        // Check FK
                        const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({where: {id: req.body.newCryptocurrencyId}})
                        if (!cryptocurrency) {
                            return next(ApiError.badRequest(`Couldn't find cryptocurrency with id ${req.body.newCryptocurrencyId}`))
                        }
                        pool.cryptocurrency_id = req.body.newCryptocurrencyId
                    }
                    pool.save().then(() => res.status(200).json())
                }
                else {
                    return next(ApiError.badRequest("There are no new parameters"))
                }
            } else {
                return next(ApiError.noneData("Pool not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editMiner(req, res, next) { // Reformated  + worked
        // Validate request body
        const { error } = editMinerSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Editing miner
        try {
            const miner = await mainDatabase.models.MINERs.findOne({where: {id: req.body.id}})
            if (miner) {
                if (req.body.newName || req.body.newFullName) {
                    if (req.body.newName) {
                        miner.name = req.body.newName
                    }
                    if (req.body.newFullName) {
                        miner.full_name = req.body.newFullName
                    }
                    miner.save().then(() => res.status(200).json())
                } else {
                    return next(ApiError.badRequest("There are no new parameters"))
                }
            } else {
                return next(ApiError.noneData("Miner not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editGPUPreset(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = editGPUPresetSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Editing GPU preset
        try {
            // Check if gpu preset exists
            const gpu_preset = await mainDatabase.models.GPU_PRESETs.findOne({ where: {id: req.body.id}})
            if (gpu_preset) {
                if (req.body.newMemoryClock || req.body.newCoreClock || req.body.newPowerLimit || req.body.newCritTemp || req.body.newFanSpeed ) {
                    // If new memory clock
                    if (req.body.newMemoryClock) {
                        gpu_preset.memory_clock = req.body.newMemoryClock
                    }
                    // If new core clock
                    if (req.body.newCoreClock) {
                        gpu_preset.core_clock = req.body.newCoreClock
                    }
                    // If new power limit
                    if (req.body.newPowerLimit) {
                        gpu_preset.power_limit = req.body.newPowerLimit
                    }
                    // If new crit temp
                    if (req.body.newCritTemp) {
                        gpu_preset.crit_temp = req.body.newCritTemp
                    }
                    // If new fan speed
                    if (req.body.newFanSpeed) {
                        gpu_preset.fan_speed = req.body.newFanSpeed
                    }
                    gpu_preset.save().then(() => res.status(200).json())
                } else {
                    return next(ApiError.badRequest("There are no new parameters"))
                }
            } else {
                return next(ApiError.noneData("GPU preset not found"))
            }
        } catch (err) {
            return next(err)
        }
    }
    static async editGPUSetup(req, res, next) {
        // Validate request body
        const { error } = editGPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Editing gpu setup
        try {
            const gpuSetup = await mainDatabase.models.GPU_SETUPs.findOne({where: {id: req.body.id}});
            if (gpuSetup === null) {
                throw new Error('gpu setup with id is not found')
            }
            // If new memory clock
            if (req.body.newMemoryClock) {
                gpuSetup.memory_clock = req.body.newMemoryClock;
            }
            // If new core clock
            if (req.body.newCoreClock) {
                gpuSetup.core_clock = req.body.newCoreClock;
            }
            // If new power limit
            if (req.body.newPowerLimit) {
                gpuSetup.power_limit = req.body.newPowerLimit;
            }
            // If new fan speed
            if (req.body.newFanSpeed) {
                gpuSetup.fan_speed = req.body.newFanSpeed;
            }
            // If new flight sheet id
            if (req.body.newFlightSheetId) {
                gpuSetup.flight_sheet_id = req.body.newFlightSheetId;
            }
            // If new crit temp
            if (req.body.newCritTemp) {
                gpuSetup.crit_temp = req.body.newCritTemp;
            }
            if (clientsData.app) {
                let cryptocurrency, miner, wallet, pool, algorithm;
                const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: { id: gpuSetup.flight_sheet_id } });
                if (gpuSetup.flight_sheet_id !== null && flightSheet === null) {
                    throw new Error('flight sheet with this id does not exist')
                }
                if (flightSheet) {
                    cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: flightSheet.cryptocurrency_id } });
                    miner = await mainDatabase.models.MINERs.findOne({ where: { id: flightSheet.miner_id } });
                    wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: flightSheet.wallet_id } });
                    pool = await mainDatabase.models.POOLs.findOne({ where: { id: flightSheet.pool_id } });
                    if (cryptocurrency) {
                        algorithm = await mainDatabase.models.ALGORITHMs.findOne({ where: { id: cryptocurrency.algorithm_id } });
                    }
                }
                clientsData.app.send(JSON.stringify(new commandInterface('static',{
                    gpus: [{
                        uuid: gpuSetup.dataValues.gpu_uuid,
                        overclock: {
                            clockType: "custom",
                            autofan: false,
                            coreClock: gpuSetup.core_clock,
                            memoryClock: gpuSetup.memory_clock,
                            fanSpeed: gpuSetup.fan_speed,
                            powerLimit: gpuSetup.power_limit,
                            criticalTemp: gpuSetup.crit_temp,
                        },
                        crypto: {
                            cryptoType: "custom",
                            coin: cryptocurrency ? cryptocurrency.name : null,
                            algorithm: algorithm ? algorithm.name : null,
                            wallet: wallet ? wallet.address : null,
                            pool: pool ? `${pool.host}:${pool.port}` : null,
                            miner: miner ? miner.name : null,
                        }
                    }]
                }, "setGpusSettings")))
            }
            await gpuSetup.save();
            res.sendStatus(200)
        } catch (error) {
            return next(error)
        }
    }
    static async editFlightSheet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = editFlightSheetSchema.validate(req.body)
        if (error) { 
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Editing flight sheet
        try {
            // Check if flight sheet exists
            const flight_sheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: {id: req.body.id} })
            if (flight_sheet) {
                if (req.body.newName || req.body.newCryptocurrencyId ||req.body.newMinerId || req.body.newWalletId || req.body.newPoolId) {
                    // If new name
                    if (req.body.newName) {
                        flight_sheet.name = req.body.newName
                    }
                    // If new cryptocurrency id
                    if (req.body.newCryptocurrencyId) {
                        // Check FK
                        const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: {id: req.body.newCryptocurrencyId}})
                        if (!cryptocurrency) {
                            return next(ApiError.badRequest(`Couldn't find cryptocurrency with id ${req.body.newCryptocurrencyId}`))
                        }
                        flight_sheet.cryptocurrency_id = req.body.newCryptocurrencyId
                    }
                    // If new miner id
                    if (req.body.newMinerId) {
                        // Check FK
                        const miner = await mainDatabase.models.MINERs.findOne({ where : {id: req.body.newMinerId}})
                        if (!miner) {
                            return next(ApiError.badRequest(`Couldn't find miner with id ${req.body.newMinerId}`))
                        }
                        flight_sheet.miner_id = req.body.newMinerId
                    }
                    // If new wallet id
                    if (req.body.newWalletId) {
                        // Check FK
                        const wallet = await mainDatabase.models.WALLETs.findOne({where: {id: req.body.newWalletId}})
                        if (!wallet) {
                            return next(ApiError.badRequest(`Couldn't find wallet with id ${req.body.newWalletId}`))
                        }
                        flight_sheet.wallet_id = req.body.newWalletId
                    }
                    // If new pool id
                    if (req.body.newPoolId) {
                        const pool = await mainDatabase.models.POOLs.findOne({where: {id: req.body.newPoolId}})
                        if (!pool) {
                            return next(ApiError.badRequest(`Couldn't find pool with id ${req.body.newPoolId}`))
                        }
                        flight_sheet.pool_id = req.body.newPoolId
                    }
                    flight_sheet.save().then(() => res.status(200).json())
                }
                else {
                    return next(ApiError.badRequest("There are no new parameters"))
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