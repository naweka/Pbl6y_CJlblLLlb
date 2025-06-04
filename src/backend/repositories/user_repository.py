from services.id_generator_service import generate_id
from services.db_service import users_table
from appconfig import TEST_USER_ID
from models.user import User
from services.password_service import create_password_hash


def add_debug_user(login:str, fullname:str, password:str) -> User:
    password_hash = create_password_hash(password)
    res = users_table.insert_one({
        'id': TEST_USER_ID,
        'login': login,
        'fullname': fullname,
        'password_hash': password_hash,
    })
    res = User(id, login, fullname, password_hash)
    return res


def add_user(login:str, fullname:str, password_hash:str) -> User:
    id = generate_id()
    res = users_table.insert_one({
        'id': id,
        'login': login,
        'fullname': fullname,
        'password_hash': password_hash,
    })
    res = User(id, login, fullname, password_hash)
    return res


def __find_users_by(field_name:str, value:str, use_contains=False):
    res = None
    if use_contains:
        res = list(users_table.find({field_name: {'$regex': value}}))
    else:
        res = list(users_table.find({field_name: value}))
    
    res = [User(x['id'], x['login'], x['fullname'], x['password_hash']) for x in res]
    
    return res


def find_users_by_login(login:str, use_contains=False) -> list[User]:
    return __find_users_by('login', login, use_contains)


def find_users_by_id(user_id:str, use_contains=False) -> list[User]:
    return __find_users_by('id', user_id, use_contains)