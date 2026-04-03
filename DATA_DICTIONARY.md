# Словник даних — Esports Wiki Platform

## Загальна інформація
Цей документ описує фізичну модель даних бази даних **Esports Wiki Platform**.  
Він містить опис усіх сутностей (таблиць), їхніх атрибутів (полів), типів даних, обмежень, ключів і зв’язків.

### Конвенції іменування
Усі назви в базі даних відповідають прийнятому **Code Style Guide**:
- назви таблиць — `snake_case`
- назви колонок — `snake_case`
- первинні ключі — `<table>_id`
- зовнішні ключі — `<referenced_table>_id`

---

# 1. `country`

## Опис
Таблиця зберігає інформацію про країни, які використовуються для прив’язки команд, гравців і фільтрації на карті.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| country_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор країни |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Назва країни |
| code | VARCHAR(10) | NOT NULL, UNIQUE | Код країни (наприклад, UA, US) |
| flag | VARCHAR(255) | NULL | Шлях або URL до прапора |
| description | TEXT | NULL | Додатковий опис країни |

---

# 2. `city`

## Опис
Таблиця зберігає інформацію про міста, які використовуються для команд і арен.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| city_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор міста |
| name | VARCHAR(100) | NOT NULL | Назва міста |
| country_id | INT | FK, NOT NULL | Посилання на таблицю `country(country_id)` |

---

# 3. `team`

## Опис
Таблиця містить інформацію про кіберспортивні команди.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| team_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор команди |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Назва команди |
| country_id | INT | FK, NULL | Посилання на таблицю `country(country_id)` |
| city_id | INT | FK, NULL | Посилання на таблицю `city(city_id)` |
| founded_date | DATE | NULL | Дата заснування команди |
| logo | VARCHAR(255) | NULL | Шлях або URL до логотипу |
| description | TEXT | NULL | Опис команди |

---

# 4. `player`

## Опис
Таблиця зберігає інформацію про кіберспортсменів.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| player_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор гравця |
| nickname | VARCHAR(100) | NOT NULL, UNIQUE | Ігровий нікнейм |
| real_name | VARCHAR(100) | NULL | Справжнє ім’я гравця |
| country_id | INT | FK, NULL | Посилання на таблицю `country(country_id)` |
| birth_date | DATE | NULL | Дата народження |
| team_id | INT | FK, NULL | Посилання на таблицю `team(team_id)` |

---

# 5. `game`

## Опис
Таблиця містить інформацію про кіберспортивні дисципліни / ігри.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| game_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор гри |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Назва гри |
| genre | VARCHAR(100) | NULL | Жанр гри |
| developer | VARCHAR(100) | NULL | Розробник гри |

---

# 6. `arena`

## Опис
Таблиця зберігає інформацію про кіберспортивні арени та LAN-локації.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| arena_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор арени |
| name | VARCHAR(100) | NOT NULL | Назва арени |
| city_id | INT | FK, NULL | Посилання на таблицю `city(city_id)` |
| capacity | INT | NULL | Місткість арени |
| latitude | DECIMAL(9,6) | NULL | Географічна широта |
| longitude | DECIMAL(9,6) | NULL | Географічна довгота |

---

# 7. `tournament`

## Опис
Таблиця містить інформацію про кіберспортивні турніри.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| tournament_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор турніру |
| name | VARCHAR(150) | NOT NULL | Назва турніру |
| game_id | INT | FK, NULL | Посилання на таблицю `game(game_id)` |
| arena_id | INT | FK, NULL | Посилання на таблицю `arena(arena_id)` |
| start_date | DATE | NOT NULL | Дата початку турніру |
| end_date | DATE | NOT NULL | Дата завершення турніру |
| prize_pool | DECIMAL(12,2) | NULL | Призовий фонд |

---

# 8. `team_game`

## Опис
Проміжна таблиця для реалізації зв’язку **багато-до-багатьох** між командами та іграми.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор зв’язку |
| team_id | INT | FK, NOT NULL | Посилання на таблицю `team(team_id)` |
| game_id | INT | FK, NOT NULL | Посилання на таблицю `game(game_id)` |

---

# 9. `tournament_team`

## Опис
Проміжна таблиця для реалізації зв’язку **багато-до-багатьох** між турнірами та командами.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор зв’язку |
| tournament_id | INT | FK, NOT NULL | Посилання на таблицю `tournament(tournament_id)` |
| team_id | INT | FK, NOT NULL | Посилання на таблицю `team(team_id)` |
| place | INT | NULL | Місце команди на турнірі |

---

# 10. `map_marker`

## Опис
Таблиця зберігає маркери для інтерактивної карти кіберспорту.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| marker_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор маркера |
| type | VARCHAR(50) | NOT NULL | Тип маркера (team, tournament, arena) |
| entity_id | INT | NOT NULL | Ідентифікатор пов’язаної сутності |
| latitude | DECIMAL(9,6) | NOT NULL | Географічна широта |
| longitude | DECIMAL(9,6) | NOT NULL | Географічна довгота |

---

# 11. `article`

## Опис
Таблиця містить статті у форматі вікі-сторінок.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| article_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор статті |
| title | VARCHAR(200) | NOT NULL | Заголовок статті |
| content | TEXT | NOT NULL | Основний текст статті |
| created_at | DATETIME | NOT NULL | Дата та час створення |
| updated_at | DATETIME | NULL | Дата та час останнього оновлення |

---

# 12. `match`

## Опис
Таблиця зберігає інформацію про кіберспортивні матчі.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| match_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор матчу |
| team1_id | INT | FK, NULL | Посилання на першу команду `team(team_id)` |
| team2_id | INT | FK, NULL | Посилання на другу команду `team(team_id)` |
| tournament_id | INT | FK, NOT NULL | Посилання на таблицю `tournament(tournament_id)` |
| score_team1 | INT | DEFAULT 0 | Рахунок першої команди |
| score_team2 | INT | DEFAULT 0 | Рахунок другої команди |
| status | VARCHAR(50) | NOT NULL | Статус матчу |
| start_time | DATETIME | NOT NULL | Дата та час початку матчу |

---

# 13. `match_event`

## Опис
Таблиця зберігає події матчу в реальному часі.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| event_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор події |
| match_id | INT | FK, NOT NULL | Посилання на таблицю `match(match_id)` |
| event_type | VARCHAR(50) | NOT NULL | Тип події |
| event_time | DATETIME | NOT NULL | Дата та час події |
| description | TEXT | NULL | Опис події |

---

# 14. `map`

## Опис
Таблиця містить ігрові карти, доступні в певних кіберспортивних дисциплінах.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| map_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор карти |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Назва карти |
| game_id | INT | FK, NOT NULL | Посилання на таблицю `game(game_id)` |

---

# 15. `match_map_phase`

## Опис
Таблиця зберігає інформацію про етапи Pick/Ban карт у матчі.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| phase_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор фази |
| match_id | INT | FK, NOT NULL | Посилання на таблицю `match(match_id)` |
| team_id | INT | FK, NULL | Посилання на таблицю `team(team_id)` |
| map_id | INT | FK, NULL | Посилання на таблицю `map(map_id)` |
| action_type | VARCHAR(20) | NOT NULL | Тип дії (pick / ban) |
| order_number | INT | NOT NULL | Порядковий номер дії |

---

# 16. `player_match_stats`

## Опис
Таблиця зберігає статистику K/D/A гравців у конкретному матчі.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| stats_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор статистики |
| player_id | INT | FK, NULL | Посилання на таблицю `player(player_id)` |
| match_id | INT | FK, NOT NULL | Посилання на таблицю `match(match_id)` |
| kills | INT | DEFAULT 0 | Кількість вбивств |
| deaths | INT | DEFAULT 0 | Кількість смертей |
| assists | INT | DEFAULT 0 | Кількість асистів |

---

# 17. `user`

## Опис
Таблиця містить інформацію про зареєстрованих користувачів платформи.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| user_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор користувача |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Ім’я користувача |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Електронна пошта |
| password_hash | VARCHAR(255) | NOT NULL | Хеш пароля |
| theme_preference | VARCHAR(10) | NULL | Налаштування теми інтерфейсу |

---

# 18. `favorite_team`

## Опис
Таблиця зберігає команди, які користувач додав до обраного.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор запису |
| user_id | INT | FK, NOT NULL | Посилання на таблицю `user(user_id)` |
| team_id | INT | FK, NOT NULL | Посилання на таблицю `team(team_id)` |
| created_at | DATETIME | NOT NULL | Дата та час додавання в обране |

---

# 19. `notification`

## Опис
Таблиця зберігає нагадування та сповіщення про матчі.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| notification_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор сповіщення |
| user_id | INT | FK, NOT NULL | Посилання на таблицю `user(user_id)` |
| match_id | INT | FK, NOT NULL | Посилання на таблицю `match(match_id)` |
| message | TEXT | NOT NULL | Текст сповіщення |
| send_time | DATETIME | NOT NULL | Дата та час відправлення |
| status | VARCHAR(50) | NOT NULL | Статус сповіщення |

---

# 20. `player_transfer`

## Опис
Таблиця містить історію трансферів гравців між командами.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| transfer_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор трансферу |
| player_id | INT | FK, NOT NULL | Посилання на таблицю `player(player_id)` |
| old_team_id | INT | FK, NULL | Посилання на попередню команду `team(team_id)` |
| new_team_id | INT | FK, NULL | Посилання на нову команду `team(team_id)` |
| transfer_date | DATETIME | NOT NULL | Дата трансферу |
| notes | TEXT | NULL | Додаткові примітки |

---

# 21. `bracket_match`

## Опис
Таблиця зберігає матчі турнірної сітки.

| Назва поля | Тип даних | Обмеження | Опис |
|------------|-----------|-----------|------|
| bracket_match_id | INT | PK, NOT NULL, AUTO_INCREMENT | Унікальний ідентифікатор матчу сітки |
| tournament_id | INT | FK, NOT NULL | Посилання на таблицю `tournament(tournament_id)` |
| round_name | VARCHAR(50) | NOT NULL | Назва раунду (наприклад, Quarterfinal, Semifinal, Final) |
| team1_id | INT | FK, NULL | Посилання на першу команду `team(team_id)` |
| team2_id | INT | FK, NULL | Посилання на другу команду `team(team_id)` |
| winner_id | INT | FK, NULL | Посилання на команду-переможця `team(team_id)` |

---

# Підсумок зв’язків

## One-to-Many (1:N)
- `country → city`
- `country → team`
- `country → player`
- `city → team`
- `city → arena`
- `team → player`
- `game → tournament`
- `arena → tournament`
- `tournament → match`
- `match → match_event`
- `game → map`
- `match → match_map_phase`
- `player → player_match_stats`
- `user → favorite_team`
- `user → notification`
- `player → player_transfer`
- `tournament → bracket_match`

## Many-to-Many (M:N)
- `team ↔ game` (через `team_game`)
- `team ↔ tournament` (через `tournament_team`)