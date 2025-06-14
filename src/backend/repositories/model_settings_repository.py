from services.db_service import model_settings_table
from models.model_settings import ModelSettings


def add_model_settings(
    file_id: str,
    window_size: float = 0.5,
    window_step: float = 0.1,
    min_sound_length: float = 0.1,
    ignore_noise_outliers: str = "cut_when_at_least_one",
    ignore_sound_outliers: float = "insert_when_more_than_one",
    confidence_limit: float = 0.8,
    offset_bounds: float = 0.1,
) -> ModelSettings:
    if file_id is None:
        raise Exception(
            "ERROR file_id is None. For updating default model settings please use update_default_model_settings"
        )

    res = model_settings_table.insert_one(
        {
            "file_id": file_id,
            "window_size": window_size,
            "window_step": window_step,
            "min_sound_length": min_sound_length,
            "ignore_noise_outliers": ignore_noise_outliers,
            "ignore_sound_outliers": ignore_sound_outliers,
            "confidence_limit": confidence_limit,
            "offset_bounds": offset_bounds,
        }
    )
    res = ModelSettings(
        file_id,
        window_size,
        window_step,
        min_sound_length,
        ignore_noise_outliers,
        ignore_sound_outliers,
        confidence_limit,
        offset_bounds,
    )
    return res


def update_default_model_settings(
    file_id: str,
    window_size: float = 0.5,
    window_step: float = 0.1,
    min_sound_length: float = 0.1,
    ignore_noise_outliers: str = "cut_when_at_least_one",
    ignore_sound_outliers: float = "insert_when_more_than_one",
    confidence_limit: float = 0.8,
    offset_bounds: float = 0.1,
) -> ModelSettings:
    update_dict = {
        "window_size": window_size,
        "window_step": window_step,
        "min_sound_length": min_sound_length,
        "ignore_noise_outliers": ignore_noise_outliers,
        "ignore_sound_outliers": ignore_sound_outliers,
        "confidence_limit": confidence_limit,
        "offset_bounds": offset_bounds,
    }
    model_settings_table.find_one_and_update(
        {"file_id": "None"}, {"$set": update_dict}, return_document=True
    )
    res = ModelSettings(
        file_id,
        window_size,
        window_step,
        min_sound_length,
        ignore_noise_outliers,
        ignore_sound_outliers,
        confidence_limit,
        offset_bounds,
    )
    return res


def update_model_settings(
    file_id: str,
    window_size: float = 0.5,
    window_step: float = 0.1,
    min_sound_length: float = 0.1,
    ignore_noise_outliers: str = "cut_when_at_least_one",
    ignore_sound_outliers: float = "insert_when_more_than_one",
    confidence_limit: float = 0.8,
    offset_bounds: float = 0.1,
) -> ModelSettings:
    if file_id is None:
        raise Exception(
            "ERROR file_id is None. For updating default model settings please use update_default_model_settings"
        )

    update_dict = {
        "window_size": window_size,
        "window_step": window_step,
        "min_sound_length": min_sound_length,
        "ignore_noise_outliers": ignore_noise_outliers,
        "ignore_sound_outliers": ignore_sound_outliers,
        "confidence_limit": confidence_limit,
        "offset_bounds": offset_bounds,
    }
    x = model_settings_table.find_one_and_update(
        {"file_id": file_id}, {"$set": update_dict}, return_document=True
    )
    res = ModelSettings(
        file_id,
        x["window_size"],
        x["window_step"],
        x["min_sound_length"],
        x["ignore_noise_outliers"],
        x["ignore_sound_outliers"],
        x["confidence_limit"],
        x["offset_bounds"],
    )
    return res


def find_model_settings_by_file_id(file_id: str) -> ModelSettings:
    x = list(model_settings_table.find({"file_id": file_id}))
    if len(x) == 0:
        return None
    x = x[0]
    res = ModelSettings(
        file_id,
        x["window_size"],
        x["window_step"],
        x["min_sound_length"],
        x["ignore_noise_outliers"],
        x["ignore_sound_outliers"],
        x["confidence_limit"],
        x["offset_bounds"],
    )
    return res


def find_default_model_settings() -> ModelSettings:
    x = list(model_settings_table.find({"file_id": "None"}))
    if len(x) == 0:
        return None
    x = x[0]
    res = ModelSettings(
        "None",
        x["window_size"],
        x["window_step"],
        x["min_sound_length"],
        x["ignore_noise_outliers"],
        x["ignore_sound_outliers"],
        x["confidence_limit"],
        x["offset_bounds"],
    )
    return res
