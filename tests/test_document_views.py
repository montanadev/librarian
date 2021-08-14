from django.test import TestCase
from rest_framework.test import APIClient

from librarian.api.models import Document, DocumentStatus, DocumentPageImage
from tests.helpers import reverse


class TestDocumentViews(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_document(self):
        url = reverse('document-create', args=('testfile',))
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)

        documents = Document.objects.all()
        # the POST should have created a Document!
        self.assertEqual(len(documents), 1)

        document = documents[0]
        self.assertEqual(document.filename, "testfile")

    def test_search_document_pages(self):
        doc_a = Document.objects.create(filename='a')
        doc_a_page_1 = DocumentPageImage.objects.create(document=doc_a, page_number=1, text='my egg is dirty, please may i have a new one')

        doc_b = Document.objects.create(filename='b')
        doc_b_page_1 = DocumentPageImage.objects.create(document=doc_b, page_number=1, text='this omelette is eggcellent')

        url = reverse('document-text-search', query_params={'q': 'egg'})
        response = self.client.get(url)
        # should return two results
        self.assertTrue(len(response.json()), 2)

        # should contain both page ids
        page_ids = [i['id'] for i in response.json()]
        self.assertTrue(all([i.id in page_ids for i in [doc_a_page_1, doc_b_page_1]]))

        url = reverse('document-text-search', query_params={'q': 'dirt'})
        response = self.client.get(url)
        # should return one result
        self.assertTrue(len(response.json()), 1)

        # should contain the single page id
        self.assertTrue(response.json()[0]['id'] == doc_a_page_1.id)

    def test_find_document(self):
        Document.objects.create(filename="tax 2020", status=DocumentStatus.annotated.value)
        Document.objects.create(filename="tax 2021", status=DocumentStatus.created.value)
        Document.objects.create(filename="Refi Loan Doc")
        Document.objects.create(filename="dog vaccine record")
        Document.objects.create(filename="birth certificate")

        all_documents = Document.objects.all()
        self.assertEqual(len(all_documents), 5)

        specific_tax_documents = Document.objects.filter(filename="tax 2020")
        self.assertEqual(len(specific_tax_documents), 1)

        tax_documents = Document.objects.filter(filename__contains="tax")
        self.assertEqual(len(tax_documents), 2)

        annotated_tax_documents = Document.objects\
            .filter(filename__contains="tax")\
            .filter(status=DocumentStatus.annotated.value)
        self.assertEqual(len(annotated_tax_documents), 1)
        self.assertEqual(annotated_tax_documents[0].filename, "tax 2020")
        self.assertEqual(annotated_tax_documents[0].status, DocumentStatus.annotated.value)

        non_tax_document = Document.objects.exclude(filename="tax 2020")
        self.assertEqual(len(non_tax_document), 4)

        no_tax_documents = Document.objects.exclude(filename__contains="tax")
        self.assertEqual(len(no_tax_documents), 3)





