'use strict';

const teamService = require('../../application/services/teamService');
const tournamentService = require('../../application/services/tournamentService');

// GET /api/teams
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await teamService.getAllTeams();
    res.status(200).json({
      message: 'Список команд успішно отримано',
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/teams/:id
exports.getTeamById = async (req, res, next) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.status(200).json({ data: team });
  } catch (error) {
    next(error);
  }
};

// GET /api/tournaments
exports.getTournaments = async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.status(200).json({
      message: 'Список турнірів успішно отримано',
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tournaments/:id
exports.getTournamentById = async (req, res, next) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    res.status(200).json({ data: tournament });
  } catch (error) {
    next(error);
  }
};
