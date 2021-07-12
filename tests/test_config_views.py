from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from librarian.api.models import Setup

class TestConfigViews(TestCase):

    def test_config_create(self):
        client = APIClient()

        #request is sending data to the model
        url = reverse('setup-data')
        response = client.post(url)
        self.assertEqual(response.status_code, 200)

        setup_content = Setup.objects.all()
        # the POST should have added data to the model
        self.assertEqual(len(setup_content), 1)

        #the data in the model should match what was sent
        setup_data = setup_content[0]
        self.assertEqual(setup_data.gc_api_key)

    def test_config_get(self):
        client = API Client()

        url = reverse('get-data')
        response = client.get(url)
        self.assertEqual(response.status_code, 200)

      