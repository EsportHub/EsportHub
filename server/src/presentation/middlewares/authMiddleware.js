'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Токен авторизації відсутній');
    error.statusCode = 401;
    error.errorCode = 'MISSING_TOKEN';
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, username }
    next();
  } catch {
    const error = new Error('Недійсний або прострочений токен');
    error.statusCode = 401;
    error.errorCode = 'INVALID_TOKEN';
    return next(error);
  }
};

module.exports = authMiddleware;
