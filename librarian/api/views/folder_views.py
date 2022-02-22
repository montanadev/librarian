from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView, get_object_or_404, \
    DestroyAPIView
from rest_framework.response import Response

from librarian.api.models import Document
from librarian.api.models.folder import Folder
from librarian.api.serializers import FolderSerializer, FolderAddDocumentViewSerializer


class FolderListView(ListCreateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class FolderDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class FolderAddDocumentView(UpdateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderAddDocumentViewSerializer

    def update(self, request, *args, **kwargs):
        folder = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO - check if document already in folder?
        document = get_object_or_404(Document, id=serializer.validated_data['id'])
        document.folders.add(folder)
        document.save()

        # return full folder representation
        folder.refresh_from_db()
        return Response(FolderSerializer(folder).data)


class FolderDocumentDetailView(DestroyAPIView):
    queryset = Folder.objects.all()

    def destroy(self, request, *args, **kwargs):
        folder = self.get_object()
        document = get_object_or_404(Document, id=kwargs['doc_id'])
        document.folders.remove(folder)
        document.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
