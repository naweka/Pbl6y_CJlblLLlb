from repositories.card_repository import get_all_tags_from_cards


def get_all_tags() -> list[str]:
    res = get_all_tags_from_cards()
    return res

# TODO метод должен проходить по всем карточкам и удалять тег из них
def remove_tag(name:str) -> int:
    raise NotImplementedError()