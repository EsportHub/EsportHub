'use strict';

const tournamentRepository = require('../../infrastructure/repositories/tournamentRepository');

class TournamentService {
  async getAllTournaments() {
    const tournaments = await tournamentRepository.findAll();
    return tournaments;
  }

  async getTournamentById(id) {
    const tournament = await tournamentRepository.findById(id);
    if (!tournament) {
      const error = new Error('Турнір не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return tournament;
  }

  async getTournamentsForMap(gameId = null) {
    return tournamentRepository.findForMap(gameId);
  }
}

module.exports = new TournamentService();
