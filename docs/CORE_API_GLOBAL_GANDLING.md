# Крок 3. Реалізація Core API та Global Handling

## Огляд

На цьому кроці реалізовано "культуру відповідей" сервера: централізована обробка помилок, моніторинг стану системи та системне логування всіх HTTP-запитів.

---

## 1. Скелет контролерів (Core API)

Реалізовано базові ендпоінти MVP у рамках RESTful архітектури.

**Структура маршрутів (`server.js`):**

```javascript
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', coreRoutes);
```

Кожен роутер підключений до окремого файлу маршрутизації, що забезпечує чітке розділення відповідальності. Ендпоінти повертають стандартизований JSON у всіх випадках — як успішних, так і при помилках.

---

## 2. Global Exception Handler

**Файл:** `src/presentation/middlewares/errorHandler.js`

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || (statusCode === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const message = err.message || 'Внутрішня помилка сервера';

  logger.error(`${statusCode} - ${errorCode} - ${message} - [${req.method}] ${req.originalUrl}`);

  res.status(statusCode).json({
    timestamp: new Date().toISOString(),
    errorCode: errorCode,
    message: message,
  });
};
```

**Принцип роботи:**

Express розпізнає middleware з 4 параметрами `(err, req, res, next)` як обробник помилок. Будь-який виклик `next(error)` у будь-якому роуті автоматично перенаправляє помилку сюди.

**Формат відповіді при помилці:**

```json
{
  "timestamp": "2026-04-22T21:33:47.818Z",
  "errorCode": "VALIDATION_FAILED",
  "message": "Тестова критична помилка!"
}
```

**Важливо:** обробник зареєстрований останнім у `server.js`, після всіх роутів — це обов'язкова вимога Express:

```javascript
app.use(errorHandler); // завжди останній
```

**Тестовий ендпоінт:**

```
GET /api/test-error → 400 VALIDATION_FAILED
```

Сервер ніколи не повертає порожню відповідь або "сирий" traceback — лише стандартизований JSON.

---

## 3. Health Check Endpoint

**Маршрут:** `GET /health`

**Доступний без авторизації.**

Ендпоінт виконує реальний запит до бази даних (`SELECT 1`) і повертає стан системи.

**Відповідь при успішному підключенні (200 OK):**

```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2026-04-22T21:34:33.535Z"
}
```

**Відповідь при недоступній БД (503 Service Unavailable):**

```json
{
  "status": "ERROR",
  "database": "Disconnected",
  "timestamp": "..."
}
```

---

## 4. Система логування

**Використані бібліотеки:** Morgan + Winston

**Файл:** `src/utils/logger.js` (Winston)

**Налаштування у `server.js`:**

```javascript
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
```

**Принцип роботи:**

- **Morgan** — HTTP middleware, що перехоплює кожен вхідний запит і формує рядок лога у форматі `МЕТОД ШЛЯХ СТАТУС ЧАС`.
- **Winston** — системний logger, що записує цей рядок у консоль з міткою часу та рівнем `INFO`.

**Приклад логів у Docker консолі:**

```
esporthub-backend | [2026-04-22 21:17:31] INFO: GET /api/teams 200 4.583 ms
esporthub-backend | [2026-04-22 21:17:31] INFO: GET /health 200 1.234 ms
esporthub-backend | [2026-04-22 21:33:47] ERROR: 400 - VALIDATION_FAILED - Тестова помилка - [GET] /api/test-error
```

Кожен запит фіксується з:

- **Методом** — GET, POST, PUT, DELETE
- **Шляхом** — /api/teams, /health тощо
- **Статус-кодом** — 200, 400, 404, 500
- **Часом виконання** — у мілісекундах

`console.log` у коді не використовується — весь вивід йде через Winston.

---

## Результат

| Вимога                       | Статус      | Перевірка                      |
| ---------------------------- | ----------- | ------------------------------ |
| Скелет контролерів           | ✅ Виконано | GET /api/teams → 200           |
| Global Exception Handler     | ✅ Виконано | GET /api/test-error → 400 JSON |
| Health Check                 | ✅ Виконано | GET /health → 200 JSON         |
| Логування запитів            | ✅ Виконано | Логи у Docker консолі          |
| Сервер не повертає traceback | ✅ Виконано | Лише JSON у всіх випадках      |
