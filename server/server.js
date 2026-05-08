'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/presentation/middlewares/errorHandler');
const swaggerSpec = require('./src/utils/swaggerConfig');
const { initWebSocket } = require('./src/infrastructure/websockets/playerStatsSocket');

const healthRoutes = require('./src/presentation/routes/health.routes');
const coreRoutes = require('./src/presentation/routes/core.routes');
const authRoutes = require('./src/presentation/routes/auth.routes');
const userRoutes = require('./src/presentation/routes/user.routes');
const playerRoutes = require('./src/presentation/routes/player.routes');
const matchRoutes = require('./src/presentation/routes/match.routes');

const app = express();
const server = http.createServer(app);

// WebSocket
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
initWebSocket(io);

// 1. Базові middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// 2. Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. Роути
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api', coreRoutes);
app.use('/api/matches', matchRoutes);

// 4. Тестовий ендпоінт
app.get('/api/test-error', (req, res, next) => {
  const error = new Error('Тестова критична помилка!');
  error.statusCode = 400;
  error.errorCode = 'VALIDATION_FAILED';
  next(error);
});

// 5. Favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 6. 404 handler
app.use((req, res) => {
  res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Маршрут не знайдено' });
});

// 7. Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Сервер запущено на порту ${PORT}`);
  logger.info(`Swagger UI: http://localhost:${PORT}/api/docs`);
  logger.info(`WebSocket готовий до підключень`);
});
