import Joi from "joi";

const staticDataCM = Joi.object({
    gpus: Joi.array().items(
        Joi.object({
            uuid: Joi.string().alphanum().min(64).max(64).required(),
            information: Joi.object({
                manufacturer: Joi.string().required(),
                periphery: Joi.string().required(),
                driverVersion: Joi.string().required(),
                technology: Joi.object({
                    version: Joi.string().required(),
                    name: Joi.string().required(),
                }).required(),
                serialNumber: Joi.string().required(),
                pci: Joi.object({
                    busId: Joi.string().required(),
                    pciBusId: Joi.number().required().allow(null),
                }).required(),
            }).required(),
            temperature: Joi.object({
                maximumCritical: Joi.number().required(),
                enforcedCritical: Joi.number().required(),
            }).required(),
            memory: Joi.object({
                total: Joi.number().required(),
            }).required(),
            power: Joi.object({
                defaultLimit: Joi.number().required(),
                enforcedLimit: Joi.number().required(),
                minimal: Joi.number().required().allow(null),
                maximum: Joi.number().required().greater(Joi.ref('minimal')),
            }).required(),
            clocks: Joi.object({
                minimalCore: Joi.number().required().allow(null),
                enforcedCore: Joi.number().required(),
                maximumCore: Joi.number().required(),
                minimalMemory: Joi.number().required().allow(null),
                enforcedMemory: Joi.number().required(),
                maximumMemory: Joi.number().required(),
            }).required()
        }).required()
    ).required(),
    cpu: Joi.object({
        information: Joi.object({
            manufacturer: Joi.string().required(),
            modelName: Joi.string().required(),
            architecture: Joi.string().required(),
            opModes: Joi.string().required(),
            cores: Joi.object({
                cpus: Joi.number().required(),
                threadsPerCore: Joi.number().required(),
                threadsPerSocket: Joi.number().required(),
                sockets: Joi.number().required(),
            }).required(),
            cache: Joi.object({
                L1: Joi.number().required().allow(null),
                L2: Joi.number().required().allow(null),
                L3: Joi.number().required().allow(null)
            }).required(),
        }).required(),
        clocks: Joi.object({
            maximum: Joi.number().required().allow(null),
            minimum: Joi.number().required().less(Joi.ref('maximum')),
        }).required(),
    }).required(),
    motherboard: Joi.object({
        information: Joi.object({
            manufacturer: Joi.string().required(),
            productName: Joi.string().required(),
            serialNumber: Joi.string().required(),
        }).required(),
        slots: Joi.object({
            sata: Joi.number().required().allow(null),
            pci: Joi.number().required().allow(null),
            ram: Joi.object({
                type: Joi.string().required(),
                maximumSpeed: Joi.number().required(),
                maximumCapacity: Joi.number().required(),
            }).required(),
        }).required(),
    }).required(),
    harddrives: Joi.array().items(
        Joi.object({
            uuid: Joi.string().alphanum().min(64).max(64).required(),
            information: Joi.object({
                deviceModel: Joi.string().required(),
                serialNumber: Joi.string().required(),
                sataPorts: Joi.string().required(),
                capacity: Joi.number().required(),
            }).required()
        }).required()
    ).required(),
    rams: Joi.array().items(
        Joi.object({
            uuid: Joi.string().alphanum().min(64).max(64).required(),
            total: Joi.number().required(),
        }).required()
    ).required(),
    miners: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            fullName: Joi.string().required(),
            algorithms: Joi.array().items(Joi.string()).required()
        }).required()
    ).required()
});

export {
    staticDataCM
}