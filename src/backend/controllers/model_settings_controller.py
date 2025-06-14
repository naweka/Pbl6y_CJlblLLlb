from flask import Blueprint, request
from services.json_helper_service import endpoint_output_wrapper
from services.user_service import token_required
from models.model_settings_dto import ModelSettingsDto
from services.model_settings_service import (
    update_default_model_settings_handler,
    update_model_settings_handler,
    get_model_settings_handler,
    get_default_model_settings_handler,
)
from services.converter_service import convert_json_to_any, convert_model_to_dto


model_settings_controller_blueprint = Blueprint(
    "model_settings_controller_blueprint", __name__
)


@model_settings_controller_blueprint.route(
    "/api/v1/overrideModelSettingsForFile", methods=["POST"]
)
@token_required
@endpoint_output_wrapper
def updateModelSettingsForFile(jwt_data: dict) -> ModelSettingsDto:
    dto = convert_json_to_any(request.json, ModelSettingsDto)
    model_settings = update_model_settings_handler(dto)
    res = convert_model_to_dto(model_settings)
    return res, 200


@model_settings_controller_blueprint.route(
    "/api/v1/overrideDefaultModelSettingsForFile", methods=["POST"]
)
@token_required
@endpoint_output_wrapper
def updateDefaultModelSettingsForFile(jwt_data: dict) -> ModelSettingsDto:
    dto = convert_json_to_any(request.json, ModelSettingsDto, ignore_null=["file_id"])
    model_settings = update_default_model_settings_handler(dto)
    res = convert_model_to_dto(model_settings)
    return res, 200


@model_settings_controller_blueprint.route(
    "/api/v1/getModelSettingsForFile/<path:id>", methods=["GET"]
)
@token_required
@endpoint_output_wrapper
def getModelSettingsForFile(jwt_data: dict, id) -> ModelSettingsDto:
    model_settings = get_model_settings_handler(id)
    res = convert_model_to_dto(model_settings)
    return res, 200


@model_settings_controller_blueprint.route(
    "/api/v1/getDefaultModelSettingsForFile", methods=["GET"]
)
@token_required
@endpoint_output_wrapper
def getDefaultModelSettingsForFile(jwt_data: dict) -> ModelSettingsDto:
    model_settings = get_default_model_settings_handler()
    res = convert_model_to_dto(model_settings)
    return res, 200
