'use strict';

const db = require('../../../models/index');

class TeamRepository {
  async findAll() {
    const [teams] = await db.sequelize.query(`
      SELECT
        t.team_id,
        t.name,
        t.founded_date,
        t.logo,
        t.description,
        c.name AS country,
        ci.name AS city
      FROM team t
      LEFT JOIN country c ON t.country_id = c.country_id
      LEFT JOIN city ci ON t.city_id = ci.city_id
      ORDER BY t.team_id
    `);
    return teams;
  }

  async findById(id) {
    const [teams] = await db.sequelize.query(
      `SELECT
        t.team_id,
        t.name,
        t.founded_date,
        t.logo,
        t.description,
        c.name AS country,
        ci.name AS city
      FROM team t
      LEFT JOIN country c ON t.country_id = c.country_id
      LEFT JOIN city ci ON t.city_id = ci.city_id
      WHERE t.team_id = :id`,
      { replacements: { id } },
    );
    return teams[0] || null;
  }
}

module.exports = new TeamRepository();
