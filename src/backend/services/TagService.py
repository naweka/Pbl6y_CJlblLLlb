from typing import List
from repositories.card_repository import get_all_tags_from_cards
# from services.CardService import cards_db


def get_all_tags() -> tuple[List[str], int]:
    res = get_all_tags_from_cards()
    return res, 200


def remove_tag(name:str) -> int:
    raise NotImplementedError()
    for c in cards_db:
        if name in c.tags:
            c.tags.remove(name)
    return 200