import logging

from librarian.api.engine.storage import local, nfs, s3
from librarian.api.models import Settings, Document, DocumentStatus

logger = logging.getLogger(__name__)


def read(settings: Settings, doc: Document):
    if doc.status == DocumentStatus.created.value:
        # document hasn't persisted yet, return temp path
        with open(doc.temp_path, mode="rb") as f:
            logger.warning(f"Tried to access {doc.filename} before persist, returning temp path")
            return f.read()

    if settings.storage_mode == settings.StorageModes.LOCAL:
        return local.read(settings, doc)
    if settings.storage_mode == settings.StorageModes.NFS:
        return nfs.read(settings, doc)
    if settings.storage_mode == settings.StorageModes.S3:
        return s3.read(settings, doc)

    raise Exception(
        f"Storage mode {settings.storage_mode} not recognized, quitting"
    )


def write(settings: Settings, doc: Document, data: bytes):
    if settings.storage_mode == settings.StorageModes.LOCAL:
        return local.write_to_path(settings, doc, data)
    if settings.storage_mode == settings.StorageModes.NFS:
        return nfs.write_to_path(settings, doc, data)
    if settings.storage_mode == settings.StorageModes.S3:
        return s3.write_to_path(settings, doc, data)

    raise Exception(
        f"Storage mode {settings.storage_mode} not recognized, quitting"
    )
