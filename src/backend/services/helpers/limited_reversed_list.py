class LimitedReversedList():
    def __init__(s, max_length=10):
        s.l = []
        s.limit = max_length

    def add(s, elem):
        s.l.insert(0, elem)
        if len(s.l) > s.limit:
            s.l = s.l[:s.limit]

    def __call__(s):
        return s.l

    def __eq__(s, l):
        return s.l == l