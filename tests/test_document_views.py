from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from librarian.api.models import Document, DocumentStatus


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

    def test_document_search(self):
        client = APIClient()

        Document.objects.create(filename="taxes 2020", status=DocumentStatus.annotated.value)
        Document.objects.create(filename="taxes 2021", status=DocumentStatus.created.value)
        Document.objects.create(filename="Refi Loan Doc")
        Document.objects.create(filename="dog vaccine record")
        Document.objects.create(filename="birth certificate")

        url = reverse('document-search')
        url_with_query_parameters = url + "?q=taxes"
        response = client.get(url_with_query_parameters)
        self.assertEqual(response.status_code, 200)

        #number of documents containing the search term
        match_query = Document.objects.filter(filename__contains="taxes")
        self.assertEqual(len(match_query), 2)

        #number of documents being searched
        all_docs = Document.objects.all()
        self.assertEqual(len(all_docs), 5)

        #match specific file names
        specific_doc_2020 = Document.objects.filter(filename="taxes 2020")
        self.assertEqual(len(specific_doc_2020), 1)

        specific_doc_2021 = Document.objects.filter(filename="taxes 2021")
        self.assertEqual(len(specific_doc_2021), 1)

        #document list contains dog vaccine record
        vaccine_doc = Document.objects.filter(filename__contains="dog vaccine record")
        self.assertEqual(len(vaccine_doc), 1)

        annotated_taxes_documents = Document.objects \
            .filter(filename__contains="taxes") \
            .filter(status=DocumentStatus.annotated.value)
        self.assertEqual(len(annotated_taxes_documents), 1)
        self.assertEqual(annotated_taxes_documents[0].filename, "taxes 2020")
        self.assertEqual(annotated_taxes_documents[0].status, DocumentStatus.annotated.value)

        created_taxes_documents = Document.objects \
            .filter(filename__contains="taxes") \
            .filter(status=DocumentStatus.created.value)
        self.assertEqual(len(created_taxes_documents), 1)
        self.assertEqual(created_taxes_documents[0].filename, "taxes 2021")
        self.assertEqual(created_taxes_documents[0].status, DocumentStatus.created.value)











