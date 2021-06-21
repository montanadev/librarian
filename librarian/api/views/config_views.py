import json

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view


@api_view(["POST"])
def config_create(request):
    data = json.loads(request.body)
    gc_api_key = data['google_cloud_api_key']
    nfs_path = data['nfs_path']
    secret_key = data['secret_key']

    # TODO - create a database entry for the config

    return HttpResponse(status=status.HTTP_200_OK)
