import Joi from "joi";

const staticDataCM = Joi.object({
    gpus: Joi.array().allow(null, []).items(
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
                minimalCore: Joi.number().required(),
                enforcedCore: Joi.number().required(),
                maximumCore: Joi.number().required(),
                minimalCoreOffset: Joi.number().required(),
                maximumCoreOffset: Joi.number().required(),
                enforcedCoreOffset: Joi.number().required(),
                minimalMemory: Joi.number().required(),
                enforcedMemory: Joi.number().required(),
                maximumMemory: Joi.number().required(),
                minimalMemoryOffset: Joi.number().required(),
                maximumMemoryOffset: Joi.number().required(),
                enforcedMemoryOffset: Joi.number().required()
            }).required()
        }).required()
    ).required(),
    cpu: Joi.object({
        uuid: Joi.string().alphanum().min(64).max(64).required(),
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
    ).required(),
    systemInfo: Joi.object({
        linux: Joi.string().required(),
        technologies: Joi.object({
            versions: Joi.object({
                opencl: Joi.string().required(),
                cuda: Joi.string().required(),
            }).required(),
        }).required(),
        drivers: Joi.object({
            versions: Joi.object({
                amd: Joi.string().required(),
                nvidia: Joi.string().required()
            }).required(),
        }).required(),
        minuxVersion: Joi.string().required(),
        localIp: Joi.string().required(),
        macAddress: Joi.string().required()
    }).required(),
});

export {
    staticDataCM
}