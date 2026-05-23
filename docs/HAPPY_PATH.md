# Крок 4. Розробка "Happy Path" бізнес-логіки (Service Layer)

## Огляд

На цьому кроці реалізовано повноцінну бізнес-логіку проєкту за принципом Clean Architecture. Логіку розділено на чіткі рівні: Controller → Service → Repository → DB. Додано валідацію вхідних даних через Joi.

---

## Архітектура

```
HTTP Request
     │
     ▼
Controller        ← обробляє HTTP, викликає Service
     │
     ▼
Service           ← бізнес-логіка, перевірки, правила
     │
     ▼
Repository        ← робота з БД (SQL-запити)
     │
     ▼
MySQL Database
```

---

## 1. Service Layer

Логіку повністю виділено в окремі класи-сервіси, відділені від HTTP-контролерів.

### TeamService

**Файл:** `src/application/services/teamService.js`

```javascript
class TeamService {
  async getAllTeams() {
    return await teamRepository.findAll();
  }

  async getTeamById(id) {
    const team = await teamRepository.findById(id);
    if (!team) {
      const error = new Error('Команду не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return team;
  }
}
```

### TournamentService

**Файл:** `src/application/services/tournamentService.js`

Аналогічна структура — отримання всіх турнірів та турніру за ID з перевіркою існування.

### FavoriteService

**Файл:** `src/application/services/favoriteService.js`

Містить бізнес-логіку для роботи з обраними командами:

- Перевірка існування команди перед додаванням
- Перевірка дублікатів (команда вже в обраному → 409 ALREADY_EXISTS)
- Перевірка наявності перед видаленням

---

## 2. Repository Layer

Репозиторії відповідають виключно за роботу з БД. Вся SQL-логіка зосереджена тут.

### TeamRepository

**Файл:** `src/infrastructure/repositories/teamRepository.js`

```javascript
class TeamRepository {
  async findAll() {
    const [teams] = await db.sequelize.query(`
      SELECT t.team_id, t.name, t.founded_date, t.logo, t.description,
             c.name AS country, ci.name AS city
      FROM team t
      LEFT JOIN country c ON t.country_id = c.country_id
      LEFT JOIN city ci ON t.city_id = ci.city_id
      ORDER BY t.team_id
    `);
    return teams;
  }
}
```

### TournamentRepository

**Файл:** `src/infrastructure/repositories/tournamentRepository.js`

Повертає турніри з приєднаними даними гри та арени через LEFT JOIN.

### FavoriteRepository

**Файл:** `src/infrastructure/repositories/favoriteRepository.js`

Методи: `findByUserId`, `exists`, `create`, `delete` — повний CRUD для таблиці `favorite_team`.

---

## 3. Сценарії бізнес-логіки

### Сценарій 1 — Отримання списку команд

**Маршрут:** `GET /api/teams`

**Наскрізний шлях:**

```
coreController.getTeams
  → teamService.getAllTeams()
    → teamRepository.findAll()
      → SELECT з JOIN по country та city
```

**Відповідь (200 OK):**

```json
{
  "message": "Список команд успішно отримано",
  "count": 4,
  "data": [
    {
      "team_id": 1,
      "name": "Natus Vincere",
      "country": "Ukraine",
      "city": "Kyiv",
      "founded_date": "2009-12-17"
    }
  ]
}
```

---

### Сценарій 2 — Отримання списку турнірів

**Маршрут:** `GET /api/tournaments`

**Наскрізний шлях:**

```
coreController.getTournaments
  → tournamentService.getAllTournaments()
    → tournamentRepository.findAll()
      → SELECT з JOIN по game та arena
```

**Відповідь (200 OK):**

```json
{
  "message": "Список турнірів успішно отримано",
  "count": 2,
  "data": [
    {
      "tournament_id": 1,
      "name": "ESL Pro League 2026",
      "game": "CS2",
      "arena": "Kyiv Arena",
      "prize_pool": "500000.00"
    }
  ]
}
```

---

### Сценарій 3 — Додавання команди в обране

**Маршрут:** `POST /api/users/favorites/teams`

**Тіло запиту:**

```json
{
  "user_id": 1,
  "team_id": 2
}
```

**Наскрізний шлях:**

```
user.routes → validateAddFavoriteTeam (Joi)
  → favoriteService.addFavoriteTeam(userId, teamId)
    → teamRepository.findById()        ← перевірка існування команди
    → favoriteRepository.exists()      ← перевірка дублікату
    → favoriteRepository.create()      ← INSERT в БД
```

**Відповідь (201 Created):**

```json
{
  "userId": 1,
  "teamId": 2,
  "message": "Команду додано до обраного"
}
```

**При дублікаті (409 Conflict):**

```json
{
  "timestamp": "...",
  "errorCode": "ALREADY_EXISTS",
  "message": "Команда вже є в обраному"
}
```

---

## 4. DTO Validation

**Файл:** `src/presentation/dto/favoriteDto.js`

**Бібліотека:** Joi

```javascript
const addFavoriteTeamSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  team_id: Joi.number().integer().positive().required(),
});
```

Валідатор підключений як middleware до роута:

```javascript
router.post('/favorites/teams', validateAddFavoriteTeam, async (req, res, next) => { ... });
```

**При некоректних даних (400 Bad Request):**

```json
{
  "timestamp": "...",
  "errorCode": "VALIDATION_ERROR",
  "message": "user_id має бути числом"
}
```

Сервер ніколи не падає при некоректному вводі — завжди повертає зрозумілий JSON.

---

## Результат

| Ендпоінт                         | Метод  | Статус       | Опис                  |
| -------------------------------- | ------ | ------------ | --------------------- |
| `/api/teams`                     | GET    | ✅ 200       | Список команд з БД    |
| `/api/teams/:id`                 | GET    | ✅ 200 / 404 | Команда за ID         |
| `/api/tournaments`               | GET    | ✅ 200       | Список турнірів з БД  |
| `/api/tournaments/:id`           | GET    | ✅ 200 / 404 | Турнір за ID          |
| `/api/users/favorites/teams`     | POST   | ✅ 201       | Додати в обране       |
| `/api/users/favorites/teams`     | DELETE | ✅ 200       | Видалити з обраного   |
| `/api/users/:id/favorites/teams` | GET    | ✅ 200       | Список обраних команд |
