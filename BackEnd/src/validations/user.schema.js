const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).when('$isUpdate', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.required()
  }),
  roleId: Joi.number().valid(1, 2, 3).required(), // 1: Admin, 2: FleetManager, 3: User
  isActive: Joi.boolean().default(true)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  userSchema,
  loginSchema,
  resetPasswordSchema,
  verifyOtpSchema
};
