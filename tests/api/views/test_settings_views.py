from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from librarian.api.models.settings import Settings


class TestConfigViews(TestCase):
    def test_config_create(self):
        client = APIClient()
        test_data = {
            "google_cloud_api_key": "{}",
            "storage_path": "10.0.1.1/volume1/test",
            "storage_mode": "nfs",
        }

        # request is sending data to the model
        url = reverse("settings")
        url_with_query_parameters = url + "?hello=world"

        response = client.post(url_with_query_parameters, test_data, format="json")
        self.assertEqual(response.status_code, 200)

        settings = Settings.objects.all()
        # the POST should have added data to the model
        self.assertEqual(len(settings), 1)

        # the data in the model should match what was sent
        settings_data = settings[0]
        self.assertEqual(
            settings_data.google_cloud_api_key, test_data["google_cloud_api_key"]
        )
        self.assertEqual(settings_data.storage_path, test_data["storage_path"])
        self.assertEqual(settings_data.storage_mode, test_data["storage_mode"])

    def test_config_get(self):
        client = APIClient()

        url = reverse("settings")
        response = client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_disable_demo_mode(self):
        client = APIClient()
        url = reverse("settings")

        with self.settings(DEMO_MODE=True):
            # shouldn't allow POST to settings
            response = client.post(url, {}, format="json")
            self.assertEqual(response.status_code, 403)

            # shouldn't leak google_cloud_api_key
            Settings.objects.create(google_cloud_api_key='sensitive')
            response = client.get(url)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()['google_cloud_api_key'], '')
