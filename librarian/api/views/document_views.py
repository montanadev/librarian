import logging

from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView, get_object_or_404, RetrieveUpdateAPIView

from librarian.api.models import Document, DocumentPageImage
from librarian.api.serializers import DocumentSerializer, DocumentPageImageSerializer
from librarian.utils.hash import md5_for_bytes

logger = logging.getLogger(__name__)


class DocumentListView(ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentView(RetrieveUpdateAPIView):
    serializer_class = DocumentSerializer

    def get_object(self):
        return get_object_or_404(Document.objects, id=self.kwargs['id'])


class DocumentDataView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        dc = get_object_or_404(Document.objects, id=self.kwargs['id'])
        data = dc.get_bytes_from_filestore()

        return HttpResponse(bytes(data), headers={"Content-Type": "application/pdf"}, status=status.HTTP_200_OK)


class DocumentTextSearchView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        pages = DocumentPageImage.objects.filter(text__contains=request.query_params['q'])

        serializer = DocumentPageImageSerializer(pages, many=True)
        return JsonResponse(data=serializer.data, safe=False)


@api_view(["POST"])
def document_create(request, filename):
    doc_hash = md5_for_bytes(request.body)
    if Document.objects.filter(hash=doc_hash).exists():
        logger.warning("Document hash already uploaded, skipping")
        return JsonResponse({"reason": "Document already uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    dc = Document.create_from_filename(filename, doc_hash)
    dc.persist_to_filestore(request.body)

    return JsonResponse(data=DocumentSerializer(dc).data, status=status.HTTP_200_OK)


@api_view(["GET"])
def document_search(request):
    search_term = request.query_params['q']

    search_results = Document.objects.filter(filename__contains=search_term)

    serializer = DocumentSerializer(search_results, many=True)
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
