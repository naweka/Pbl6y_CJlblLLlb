from flask import Blueprint, request, send_file
from typing import List
from appconfig import WORKING_DIRECTORY
from models.Card import Card
from controllers.controller_utils import (get_json_parameters,
                                          get_json_parameter)
from services.CardService import (get_card,
                                  get_cards,
                                  create_card,
                                  remove_card,
                                  upload_file_for_card,
                                  get_card_files,
                                  update_card,
                                  remove_file)
from services.TagService import get_all_tags
from services.IdGeneratorService import generate_id, generate_ids
from services.IdkJsonHelper import endpoint_output_wrapper
from services.UserService import token_required, login_get_token, signup, get_current_user


main_page_blueprint = Blueprint('main_page_blueprint', __name__)


#region --- AUTH & USERS ---


@main_page_blueprint.route('/api/v1/getCurrentUser', methods=['GET'])
@token_required
@endpoint_output_wrapper
def currentUser(jwt_data:dict) -> str:
    res, code = get_current_user(jwt_data)
    return res, code


@main_page_blueprint.route('/api/v1/signup', methods=['POST'])
@endpoint_output_wrapper
def signupUser() -> str:
    login, password, fullname = get_json_parameters(request.json, 'login', 'password', 'fullname')
    res, code = signup(login, password, fullname)
    return res, code


@main_page_blueprint.route('/api/v1/login', methods=['POST'])
@endpoint_output_wrapper
def login() -> str:
    login, password = get_json_parameters(request.json, 'login', 'password')
    res, code = login_get_token(login, password)
    return res, code

#endregion --- AUTH & USERS ---

#region --- CARDS ---


@main_page_blueprint.route('/api/v1/getCards', methods=['POST'])
@token_required
@endpoint_output_wrapper
def getCards(jwt_data:dict) -> str:
    search_text, tags = get_json_parameters(request.json, 'search_text', 'tags')
    res, code = get_cards(search_text, tags)
    return res, code


@main_page_blueprint.route('/api/v1/getCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def getCard(jwt_data:dict) -> Card:
    id = get_json_parameter(request.json, 'id')
    res, code = get_card(id)
    return res, code


@main_page_blueprint.route('/api/v1/deleteCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def deleteCard(jwt_data:dict) -> None:
    id = get_json_parameter(request.json, 'id')
    res, code = remove_card(id)
    return res, code


@main_page_blueprint.route('/api/v1/createCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def createCard(jwt_data:dict) -> Card:
    title, description, tags = get_json_parameters(request.json, 'title', 'description', 'tags')
    res, code = create_card(title, description, tags)
    return res, code


@main_page_blueprint.route('/api/v1/updateCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def updateCard(jwt_data:dict) -> Card:
    id, title, description, tags = get_json_parameters(request.json, 'id', 'title', 'description', 'tags')
    res, code = update_card(id, title, description, tags)
    return res, code


#endregion --- CARDS ---

#region --- TAGS ---


@main_page_blueprint.route('/api/v1/getTags', methods=['GET'])
@token_required
@endpoint_output_wrapper
def getTags(jwt_data:dict) -> List[str]:
    res = get_all_tags()
    return res

#endregion --- TAGS ---

#region --- FILES ---


@main_page_blueprint.route('/api/v1/generateGuid', methods=['GET'])
@token_required
@endpoint_output_wrapper
def generateGuid(jwt_data:dict) -> str:
    res = generate_id()
    return res, 200


@main_page_blueprint.route('/api/v1/generateGuids', methods=['POST'])
@token_required
@endpoint_output_wrapper
def generateGuids(jwt_data:dict) -> str:
    number_of_guids = get_json_parameter(request.json, 'count')
    res = generate_ids(number_of_guids)
    return res, 200


@main_page_blueprint.route('/api/v1/uploadFile', methods=['POST'])
@token_required
@endpoint_output_wrapper
def uploadFile(jwt_data:dict):
    # print('files', request.files)
    # print('data', request.form)
    fs = request.files[''] if 'file' not in request.files else request.files['file'] 
    filename = fs.filename
    file_id = request.form['fileId']
    card_id = request.form['cardId']
    data = fs.read()
    res, code = upload_file_for_card(card_id, file_id, filename, data)
    fs.close()
    return res, code


@main_page_blueprint.route('/api/v1/getFilesByCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def getFiles(jwt_data:dict) -> str:
    id = get_json_parameter(request.json, 'id')
    res, code = get_card_files(id)
    return res, code


@main_page_blueprint.route('/spectrogram/<path:id>', methods=['GET'])
@token_required
@endpoint_output_wrapper
def downloadSpectrogram(jwt_data:dict, id):
    path = WORKING_DIRECTORY+f'/server_data/spectrograms/{id}.png'
    return send_file(path, as_attachment=False), 200


@main_page_blueprint.route('/predictedData/<path:id>', methods=['GET'])
@token_required
@endpoint_output_wrapper
def downloadPredictedData(jwt_data:dict, id):
    path = WORKING_DIRECTORY+f'/server_data/predicted_data/{id}.txt'
    return send_file(path, as_attachment=False), 200


@main_page_blueprint.route('/api/v1/deleteFile', methods=['POST'])
@token_required
@endpoint_output_wrapper
def deleteFile(jwt_data:dict) -> str:
    file_id = get_json_parameter(request.json, 'id')
    res = remove_file(file_id)
    return res, 200

#endregion --- FILES ---