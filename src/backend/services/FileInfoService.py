import os

WORKING_DIRECTORY = os.getcwd()
REL_PATH_TO_FILES = '\\server_data\\uploaded_files\\'


def write_uploaded_file(filename:str, file_bytes:bytes):
    open(WORKING_DIRECTORY + f'{REL_PATH_TO_FILES}{filename}.bin','wb').write(file_bytes)
    return