// Validations
import {
    getCPUSetupSchema,
    getGPUPresetsSchema,
    getGPUSetupSchema,
} from "../../validation/endpoints/otherData.js";

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";


class OtherDataController {
    static async getFullMiners(req, res, next) { // reformated + worked
        // Getting all miners
        try {
            // Check if miners exists
            const miners = await mainDatabase.models.MINERs.findAll();
            if (miners.length == 0) {
                return next(ApiError.noneData("Miners not found"));
            }
            // Reformat response
            const reformatedMiners = []
            miners.forEach(miner => {
                miner = miner.dataValues
                const reformatedMiner = {
                    id: miner.id,
                    name: miner.name,
                    fullName: miner.full_name
                }
                reformatedMiners.push(reformatedMiner)
            })
            // Return
            res.status(200).json({ "miners": reformatedMiners });
        } catch (err) {
            return next(err)
        }
    }
    static async getFullAlgorithms(req, res, next) { // reformated + worked
        // Getting all algorithms
        try {
            // Check if algorithms exists
            const algorithms = await mainDatabase.models.ALGORITHMs.findAll()
            if (algorithms.length == 0) {
                return next(ApiError.noneData("Algorithms not found"))
            }
            // Reformat response
            const reformatedAlgorithms = []
            algorithms.forEach(algorithm => {
                algorithm = algorithm.dataValues
                const reformatedAlgorithm = {
                    id: algorithm.id,
                    name: algorithm.name,
                }
                reformatedAlgorithms.push(reformatedAlgorithm)
            })
            // Return
            res.status(200).json({ "algorithms": reformatedAlgorithms })
        } catch (err) {
            return next(err)
        }
    }
    static async getFullCryptocurrencies(req, res, next) { // reformated + worked
        // Getting all cryptocurrencies
        try {
            // Check if cryptocurrencies exists
            const cryptocurrencies = await mainDatabase.models.CRYPTOCURRENCIEs.findAll();
            if (cryptocurrencies.length == 0) {
                return next(ApiError.noneData("Cryptocurrencies not found"));
            }
            // Reformat response
            const reformatedCryptocurrencies = []
            cryptocurrencies.forEach(cryptocurrency => {
                cryptocurrency = cryptocurrency.dataValues
                const reformatedCryptocurrency = {
                    id: cryptocurrency.id,
                    name: cryptocurrency.name,
                    fullName: cryptocurrency.full_name,
                    algorithmId: cryptocurrency.algorithm_id
                }
                reformatedCryptocurrencies.push(reformatedCryptocurrency)
            })
            // Return
            res.status(200).json({ "cryptocurrencies": reformatedCryptocurrencies })
        } catch (err) {
            return next(err)
        }
    }
    static async getFullWallets(req, res, next) { // reformated + worked
        // Getting all wallets
        try {
            // Check if wallets exist
            const wallets = await mainDatabase.models.WALLETs.findAll();
            if (wallets.length == 0) {
                return next(ApiError.noneData("Wallets not found"));
            }
            // Reformat response
            const reformatedWallets = []
            wallets.forEach(wallet => {
                wallet = wallet.dataValues
                const reformatedWallet = {
                    id: wallet.id,
                    name: wallet.name,
                    source: wallet.source,
                    address: wallet.address,
                    cryptocurrencyId: wallet.cryptocurrency_id
                }
                reformatedWallets.push(reformatedWallet)
            })
            // Return
            res.status(200).json({ "wallets": reformatedWallets });
        } catch (err) {
            return next(err)
        }
    }
    static async getFullPools(req, res, next) { // reformated + worked
        // Getting all pools
        try {
            // Check if pools exists
            const pools = await mainDatabase.models.POOLs.findAll();
            if (pools.length == 0) {
                return next(ApiError.noneData("Pools not found"));
            }
            // Reformat response
            const reformatedPools = []
            pools.forEach(pool => {
                pool = pool.dataValues
                const reformatedPool = {
                    id: pool.id,
                    host: pool.host,
                    port: pool.port,
                    cryptocurrencyId: pool.cryptocurrency_id
                }
                reformatedPools.push(reformatedPool)
            })
            // Return
            res.status(200).json({ "pools": reformatedPools });
        } catch (err) {
            return next(err)
        }
    }
    static async getFullFlightSheets(req, res, next) { // reformated + worked
        // Getting all flight sheets
        try {
            // Check if flight sheets exist
            const flightSheets = await mainDatabase.models.FLIGHT_SHEETs.findAll();
            if (flightSheets.length == 0) {
                return next(ApiError.noneData("Flight Sheets not found"));
            }
            // Reformat response
            const reformatedFlightSheets = []
            flightSheets.forEach(flightSheet => {
                flightSheet = flightSheet.dataValues
                const reformatedFlightSheet = {
                    id: flightSheet.id,
                    name: flightSheet.name,
                    cryptocurrencyId: flightSheet.cryptocurrency_id,
                    minerId: flightSheet.miner_id,
                    walletId: flightSheet.wallet_id,
                    poolId: flightSheet.pool_id
                }
                reformatedFlightSheets.push(reformatedFlightSheet)
            })
            // Return
            res.status(200).json({ "flightSheets": reformatedFlightSheets });
        } catch (err) {
            return next(err)
        }
    }
    static async getGPUSetup(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = getGPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get GPU setup
        try {
            // Check if GPU setup exists
            const gpuSetup = await mainDatabase.models.GPU_SETUP.findOne({ where: { id: req.body.gpuId } });
            if (!gpuSetup) {
                return next(ApiError.noneData("GPU Setup not found"));
            }
            // Reformat response
            const reformatedGpuSetup = {
                id: gpuSetup.id,
                memoryClock: gpuSetup.memory_clock,
                coreClock: gpuSetup.core_clock,
                powerLimit: gpuSetup.power_limit,
                fanSpeed: gpuSetup.fan_speed,
                flightSheetId: gpuSetup.flight_sheet_id,
                gpuUuid: gpuSetup.gpu_uuid
            }
            // Return
            res.status(200).json({ "gpuSetup": reformatedGpuSetup });
        } catch (err) {
            return next(err)
        }
    }
    static async getGPUPresets(req, res, next) { // reformated+ worked
        // Validate request body
        const { error } = getGPUPresetsSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get GPU Presets
        try {
            // Check if gpu presets exists
            const gpuPresets = await mainDatabase.models.GPU_PRESETs.findAll({ where: { id: req.body.gpuId } });
            if (gpuPresets.length == 0) {
                return next(ApiError.noneData("GPU Presets not found"));
            }
            // Reformat response
            const reformatedGpuPresets = []
            gpuPresets.forEach(gpuPreset => {
                gpuPreset = gpuPreset.dataValues
                const reformatedGpuPreset = {
                    id: gpuPreset.id,
                    memoryClock: gpuPreset.memory_clock,
                    coreClock: gpuPreset.core_clock,
                    powerLimit: gpuPreset.power_limit,
                    critTemp: gpuPreset.crit_temp,
                    fanSpeed: gpuPreset.fan_speed,
                    gpuUuid: gpuPreset.gpu_uuid
                }
                reformatedGpuPresets.push(reformatedGpuPreset)
            })
            // Return
            res.status(200).json({  "gpuPresets": reformatedGpuPresets });
        } catch (err) {
            return next(err)
        }
    }
    static async getCPUSetup(req, res, next) { // reformated + worked
        // Validate request body
        const { error } = getCPUSetupSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        // Get CPU setup
        try {
            // Check if cpu setup exists
            const cpuSetup = await mainDatabase.models.CPU_SETUP.findOne({ where: { id: req.body.cpuId } });
            if (!cpuSetup) {
                return next(ApiError.noneData("CPU Setup not found"));
            }
            // Reformat response
            const reformatedCpuSetup = {
                id: cpuSetup.id,
                fanSpeed: cpuSetup.fan_speed,
                cryptocurrencyId: cpuSetup.cryptocurrency_id,
                minerId: cpuSetup.miner_id,
                cpu_uuid: cpuSetup.cpu_uuid
            }
            // Return
            res.status(200).json({ "cpuSetup" : reformatedCpuSetup });
        } catch (err) {
            return next(err)
        }
    }
}

export { OtherDataController };
