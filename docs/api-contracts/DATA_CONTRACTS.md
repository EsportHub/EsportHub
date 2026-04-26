# Data Contracts

## Проєкт
**Esports Wiki Platform**

## Технологічний стек
- **Backend:** Node.js
- **Frontend:** React
- **Database:** MySQL

---

# 1. Опис

У межах проєкту **Esports Wiki Platform** було спроєктовано технічні контракти обміну даними між клієнтською частиною (**Frontend / React**) та серверною частиною (**Backend / Node.js**).

Метою даного етапу є фіксація чітких правил взаємодії між компонентами системи ще до початку реалізації API.

Підхід базується на принципі **Contracts over Code**, що дозволяє:
- паралельно розробляти Frontend і Backend;
- уникнути розбіжностей у форматах даних;
- стандартизувати обробку помилок;
- забезпечити єдиний підхід до структури API.

---

# 2. DTO Specification

## 2.1. Кейс: Отримання списку команд по країні

### Призначення
Користувач натискає на країну на інтерактивній карті та переглядає всі кіберспортивні команди цієї країни.

### Endpoint
`GET /api/v1/countries/{countryId}/teams`

### Request DTO
```json
{
  "countryId": "number"
}
````

### Response DTO (200 OK)

```json
{
  "country": {
    "countryId": 1,
    "name": "Ukraine",
    "code": "UA",
    "flag": "https://example.com/flags/ua.png"
  },
  "teams": [
    {
      "teamId": 12,
      "name": "NAVI",
      "logo": "https://example.com/logos/navi.png",
      "city": "Kyiv",
      "foundedDate": "2009-12-17"
    },
    {
      "teamId": 18,
      "name": "Monte",
      "logo": "https://example.com/logos/monte.png",
      "city": "Kyiv",
      "foundedDate": "2022-01-01"
    }
  ]
}
```

### Типи даних

* `countryId` — Number
* `name` — String
* `code` — String
* `flag` — String (URL)
* `teamId` — Number
* `logo` — String (URL)
* `city` — String
* `foundedDate` — ISO Date

### Задіяні таблиці БД

* `country`
* `team`
* `city`

---

## 2.2. Кейс: Додавання команди в "Обране"

### Призначення

Авторизований користувач додає команду до списку обраних.

### Endpoint

`POST /api/v1/favorite-teams`

### Request DTO

```json
{
  "userId": 5,
  "teamId": 12
}
```

### Response DTO (201 Created)

```json
{
  "favoriteId": 27,
  "userId": 5,
  "teamId": 12,
  "teamName": "NAVI",
  "createdAt": "2026-04-08T13:00:00Z"
}
```

### Типи даних

* `userId` — Number
* `teamId` — Number
* `favoriteId` — Number
* `teamName` — String
* `createdAt` — ISO DateTime

### Задіяні таблиці БД

* `user`
* `team`
* `favorite_team`

---

## 2.3. Кейс: Отримання K/D/A гравців у реальному часі

### Призначення

Користувач відкриває сторінку матчу та бачить статистику гравців у реальному часі.

### Endpoint

`GET /api/v1/matches/{matchId}/player-stats`

### Request DTO

```json
{
  "matchId": "number"
}
```

### Response DTO (200 OK)

```json
{
  "matchId": 44,
  "status": "LIVE",
  "players": [
    {
      "playerId": 101,
      "nickname": "s1mple",
      "teamId": 12,
      "kills": 18,
      "deaths": 9,
      "assists": 6
    },
    {
      "playerId": 102,
      "nickname": "b1t",
      "teamId": 12,
      "kills": 14,
      "deaths": 10,
      "assists": 4
    }
  ],
  "updatedAt": "2026-04-08T13:05:00Z"
}
```

### Типи даних

* `matchId` — Number
* `status` — String
* `playerId` — Number
* `nickname` — String
* `teamId` — Number
* `kills` — Number
* `deaths` — Number
* `assists` — Number
* `updatedAt` — ISO DateTime

### Задіяні таблиці БД

* `match`
* `player`
* `player_match_stats`
* `team`

---

## 2.4. Кейс: Отримання історії трансферів гравця

### Призначення

Користувач переглядає сторінку гравця та бачить історію його переходів між командами.

### Endpoint

`GET /api/v1/players/{playerId}/transfers`

### Request DTO

```json
{
  "playerId": "number"
}
```

### Response DTO (200 OK)

```json
{
  "playerId": 101,
  "nickname": "s1mple",
  "transfers": [
    {
      "transferId": 1,
      "oldTeam": "HellRaisers",
      "newTeam": "NAVI",
      "transferDate": "2016-08-04T00:00:00Z",
      "notes": "Main roster transfer"
    },
    {
      "transferId": 2,
      "oldTeam": "NAVI",
      "newTeam": "Falcons",
      "transferDate": "2025-01-15T00:00:00Z",
      "notes": "International transfer"
    }
  ]
}
```

### Типи даних

* `playerId` — Number
* `nickname` — String
* `transferId` — Number
* `oldTeam` — String
* `newTeam` — String
* `transferDate` — ISO DateTime
* `notes` — String

### Задіяні таблиці БД

* `player`
* `player_transfer`
* `team`

---

# 3. Global Error Schema

Для забезпечення однакової поведінки API у випадку помилок було визначено єдиний формат JSON-відповіді.

## Стандартна структура помилки

```json
{
  "timestamp": "2026-04-08T13:10:00Z",
  "errorCode": "TEAM_NOT_FOUND",
  "message": "Команду не знайдено",
  "path": "/api/v1/favorite-teams",
  "details": []
}
```

## Опис полів

* `timestamp` — час виникнення помилки у форматі ISO 8601
* `errorCode` — унікальний технічний код помилки
* `message` — текстовий опис помилки
* `path` — шлях API, на якому виникла помилка
* `details` — масив помилок валідації (опціонально)

## Приклад помилки валідації

```json
{
  "timestamp": "2026-04-08T13:12:00Z",
  "errorCode": "VALIDATION_ERROR",
  "message": "Некоректні дані запиту",
  "path": "/api/v1/favorite-teams",
  "details": [
    "Поле userId є обов'язковим",
    "Поле teamId має бути числом"
  ]
}
```

## Приклад бізнес-помилки

```json
{
  "timestamp": "2026-04-08T13:15:00Z",
  "errorCode": "TEAM_ALREADY_FAVORITED",
  "message": "Команда вже додана в обране",
  "path": "/api/v1/favorite-teams",
  "details": []
}
```

---

# 4. Status Code Map

| Код     | Назва                 | Коли використовується у проєкті                                                                  |
| ------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| **200** | OK                    | Успішне отримання списку команд по країні, статистики матчу або історії трансферів гравця        |
| **201** | Created               | Після успішного додавання команди в "Обране"                                                     |
| **400** | Bad Request           | Якщо `teamId`, `userId`, `playerId` або `matchId` мають неправильний формат або відсутні         |
| **401** | Unauthorized          | Якщо користувач не авторизований і намагається додати команду в "Обране" або створити сповіщення |
| **403** | Forbidden             | Якщо користувач не має прав на зміну або видалення даних                                         |
| **404** | Not Found             | Якщо не знайдено країну, команду, матч, гравця або турнір за вказаним ID                         |
| **409** | Conflict              | Якщо команда вже додана в "Обране" або порушено бізнес-логіку системи                            |
| **500** | Internal Server Error | Якщо сталася неочікувана помилка на сервері або недоступна база даних                            |

