from pymongo import MongoClient
from appconfig import (
    DB_CONNECTION_STRING,
    DB_NAME,
    DB_TEST_NAME,
    DB_CARDS_COLLECTION_NAME,
    DB_FILES_COLLECTION_NAME,
    DB_USERS_COLLECTION_NAME,
    DB_SYSTEM_COLLECTION_NAME,
    DB_MODEL_SETTINGS_COLLECTION_NAME,
)


client: MongoClient = None
cards_table = None
model_settings_table = None
files_table = None
users_table = None
system_table = None


def initalize_normal_connection():
    global \
        cards_table, \
        model_settings_table, \
        files_table, \
        users_table, \
        system_table, \
        client
    client = MongoClient(DB_CONNECTION_STRING)
    db = client[DB_NAME]
    cards_table = db[DB_CARDS_COLLECTION_NAME]
    model_settings_table = db[DB_MODEL_SETTINGS_COLLECTION_NAME]
    files_table = db[DB_FILES_COLLECTION_NAME]
    users_table = db[DB_USERS_COLLECTION_NAME]
    system_table = db[DB_SYSTEM_COLLECTION_NAME]


def initalize_test_connection():
    global \
        cards_table, \
        model_settings_table, \
        files_table, \
        users_table, \
        system_table, \
        client
    client = MongoClient(DB_CONNECTION_STRING)
    db = client[DB_TEST_NAME]
    cards_table = db[DB_CARDS_COLLECTION_NAME]
    model_settings_table = db[DB_MODEL_SETTINGS_COLLECTION_NAME]
    files_table = db[DB_FILES_COLLECTION_NAME]
    users_table = db[DB_USERS_COLLECTION_NAME]
    system_table = db[DB_SYSTEM_COLLECTION_NAME]
