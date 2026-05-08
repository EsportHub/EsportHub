'use strict';

const matchService = require('../../application/services/matchService');

// GET /api/matches
exports.getAllMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getAllMatches();
    res.status(200).json({
      message: 'Список матчів отримано',
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/matches/live
exports.getLiveMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getLiveMatches();
    res.status(200).json({
      message: 'Поточні матчі отримано',
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/matches/:matchId/score
exports.getMatchScore = async (req, res, next) => {
  try {
    const score = await matchService.getMatchScore(req.params.matchId);
    res.status(200).json({
      message: 'Рахунок матчу отримано',
      data: score,
    });
  } catch (error) {
    next(error);
  }
};
