'use strict';

const db = require('../../../models/index');

class CountryRepository {
  async findAll() {
    const [countries] = await db.sequelize.query(`
      SELECT country_id, name, code, flag, description
      FROM country
      ORDER BY name
    `);
    return countries;
  }

  async findById(id) {
    const [countries] = await db.sequelize.query(
      `SELECT country_id, name, code, flag, description
       FROM country
       WHERE country_id = :id`,
      { replacements: { id } },
    );
    return countries[0] || null;
  }

  async findTeamsByCountryId(id) {
    const [teams] = await db.sequelize.query(
      `SELECT
        t.team_id,
        t.name,
        t.founded_date,
        t.logo,
        t.description,
        ci.name AS city
       FROM team t
       LEFT JOIN city ci ON t.city_id = ci.city_id
       WHERE t.country_id = :id
       ORDER BY t.name`,
      { replacements: { id } },
    );
    return teams;
  }
}

module.exports = new CountryRepository();
