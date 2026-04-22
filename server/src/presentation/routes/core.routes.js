'use strict';

const express = require('express');
const router = express.Router();
const coreController = require('../controllers/coreController');

router.get('/teams', coreController.getTeams);
router.get('/teams/:id', coreController.getTeamById);

router.get('/tournaments', coreController.getTournaments);
router.get('/tournaments/:id', coreController.getTournamentById);

module.exports = router;
