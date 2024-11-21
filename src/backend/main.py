from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from controllers.main_page_controller import main_page_blueprint


if __name__ == '__main__':
    app = Flask(__name__)
    cors = CORS(app,
                resources={r"/api/*": {"origins": "*"}},
                supports_credentials=True)
    app.register_blueprint(main_page_blueprint)
    app.run(debug=True)