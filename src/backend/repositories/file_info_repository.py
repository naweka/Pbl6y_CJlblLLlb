from services.id_generator_service import generate_id
from models.file_info import FileInfo
from services.db_service import files_table

def add_file(id:str,
             name:str,
             audio_file_path:str) -> FileInfo:
    id = id if id else generate_id()
    res = files_table.insert_one({
        'id': id,
        'name': name,
        'audio_file_path': audio_file_path,
        'file_status': 'PREPARING'
    })
    res = FileInfo(id, name, audio_file_path, 'PREPARING')
    return res


def get_files_by_ids(file_ids:list[str]) -> list[FileInfo]:
    res = list(files_table.find({'id': {'$in': file_ids}}))
    res = [FileInfo(x['id'], x['name'], x['audio_file_path'], x['file_status']) for x in res]
    return res


def delete_file_by_id(id:str) -> None:
    files_table.delete_one({'id': id})


def update_status_for_file(file_id:str, status:str):
    files_table.update_one({'id': file_id},
                        {'$set': {'file_status': status}})