'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const userRepository = require('../repositories/userRepository');

const CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || 'http://localhost:5000';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${CALLBACK_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName;

        let user = await userRepository.findByEmail(email);

        if (!user) {
          const userId = await userRepository.create({
            username,
            email,
            passwordHash: null,
          });
          user = { user_id: userId, username, email };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${CALLBACK_URL}/api/auth/discord/callback`,
      scope: ['identify', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.email;
        const username = profile.username;

        let user = await userRepository.findByEmail(email);

        if (!user) {
          const userId = await userRepository.create({
            username,
            email,
            passwordHash: null,
          });
          user = { user_id: userId, username, email };
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

module.exports = passport;
