from appconfig import WORKING_DIRECTORY

REL_PATH_TO_FILES = '\\server_data\\uploaded_files\\'


def write_uploaded_file(filename:str, file_bytes:bytes):
    print(WORKING_DIRECTORY + f'{REL_PATH_TO_FILES}{filename}.bin')
    f = open(WORKING_DIRECTORY + f'{REL_PATH_TO_FILES}{filename}.bin','wb')
    f.write(file_bytes)
    f.close()
    return