from rest_framework import serializers

from librarian.api.models import Document, DocumentPageImage
from librarian.api.models.settings import Settings
from librarian.api.models.folder import Folder


class DocumentSerializer(serializers.ModelSerializer):
    # drf bug: see https://stackoverflow.com/a/27079355/11241039
    id = serializers.IntegerField()

    class Meta:
        model = Document
        fields = '__all__'


class DocumentPageImageSerializer(serializers.ModelSerializer):
    folder = serializers.SerializerMethodField()

    @staticmethod
    def get_folder(obj):
        return obj.document.folder.id

    class Meta:
        model = DocumentPageImage
        fields = ('id', 'document', 'text', 'folder', 'page_number')


class SetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'


class FolderSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True)

    class Meta:
        model = Folder
        fields = '__all__'

    def create(self, validated_data):
        docs = validated_data.pop('documents')
        folder = Folder.objects.create(**validated_data)

        for doc in docs:
            doc_obj = Document.objects.get(id=doc['id'])
            # TODO - not very efficient, is there a way to do in bulk? set?
            doc_obj.folder = folder
            doc_obj.save()

        return folder

    def update(self, instance, validated_data):
        docs = validated_data.pop('documents', [])

        for doc in docs:
            doc_obj = Document.objects.get(id=doc['id'])
            # TODO - not very efficient, is there a way to do in bulk? set?
            doc_obj.folder = instance
            doc_obj.save()

        instance.__dict__.update(validated_data)
        instance.save()

        return instance


class FolderAddDocumentViewSerializer(serializers.Serializer):
    id = serializers.IntegerField()

    class Meta:
        model = Document
        fields = ('id',)
