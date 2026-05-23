'use strict';

const express = require('express');
const router = express.Router();
const coreController = require('../controllers/coreController');

router.get('/teams', coreController.getTeams);
router.get('/teams/:id', coreController.getTeamById);

router.get('/tournaments', coreController.getTournaments);
router.get('/tournaments/map', coreController.getTournamentsForMap);
router.get('/tournaments/:id', coreController.getTournamentById);

router.get('/countries', coreController.getCountries);
router.get('/countries/:id', coreController.getCountryById);
router.get('/countries/:id/teams', coreController.getTeamsByCountry);

router.get('/search', coreController.search);

module.exports = router;
