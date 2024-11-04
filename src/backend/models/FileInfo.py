from dataclasses import dataclass
from typing import Optional

@dataclass
class FileInfo:
    id:str
    name:str
    alias_name:str
    spectrogram_file:Optional[bytes]
    is_sounds_detected:Optional[bool]