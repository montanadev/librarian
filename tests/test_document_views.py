from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from librarian.api.models import (Document, DocumentPageImage, DocumentStatus,
                                  Folder, Settings)
from tests.helpers import reverse


class TestDocumentViews(TestCase):
    def setUp(self):
        self.client = APIClient()

        Settings.create_default()

    def test_document_data(self):
        # simulate uploading a document
        url = reverse("document-create", args=("testfile",))
        response = self.client.post(url, {'file': 'data'}, format='multipart',
                                    headers={'Content-Type': 'application/pdf'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # fetching uploaded binary should be successful
        url = reverse("document-data", args=(response.json()['id'],))
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_rename_document(self):
        url = reverse("document-create", args=("testfile",))
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        url = reverse("document-detail", args=(response.json()["id"],))
        body = {"filename": "renamed", "id": response.json()["id"]}

        response = self.client.put(url, body, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["filename"], "renamed")

    def test_create_document(self):
        url = reverse("document-create", args=("testfile",))
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        documents = Document.objects.all()
        # the POST should have created a Document!
        self.assertEqual(len(documents), 1)

        document = documents[0]
        self.assertEqual(document.filename, "testfile")

        # reposting same empty body generates the same hash, returns 400
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_document(self):
        # create a doc
        url = reverse("document-create", args=("testfile",))
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # create a tag
        url = reverse("document-tags", args=(response.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'hello'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # delete the document
        url = reverse("document-detail", args=(response.json()['id'],))
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # deleting document should also delete tag (no remaining references)
        url = reverse("tag-list")
        tag_list = self.client.get(url)
        # tag list endpoint is empty, confirming tag deletion
        self.assertEqual(tag_list.status_code, status.HTTP_200_OK)
        self.assertEqual(tag_list.json()['count'], 0)

    def test_search_document_pages(self):
        doc_a = Document.objects.create(filename="a", folder=Folder.objects.create())
        doc_a_page_1 = DocumentPageImage.objects.create(
            document=doc_a,
            page_number=1,
            text="my egg is dirty, please may i have a new one",
        )

        doc_b = Document.objects.create(filename="b", folder=Folder.objects.create())
        doc_b_page_1 = DocumentPageImage.objects.create(
            document=doc_b, page_number=1, text="this omelette is eggcellent"
        )

        url = reverse("document-text-search", query_params={"q": "egg"})
        response = self.client.get(url)
        # should return two results
        self.assertTrue(len(response.json()), 2)

        # should contain both page ids
        page_ids = [i["id"] for i in response.json()]
        self.assertTrue(all([i.id in page_ids for i in [doc_a_page_1, doc_b_page_1]]))

        url = reverse("document-text-search", query_params={"q": "dirt"})
        response = self.client.get(url)
        # should return one result
        self.assertTrue(len(response.json()), 1)

        # should contain the single page id
        self.assertTrue(response.json()[0]["id"] == doc_a_page_1.id)

    def test_find_document(self):
        Document.objects.create(
            filename="tax 2020", status=DocumentStatus.annotated.value
        )
        Document.objects.create(
            filename="tax 2021", status=DocumentStatus.created.value
        )
        Document.objects.create(filename="Refi Loan Doc")
        Document.objects.create(filename="dog vaccine record")
        Document.objects.create(filename="birth certificate")

        all_documents = Document.objects.all()
        self.assertEqual(len(all_documents), 5)

        specific_tax_documents = Document.objects.filter(filename="tax 2020")
        self.assertEqual(len(specific_tax_documents), 1)

        tax_documents = Document.objects.filter(filename__contains="tax")
        self.assertEqual(len(tax_documents), 2)

        annotated_tax_documents = Document.objects.filter(
            filename__contains="tax"
        ).filter(status=DocumentStatus.annotated.value)
        self.assertEqual(len(annotated_tax_documents), 1)
        self.assertEqual(annotated_tax_documents[0].filename, "tax 2020")
        self.assertEqual(
            annotated_tax_documents[0].status, DocumentStatus.annotated.value
        )

        non_tax_document = Document.objects.exclude(filename="tax 2020")
        self.assertEqual(len(non_tax_document), 4)

        no_tax_documents = Document.objects.exclude(filename__contains="tax")
        self.assertEqual(len(no_tax_documents), 3)

    def test_document_search(self):
        Document.objects.create(
            filename="taxes 2020", status=DocumentStatus.annotated.value
        )
        Document.objects.create(
            filename="taxes 2021", status=DocumentStatus.created.value
        )
        Document.objects.create(filename="Refi Loan Doc")
        Document.objects.create(filename="dog vaccine record")
        Document.objects.create(filename="birth certificate")

        url = reverse("document-search")
        url_with_query_parameters = url + "?q=taxes"
        response = self.client.get(url_with_query_parameters)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # number of documents containing the search term
        match_query = Document.objects.filter(filename__contains="taxes")
        self.assertEqual(len(match_query), 2)

        # number of documents being searched
        all_docs = Document.objects.all()
        self.assertEqual(len(all_docs), 5)

        # match specific file names
        specific_doc_2020 = Document.objects.filter(filename="taxes 2020")
        self.assertEqual(len(specific_doc_2020), 1)

        specific_doc_2021 = Document.objects.filter(filename="taxes 2021")
        self.assertEqual(len(specific_doc_2021), 1)

        # document list contains dog vaccine record
        vaccine_doc = Document.objects.filter(filename__contains="dog vaccine record")
        self.assertEqual(len(vaccine_doc), 1)

        annotated_taxes_documents = Document.objects.filter(
            filename__contains="taxes"
        ).filter(status=DocumentStatus.annotated.value)
        self.assertEqual(len(annotated_taxes_documents), 1)
        self.assertEqual(annotated_taxes_documents[0].filename, "taxes 2020")
        self.assertEqual(
            annotated_taxes_documents[0].status, DocumentStatus.annotated.value
        )

        created_taxes_documents = Document.objects.filter(
            filename__contains="taxes"
        ).filter(status=DocumentStatus.created.value)
        self.assertEqual(len(created_taxes_documents), 1)
        self.assertEqual(created_taxes_documents[0].filename, "taxes 2021")
        self.assertEqual(
            created_taxes_documents[0].status, DocumentStatus.created.value
        )

    def test_create_list_tags(self):
        # create document
        url = reverse("document-create", args=("testfile",))
        doc_response = self.client.post(url)
        self.assertEqual(doc_response.status_code, status.HTTP_200_OK)

        # create a tag
        url = reverse("document-tags", args=(doc_response.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'hello'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # list should return single tag
        tag_list_response = self.client.get(url)
        self.assertEqual(tag_list_response.json()['count'], 1)

        tag_response = self.client.post(url, {
            'name': 'world'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # list should return multiple tags
        tag_list_response = self.client.get(url)
        self.assertEqual(tag_list_response.json()['count'], 2)

    def test_delete_tags(self):
        # create document
        url = reverse("document-create", args=("testfile",))
        doc_response = self.client.post(url)
        self.assertEqual(doc_response.status_code, status.HTTP_200_OK)

        # create a tag
        url = reverse("document-tags", args=(doc_response.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'hello'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        url = reverse("document-tag-detail", args=(doc_response.json()['id'], tag_response.json()['id'],))
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        url = reverse("document-tags", args=(doc_response.json()['id'],))
        tag_list_response = self.client.get(url)
        self.assertEqual(tag_list_response.json()['count'], 0)

        # tag isn't referenced, should have been cleaned up / destroyed
        url = reverse("document-tags", args=(doc_response.json()['id'],))
        tag_list = self.client.get(url)
        self.assertEqual(tag_list.json()['count'], 0)
