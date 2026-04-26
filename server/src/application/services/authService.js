'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../infrastructure/repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_prod';
const JWT_EXPIRES_IN = '7d';

class AuthService {
  async register({ username, email, password }) {
    // Перевірка чи email вже зайнятий
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      const error = new Error('Користувач з таким email вже існує');
      error.statusCode = 409;
      error.errorCode = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    // Перевірка чи username вже зайнятий
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      const error = new Error('Це імʼя користувача вже зайняте');
      error.statusCode = 409;
      error.errorCode = 'USERNAME_ALREADY_EXISTS';
      throw error;
    }

    // Хешування пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Створення користувача
    const userId = await userRepository.create({ username, email, passwordHash });

    // Генерація JWT токена
    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      user: { userId, username, email },
      token,
    };
  }

  async login({ email, password }) {
    // Пошук користувача
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Невірний email або пароль');
      error.statusCode = 401;
      error.errorCode = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('Невірний email або пароль');
      error.statusCode = 401;
      error.errorCode = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Генерація JWT токена
    const token = jwt.sign({ userId: user.user_id, username: user.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
}

module.exports = new AuthService();
