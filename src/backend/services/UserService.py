from services.IdGeneratorService import generate_id
from repositories.user_repository import add_user, find_users_by_login, find_users_by_id
from datetime import datetime, timedelta
from models.User import User
from functools import wraps
from flask import request
from typing import List, Union
import traceback
import jwt
from hashlib import sha3_256
from appconfig import PASSWORD_SALT
import copy
from appconfig import TEST_USER_ID, IS_DEV_MODE_ENABLED


# TODO
SECRET_JWT_KEY = '111'

# TODO
# users_db:List[User] = [
#     User('01010101-0808-0808-0808-080808080808', 'name1', 'Облысеев Лыс Шампунович', sha3_256(f'{PASSWORD_SALT}pwd1'.encode('utf-8')).hexdigest()),
#     User(generate_id(), 'name2', 'Драйв Роман Гослирович', sha3_256(f'{PASSWORD_SALT}pwd2'.encode('utf-8')).hexdigest()),
# ]


def get_all_users() -> List[User]:
    global users_db
    return users_db


def get_current_user(jwt_data:dict) -> tuple[Union[User,str],int]:
    user_id = jwt_data['user_id']

    user = find_users_by_id(user_id, use_contains=False)

    if len(user) == 0:
        return {
            'error_message': f'Пользователь с ID "{user_id}" не найден'
        }, 400
    
    current_user = user[0]

    # TODO выпилить копирование объекта
    res = copy.copy(current_user.__dict__)
    del res['password_hash']
    return res, 200


def remove_user(id:str):
    for elem in users_db:
        if elem.id == id:
            del(elem)


def signup(login:str, password:str, fullname:str) -> tuple[User,int]:
    if login is None or password is None or fullname is None:
        return {
            'error_message': 'Provided information about user is incorrect'
        }, 401

    if len(find_users_by_login(login, use_contains=False)) > 0:
        return {
            'error_message': 'This user already exist'
        }, 401

    new_user = add_user(login, fullname, password)

    token = jwt.encode({
        'user_id': new_user.id,
        'exp' : datetime.utcnow() + timedelta(hours=4)
    }, SECRET_JWT_KEY)

    # TODO выпилить копирование объекта и сделать всё на нормальных ссылках
    res = copy.copy(new_user.__dict__)
    del res['password_hash']
    res['token'] = token
    return res, 200


def login_get_token(login:str, password:str) -> tuple[str,int]:
    if login is None or password is None:
        return {
            'error_message': 'Login or password is incorrect'
        }, 401
    
    user = find_users_by_login(login, use_contains=False)
    
    if len(user) == 0:
        return {
            'error_message': f'Login or password is incorrect'
        }, 400
    current_user = user[0]
    
    password_hash = sha3_256(f'{PASSWORD_SALT}{password}'.encode('utf-8')).hexdigest()
    if current_user.password_hash == password_hash:
        token = jwt.encode({
            'user_id': current_user.id,
            'exp' : datetime.now() + timedelta(hours=4)
        }, SECRET_JWT_KEY)
        return {'token': token}, 200
    
    return {
        'error_message': 'Login or password is incorrect'
        }, 401


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
            token = token.replace('Bearer ', '').strip()

        if not token:
            return {
                'error_message': 'Authorization token is missing'
            }, 401
  
        try:
            if IS_DEV_MODE_ENABLED:
                jwt_data = {'user_id': TEST_USER_ID}
                res = f(jwt_data, *args, **kwargs)
                print(res)
                return res

            jwt_data = jwt.decode(token, SECRET_JWT_KEY, algorithms=['HS256'])
            if datetime.now().timestamp() > jwt_data['exp']:
                return {
                    'error_message': 'Expired token'
                }, 401
            res = f(jwt_data, *args, **kwargs)
            print(res)
            return res
        
        except Exception as e:
            traceback.print_exc() 
            # raise e
            return {
                    'error_message': 'Invalid token'
                }, 401       
  
    return decorated