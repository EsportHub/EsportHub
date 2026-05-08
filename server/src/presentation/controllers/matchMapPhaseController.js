'use strict';

const matchMapPhaseService = require('../../application/services/matchMapPhaseService');

// GET /api/matches/:matchId/pickban
exports.getPickBan = async (req, res, next) => {
  try {
    const result = await matchMapPhaseService.getPickBanByMatchId(req.params.matchId);
    res.status(200).json({
      message: 'Pick/ban фаза успішно отримана',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
