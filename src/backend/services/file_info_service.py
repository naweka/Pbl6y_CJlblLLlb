from appconfig import (WORKING_DIRECTORY,
                       REL_PATH_TO_WAV_FILES,
                       REL_PATH_TO_SPECTROGRAM_FILES,
                       REL_PATH_TO_PREDICTED_FILES)
from repositories.file_info_repository import get_files_by_ids
import os


def write_uploaded_file(filename:str, file_bytes:bytes) -> str:
    path = WORKING_DIRECTORY + f'{REL_PATH_TO_WAV_FILES}{filename}.wav'
    f = open(path,'wb')
    f.write(file_bytes)
    f.close()
    return path


def get_file_by_id(id:str):
    return get_files_by_ids([id])[0]


def delete_uploaded_file(filename:str):
    path = WORKING_DIRECTORY + f'{REL_PATH_TO_WAV_FILES}{filename}.wav'
    if os.path.exists(path):
        os.remove(path)

    path = WORKING_DIRECTORY + f'{REL_PATH_TO_PREDICTED_FILES}{filename}.png'
    if os.path.exists(path):
        os.remove(path)
    
    path = WORKING_DIRECTORY + f'{REL_PATH_TO_SPECTROGRAM_FILES}{filename}.txt'
    if os.path.exists(path):
        os.remove(path)