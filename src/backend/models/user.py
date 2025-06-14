from dataclasses import dataclass
from models.model import Model


@dataclass
class User(Model):
    id: str
    """Id пользователя (Guid)"""

    login: str
    """Логин пользователя"""

    fullname: str
    """Отображаемое имя пользователя"""

    password_hash: str
    """Солёный хэш пароля пользователя. Вычисляется с использованием SHA3"""
