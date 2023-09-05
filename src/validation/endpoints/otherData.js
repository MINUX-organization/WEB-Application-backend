import Joi from "joi";

const getGPUSetupSchema = Joi.object({
    gpuId: Joi.number().required(),
});
const getGPUPresetsSchema = Joi.object({
    gpuId: Joi.number().required(),
});
const getCPUSetupSchema = Joi.object({
    cpuId: Joi.number().required(),
});

export { 
    getGPUSetupSchema, 
    getGPUPresetsSchema, 
    getCPUSetupSchema 
};
