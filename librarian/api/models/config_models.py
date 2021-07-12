from django.db import models

class Setup(models.Model):
    gc_api_key = models.TextField()
    nfs_path = models.TextField()
    secret_key = models.TextField()