// Validations
import {
    createCryptocurrencySchema,
    createWalletSchema,
    createPoolSchema,
    createMinerSchema,
    createGPUPresetSchema,
    createFlightSheetSchema,
} from "../../validation/endpoints/create.js";

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";
import { loggerConsole } from "../../utils/logger.js";

class CreateController {
    static async createCryptocurrency(req, res, next) { // Reformated + worked
        
        // Validate request body
        const { error } = createCryptocurrencySchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Find or create the related algorithm
        try {
            // Check if the algorithm exists
            const algorithm = await mainDatabase.models.ALGORITHMs.findOne({
                where: { id: req.body.algorithmId },
            })
            if (!algorithm) {
                return next(ApiError.badRequest('Algorithm not found.'));
            }
            // Create cryptocurrency
            await mainDatabase.models.CRYPTOCURRENCIEs.create({
                name: req.body.name,
                full_name: req.body.fullName,
                algorithm_id: req.body.algorithmId,
            });
            res.status(201).json();
        } catch (error) {
            return next(error);
        }
    }
    static async createWallet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createWalletSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId }})
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
        }
        } catch (err) { 
            return next(err);
        }
        
        // Create wallet
        try {
            await mainDatabase.models.WALLETs.create({
                name: req.body.name,
                source: req.body.source,
                address: req.body.address,
                cryptocurrency_id: req.body.cryptocurrencyId
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
    static async createPool(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createPoolSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId }})
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
        }
        } catch (err) {
            return next(err);
        }
        
        // Create pool
        try {
            await mainDatabase.models.POOLs.create({
                host: req.body.host,
                port: req.body.port,
                cryptocurrency_id: req.body.cryptocurrencyId
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
    static async createMiner(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createMinerSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Create miner
        try {
            await mainDatabase.models.MINERs.create({
                name: req.body.name,
                full_name: req.body.fullName
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
    static async createGPUPreset(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createGPUPresetSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Create GPUPreset
        try {
            // Validate foreign keys
            const gpu = await mainDatabase.models.GPUs.findOne({ where: { id: req.body.gpuId }})
            if (!gpu) {
                return next(ApiError.noneData('GPU with this id not found'))
            }
            await mainDatabase.models.GPU_PRESETs.create({
                name: req.body.name,
                memory_clock_offset: req.body.memoryClockOffset,
                core_clock_offset: req.body.coreClockOffset,
                power_limit: req.body.powerLimit,
                crit_temp: req.body.critTemp,
                fan_speed: req.body.fanSpeed,
                gpu_uuid: gpu.uuid
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
    static async createFlightSheet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createFlightSheetSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId }})
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
            }
            const miner = await mainDatabase.models.MINERs.findOne({ where: { id: req.body.minerId }})
            if (!miner) {
                return next(ApiError.noneData('Miner with this id not found'))
            }
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: req.body.walletId }})
            if (!wallet) {
                return next(ApiError.noneData('Wallet with this id not found'))
            }
            const pool = await mainDatabase.models.POOLs.findOne({ where: { id: req.body.poolId }})
            if (!pool) {
                return next(ApiError.noneData('Pool with this id not found'))
            }    
        } catch (err) {
            return next(err);
        }
        
        // Create FlightSheets
        try {
            await mainDatabase.models.FLIGHT_SHEETs.create({
                name: req.body.name,
                cryptocurrency_id: req.body.cryptocurrencyId,
                miner_id: req.body.minerId,
                wallet_id: req.body.walletId,
                pool_id: req.body.poolId,
                additional_string: req.body.additionalString
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
}

export { CreateController };
