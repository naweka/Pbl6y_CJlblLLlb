from dataclasses import dataclass
from typing import Optional

@dataclass
class FileInfo:
    id:str
    # Реальное имя загружаемого файла
    name:str
    # Имя файла в системе (его id)
    alias_name:str
    audio_file_path:str
    # spectrogram_file_path:str
    # predicted_data_file_path:str