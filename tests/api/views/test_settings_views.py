from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from librarian.api.models import StorageSettingsLocal
from librarian.api.models.settings import Settings


class TestSettingsViews(TestCase):
    def test_settings_create_invalid(self):
        client = APIClient()
        test_data = {
            "google_cloud_api_key": "{}",
            "storage_settings": {},
            "storage_mode": "bogus",
        }

        response = client.post(reverse("settings"), test_data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_settings_create(self):
        client = APIClient()
        test_data = {
            "google_cloud_api_key": "{}",
            "storage_settings": {
                "storage_path": "10.0.1.1/volume1/test",
            },
            "storage_mode": str(Settings.StorageModes.NFS),
        }

        # request is sending data to the model
        response = client.post(reverse("settings"), test_data, format="json")
        self.assertEqual(response.status_code, 200)

        settings = Settings.objects.all()
        # the POST should have added data to the model
        self.assertEqual(len(settings), 1)

        # the data in the model should match what was sent
        settings_data = settings[0]
        self.assertEqual(
            settings_data.google_cloud_api_key, test_data["google_cloud_api_key"]
        )
        self.assertEqual(settings_data.storage_settings.storage_path, test_data["storage_settings"]["storage_path"])
        self.assertEqual(settings_data.storage_mode, test_data["storage_mode"])

    def test_default_settings_enum_repr(self):
        settings = Settings.create_default()
        # django TextChoices are notoriously difficult to work with -- verify that text choice strings
        # are stored to the db correctly
        self.assertEqual(settings.StorageModes.LOCAL, "local")
        self.assertEqual(settings.storage_mode, settings.StorageModes.LOCAL)

    def test_settings_get(self):
        client = APIClient()
        test_data = {
            "google_cloud_api_key": "{}",
            "storage_settings": {
                "storage_path": "10.0.1.1/volume1/test",
            },
            "storage_mode": str(Settings.StorageModes.NFS),
        }

        # request is sending data to the model
        response = client.post(reverse("settings"), test_data, format="json")
        self.assertEqual(response.status_code, 200)

        # add the id from the create to make the test_data equal to the response
        test_data['id'] = response.json()['id']

        url = reverse("settings")
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(test_data, response.json())

    def test_disable_demo_mode(self):
        client = APIClient()
        url = reverse("settings")

        with self.settings(DEMO_MODE=True):
            # shouldn't allow POST to settings
            response = client.post(url, {}, format="json")
            self.assertEqual(response.status_code, 403)

            # shouldn't leak google_cloud_api_key
            Settings.objects.create(google_cloud_api_key='sensitive',
                                    storage_settings=StorageSettingsLocal.objects.create(storage_path="/tmp"))
            response = client.get(url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['google_cloud_api_key'], '')
