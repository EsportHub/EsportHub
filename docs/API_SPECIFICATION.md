# Специфікація API (MVP)

Цей документ описує ключові ендпоінти для 3-х базових функцій платформи EsportHub: Каталог матчів, Система "Обране" та Інтерактивна мапа (Global Esports Atlas).

## 1. Реєстр ресурсів (Endpoints Table)

| Метод | Шлях (Endpoint) | Опис дії | Параметри (Body / Path / Query) | Доступ (Roles) | Успішна відповідь | Можливі помилки (Status & Reason) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/matches` | Отримання розкладу майбутніх матчів та архіву результатів | `query`: game, status, page | Public (Всі) | 200 OK (Array of Match Objects) | **400** (Невалідні параметри фільтрації, напр., невідома дисципліна) |
| **GET** | `/api/v1/atlas/markers` | Отримання геоданих команд/гравців для Інтерактивної мапи | `query`: countryIso, entityType | Public (Всі) | 200 OK (Array of Map Markers) | **400** (Невірний формат ISO-коду країни або типу сутності) |
| **POST** | `/api/v1/users/favorites/teams` | Додавання команди до персонального списку "Обране" | `body`: teamId | User | 201 Created (Updated Favorites List) | **401** (Відсутній токен), **404** (Команду не знайдено), **409** (Конфлікт: команда вже є в обраному) |
| **DELETE** | `/api/v1/users/favorites/teams/{id}` | Видалення команди з персонального списку "Обране" | `path`: id (ID команди) | User | 204 No Content | **401** (Відсутній токен), **404** (Команда відсутня у списку підписок) |
| **PATCH** | `/api/v1/users/profile` | Оновлення налаштувань профілю (напр. увімкнення Dark Mode) | `body`: theme, notifications | User | 200 OK (Updated Profile Object) | **401** (Відсутній токен), **400** (Передано непідтримувану тему) |

---

## 2. Специфікація контрактів

### 2.1. Отримання розкладу матчів (Каталог матчів)
* **Ендпоінт:** `GET /api/v1/matches`
* **Призначення:** Завантаження списку матчів для головної сторінки.
* **Query Params:** `?status=upcoming&game=cs2&page=1`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "matchId": "m-889900",
      "game": "cs2",
      "status": "upcoming",
      "startTime": "2026-05-15T18:00:00Z",
      "format": "BO3",
      "tournament": "IEM Cologne 2026",
      "teamA": { "id": "t-11", "name": "NAVI", "logoUrl": "/logos/navi.png" },
      "teamB": { "id": "t-22", "name": "FaZe", "logoUrl": "/logos/faze.png" }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5
  }
}