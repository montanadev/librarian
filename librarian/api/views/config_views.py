import json

from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view

from librarian.api.models.config_models import Setup
from librarian.api.serializers import SetupSerializer


@api_view(["POST"])
def config_create(request):
#delete previous data, post new data from user side
    data = json.loads(request.body)
    gc_api_key = data['google_cloud_api_key']
    nfs_path = data['nfs_path']
    secret_key = data['secret_key']

    Setup.objects.all().delete()

    Setup.objects.create(gc_api_key=gc_api_key, nfs_path=nfs_path, secret_key=secret_key)

    return HttpResponse(status=status.HTTP_200_OK)

@api_view(["GET"])
def config_get(request):
#get first line of data from database, serialize to make readable, and return

    setup_data = Setup.objects.first()
    read_data = SetupSerializer(setup_data).data

    return JsonResponse(data=read_data, status=status.HTTP_200_OK)
