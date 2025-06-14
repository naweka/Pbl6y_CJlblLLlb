from models.model_settings import ModelSettings
from models.model_settings_dto import ModelSettingsDto
from services.ai_service import files_queue, processing_files
from repositories.model_settings_repository import (
    add_model_settings,
    update_default_model_settings,
    update_model_settings,
    find_model_settings_by_file_id,
    find_default_model_settings,
)
from repositories.file_info_repository import get_files_by_ids, update_status_for_file


def get_default_model_settings_handler() -> ModelSettings:
    return find_default_model_settings()


def get_model_settings_handler(file_id) -> ModelSettings:
    file = get_files_by_ids([file_id])
    if len(file) == 0:
        raise Exception(f"Не найден файл с ID {file_id}")

    x = find_model_settings_by_file_id(file_id)
    if x is None:
        x = find_default_model_settings()
        x.file_id = file_id
    return x


def update_model_settings_handler(
    model_settings_dto: ModelSettingsDto,
) -> list[ModelSettings]:
    file = get_files_by_ids([model_settings_dto.file_id])
    if len(file) == 0:
        raise Exception(f"Не найден файл с ID {model_settings_dto.file_id}")

    update_status_for_file(model_settings_dto.file_id, "PREPARING")

    x = find_model_settings_by_file_id(model_settings_dto.file_id)
    if x is None:
        res = add_model_settings(
            model_settings_dto.file_id,
            model_settings_dto.window_size,
            model_settings_dto.window_step,
            model_settings_dto.min_sound_length,
            model_settings_dto.ignore_noise_outliers,
            model_settings_dto.ignore_sound_outliers,
            model_settings_dto.confidence_limit,
            model_settings_dto.offset_bounds,
        )
    else:
        res = update_model_settings(
            model_settings_dto.file_id,
            model_settings_dto.window_size,
            model_settings_dto.window_step,
            model_settings_dto.min_sound_length,
            model_settings_dto.ignore_noise_outliers,
            model_settings_dto.ignore_sound_outliers,
            model_settings_dto.confidence_limit,
            model_settings_dto.offset_bounds,
        )
    files_queue.append(file[0])
    processing_files.add(model_settings_dto.file_id)
    return res


def update_default_model_settings_handler(
    model_settings_dto: ModelSettingsDto,
) -> list[ModelSettings]:
    res = update_default_model_settings(
        model_settings_dto.file_id,
        model_settings_dto.window_size,
        model_settings_dto.window_step,
        model_settings_dto.min_sound_length,
        model_settings_dto.ignore_noise_outliers,
        model_settings_dto.ignore_sound_outliers,
        model_settings_dto.confidence_limit,
        model_settings_dto.offset_bounds,
    )
    return res
