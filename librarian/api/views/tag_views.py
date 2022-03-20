from rest_framework.generics import ListAPIView

from librarian.api.models import Tag
from librarian.api.serializers import TagSerializer


class TagListView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
