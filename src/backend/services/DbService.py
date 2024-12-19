from pymongo import MongoClient
from appconfig import (DB_CONNECTION_STRING,
                       DB_NAME,
                       DB_CARDS_COLLECTION_NAME,
                       DB_FILES_COLLECTION_NAME,
                       DB_USERS_COLLECTION_NAME,)


class DbConnection(object):
    def __init__(s, conn:str=DB_CONNECTION_STRING) -> None:
        s.connectin_string:str = conn
        s.client:MongoClient = MongoClient(s.connectin_string)
    
    def __enter__(s):
        s.cards = s.client[DB_CARDS_COLLECTION_NAME]
        s.files = s.client[DB_FILES_COLLECTION_NAME]
        s.users = s.client[DB_USERS_COLLECTION_NAME]
    
    def __exit__(s, exc_type, exc_val, exc_tb):
        s.client.close()


