from django.db import models


class SourceContentTypes(models.IntegerChoices):
    JPEG = 1
    PNG = 2
    PDF = 3
