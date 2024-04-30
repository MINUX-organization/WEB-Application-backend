// Validations
import {
    createCryptocurrencySchema,
    createWalletSchema,
    createPoolSchema,
    createMinerSchema,
    createGPUPresetSchema,
    createFlightSheetSchema,
    createFlightSheetWithCustomMinerSchema,
    createFlightSheetWithCPUSchema,
    createFlightSheetMultipleSchema
} from "../../validation/endpoints/create.js";

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";
import { loggerConsole } from "../../utils/logger.js";

class CreateController {
    static async Cryptocurrency(req, res, next) { // Reformated + worked

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
    static async Wallet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createWalletSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId } })
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
    static async Pool(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createPoolSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId } })
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
    static async Miner(req, res, next) { // Reformated + worked
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
    static async GPUPreset(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createGPUPresetSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Create GPUPreset
        try {
            // Validate foreign keys
            const gpu = await mainDatabase.models.GPUs.findOne({ where: { id: req.body.gpuId } })
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
    static async FlightSheet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = createFlightSheetSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId } })
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
            }
            const miner = await mainDatabase.models.MINERs.findOne({ where: { id: req.body.minerId } })
            if (!miner) {
                return next(ApiError.noneData('Miner with this id not found'))
            }
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: req.body.walletId } })
            if (!wallet) {
                return next(ApiError.noneData('Wallet with this id not found'))
            }
            const pool = await mainDatabase.models.POOLs.findOne({ where: { id: req.body.poolId } })
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
    static async FlightSheetWithCustomMiner(req, res, next) {
        const { error } = createFlightSheetWithCustomMinerSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        try {
            await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.create({
                name: req.body.name,
                installation_url: req.body.installationURL,
                wallet: req.body.wallet,
                pool: req.body.poolURL,
                coin: req.body.coin,
                algorithm: req.body.algorithm,
                pool_template: req.body.poolTemplate,
                wallet_and_worker_template: req.body.walletAndWorkerTemplate,
                password: req.body.password,
                extra_config_arguments: req.body.extraConfigArguments
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
    static async FlightSheetWithCPU(req, res, next) {
        const { error } = createFlightSheetWithCPUSchema.validate(req.body)
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Validate foreign keys
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.cryptocurrencyId } })
            if (!cryptocurrency) {
                return next(ApiError.noneData('Cryptocurrency with this id not found'))
            }
            const miner = await mainDatabase.models.MINERs.findOne({ where: { id: req.body.minerId } })
            if (!miner) {
                return next(ApiError.noneData('Miner with this id not found'))
            }
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: req.body.walletId } })
            if (!wallet) {
                return next(ApiError.noneData('Wallet with this id not found'))
            }
            const pool = await mainDatabase.models.POOLs.findOne({ where: { id: req.body.poolId } })
            if (!pool) {
                return next(ApiError.noneData('Pool with this id not found'))
            }
        } catch (err) {
            return next(err);
        }
        // Create FlightSheets
        try {
            await mainDatabase.models.FLIGHT_SHEETs_WITH_CPU.create({
                name: req.body.name,
                cryptocurrency_id: req.body.cryptocurrencyId,
                miner_id: req.body.minerId,
                wallet_id: req.body.walletId,
                pool_id: req.body.poolId,
                additional_string: req.body.additionalString,
                huge_pages: req.body.hugePages,
                config_file: req.body.configFile
            });
            res.status(201).json();
        } catch (err) {
            return next(err);
        }
    }
    static async FlightSheetMupltiple(req, res, next) {
        const { error } = createFlightSheetMultipleSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        try {
            const { name, additionalString, minerId, configs } = req.body;
            // Check
            const miner = await mainDatabase.models.MINERs.findByPk(minerId);
            if (!miner) {
                return next(ApiError.noneData(`Unable to find miner with id ${minerId}`));
            }
            const existingFlightSheetMultiple = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.findOne({
                where: {
                    name: name
                }
            });
            if (existingFlightSheetMultiple) {
                return next(ApiError.badRequest(`Flight sheet with name <${existingFlightSheetMultiple.name}> already exist!`))
            }   
            // Creating main table
            const flightSheetMultiple = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.create({
                name: name,
                additional_string: additionalString,
                miner_id: minerId
            });
            // Creating intermediate table
            for (const config of configs) {
                const { cryptocurrencyId, walletId, poolId } = config;

                const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findByPk(cryptocurrencyId);
                if (!cryptocurrency) {
                    return next(ApiError.noneData(`Unable to find cryptocurrency with id ${cryptocurrencyId}`));
                }
                const wallet = await mainDatabase.models.WALLETs.findByPk(walletId);
                if (!wallet) {
                    return next(ApiError.noneData(`Unable to find wallet with id ${walletId}`));
                }
                const pool = await mainDatabase.models.POOLs.findByPk(poolId);
                if (!pool) {
                    return next(ApiError.noneData(`Unable to find pool with id ${poolId}`));
                }

                await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE_CRYPTOCURRENCIEs.create({
                    flight_sheet_multiple_id: flightSheetMultiple.id,
                    cryptocurrency_id: cryptocurrency.id,
                    wallet_id: wallet.id,
                    pool_id: pool.id
                })
            }
        } catch (err) {
            return next(err);
        }
        res.status(201).json();
    }
}

export { CreateController };
