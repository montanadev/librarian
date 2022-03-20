import logging

from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import (ListAPIView, RetrieveAPIView,
                                     RetrieveUpdateDestroyAPIView,
                                     get_object_or_404, ListCreateAPIView, DestroyAPIView)
from rest_framework.response import Response

from librarian.api.models import Document, DocumentPageImage, Settings, Tag
from librarian.api.serializers import (DocumentPageImageSerializer,
                                       DocumentSerializer, DocumentTagSerializer)
from librarian.utils.hash import md5_for_bytes

logger = logging.getLogger(__name__)


class DocumentListView(ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentView(RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()


class DocumentDataView(RetrieveAPIView):
    queryset = Document.objects.all()

    def get(self, request, *args, **kwargs):
        settings = Settings.objects.first()
        if not settings:
            return JsonResponse({"reason": "settings not created yet"}, status=status.HTTP_400_BAD_REQUEST)

        dc = self.get_object()
        data = dc.get_bytes_from_filestore(settings)

        return HttpResponse(
            bytes(data),
            headers={"Content-Type": "application/pdf"},
            status=status.HTTP_200_OK,
        )


class DocumentTextSearchView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        pages = DocumentPageImage.objects.filter(
            text__contains=request.query_params["q"]
        )

        serializer = DocumentPageImageSerializer(pages, many=True)
        return JsonResponse(data=serializer.data, safe=False)


class DocumentTagsView(ListCreateAPIView):
    serializer_class = DocumentTagSerializer

    def get_queryset(self):
        return Tag.objects.filter(documents__id=self.kwargs['pk'])

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tag = Tag.objects.filter(name=serializer.validated_data['name']).first()
        if tag:
            tag_id = tag.id
        else:
            self.perform_create(serializer)
            tag_id = serializer.data['id']

        document = get_object_or_404(Document, id=kwargs['pk'])
        document.tag_set.add(tag_id)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class DocumentTagDetailView(DestroyAPIView):
    def destroy(self, request, *args, **kwargs):
        tag = get_object_or_404(Tag, id=kwargs['tag_id'])
        tag.documents.remove(kwargs['pk'])

        # unreferenced tags should be deleted
        if not tag.documents.count():
            tag.delete()

        return HttpResponse(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def document_create(request, filename):
    doc_hash = md5_for_bytes(request.body)
    if Document.objects.filter(hash=doc_hash).exists():
        logger.warning("Document hash already uploaded, skipping")
        return JsonResponse(
            {"reason": "Document already uploaded"}, status=status.HTTP_400_BAD_REQUEST
        )

    dc = Document.create_from_filename(filename, doc_hash)
    dc.persist_to_filestore(request.body)

    return JsonResponse(data=DocumentSerializer(dc).data, status=status.HTTP_200_OK)


@api_view(["GET"])
def document_search(request):
    search_term = request.query_params["q"]
    search_results = Document.objects.filter(filename__contains=search_term)

    serializer = DocumentSerializer(search_results, many=True)
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
