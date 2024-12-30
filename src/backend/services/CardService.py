from models.Card import Card
from models.FileInfo import FileInfo
from typing import List
from services.IdGeneratorService import generate_id
from services.FileInfoService import write_uploaded_file, delete_uploaded_file
from services.AiService import files_queue
from repositories.card_repository import (add_card,
                                          find_cards_by_search_text_and_tags,
                                          find_card_by_id,
                                          delete_card_by_id,
                                          update_card_by_id,
                                          append_file_to_card,
                                          delete_file_from_cards,
                                          update_status_for_card)
from repositories.file_repository import add_file, get_files_by_ids, delete_file_by_id


def get_cards(search_text:str, tags:List[str]) -> tuple[list[Card],int]:
    res = find_cards_by_search_text_and_tags(search_text, tags)    
    return res, 200


def get_card_files(id:str) -> tuple[List[FileInfo],int]:
    file_ids = find_card_by_id(id).files
    file_infos = get_files_by_ids(file_ids)
    return file_infos, 200


def upload_file_for_card(card_id:str,
                         file_id:str,
                         filename:str,
                         file_bytes:bytes) -> tuple[str,int]:
    filename_alias = file_id
    path = write_uploaded_file(filename_alias, file_bytes)
    
    card = append_file_to_card(card_id, file_id)
    if card is not None:
        file_info = add_file(file_id, filename, filename_alias, path)
        files_queue.append(file_info)
        return '', 200
    
    return {
        'error_message': f'Not found entity with id: {card_id}'
    }, 400


def remove_file(id:str) -> tuple[str,int]:
    delete_uploaded_file(id)
    delete_file_from_cards(id)
    delete_file_by_id(id)
    return '', 200


def get_card(id:str) -> tuple[Card,int]:
    res = find_card_by_id(id)
    if not res:
        return {
            'error_message': f'Card with id {id} not found'
        }, 400
    
    return res, 200


def create_card(title:str, description:str=None, tags:list[str]=None) -> tuple[Card,int]:
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