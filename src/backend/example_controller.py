from random import choice
from enum import Enum

class FileStatus(Enum):
    Unknown = 0
    Pending = 1
    InProgress = 2
    Ready = 3

file_statuses = {}


def get_file_status_handler(request):
    file_id = request.args.get('file_id')
    if file_id in file_statuses:
        return file_statuses[file_id].name
    
    new_status = FileStatus(choice(range(0,4)))
    file_statuses[file_id] = new_status
    return new_status.name


def upload_file_handler(request):
    f = request.files['file'] 
    f.save(f'saved_files/{f.filename}')   
    return 'OK'