// Validations
import {
    getCPUSetupSchema,
    getGPUPresetsSchema,
    getGPUSetupSchema,
} from "../../validation/endpoints/otherData.js";

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";


class OtherDataController {
    static async getFullMiners(req, res, next) {
        // getting all miners
        try {
            const miners = await mainDatabase.models.MINERs.findAll();
            if (miners.length == 0) {
                return next(ApiError.noneData("Miners not found"));
            }
            res.status(200).json({success: true, msg: "Miners found", data: miners});
        } catch (err) {
            return next(err)
        }
    }
    static async getFullAlgorithms(req, res, next) {
        // getting all algorithms
        try {
            const algorithms = await mainDatabase.models.ALGORITHMs.findAll();
            console.log(algorithms);
            if (algorithms.length == 0) {
                return next(ApiError.noneData("Algorithms not found"));
            }
            res.status(200).json({success: true, msg: "Algorithms found", data: algorithms});
        } catch (err) {
            return next(err)
        }
    }
    static async getFullCryptocurrencies(req, res, next) {
        // getting all cryptocurrencies
        try {
            const cryptocurrencies = await mainDatabase.models.CRYPTOCURRENCIEs.findAll();
            if (cryptocurrencies.length == 0) {
                return next(ApiError.noneData("Cryptocurrencies not found"));
            }
            res.status(200).json({success: true, msg: "Cryptocurrencies found", data: cryptocurrencies});
        } catch (err) {
            return next(err)
        }
    }
    static async getFullWallets(req, res, next) {
        // getting all wallets
        try {
            const wallets = await mainDatabase.models.WALLETs.findAll();
            if (wallets.length == 0) {
                return next(ApiError.noneData("Wallets not found"));
            }
            res.status(200).json({success: true, msg: "Wallets found", data: wallets});
        } catch (err) {
            return next(err)
        }
    }
    static async getFullPools(req, res, next) {
        // getting all pools
        try {
            const pools = await mainDatabase.models.POOLs.findAll();
            if (pools.length == 0) {
                return next(ApiError.noneData("Pools not found"));
            }
            res.status(200).json({success: true, msg: "Pools found", data: pools});
        } catch (err) {
            return next(err)
        }
    }
    static async getFullFlightSheets(req, res, next) {
        // getting all flight sheets
        try {
            const flightSheets = await mainDatabase.models.FLIGHT_SHEETs.findAll();
            if (flightSheets.length == 0) {
                return next(ApiError.noneData("Flight Sheets not found"));
            }
            res.status(200).json({success: true, msg: "Flight Sheets found", data: flightSheets});
        } catch (err) {
            return next(err)
        }
    }
    static async getGPUSetup(req, res, next) {
        // Validate request body
        const { error } = getGPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get GPU setup
        try {
            const gpuSetup = await mainDatabase.models.GPU_SETUP.findOne({where: {id: req.body.gpuId}});
            if (!gpuSetup) {
                return next(ApiError.noneData("GPU Setup not found"));
            }
            res.status(200).json({success: true, msg: "GPU Setup found", data: gpuSetup});
        } catch (err) {
            return next(err)
        }
    }
    static async getGPUPresets(req, res, next) {
        // Validate request body
        const { error } = getGPUPresetsSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get GPU Presets
        try {
            const gpuPresets = await mainDatabase.models.GPU_PRESETs.findAll({where: {id: req.body.gpuId}});
            if (gpuPresets.length == 0) {
                return next(ApiError.noneData("GPU Presets not found"));
            }
            res.status(200).json({success: true, msg: "GPU Presets found", data: gpuPresets});
        } catch (err) {
            return next(err)
        }
    }
    static async getCPUSetup(req, res, next) {
        // Validate request body
        const { error } = getCPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get CPU setup
        try {
            const cpuSetup = await mainDatabase.models.CPU_SETUP.findOne({where: {id: req.body.cpuId}});
            if (!cpuSetup) {
                return next(ApiError.noneData("CPU Setup not found"));
            }
            res.status(200).json({success: true, msg: "CPU Setup found", data: cpuSetup});
        } catch (err) {
            return next(err)
        }
    }
}

export { OtherDataController };
