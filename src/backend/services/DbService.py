from pymongo import MongoClient
from appconfig import (DB_CONNECTION_STRING,
                       DB_NAME,
                       DB_CARDS_COLLECTION_NAME,
                       DB_FILES_COLLECTION_NAME,
                       DB_USERS_COLLECTION_NAME,
                       DB_SYSTEM_COLLECTION_NAME)


__client__:MongoClient = MongoClient(DB_CONNECTION_STRING)
__db__ = __client__[DB_NAME]
cards_db = __db__[DB_CARDS_COLLECTION_NAME] 
files_db = __db__[DB_FILES_COLLECTION_NAME]
users_db = __db__[DB_USERS_COLLECTION_NAME]
system_db = __db__[DB_SYSTEM_COLLECTION_NAME]