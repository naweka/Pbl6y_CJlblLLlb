from typing import List

# TODO
tags_db:List[str] = ['tag1', 'tag2']


def get_all_tags() -> List[str]:
    global tags_db
    return tags_db


def add_tag(name:str):
    global tags_db
    tags_db.append(name)
    return name


def remove_tag(name:str):
    for elem in tags_db:
        if elem.name == name:
            del(elem)