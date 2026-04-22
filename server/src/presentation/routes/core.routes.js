const express = require('express');
const router = express.Router();
const coreController = require('../controllers/coreController');

// Ці роути будуть доступні за адресою /api/teams, /api/tournaments тощо
router.get('/teams', coreController.getTeams);
router.get('/tournaments', coreController.getTournaments);
router.get('/players', coreController.getPlayers);

module.exports = router;
