import json

from django.conf import settings as django_settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from librarian.api.models import StorageSettingsLocal, StorageSettingsNFS, StorageSettingsS3
from librarian.api.models.settings import Settings
from librarian.api.permissions import DisableDemo
from librarian.api.serializers import SetupSerializer, DemoSetupSerializer


@api_view(["GET", "PUT", "POST"])
@permission_classes([DisableDemo])
def get_or_create_settings_view(request):
    if request.method == "GET":
        settings = Settings.objects.first()
        if not settings:
            settings = Settings.create_default()

        if django_settings.DEMO_MODE:
            return JsonResponse(data=DemoSetupSerializer(settings).data)

        return JsonResponse(data=SetupSerializer(settings).data)

    if request.method == "PUT":
        try:
            settings = Settings.objects.get()
        except Settings.DoesNotExist:
            settings = Settings.create_default()

        data = json.loads(request.body)
        if data.get('dismissed_setup_wizard', None) is not None:
            settings.dismissed_setup_wizard = data.get('dismissed_setup_wizard')
            settings.save()

        return JsonResponse(data=SetupSerializer(settings).data)


    if request.method == "POST":
        # delete previous settings, if they exist
        Settings.objects.all().delete()
        StorageSettingsLocal.objects.all().delete()
        StorageSettingsNFS.objects.all().delete()
        StorageSettingsS3.objects.all().delete()

        data = json.loads(request.body)

        storage_mode = data.get("storage_mode", None)
        if storage_mode not in Settings.StorageModes.all():
            return JsonResponse({"reason": "storage mode not recognized"}, status=status.HTTP_400_BAD_REQUEST)

        storage_settings = None
        if storage_mode == Settings.StorageModes.LOCAL:
            storage_settings = StorageSettingsLocal.objects.create(
                storage_path=data.get("storage_settings").get("storage_path")
            )
        if storage_mode == Settings.StorageModes.NFS:
            storage_settings = StorageSettingsNFS.objects.create(
                storage_path=data.get("storage_settings").get("storage_path")
            )
        if storage_mode == Settings.StorageModes.S3:
            storage_settings = StorageSettingsS3.objects.create(
                aws_access_key_id=data.get("storage_settings").get("aws_access_key_id"),
                aws_secret_access_key=data.get("storage_settings").get("aws_secret_access_key"),
                bucket=data.get("storage_settings").get("bucket")
            )

        settings = Settings.objects.create(
            google_cloud_api_key=data.get("google_cloud_api_key", None),
            storage_mode=storage_mode,
            storage_settings=storage_settings,
        )

        return JsonResponse(data=SetupSerializer(settings).data)
