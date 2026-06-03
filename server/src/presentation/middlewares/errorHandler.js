const logger = require('../../utils/logger');

const errorHandler = (err, req, res, _next) => {
  // Визначаємо статус-код та код помилки
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || (statusCode === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const message = err.message || 'Внутрішня помилка сервера';

  // Логуємо помилку через наш Winston logger
  logger.error(`${statusCode} - ${errorCode} - ${message} - [${req.method}] ${req.originalUrl}`);

  // Відправляємо клієнту стандартизований JSON (без "сирого" traceback)
  res.status(statusCode).json({
    timestamp: new Date().toISOString(),
    errorCode: errorCode,
    message: message,
  });
};

module.exports = errorHandler;
