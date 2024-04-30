// Validations
import {
    deleteCryptocurrencySchema,
    deleteWalletSchema,
    deletePoolSchema,
    deleteMinerSchema,
    deleteGPUPresetSchema,
    deleteFlightSheetSchema,
    deleteFlightSheetWithCustomMinerSchema,
    deleteFlightSheetWithCPUSchema,
    deleteFlightSheetMultipleSchema
} from "../../validation/endpoints/delete.js";

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";
import { clientsData } from "../../temp/clients.js";
import { commandInterface } from "../../classes/commands.js";

class DeleteController {
    static async Cryptocurrency(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = deleteCryptocurrencySchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete cryptocurrency    
        try {
            // Check if cryptocurrency exists
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({ where: { id: req.body.id } });
            if (cryptocurrency) {
                // Delete foreign  keys
                const flightSheets = await mainDatabase.models.FLIGHT_SHEETs.findAll({ where: { cryptocurrency_id: cryptocurrency.id } });
                if (flightSheets.length > 0) {
                    for (const flightSheet of flightSheets) {
                        const gpuSetups = await mainDatabase.models.GPU_SETUPs.findAll({ where: { flight_sheet_id: flightSheet.id } });
                        if (gpuSetups.length > 0) {
                            for (const gpuSetup of gpuSetups) {
                                await gpuSetup.update({ flight_sheet_id: null })
                            }
                        }
                        await flightSheet.destroy();
                    }
                }
                const pools = await mainDatabase.models.POOLs.findAll({ where: { cryptocurrency_id: cryptocurrency.id } });
                if (pools.length > 0) {
                    for (const pool of pools) {
                        await pool.destroy();
                    }
                }
                const wallets = await mainDatabase.models.WALLETs.findAll({ where: { cryptocurrency_id: cryptocurrency.id } });
                if (wallets.length > 0) {
                    for (const wallet of wallets) {
                        await wallet.destroy();
                    }
                }
                // Delete cryptocurrency
                const deletedCryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.destroy({ where: { id: req.body.id } });
                if (deletedCryptocurrency === 1) {
                    res.status(200).json();
                } else {
                    throw new Error('Could not delete cryptocurrency');
                }
            } else {
                return next(ApiError.noneData('Cryptocurrency not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    static async Wallet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = deleteWalletSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete wallet
        try {
            // Check if wallet exists
            const wallet = await mainDatabase.models.WALLETs.findOne({ where: { id: req.body.id } });
            if (wallet) {
                // Delete FK
                const flightSheetsWithWallet = await mainDatabase.models.FLIGHT_SHEETs.findAll({ where: { wallet_id: wallet.id } })
                if (flightSheetsWithWallet.length > 0) {
                    for (const flightSheetWithWallet of flightSheetsWithWallet) {
                        await flightSheetWithWallet.update({ wallet_id: null })
                    }
                }
                // Delete wallet
                const deletedWallet = await mainDatabase.models.WALLETs.destroy({ where: { id: req.body.id } });
                if (deletedWallet === 1) {
                    res.status(200).json();
                } else {
                    throw new Error('Could not delete wallet');
                }
            } else {
                return next(ApiError.noneData('Wallet not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    static async Pool(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = deletePoolSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete pool
        try {
            // Check if pool exists
            const pool = await mainDatabase.models.POOLs.findOne({ where: { id: req.body.id } });
            if (pool) {
                // Delete FK
                const flightSheetsWithPool = await mainDatabase.models.FLIGHT_SHEETs.findAll({ where: { pool_id: pool.id } })
                if (flightSheetsWithPool.length > 0) {
                    for (const flightSheetWithPool of flightSheetsWithPool) {
                        await flightSheetWithPool.update({ pool_id: null })
                    }
                }
                // Delete pool
                const deletedPool = await mainDatabase.models.POOLs.destroy({ where: { id: req.body.id } });
                if (deletedPool === 1) {
                    res.status(200).json();
                } else {
                    throw new Error('Could not delete pool');
                }
            } else {
                return next(ApiError.noneData('Pool not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    static async Miner(req, res, next) { // Reformated + not tested yet
        // Validate request body
        const { error } = deleteMinerSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete miner
        try {
            // Check if miner exists
            const miner = await mainDatabase.models.MINERs.findOne({ where: { id: req.body.id } });
            if (miner) {
                // Delete FK
                const algorithmLinks = await mainDatabase.models.ALGORITHM_MINER.findAll({ where: { miner_id: miner.id } })
                if (algorithmLinks.length > 0) {
                    for (const link of algorithmLinks) {
                        await link.destroy()
                    }
                }
                // Delete miner
                const deletedMiner = await mainDatabase.models.MINERs.destroy({ where: { id: req.body.id } });
                if (deletedMiner === 1) {
                    res.status(200).json();
                } else {
                    throw new Error('Could not delete miner');
                }
            } else {
                return next(ApiError.noneData('Miner not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    static async GPUPreset(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = deleteGPUPresetSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete GPU preset
        try {
            // Check if GPU preset exists
            const gpuPreset = await mainDatabase.models.GPU_PRESETs.findOne({ where: req.body });
            if (gpuPreset) {
                //
                const deletedGpuPreset = await mainDatabase.models.GPU_PRESETs.destroy({ where: req.body, limit: 1 });
                if (deletedGpuPreset === 1) {
                    res.status(200).json();
                } else {
                    throw new Error('Could not delete GPU preset');
                }
            } else {
                return next(ApiError.noneData('GPU preset not found'));
            }
        } catch (error) {
            return next(error);
        }

    }
    static async FlightSheet(req, res, next) { // Reformated + worked
        // Validate request body
        const { error } = deleteFlightSheetSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete flight sheet
        try {
            // Check if flight sheet exists
            const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({ where: { id: req.body.id } });
            if (flightSheet) {
                // Delete FK
                const gpuSetupsWithFlightSheet = await mainDatabase.models.GPU_SETUPs.findAll({ where: { flight_sheet_id: flightSheet.id } })
                if (gpuSetupsWithFlightSheet) {
                    for (const gpuSetupWithFlightSheet of gpuSetupsWithFlightSheet) {
                        await gpuSetupWithFlightSheet.update({ flight_sheet_id: null })
                    }
                }
                // Delete flight sheet
                const deletedFlightSheet = await mainDatabase.models.FLIGHT_SHEETs.destroy({ where: { id: req.body.id } });
                if (deletedFlightSheet === 1) {
                    res.status(200).json();
                } else {
                    throw new Error('Could not delete flight sheet');
                }
            } else {
                return next(ApiError.noneData('Flight sheet not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    static async FlightSheetWithCustomMiner(req, res, next) {
        const { error } = deleteFlightSheetWithCustomMinerSchema.validate(req.body);

        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        try {
            const flightSheetWithCustomMiner = await mainDatabase.models.FLIGHT_SHEETs_WITH_CUSTOM_MINER.findByPk(req.body.id);

            if (!flightSheetWithCustomMiner) {
                return next(ApiError.noneData('Could not find flight sheet with that id!'));
            }

            const GPUSetups = await mainDatabase.models.GPU_SETUPs.findAll({
                where: {
                    flight_sheet_id_with_custom_miner: flightSheetWithCustomMiner.id
                }
            });

            if (!clientsData.app) {
                return next(ApiError.noneData("App is not connected!"))
            }

            for (const GPUSetup of GPUSetups) {
                GPUSetup.isCustomMiner = false;
                GPUSetup.flight_sheet_id_with_custom_miner = null;
                await GPUSetup.save()
                clientsData.app.send(JSON.stringify(new commandInterface('static', {
                    gpus: [{
                        uuid: GPUSetup.dataValues.gpu_uuid,
                        overclock: {
                            clockType: "custom",
                            autofan: false,
                            coreClockOffset: GPUSetup.core_clock_offset,
                            memoryClockOffset: GPUSetup.memory_clock_offset,
                            fanSpeed: GPUSetup.fan_speed,
                            powerLimit: GPUSetup.power_limit,
                            criticalTemp: GPUSetup.crit_temp,
                        },
                        crypto: {
                            cryptoType: "custom",
                            coin: "",
                            algorithm: "",
                            wallet: "",
                            pool: "",
                            miner: "",
                            additionalString: ""
                        }
                    }]
                }, "setGpusSettings")))

            }

            await flightSheetWithCustomMiner.destroy().then(() => {
                res.status(200).json();
            });

        } catch (error) {
            return next(error);
        }
    }
    static async FlightSheetWithCPU(req, res, next) {
        const { error } = deleteFlightSheetWithCPUSchema.validate(req.body);

        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        };

        try {
            const existingFlightSheetWithCPU = await mainDatabase.models.FLIGHT_SHEETs_WITH_CPU.findByPk(req.body.id);
            if (!existingFlightSheetWithCPU) {
                return next(ApiError.noneData($`Couldn't find flight sheet with id ${req.body.id}`))
            }
            const cpuSetups = await mainDatabase.models.CPU_SETUPs.findAll({ where: { flight_sheet_id: existingFlightSheetWithCPU.id } })
            for (const cpuSetup of cpuSetups) {
                await cpuSetup.update({ flight_sheet_id: null })
            }

            await existingFlightSheetWithCPU.destroy().then(() => {
                res.status(200).json();
            });
        }
        catch (error) {
            return next(error);
        }
    }
    static async FlightSheetMupltiple(req, res, next) {
        const { error } = deleteFlightSheetMultipleSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message));
        }
        const { id } = req.body;
        try {
            const existingFlightSheetMultiple = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE.findByPk(id);
            if (!existingFlightSheetMultiple) {
                return next(ApiError.badRequest(`Cannot find flight sheet with id ${id}`));
            }
            // Deleting FK
            const existingsLinks = await mainDatabase.models.FLIGHT_SHEETs_MULTIPLE_CRYPTOCURRENCIEs.findAll({
                where: {
                    flight_sheet_multiple_id: existingFlightSheetMultiple.id
                }
            });
            for (const existingLink of existingsLinks) {
                await existingLink.destroy();
            }
            // Deleting main table
            await existingFlightSheetMultiple.destroy();
            res.status(200).json();
        } catch (err) {
            return next(err);
        }
    }
}

export { DeleteController }