import uuid

def generate_id() -> uuid.uuid4:
    return str(uuid.uuid4())