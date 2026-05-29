'use strict';

const matchService = require('../../application/services/matchService');
const matchSubscriptionService = require('../../application/services/matchSubscriptionService');

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

// GET /api/matches/subscriptions/:userId
exports.getSubscriptions = async (req, res, next) => {
  try {
    const subs = await matchSubscriptionService.getSubscriptions(req.params.userId);
    res.status(200).json({
      message: 'Підписки на матчі отримано',
      count: subs.length,
      data: subs,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/matches/subscriptions
exports.subscribe = async (req, res, next) => {
  try {
    const { user_id, match_id } = req.body;
    const result = await matchSubscriptionService.subscribe(user_id, match_id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/matches/subscriptions
exports.unsubscribe = async (req, res, next) => {
  try {
    const { user_id, match_id } = req.body;
    await matchSubscriptionService.unsubscribe(user_id, match_id);
    res.status(200).json({ message: 'Підписку на матч видалено' });
  } catch (error) {
    next(error);
  }
};

// GET /api/matches/archive?teamId=1&year=2024&tournamentId=1&page=1&limit=20
exports.getArchive = async (req, res, next) => {
  try {
    const result = await matchService.getArchive(req.query);
    res.status(200).json({
      message: 'Архів матчів отримано',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
