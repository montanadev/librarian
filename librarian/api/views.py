import libnfs
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView, get_object_or_404

from librarian.api.models import Document
from librarian.api.serializers import DocumentSerializer


class DocumentListView(ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentView(RetrieveAPIView):
    serializer_class = DocumentSerializer

    def get_object(self):
        return get_object_or_404(Document.objects, id=self.kwargs['id'])


class DocumentDataView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        dc = get_object_or_404(Document.objects, id=self.kwargs['id'])
        nfs = libnfs.NFS(settings.NFS_PATH)

        nfs_f = nfs.open("/" + dc.filestore_path, mode="rb")
        data = nfs_f.read()
        nfs_f.close()

        return HttpResponse(bytes(data), headers={"Content-Type": "application/pdf"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def document_create(request, filename):
    dc = Document.create_from_filename(filename)
    dc.persist_to_filestore(request.body)

    if request.content_type == "application/pdf":
        pass

    data = DocumentSerializer(dc).data

    return JsonResponse(data=data, status=status.HTTP_200_OK)
