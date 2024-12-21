from models.Card import Card
from models.FileInfo import FileInfo
from typing import List
from services.IdGeneratorService import generate_id
from services.FileInfoService import write_uploaded_file
from services.AiService import files_queue
from repositories.card_repository import (add_card,
                                          find_cards_by_search_text_and_tags,
                                          find_card_by_id,
                                          delete_card_by_id,
                                          update_card_by_id)

# TODO
# file_db:List[FileInfo] = [FileInfo('01010101-0909-0909-0909-090909090909', 'Запись 1.wav', '01010101-0909-0909-0909-090909090909', None, None),
#                           FileInfo('02020202-0909-0909-0909-090909090909', 'Запись 2.wav', '02020202-0909-0909-0909-090909090909', None, None),
#                           FileInfo('03030303-0909-0909-0909-090909090909', 'Запись 3 ночью.wav', '03030303-0909-0909-0909-090909090909', None, None),
#                           FileInfo('04040404-0909-0909-0909-090909090909', 'Просто 4.wav', '04040404-0909-0909-0909-090909090909', None, None),
#                           FileInfo('05050505-0909-0909-0909-090909090909', 'English_record_20231107.wav', '05050505-0909-0909-0909-090909090909', None, None)]

# cards_db:List[Card] = [
#     Card(generate_id(), 'title1', 'description1', 'ANALYZING', ['tag1', 'tag2'], []),
#     Card(generate_id(), 'title2', 'lol', 'READY', [], []),
#     Card(generate_id(), 'Это чё !"№;%:?*\'-+', 'cringe', 'PREPARING', [], []),
#     Card(generate_id(), 'name in english', 'sus', 'UPLOADING', ['tag1'], []),
#     Card(generate_id(), 'название на русском', 'amogus', '', ['tag2'], []),
#     Card("08080808-0909-0909-0909-090909090909", 'Записи с озера Белого', 'Здесь собраны все записи с 2027 года с озера Белое возле города Славноградска.', 'READY', [], ['01010101-0909-0909-0909-090909090909',
#                                                                                              '02020202-0909-0909-0909-090909090909',
#                                                                                              '03030303-0909-0909-0909-090909090909',
#                                                                                              '04040404-0909-0909-0909-090909090909',
#                                                                                              '05050505-0909-0909-0909-090909090909',]),
# ]

def get_cards(search_text:str, tags:List[str]) -> tuple[list[Card],int]:
    res = find_cards_by_search_text_and_tags(search_text, tags)    
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
    path = write_uploaded_file(filename_alias, file_bytes)
    
    for c in cards_db:
        if c.id != card_id:
            continue

        c.files.append(str(file_id))
        file_info = FileInfo(str(file_id), filename, filename_alias, path, None)
        file_db.append(file_info)
        
        files_queue.append(file_info)
        # path_to_fake = WORKING_DIRECTORY +'/fake_spectro.png'
        # path_to_fake_new = WORKING_DIRECTORY + f'/server_data/spectrograms/{filename_alias}.png'
        # shutil.copyfile(path_to_fake, path_to_fake_new)
        return '', 200
    
    return {
        'error_message': f'Not found entity with id: {card_id}'
    }, 400


def get_card(id:str) -> tuple[Card,int]:
    res = find_card_by_id(id)
    if not res:
        return {
            'error_message': f'Card with id {id} not found'
        }, 400
    
    return res, 200


def create_card(title:str, description:str, tags:list[str]) -> tuple[Card,int]:
    # TODO null checker
    if title is None or title == '':
        return {
            'error_message': f'Title is null or empty'
        }, 400
    
    if description is None:
        description = ''
    
    c = add_card(title, description, tags if tags else [])
    return c, 200



def update_card(id: str, title:str, description:str, tags:list[str]) -> tuple[Card,int]:    
    # TODO null checker
    if id is None or id == '':
        return {
            'error_message': f'Id is null or empty'
        }, 400
    
    res = update_card_by_id(id, title=title, description=description, tags=tags)
    return res, 200


def remove_card(id:str) -> tuple[str,int]:
    if id is None or id == '':
        return {
            'error_message': f'Wrong id: {id}'
        }, 400
    
    delete_card_by_id(id)
    return '', 200