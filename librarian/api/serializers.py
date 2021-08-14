from rest_framework import serializers

from librarian.api.models import Document, DocumentPageImage
from librarian.api.models.config_models import Setup


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


class DocumentPageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentPageImage
        fields = ('document', 'text')


class SetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setup
        fields = '__all__'
