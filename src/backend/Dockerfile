# Указываем базовый образ Python
FROM tensorflow/tensorflow:latest
FROM --platform=linux/amd64 python:3.10

# Устанавливаем переменную окружения для предотвращения буферизации вывода Python
ENV PYTHONUNBUFFERED=1

# Указываем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл requirements.txt в контейнер
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt
# Копируем весь проект в контейнер
COPY . /app/

# Стартуетм
CMD ["python", "main.py"]
