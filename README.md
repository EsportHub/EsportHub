# EsportHub

![Status](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Node Version](https://img.shields.io/badge/Node-v24.14.1-blue)

**EsportHub** — це відкрита цифрова енциклопедія та база знань про світ кіберспорту. Проєкт працює за принципом Вікіпедії, дозволяючи спільноті збирати, структурувати та зберігати історію гравців, команд, турнірів та ігрових патчів в одному місці.

---

## Ключові можливості (Wiki Features)

- **Global Search**: Потужний пошук по гравцях, організаціях та історичних подіях.
- **Collaborative Editing**: Система вільного редагування статей з контролем версій.
- **Categorized Database**: Структуровані дані про трансфери, призові фонди та статистику турнірів.
- **Infoboxes**: Автоматизовані картки швидкої інформації для кожної сторінки (як у Вікіпедії).

---

## Killer Feature: Interactive Esports Map
Нашою головною особливістю є **Інтерактивна мапа світу**. 
- **Geospatial Discovery**: Натискайте на будь-яку країну на мапі, щоб миттєво отримати список топ-команд, провідних гравців та статистику кіберспортивної активності в цьому регіоні.
- **Real-time Data**: Всі дані підтягуються безпосередньо з нашої бази даних, забезпечуючи актуальність інформації.

## Технологічний стек (Tech Stack)

| Сфера                | Технології                      |
| :------------------- | :------------------------------ |
| **Frontend**         | React, Tailwind CSS             |
| **Backend**          | Node.js, Express                |
| **Data Engineering** | PostgreSQL, Python              |
| **Automation**       | ESLint (Airbnb Guide), Prettier |
| **DevOps**           | Git, GitHub Actions             |

---

## Початок роботи (Getting Started)

### Попередні вимоги (Prerequisites)

Переконайтеся, що у вас встановлено:

- **Node.js** (версія 20.x або вище)
- **npm** (версія 10.x або вище)

### Встановлення (Installation)

1.  **Клонуйте репозиторій:**
    ```bash
    git clone [https://github.com/Yulia/EsportHub.git](https://github.com/Yulia/EsportHub.git)
    ```
2.  **Перейдіть у директорію проєкту:**
    ```bash
    cd EsportHub
    ```
3.  **Встановіть залежності:**
    ```bash
    npm install
    ```

### Налаштування середовища (Environment Variables)

Проєкт використовує змінні оточення. Створіть локальний файл `.env` на основі шаблону:

```bash
cp .env.example .env
```

### Після цього впишіть ваші локальні ключі та налаштування бази даних у файл .env.🏃

### Запуск (Running)Запустіть сервер розробки:
```bash
npm run dev
```

### Стандарти коду (Code Quality)
Ми дотримуємося суворих стандартів написання коду для підтримки високої якості продукту:
* Лінтер: Використовується ESLint з конфігурацією Airbnb.
* Форматування: Код автоматично форматується через Prettier.
* Команди перевірки:
    * npm run lint — перевірка помилок стилю.
    * npm run lint:fix — автоматичне виправлення доступних помилок.
    * npm run format — примусове форматування всіх файлів у проєкті.

### Команда проєкту (The Team)
| Роль                | Ім'я                      |
| :------------------- | :------------------------------ |
| **Project Manager**  | Nazar Frazovir             |
| **Front-end Developer**          | Anastasiia Kasyanenko                |
| **Data Engineering** | Yuliia Khudenko              |
| **Back-end Developer**       | Yuliia Khudenko |
| **QA Engineer**           | Diana Gnatiuk            |

## 📄 Ліцензія (License)
Проєкт розповсюджується під ліцензією MIT. Деталі у файлі [LICENSE](./LICENSE).