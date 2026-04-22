const express = require('express');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

// 1. Імпортуємо наші файли маршрутизації
const healthRoutes = require('./src/presentation/routes/health.routes');
const coreRoutes = require('./src/presentation/routes/core.routes');

const app = express();

// Дозволяємо серверу читати JSON з тіла запиту
app.use(express.json());

// 2. Налаштування логування вхідних запитів (Morgan + Winston)
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// 3. Підключаємо маршрутизатори (Routing)
// Всі запити на /health підуть у healthRoutes
app.use('/health', healthRoutes);
// Всі запити на /api підуть у coreRoutes
app.use('/api', coreRoutes);

// Тестовий ендпоінт для перевірки обробника помилок (можеш видалити пізніше)
app.get('/api/test-error', (req, res, next) => {
  const error = new Error('Тестова критична помилка!');
  error.statusCode = 400;
  error.errorCode = 'VALIDATION_FAILED';
  next(error);
});

// 4. ПІДКЛЮЧАЄМО GLOBAL EXCEPTION HANDLER
// Важливо: обробник помилок ЗАВЖДИ має бути останнім app.use() у файлі!
app.use(errorHandler);

// 5. Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Сервер запущено на порту ${PORT}`);
});
