'use strict';

const matchSubscriptionRepository = require('../../infrastructure/repositories/matchSubscriptionRepository');
const matchRepository = require('../../infrastructure/repositories/matchRepository');

class MatchSubscriptionService {
  async getSubscriptions(userId) {
    return matchSubscriptionRepository.findByUserId(userId);
  }

  async subscribe(userId, matchId) {
    const match = await matchRepository.findById(matchId);
    if (!match) {
      const error = new Error('Матч не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    const already = await matchSubscriptionRepository.exists(userId, matchId);
    if (already) {
      const error = new Error('Ви вже підписані на цей матч');
      error.statusCode = 409;
      error.errorCode = 'ALREADY_EXISTS';
      throw error;
    }
    await matchSubscriptionRepository.create(userId, matchId);
    return { userId, matchId, message: 'Підписку на матч додано' };
  }

  async unsubscribe(userId, matchId) {
    const exists = await matchSubscriptionRepository.exists(userId, matchId);
    if (!exists) {
      const error = new Error('Підписку не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    await matchSubscriptionRepository.delete(userId, matchId);
  }
}

module.exports = new MatchSubscriptionService();
