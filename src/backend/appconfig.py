import os
import random
from string import ascii_letters as ascii, digits


# --- Важные константы ---

WORKING_DIRECTORY = os.path.dirname(__file__)
PASSWORD_SALT = None

__secrets_key_file = WORKING_DIRECTORY + '/secret_key.txt'
if os.path.exists(__secrets_key_file):
    PASSWORD_SALT = open(__secrets_key_file, 'r').read()
else:
    # Всего возможных вариантов: 62 ^ 64 = 5e+114
    PASSWORD_SALT = ''.join(random.choice(ascii + digits) for _ in range(64))
    open(__secrets_key_file, 'w').write(PASSWORD_SALT)


# --- Отладка ---

IS_DEV_MODE_ENABLED = False
TEST_USER_ID = '01010101-0808-0808-0808-080808080808'


# --- Работа с СУБД ---

DB_VERSION = 4
DB_CONNECTION_STRING = 'mongodb://localhost:27017/'
DB_NAME = 'fish_db'
DB_TEST_NAME = 'fish_db_test'
DB_CARDS_COLLECTION_NAME = 'cards'
DB_MODEL_SETTINGS_COLLECTION_NAME = 'model_settings'
DB_FILES_COLLECTION_NAME = 'files'
DB_USERS_COLLECTION_NAME = 'users'
DB_SYSTEM_COLLECTION_NAME = 'system'


# --- Настройка путей к модели ---

PATH_TO_THE_MODEL = WORKING_DIRECTORY + f'/packed_model/unpacked/swin_audio.pth'
PATH_TO_THE_MODEL_FOLDER = WORKING_DIRECTORY + f'/packed_model/unpacked'
PATH_TO_THE_PACKED_MODEL_FOLDER = WORKING_DIRECTORY + f'/packed_model/'

REL_PATH_TO_WAV_FILES = '/server_data/uploaded_files/'
REL_PATH_TO_SPECTROGRAM_FILES = '/server_data/spectrograms/'
REL_PATH_TO_PREDICTED_FILES = '/server_data/predicted_data/'