'use strict';

const favoriteRepository = require('../../infrastructure/repositories/favoriteRepository');
const teamRepository = require('../../infrastructure/repositories/teamRepository');

class FavoriteService {
  async getFavoriteTeams(userId) {
    const favorites = await favoriteRepository.findByUserId(userId);
    return favorites;
  }

  async addFavoriteTeam(userId, teamId) {
    // Перевіряємо чи існує команда
    const team = await teamRepository.findById(teamId);
    if (!team) {
      const error = new Error('Команду не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }

    // Перевіряємо чи вже додана в обране
    const alreadyExists = await favoriteRepository.exists(userId, teamId);
    if (alreadyExists) {
      const error = new Error('Команда вже є в обраному');
      error.statusCode = 409;
      error.errorCode = 'ALREADY_EXISTS';
      throw error;
    }

    await favoriteRepository.create(userId, teamId);
    return { userId, teamId, message: 'Команду додано до обраного' };
  }

  async removeFavoriteTeam(userId, teamId) {
    const exists = await favoriteRepository.exists(userId, teamId);
    if (!exists) {
      const error = new Error('Команди немає в обраному');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }

    await favoriteRepository.delete(userId, teamId);
    return { message: 'Команду видалено з обраного' };
  }
}

module.exports = new FavoriteService();
