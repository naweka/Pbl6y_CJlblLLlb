from services.id_generator_service import generate_id
from services.db_service import cards_table
from models.card import Card


def add_card(
    title: str,
    description: str,
    tags: list[str],
    id: str = None,
    status: str = "READY",
    files: list[str] = None,
) -> Card:
    id = id if id else generate_id()
    res = cards_table.insert_one(
        {
            "id": id,
            "title": title,
            "description": description,
            "tags": tags,
            "status": status,
            "files": files if files else [],
        }
    )
    res = Card(id, title, description, status, tags, files if files else [])
    return res


def update_card_by_id(
    id: str,
    title: str = None,
    description: str = None,
    tags: list[str] = None,
    status: str = None,
    files: list[str] = None,
) -> Card:
    update_dict = {}
    if title:
        update_dict["title"] = title
    if description:
        update_dict["description"] = description
    if tags:
        update_dict["tags"] = tags
    if status:
        update_dict["status"] = status
    if files:
        update_dict["files"] = files

    if update_dict:
        x = cards_table.find_one_and_update(
            {"id": id}, {"$set": update_dict}, return_document=True
        )
        res = Card(
            x["id"], x["title"], x["description"], x["status"], x["tags"], x["files"]
        )
        return res
    return None


def find_cards_by_search_text_and_tags(search_text: str, tags: list[str]) -> list[Card]:
    res = None
    has_search_text = search_text is not None and search_text != ""
    has_tags = tags is not None and len(tags) > 0

    # TODO переписать этот бред по-русски
    if has_search_text and not has_tags:  # только текст
        res = list(
            cards_table.find(
                {
                    "$or": [
                        {"title": {"$regex": search_text, "$options": "i"}},
                        {"description": {"$regex": search_text, "$options": "i"}},
                    ]
                }
            )
        )

    elif not has_search_text and has_tags:  # только теги
        res = list(cards_table.find({"tags": {"$all": tags}}))

    elif has_search_text and has_tags:  # вместе
        res = list(
            cards_table.find(
                {
                    "$and": [
                        {"tags": {"$all": tags}},
                        {
                            "$or": [
                                {"title": {"$regex": search_text, "$options": "i"}},
                                {
                                    "description": {
                                        "$regex": search_text,
                                        "$options": "i",
                                    }
                                },
                            ]
                        },
                    ]
                }
            )
        )

    else:
        res = list(cards_table.find({}))

    res = [
        Card(x["id"], x["title"], x["description"], x["status"], x["tags"], x["files"])
        for x in res
    ]
    return res


def find_card_by_id(card_id: str) -> Card:
    res = list(cards_table.find({"id": card_id}))
    res = [
        Card(x["id"], x["title"], x["description"], x["status"], x["tags"], x["files"])
        for x in res
    ]
    return res[0] if res else None


def find_card_by_file_id(file_id: str) -> Card:
    res = list(cards_table.find({"files": {"$in": [file_id]}}))
    res = [
        Card(x["id"], x["title"], x["description"], x["status"], x["tags"], x["files"])
        for x in res
    ]
    return res[0] if res else None


def get_all_tags_from_cards() -> list[str]:
    res = list(cards_table.distinct("tags"))
    return res


def append_file_to_card(card_id: str, file_id: str) -> Card:
    x = cards_table.find_one_and_update(
        {"id": card_id}, {"$push": {"files": file_id}}, return_document=True
    )
    res = Card(
        x["id"], x["title"], x["description"], x["status"], x["tags"], x["files"]
    )
    return res


def delete_card_by_id(card_id: str):
    cards_table.delete_one({"id": card_id})


def delete_file_from_cards(file_id: str):
    cards_table.update_many(
        {"files": {"$in": [file_id]}}, {"$pull": {"files": file_id}}
    )


# TODO когда-нибудь это будет реализовано
def delete_tag_from_card(card_id: str, tag: str):
    cards_table.update_one({"id": card_id}, {"$pull": {"tags": tag}})


# TODO когда-нибудь это будет реализовано
def delete_tag_from_cards(tag: str):
    cards_table.update_many({"tags": {"$in": [tag]}}, {"$pull": {"files": tag}})
