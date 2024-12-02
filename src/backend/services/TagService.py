from typing import List
from services.CardService import cards_db


def get_all_tags() -> tuple[List[str], int]:
    res = set()
    for c in cards_db:
        for t in c.tags:
            res.add(t)
    return list(res), 200


def remove_tag(name:str) -> int:
    for c in cards_db:
        if name in c.tags:
            c.tags.remove(name)
    return 200