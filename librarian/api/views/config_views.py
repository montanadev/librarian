import json

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view

from librarian.api.models.config_models import Setup


@api_view(["POST"])
def config_create(request):
#create database, delete previous data, post new data from user side
    data = json.loads(request.body)
    gc_api_key = data['google_cloud_api_key']
    nfs_path = data['nfs_path']
    secret_key = data['secret_key']

    Setup.objects.all().delete()

    Setup.objects.create(gc_api_key=google_cloud_api_key, nfs_path=nfs_path, secret_key=secret_key)


@api_view(["GET"])
def config_get(request):
#get first line of data from database and return

    data = Setup.objects.first()


    return HttpResponse(status=status.HTTP_200_OK)
