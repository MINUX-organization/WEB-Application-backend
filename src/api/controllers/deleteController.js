// Validations
import {
    deleteCryptocurrencySchema,
    deleteWalletSchema,
    deletePoolSchema,
    deleteMinerSchema,
    deleteGPUPresetSchema,
    deleteFlightSheetSchema,
} from "../../validation/endpoints/delete.js";

import { mainDatabase } from '../../database/mainDatabase.js'
import { ApiError } from "../../error/ApiError.js";

class DeleteController {
    static async deleteCryptocurrency(req, res, next) {
        // Validate request body
        const { error } = deleteCryptocurrencySchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete cryptocurrency
        try {
            const cryptocurrency = await mainDatabase.models.CRYPTOCURRENCIEs.findOne({where: req.body});
            if (cryptocurrency) {
                // Delete foreign  keys
                const deletedPools = await mainDatabase.models.POOLs.destroy({where: {cryptocurrency_id: cryptocurrency.id}});
                const deletedWallets = await mainDatabase.models.WALLETs.destroy({where: {cryptocurrency_id: cryptocurrency.id}});
                //
                const numDeletedRows = await mainDatabase.models.CRYPTOCURRENCIEs.destroy({where: req.body, limit: 1});
                if (numDeletedRows === 1) {
                    res.status(200).json({ success: true, msg: 'Cryptocurrency deleted', data: req.body});
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
    static async deleteWallet(req, res, next) {
        // Validate request body
        const { error } = deleteWalletSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete wallet
        try {
            const wallet = await mainDatabase.models.WALLETs.findOne({where: req.body});
            if (wallet) {
                const numDeletedRows = await mainDatabase.models.WALLETs.destroy({where: req.body, limit: 1});
                if (numDeletedRows === 1) {
                    res.status(200).json({ success: true, msg: 'Wallet deleted', data: req.body });
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
    static async deletePool(req, res, next) {
        // Validate request body
        const { error } = deletePoolSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete pool
        try {
            const pool = await mainDatabase.models.POOLs.findOne({where: req.body});
            if (pool) {
                const numDeletedRows = await mainDatabase.models.POOLs.destroy({where: req.body, limit: 1});
                if (numDeletedRows === 1) {
                    res.status(200).json({ success: true, msg: 'Pool deleted', data: req.body });
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
    static async deleteMiner(req, res, next) {
        // Validate request body
        const { error } = deleteMinerSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete miner
        try {
            const miner = await mainDatabase.models.MINERs.findOne({where: req.body});
            if (miner) {
                // Delete foreign  keys
                const deletedAlgorithms = await mainDatabase.models.ALGORITHMs.destroy({where: {miner_id: miner.id}});
                //
                const numDeletedRows = await mainDatabase.models.MINERs.destroy({where: req.body, limit: 1});
                if (numDeletedRows === 1) {
                    res.status(200).json({ success: true, msg: 'Miner deleted', data: req.body });
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
    static async deleteGPUPreset(req, res, next) {
        // Validate request body
        const { error } = deleteGPUPresetSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete GPU preset
        try {
            const gpuPreset = await mainDatabase.models.GPU_PRESETs.findOne({where: req.body});
            if (gpuPreset) {
                const numDeletedRows = await mainDatabase.models.GPU_PRESETs.destroy({where: req.body, limit: 1});
                if (numDeletedRows === 1) {
                    res.status(200).json({ success: true, msg: 'GPU preset deleted', data: req.body });
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
    static async deleteFlightSheet(req, res, next) {
        // Validate request body
        const { error } = deleteFlightSheetSchema.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error.details[0].message))
        }
        // Delete flight sheet
        try {
            const flightSheet = await mainDatabase.models.FLIGHT_SHEETs.findOne({where: req.body});
            if (flightSheet) {
                // Validate foreign keys
                const flightSheetId = flightSheet.id;
                const gpu_setups = await mainDatabase.models.GPU_SETUP.findAll({
                    where: {flight_sheet_id: flightSheetId}
                })
                if (gpu_setups.length != 0) {
                    res.status(405).json({ success: false, msg: 'Flight sheet is tied to some GPU_SETUPs', data: gpu_setups })
                }
                //
                const numDeletedRows = await mainDatabase.models.FLIGHT_SHEETs.destroy({where: req.body, limit: 1});
                if (numDeletedRows === 1) {
                    res.status(200).json({ success: true, msg: 'Flight sheet deleted', data: req.body });
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
}

export { DeleteController }