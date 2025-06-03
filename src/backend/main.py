print('Подключение к СУБД...')
from services.db_service import initalize_normal_connection
initalize_normal_connection()
from services.db_service import system_table, model_settings_table

print('Подключение библиотек...')
from services.ai_service import ai_event_loop
from services.upgrade_service import start_upgrade
from services.ai_service import _model, ckpt,_device
from repositories.user_repository import add_debug_user
from repositories.user_repository import find_users_by_id
from appconfig import (DB_VERSION,
                       TEST_USER_ID,
                       IS_DEV_MODE_ENABLED,
                       PATH_TO_THE_MODEL,
                       PATH_TO_THE_MODEL_FOLDER,
                       PATH_TO_THE_PACKED_MODEL_FOLDER)
from controllers.auth_controller import auth_controller_blueprint
from controllers.card_controller import card_controller_blueprint
from controllers.file_controller import file_controller_blueprint
from controllers.model_settings_controller import model_settings_controller_blueprint
import glob, os, zipfile, torch
from threading import Thread
from flask_cors import CORS
from flask import Flask


def init_flask_stuff() -> None:
    global app, cors

    app = Flask(__name__)
    cors = CORS(app,
                resources={r'*': {'origins': '*'}},
                supports_credentials=True,
                expose_headers=['Content-Disposition'])
    
    app.register_blueprint(auth_controller_blueprint)
    app.register_blueprint(card_controller_blueprint)
    app.register_blueprint(file_controller_blueprint)
    app.register_blueprint(model_settings_controller_blueprint)
    return app


def upgrade_db_check():
    system_settings = list(system_table.find({}))
    if not system_settings:
        system_table.insert_one({'db_version': DB_VERSION})
        return
    
    system_settings = system_settings[0]
    db_version = system_settings['db_version']
    if db_version == DB_VERSION:
        return

    if db_version > DB_VERSION:
        raise Exception(f'Даунгрейд с {db_version} на {DB_VERSION} не поддерживается')

    upgrade_res = start_upgrade(db_version)
    # TODO Реализовать систему бэкапов при апгрейде схемы
    if not upgrade_res:
        raise Exception(f'При апгрейде что-то пошло не так...')
    
    system_table.update_one({}, {'$set': {'db_version': DB_VERSION}})
    return


def prepare_model():
    if not os.path.exists(PATH_TO_THE_MODEL):
        print('Файл модели "/packed_model/unpacked/swin_audio.pth" не был найден! Распаковка...')
        zip_prefix = "swin_audio.zip."
        
        parts = glob.glob(PATH_TO_THE_PACKED_MODEL_FOLDER + zip_prefix + '*')
        n = len(parts)

        with open(PATH_TO_THE_PACKED_MODEL_FOLDER + "merged.zip", "wb") as outfile:
            for i in range(1, n+1):
                filename = PATH_TO_THE_PACKED_MODEL_FOLDER + zip_prefix + str(i).zfill(3)
                with open(filename, "rb") as infile:
                    outfile.write(infile.read())
        
        with zipfile.ZipFile(PATH_TO_THE_PACKED_MODEL_FOLDER + "merged.zip", "r") as zip_ref:
            zip_ref.extractall(PATH_TO_THE_MODEL_FOLDER)
    
    if not os.path.exists(PATH_TO_THE_MODEL):
        raise Exception(f'Произошла проблема при распаковке весов модели! Убедитесь, что файл существует: {PATH_TO_THE_MODEL}')


def load_model():
    _model.load_state_dict(torch.load(ckpt,
                                      map_location=torch.device('cuda' if torch.cuda.is_available() else 'cpu')))
    _model.eval().to(_device)


def create_debug_user():
    if len(find_users_by_id(TEST_USER_ID, use_contains=False)) == 0:
        add_debug_user('test', 'DEBUG USER', 'test')


def run_event_loop():
    ai_event_loop_thread = Thread(target=ai_event_loop, daemon=True, name='ai_event_loop_thread')
    ai_event_loop_thread.start()


def create_default_model_settings():
    x = list(model_settings_table.find({'file_id': 'None'}))
    if len(x) != 0:
        print('Настройки по умолчанию уже созданы')
        return
    
    model_settings_table.insert_one({
        'file_id': 'None',
        'window_size': 0.5,
        'window_step': 0.1,
        'min_sound_length':0.1,
        'ignore_noise_outliers': 'cut_when_at_least_one',
        'ignore_sound_outliers': 'insert_when_more_than_one',
        'confidence_limit': 0.7,
        'offset_bounds': 0.0
    })
    print('Настройки по умолчанию были созданы успешно')



def main():
    global app
    print('Апгрейд БД...')
    upgrade_db_check()
    print('Инициализация Flask...')
    app = init_flask_stuff()
    print('Проверка наличия модели...')
    prepare_model()
    print('Загрузка модели...')
    load_model()
    print('Запуск процесса для обработки...')
    run_event_loop()
    print('Проверка наличия дефолтных настроек модели...')
    create_default_model_settings()

    if IS_DEV_MODE_ENABLED:
        print('Проверка наличия тестового пользователя...')
        create_debug_user()
    
    # По непонятной причине hot reload, включаемый режимом отладки,
    # детектит какое-то изменение внутри ивент лупа, что приводит
    # к перезагрузке сервера при попытке обработать любой файл.
    # В связи с этим, debug можно устанавливать только в False
    app.run(debug=False, host='0.0.0.0')


if __name__ == '__main__':
    main()