import uuid
from typing import List

def generate_id() -> uuid.uuid4:
    return str(uuid.uuid4())

def generate_ids(count:int) -> List[uuid.uuid4]:
    return [str(uuid.uuid4()) for _ in range(count)]