from flask import Blueprint, request
from services.json_helper_service import endpoint_output_wrapper
from services.user_service import (
    token_required,
    login_get_token,
    signup,
    get_current_user,
)
from services.converter_service import convert_json_to_any
from models.user import User

auth_controller_blueprint = Blueprint("auth_controller_blueprint", __name__)


@auth_controller_blueprint.route("/api/v1/getCurrentUser", methods=["GET"])
@token_required
@endpoint_output_wrapper
def currentUser(jwt_data: dict) -> str:
    res = get_current_user(jwt_data)
    return res, 200


@auth_controller_blueprint.route("/api/v1/signup", methods=["POST"])
@endpoint_output_wrapper
def signupUser() -> User:
    user = convert_json_to_any(request.json, User)
    res = signup(user)
    return res, 200


@auth_controller_blueprint.route("/api/v1/login", methods=["POST"])
@endpoint_output_wrapper
def login() -> str:
    user = convert_json_to_any(request.json, User)
    print(user)
    res = login_get_token(user)
    return res, 200
