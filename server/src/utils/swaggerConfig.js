'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EsportHub API',
      version: '1.0.0',
      description: 'API документація для EsportHub',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'testuser' },
            email: { type: 'string', example: 'test@test.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'test@test.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        AddFavoriteRequest: {
          type: 'object',
          required: ['user_id', 'team_id'],
          properties: {
            user_id: { type: 'integer', example: 1 },
            team_id: { type: 'integer', example: 2 },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'newusername', minLength: 3, maxLength: 30 },
            theme_preference: { type: 'string', enum: ['light', 'dark'], example: 'dark' },
          },
        },
        UserProfileResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                user_id: { type: 'integer', example: 1 },
                username: { type: 'string', example: 'testuser' },
                email: { type: 'string', example: 'test@test.com' },
                theme_preference: { type: 'string', example: 'dark' },
              },
            },
          },
        },
        UpdateProfileResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Профіль оновлено' },
            data: {
              type: 'object',
              properties: {
                user_id: { type: 'integer', example: 1 },
                username: { type: 'string', example: 'newusername' },
                email: { type: 'string', example: 'test@test.com' },
                theme_preference: { type: 'string', example: 'dark' },
              },
            },
          },
        },
        FavoriteTeamItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            create_time: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-23T10:00:00.000Z',
            },
            team_id: { type: 'integer', example: 5 },
            team_name: { type: 'string', example: 'Natus Vincere' },
            logo: { type: 'string', example: 'https://cdn.example.com/navi.png' },
            country: { type: 'string', example: 'Ukraine' },
          },
        },
        FavoriteTeamsResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Список обраних команд отримано' },
            count: { type: 'integer', example: 2 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/FavoriteTeamItem' },
            },
          },
        },
        AddFavoriteResponse: {
          type: 'object',
          properties: {
            userId: { type: 'integer', example: 1 },
            teamId: { type: 'integer', example: 5 },
            message: { type: 'string', example: 'Команду додано до обраного' },
          },
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Команду видалено з обраного' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', example: '2026-04-23T10:00:00.000Z' },
            errorCode: { type: 'string', example: 'VALIDATION_ERROR' },
            message: { type: 'string', example: 'Опис помилки' },
          },
        },
        Country: {
          type: 'object',
          properties: {
            country_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Ukraine' },
            code: { type: 'string', example: 'UA' },
            flag: { type: 'string', example: 'uk' },
            description: { type: 'string', example: 'Eastern Europe country' },
          },
        },
        CountriesListResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Список країн успішно отримано' },
            count: { type: 'integer', example: 4 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Country' },
            },
          },
        },
        CountryTeamItem: {
          type: 'object',
          properties: {
            team_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Natus Vincere' },
            founded_date: { type: 'string', format: 'date', example: '2009-12-17' },
            logo: { type: 'string', example: 'https://cdn.example.com/navi.png' },
            description: { type: 'string', example: 'Ukrainian esports organization' },
            city: { type: 'string', example: 'Kyiv' },
          },
        },
        CountryTeamsResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Команди країни успішно отримано' },
            count: { type: 'integer', example: 2 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/CountryTeamItem' },
            },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Перевірка стану сервера',
          responses: {
            200: { description: 'Сервер працює, БД підключена' },
            503: { description: 'БД недоступна' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Реєстрація нового користувача',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Акаунт успішно створено' },
            400: {
              description: 'Помилка валідації',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            409: {
              description: 'Email або username вже існує',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Вхід в систему',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: { description: 'Вхід успішний' },
            400: {
              description: 'Помилка валідації',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            401: {
              description: 'Невірні credentials',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/users/profile/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Отримати публічний профіль користувача за ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID користувача',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Профіль користувача знайдено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserProfileResponse' },
                },
              },
            },
            401: {
              description: 'Токен відсутній або недійсний',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Користувача не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Оновити профіль користувача',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID користувача',
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Профіль оновлено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UpdateProfileResponse' },
                },
              },
            },
            400: {
              description: 'Помилка валідації або немає даних',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            401: {
              description: 'Токен відсутній або недійсний',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            403: {
              description: 'Доступ заборонено — ви не власник цього профілю',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Користувача не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/teams': {
        get: {
          tags: ['Teams'],
          summary: 'Отримати список всіх команд',
          responses: {
            200: { description: 'Список команд' },
          },
        },
      },
      '/api/teams/{id}': {
        get: {
          tags: ['Teams'],
          summary: 'Отримати команду за ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Команда знайдена' },
            404: { description: 'Команду не знайдено' },
          },
        },
      },
      '/api/tournaments': {
        get: {
          tags: ['Tournaments'],
          summary: 'Отримати список всіх турнірів',
          responses: {
            200: { description: 'Список турнірів' },
          },
        },
      },
      '/api/tournaments/{id}': {
        get: {
          tags: ['Tournaments'],
          summary: 'Отримати турнір за ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Турнір знайдено' },
            404: { description: 'Турнір не знайдено' },
          },
        },
      },
      '/api/users/favorites/teams': {
        post: {
          tags: ['Favorites'],
          summary: 'Додати команду в обране',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AddFavoriteRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Команду додано до обраного',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AddFavoriteResponse' },
                },
              },
            },
            400: {
              description: 'Помилка валідації',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            401: {
              description: 'Токен відсутній або недійсний',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Команду не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            409: {
              description: 'Вже в обраному',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        delete: {
          tags: ['Favorites'],
          summary: 'Видалити команду з обраного',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AddFavoriteRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Команду видалено з обраного',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MessageResponse' },
                },
              },
            },
            401: {
              description: 'Токен відсутній або недійсний',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            404: {
              description: 'Команди немає в обраному',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/users/{userId}/favorites/teams': {
        get: {
          tags: ['Favorites'],
          summary: 'Отримати список обраних команд користувача',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Список обраних команд',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/FavoriteTeamsResponse' },
                },
              },
            },
            401: {
              description: 'Токен відсутній або недійсний',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/countries': {
        get: {
          tags: ['Countries'],
          summary: 'Отримати список всіх країн',
          responses: {
            200: {
              description: 'Список країн успішно отримано',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CountriesListResponse' },
                },
              },
            },
          },
        },
      },
      '/api/countries/{id}': {
        get: {
          tags: ['Countries'],
          summary: 'Отримати країну за ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID країни',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Країну знайдено',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/Country' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Країну не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/countries/{id}/teams': {
        get: {
          tags: ['Countries'],
          summary: 'Отримати команди за країною',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID країни',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Команди країни успішно отримано',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CountryTeamsResponse' },
                },
              },
            },
            404: {
              description: 'Країну не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
