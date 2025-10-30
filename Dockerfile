# Используем официальный Node.js образ с ffmpeg
FROM node:18-bullseye

# Устанавливаем ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем остальные файлы
COPY . .

# Создаем папку для временных файлов
RUN mkdir -p temp

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["node", "index.js"]

