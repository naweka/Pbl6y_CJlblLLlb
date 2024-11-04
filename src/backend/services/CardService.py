from models.Card import Card
from typing import List
from services.IdGeneratorService import generate_id

# TODO
cards_db:List[Card] = [
    Card(generate_id(), 'title1', 'description1', 'ANALYZING', ['tag1', 'tag2'], []),
    Card(generate_id(), 'title2', 'lol', 'READY', [], []),
    Card(generate_id(), 'Это чё !"№;%:?*\'-+', 'cringe', 'PREPARING', [], []),
    Card(generate_id(), 'name in english', 'sus', 'UPLOADING', ['tag1'], []),
    Card(generate_id(), 'название на русском', 'amogus', '', ['tag2'], []),
]

def get_cards(search_text:str, tags:List[str]) -> List[Card]:
    res = cards_db[:]
    if search_text is not None and search_text != '':
        search_text_lower = search_text.lower()
        res = [x for x in res
               if search_text_lower in x.title.lower()
                    or search_text in x.description.lower()]
    
    if tags is not None:
        res = [x for x in res if all([tag in x.tags for tag in tags])]
    
    return res


def get_card(id:str) -> tuple[Card,int]:
    for c in cards_db:
        if c.id == id:
            return c, 200
    return f'Card with id {id} not found', 400


def add_card(title:str, description:str) -> tuple[str,int]:
    global cards_db
    # TODO null checker
    if title is None or title == '':
        return f'Title is null or empty', 400
    if description is None:
        description = ''
    
    id = generate_id()
    c = Card(id, title, description, 'PREPARING', [], [])
    cards_db.append(c)
    return c, 200


def remove_card(id:str) -> tuple[str,int]:
    global cards_db
    if id is None or id == '':
        return f'Wrong id: {id}', 400
    
    for elem in cards_db:
        if elem.id == id:
            cards_db.remove(elem)
            return '', 200  
        
    return f'Not found entity with id: {id}', 400