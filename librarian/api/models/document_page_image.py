from django.db import models


class DocumentPageImage(models.Model):
    document = models.ForeignKey('Document', on_delete=models.CASCADE, related_name='pages')
    page_number = models.IntegerField()

    temp_path = models.TextField(null=True)

    text = models.TextField(null=True)
    metadata = models.TextField(null=True)
