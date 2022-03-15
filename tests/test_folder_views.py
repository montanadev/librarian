from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from tests.helpers import reverse


class TestFolderViews(TestCase):
    def setUp(self):
        self.client = APIClient()

        # create document
        url = reverse("document-create", args=("testfile",))
        self.test_doc = self.client.post(url)
        self.assertEqual(self.test_doc.status_code, status.HTTP_200_OK)

    def test_create_empty_folder(self):
        url = reverse("folder-create")
        response = self.client.post(
            url, {"name": "new-folder", "documents": []}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_folder_with_document(self):
        # create folder with attached document
        url = reverse("folder-create")
        data = {"name": "new-folder", "documents": [self.test_doc.json()]}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_folder(self):
        url = reverse("folder-create")
        folder = self.client.post(
            url, {"name": "new-folder", "documents": []}, format="json"
        )
        self.assertEqual(folder.status_code, status.HTTP_201_CREATED)

        response = self.client.delete(
            reverse("folder-detail", args=(folder.json()["id"],))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_add_document_to_folder(self):
        # create folder
        url = reverse("folder-create")
        folder = self.client.post(
            url, {"name": "new-folder", "documents": []}, format="json"
        )
        self.assertEqual(folder.status_code, status.HTTP_201_CREATED)

        # add document to folder
        url = reverse("folder-add-document", args=(folder.json()["id"],))
        response = self.client.put(
            url, {"id": self.test_doc.json()["id"]}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_document_from_folder(self):
        # create folder with attached document
        url = reverse("folder-create")
        data = {"name": "new-folder", "documents": [self.test_doc.json()]}
        folder = self.client.post(url, data, format="json")
        self.assertEqual(folder.status_code, status.HTTP_201_CREATED)

        # remove document from folder
        url = reverse(
            "folder-document-detail",
            args=(folder.json()["id"], self.test_doc.json()["id"]),
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_rename_folder(self):
        url = reverse("folder-create")
        data = {"name": "new-folder", "documents": [self.test_doc.json()]}
        folder = self.client.post(url, data, format="json")
        self.assertEqual(folder.status_code, status.HTTP_201_CREATED)

        url = reverse("folder-detail", args=(folder.json()["id"],))
        body = {"name": "renamed", "documents": []}
        response = self.client.put(url, body, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "renamed")
