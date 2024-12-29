import pytest
from functools import wraps
from services.DbService import initalize_test_connection
initalize_test_connection()
from services.DbService import client, cards_db, users_db, files_db
from services.CardService import create_card, get_card
from appconfig import DB_TEST_NAME

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


TEST_CARD_NAME = 'test_card'
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