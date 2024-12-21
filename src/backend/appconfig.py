import os

# --- Important constants

WORKING_DIRECTORY = os.path.dirname(__file__)
PASSWORD_SALT = 'sample secret salt that can be stored on git'

# --- Debug helpers ---

IS_DEV_MODE_ENABLED = True
TEST_USER_ID = '01010101-0808-0808-0808-080808080808'

# --- Database ---

DB_VERSION = 1
DB_CONNECTION_STRING = 'mongodb://localhost:27017/'
DB_NAME = 'fish_db'
DB_CARDS_COLLECTION_NAME = 'cards'
DB_FILES_COLLECTION_NAME = 'files'
DB_USERS_COLLECTION_NAME = 'users'
DB_SYSTEM_COLLECTION_NAME = 'system'