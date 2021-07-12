from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from librarian.api.models import Document


class TestDocumentViews(TestCase):

    def test_create_document(self):
        client = APIClient()

        url = reverse('document-create', args=('testfile',))
        response = client.post(url)
        self.assertEqual(response.status_code, 200)

        documents = Document.objects.all()
        # the POST should have created a Document!
        self.assertEqual(len(documents), 1)

        document = documents[0]
        self.assertEqual(document.filename, "testfile")
