import pytest
from functools import wraps
from services.DbService import initalize_test_connection
initalize_test_connection()

from services.DbService import client, cards_db, users_db, files_db
from services.CardService import create_card, get_card, get_cards, remove_card
from services.IdGeneratorService import generate_ids
from services.TagService import get_all_tags
from appconfig import DB_TEST_NAME
from collections import Counter

def not_a_test(f):
    f.__test__ = False
    return f


@not_a_test
def test_wrapper(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        client.drop_database(DB_TEST_NAME)
        return f(*args, **kwargs)
    return decorated


TEST_CARD_NAME = 'test card'
TEST_CARD_NAME2 = 'another card'
TEST_TAG = 'tag'
TEST_TAG2 = 'another tag'
TEST_NOT_EXISTED_TAG = 'not existed tag'
TEST_NOT_EXISTED_ID = 'this id does not exist because its not a GUID'


@test_wrapper
def test_create_card_should_add_new_card_when_all_fields_are_correct():
    # Arrange
    
    # Act
    res = create_card(TEST_CARD_NAME)

    # Assert
    assert res[1] == 200
    assert len(list(cards_db.find({}))) == 1


@test_wrapper
def test_create_card_should_return_400_when_title_is_empty():
    # Arrange
    
    # Act
    res1 = create_card(None)
    res2 = create_card('')

    # Assert
    assert res1[1] == 400
    assert res2[1] == 400


@test_wrapper
def test_get_card_should_return_existing_card():
    # Arrange
    card_id = create_card(TEST_CARD_NAME)[0].id

    # Act
    res = get_card(card_id)

    # Assert
    assert res[1] == 200
    assert res[0].id == card_id


@test_wrapper
def test_get_card_should_return_400_when_card_not_exist():
    # Arrange
    create_card(TEST_CARD_NAME)[0].id

    # Act
    res = get_card(TEST_NOT_EXISTED_ID)

    # Assert
    assert res[1] == 400


@test_wrapper
def test_get_cards_should_filter_cards_when_tag():
    # Arrange
    create_card(TEST_CARD_NAME, tags=[TEST_TAG, TEST_TAG2])
    create_card(TEST_CARD_NAME2)

    # Act
    res = get_cards('', [TEST_TAG])
    res2 = get_cards('', [TEST_NOT_EXISTED_TAG])

    # Assert
    assert res[1] == 200
    assert res2[1] == 200
    assert len(res[0]) == 1
    assert len(res2[0]) == 0


@test_wrapper
def test_get_cards_should_filter_cards_when_search_text():
    # Arrange
    create_card(TEST_CARD_NAME, tags=[TEST_TAG, TEST_TAG2])
    create_card(TEST_CARD_NAME2)

    # Act
    res = get_cards('another', [])

    # Assert
    assert res[1] == 200
    assert len(res[0]) == 1


@test_wrapper
def test_remove_card_should_delete_card_when_id_is_correct():
    # Arrange
    create_card(TEST_CARD_NAME)
    id = create_card(TEST_CARD_NAME2)[0].id

    # Act
    res = remove_card(id)
    cards_count = len(get_cards(None, None)[0])

    # Assert
    assert res[1] == 200
    assert cards_count == 1 # 1 Т.к. создали две карточки, одну удалили


@test_wrapper
def test_generate_ids_should_generate_unique_ids():
    # Arrange

    # Act
    data = generate_ids(50)
    res = Counter(data)

    # Assert
    assert len(res.keys()) == 50


@test_wrapper
def test_get_all_tags_should_return_all_tags_when_several_cards_exist():
    # Arrange
    create_card(TEST_CARD_NAME, tags=[TEST_TAG])
    create_card(TEST_CARD_NAME2, tags=[TEST_TAG, TEST_TAG2])

    # Act
    res = get_all_tags()

    # Assert
    assert res[1] == 200
    assert len(res[0]) == 2