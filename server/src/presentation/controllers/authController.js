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

exports.oauthCallback = (req, res) => {
  try {
    const token = authService.generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};
