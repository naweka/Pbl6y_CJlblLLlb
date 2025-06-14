from models.dto import Dto
from models.model import Model

from models.user import User
from models.card import Card
from models.file_info import FileInfo
from models.model_settings import ModelSettings

from models.user_dto import UserDto
from models.card_dto import CardDto
from models.file_info_dto import FileInfoDto
from models.model_settings_dto import ModelSettingsDto

from repositories.user_repository import find_users_by_id
from repositories.file_info_repository import get_files_by_ids
from services.password_service import create_password_hash


# TODO обернуть поля в lazy, чтобы не дёргать базу каждый божий раз
def convert_dto_to_model(d):
    if not isinstance(d, Dto):
        raise Exception(f"Объект не является Dto: {type(d)}")

    if isinstance(d, UserDto):
        temp = find_users_by_id([d.id])[0]
        m = User(d.id, d.login, d.fullname, temp.password_hash)
        return d

    if isinstance(d, CardDto):
        m = Card(d.id, d.title, d.description, d.status, d.tags, d.files)
        return d

    if isinstance(d, FileInfoDto):
        temp = get_files_by_ids([d.id])[0]
        m = FileInfo(d.id, d.name, temp.audio_file_path, d.file_status)
        return m

    if isinstance(d, ModelSettingsDto):
        m = ModelSettings(
            d.file_id,
            d.window_size,
            d.window_step,
            d.min_sound_length,
            d.ignore_noise_outliers,
            d.ignore_sound_outliers,
            d.confidence_limit,
            d.offset_bounds,
        )
        return m

    raise Exception(f"Невозможно преобразовать в модель эту DTO: {type(d)}")


# TODO переписать на словарь с экшонами, а не кучу ифов
def convert_model_to_dto(m):
    if not isinstance(m, Model):
        raise Exception(f"Объект не является моделью: {type(m)}")

    if isinstance(m, User):
        d = UserDto(m.id, m.login, m.fullname)
        return d

    if isinstance(m, Card):
        d = CardDto(m.id, m.title, m.description, m.status, m.tags, m.files)
        return d

    if isinstance(m, FileInfo):
        d = FileInfoDto(m.id, m.name, m.file_status)
        return d

    if isinstance(m, ModelSettings):
        d = ModelSettingsDto(
            m.file_id,
            m.window_size,
            m.window_step,
            m.min_sound_length,
            m.ignore_noise_outliers,
            m.ignore_sound_outliers,
            m.confidence_limit,
            m.offset_bounds,
        )
        return d

    raise Exception(f"Невозможно преобразовать в DTO эту модель: {type(m)}")


def __get_json_parameter(json, arg) -> object:
    return json[arg] if arg in json else None


def __get_json_parameters(json, *args) -> list[object]:
    res = []
    if len(args) == 1:
        raise Exception(
            "Для получения одного аргумента "
            + "используйте get_json_parameter вместо get_json_parameterS!"
        )
    for arg in args:
        if arg in json:
            res.append(json[arg])
        else:
            res.append(None)
    return res


def convert_json_to_any(j, t, ignore_null=None) -> object:
    if issubclass(t, Model):
        return __convert_json_to_model(j, t, ignore_null)

    if issubclass(t, Dto):
        return __convert_json_to_dto(j, t, ignore_null)

    raise Exception(f"Тип {t} должен быть DTO или моделью")


# TODO переписать на словарь с экшонами, а не кучу ифов
def __convert_json_to_model(j, m, ignore_null=None) -> Model:
    if issubclass(m, User):
        login, password, fullname = __get_json_parameters(
            j, "login", "password", "fullname"
        )
        if password is None:
            raise Exception("Пароль не может быть пустым")
        password_hash = create_password_hash(password)
        m = User(None, login, fullname, password_hash)
        return m
    raise Exception(f"Невозможно преобразовать в модель этот тип: {type(m)}")


# TODO переписать на словарь с экшонами, а не кучу ифов
def __convert_json_to_dto(j, d, ignore_null=None) -> Dto:
    if ignore_null is None:
        ignore_null = []
    if issubclass(d, CardDto):
        id, title, description, tags = __get_json_parameters(
            j, "id", "title", "description", "tags"
        )
        d = CardDto(id, title, description, None, tags, None)
        return d

    if issubclass(d, ModelSettingsDto):
        (
            file_id,
            window_size,
            window_step,
            min_sound_length,
            ignore_noise_outliers,
            ignore_sound_outliers,
            confidence_limit,
            offset_bounds,
        ) = __get_json_parameters(
            j,
            "file_id",
            "window_size",
            "window_step",
            "min_sound_length",
            "ignore_noise_outliers",
            "ignore_sound_outliers",
            "confidence_limit",
            "offset_bounds",
        )

        nones = []
        if file_id is None and "file_id" not in ignore_null:
            nones.append("file_id")
        if window_size is None:
            nones.append("window_size")
        if window_step is None:
            nones.append("window_step")
        if min_sound_length is None:
            nones.append("min_sound_length")
        if ignore_noise_outliers is None:
            nones.append("ignore_noise_outliers")
        if ignore_sound_outliers is None:
            nones.append("ignore_sound_outliers")
        if confidence_limit is None:
            nones.append("confidence_limit")
        if offset_bounds is None:
            nones.append("offset_bounds")

        if len(nones) > 0:
            error = "Следующие поля должны быть заполнены: " + ", ".join(nones)
            raise Exception(error)

        d = ModelSettingsDto(
            file_id,
            window_size,
            window_step,
            min_sound_length,
            ignore_noise_outliers,
            ignore_sound_outliers,
            confidence_limit,
            offset_bounds,
        )
        return d
    raise Exception(f"Невозможно преобразовать в DTO этот тип: {type(d)}")
