from rest_framework import serializers

from librarian.api.models import Document
from librarian.api.models.config_models import Setup

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


class SetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setup
        fields = '__all__'
