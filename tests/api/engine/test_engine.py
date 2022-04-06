from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from librarian.api.engine import engine
from librarian.api.models import (Settings, DocumentJob)
from tests.helpers import reverse


class TestEngine(TestCase):
    def setUp(self):
        self.client = APIClient()

        Settings.create_default()

    def test_document_persistence(self):
        # simulate uploading a document
        url = reverse("document-create", args=("testfile.pdf",))
        with open('samples/sample-1.pdf', 'rb') as f:
            file = SimpleUploadedFile("file.jpg", f.read(), content_type="application/pdf")
            response = self.client.post(url, {'file': file}, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        doc_id = response.json()['id']

        # side effect: document job produced on upload
        job: DocumentJob = DocumentJob.objects.filter(document__id=doc_id).latest('created_at')
        self.assertEqual(job.kind, DocumentJob.Kind.persist)

        engine.run(job)
        job.refresh_from_db()

        # persist job should be successful
        self.assertTrue(job.successful)

        # side effect: persist should have produced the next job,
        job: DocumentJob = DocumentJob.objects.filter(document__id=doc_id).latest('created_at')
        self.assertEqual(job.kind, DocumentJob.Kind.translate_pdf_to_images)

        engine.run(job)
        job.refresh_from_db()

        # split job should be successful
        self.assertTrue(job.successful)
