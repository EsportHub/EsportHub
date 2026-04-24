'use strict';

const ownerMiddleware = (req, res, next) => {
  const tokenUserId = req.user.userId; // з JWT (authMiddleware)
  const paramId = parseInt(req.params.id); // з URL /profile/:id

  if (tokenUserId !== paramId) {
    const error = new Error('Доступ заборонено — ви не власник цього профілю');
    error.statusCode = 403;
    error.errorCode = 'FORBIDDEN';
    return next(error);
  }

  next();
};

module.exports = ownerMiddleware;
