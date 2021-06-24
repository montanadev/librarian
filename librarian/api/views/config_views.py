import json

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view

from .models import Setup


@api_view(["POST"])
def config_create(request):
    data = json.loads(request.body)
    gc_api_key = data['google_cloud_api_key']
    nfs_path = data['nfs_path']
    secret_key = data['secret_key']

@api_view(["GET"])
def config_get(request):
    data = Setup.objects

    return

    # TODO - create a database entry for the config

    return HttpResponse(status=status.HTTP_200_OK)
