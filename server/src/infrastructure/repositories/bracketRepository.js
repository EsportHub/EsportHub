'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class BracketRepository {
  async findByTournament(tournamentId) {
    return db.sequelize.query(
      `SELECT
        bm.bracket_match_id,
        bm.round,
        bm.position,
        bm.next_bracket_match_id,
        m.match_id,
        m.status,
        m.start_time,
        m.score_team1,
        m.score_team2,
        t1.team_id   AS team1_id,
        t1.name      AS team1_name,
        t1.logo      AS team1_logo,
        t2.team_id   AS team2_id,
        t2.name      AS team2_name,
        t2.logo      AS team2_logo,
        w.team_id    AS winner_id,
        w.name       AS winner_name
      FROM bracket_match bm
      LEFT JOIN \`match\` m  ON bm.match_id    = m.match_id
      LEFT JOIN team t1      ON m.team1_id     = t1.team_id
      LEFT JOIN team t2      ON m.team2_id     = t2.team_id
      LEFT JOIN team w       ON (
        CASE
          WHEN m.score_team1 > m.score_team2 THEN m.team1_id
          WHEN m.score_team2 > m.score_team1 THEN m.team2_id
          ELSE NULL
        END
      ) = w.team_id
      WHERE bm.tournament_id = :tournamentId
      ORDER BY bm.round ASC, bm.position ASC`,
      { replacements: { tournamentId }, type: QueryTypes.SELECT },
    );
  }
}

module.exports = new BracketRepository();
