const express = require('express');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const healthRoutes = require('./src/presentation/routes/health.routes');
const coreRoutes = require('./src/presentation/routes/core.routes');
const authRoutes = require('./src/presentation/routes/auth.routes');
const userRoutes = require('./src/presentation/routes/user.routes');

const app = express();

// 1. Базові middleware
app.use(express.json());
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// 2. Роути
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', coreRoutes);

// Тестовий ендпоінт
app.get('/api/test-error', (req, res, next) => {
  const error = new Error('Тестова критична помилка!');
  error.statusCode = 400;
  error.errorCode = 'VALIDATION_FAILED';
  next(error);
});

// 3. Ігноруємо favicon щоб не спамив помилками
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 4. 404 handler
app.use((req, res) => {
  res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Маршрут не знайдено' });
});

// 5. Error handler — завжди останній!
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Сервер запущено на порту ${PORT}`);
});
