'use strict';

const { body, validationResult } = require('express-validator');

exports.validateUpdateProfile = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username має бути від 3 до 30 символів'),
  body('theme_preference')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('theme_preference має бути light або dark'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      error.errorCode = 'VALIDATION_ERROR';
      return next(error);
    }
    next();
  },
];
