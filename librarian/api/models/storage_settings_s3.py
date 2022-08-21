from django.db import models


class StorageSettingsS3(models.Model):
    aws_access_key_id = models.TextField()
    aws_secret_access_key = models.TextField()
    bucket = models.TextField()
