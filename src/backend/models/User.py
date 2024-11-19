from dataclasses import dataclass

@dataclass
class User:
    id:str
    login:str
    fullname:str
    password_hash:str