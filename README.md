# РыбуСлышь — Веб-сервис для анализа звуков подводных млекопитающих

## Установка

1. Скачать Python
2. Установить зависимости: `python -m pip install pyjwt Flask Flask-CORS librosa pillow matplotlib pymongo pytest tensorflow`
3. Запустить `python3 src/backend/main.py`
4. Перейти в папку с фронтедом `cd src/frontend`
5. Собрать фронтенд `npm i && npm run build`
6. Запустить `npm run preview`


## Запуск тестов (backend)
Для запуска тестов необходимо запустить скрипт `src/backend/tests.py` с помощью `pytest`: `pytest -v src/backend/tests.py`