from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from controllers.main_page_controller import main_page_blueprint
from threading import Thread
from services.MlService import ml_event_loop

if __name__ == '__main__':
    app = Flask(__name__)
    cors = CORS(app,
                resources={r'*': {'origins': '*'}},
                supports_credentials=True,
                expose_headers=['Content-Disposition'])
    app.register_blueprint(main_page_blueprint)
    
    ml_event_loop_thread = Thread(target=ml_event_loop, daemon=True, name='ml_event_loop')
    ml_event_loop_thread.start()

    app.run(debug=True)