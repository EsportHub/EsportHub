'use strict';

const Joi = require('joi');

const addFavoriteTeamSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    'number.base': 'user_id має бути числом',
    'number.integer': 'user_id має бути цілим числом',
    'number.positive': 'user_id має бути позитивним числом',
    'any.required': "user_id є обов'язковим полем",
  }),
  team_id: Joi.number().integer().positive().required().messages({
    'number.base': 'team_id має бути числом',
    'number.integer': 'team_id має бути цілим числом',
    'number.positive': 'team_id має бути позитивним числом',
    'any.required': "team_id є обов'язковим полем",
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
  validateAddFavoriteTeam: validate(addFavoriteTeamSchema),
};
