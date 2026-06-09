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
        TournamentMapItem: {
          type: 'object',
          properties: {
            tournament_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'PGL Major Copenhagen 2024' },
            start_date: { type: 'string', format: 'date', example: '2024-03-17' },
            end_date: { type: 'string', format: 'date', example: '2024-03-31' },
            prize_pool: { type: 'number', example: 1250000 },
            game: { type: 'string', example: 'CS2' },
            arena: { type: 'string', example: 'PGL Arena' },
            latitude: { type: 'number', example: 55.6761 },
            longitude: { type: 'number', example: 12.5683 },
            city: { type: 'string', example: 'Copenhagen' },
          },
        },
        TournamentMapResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Турніри для мапи успішно отримано' },
            count: { type: 'integer', example: 2 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/TournamentMapItem' },
            },
          },
        },
        PlayerItem: {
          type: 'object',
          properties: {
            player_id: { type: 'integer', example: 1 },
            nickname: { type: 'string', example: 's1mple' },
            real_name: { type: 'string', example: 'Oleksandr Kostyliev' },
            birth_date: { type: 'string', format: 'date', example: '1997-10-02' },
            country: { type: 'string', example: 'Ukraine' },
            team: { type: 'string', example: 'Natus Vincere' },
            team_logo: { type: 'string', example: 'https://cdn.example.com/navi.png' },
          },
        },
        PlayersListResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Список гравців успішно отримано' },
            count: { type: 'integer', example: 5 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/PlayerItem' },
            },
          },
        },
        MatchArchiveItem: {
          type: 'object',
          properties: {
            matchId: { type: 'integer', example: 1 },
            status: { type: 'string', example: 'finished' },
            startTime: { type: 'string', format: 'date-time', example: '2024-03-20T14:00:00.000Z' },
            year: { type: 'integer', example: 2024 },
            tournamentId: { type: 'integer', example: 1 },
            tournament: { type: 'string', example: 'PGL Major Copenhagen 2024' },
            team1: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Natus Vincere' },
                logo: { type: 'string', example: 'https://cdn.example.com/navi.png' },
                score: { type: 'integer', example: 2 },
              },
            },
            team2: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Astralis' },
                logo: { type: 'string', example: 'https://cdn.example.com/astralis.png' },
                score: { type: 'integer', example: 0 },
              },
            },
          },
        },
        MatchArchiveResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Архів матчів отримано' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 20 },
                total: { type: 'integer', example: 2 },
                pages: { type: 'integer', example: 1 },
              },
            },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/MatchArchiveItem' },
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
      '/api/tournaments/map': {
        get: {
          tags: ['Tournaments'],
          summary: 'Отримати турніри з координатами для мапи',
          parameters: [
            {
              name: 'game_id',
              in: 'query',
              required: false,
              description: 'Фільтр по грі (ID гри)',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Турніри для мапи успішно отримано',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/TournamentMapResponse' },
                },
              },
            },
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
      '/api/players': {
        get: {
          tags: ['Players'],
          summary: 'Отримати список гравців',
          parameters: [
            {
              name: 'country_id',
              in: 'query',
              required: false,
              description: 'Фільтр за країною (ID країни). Якщо не вказано — повертає всіх гравців',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Список гравців успішно отримано',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PlayersListResponse' },
                },
              },
            },
            404: {
              description: 'Гравців з цієї країни не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/players/{id}': {
        get: {
          tags: ['Players'],
          summary: 'Отримати гравця за ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID гравця',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Гравця знайдено',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/PlayerItem' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Гравця не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/matches/subscriptions': {
        post: {
          tags: ['Matches'],
          summary: 'Підписатись на матч',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['user_id', 'match_id'],
                  properties: {
                    user_id: { type: 'integer', example: 1 },
                    match_id: { type: 'integer', example: 3 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Підписку на матч додано' },
            404: {
              description: 'Матч не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
            409: {
              description: 'Вже підписані на цей матч',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        delete: {
          tags: ['Matches'],
          summary: 'Відписатись від матчу',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['user_id', 'match_id'],
                  properties: {
                    user_id: { type: 'integer', example: 1 },
                    match_id: { type: 'integer', example: 3 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Підписку на матч видалено' },
            404: {
              description: 'Підписку не знайдено',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/matches/subscriptions/{userId}': {
        get: {
          tags: ['Matches'],
          summary: 'Отримати підписки користувача на матчі',
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              description: 'ID користувача',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: { description: 'Підписки на матчі отримано' },
          },
        },
      },
      '/api/search': {
        get: {
          tags: ['Search'],
          summary: 'Універсальний пошук по командах, гравцях та турнірах',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: true,
              description: 'Пошуковий запит (мінімум 2 символи)',
              schema: { type: 'string', example: 'Natus' },
            },
          ],
          responses: {
            200: {
              description: 'Результати пошуку',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Результати пошуку' },
                      query: { type: 'string', example: 'Natus' },
                      data: {
                        type: 'object',
                        properties: {
                          teams: { type: 'array', items: { type: 'object' } },
                          players: { type: 'array', items: { type: 'object' } },
                          tournaments: { type: 'array', items: { type: 'object' } },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Запит занадто короткий',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/api/matches/external': {
        get: {
          tags: ['Matches'],
          summary: 'Отримати матчі з PandaScore з фільтром по даті та tier',
          parameters: [
            {
              name: 'tier',
              in: 'query',
              required: false,
              description: 'Рівень турніру (s, a, b, c, d)',
              schema: { type: 'string', example: 's' },
            },
            {
              name: 'date',
              in: 'query',
              required: false,
              description: 'Дата у форматі YYYY-MM-DD. За замовчуванням — сьогодні',
              schema: { type: 'string', example: '2026-05-23' },
            },
          ],
          responses: {
            200: {
              description: 'Матчі отримано з PandaScore',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Матчі отримано з PandaScore' },
                      count: { type: 'integer', example: 10 },
                      data: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/matches/archive': {
        get: {
          tags: ['Matches'],
          summary: 'Архів завершених матчів з фільтрами',
          parameters: [
            {
              name: 'teamId',
              in: 'query',
              required: false,
              description: 'Фільтр за командою',
              schema: { type: 'integer', example: 1 },
            },
            {
              name: 'year',
              in: 'query',
              required: false,
              description: 'Фільтр за роком',
              schema: { type: 'integer', example: 2024 },
            },
            {
              name: 'tournamentId',
              in: 'query',
              required: false,
              description: 'Фільтр за турніром',
              schema: { type: 'integer', example: 1 },
            },
            {
              name: 'page',
              in: 'query',
              required: false,
              description: 'Номер сторінки',
              schema: { type: 'integer', example: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              description: 'Кількість записів на сторінці',
              schema: { type: 'integer', example: 20 },
            },
          ],
          responses: {
            200: {
              description: 'Архів матчів отримано',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MatchArchiveResponse' },
                },
              },
            },
            500: {
              description: 'Помилка сервера',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
        '/api/tournaments/{id}/bracket': {
          get: {
            tags: ['Tournaments'],
            summary: 'Отримати турнірну сітку',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                description: 'ID турніру',
                schema: { type: 'integer', example: 1 },
              },
            ],
            responses: {
              200: {
                description: 'Турнірну сітку отримано',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Турнірну сітку отримано' },
                        data: {
                          type: 'object',
                          properties: {
                            tournamentId: { type: 'integer', example: 1 },
                            totalRounds: { type: 'integer', example: 3 },
                            rounds: {
                              type: 'object',
                              additionalProperties: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    bracketMatchId: { type: 'integer', example: 1 },
                                    position: { type: 'integer', example: 1 },
                                    nextBracketMatchId: {
                                      type: 'integer',
                                      nullable: true,
                                      example: 5,
                                    },
                                    match: { type: 'object', nullable: true },
                                    team1: { type: 'object', nullable: true },
                                    team2: { type: 'object', nullable: true },
                                    winner: { type: 'object', nullable: true },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              404: {
                description: 'Сітку не знайдено',
                content: {
                  'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
                },
              },
            },
          },
        },
      },
      '/api/players/{id}/transfers': {
        get: {
          tags: ['Players'],
          summary: 'Отримати історію трансферів гравця',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID гравця',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Історію трансферів отримано',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Історію трансферів отримано' },
                      count: { type: 'integer', example: 2 },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            transferId: { type: 'integer', example: 1 },
                            transferDate: { type: 'string', format: 'date', example: '2016-08-17' },
                            transferFee: { type: 'number', nullable: true, example: null },
                            status: {
                              type: 'string',
                              enum: ['confirmed', 'pending', 'cancelled'],
                              example: 'confirmed',
                            },
                            notes: {
                              type: 'string',
                              nullable: true,
                              example: 'Підписання з Natus Vincere',
                            },
                            player: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer', example: 1 },
                                nickname: { type: 'string', example: 's1mple' },
                                realName: { type: 'string', example: 'Oleksandr Kostyliev' },
                              },
                            },
                            fromTeam: {
                              type: 'object',
                              nullable: true,
                              properties: {
                                id: { type: 'integer', example: 3 },
                                name: { type: 'string', example: 'Astralis' },
                                logo: {
                                  type: 'string',
                                  example: 'https://cdn.example.com/astralis.png',
                                },
                              },
                            },
                            toTeam: {
                              type: 'object',
                              nullable: true,
                              properties: {
                                id: { type: 'integer', example: 1 },
                                name: { type: 'string', example: 'Natus Vincere' },
                                logo: {
                                  type: 'string',
                                  example: 'https://cdn.example.com/navi.png',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Історію трансферів не знайдено',
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
