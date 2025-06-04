from repositories.card_repository import (add_card,
                                          find_cards_by_search_text_and_tags,
                                          find_card_by_id,
                                          delete_card_by_id,
                                          update_card_by_id,
                                          append_file_to_card,
                                          delete_file_from_cards)
from repositories.file_info_repository import add_file, get_files_by_ids, delete_file_by_id
from services.file_info_service import write_uploaded_file, delete_uploaded_file
from models.card import Card
from models.card_dto import CardDto
from models.file_info import FileInfo
from services.ai_service import files_queue, processing_files


def get_card(id:str) -> Card:
    res = find_card_by_id(id)
    files = get_files_by_ids(res.files)
    if any([x.file_status == 'ERROR' for x in files]):
        res.status = 'ERROR'
    if any([x.file_status == 'PREPARING' for x in files]):
        res.status = 'PREPARING'
    elif any([x.file_status == 'ANALYZING' for x in files]):
        res.status = 'ANALYZING'
    else:
        res.status = 'READY'
    if not res:
        raise Exception(f'Не найдена карточка с ID: {id}')
    
    return res


def get_cards(search_text:str, tags:list[str]) -> list[Card]:
    res = find_cards_by_search_text_and_tags(search_text, tags)
    for i, card in enumerate(res):
        files = get_files_by_ids(card.files)
        if any([x.file_status == 'ERROR' for x in files]):
            res[i].status = 'ERROR'
        if any([x.file_status == 'PREPARING' for x in files]):
            res[i].status = 'PREPARING'
        elif any([x.file_status == 'ANALYZING' for x in files]):
            res[i].status = 'ANALYZING'
        else:
            res[i].status = 'READY'
    return res


def get_card_files(id:str) -> list[FileInfo]:
    file_ids = find_card_by_id(id).files
    file_infos = get_files_by_ids(file_ids)
    return file_infos


def upload_file_for_card(card_id:str,
                         file_id:str,
                         filename:str,
                         file_bytes:bytes) -> str:
    path = write_uploaded_file(file_id, file_bytes)
    
    card = append_file_to_card(card_id, file_id)
    if card is not None:
        file_info = add_file(file_id, filename, path)
        files_queue.append(file_info)
        processing_files.add(file_id)
        return ''
    
    raise Exception(f'Не найдена карточка с ID: {card_id}')


def remove_file(id:str) -> str:
    delete_uploaded_file(id)
    delete_file_from_cards(id)
    delete_file_by_id(id)
    return ''


def create_card(card_dto:CardDto) -> Card:
    # TODO null checker
    if card_dto.title is None or card_dto.title == '':
        raise Exception(f'Название карточки не может быть пустым')
    
    if card_dto.description is None:
        card_dto.description = ''
    
    c = add_card(card_dto.title, card_dto.description, card_dto.tags if card_dto.tags else [])
    return c


def update_card(card_dto:CardDto) -> Card:    
    # TODO null checker
    if id is None or id == '':
        raise Exception(f'ID карточки не может быть пустым')
    
    res = update_card_by_id(card_dto.id,
                            title=card_dto.title,
                            description=card_dto.description,
                            tags=card_dto.tags)
    return res


def remove_card(id:str) -> str:
    if id is None or id == '':
        raise Exception(f'ID карточки не может быть пустым')
    
    delete_card_by_id(id)
    return ''