from django.db import transaction
from rest_framework import serializers

from librarian.api.models import Document, DocumentPageImage, Tag
from librarian.api.models.folder import Folder
from librarian.api.models.settings import Settings


class DocumentSerializer(serializers.ModelSerializer):
    # drf bug: see https://stackoverflow.com/a/27079355/11241039
    id = serializers.IntegerField()

    class Meta:
        model = Document
        fields = "__all__"


class DocumentPageTextSerializer(serializers.ModelSerializer):
    folder = serializers.SerializerMethodField()
    document_filename = serializers.SerializerMethodField()
    matches = serializers.SerializerMethodField()

    @staticmethod
    def get_matches(obj):
        return obj.matches

    @staticmethod
    def get_folder(obj):
        return obj.document.folder.id

    @staticmethod
    def get_document_filename(obj):
        return obj.document.filename

    class Meta:
        model = DocumentPageImage
        fields = ("id", "document", "document_filename", "folder", "page_number", "matches")


class SetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = "__all__"


class DemoSetupSerializer(serializers.ModelSerializer):
    google_cloud_api_key = serializers.SerializerMethodField()

    @staticmethod
    def get_google_cloud_api_key(obj):
        # DEMO shouldnt leak gcv key
        return ""

    class Meta:
        model = Settings
        fields = ("id", "google_cloud_api_key", "storage_mode", "storage_path")


class FolderSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True)

    class Meta:
        model = Folder
        fields = "__all__"

    def create(self, validated_data):
        docs = validated_data.pop("documents")
        folder = Folder.objects.create(**validated_data)

        self.update_document_to_folder_links(folder, docs)

        return folder

    def update(self, folder, validated_data):
        docs = validated_data.pop("documents", [])

        self.update_document_to_folder_links(folder, docs)

        # update folder properties
        folder.__dict__.update(validated_data)
        folder.save()

        return folder

    @staticmethod
    def update_document_to_folder_links(folder, docs):
        with transaction.atomic():
            doc_objs = Document.objects.filter(id__in=[d['id'] for d in docs])

            for doc_obj in doc_objs:
                doc_obj.folder = folder
                doc_obj.save()


class FolderAddDocumentViewSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Document
        fields = ("id",)


class DocumentTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class TagSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True)

    class Meta:
        model = Tag
        fields = ("id", "name", "documents")
