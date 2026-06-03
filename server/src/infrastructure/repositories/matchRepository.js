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

  async findUpcoming(minutesAhead = 30) {
    const matches = await db.sequelize.query(
      `SELECT
      m.match_id,
      m.start_time,
      m.status,
      t1.team_id AS team1_id,
      t1.name AS team1_name,
      t2.team_id AS team2_id,
      t2.name AS team2_name,
      tour.name AS tournament_name
    FROM \`match\` m
    LEFT JOIN team t1 ON m.team1_id = t1.team_id
    LEFT JOIN team t2 ON m.team2_id = t2.team_id
    LEFT JOIN tournament tour ON m.tournament_id = tour.tournament_id
    WHERE m.status = 'upcoming'
      AND m.start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL :minutes MINUTE)`,
      { replacements: { minutes: minutesAhead }, type: QueryTypes.SELECT },
    );
    return matches;
  }

  async findArchive({ teamId, year, tournamentId, page = 1, limit = 20 }) {
    const conditions = [`m.status = 'finished'`];
    const replacements = {};

    if (teamId) {
      conditions.push(`(m.team1_id = :teamId OR m.team2_id = :teamId)`);
      replacements.teamId = teamId;
    }
    if (year) {
      conditions.push(`YEAR(m.start_time) = :year`);
      replacements.year = year;
    }
    if (tournamentId) {
      conditions.push(`m.tournament_id = :tournamentId`);
      replacements.tournamentId = tournamentId;
    }

    const where = conditions.join(' AND ');
    const offset = (page - 1) * limit;
    replacements.limit = limit;
    replacements.offset = offset;

    const matches = await db.sequelize.query(
      `SELECT
        m.match_id,
        m.score_team1,
        m.score_team2,
        m.status,
        m.start_time,
        m.tournament_id,
        t1.name AS team1_name,
        t1.logo AS team1_logo,
        t2.name AS team2_name,
        t2.logo AS team2_logo,
        tour.name AS tournament_name,
        YEAR(m.start_time) AS year
     FROM \`match\` m
     LEFT JOIN team       t1   ON m.team1_id      = t1.team_id
     LEFT JOIN team       t2   ON m.team2_id      = t2.team_id
     LEFT JOIN tournament tour ON m.tournament_id = tour.tournament_id
     WHERE ${where}
     ORDER BY m.start_time DESC
     LIMIT :limit OFFSET :offset`,
      { replacements, type: QueryTypes.SELECT },
    );

    const [{ total }] = await db.sequelize.query(
      `SELECT COUNT(*) AS total
     FROM \`match\` m
     WHERE ${where}`,
      { replacements, type: QueryTypes.SELECT },
    );

    return { matches, total: Number(total), page, limit };
  }
}

module.exports = new MatchRepository();
