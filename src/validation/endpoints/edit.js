import Joi from "joi";

const editCryptocurrencySchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{5,30}$")).min(3).max(128).optional(),
    newFullName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{5,30}$")).min(3).max(128).optional(),
    newAlgorithmId: Joi.number().integer().optional()
});
const editWalletSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{5,30}$")).min(3).max(128).optional(),
    newSource: Joi.string().min(3).max(128).optional(),
    newAddress: Joi.string().min(3).max(128).optional(),
    newCryptocurrencyId: Joi.number().integer().optional()
});
const editPoolSchema = Joi.object({
    id: Joi.number().required(),
    newHost: Joi.string().min(3).max(128).optional(),
    newPort: Joi.number().integer().min(1).max(65535).optional(),
    newCryptocurrencyId: Joi.number().integer().optional()
});
const editMinerSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{5,30}$"))().min(3).max(128).optional(),
    newFullName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{5,30}$")).min(3).max(128).optional()
});
const editGPUPresetSchema = Joi.object({
    id: Joi.number().required(),
    newMemoryClock: Joi.number().integer().optional(),
    newCoreClock: Joi.number().integer().optional(),
    newPowerLimit: Joi.number().integer().optional(),
    newCritTemp: Joi.number().integer().optional(),
    newFanSpeed: Joi.number().integer().optional().max(100)
});

const editGPUSetupSchema = Joi.object({
    id: Joi.number().required(),
    newMemoryClock: Joi.number().integer().optional(),
    newCoreClock: Joi.number().integer().optional(),
    newPowerLimit: Joi.number().integer().optional(),
    newFanSpeed: Joi.number().integer().optional().max(100),
    newFlightSheetId: Joi.number().integer().allow(null).optional(),
    newCritTemp: Joi.number().integer().optional()
})

const editFlightSheetSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{5,30}$")).min(3).max(128).optional(),
    newCryptocurrencyId: Joi.number().integer().optional(),
    newMinerId: Joi.number().integer().optional(),
    newWalletId: Joi.number().integer().optional(),
    newPoolId: Joi.number().integer().optional()
});

export {
    editCryptocurrencySchema,
    editWalletSchema,
    editPoolSchema,
    editMinerSchema,
    editGPUPresetSchema,
    editGPUSetupSchema,
    editFlightSheetSchema,
};
