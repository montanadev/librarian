from django.db import models

from librarian.api.models import Document


class Folder(models.Model):
    name = models.TextField()
    documents = models.ManyToManyField(Document, related_name='folders')
