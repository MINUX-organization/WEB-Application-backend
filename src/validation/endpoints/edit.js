import Joi from "joi";

const editCryptocurrencySchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newFullName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newAlgorithmId: Joi.number().integer().optional()
});
const editWalletSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
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
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newFullName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional()
});
const editGPUPresetSchema = Joi.object({
    id: Joi.number().required(),
    newMemoryClockOffset: Joi.number().integer().optional(),
    newCoreClockOffset: Joi.number().integer().optional(),
    newPowerLimit: Joi.number().integer().optional(),
    newCritTemp: Joi.number().integer().optional(),
    newFanSpeed: Joi.number().integer().optional().min(0).max(100)
});

const editGPUSetupSchema = Joi.object({
    id: Joi.number().required(),
    newMemoryClockOffset: Joi.number().integer().optional(),
    newCoreClockOffset: Joi.number().integer().optional(),
    newPowerLimit: Joi.number().integer().optional(),
    newFanSpeed: Joi.number().integer().optional().min(0).max(100),
    newFlightSheetId: Joi.number().integer().allow(null).optional(),
    newCritTemp: Joi.number().integer().optional()
})

const editFlightSheetSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newCryptocurrencyId: Joi.number().integer().optional(),
    newMinerId: Joi.number().integer().optional(),
    newWalletId: Joi.number().integer().optional(),
    newPoolId: Joi.number().integer().optional(),
    newAdditionalString: Joi.string().optional().allow("")
});

const editFlightSheetWithCustomMinerSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newInstallationURL: Joi.string().optional(),
    newWallet: Joi.string().optional(),
    newPoolURL: Joi.string().optional(),
    newCoin: Joi.string().optional(),
    newAlgorithm: Joi.string().optional(),
    newPoolTemplate: Joi.string().optional(),
    newWalletAndWorkerTemplate: Joi.string().optional(),
    newPassword: Joi.string().optional().allow(""),
    newExtraConfigArguments: Joi.string().optional().allow(""),
});

const editFlightSheetWithCPUSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newCryptocurrencyId: Joi.number().integer().optional(),
    newMinerId: Joi.number().integer().optional(),
    newWalletId: Joi.number().integer().optional(),
    newPoolId: Joi.number().integer().optional(),
    newAdditionalString: Joi.string().optional().allow(""),
    newHugePages: Joi.number().integer().positive().optional(),
    newConfigFile: Joi.string().optional().allow(""),
});

const editFlightSheetMultipleSchema = Joi.object({
    id: Joi.number().required(),
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-]{3,128}$")).optional(),
    newAdditionalString: Joi.string().optional().allow(""),
    newMinerId: Joi.number().integer().optional(),
    newConfigs: Joi.array().min(1).max(3).items(
        Joi.object({
            cryptocurrencyId: Joi.number().integer().required(),
            walletId: Joi.number().integer().required(),
            poolId: Joi.number().integer().required()
        }).required()
    ).required()
});

export {
    editCryptocurrencySchema,
    editWalletSchema,
    editPoolSchema,
    editMinerSchema,
    editGPUPresetSchema,
    editGPUSetupSchema,
    editFlightSheetSchema,
    editFlightSheetWithCustomMinerSchema,
    editFlightSheetWithCPUSchema,
    editFlightSheetMultipleSchema
};
