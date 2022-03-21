from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from tests.helpers import reverse


class TestTagViews(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list_tags(self):
        # create document
        url = reverse("document-create", args=("testfile",))
        doc_a = self.client.post(url)
        self.assertEqual(doc_a.status_code, status.HTTP_200_OK)

        # create a tag
        url = reverse("document-tags", args=(doc_a.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'hello'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # create a second tag
        url = reverse("document-tags", args=(doc_a.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'world'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # call tag list, should have two tags
        url = reverse("tag-list")
        tag_list = self.client.get(url)
        self.assertEqual(tag_list.json()['count'], 2)

    def test_multiple_documents_with_same_tag(self):
        # create document
        url = reverse("document-create", args=("testfile",))
        doc_a = self.client.post(url)
        self.assertEqual(doc_a.status_code, status.HTTP_200_OK)

        # create a second document
        url = reverse("document-create", args=("testfile",))
        doc_b = self.client.post(url, {"dummy": "data"})
        self.assertEqual(doc_b.status_code, status.HTTP_200_OK)

        # tag first document
        url = reverse("document-tags", args=(doc_a.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'hello'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # tag second document
        url = reverse("document-tags", args=(doc_b.json()['id'],))
        tag_response = self.client.post(url, {
            'name': 'hello'
        })
        self.assertEqual(tag_response.status_code, status.HTTP_201_CREATED)

        # call tag list, should have one tag with two documents
        url = reverse("tag-list")
        tag_list = self.client.get(url)
        tags = tag_list.json()['results']
        # one tag
        self.assertEqual(len(tags), 1)
        # attached to two documents
        self.assertEqual(len(tags[0]['documents']), 2)
