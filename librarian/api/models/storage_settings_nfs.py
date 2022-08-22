from django.db import models


class StorageSettingsNFS(models.Model):
    storage_path = models.TextField(null=True)
