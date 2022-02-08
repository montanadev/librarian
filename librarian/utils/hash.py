import hashlib


def md5_for_bytes(data):
    md5 = hashlib.md5()
    md5.update(data)
    return md5.digest().hex()
