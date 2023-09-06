import Joi from "joi";

const createCryptocurrencySchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    fullName: Joi.string().alphanum().min(3).max(30).required(),
    algorithmId: Joi.number().integer().required(),
});
const createWalletSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    source: Joi.string().min(3).max(30).required(),
    address: Joi.string().min(3).max(30).required(),
    cryptocurrencyId: Joi.number().integer().required(),
});
const createPoolSchema = Joi.object({
    host: Joi.string().min(3).max(30).required(),
    port: Joi.number().integer().min(1).max(65535).required(),
    cryptocurrencyId: Joi.number().integer().required(),
});
const createMinerSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().alphanum().min(3).max(30).required()
});
const createGPUPresetSchema = Joi.object({
    memoryClock: Joi.number().integer().required(),
    coreClock: Joi.number().integer().required(),
    powerLimit: Joi.number().integer().required(),
    critTemp: Joi.number().integer().required(),
    fanSpeed: Joi.number().integer().required().min(0).max(100),
    gpuId: Joi.number().integer().required(),
});
const createFlightSheetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    cryptocurrencyId: Joi.number().integer().required(),
    minerId: Joi.number().integer().required(),
    walletId: Joi.number().integer().required(),
    poolId: Joi.number().integer().required(),
});

export {
    createCryptocurrencySchema,
    createWalletSchema,
    createPoolSchema,
    createMinerSchema,
    createGPUPresetSchema,
    createFlightSheetSchema,
};
