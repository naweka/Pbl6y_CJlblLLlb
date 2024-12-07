from models.Card import Card
from models.FileInfo import FileInfo
from typing import List
from services.IdGeneratorService import generate_id
from services.FileInfoService import write_uploaded_file
import os
import shutil

# TODO
file_db:List[FileInfo] = [FileInfo('01010101-0909-0909-0909-090909090909', 'Имя файла полученное при загрузке.wav', '01010101-0909-0909-0909-090909090909'),
                          FileInfo('02020202-0909-0909-0909-090909090909', 'Имя второго файла.wav', '02020202-0909-0909-0909-090909090909'),
                          FileInfo('03030303-0909-0909-0909-090909090909', 'У третьего файла имя оказалось каким то уже слишком длинным, поэтому было решено добить его часть точками.wav', '03030303-0909-0909-0909-090909090909'),
                          FileInfo('04040404-0909-0909-0909-090909090909', 'Просто 4.wav', '04040404-0909-0909-0909-090909090909'),
                          FileInfo('05050505-0909-0909-0909-090909090909', 'English_record_20231107.wav', '05050505-0909-0909-0909-090909090909')]

cards_db:List[Card] = [
    Card(generate_id(), 'title1', 'description1', 'ANALYZING', ['tag1', 'tag2'], []),
    Card(generate_id(), 'title2', 'lol', 'READY', [], []),
    Card(generate_id(), 'Это чё !"№;%:?*\'-+', 'cringe', 'PREPARING', [], []),
    Card(generate_id(), 'name in english', 'sus', 'UPLOADING', ['tag1'], []),
    Card(generate_id(), 'название на русском', 'amogus', '', ['tag2'], []),
    Card("08080808-0909-0909-0909-090909090909", 'Тест файла', 'Описание', 'PREPARING', [], ['01010101-0909-0909-0909-090909090909',
                                                                                             '02020202-0909-0909-0909-090909090909',
                                                                                             '03030303-0909-0909-0909-090909090909',
                                                                                             '04040404-0909-0909-0909-090909090909',
                                                                                             '05050505-0909-0909-0909-090909090909',]),
]

def get_cards(search_text:str, tags:List[str]) -> tuple[List[Card],int]:
    res = cards_db[:]
    if search_text is not None and search_text != '':
        search_text_lower = search_text.lower()
        res = [x for x in res
               if search_text_lower in x.title.lower()
                    or search_text in x.description.lower()]
    
    if tags is not None:
        res = [x for x in res if all([tag in x.tags for tag in tags])]
    
    return res, 200


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
    return {
        'error_message': f'Not found entity with id: {id}'
    }, 400


def upload_file_for_card(card_id:str,
                         file_id:str,
                         filename:str,
                         file_bytes:bytes) -> tuple[str,int]:
    global cards_db
    filename_alias = file_id
    write_uploaded_file(filename_alias, file_bytes)
    
    for c in cards_db:
        if c.id != card_id:
            continue

        c.files.append(str(file_id))
        file_db.append(FileInfo(str(file_id), filename, filename_alias, None, None))
        
        path_to_fake = os.getcwd()+'/fake_spectro.png'
        path_to_fake_new = os.getcwd()+f'/server_data/spectrograms/{filename_alias}.png'
        shutil.copyfile(path_to_fake, path_to_fake_new)
        return '', 200
    
    return {
        'error_message': f'Not found entity with id: {card_id}'
    }, 400


def get_card(id:str) -> tuple[Card,int]:
    global cards_db
    for c in cards_db:
        if c.id == id:
            return c, 200
    return {
        'error_message': f'Card with id {id} not found'
    }, 400


def add_card(title:str, description:str, tags:List[str]) -> tuple[Card,int]:
    # TODO null checker
    if title is None or title == '':
        return {
            'error_message': f'Title is null or empty'
        }, 400
    
    if description is None:
        description = ''
    
    global cards_db
    id = generate_id()
    c = Card(id, title, description, 'PREPARING', tags if tags else [], [])
    cards_db.append(c)
    return c, 200



def update_card(id: str, title:str, description:str, tags:List[str]) -> tuple[Card,int]:    
    # TODO null checker
    if id is None or id == '':
        return {
            'error_message': f'Id is null or empty'
        }, 400
    
    global cards_db
    for card in cards_db:
        if card.id == id:
            if title is not None and title != '':
                card.title = title
            if description is not None and description != '':
                card.description = description
            if tags is not None:
                card.tags = tags
            return card, 200
    
    return {
            'error_message': f'Карточка с Id {id} не найдена'
        }, 400


def remove_card(id:str) -> tuple[str,int]:
    if id is None or id == '':
        return {
            'error_message': f'Wrong id: {id}'
        }, 400
    
    global cards_db
    for elem in cards_db:
        if elem.id == id:
            cards_db.remove(elem)
            return '', 200  
        
    return {
        'error_message': f'Not found entity with id: {id}'
    }, 400