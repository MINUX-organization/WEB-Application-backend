import Joi from "joi";

const editCryptocurrencySchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().alphanum().min(3).max(15).optional(),
    newFullName: Joi.string().alphanum().min(3).max(30).optional(),
    newAlgorithmId: Joi.number().integer().optional()
});
const editWalletSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().alphanum().min(3).max(30).optional(),
    newSource: Joi.string().min(3).max(30).optional(),
    newAddress: Joi.string().min(3).max(30).optional(),
    newCryptocurrencyId: Joi.number().integer().optional()
});
const editPoolSchema = Joi.object({
    id: Joi.number().required(),
    newHost: Joi.string().min(3).max(30).optional(),
    newPort: Joi.number().integer().min(1).max(65535).optional(),
    newCryptocurrencyId: Joi.number().integer().optional()
});
const editMinerSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().alphanum().min(3).max(30).optional(),
    newFullName: Joi.string().alphanum().min(3).max(30).optional()
});
const editGPUPresetSchema = Joi.object({
    id: Joi.number().required(),
    newMemoryClock: Joi.number().integer().optional(),
    newCoreClock: Joi.number().integer().optional(),
    newPowerLimit: Joi.number().integer().optional(),
    newCritTemp: Joi.number().integer().optional(),
    newFanSpeed: Joi.number().integer().optional().max(100)
});
const editFlightSheetSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().alphanum().min(3).max(30).optional(),
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
    editFlightSheetSchema,
};
