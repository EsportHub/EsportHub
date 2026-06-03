'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../../models/index');
const favoriteService = require('../../application/services/favoriteService');
const { validateAddFavoriteTeam } = require('../dto/favoriteDto');
const { validateUpdateProfile } = require('../dto/userDto');
const authMiddleware = require('../middlewares/authMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');

// GET /api/users/profile/:id
router.get('/profile/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const [users] = await db.sequelize.query(
      `SELECT user_id, username, email, theme_preference
       FROM users WHERE user_id = :id`,
      { replacements: { id } },
    );

    if (!users[0]) {
      const error = new Error('Користувача не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      return next(error);
    }

    res.status(200).json({ data: users[0] });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/users/profile/:id
router.patch(
  '/profile/:id',
  authMiddleware,
  ownerMiddleware,
  validateUpdateProfile,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, theme_preference } = req.body;

      if (!username && !theme_preference) {
        const error = new Error('Немає даних для оновлення');
        error.statusCode = 400;
        error.errorCode = 'NO_DATA';
        return next(error);
      }

      const fields = [];
      const replacements = { id };

      if (username) {
        fields.push('username = :username');
        replacements.username = username;
      }
      if (theme_preference) {
        fields.push('theme_preference = :theme_preference');
        replacements.theme_preference = theme_preference;
      }

      await db.sequelize.query(`UPDATE users SET ${fields.join(', ')} WHERE user_id = :id`, {
        replacements,
      });

      const [updated] = await db.sequelize.query(
        `SELECT user_id, username, email, theme_preference FROM users WHERE user_id = :id`,
        { replacements: { id } },
      );

      res.status(200).json({ message: 'Профіль оновлено', data: updated[0] });
    } catch (e) {
      next(e);
    }
  },
);

// GET /api/users/:userId/favorites/teams
router.get('/:userId/favorites/teams', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const favorites = await favoriteService.getFavoriteTeams(userId);
    res.status(200).json({
      message: 'Список обраних команд отримано',
      count: favorites.length,
      data: favorites,
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/users/favorites/teams
router.post('/favorites/teams', authMiddleware, validateAddFavoriteTeam, async (req, res, next) => {
  try {
    const { user_id, team_id } = req.body;
    const result = await favoriteService.addFavoriteTeam(user_id, team_id);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/users/favorites/teams
router.delete('/favorites/teams', authMiddleware, async (req, res, next) => {
  try {
    const { user_id, team_id } = req.body;
    const result = await favoriteService.removeFavoriteTeam(user_id, team_id);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
