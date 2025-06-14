import traceback
from services.db_service import (
    model_settings_table,
    files_table,
)


def remove_audio_spectrogram_action():
    files_table.update_many({}, {"$unset": {"spectrogram_file_path": ""}})


def create_default_model_settings():
    model_settings_table.insert_one(
        {
            "file_id": "None",
            "window_size": 0.5,
            "window_step": 0.1,
            "min_sound_length": 0.1,
            "ignore_noise_outliers": "cut_when_at_least_one",
            "ignore_sound_outliers": "insert_when_more_than_one",
            "confidence_limit": 0.8,
            "offset_bounds": 0.1,
        }
    )


def add_file_status_to_all_file_info():
    files_table.update_many({}, {"$set": {"file_status": "READY"}})


upgrade_actions = [
    (2, remove_audio_spectrogram_action),
    (3, create_default_model_settings),
    (4, add_file_status_to_all_file_info),
]


def start_upgrade(from_ver: int) -> bool:
    for ver_of_action, action in upgrade_actions:
        if ver_of_action <= from_ver:
            continue

        # TODO добавить создание и восстановление из бэкапов
        try:
            print(f"\n\nUPGRADE ACTION START — ACTION «{action.__name__}»")
            action()
            print(f"\n\nUPGRADE ACTION SUCCESS — ACTION «{action.__name__}»")
        except:
            print(f"\n\nUPGRADE ERROR — ACTION «{action.__name__}»")
            print(traceback.format_exc())
            return False
    return True
