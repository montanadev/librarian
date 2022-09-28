from django.db import transaction
from rest_framework import serializers
import json

from librarian.api.models import Document, DocumentPageImage, Tag, StorageSettingsLocal, StorageSettingsNFS, \
    StorageSettingsS3
from librarian.api.models.folder import Folder
from librarian.api.models.settings import Settings


def text_search(metadata, q):
    textAnnotations = metadata['textAnnotations']

    bounding_vertices = []

    for item in textAnnotations:
        # I believe these would return the "file" vertices, but I think in that instance, we would not need the first statement
        # if item['description'] == q:
        #     bounding_vertices.append(item['boundingPoly']['vertices'])
        # if item['description'].startswith(q):
        #     bounding_vertices.append(item['boundingPoly']['vertices'])
        if q.lower() in item['description'].lower():
            bounding_vertices.append(item['boundingPoly']['vertices'])
    return bounding_vertices


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
    bounding_boxes = serializers.SerializerMethodField()

    def get_bounding_boxes(self, obj):
        return text_search(json.loads(obj.metadata), self.context['request'].query_params['q'])

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
        fields = ("id", "document", "document_filename", "folder", "page_number", "matches", "bounding_boxes")


class StorageSettingsRelatedField(serializers.RelatedField):
    queryset = Settings.objects.all()

    def to_representation(self, value):
        if type(value) == StorageSettingsLocal:
            return StorageSettingsLocalSerializer(value).data
        if type(value) == StorageSettingsNFS:
            return StorageSettingsNFSSerializer(value).data
        if type(value) == StorageSettingsS3:
            return StorageSettingsS3Serializer(value).data
        raise Exception('Unexpected type of tagged object')


class SetupSerializer(serializers.ModelSerializer):
    storage_settings = StorageSettingsRelatedField()

    class Meta:
        model = Settings
        fields = ("id", "google_cloud_api_key", "storage_mode", "storage_settings")


class StorageSettingsLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageSettingsLocal
        exclude = ('id',)


class StorageSettingsNFSSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageSettingsNFS
        exclude = ('id',)


class StorageSettingsS3Serializer(serializers.ModelSerializer):
    class Meta:
        model = StorageSettingsS3
        exclude = ('id',)


class DemoSetupSerializer(serializers.ModelSerializer):
    google_cloud_api_key = serializers.SerializerMethodField()
    storage_settings = StorageSettingsRelatedField()

    @staticmethod
    def get_google_cloud_api_key(obj):
        # DEMO shouldnt leak gcv key
        return ""

    class Meta:
        model = Settings
        fields = ("id", "google_cloud_api_key", "storage_mode", "storage_settings")


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
