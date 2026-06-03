'use strict';

const matchRepository = require('../../infrastructure/repositories/matchRepository');

class MatchService {
  async getMatchScore(matchId) {
    const match = await matchRepository.findById(matchId);
    if (!match) {
      const error = new Error('Матч не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }

    return {
      matchId: match.match_id,
      status: match.status,
      startTime: match.start_time,
      tournament: match.tournament_name,
      team1: {
        name: match.team1_name,
        logo: match.team1_logo,
        score: match.score_team1,
      },
      team2: {
        name: match.team2_name,
        logo: match.team2_logo,
        score: match.score_team2,
      },
    };
  }

  async getAllMatches() {
    const matches = await matchRepository.findAll();
    return matches.map((m) => ({
      matchId: m.match_id,
      status: m.status,
      startTime: m.start_time,
      tournament: m.tournament_name,
      team1: { name: m.team1_name, logo: m.team1_logo, score: m.score_team1 },
      team2: { name: m.team2_name, logo: m.team2_logo, score: m.score_team2 },
    }));
  }

  async getLiveMatches() {
    const matches = await matchRepository.findLive();
    return matches.map((m) => ({
      matchId: m.match_id,
      status: m.status,
      startTime: m.start_time,
      tournament: m.tournament_name,
      team1: { name: m.team1_name, logo: m.team1_logo, score: m.score_team1 },
      team2: { name: m.team2_name, logo: m.team2_logo, score: m.score_team2 },
    }));
  }

  async getArchive(filters) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const year = filters.year ? parseInt(filters.year) : null;
    const teamId = filters.teamId || null;
    const tournamentId = filters.tournamentId || null;

    const { matches, total } = await matchRepository.findArchive({
      teamId,
      year,
      tournamentId,
      page,
      limit,
    });

    return {
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: matches.map((m) => ({
        matchId: m.match_id,
        status: m.status,
        startTime: m.start_time,
        year: m.year,
        tournamentId: m.tournament_id,
        tournament: m.tournament_name,
        team1: { name: m.team1_name, logo: m.team1_logo, score: m.score_team1 },
        team2: { name: m.team2_name, logo: m.team2_logo, score: m.score_team2 },
      })),
    };
  }
}

module.exports = new MatchService();
