# TODO Find JSON serializer/deserializer 

def obj_to_json_simple(o):
    if type(o) in [str, int]:
        return o
        
    res = o.__dict__
    return res