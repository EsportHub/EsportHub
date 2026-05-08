'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class MatchRepository {
  async findById(matchId) {
    const matches = await db.sequelize.query(
      `SELECT
        m.match_id,
        m.score_team1,
        m.score_team2,
        m.status,
        m.start_time,
        t1.name AS team1_name,
        t1.logo AS team1_logo,
        t2.name AS team2_name,
        t2.logo AS team2_logo,
        tour.name AS tournament_name
      FROM \`match\` m
      LEFT JOIN team t1 ON m.team1_id = t1.team_id
      LEFT JOIN team t2 ON m.team2_id = t2.team_id
      LEFT JOIN tournament tour ON m.tournament_id = tour.tournament_id
      WHERE m.match_id = :matchId`,
      { replacements: { matchId }, type: QueryTypes.SELECT },
    );
    return matches[0] || null;
  }

  async findAll() {
    const matches = await db.sequelize.query(
      `SELECT
        m.match_id,
        m.score_team1,
        m.score_team2,
        m.status,
        m.start_time,
        t1.name AS team1_name,
        t1.logo AS team1_logo,
        t2.name AS team2_name,
        t2.logo AS team2_logo,
        tour.name AS tournament_name
      FROM \`match\` m
      LEFT JOIN team t1 ON m.team1_id = t1.team_id
      LEFT JOIN team t2 ON m.team2_id = t2.team_id
      LEFT JOIN tournament tour ON m.tournament_id = tour.tournament_id
      ORDER BY m.start_time DESC`,
      { type: QueryTypes.SELECT },
    );
    return matches;
  }

  async findLive() {
    const matches = await db.sequelize.query(
      `SELECT
        m.match_id,
        m.score_team1,
        m.score_team2,
        m.status,
        m.start_time,
        t1.name AS team1_name,
        t1.logo AS team1_logo,
        t2.name AS team2_name,
        t2.logo AS team2_logo,
        tour.name AS tournament_name
      FROM \`match\` m
      LEFT JOIN team t1 ON m.team1_id = t1.team_id
      LEFT JOIN team t2 ON m.team2_id = t2.team_id
      LEFT JOIN tournament tour ON m.tournament_id = tour.tournament_id
      WHERE m.status = 'live'
      ORDER BY m.start_time DESC`,
      { type: QueryTypes.SELECT },
    );
    return matches;
  }
}

module.exports = new MatchRepository();
