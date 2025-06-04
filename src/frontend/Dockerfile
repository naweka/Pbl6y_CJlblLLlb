# Установка этапа сборки
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем все файлы в контейнер
COPY . .

# Сборка приложения
RUN npm run build

# Установка этапа выполнения
FROM nginx:alpine

# Копируем сгенерированные файлы из этапа сборки
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию для Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Указываем порт, на котором работает Nginx
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
