'use strict';

const express = require('express');
const router = express.Router();
const playerStatsController = require('../controllers/playerStatsController');

// GET /api/players/stats
router.get('/stats', playerStatsController.getAllPlayersStats);

// GET /api/players/:id/stats
router.get('/:id/stats', playerStatsController.getPlayerStats);

// GET /api/players/:id/stats/matches
router.get('/:id/stats/matches', playerStatsController.getPlayerMatchStats);

module.exports = router;
