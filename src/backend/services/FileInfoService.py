from typing import List
from models.FileInfo import FileInfo
from uuid import UUID
import os

file_db:List[FileInfo]
WORKING_DIRECTORY = os.getcwd()
REL_PATH_TO_FILES = '\\server_data\\uploaded_files\\'

def upload_file_for_card(card_id:bytes,
                         file_id:bytes,
                         filename:str,
                         file_bytes:bytes):
    uuid_card = UUID(bytes=card_id)
    uuid_file = UUID(bytes=card_id)
    filename_alias = uuid_file.hex
    print(WORKING_DIRECTORY)
    open(WORKING_DIRECTORY + f'{REL_PATH_TO_FILES}{filename_alias}.bin','wb').write(file_bytes)
    
