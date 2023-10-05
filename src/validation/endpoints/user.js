import Joi from "joi";

const loginSchema = Joi.object({
    name: Joi.string().alphanum().min(5).max(30).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*?&]{5,30}$")).required(),
});
const editNameSchema = Joi.object({
    newName: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*?&]{5,30}$")).min(5).max(30).required(),
});
const editPasswordSchema = Joi.object({
    oldPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*?&]{5,30}$")).required(),
    newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*?&]{5,30}$")).required(),
});
const recoveryPasswordSchema = Joi.object({
    code: Joi.string().required().alphanum().min(16).max(16),
    newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@$!%*?&]{5,30}$")).required(),
});

export {
    loginSchema,
    editNameSchema,
    editPasswordSchema,
    recoveryPasswordSchema
};
