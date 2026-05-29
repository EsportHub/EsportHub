'use strict';

const bracketService = require('../../application/services/bracketService');

// GET /api/tournaments/:id/bracket
exports.getBracket = async (req, res, next) => {
  try {
    const bracket = await bracketService.getBracket(req.params.id);
    res.status(200).json({
      message: 'Турнірну сітку отримано',
      data: bracket,
    });
  } catch (error) {
    next(error);
  }
};
