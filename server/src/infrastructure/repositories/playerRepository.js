'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class PlayerRepository {
  async findAll() {
    const players = await db.sequelize.query(
      `SELECT
        p.player_id,
        p.nickname,
        p.real_name,
        p.birth_date,
        c.name AS country,
        t.name AS team,
        t.logo AS team_logo
      FROM player p
      LEFT JOIN country c ON p.country_id = c.country_id
      LEFT JOIN team t ON p.team_id = t.team_id
      ORDER BY p.nickname`,
      { type: QueryTypes.SELECT },
    );
    return players;
  }

  async findById(id) {
    const players = await db.sequelize.query(
      `SELECT
        p.player_id,
        p.nickname,
        p.real_name,
        p.birth_date,
        c.name AS country,
        t.name AS team,
        t.logo AS team_logo
      FROM player p
      LEFT JOIN country c ON p.country_id = c.country_id
      LEFT JOIN team t ON p.team_id = t.team_id
      WHERE p.player_id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT },
    );
    return players[0] || null;
  }

  async findByCountry(countryId) {
    return db.sequelize.query(
      `SELECT
      p.player_id,
      p.nickname,
      p.real_name,
      p.birth_date,
      c.name AS country,
      t.name AS team,
      t.logo AS team_logo
    FROM player p
    LEFT JOIN country c ON p.country_id = c.country_id
    LEFT JOIN team    t ON p.team_id    = t.team_id
    WHERE p.country_id = :countryId
    ORDER BY p.nickname`,
      { replacements: { countryId }, type: QueryTypes.SELECT },
    );
  }
}

module.exports = new PlayerRepository();
