import Joi from "joi";

const setGpusSettingsSchema = Joi.object({
    gpus: Joi.array().items(
        Joi.object({
            uuid: Joi.string().min(64).max(64).required(),
            overclock: Joi.object({
                clockType: Joi.string().valid('custom', 'auto', 'semiauto').required(),
                autofan: Joi.boolean().required(),
                coreClockOffset: Joi.number().allow(null).required(),
                memoryClockOffset: Joi.number().allow(null).required(),
                fanSpeed: Joi.number().allow(null).required(),
                powerLimit: Joi.number().allow(null).required(),
                criticalTemp: Joi.number().allow(null).required()
            }),
            crypto: Joi.object({
                cryptoType: Joi.string().valid('custom', 'auto').required(),
                coin: Joi.string().allow(null).required(),
                algorithm: Joi.string().allow(null).required(),
                wallet: Joi.string().allow(null).required(),
                pool: Joi.string().allow(null).required(),
                miner: Joi.string().required()
            })
        })
    ).required()
});
const rebootSchema = Joi.object({
    startupDelay: Joi.number().required(),
});

export {
    setGpusSettingsSchema,
    rebootSchema
}