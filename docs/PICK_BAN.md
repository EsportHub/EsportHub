# API для отримання Pick/Ban етапу

## Огляд

Реалізовано API ендпоінт для отримання pick/ban фази матчу. Повертає повну послідовність дій (бани, піки, залишена мапа) з інформацією про команди та мапи.

---

## Архітектура

```
GET /api/matches/:matchId/pickban
     │
     ▼
matchMapPhaseController
     │
     ▼
matchMapPhaseService
     │
     ▼
matchMapPhaseRepository
     │
     ▼
MySQL (match_map_phase JOIN map JOIN team)
```

---

## Структура файлів

```
server/src/
├── infrastructure/repositories/
│   └── matchMapPhaseRepository.js
├── application/services/
│   └── matchMapPhaseService.js
└── presentation/
    ├── controllers/
    │   └── matchMapPhaseController.js
    └── routes/
        └── match.routes.js
```

---

## Ендпоінт

### GET /api/matches/:matchId/pickban

Повертає повний pick/ban етап для вказаного матчу.

**Параметри:**

| Параметр  | Тип     | Опис     |
| --------- | ------- | -------- |
| `matchId` | integer | ID матчу |

**Приклад запиту:**

```
GET http://localhost:5000/api/matches/1/pickban
```

**Відповідь (200 OK):**

```json
{
  "message": "Pick/ban фаза успішно отримана",
  "data": {
    "matchId": "1",
    "total": 7,
    "phases": [
      {
        "phase_id": 1,
        "order_number": 1,
        "action_type": "ban",
        "map_name": "Dust2",
        "team_name": "Natus Vincere",
        "team_logo": "https://..."
      },
      {
        "phase_id": 3,
        "order_number": 3,
        "action_type": "pick",
        "map_name": "Mirage",
        "team_name": "Natus Vincere",
        "team_logo": "https://..."
      }
    ],
    "summary": {
      "bans": [...],
      "picks": [...],
      "left": [...]
    }
  }
}
```

**При відсутності даних (404 Not Found):**

```json
{
  "timestamp": "...",
  "errorCode": "NOT_FOUND",
  "message": "Pick/ban фаза для цього матчу не знайдена"
}
```

---

## Типи дій (action_type)

| Тип    | Опис                                      |
| ------ | ----------------------------------------- |
| `ban`  | Команда забанила мапу                     |
| `pick` | Команда вибрала мапу                      |
| `left` | Мапа залишилась після всіх банів та піків |

---

## Структура БД

**Таблиця `match_map_phase`:**

| Поле           | Тип     | Опис                                  |
| -------------- | ------- | ------------------------------------- |
| `phase_id`     | INT     | Первинний ключ                        |
| `match_id`     | INT     | ID матчу (FK → match)                 |
| `team_id`      | INT     | ID команди (FK → team, NULL для left) |
| `map_id`       | INT     | ID мапи (FK → map)                    |
| `action_type`  | VARCHAR | Тип дії: ban/pick/left                |
| `order_number` | INT     | Порядковий номер дії                  |

---

## Тестові дані (матч 1: NaVi vs Astralis)

| #   | Дія  | Мапа    | Команда       |
| --- | ---- | ------- | ------------- |
| 1   | ban  | Dust2   | Natus Vincere |
| 2   | ban  | Ancient | Astralis      |
| 3   | pick | Mirage  | Natus Vincere |
| 4   | pick | Inferno | Astralis      |
| 5   | ban  | Anubis  | Natus Vincere |
| 6   | ban  | Vertigo | Astralis      |
| 7   | left | Nuke    | —             |

---

## Результат перевірки

```
GET /api/matches/1/pickban → 200 OK
- Всього фаз: 7
- Банів: 4
- Піків: 2
- Залишилась: 1
```

Ендпоінт працює коректно і повертає повну pick/ban послідовність з даними команд та мап.
