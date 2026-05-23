'use strict';

const matchMapPhaseRepository = require('../../infrastructure/repositories/matchMapPhaseRepository');

class MatchMapPhaseService {
  async getPickBanByMatchId(matchId) {
    const phases = await matchMapPhaseRepository.findByMatchId(matchId);

    if (!phases.length) {
      const error = new Error('Pick/ban фаза для цього матчу не знайдена');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }

    // Групуємо по типу дії
    const bans = phases.filter((p) => p.action_type === 'ban');
    const picks = phases.filter((p) => p.action_type === 'pick');
    const left = phases.filter((p) => p.action_type === 'left');

    return {
      matchId,
      total: phases.length,
      phases,
      summary: { bans, picks, left },
    };
  }
}

module.exports = new MatchMapPhaseService();
