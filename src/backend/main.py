from flask import Flask, jsonify, request, render_template


from controllers.main_page_controller import main_page_blueprint

# from example_controller import get_file_status_handler, upload_file_handler

# http://127.0.0.1:5000/api/v1/getFileStatus?file_id=33535
# @app.route('/api/v1/getFileStatus', methods=['GET'])
# def get_file_status():
#     status = get_file_status_handler(request)
#     return jsonify({'status': status})


# @app.route('/api/v1/uploadFile', methods=['POST'])
# def upload_file():
#     status = upload_file_handler(request)
#     return jsonify({'status': status})


# @app.route('/')
# def main():   
#     return render_template("index.html")  


if __name__ == '__main__':
    app = Flask(__name__)
    app.register_blueprint(main_page_blueprint)
    app.run(debug=True)