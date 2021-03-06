import json

from django.db import models


class Settings(models.Model):
    google_cloud_api_key = models.TextField(null=True)
    storage_mode = models.TextField(null=True)
    storage_path = models.TextField(null=True)

    def read_google_cloud_api_key(self):
        # replaces the html textarea rendered content from the frontend into valid json
        content = self.google_cloud_api_key.replace("\n", "")
        return json.loads(content)

    @classmethod
    def create_default(cls):
        return cls.objects.create(storage_mode='local', storage_path='/tmp')
