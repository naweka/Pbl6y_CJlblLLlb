from typing import List

def get_json_parameter(json, arg) -> object:
    return json[arg] if arg in json else None

def get_json_parameters(json, *args) -> list[object]:
    res = []
    if len(args) == 1:
        raise Exception('Для получения одного аргумента '+
                        'используйте get_json_parameter вместо get_json_parameterS!')
    for arg in args:
        if arg in json:
            res.append(json[arg])
        else:
            res.append(None)
    return res