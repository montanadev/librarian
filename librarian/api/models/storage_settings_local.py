from django.db import models


class StorageSettingsLocal(models.Model):
    storage_path = models.TextField(null=True)
