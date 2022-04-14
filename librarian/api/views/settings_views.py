import json

from django.conf import settings as django_settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes

from librarian.api.models.settings import Settings
from librarian.api.permissions import DisableDemo
from librarian.api.serializers import SetupSerializer, DemoSetupSerializer


@api_view(["GET", "POST"])
@permission_classes([DisableDemo])
def get_or_create_settings_view(request):
    if request.method == "GET":
        settings = Settings.objects.first()
        if not settings:
            settings = Settings.create_default()

        if django_settings.DEMO_MODE:
            return JsonResponse(data=DemoSetupSerializer(settings).data)

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
