FROM node:20-alpine
WORKDIR /app

# Копіюємо package.json та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь інший код
COPY . .

# Відкриваємо порт, на якому працює сервер
EXPOSE 5000

# Команда для запуску
CMD ["node", "server.js"]
