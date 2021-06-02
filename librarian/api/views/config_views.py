import json

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view


@api_view(["POST"])
def config_create(request):
    data = json.loads(request.body)
    print("Key for the config is", data['key'])
    print("Value for the config is", data['value'])

    # TODO - create a database entry for the config

    return HttpResponse(status=status.HTTP_200_OK)

