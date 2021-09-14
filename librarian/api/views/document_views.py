import pdb
import json

from django.http import HttpResponse, JsonResponse

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView, get_object_or_404

from librarian.api.models import Document, DocumentPageImage
from librarian.api.serializers import DocumentSerializer, DocumentPageImageSerializer


def text_search(metadata, q):
    textAnnotations = metadata['textAnnotations']

    bounding_vertices = []

    for item in textAnnotations:
        #I believe these would return the "file" vertices, but I think in that instance, we would not need the first statement
        # if item['description'] == q:
        #     bounding_vertices.append(item['boundingPoly']['vertices'])
        # if item['description'].startswith(q):
        #     bounding_vertices.append(item['boundingPoly']['vertices'])
        if q in item['description']:
            bounding_vertices.append(item['boundingPoly']['vertices'])
    return bounding_vertices


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
        data = dc.get_bytes_from_filestore()

        return HttpResponse(bytes(data), headers={"Content-Type": "application/pdf"}, status=status.HTTP_200_OK)


class DocumentTextSearchView(RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        pages = DocumentPageImage.objects.filter(text__contains=request.query_params['q'])
        import pdb;pdb.set_trace()
        serializer = DocumentPageImageSerializer(pages, many=True)
        return JsonResponse(data=serializer.data, safe=False)


@api_view(["POST"])
def document_create(request, filename):
    dc = Document.create_from_filename(filename)
    dc.persist_to_filestore(request.body)

    if request.content_type == "application/pdf":
        pass

    data = DocumentSerializer(dc).data

    return JsonResponse(data=data, status=status.HTTP_200_OK)


@api_view(["GET"])
def document_search(request):
    search_term = request.query_params['q']

    search_results = Document.objects.filter(filename__contains=search_term)

    serializer = DocumentSerializer(search_results, many=True)

    data = serializer.data

    return JsonResponse(data, safe=False, status=status.HTTP_200_OK)
