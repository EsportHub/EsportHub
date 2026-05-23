'use strict';

const teamService = require('../../application/services/teamService');
const tournamentService = require('../../application/services/tournamentService');
const countryService = require('../../application/services/countryService');


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

// GET /api/countries
exports.getCountries = async (req, res, next) => {
  try {
    const { QueryTypes } = require('sequelize');
    const db = require('../../../models/index');
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

// GET /api/tournaments/map
exports.getTournamentsForMap = async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getTournamentsForMap();
    res.status(200).json({
      message: 'Турніри для мапи успішно отримано',
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    next(error);
  }
};

