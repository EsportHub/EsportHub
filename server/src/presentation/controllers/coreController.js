'use strict';

const teamService = require('../../application/services/teamService');
const tournamentService = require('../../application/services/tournamentService');
const countryService = require('../../application/services/countryService');

const pandaScoreService = require('../../infrastructure/external/pandaScoreService');

const db = require('../../../models/index');

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

// GET /api/tournaments/map
exports.getTournamentsForMap = async (req, res, next) => {
  try {
    const { game_id } = req.query;
    const tournaments = await tournamentService.getTournamentsForMap(game_id || null);
    res.status(200).json({
      message: 'Турніри для мапи успішно отримано',
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/countries
exports.getCountries = async (req, res, next) => {
  try {
    const { QueryTypes } = require('sequelize');
    const countries = await db.sequelize.query(
      `SELECT country_id, name, code, flag, description FROM country ORDER BY name`,
      { type: QueryTypes.SELECT },
    );
    res.status(200).json({
      message: 'Список країн успішно отримано',
      count: countries.length,
      data: countries,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/countries/:id
exports.getCountryById = async (req, res, next) => {
  try {
    const country = await countryService.getCountryById(req.params.id);
    res.status(200).json({ data: country });
  } catch (error) {
    next(error);
  }
};

// GET /api/countries/:id/teams
exports.getTeamsByCountry = async (req, res, next) => {
  try {
    const teams = await countryService.getTeamsByCountry(req.params.id);
    res.status(200).json({
      message: 'Команди країни успішно отримано',
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/search?q=
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      const error = new Error('Пошуковий запит має містити мінімум 2 символи');
      error.statusCode = 400;
      error.errorCode = 'VALIDATION_ERROR';
      throw error;
    }

    const search = `%${q.trim()}%`;

    const [teams] = await db.sequelize.query(
      `SELECT team_id AS id, name, logo, description, 'team' AS type
       FROM team WHERE name LIKE :search`,
      { replacements: { search } },
    );

    const [players] = await db.sequelize.query(
      `SELECT p.player_id AS id, p.nickname AS name, p.real_name, c.name AS country, 'player' AS type
       FROM player p
       LEFT JOIN country c ON p.country_id = c.country_id
       WHERE p.nickname LIKE :search OR p.real_name LIKE :search`,
      { replacements: { search } },
    );

    const [tournaments] = await db.sequelize.query(
      `SELECT tournament_id AS id, name, start_date, end_date, prize_pool, 'tournament' AS type
       FROM tournament WHERE name LIKE :search`,
      { replacements: { search } },
    );

    res.status(200).json({
      message: 'Результати пошуку',
      query: q,
      data: { teams, players, tournaments },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/matches/external?tier=s&date=2026-05-23
exports.getExternalMatches = async (req, res, next) => {
  try {
    const { tier, date } = req.query;
    const matches = date
      ? await pandaScoreService.getMatchesByDate(date, tier || null)
      : await pandaScoreService.getTodayMatches(tier || null);

    res.status(200).json({
      message: 'Матчі отримано з PandaScore',
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};
