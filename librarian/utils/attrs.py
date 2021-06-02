def setattrs(_self, **kwargs):
    for k, v in kwargs.items():
        setattr(_self, k, v)
