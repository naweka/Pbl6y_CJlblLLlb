from functools import wraps
import traceback 
from flask.wrappers import Response


def obj_to_dict_simple(o):
    if type(o) in [str, int]:
        return o
        
    res = o.__dict__
    return res


def is_valid_attribute(item, m):
    """
    return true if attribute is something that
    probably could be a value

    :param item:
    :param m:
    :return: bool
    """
    try:
        return not (m.startswith("_") or callable(getattr(item, m)))
    except:
        return False

# https://github.com/Martlark/d_serialize/blob/master/d_serialize/d_serialize.py
def obj_to_dict(item, attributes=None):
    """
    convert the given attributes for the item into a dict
    so they can be serialized back to the caller

    :param item: an object, list, set, tuple or dictionary
    :param attributes: list of attributes, defaults to all in item
    :return:
    """
    _seen_already = {}

    def _d_serialize(_item, _attributes=None):
        """
        recursive proxy

        :param _item: an object, list, set, tuple or dictionary
        :param _attributes: list of attributes, defaults to all in item
        :return:
        """

        # base types supported by JSON
        if type(_item) in [int, float, str, bool]:
            return _item

        if _seen_already.get(str(_item)):
            return str(_item)

        # lists, tuples and sets
        if type(_item) in [set, list, tuple]:
            return [_d_serialize(d) for d in _item]

        if not _attributes:

            if isinstance(_item, dict):
                _attributes = list(_item.keys())
            else:
                _attributes = [m for m in dir(_item) if is_valid_attribute(_item, m)]

        _attributes.sort()

        if len(_attributes) == 0:
            return str(_item)

        d = {}
        for a in _attributes:
            value = None

            try:
                value = (
                    _item.get(a, "") if type(_item) == dict else getattr(_item, a, "")
                )
            except Exception as e:
                print(f"_d_serialize: warning: exception on attribute {a}: {e}")

            if type(value) in [set, tuple]:
                value = list(value)

            if type(value) == dict:
                value = _d_serialize(value)
            elif type(value) == list:
                value = [_d_serialize(d) for d in value]
            elif value and type(value) not in [list, dict, int, float, str, bool]:
                try:
                    # re-entrance check
                    key = str(value)
                    _seen_already[key] = 1
                except:
                    pass
                d_value = _d_serialize(value)
                value = d_value

            d[a] = value

        return d

    return _d_serialize(item, attributes)


def endpoint_output_wrapper(f):
    '''
    :param f: функция, которая возвращает `tuple[object, int]`
    '''
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            res, code = f(*args, **kwargs)
            try:
                if type(res) == Response:
                    return res
                res2 = obj_to_dict(res)
                res = res2
            except:
                pass

            # Мы можем получить либо словарь объекта / ошибки,
            # либо лист с сериализованными объектами, либо
            # просто сериализованный объект.

            # При этом, если мы получаем словарь, нужно понять,
            # был ли этот словарь ошибкой или объектом.

            if type(res) is not dict:
                # Тут всё просто, добавляем res в нужно поле и 
                # отправляем наружу.
                res_dict = {
                    'error_message': '',
                    'result': res
                }
                return res_dict, code

            # Если это всё-таки словарь, тогда проверим, есть
            # ли в этом словаре 'error_message'. Это покажет,
            # был ли словарь ошибкой или же сериализованным объектом.

            res_dict = dict()

            if 'error_message' not in res:
                res_dict['error_message'] = ''
                res_dict['result'] = res
            else:
                res_dict['error_message'] = res['error_message']
                res_dict['result'] = None
        
            return res_dict, code
        
        except Exception as e:
            traceback.print_exc() 
            # print(e)
            return obj_to_dict({
                'error_message': str(e)
            }), 500
  
    return decorated