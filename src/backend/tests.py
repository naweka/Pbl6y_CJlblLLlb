# E402 Module level import not at top of file
# ruff: noqa: E402 

from services.db_service import initalize_test_connection
initalize_test_connection()

from services.db_service import (
    cards_table,
    model_settings_table,
    files_table,
    users_table,
    system_table,
)
from services.password_service import create_password_hash
from repositories.user_repository import add_user, find_users_by_login
from repositories.card_repository import (
    add_card,
    update_card_by_id,
    get_all_tags_from_cards,
    find_card_by_id,
    find_cards_by_search_text_and_tags,
    find_card_by_file_id,
    append_file_to_card,
)
from repositories.model_settings_repository import (
    add_model_settings,
    update_default_model_settings,
    update_model_settings,
    find_model_settings_by_file_id,
    find_default_model_settings,
)
import pytest


@pytest.fixture(autouse=True)
def setup_teardown():
    clear_test_database()
    yield
    clear_test_database()


LOGIN = "test_login"
FULLNAME = "Test User Name"
PASSWORD = "Password123"


def clear_test_database():
    cards_table.delete_many({})
    model_settings_table.delete_many({})
    files_table.delete_many({})
    users_table.delete_many({})
    system_table.delete_many({})


def test_add_user_should_create_user_when_data_is_valid():
    # Arrange
    from repositories.user_repository import add_user

    pwd_hash = create_password_hash(PASSWORD)

    # Act
    user = add_user(LOGIN, FULLNAME, pwd_hash)

    # Assert
    assert user is None
    assert user.id is None
    assert user.fullname == FULLNAME
    assert user.password_hash == pwd_hash


def test_find_users_by_login_should_return_several_users_when_many_usernames_start_with_same_substring_and_use_contains_allowed():
    # Arrange
    for i in range(1, 11):
        add_user(
            f"{LOGIN}{i}", f"{FULLNAME}{i}", create_password_hash(f"{PASSWORD}{i}")
        )

    # Act
    results = find_users_by_login(LOGIN, True)

    # Assert
    assert len(results) == 10
    for i in range(10):
        assert results[i].login.startswith(LOGIN)


def test_find_users_by_login_should_return_single_user_when_many_usernames_start_with_same_substring_and_use_contains_not_allowed():
    # Arrange
    for i in range(1, 11):
        add_user(
            f"{LOGIN}{i}", f"{FULLNAME}{i}", create_password_hash(f"{PASSWORD}{i}")
        )

    # Act
    results_for_substring = find_users_by_login(LOGIN, False)
    results_for_fullname = find_users_by_login(f"{LOGIN}1", False)

    # Assert
    assert len(results_for_substring) == 0
    assert len(results_for_fullname) == 1
    assert results_for_fullname[0].login == f"{LOGIN}1"


def test_add_card_should_create_new_card_when_data_is_valid():
    # Arrange
    # Act
    card = add_card("Test Title", "Test Description", ["tag1", "tag2"])
    db_card = cards_table.find_one({"id": card.id})

    # Assert
    assert card is not None
    assert card.title == "Test Title"
    assert card.description == "Test Description"
    assert card.tags == ["tag1", "tag2"]
    assert card.status == "READY"
    assert card.files == []
    assert db_card is not None


def test_update_card_by_id_should_change_information():
    # Arrange
    card = add_card("Original", "Original Desc", ["original"])

    # Act
    updated = update_card_by_id(
        card.id,
        title="Updated",
        description="Updated Desc",
        tags=["updated"],
        status="UPDATED",
        files=["file1"],
    )
    partially_updated = update_card_by_id(card.id, title="Partial")

    # Assert
    assert updated.title == "Updated"
    assert updated.description == "Updated Desc"
    assert updated.tags == ["updated"]
    assert updated.status == "UPDATED"
    assert updated.files == ["file1"]
    assert partially_updated.title == "Partial"
    assert partially_updated.description == "Updated Desc"


def test_find_card_by_id_should_return_card_when_it_exist():
    # Arrange
    card = add_card("Find Me", "Description", ["find"])

    # Act
    found = find_card_by_id(card.id)
    not_found = find_card_by_id("non_existent_id")

    # Assert
    assert found is not None
    assert found.id == card.id
    assert found.title == "Find Me"
    assert not_found is None


def test_find_card_by_file_id_should_return_card_when_it_exist():
    # Arrange
    card = add_card("With File", "Desc", [], files=["file_123"])

    # Act
    found = find_card_by_file_id("file_123")
    not_found = find_card_by_file_id("non_existent_id")

    # Assert
    assert found is not None
    assert found.id == card.id
    assert not_found is None


def test_find_cards_by_search_text_and_tags_should_return_cards():
    # Arrange
    card1 = add_card(
        "Python Guide", "Learn Python programming", ["programming", "python"]
    )
    card2 = add_card("Java Basics", "Introduction to Java", ["programming", "java"])
    add_card("Cooking Recipes", "Best Italian recipes", ["cooking", "food"])

    # Act
    results = find_cards_by_search_text_and_tags("python", None)
    results2 = find_cards_by_search_text_and_tags(None, ["programming"])
    results3 = find_cards_by_search_text_and_tags("java", ["programming"])
    results4 = find_cards_by_search_text_and_tags("JAVA", None)
    results5 = find_cards_by_search_text_and_tags(None, None)

    # Assert
    assert len(results) == 1
    assert results[0].id == card1.id

    assert len(results2) == 2
    ids = {r.id for r in results2}
    assert card1.id in ids
    assert card2.id in ids

    assert len(results3) == 1
    assert results3[0].id == card2.id

    assert len(results4) == 1
    assert results4[0].id == card2.id

    assert len(results5) == 3


def test_get_all_tags_from_cards_should_return_all_tags_when_several_cards_with_different_tags():
    # Arrange
    add_card("Card 1", "Desc", ["tag1", "tag2"])
    add_card("Card 2", "Desc", ["tag2", "tag3"])
    add_card("Card 3", "Desc", ["tag3", "tag4"])

    # Act
    tags = get_all_tags_from_cards()

    # Assert
    assert set(tags) == {"tag1", "tag2", "tag3", "tag4"}


def test_append_file_to_card_should_add_new_file_to_card_when_card_exist():
    # Arrange
    card = add_card("Test", "Desc", [])

    # Act
    updated = append_file_to_card(card.id, "file1")
    updated2 = append_file_to_card(card.id, "file2")
    db_card = cards_table.find_one({"id": card.id})

    # Assert
    assert card.files == []
    assert updated.files == ["file1"]
    assert updated2.files == ["file1", "file2"]
    assert db_card["files"] == ["file1", "file2"]


def test_add_model_settings_should_create_new_settings_when_valid_file_id_provided():
    # Arrange
    file_id = "test_file_123"

    # Act
    settings = add_model_settings(
        file_id=file_id,
        window_size=0.6,
        window_step=0.2,
        min_sound_length=0.2,
        confidence_limit=0.9,
    )
    db_settings = model_settings_table.find_one({"file_id": file_id})

    # Assert
    assert settings is not None
    assert settings.file_id == file_id
    assert settings.window_size == 0.6
    assert settings.window_step == 0.2
    assert settings.min_sound_length == 0.2
    assert settings.confidence_limit == 0.9
    assert db_settings is not None
    assert db_settings["window_size"] == 0.6


def test_add_model_settings_should_raise_exception_when_file_id_is_none():
    # Arrange
    # Act
    # Assert
    with pytest.raises(Exception, match="ERROR file_id is None"):
        add_model_settings(file_id=None)


def test_update_default_model_settings_should_update_settings_when_called():
    # Arrange
    # TODO Это костыль, кстати. Надо вообще запретить создвать с айди 'None'
    add_model_settings(file_id="None")

    # Act
    updated_settings = update_default_model_settings(
        file_id="None", window_size=1.0, window_step=0.5, confidence_limit=0.95
    )
    default_settings = find_default_model_settings()

    # Assert
    assert updated_settings.window_size == 1.0
    assert updated_settings.window_step == 0.5
    assert updated_settings.confidence_limit == 0.95
    assert default_settings.window_size == 1.0


def test_update_model_settings_should_update_existing_settings_when_file_id_exists():
    # Arrange
    file_id = "existing_file_123"
    add_model_settings(file_id=file_id)

    # Act
    updated_settings = update_model_settings(
        file_id=file_id, window_size=0.8, min_sound_length=0.3
    )
    db_settings = model_settings_table.find_one({"file_id": file_id})

    # Assert
    assert updated_settings.window_size == 0.8
    assert updated_settings.min_sound_length == 0.3
    assert db_settings["window_size"] == 0.8


def test_update_model_settings_should_raise_exception_when_file_id_is_none():
    # Arrange
    # Act
    # Assert
    with pytest.raises(Exception, match="ERROR file_id is None"):
        update_model_settings(file_id=None)


def test_find_model_settings_by_file_id_should_return_settings_when_file_id_exists():
    # Arrange
    file_id = "find_me_123"
    expected_window_size = 0.7
    add_model_settings(file_id=file_id, window_size=expected_window_size)

    # Act
    found_settings = find_model_settings_by_file_id(file_id)

    # Assert
    assert found_settings is not None
    assert found_settings.file_id == file_id
    assert found_settings.window_size == expected_window_size


def test_find_model_settings_by_file_id_should_return_none_when_file_id_not_exists():
    # Arrange
    # Act
    found_settings = find_model_settings_by_file_id("non_existent_file")

    # Assert
    assert found_settings is None


def test_find_default_model_settings_should_return_settings_when_default_exists():
    # Arrange
    add_model_settings(file_id="None", window_size=0.5)

    # Act
    default_settings = find_default_model_settings()

    # Assert
    assert default_settings is not None
    assert default_settings.file_id == "None"
    assert default_settings.window_size == 0.5


def test_find_default_model_settings_should_return_none_when_default_not_exists():
    # Arrange
    # Act
    default_settings = find_default_model_settings()

    # Assert
    assert default_settings is None


def test_model_settings_should_use_default_values_when_optional_params_not_provided():
    # Arrange
    file_id = "test_default_values"

    # Act
    settings = add_model_settings(file_id=file_id)

    # Assert
    assert settings.window_size == 0.5  # default value
    assert settings.window_step == 0.1  # default value
    assert settings.confidence_limit == 0.8  # default value
    assert settings.ignore_noise_outliers == "cut_when_at_least_one"  # default value
