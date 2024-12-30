import traceback
from services.DbService import cards_db, files_db, users_db, system_db


def remove_audio_spectrogram_action():
    files_db.update_many({}, {'$unset': {'spectrogram_file_path': ''}})


upgrade_actions = [(2, remove_audio_spectrogram_action)]


def start_upgrade(from_ver:int) -> bool:
    for ver_of_action, action in upgrade_actions:
        if ver_of_action <= from_ver:
            continue

        try:
            print(f'\n\nUPGRADE ACTION START — ACTION «{action.__name__}»')
            action()
            print(f'\n\nUPGRADE ACTION SUCCESS — ACTION «{action.__name__}»')
        except:
            print(f'\n\nUPGRADE ERROR — ACTION «{action.__name__}»')
            print(traceback.format_exc())
            return False
    return True
