from models.Card import Card
from models.FileInfo import FileInfo
from typing import List
from services.IdGeneratorService import generate_id
from services.FileInfoService import write_uploaded_file
from uuid import UUID

# TODO
file_db:List[FileInfo] = []
cards_db:List[Card] = [
    Card(generate_id(), 'title1', 'description1', 'ANALYZING', ['tag1', 'tag2'], []),
    Card(generate_id(), 'title2', 'lol', 'READY', [], []),
    Card(generate_id(), 'Это чё !"№;%:?*\'-+', 'cringe', 'PREPARING', [], []),
    Card(generate_id(), 'name in english', 'sus', 'UPLOADING', ['tag1'], []),
    Card(generate_id(), 'название на русском', 'amogus', '', ['tag2'], []),
    Card("09090909-0909-0909-0909-090909090909", 'Тест файла', 'Описание', 'PREPARING', [], []),
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
    
    print(res[0].files)
    return res


def __get_files_by_ids(ids:List[str]) -> List[FileInfo]:
    global file_db
    res = [f for f in file_db if f.id in ids]
    return res


def get_card_files(id:str) -> tuple[List[FileInfo],int]:
    for c in cards_db:
        if c.id == id:
            file_ids:List[str] = c.files
            files = __get_files_by_ids(file_ids)
            return files, 200
    return f'Not found entity with id: {id}', 400


def upload_file_for_card(card_id:bytes,
                         file_id:bytes,
                         filename:str,
                         file_bytes:bytes) -> tuple[str,int]:
    global cards_db
    uuid_card = UUID(bytes=card_id)
    uuid_file = UUID(bytes=file_id)
    filename_alias = uuid_file.hex
    write_uploaded_file(filename_alias, file_bytes)
    
    for c in cards_db:
        if c.id != str(uuid_card):
            continue
        c.files.append(str(uuid_file))
        file_db.append(FileInfo(str(uuid_file), filename, filename_alias, None, None))
        return '', 200
    return f'Not found entity with id: {str(uuid_card)}', 400


def get_card(id:str) -> tuple[Card,int]:
    global cards_db
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