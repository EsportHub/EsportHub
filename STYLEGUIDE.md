Базові стандарти
* JavaScript/TypeScript(node.js): Ми дотримуємось Airbnb JavaScript Style Guide.

* React: Використовуємо Airbnb React Style Guide.

Backend (Node.js)
* Папки (Packages): snake_case. Використовувати короткі назви (наприклад, controllers, db_services).

* Файли модулів: snake_case. Назва має чітко відображати сутність (наприклад, user_controller.js, auth_middleware.js).

* Класи всередині файлів: PascalCase (наприклад, AuthService).

* Функції та змінні: camelCase (стандарт для Node.js) або snake_case.

* Константи: UPPER_SNAKE_CASE (наприклад, DB_CONNECTION_LIMIT).

Frontend (React)
* Папки: kebab-case (маленькі літери через дефіс, наприклад, user-profile, common-components).

* Компоненти (Файли .tsx / .jsx): PascalCase. Файл має називатися так само, як і головний компонент всередині (наприклад, Header.tsx).

* Утиліти, хуки, сервіси (Файли .ts / .js): camelCase (наприклад, useAuth.ts, apiClient.js).

* Стилі (CSS Modules): PascalCase.module.css (наприклад, Header.module.css, щоб відповідати назві компонента).

База даних (MySQL)
* База даних має бути консистентною з Backend-моделями (через ORM):

* Таблиці: snake_case, множина (наприклад, users, orders).

* Колонки: snake_case, однина (наприклад, first_name, created_at).

* Зовнішні ключі (FK): суть_id (наприклад, user_id, category_id).

Загальні правила для всіх
* Boolean змінні: Мають починатися з префіксів is_, has_, can_ (наприклад, is_active, has_token).

* Абревіатури: Не пишіть GetUI, пишіть GetUi (в PascalCase) або get_ui (в snake_case).

* Заборона «сміттєвих» назв: Офіційно заборонено використання data, info, temp для файлів та сутностей. Файл data.* — це "смітник". Краще використовувати конкретні назви, наприклад product_schemas.*.

Formatting:

* Розмір відступу: 2 пробіли.

* Використання крапки з комою: Обов'язково.

* Максимальна довжина рядка: 100 символів.

Comments: Обов'язкове використання JSDoc для документування публічних методів та складних функцій.