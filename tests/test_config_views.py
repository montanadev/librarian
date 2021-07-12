from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from librarian.api.models.config_models import Setup


class TestConfigViews(TestCase):

    def test_config_create(self):
        client = APIClient()
        test_data = {'google_cloud_api_key': 'test_api_key',
                     'nfs_path': 'test_path',
                     'secret_key': 'test_key'
                     }

        # request is sending data to the model
        url = reverse('setup-data')
        response = client.post(url, test_data, format="json")
        self.assertEqual(response.status_code, 200)

        setup_content = Setup.objects.all()
        # the POST should have added data to the model
        self.assertEqual(len(setup_content), 1)

        # the data in the model should match what was sent
        setup_data = setup_content[0]
        self.assertEqual(setup_data.gc_api_key, 'test_api_key')
        self.assertEqual(setup_data.nfs_path, 'test_path')
        self.assertEqual(setup_data.secret_key, 'test_key')


    def test_config_get(self):
        client = APIClient()

        url = reverse('get-data')
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
