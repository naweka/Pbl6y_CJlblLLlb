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
                                  get_card_files)
from services.TagService import get_all_tags
from services.IdGeneratorService import generate_id
from services.IdkJsonHelper import obj_to_json_simple


main_page_blueprint = Blueprint('main_page_blueprint', __name__)


@main_page_blueprint.route('/api/v1/getCards', methods=['POST'])
def getCards() -> str:
    search_text, tags = get_json_parameters(request.json, 'search_text', 'tags')
    res = get_cards(search_text, tags)
    return res


@main_page_blueprint.route('/api/v1/getCard', methods=['POST'])
def getCard() -> Card:
    id = get_json_parameter(request.json, 'id')
    res, code = get_card(id)
    return obj_to_json_simple(res), code


@main_page_blueprint.route('/api/v1/getTags', methods=['GET'])
def getTags() -> List[str]:
    res = get_all_tags()
    return obj_to_json_simple(res)


@main_page_blueprint.route('/api/v1/deleteCard', methods=['POST'])
def deleteCard() -> None:
    id = get_json_parameter(request.json, 'id')
    res, code = remove_card(id)
    return res, code


@main_page_blueprint.route('/api/v1/getIdForNewFile', methods=['GET'])
def getIdForNewFile() -> str:
    res = generate_id()
    return res


@main_page_blueprint.route('/api/v1/createCard', methods=['POST'])
def createCard() -> Card:
    title, description = get_json_parameters(request.json, 'title', 'description')
    res, code = add_card(title, description)
    return obj_to_json_simple(res), code


@main_page_blueprint.route('/api/v1/uploadFile', methods=['POST'])
def uploadFile():
    print(request.files)
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
def getFiles() -> str:
    id = get_json_parameter(request.json, 'id')
    res, code = get_card_files(id)
    return res, code