from dataclasses import dataclass
from models.dto import Dto


@dataclass
class UserDto(Dto):
    id: str
    """Id пользователя (Guid)"""

    login: str
    """Логин пользователя"""

    fullname: str
    """Отображаемое имя пользователя"""
