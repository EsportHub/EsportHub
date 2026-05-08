'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class PlayerStatsRepository {
  async findStatsByPlayerId(playerId) {
    const stats = await db.sequelize.query(
      `SELECT
        p.player_id,
        p.nickname,
        p.real_name,
        c.name AS country,
        t.name AS team,
        SUM(pms.kills) AS total_kills,
        SUM(pms.deaths) AS total_deaths,
        SUM(pms.assists) AS total_assists,
        COUNT(pms.match_id) AS total_matches,
        ROUND(SUM(pms.kills) / NULLIF(SUM(pms.deaths), 0), 2) AS kd_ratio
      FROM player p
      LEFT JOIN player_match_stats pms ON p.player_id = pms.player_id
      LEFT JOIN country c ON p.country_id = c.country_id
      LEFT JOIN team t ON p.team_id = t.team_id
      WHERE p.player_id = :playerId
      GROUP BY p.player_id, p.nickname, p.real_name, c.name, t.name`,
      { replacements: { playerId }, type: QueryTypes.SELECT },
    );
    return stats[0] || null;
  }

  async findMatchStatsByPlayerId(playerId) {
    const stats = await db.sequelize.query(
      `SELECT
        pms.stats_id,
        pms.match_id,
        pms.kills,
        pms.deaths,
        pms.assists,
        m.status,
        m.start_time,
        t1.name AS team1,
        t2.name AS team2,
        m.score_team1,
        m.score_team2
      FROM player_match_stats pms
      JOIN match m ON pms.match_id = m.match_id
      LEFT JOIN team t1 ON m.team1_id = t1.team_id
      LEFT JOIN team t2 ON m.team2_id = t2.team_id
      WHERE pms.player_id = :playerId
      ORDER BY m.start_time DESC`,
      { replacements: { playerId }, type: QueryTypes.SELECT },
    );
    return stats;
  }

  async findAllPlayersStats() {
    const stats = await db.sequelize.query(
      `SELECT
        p.player_id,
        p.nickname,
        t.name AS team,
        c.name AS country,
        SUM(pms.kills) AS total_kills,
        SUM(pms.deaths) AS total_deaths,
        SUM(pms.assists) AS total_assists,
        COUNT(pms.match_id) AS total_matches,
        ROUND(SUM(pms.kills) / NULLIF(SUM(pms.deaths), 0), 2) AS kd_ratio
      FROM player p
      LEFT JOIN player_match_stats pms ON p.player_id = pms.player_id
      LEFT JOIN team t ON p.team_id = t.team_id
      LEFT JOIN country c ON p.country_id = c.country_id
      GROUP BY p.player_id, p.nickname, t.name, c.name
      ORDER BY total_kills DESC`,
      { type: QueryTypes.SELECT },
    );
    return stats;
  }
}

module.exports = new PlayerStatsRepository();
