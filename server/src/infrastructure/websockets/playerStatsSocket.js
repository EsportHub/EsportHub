'use strict';

const playerStatsRepository = require('../repositories/playerStatsRepository');
const logger = require('../../utils/logger');

const initWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`WebSocket: клієнт підключився — ${socket.id}`);

    // Клієнт підписується на статистику гравця
    socket.on('subscribe:player_stats', async ({ playerId }) => {
      if (!playerId) return;

      logger.info(`WebSocket: підписка на статистику гравця ${playerId}`);

      // Одразу відправляємо поточну статистику
      try {
        const stats = await playerStatsRepository.findStatsByPlayerId(playerId);
        socket.emit('player_stats:update', { playerId, stats });
      } catch {
        socket.emit('player_stats:error', { message: 'Помилка отримання статистики' });
      }

      // Зберігаємо playerId в сокеті для подальших оновлень
      socket.data.subscribedPlayerId = playerId;
      socket.join(`player:${playerId}`);
    });

    // Клієнт відписується
    socket.on('unsubscribe:player_stats', ({ playerId }) => {
      socket.leave(`player:${playerId}`);
      logger.info(`WebSocket: відписка від статистики гравця ${playerId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket: клієнт відключився — ${socket.id}`);
    });
  });
};

// Функція для відправки оновлення статистики (викликається після оновлення в БД)
const emitPlayerStatsUpdate = async (io, playerId) => {
  try {
    const stats = await playerStatsRepository.findStatsByPlayerId(playerId);
    io.to(`player:${playerId}`).emit('player_stats:update', { playerId, stats });
    logger.info(`WebSocket: оновлення статистики гравця ${playerId} відправлено`);
  } catch (err) {
    logger.error(`WebSocket: помилка оновлення статистики — ${err.message}`);
  }
};

module.exports = { initWebSocket, emitPlayerStatsUpdate };
