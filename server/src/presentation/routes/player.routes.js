'use strict';

const express = require('express');
const router = express.Router();
const playerStatsController = require('../controllers/playerStatsController');

router.get('/', playerStatsController.getAllPlayers);
router.get('/:id', playerStatsController.getPlayerById);

// GET /api/players/stats
router.get('/stats', playerStatsController.getAllPlayersStats);

// GET /api/players/:id/stats
router.get('/:id/stats', playerStatsController.getPlayerStats);

// GET /api/players/:id/stats/matches
router.get('/:id/stats/matches', playerStatsController.getPlayerMatchStats);
// GET /api/players/:id/transfers
router.get('/:id/transfers', playerStatsController.getPlayerTransfers);

module.exports = router;
