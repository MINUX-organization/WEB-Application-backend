import Joi from "joi";

const deleteCryptocurrencySchema = Joi.object({
    id: Joi.number().required()
});
const deleteWalletSchema = Joi.object({
    id: Joi.number().required()
});
const deleteMinerSchema = Joi.object({
    id: Joi.number().required()
});
const deletePoolSchema = Joi.object({
    id: Joi.number().required()
});
const deleteGPUPresetSchema = Joi.object({
    id: Joi.number().required()
});
const deleteFlightSheetSchema = Joi.object({
    id: Joi.number().required()
});
const deleteFlightSheetWithCustomMinerSchema = Joi.object({
    id: Joi.number().required()
});
const deleteFlightSheetWithCPUSchema = Joi.object({
    id: Joi.number().required()
});
const deleteFlightSheetMultipleSchema = Joi.object({
    id: Joi.number().required()
});


export {
    deleteCryptocurrencySchema,
    deleteWalletSchema,
    deletePoolSchema,
    deleteMinerSchema,
    deleteGPUPresetSchema,
    deleteFlightSheetSchema,
    deleteFlightSheetWithCustomMinerSchema,
    deleteFlightSheetWithCPUSchema,
    deleteFlightSheetMultipleSchema
};
