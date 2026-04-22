'use strict';

const db = require('../../../models/index');

class TournamentRepository {
  async findAll() {
    const [tournaments] = await db.sequelize.query(`
      SELECT
        t.tournament_id,
        t.name,
        t.start_date,
        t.end_date,
        t.prize_pool,
        g.name AS game,
        a.name AS arena
      FROM tournament t
      LEFT JOIN game g ON t.game_id = g.game_id
      LEFT JOIN arena a ON t.arena_id = a.arena_id
      ORDER BY t.start_date DESC
    `);
    return tournaments;
  }

  async findById(id) {
    const [tournaments] = await db.sequelize.query(
      `SELECT
        t.tournament_id,
        t.name,
        t.start_date,
        t.end_date,
        t.prize_pool,
        g.name AS game,
        a.name AS arena
      FROM tournament t
      LEFT JOIN game g ON t.game_id = g.game_id
      LEFT JOIN arena a ON t.arena_id = a.arena_id
      WHERE t.tournament_id = :id`,
      { replacements: { id } },
    );
    return tournaments[0] || null;
  }
}

module.exports = new TournamentRepository();
