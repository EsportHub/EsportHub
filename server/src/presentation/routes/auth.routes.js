'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../dto/authDto');

// Існуючі маршрути
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.oauthCallback,
);

// Discord OAuth
router.get('/discord', passport.authenticate('discord'));
router.get(
  '/discord/callback',
  passport.authenticate('discord', { session: false, failureRedirect: '/login' }),
  authController.oauthCallback,
);

module.exports = router;
