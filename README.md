# EsportHub

![Status](https://img.shields.io/badge/Status-In%20Development-7C3AED?style=flat-square&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-6D28D9?style=flat-square&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-v24.14.1-1e1e2e?style=flat-square&logo=nodedotjs&logoColor=a78bfa)
![Express](https://img.shields.io/badge/Express-5.x-1e1e2e?style=flat-square&logo=express&logoColor=a78bfa)
![MySQL](https://img.shields.io/badge/MySQL-8.0-1e1e2e?style=flat-square&logo=mysql&logoColor=a78bfa)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-1e1e2e?style=flat-square&logo=sequelize&logoColor=a78bfa)
![Docker](https://img.shields.io/badge/Docker-Compose-1e1e2e?style=flat-square&logo=docker&logoColor=a78bfa)
![React](https://img.shields.io/badge/React-Frontend-1e1e2e?style=flat-square&logo=react&logoColor=a78bfa)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-1e1e2e?style=flat-square&logo=socketdotio&logoColor=a78bfa)
![ESLint](https://img.shields.io/badge/ESLint-Airbnb-1e1e2e?style=flat-square&logo=eslint&logoColor=a78bfa)
![PandaScore](https://img.shields.io/badge/PandaScore-API-1e1e2e?style=flat-square&logo=pandas&logoColor=a78bfa)

**EsportHub** — це відкрита цифрова енциклопедія та база знань про світ кіберспорту. Проєкт працює за принципом Вікіпедії, дозволяючи спільноті збирати, структурувати та зберігати історію гравців, команд, турнірів та ігрових патчів в одному місці.

---

## Ключові можливості (Wiki Features)

- **Global Search**: Потужний пошук по гравцях, організаціях та історичних подіях.
- **Collaborative Editing**: Система вільного редагування статей з контролем версій.
- **Categorized Database**: Структуровані дані про трансфери, призові фонди та статистику турнірів.
- **Infoboxes**: Автоматизовані картки швидкої інформації для кожної сторінки (як у Вікіпедії).

---

## Killer Feature: Interactive Esports Map

- **Geospatial Discovery**: Натискайте на будь-яку країну на мапі, щоб миттєво отримати список топ-команд, провідних гравців та статистику кіберспортивної активності в цьому регіоні.
- **Real-time Data**: Всі дані підтягуються безпосередньо з нашої бази даних, забезпечуючи актуальність інформації.

---

## Технологічний стек (Tech Stack)

| Сфера | Технології |
| :--- | :--- |
| **Frontend** | React |
| **Backend** | Node.js, Express, Sequelize ORM |
| **Database** | MySQL 8.0 |
| **External API** | PandaScore |
| **Real-time** | Socket.IO, node-cron |
| **DevOps** | Docker, Docker Compose |
| **Automation** | ESLint (Airbnb Guide), Prettier |

---

## Системні вимоги (Pre-requisites)

| Інструмент | Версія | Перевірка |
| :--- | :--- | :--- |
| **Docker** | 24.0+ | `docker --version` |
| **Docker Compose** | 2.20+ | `docker compose version` |
| **Git** | будь-яка | `git --version` |
| **RAM** | мінімум 4 GB | — |
| **CPU** | мінімум 2 ядра | — |

> Node.js та MySQL **не потрібні локально** — все запускається всередині Docker-контейнерів.
> Внутрішня версія Node.js у контейнері: **v24.14.1**, MySQL: **8.0**.

---

## Початок роботи (Getting Started)

### Встановлення через Docker (рекомендовано)

1. **Клонуйте репозиторій:**
    ```bash
    git clone https://github.com/EsportHub/EsportHub.git
    cd EsportHub
    ```

2. **Створіть файл `.env`:**
    ```bash
    cp .env.example .env
    ```
    Відкрийте `.env` та заповніть `PANDASCORE_API_KEY` і `JWT_SECRET` (деталі — у розділі [Змінні середовища](#змінні-середовища-environment-variables)).

3. **Запустіть всі сервіси:**
    ```bash
    docker-compose up --build
    ```
    Перший запуск займає ~2–3 хвилини (завантаження образів + міграції + seed).

Після запуску:
- Фронтенд: http://localhost:3000
- Бекенд API: http://localhost:5000
- Swagger UI: http://localhost:5000/api-docs

### Зупинка

```bash
# Зупинити сервіси
docker-compose down

# Зупинити та видалити дані БД
docker-compose down -v
```

---

## База даних (Migrations & Seed)

Міграції та seed-дані запускаються **автоматично** при першому `docker-compose up --build`.

Якщо потрібно запустити вручну (всередині контейнера):

```bash
# Увійти в контейнер бекенду
docker exec -it esport_hub_server sh

# Запустити міграції
npx sequelize-cli db:migrate

# Наповнити базу тестовими даними
npx sequelize-cli db:seed:all

# Скинути та перезапустити з нуля
npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
```

### Що є в seed-даних

| Сутність | Кількість | Приклад |
| :--- | :--- | :--- |
| Гравці | 20 | s1mple, NiKo, Faker |
| Команди | 10 | Natus Vincere, Team Liquid |
| Трансфери | 30+ | реальні переходи 2021–2024 |
| Турніри | 8 | ESL Pro League, IEM Katowice |
| Матчі | 50 | з реалістичними датами та результатами |

> Seed-дані містять реальні імена та дати для переконливого вигляду під час демо.

---

## Змінні середовища (Environment Variables)

Скопіюйте `.env.example` → `.env` та заповніть значення:

| Змінна | Опис |
| :--- | :--- |
| `PORT` | Порт бекенду (за замовчуванням: `5000`) |
| `DB_HOST` | Хост MySQL — для Docker завжди `db` |
| `DB_NAME` | Назва бази даних |
| `DB_USER` | Користувач БД |
| `DB_PASSWORD` | Пароль користувача БД |
| `DB_ROOT_PASSWORD` | Пароль root-користувача MySQL |
| `JWT_SECRET` | Секрет для підпису JWT-токенів (мін. 32 символи) |
| `PANDASCORE_API_KEY` | API-ключ PandaScore ([отримати тут](https://pandascore.co)) |

**Генерація `JWT_SECRET`:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Тестові облікові записи (Test Credentials)

| Роль | Email | Пароль |
| :--- | :--- | :--- |
| Admin | admin@test.com | 123456 |
| User | user1@test.com | 123456 |

> ⚠️ Ці облікові записи існують лише в локальній dev-базі після запуску seeders.
> Ніколи не використовуй такі паролі в production.

---

## API документація (Swagger)

Інтерактивна документація доступна після запуску:

```
http://localhost:5000/api-docs
```

Основні групи endpoints:

| Група | Опис |
| :--- | :--- |
| `/api/auth` | Реєстрація та вхід |
| `/api/matches` | Матчі, архів, підписки, PandaScore |
| `/api/tournaments` | Турніри, сітка, мапа |
| `/api/players` | Гравці, статистика, трансфери |
| `/api/teams` | Команди |
| `/api/countries` | Країни та їх команди |
| `/api/search` | Універсальний пошук |

---

## Структура проєкту (Project Structure)

```
EsportHub/
├── client/                  # React фронтенд
│   └── src/
│       ├── pages/           # Сторінки застосунку
│       ├── components/      # UI компоненти
│       ├── api/             # API клієнт
│       └── context/         # Auth, Theme, Toast контексти
│
├── server/                  # Node.js/Express бекенд
│   ├── src/
│   │   ├── presentation/    # Controllers, Routes, Middlewares
│   │   ├── application/     # Services (бізнес-логіка)
│   │   └── infrastructure/  # Repositories, WebSockets, External APIs
│   ├── migrations/          # Sequelize міграції (включно з player_transfer)
│   └── seeders/             # Реалістичні тестові дані для демо
│
├── docker-compose.yml
├── .env.example             # Шаблон змінних середовища
└── .env                     # Локальний конфіг (не комітити!)
```

---

## Стандарти коду (Code Quality)

Проєкт використовує ESLint (Airbnb Style Guide) та Prettier:

```bash
# Перевірка
npm run lint

# Автовиправлення
npm run lint:fix
```

---

## Ліцензія

MIT © EsportHub Team