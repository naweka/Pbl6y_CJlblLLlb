from flask import Blueprint, request
from typing import List
from models.Card import Card
from controllers.controller_utils import (get_json_parameters,
                                          get_json_parameter)
from services.CardService import (get_card,
                                  get_cards,
                                  add_card,
                                  remove_card,
                                  upload_file_for_card,
                                  get_card_files,
                                  update_card)
from services.TagService import get_all_tags
from services.IdGeneratorService import generate_id
from services.IdkJsonHelper import endpoint_output_wrapper
from services.UserService import token_required, login_get_token, signup, get_current_user


main_page_blueprint = Blueprint('main_page_blueprint', __name__)


# --- AUTH & USERS ---


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


# --- CARDS ---


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
    res, code = add_card(title, description, tags)
    return res, code


@main_page_blueprint.route('/api/v1/updateCard', methods=['POST'])
@token_required
@endpoint_output_wrapper
def updateCard(jwt_data:dict) -> Card:
    id, title, description, tags = get_json_parameters(request.json, 'id', 'title', 'description', 'tags')
    res, code = update_card(id, title, description, tags)
    return res, code


# --- TAGS ---


@main_page_blueprint.route('/api/v1/getTags', methods=['GET'])
@token_required
@endpoint_output_wrapper
def getTags(jwt_data:dict) -> List[str]:
    res = get_all_tags()
    return res


# --- FILES ---


@main_page_blueprint.route('/api/v1/getIdForNewFile', methods=['GET'])
@token_required
@endpoint_output_wrapper
def getIdForNewFile(jwt_data:dict) -> str:
    res = generate_id()
    return res, 200


@main_page_blueprint.route('/api/v1/uploadFile', methods=['POST'])
@token_required
@endpoint_output_wrapper
def uploadFile(jwt_data:dict):
    # print(request.files)
    fs = request.files[''] if 'file' not in request.files else request.files['file'] 
    f = fs.read()
    filename = fs.filename
    file_id = f[:16]
    card_id = f[16:32]
    data = f[32:]
    res, code = upload_file_for_card(card_id, file_id, filename, data)
    fs.close()
    return res, code


@main_page_blueprint.route('/api/v1/getFiles', methods=['POST'])
@token_required
@endpoint_output_wrapper
def getFiles(jwt_data:dict) -> str:
    id = get_json_parameter(request.json, 'id')
    res, code = get_card_files(id)
    return res, code