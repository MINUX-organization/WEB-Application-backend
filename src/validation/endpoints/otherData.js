import Joi from "joi";

const getGPUSetupSchema = Joi.object({
    gpuSetupId: Joi.number().required(),
});
const getGPUPresetsSchema = Joi.object({
    gpuId: Joi.number().required(),
});
const getCPUSetupSchema = Joi.object({
    cpuId: Joi.number().required(),
});
const editGpusForFlightSheetsSchema = Joi.object({
    gpusForFlightSheets: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        flightSheetId: Joi.number().allow(null).required()
    })).required()
})

export { 
    getGPUSetupSchema, 
    getGPUPresetsSchema, 
    getCPUSetupSchema,
    editGpusForFlightSheetsSchema
};
