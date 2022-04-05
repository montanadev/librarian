import json

from django.http import JsonResponse
from rest_framework.decorators import api_view

from librarian.api.models.settings import Settings
from librarian.api.serializers import SetupSerializer


@api_view(["GET", "POST"])
def get_or_create_settings_view(request):
    if request.method == "GET":
        settings = Settings.objects.first()
        if not settings:
            settings = Settings.create_default()

        return JsonResponse(data=SetupSerializer(settings).data)

    if request.method == "POST":
        # delete previous settings, if they exist
        Settings.objects.all().delete()

        data = json.loads(request.body)
        settings = Settings.objects.create(
            google_cloud_api_key=data.get("google_cloud_api_key", None),
            storage_mode=data.get("storage_mode", None),
            storage_path=data.get("storage_path", None),
        )

        return JsonResponse(data=SetupSerializer(settings).data)