import Joi from "joi";

const dynamicDataCM = Joi.object({
    state: Joi.object({
        mining: Joi.boolean().required(),
    }).required(),
    gpus: Joi.array().allow(null).items(
        Joi.object({
            uuid: Joi.string().alphanum().min(64).max(64).required(),
            temperature: Joi.number().required(),
            fanSpeed: Joi.number().required(),
            powerUsage: Joi.number().required(),
            clocks: Joi.object({
                core: Joi.number().required(),
                memory: Joi.number().required(),
            }),
            memory: Joi.object({
                reserved: Joi.number().required(),
                used: Joi.number().required(),
                free: Joi.number().required(),
            }).required(),
            isMining: Joi.boolean().required(),
            minerUpTime: Joi.string().allow(null).required(),
            miner: Joi.object({
                uuid: Joi.string().allow(null).alphanum().min(64).max(64).required(),
                fullName: Joi.string().allow(null).required(),
            }).required(),
            crypto: Joi.array().min(1).max(3).items(
                Joi.object({
                    algorithm: Joi.string().allow(null).required(),
                    cryptocurrency: Joi.string().allow(null).required(),
                    shares: Joi.object({
                        accepted: Joi.number().required(),
                        rejected: Joi.number().required(),
                    }).required(),
                    hashrate: Joi.object({
                        value: Joi.number().required(),
                        measurement: Joi.string().required()
                    }).required(),
                }).required()
            ).required()

        }).required(),
    ).required(),
    cpu: Joi.object({
        uuid: Joi.string().alphanum().min(64).max(64).required(),
        temperature: Joi.number().required(),
        clockSpeed: Joi.number().required(),
        fanSpeed: Joi.number().required(),
        isMining: Joi.boolean().required(),
        minerUpTime: Joi.string().allow(null).required(),
        hashrate: Joi.object({
            value: Joi.number().allow(null).required(),
            measurement: Joi.string().allow(null).required(),
        }).required(),
        powerUsage: Joi.number().required(),
        algorithm: Joi.string().allow(null).required(),
        cryptocurrency: Joi.string().allow(null).required(),
        miner: Joi.object({
            uuid: Joi.string().allow(null).alphanum().min(64).max(64).required(),
            fullName: Joi.string().allow(null).required(),
        }).required(),
        shares: Joi.object({
            accepted: Joi.number().allow(null).required(),
            rejected: Joi.number().allow(null).required(),
        }).required()
    }).required(),
    harddrives: Joi.array().items(
        Joi.object({
            uuid: Joi.string().alphanum().min(64).max(64).required(),
            temperature: Joi.number().required(),
            capacity: Joi.number().required(),
            free: Joi.object({
                value: Joi.number().required(),
                measurement: Joi.string().required()
            }).required()
        }).required()
    ).required(),
    rams: Joi.array().items(
        Joi.object({
            uuid: Joi.string().alphanum().min(64).max(64).required(),
            free: Joi.object({
                value: Joi.number().required(),
                measurement: Joi.string().required()
            }).required(),
            usage: Joi.object({
                value: Joi.number().required(),
                measurement: Joi.string().required()
            }).required()
        }).required()
    ).required()
})


export {
    dynamicDataCM
}