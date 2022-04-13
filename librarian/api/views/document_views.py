import logging

from django.contrib.postgres.search import SearchHeadline, SearchQuery
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import (ListAPIView, RetrieveAPIView,
                                     RetrieveUpdateDestroyAPIView,
                                     get_object_or_404, ListCreateAPIView, DestroyAPIView)
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

from librarian.api.models import Document, DocumentPageImage, Settings, Tag
from librarian.api.serializers import (DocumentPageTextSerializer,
                                       DocumentSerializer, DocumentTagSerializer)
from librarian.utils.hash import md5_for_bytes
from django.conf import settings

logger = logging.getLogger(__name__)


class DocumentListView(ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer


class DocumentView(RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def destroy(self, request, *args, **kwargs):
        document = self.get_object()
        tag_ids = [i['id'] for i in document.tag_set.values('id')]
        self.perform_destroy(document)

        # if the deleted document contains the last reference to a tag, delete the tag
        for tag_id in tag_ids:
            tag = Tag.objects.get(id=tag_id)
            if not tag.documents.count():
                tag.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


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


class DocumentTextSearchView(ListAPIView):
    serializer_class = DocumentPageTextSerializer

    def list(self, request, *args, **kwargs):
        query_text = request.query_params['q'].lower()
        if len(query_text.split(" ")) == 1:
            query = SearchQuery(query_text + ":*", search_type='raw')
        else:
            query = SearchQuery(query_text, search_type='phrase')

        queryset = DocumentPageImage.objects \
            .annotate(headline=SearchHeadline('text',
                                              query,
                                              start_sel='<b>',
                                              stop_sel='</b>',
                                              highlight_all=True)) \
            .filter(headline__isnull=False) \
            .filter(headline__contains='<b>')

        # each page may have multiple submatches
        # TODO - it looks like postgres has something native like this 'ts_headline'

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        return DocumentPageImage.objects.filter(
            text__icontains=self.request.query_params["q"]
        )


class DocumentTitleSearchView(ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(filename__icontains=self.request.query_params['q'])


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
    data = request.data['file'].read()
    doc_hash = md5_for_bytes(data)

    if Document.objects.filter(hash=doc_hash).exists() and not settings.ALLOW_REUPLOAD:
        logger.warning("Document hash already uploaded, skipping")
        return JsonResponse(
            {"reason": "Document already uploaded"}, status=status.HTTP_400_BAD_REQUEST
        )

    dc = Document.create_from_filename(filename, doc_hash)
    dc.persist_to_filestore(data)

    return JsonResponse(data=DocumentSerializer(dc).data, status=status.HTTP_200_OK)
