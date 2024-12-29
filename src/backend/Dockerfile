# Указываем базовый образ Python
FROM python:3.10-slim

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

# Указываем команду для запуска FastAPI с использованием uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
