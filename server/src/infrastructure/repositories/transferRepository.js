'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class TransferRepository {
  async findByPlayer(playerId) {
    return db.sequelize.query(
      `SELECT
        pt.transfer_id,
        pt.transfer_date,
        pt.transfer_fee,
        pt.status,
        pt.notes,
        p.player_id,
        p.nickname,
        p.real_name,
        ft.team_id   AS from_team_id,
        ft.name      AS from_team_name,
        ft.logo      AS from_team_logo,
        tt.team_id   AS to_team_id,
        tt.name      AS to_team_name,
        tt.logo      AS to_team_logo
      FROM player_transfer pt
      LEFT JOIN player p  ON pt.player_id    = p.player_id
      LEFT JOIN team   ft ON pt.from_team_id = ft.team_id
      LEFT JOIN team   tt ON pt.to_team_id   = tt.team_id
      WHERE pt.player_id = :playerId
      ORDER BY pt.transfer_date ASC`,
      { replacements: { playerId }, type: QueryTypes.SELECT },
    );
  }
}

module.exports = new TransferRepository();
