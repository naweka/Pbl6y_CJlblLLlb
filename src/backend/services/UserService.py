from services.IdGeneratorService import generate_id
from datetime import datetime, timedelta
from models.User import User
from hashlib import sha3_256
from functools import wraps
from flask import request
from typing import List, Union
import jwt
import copy

# TODO
SECRET_JWT_KEY = '111'
PASSWORD_SALT = 'sample secret salt that can be stored on git'

# TODO
users_db:List[User] = [
    User(generate_id(), 'name1', 'Облысеев Лыс Шампунович', sha3_256(f'{PASSWORD_SALT}pwd1'.encode('utf-8')).hexdigest()),
    User(generate_id(), 'name2', 'Драйв Роман Гослирович', sha3_256(f'{PASSWORD_SALT}pwd2'.encode('utf-8')).hexdigest()),
]


def get_all_users() -> List[User]:
    global users_db
    return users_db


def get_current_user(jwt_data:dict) -> tuple[Union[User,str],int]:
    user_id = jwt_data['user_id']

    current_user = None
    for user in users_db:
        if user.id == user_id:
            current_user = user
            break

    if current_user is None:
        return f'Пользователь с ID "{user_id}" не найден', 400


    # TODO выпилить копирование объекта
    res = copy.copy(current_user.__dict__)
    del res['password_hash']
    return res, 200


def add_user(name:str):
    global users_db
    id = generate_id()
    u = User(id, name)
    users_db.append(u)
    return u


def remove_user(id:str):
    for elem in users_db:
        if elem.id == id:
            del(elem)


def signup(login:str, password:str, fullname:str) -> tuple[User,int]:
    if login is None or password is None or fullname is None:
        return 'Provided information about user is incorrect', 401
    global users_db
    current_user = None
    
    for user in users_db:
        if user.login == login:
            current_user = user
            break
    
    if current_user:
        return 'This user already exist', 401
    
    password_hash = sha3_256(f'{PASSWORD_SALT}{password}'.encode('utf-8')).hexdigest()

    new_user = User(generate_id(), login, fullname, password_hash)
    users_db.append(new_user)

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
        return 'Login or password is incorrect', 401
    global users_db
    current_user = None
    
    for user in users_db:
        if user.login == login:
            current_user = user
            break
    
    if not current_user:
        return 'Login or password is incorrect', 401
    
    print(dir(current_user))
    password_hash = sha3_256(f'{PASSWORD_SALT}{password}'.encode('utf-8')).hexdigest()
    if current_user.password_hash == password_hash:
        token = jwt.encode({
            'user_id': current_user.id,
            'exp' : datetime.utcnow() + timedelta(hours=4)
        }, SECRET_JWT_KEY)
        return {'token': token}, 200
    
    return 'Login or password is incorrect', 401


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        print(args, kwargs)

        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
            token = token.replace('Bearer ', '').strip()
            
        if not token:
            return 'Token is missing', 401
  
        try:
            jwt_data = jwt.decode(token, SECRET_JWT_KEY, algorithms=['HS256'])
            if datetime.utcnow().timestamp() > jwt_data['exp']:
                return 'Expired token', 401
            return  f(jwt_data, *args, **kwargs)
        
        except Exception as e:
            print(e)
            return 'Invalid token', 401        
  
    return decorated