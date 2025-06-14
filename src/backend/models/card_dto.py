from dataclasses import dataclass
from typing import List
from models.dto import Dto


@dataclass
class CardDto(Dto):
    id: str
    """Id карточки (Guid)"""

    title: str
    """Название карточки"""

    description: str
    """Описание карточки"""

    status: str
    """Статус карточки. Может быть: ANALYZING, PREPARING или DONE"""

    tags: List[str]
    """Набор тегов для этой карточки (сразу же в виде текста)"""

    files: List[str]
    """Набор айдишников (Guid) файлов, привязанных к этой карточке"""
