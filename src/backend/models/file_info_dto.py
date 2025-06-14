from dataclasses import dataclass
from models.dto import Dto


@dataclass
class FileInfoDto(Dto):
    id: str
    """Id файла (Guid)"""

    name: str
    """Оригинальное имя файла"""

    file_status: str
    """Текущий статус у файла. Может быть: ANALYZING, PREPARING или DONE"""
