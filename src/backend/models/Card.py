from dataclasses import dataclass
from models.FileInfo import FileInfo
from typing import List

@dataclass
class Card:
    id:str
    title:str
    description:str
    status:str
    tags:List[str]
    files:List[str]