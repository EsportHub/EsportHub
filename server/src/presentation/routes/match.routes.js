'use strict';

const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const matchMapPhaseController = require('../controllers/matchMapPhaseController');

// GET /api/matches
router.get('/', matchController.getAllMatches);

// GET /api/matches/live
router.get('/live', matchController.getLiveMatches);

router.get('/subscriptions/:userId', matchController.getSubscriptions);
router.post('/subscriptions', matchController.subscribe);
router.delete('/subscriptions', matchController.unsubscribe);

// GET /api/matches/:matchId/score
router.get('/:matchId/score', matchController.getMatchScore);

// GET /api/matches/:matchId/pickban
router.get('/:matchId/pickban', matchMapPhaseController.getPickBan);

module.exports = router;
