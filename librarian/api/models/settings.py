import json

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from librarian.api.models.storage_settings_local import StorageSettingsLocal


class Settings(models.Model):
    class StorageModes(models.TextChoices):
        LOCAL = "local"
        NFS = "nfs"
        S3 = "s3"

        @classmethod
        def all(cls):
            return [
                cls.LOCAL, cls.NFS, cls.S3
            ]

    # TODO - create a generic OCR model to link to
    google_cloud_api_key = models.TextField(null=True)

    storage_mode = models.CharField(max_length=20, choices=StorageModes.choices, default=StorageModes.LOCAL)

    # generic storage settings object
    storage_settings_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    storage_settings_id = models.PositiveIntegerField()
    storage_settings = GenericForeignKey('storage_settings_type', 'storage_settings_id')

    def read_google_cloud_api_key(self):
        # replaces the html textarea rendered content from the frontend into valid json
        content = self.google_cloud_api_key.replace("\n", "")
        return json.loads(content)

    @classmethod
    def create_default(cls):
        try:
            local_settings = StorageSettingsLocal.objects.get()
        except StorageSettingsLocal.DoesNotExist:
            local_settings = StorageSettingsLocal.objects.create(storage_path='/tmp')

        return cls.objects.create(storage_settings=local_settings, storage_mode=cls.StorageModes.LOCAL)

    class Meta:
        indexes = [
            models.Index(fields=["storage_settings_type", "storage_settings_id"])
        ]
