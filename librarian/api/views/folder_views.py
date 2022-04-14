from django.http import JsonResponse
from rest_framework import status
from rest_framework.generics import (DestroyAPIView, ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView,
                                     UpdateAPIView, get_object_or_404)
from rest_framework.response import Response

from librarian.api.models import Document
from librarian.api.models.folder import Folder
from librarian.api.permissions import DisableDemo
from librarian.api.serializers import (FolderAddDocumentViewSerializer,
                                       FolderSerializer)


class FolderListView(ListCreateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [DisableDemo]


class FolderDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [DisableDemo]


class FolderAddDocumentView(UpdateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderAddDocumentViewSerializer
    permission_classes = [DisableDemo]

    def update(self, request, *args, **kwargs):
        folder = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        document = get_object_or_404(Document, id=serializer.validated_data["id"])
        document.folder = folder
        document.save()

        # return full folder representation
        folder.refresh_from_db()
        return Response(FolderSerializer(folder).data)


# TODO - might be better renamed if only exposing a destroy method
class FolderDocumentDetailView(DestroyAPIView):
    queryset = Folder.objects.all()
    permission_classes = [DisableDemo]

    def destroy(self, request, *args, **kwargs):
        document = get_object_or_404(Document, id=kwargs["doc_id"])
        document.folder = Folder.get_default()
        document.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
