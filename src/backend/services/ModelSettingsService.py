from models.ModelSettings import ModelSettings
from appconfig import WORKING_DIRECTORY
from services.IdGeneratorService import generate_id
from repositories.file_repository import get_files_by_ids
from services.AiService import files_queue, processing_files
from repositories.model_settings_repository import (add_model_settings,
                                                    update_default_model_settings,
                                                    update_model_settings,
                                                    find_model_settings_by_file_id,
                                                    find_default_model_settings_by_file_id,
                                                    delete_card_by_id)
from repositories.file_repository import get_files_by_ids, update_status_for_file

def get_default_model_settings_handler() -> tuple[list[ModelSettings],int]:
    return find_default_model_settings_by_file_id(), 200


def get_model_settings_handler(file_id) -> tuple[list[ModelSettings],int]:
    file = get_files_by_ids([file_id])
    if len(file) == 0:
        return {
        'error_message': f'Not found entity with id: {file_id}'
    }, 400

    x = find_model_settings_by_file_id(file_id)
    if x is None:
        x = find_default_model_settings_by_file_id()
    return x, 200



def update_model_settings_handler(file_id,
                          window_size,
                          window_step,
                          min_sound_length,
                          ignore_noise_outliers,
                          ignore_sound_outliers,
                          confidence_limit,
                          offset_bounds) -> tuple[list[ModelSettings],int]:
    file = get_files_by_ids([file_id])
    if len(file) == 0:
        return {
        'error_message': f'Not found entity with id: {file_id}'
    }, 400

    update_status_for_file(file_id, 'PREPARING')

    x = find_model_settings_by_file_id(file_id)
    if x is None:
        res = add_model_settings(file_id,
                       window_size,
                       window_step,
                       min_sound_length,
                       ignore_noise_outliers,
                       ignore_sound_outliers,
                       confidence_limit,
                       offset_bounds)
    else:
        res = update_model_settings(file_id,
                            window_size,
                            window_step,
                            min_sound_length,
                            ignore_noise_outliers,
                            ignore_sound_outliers,
                            confidence_limit,
                            offset_bounds)
    files_queue.append(file[0])
    processing_files.add(file_id)
    return res, 200


def update_default_model_settings_handler(window_size,
                          window_step,
                          min_sound_length,
                          ignore_noise_outliers,
                          ignore_sound_outliers,
                          confidence_limit,
                          offset_bounds) -> tuple[list[ModelSettings],int]:
    
    res = update_default_model_settings(window_size,
                          window_step,
                          min_sound_length,
                          ignore_noise_outliers,
                          ignore_sound_outliers,
                          confidence_limit,
                          offset_bounds)
    return res, 200