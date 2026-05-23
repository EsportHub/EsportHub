'use strict';

const playerStatsRepository = require('../../infrastructure/repositories/playerStatsRepository');

class PlayerStatsService {
  async getPlayerStats(playerId) {
    const stats = await playerStatsRepository.findStatsByPlayerId(playerId);
    if (!stats) {
      const error = new Error('Гравця не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return stats;
  }

  async getPlayerMatchStats(playerId) {
    const stats = await playerStatsRepository.findStatsByPlayerId(playerId);
    if (!stats) {
      const error = new Error('Гравця не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    const matchStats = await playerStatsRepository.findMatchStatsByPlayerId(playerId);
    return {
      player: stats,
      matches: matchStats,
    };
  }

  async getAllPlayersStats() {
    return await playerStatsRepository.findAllPlayersStats();
  }
}

module.exports = new PlayerStatsService();
