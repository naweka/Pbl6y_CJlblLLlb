import uuid


def generate_id() -> uuid.uuid4:
    return str(uuid.uuid4())


def generate_ids(count: int) -> list[uuid.uuid4]:
    return [str(uuid.uuid4()) for _ in range(count)]
