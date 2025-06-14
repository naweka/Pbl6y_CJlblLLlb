from hashlib import sha3_256
from appconfig import PASSWORD_SALT


def create_password_hash(password) -> str:
    return sha3_256(f"{PASSWORD_SALT}{password}".encode("utf-8")).hexdigest()
