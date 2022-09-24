import os
import tempfile

import boto3

from librarian.api.models import Document, Settings, StorageSettingsS3


def read(settings: Settings, doc: Document):
    storage_settings: StorageSettingsS3 = settings.storage_settings
    client = boto3.client(
        's3',
        aws_access_key_id=storage_settings.aws_access_key_id,
        aws_secret_access_key=storage_settings.aws_secret_access_key,
    )

    with tempfile.TemporaryFile() as data:
        client.download_fileobj(storage_settings.bucket, doc.filestore_path, data)
        data.seek(0)
        b = data.read()

    return b


def write_to_path(settings: Settings, doc: Document, data: bytes):
    storage_settings: StorageSettingsS3 = settings.storage_settings
    client = boto3.client(
        's3',
        aws_access_key_id=storage_settings.aws_access_key_id,
        aws_secret_access_key=storage_settings.aws_secret_access_key,
    )

    with tempfile.TemporaryFile() as tmpfile:
        tmpfile.write(data)
        tmpfile.seek(0)
        client.upload_fileobj(tmpfile, storage_settings.bucket, doc.filename)

    #local_f.write(bytearray(data))
