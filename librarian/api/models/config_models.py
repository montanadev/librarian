from django.db import models

class Setup(models.Model):
    api_key = models.CharField()  
    nfs_path = models.CharField()
    secret_key = models.CharField()

   return