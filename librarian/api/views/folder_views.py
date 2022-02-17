from rest_framework.generics import ListCreateAPIView

from librarian.api.models.folder import Folder
from librarian.api.serializers import FolderSerializer


class FolderListView(ListCreateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
