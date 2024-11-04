from typing import List

def get_json_parameter(json, arg) -> object:
    return json[arg] if arg in json else None

def get_json_parameters(json, *args) -> list:
    res = []
    for arg in args:
        if arg in json:
            res.append(json[arg])
        else:
            res.append(None)
    return res