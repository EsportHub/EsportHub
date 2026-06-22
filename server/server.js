'use strict';

require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/presentation/middlewares/errorHandler');
const swaggerSpec = require('./src/utils/swaggerConfig');
const { initWebSocket } = require('./src/infrastructure/websockets/playerStatsSocket');
const {
  initMatchNotificationScheduler,
} = require('./src/infrastructure/websockets/matchNotificationScheduler');

require('./src/infrastructure/external/passportConfig');

const healthRoutes = require('./src/presentation/routes/health.routes');
const coreRoutes = require('./src/presentation/routes/core.routes');
const authRoutes = require('./src/presentation/routes/auth.routes');
const userRoutes = require('./src/presentation/routes/user.routes');
const playerRoutes = require('./src/presentation/routes/player.routes');
const matchRoutes = require('./src/presentation/routes/match.routes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
initWebSocket(io);
initMatchNotificationScheduler(io);

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api', coreRoutes);
app.use('/api/matches', matchRoutes);

app.get('/api/test-error', (req, res, next) => {
  const error = new Error('Тестова критична помилка!');
  error.statusCode = 400;
  error.errorCode = 'VALIDATION_FAILED';
  next(error);
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res) => {
  res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Маршрут не знайдено' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Сервер запущено на порту ${PORT}`);
  logger.info(`Swagger UI: http://localhost:${PORT}/api/docs`);
  logger.info(`WebSocket готовий до підключень`);
});
