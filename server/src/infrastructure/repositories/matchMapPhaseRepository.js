'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class MatchMapPhaseRepository {
  async findByMatchId(matchId) {
    const phases = await db.sequelize.query(
      `SELECT
        mmp.phase_id,
        mmp.order_number,
        mmp.action_type,
        m.name AS map_name,
        t.name AS team_name,
        t.logo AS team_logo
      FROM match_map_phase mmp
      LEFT JOIN map m ON mmp.map_id = m.map_id
      LEFT JOIN team t ON mmp.team_id = t.team_id
      WHERE mmp.match_id = :matchId
      ORDER BY mmp.order_number ASC`,
      { replacements: { matchId }, type: QueryTypes.SELECT },
    );
    return phases;
  }
}

module.exports = new MatchMapPhaseRepository();
