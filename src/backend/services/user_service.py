from repositories.user_repository import add_user, find_users_by_login, find_users_by_id
from datetime import datetime, timedelta, timezone
from models.user import User
from functools import wraps
from flask import request
from typing import Union
import traceback
import jwt
from appconfig import PASSWORD_SALT
from appconfig import TEST_USER_ID, IS_DEV_MODE_ENABLED


# TODO разбить ключи для генерации jwt и паролей по разным шнягам
# и вообще вынести это в конфиг
SECRET_JWT_KEY = PASSWORD_SALT


def get_current_user(jwt_data:dict) -> Union[User,str]:
    user_id = jwt_data['user_id']

    user = find_users_by_id(user_id, use_contains=False)

    if len(user) == 0:
        raise Exception(f'Пользователь с ID "{user_id}" не найден')
    
    current_user = user[0]
    return current_user

# TODO перписать работу с токенами отдельно и возвращать UserDto
def signup(user:User) -> User:
    if user.login is None or user.password is None or user.fullname is None:
        raise Exception('Все поля должны быть заполнены: логин, пароль и имя пользователя')

    if len(find_users_by_login(user.login, use_contains=False)) > 0:
        raise Exception('Пользователь с этим логином уже существует')

    new_user = add_user(user.login, user.fullname, user.password)

    token = jwt.encode({
        'user_id': new_user.id,
        'exp' : datetime.now(timezone.utc) + timedelta(hours=4)
    }, SECRET_JWT_KEY)

    # TODO переписать на возврат токена отдельно, а не этот костыль
    new_user.token = token
    return new_user


def login_get_token(user:User) -> str:
    if user.login is None or user.password_hash is None:
        raise Exception('Оба поля должны быть заполнены: логин и пароль')
    
    users = find_users_by_login(user.login, use_contains=False)
    
    if len(users) == 0:
        raise Exception(f'Пользователь с login {user.login} не найден')
    current_user = users[0]
    
    if current_user.password_hash == user.password_hash:
        token = jwt.encode({
            'user_id': current_user.id,
            'exp' : datetime.now(timezone.utc) + timedelta(hours=4)
        }, SECRET_JWT_KEY)
        return {'token': token}
    
    raise Exception('Неправильный логин или пароль')


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
            token = token.replace('Bearer ', '').strip()

        if not token:
            raise Exception('Отсутствует токен авторизации')
  
        try:
            if IS_DEV_MODE_ENABLED:
                jwt_data = {'user_id': TEST_USER_ID}
                res = f(jwt_data, *args, **kwargs)
                print(res)
                return res

            jwt_data = jwt.decode(token, SECRET_JWT_KEY, algorithms=['HS256'])
            if datetime.now(timezone.utc).timestamp() > jwt_data['exp']:
                raise Exception('Срок действия токена истёк')
            
            res = f(jwt_data, *args, **kwargs)
            print(res)
            return res
        
        except Exception as e:
            traceback.print_exc() 
            raise Exception('Ошибка обработки токена авторизации')     
  
    return decorated