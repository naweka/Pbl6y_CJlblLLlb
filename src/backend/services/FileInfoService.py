from appconfig import WORKING_DIRECTORY
import os

REL_PATH_TO_WAV_FILES = '/server_data/uploaded_files/'
REL_PATH_TO_SPECTROGRAM_FILES = '/server_data/spectrograms/'
REL_PATH_TO_PREDICTED_FILES = '/server_data/predicted_data/'


def write_uploaded_file(filename:str, file_bytes:bytes) -> str:
    path = WORKING_DIRECTORY + f'{REL_PATH_TO_WAV_FILES}{filename}.wav'
    f = open(path,'wb')
    f.write(file_bytes)
    f.close()
    return path


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