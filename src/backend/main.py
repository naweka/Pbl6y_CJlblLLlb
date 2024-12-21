from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from controllers.main_page_controller import main_page_blueprint
from threading import Thread
from services.AiService import ml_event_loop
from appconfig import TEST_USER_ID, IS_DEV_MODE_ENABLED, DB_VERSION
from services.DbService import system_db
from repositories.user_repository import find_users_by_id, add_user

if __name__ == '__main__':
    app = Flask(__name__)
    cors = CORS(app,
                resources={r'*': {'origins': '*'}},
                supports_credentials=True,
                expose_headers=['Content-Disposition'])
    app.register_blueprint(main_page_blueprint)

    system_settings = list(system_db.find({}))
    if not system_settings:
        system_db.insert_one({ 'db_version': DB_VERSION })
    else:
        system_settings = system_settings[0]
        db_version = system_settings['db_version']
        if db_version != DB_VERSION:
            if db_version > DB_VERSION:
                raise Exception(f'Даунгрейд с {db_version} на {DB_VERSION} не поддерживается')
            # TODO Upgrade service
            pass

    if IS_DEV_MODE_ENABLED and len(find_users_by_id(TEST_USER_ID, use_contains=False)) == 0:
        add_user('test', 'Дебаг Админович', 'test', id=TEST_USER_ID)
    
    ml_event_loop_thread = Thread(target=ml_event_loop, daemon=True, name='ml_event_loop')
    ml_event_loop_thread.start()

    app.run(debug=True)