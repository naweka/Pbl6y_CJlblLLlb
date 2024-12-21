from services.IdGeneratorService import generate_id
from services.DbService import users_db
from models.User import User
from hashlib import sha3_256
from appconfig import PASSWORD_SALT


def add_user(login:str, fullname:str, password:str, id:str=None) -> User:
    id = id if id else generate_id()
    password_hash = sha3_256(f'{PASSWORD_SALT}{password}'.encode('utf-8')).hexdigest()
    res = users_db.insert_one({
        'id': id,
        'login': login,
        'fullname': fullname,
        'password_hash': password_hash,
    })
    res = User(id, login, fullname, password_hash)
    return res


def find_users_by(field_name:str, value:str, use_contains=False):
    res = None
    if use_contains:
        res = list(users_db.find({field_name: {'$regex': value}}))
    else:
        res = list(users_db.find({field_name: value}))
    
    res = [User(x['id'], x['login'], x['fullname'], x['password_hash']) for x in res]
    
    return res

def find_users_by_login(login:str, use_contains=False) -> list[User]:
    return find_users_by('login', login, use_contains)

def find_users_by_id(user_id:str, use_contains=False) -> list[User]:
    return find_users_by('id', user_id, use_contains)
