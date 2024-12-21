from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from controllers.main_page_controller import main_page_blueprint
from threading import Thread
from services.AiService import ml_event_loop
from appconfig import TEST_USER_ID, IS_DEV_MODE_ENABLED
from repositories.user_repository import find_users_by_id, add_user

if __name__ == '__main__':
    app = Flask(__name__)
    cors = CORS(app,
                resources={r'*': {'origins': '*'}},
                supports_credentials=True,
                expose_headers=['Content-Disposition'])
    app.register_blueprint(main_page_blueprint)

    if IS_DEV_MODE_ENABLED and len(find_users_by_id(TEST_USER_ID, use_contains=False)) == 0:
        add_user('test', 'Дебаг Админович', 'test', id=TEST_USER_ID)
    
    ml_event_loop_thread = Thread(target=ml_event_loop, daemon=True, name='ml_event_loop')
    ml_event_loop_thread.start()

    app.run(debug=True)