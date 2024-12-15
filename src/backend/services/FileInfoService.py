from appconfig import WORKING_DIRECTORY

REL_PATH_TO_FILES = '\\server_data\\uploaded_files\\'


def write_uploaded_file(filename:str, file_bytes:bytes) -> str:
    path = WORKING_DIRECTORY + f'{REL_PATH_TO_FILES}{filename}.wav'
    f = open(path,'wb')
    f.write(file_bytes)
    f.close()
    return path