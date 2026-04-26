'use strict';

const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.min': 'username має бути не менше 3 символів',
    'string.max': 'username має бути не більше 50 символів',
    'any.required': 'username є обовʼязковим полем',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'email має бути валідною адресою',
    'any.required': 'email є обовʼязковим полем',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'password має бути не менше 6 символів',
    'string.max': 'password має бути не більше 100 символів',
    'any.required': 'password є обовʼязковим полем',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'email має бути валідною адресою',
    'any.required': 'email є обовʼязковим полем',
  }),
  password: Joi.string().required().messages({
    'any.required': 'password є обовʼязковим полем',
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const err = new Error(error.details.map((d) => d.message).join('; '));
    err.statusCode = 400;
    err.errorCode = 'VALIDATION_ERROR';
    return next(err);
  }
  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
};
