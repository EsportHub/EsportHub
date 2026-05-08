'use strict';

const playerStatsService = require('../../application/services/playerStatsService');

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
