from django.db import models


class Folder(models.Model):
    name = models.TextField()

    @classmethod
    def get_default(cls):
        return cls.objects.get(name='Unsorted')
