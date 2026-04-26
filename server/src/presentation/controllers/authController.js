'use strict';

const authService = require('../../application/services/authService');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });

    res.status(201).json({
      message: 'Акаунт успішно створено',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};
// comment to test commit
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.status(200).json({
      message: 'Вхід успішний',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};
