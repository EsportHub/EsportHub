# Наскрізне тестування (Integration Tests)

## Огляд

Реалізовано наскрізні тести які перевіряють повний шлях: **HTTP запит → бізнес-логіка → реальна БД → відповідь**. На відміну від unit-тестів — тут не використовується mocking, всі запити йдуть через реальне підключення до MySQL.

---

## Технології

- **Jest** — тестовий фреймворк
- **Supertest** — бібліотека для HTTP запитів у тестах

---

## Структура

```
server/
└── tests/
    └── integration.test.js
```

---

## Як запустити тести

**1. Переконайся що контейнери запущені:**

```cmd
docker compose up -d
```

**2. Запусти тести всередині контейнера:**

```cmd
docker exec -it esporthub-backend sh -c "npm test"
```

**Очікуваний результат:**

```
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        1.73 s
```

---

## Тести

### Тест 1 — POST /api/auth/register (успішна реєстрація)

**Сценарій:** відправляємо коректні дані для реєстрації.

**Запит:**

```json
POST /api/auth/register
{
  "username": "testuser123",
  "email": "testuser123@test.com",
  "password": "123456"
}
```

**Очікувана відповідь (201 Created):**

```json
{
  "message": "Акаунт успішно створено",
  "user": {
    "userId": 1,
    "username": "testuser123",
    "email": "testuser123@test.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Що перевіряється:**

- Статус відповіді `201`
- Наявність поля `token`
- Наявність поля `user`
- Коректність `email` та `username` у відповіді

**Результат:** ✅ passed (204 ms)

---

### Тест 2 — POST /api/auth/register (дублікат email)

**Сценарій:** намагаємось зареєструватись з email що вже існує в БД.

**Запит:**

```json
POST /api/auth/register
{
  "username": "anotheruser",
  "email": "testuser123@test.com",
  "password": "123456"
}
```

**Очікувана відповідь (409 Conflict):**

```json
{
  "timestamp": "...",
  "errorCode": "EMAIL_ALREADY_EXISTS",
  "message": "Користувач з таким email вже існує"
}
```

**Що перевіряється:**

- Статус відповіді `409`
- `errorCode` дорівнює `EMAIL_ALREADY_EXISTS`

**Результат:** ✅ passed (22 ms)

---

### Тест 3 — POST /api/auth/register (некоректні дані)

**Сценарій:** відправляємо дані що не проходять Joi валідацію.

**Запит:**

```json
POST /api/auth/register
{
  "username": "ab",
  "email": "not-an-email",
  "password": "123"
}
```

**Очікувана відповідь (400 Bad Request):**

```json
{
  "timestamp": "...",
  "errorCode": "VALIDATION_ERROR",
  "message": "username має бути не менше 3 символів; email має бути валідною адресою; password має бути не менше 6 символів"
}
```

**Що перевіряється:**

- Статус відповіді `400`
- `errorCode` дорівнює `VALIDATION_ERROR`

**Результат:** ✅ passed (8 ms)

---

### Тест 4 — GET /api/teams (список команд)

**Сценарій:** отримуємо список всіх команд з БД.

**Запит:**

```
GET /api/teams
```

**Очікувана відповідь (200 OK):**

```json
{
  "message": "Список команд успішно отримано",
  "count": 4,
  "data": [...]
}
```

**Що перевіряється:**

- Статус відповіді `200`
- Наявність поля `data`
- `data` є масивом

**Результат:** ✅ passed (11 ms)

---

### Тест 5 — GET /api/teams (структура команди)

**Сценарій:** перевіряємо що кожна команда містить необхідні поля.

**Що перевіряється:**

- Наявність поля `team_id`
- Наявність поля `name`

**Результат:** ✅ passed (9 ms)

---

### Тест 6 — GET /api/teams/99999 (команда не існує)

**Сценарій:** запитуємо команду з неіснуючим ID.

**Запит:**

```
GET /api/teams/99999
```

**Очікувана відповідь (404 Not Found):**

```json
{
  "timestamp": "...",
  "errorCode": "NOT_FOUND",
  "message": "Команду не знайдено"
}
```

**Що перевіряється:**

- Статус відповіді `404`
- `errorCode` дорівнює `NOT_FOUND`

**Результат:** ✅ passed (43 ms)

---

## Підсумок

```
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        1.73 s
```

| Тест               | Метод | URL                | Статус    |
| ------------------ | ----- | ------------------ | --------- |
| Успішна реєстрація | POST  | /api/auth/register | ✅ passed |
| Дублікат email     | POST  | /api/auth/register | ✅ passed |
| Некоректні дані    | POST  | /api/auth/register | ✅ passed |
| Список команд      | GET   | /api/teams         | ✅ passed |
| Структура команди  | GET   | /api/teams         | ✅ passed |
| Команда не існує   | GET   | /api/teams/99999   | ✅ passed |

Всі 6 наскрізних тестів пройшли успішно. Кожен тест перевіряє повний шлях від HTTP запиту через бізнес-логіку до реальної бази даних.
