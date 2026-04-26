'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

class UserRepository {
  async findByEmail(email) {
    const users = await db.sequelize.query(`SELECT * FROM users WHERE email = :email`, {
      replacements: { email },
      type: QueryTypes.SELECT,
    });
    return users[0] || null;
  }

  async findByUsername(username) {
    const users = await db.sequelize.query(`SELECT * FROM users WHERE username = :username`, {
      replacements: { username },
      type: QueryTypes.SELECT,
    });
    return users[0] || null;
  }

  async findById(id) {
    const users = await db.sequelize.query(
      `SELECT user_id, username, email, theme_preference FROM users WHERE user_id = :id`,
      { replacements: { id }, type: QueryTypes.SELECT },
    );
    return users[0] || null;
  }

  async create({ username, email, passwordHash }) {
    const [result] = await db.sequelize.query(
      `INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :passwordHash)`,
      { replacements: { username, email, passwordHash }, type: QueryTypes.INSERT },
    );
    return result; // insertId
  }
}

module.exports = new UserRepository();
