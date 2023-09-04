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


class CreateController {
    static async createCryptocurrency(req, res, next) {
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
            res.status(201).json({ data: req.body });
        } catch (error) {
            return next(error);
        }
    }
    static async createWallet(req, res, next) {
        // Validate request body
        const { error } = createWalletSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrency_id }})
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
        }
        } catch (err) {
            return next(err);
        }
        
        // Create wallet
        try {
            await mainDatabase.models.WALLETs.create(req.body);
            res.status(201).json({ success: true, msg: 'Wallet created', data: req.body });
        } catch (err) {
            return next(err);
        }
    }
    static async createPool(req, res, next) {
        // Validate request body
        const { error } = createPoolSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrency_id }})
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
        }
        } catch (err) {
            return next(err);
        }
        
        // Create pool
        try {
            await mainDatabase.models.POOLs.create(req.body);
            res.status(200).json({ success: true, msg: 'Pool created', data: req.body });
        } catch (err) {
            return next(err);
        }
    }
    static async createMiner(req, res, next) {
        // Validate request body
        const { error } = createMinerSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Create miner
        try {
            await mainDatabase.models.MINERs.create(req.body);
            res.status(201).json({ success: true, msg: 'Miner created', data: req.body });
        } catch (err) {
            return next(err);
        }
    }
    static async createGPUPreset(req, res, next) {
        // Validate request body
        const { error } = createGPUPresetSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const gpu = await mainDatabase.models.GPUs.findOne({ where: { id: req.body.gpu_id }})
            if (!gpu) {
                return next(ApiError.noneData('GPU with this id not found'))
            }
        } catch (err) {
            return next(err);
        }
        // Create GPUPreset
        try {
            await mainDatabase.models.GPU_PRESETs.create(req.body);
            res.status(201).json({ success: true, msg: 'GPUPreset created', data: req.body });
        } catch (err) {
            return next(err);
        }
    }
    static async createFlightSheet(req, res, next) {
        // Validate request body
        const { error } = createFlightSheetSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
        const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrency_id }})
        if (!cryptocurrency) {
            return next(ApiError.noneData('Cryptocurrency with this id not found'))
        }
        const miner = await mainDatabase.models.MINERs.findOne({ where: { id: req.body.miner_id }})
        if (!miner) {
            return next(ApiError.noneData('Miner with this id not found'))
        }
        const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: req.body.wallet_id }})
        if (!wallet) {
            return next(ApiError.noneData('Wallet with this id not found'))
        }
        const pool = await mainDatabase.models.POOLs.findOne({ where: { id: req.body.pool_id }})
        if (!pool) {
            return next(ApiError.noneData('Pool with this id not found'))
        }    
        } catch (err) {
            return next(err);
        }
        
        // Create GPUPreset
        try {
            await mainDatabase.models.FLIGHT_SHEETs.create(req.body);
            res.status(201).json({ success: true, msg: 'FlightSheet created', data: req.body });
        } catch (err) {
            return next(err);
        }
    }
}

export { CreateController };
