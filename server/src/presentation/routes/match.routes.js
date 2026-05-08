'use strict';

const express = require('express');
const router = express.Router();
const matchMapPhaseController = require('../controllers/matchMapPhaseController');

// GET /api/matches/:matchId/pickban
router.get('/:matchId/pickban', matchMapPhaseController.getPickBan);

module.exports = router;
