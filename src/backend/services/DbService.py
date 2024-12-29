from pymongo import MongoClient
from appconfig import (DB_CONNECTION_STRING,
                       DB_NAME,
                       DB_TEST_NAME,
                       DB_CARDS_COLLECTION_NAME,
                       DB_FILES_COLLECTION_NAME,
                       DB_USERS_COLLECTION_NAME,
                       DB_SYSTEM_COLLECTION_NAME)


client:MongoClient = None
cards_db = None
files_db = None
users_db = None
system_db = None


def initalize_normal_connection():
    global cards_db, files_db, users_db, system_db, client
    client = MongoClient(DB_CONNECTION_STRING)
    __db__ = client[DB_NAME]
    cards_db = __db__[DB_CARDS_COLLECTION_NAME] 
    files_db = __db__[DB_FILES_COLLECTION_NAME]
    users_db = __db__[DB_USERS_COLLECTION_NAME]
    system_db = __db__[DB_SYSTEM_COLLECTION_NAME]


def initalize_test_connection():
    global cards_db, files_db, users_db, system_db, client
    client = MongoClient(DB_CONNECTION_STRING)
    __db__ = client[DB_TEST_NAME]
    cards_db = __db__[DB_CARDS_COLLECTION_NAME] 
    files_db = __db__[DB_FILES_COLLECTION_NAME]
    users_db = __db__[DB_USERS_COLLECTION_NAME]
    system_db = __db__[DB_SYSTEM_COLLECTION_NAME]