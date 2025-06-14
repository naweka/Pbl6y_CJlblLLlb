from flask import Blueprint, request
from services.json_helper_service import endpoint_output_wrapper
from services.user_service import token_required
from models.card_dto import CardDto
from services.card_service import (
    get_card,
    get_cards,
    create_card,
    remove_card,
    update_card,
)
from services.tag_service import get_all_tags
from services.converter_service import (
    convert_json_to_any,
    convert_model_to_dto,
    __get_json_parameters,
    __get_json_parameter,
)

card_controller_blueprint = Blueprint("card_controller_blueprint", __name__)


@card_controller_blueprint.route("/api/v1/getCards", methods=["POST"])
@token_required
@endpoint_output_wrapper
def getCards(jwt_data: dict) -> list[CardDto]:
    search_text, tags = __get_json_parameters(request.json, "search_text", "tags")
    cards = get_cards(search_text, tags)
    res = [convert_model_to_dto(x) for x in cards]
    return res, 200


@card_controller_blueprint.route("/api/v1/getCard", methods=["POST"])
@token_required
@endpoint_output_wrapper
def getCard(jwt_data: dict) -> CardDto:
    id = __get_json_parameter(request.json, "id")
    card = get_card(id)
    res = convert_model_to_dto(card)
    return res, 200


@card_controller_blueprint.route("/api/v1/deleteCard", methods=["POST"])
@token_required
@endpoint_output_wrapper
def deleteCard(jwt_data: dict) -> None:
    id = __get_json_parameter(request.json, "id")
    res = remove_card(id)
    return res, 200


@card_controller_blueprint.route("/api/v1/createCard", methods=["POST"])
@token_required
@endpoint_output_wrapper
def createCard(jwt_data: dict) -> CardDto:
    card_dto = convert_json_to_any(request.json, CardDto)
    card = create_card(card_dto)
    res = convert_model_to_dto(card)
    return res, 200


@card_controller_blueprint.route("/api/v1/updateCard", methods=["POST"])
@token_required
@endpoint_output_wrapper
def updateCard(jwt_data: dict) -> CardDto:
    card_dto = convert_json_to_any(request.json, CardDto)
    card = update_card(card_dto)
    res = convert_model_to_dto(card)
    return res, 200


@card_controller_blueprint.route("/api/v1/getTags", methods=["GET"])
@token_required
@endpoint_output_wrapper
def getTags(jwt_data: dict) -> list[str]:
    res = get_all_tags()
    return res, 200
