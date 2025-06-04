from dataclasses import dataclass
from models.model import Model

@dataclass
class FileInfo(Model):
    id:str
    '''Id файла (Guid)'''

    name:str
    '''Оригинальное имя файла'''

    audio_file_path:str
    '''Путь до wav файла'''

    file_status:str
    '''Текущий статус у файла. Может быть: ANALYZING, PREPARING или DONE'''