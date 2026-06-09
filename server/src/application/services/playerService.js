'use strict';

const playerRepository = require('../../infrastructure/repositories/playerRepository');

class PlayerService {
  async getAllPlayers() {
    return playerRepository.findAll();
  }

  async getPlayerById(id) {
    const player = await playerRepository.findById(id);
    if (!player) {
      const error = new Error('Гравця не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return player;
  }

  async getPlayersByCountry(countryId) {
    const players = await playerRepository.findByCountry(countryId);
    if (!players.length) {
      const error = new Error('Гравців з цієї країни не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return players;
  }
}

module.exports = new PlayerService();
