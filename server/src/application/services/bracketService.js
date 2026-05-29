'use strict';

const bracketRepository = require('../../infrastructure/repositories/bracketRepository');

class BracketService {
  async getBracket(tournamentId) {
    const rows = await bracketRepository.findByTournament(tournamentId);

    if (!rows.length) {
      const error = new Error('Турнірну сітку не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }

    // Групуємо по раундах
    const rounds = {};
    for (const row of rows) {
      if (!rounds[row.round]) rounds[row.round] = [];
      rounds[row.round].push({
        bracketMatchId: row.bracket_match_id,
        position: row.position,
        nextBracketMatchId: row.next_bracket_match_id,
        match: row.match_id
          ? {
              matchId: row.match_id,
              status: row.status,
              startTime: row.start_time,
              score: { team1: row.score_team1, team2: row.score_team2 },
            }
          : null,
        team1: row.team1_id
          ? { id: row.team1_id, name: row.team1_name, logo: row.team1_logo }
          : null,
        team2: row.team2_id
          ? { id: row.team2_id, name: row.team2_name, logo: row.team2_logo }
          : null,
        winner: row.winner_id ? { id: row.winner_id, name: row.winner_name } : null,
      });
    }

    return {
      tournamentId: Number(tournamentId),
      totalRounds: Object.keys(rounds).length,
      rounds,
    };
  }
}

module.exports = new BracketService();
