from django.test import TestCase
from rest_framework.test import APIClient

from tests.helpers import reverse


class TestFolderViews(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_empty_folder(self):
        url = reverse('folder-create')
        response = self.client.post(url, {'name': 'new-folder', 'documents': []}, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_folder_with_document(self):
        # create doc
        url = reverse('document-create', args=('testfile',))
        doc = self.client.post(url)
        self.assertEqual(doc.status_code, 200)

        # create folder with attached document
        url = reverse('folder-create')
        data = {'name': 'new-folder', 'documents': [doc.json()]}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 201)
