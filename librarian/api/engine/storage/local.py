import os

from librarian.api.models import Document, Settings


def read(settings: Settings, doc: Document):
    storage_settings = settings.storage_settings

    with open(os.path.join(storage_settings.storage_path, doc.filestore_path), mode="rb") as f:
        b = f.read()
    return b


def write_to_path(settings: Settings, doc: Document, data: bytes):
    storage_settings = settings.storage_settings

    dest = os.path.join(storage_settings.storage_path, doc.filename)
    with open(dest, mode="wb") as local_f:
        local_f.write(bytearray(data))
