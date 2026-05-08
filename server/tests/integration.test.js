'use strict';

const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/presentation/routes/auth.routes');
const coreRoutes = require('../src/presentation/routes/core.routes');
const errorHandler = require('../src/presentation/middlewares/errorHandler');

// Створюємо тестовий екземпляр додатку
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);
app.use(errorHandler);

describe('Integration Tests — Наскрізні тести', () => {
  // ─── ТЕСТ 1: Реєстрація користувача ───────────────────────────────────────
  describe('POST /api/auth/register', () => {
    const uniqueEmail = `testuser_${Date.now()}@test.com`;
    const uniqueUsername = `testuser_${Date.now()}`;

    it('✅ має повернути 201 та JWT токен при успішній реєстрації', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: '123456',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(uniqueEmail);
      expect(response.body.user.username).toBe(uniqueUsername);
    });

    it('❌ має повернути 409 якщо email вже існує', async () => {
      // Перший запит — реєстрація
      await request(app)
        .post('/api/auth/register')
        .send({
          username: `another_${Date.now()}`,
          email: uniqueEmail,
          password: '123456',
        });

      // Другий запит — той самий email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: `another2_${Date.now()}`,
          email: uniqueEmail,
          password: '123456',
        });

      expect(response.status).toBe(409);
      expect(response.body.errorCode).toBe('EMAIL_ALREADY_EXISTS');
    });

    it('❌ має повернути 400 при некоректних даних', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'ab', // занадто короткий
        email: 'not-an-email',
        password: '123', // занадто короткий
      });

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  // ─── ТЕСТ 2: Отримання списку команд ──────────────────────────────────────
  describe('GET /api/teams', () => {
    it('✅ має повернути 200 та масив команд з БД', async () => {
      const response = await request(app).get('/api/teams');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('count');
    });

    it('✅ кожна команда має необхідні поля', async () => {
      const response = await request(app).get('/api/teams');

      if (response.body.data.length > 0) {
        const team = response.body.data[0];
        expect(team).toHaveProperty('team_id');
        expect(team).toHaveProperty('name');
      }
    });

    it('❌ має повернути 404 якщо команди не існує', async () => {
      const response = await request(app).get('/api/teams/99999');

      expect(response.status).toBe(404);
      expect(response.body.errorCode).toBe('NOT_FOUND');
    });
  });
});
