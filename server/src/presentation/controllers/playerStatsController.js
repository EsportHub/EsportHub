'use strict';

const playerStatsService = require('../../application/services/playerStatsService');
const playerService = require('../../application/services/playerService');

// GET /api/players/stats — всі гравці
exports.getAllPlayersStats = async (req, res, next) => {
  try {
    const stats = await playerStatsService.getAllPlayersStats();
    res.status(200).json({
      message: 'Статистика всіх гравців отримана',
      count: stats.length,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/players/:id/stats — статистика одного гравця
exports.getPlayerStats = async (req, res, next) => {
  try {
    const stats = await playerStatsService.getPlayerStats(req.params.id);
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};

// GET /api/players/:id/stats/matches — статистика по матчах
exports.getPlayerMatchStats = async (req, res, next) => {
  try {
    const stats = await playerStatsService.getPlayerMatchStats(req.params.id);
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};

// GET /api/players
exports.getAllPlayers = async (req, res, next) => {
  try {
    const players = await playerService.getAllPlayers();
    res.status(200).json({
      message: 'Список гравців успішно отримано',
      count: players.length,
      data: players,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/players/:id
exports.getPlayerById = async (req, res, next) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    res.status(200).json({ data: player });
  } catch (error) {
    next(error);
  }
};
