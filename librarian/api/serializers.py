from rest_framework import serializers

from librarian.api.models import Document, DocumentPageImage
from librarian.api.models.config_models import Setup
from librarian.api.models.folder import Folder


class DocumentSerializer(serializers.ModelSerializer):
    # drf bug: see https://stackoverflow.com/a/27079355/11241039
    id = serializers.IntegerField()

    class Meta:
        model = Document
        fields = '__all__'


class DocumentPageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentPageImage
        fields = ('id', 'document', 'text')


class SetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setup
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
            doc_obj.folders.add(folder)
            doc_obj.save()

        return folder
