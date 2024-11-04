from models.User import User
from typing import List
from IdGeneratorService import generate_id

# TODO
users_db:List[User] = []


def get_all_users() -> List[User]:
    global users_db
    return users_db


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