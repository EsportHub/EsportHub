const express = require('express');
const router = express.Router();
const { QueryTypes } = require('sequelize');

const db = require('../../../models/index');

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    await db.sequelize.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES (:username, :email, :password)`,
      {
        replacements: { username, email, password },
        type: QueryTypes.INSERT,
      },
    );

    res.json({
      message: 'User created',
    });
  } catch (e) {
    next(e);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const users = await db.sequelize.query(`SELECT * FROM users WHERE email = :email`, {
      replacements: { email },
      type: QueryTypes.SELECT,
    });

    const user = users[0];

    if (!user || user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login success',
      user_id: user.user_id,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
