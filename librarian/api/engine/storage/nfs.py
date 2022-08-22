import libnfs

from librarian.api.models import Settings, Document


def read(settings: Settings, doc: Document):
    storage_settings = settings.storage_settings

    nfs = libnfs.NFS(storage_settings.storage_path)
    nfs_f = nfs.open("/" + doc.filestore_path, mode="rb")
    b = nfs_f.read()
    nfs_f.close()
    return b

def write_to_path(settings: Settings, doc: Document, data: bytes):
    storage_settings = settings.storage_settings

    nfs = libnfs.NFS(storage_settings.storage_path)
    nfs_f = nfs.open("/" + doc.filename, mode="wb")
    nfs_f.write(data)
    nfs_f.close()
