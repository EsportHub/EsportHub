'use strict';

const db = require('../../../models/index');

class FavoriteRepository {
  async findByUserId(userId) {
    const [favorites] = await db.sequelize.query(
      `SELECT
        ft.id,
        ft.create_time,
        t.team_id,
        t.name AS team_name,
        t.logo,
        c.name AS country
      FROM favorite_team ft
      JOIN team t ON ft.team_id = t.team_id
      LEFT JOIN country c ON t.country_id = c.country_id
      WHERE ft.user_id = :userId
      ORDER BY ft.create_time DESC`,
      { replacements: { userId } },
    );
    return favorites;
  }

  async exists(userId, teamId) {
    const [rows] = await db.sequelize.query(
      `SELECT id FROM favorite_team WHERE user_id = :userId AND team_id = :teamId`,
      { replacements: { userId, teamId } },
    );
    return rows.length > 0;
  }

  async create(userId, teamId) {
    await db.sequelize.query(
      `INSERT INTO favorite_team (user_id, team_id, create_time)
       VALUES (:userId, :teamId, :createTime)`,
      { replacements: { userId, teamId, createTime: new Date() } },
    );
  }

  async delete(userId, teamId) {
    await db.sequelize.query(
      `DELETE FROM favorite_team WHERE user_id = :userId AND team_id = :teamId`,
      { replacements: { userId, teamId } },
    );
  }
}

module.exports = new FavoriteRepository();
