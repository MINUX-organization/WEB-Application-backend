import Joi from "joi";

const getGPUSetupSchema = Joi.object({
    gpuId: Joi.string().required(),
});
const getGPUPresetsSchema = Joi.object({
    gpuId: Joi.string().required(),
});
const getCPUSetupSchema = Joi.object({
    cpuId: Joi.string().required(),
});

export { 
    getGPUSetupSchema, 
    getGPUPresetsSchema, 
    getCPUSetupSchema 
};
