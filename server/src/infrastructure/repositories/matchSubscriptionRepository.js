'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class MatchSubscriptionRepository {
  async findByUserId(userId) {
    const subs = await db.sequelize.query(
      `SELECT
        ms.id,
        ms.create_time,
        ms.match_id,
        m.start_time,
        m.status,
        t1.name AS team1_name,
        t2.name AS team2_name,
        tour.name AS tournament_name
      FROM match_subscription ms
      JOIN \`match\` m ON ms.match_id = m.match_id
      LEFT JOIN team t1 ON m.team1_id = t1.team_id
      LEFT JOIN team t2 ON m.team2_id = t2.team_id
      LEFT JOIN tournament tour ON m.tournament_id = tour.tournament_id
      WHERE ms.user_id = :userId
      ORDER BY m.start_time DESC`,
      { replacements: { userId }, type: QueryTypes.SELECT },
    );
    return subs;
  }

  async exists(userId, matchId) {
    const rows = await db.sequelize.query(
      `SELECT id FROM match_subscription WHERE user_id = :userId AND match_id = :matchId`,
      { replacements: { userId, matchId }, type: QueryTypes.SELECT },
    );
    return rows.length > 0;
  }

  async create(userId, matchId) {
    await db.sequelize.query(
      `INSERT INTO match_subscription (user_id, match_id, create_time)
       VALUES (:userId, :matchId, :createTime)`,
      { replacements: { userId, matchId, createTime: new Date() } },
    );
  }

  async delete(userId, matchId) {
    await db.sequelize.query(
      `DELETE FROM match_subscription WHERE user_id = :userId AND match_id = :matchId`,
      { replacements: { userId, matchId } },
    );
  }
}

module.exports = new MatchSubscriptionRepository();
