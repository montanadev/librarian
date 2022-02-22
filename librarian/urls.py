from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from librarian.api.views import document_views, config_views, folder_views
from librarian.api.views.static_views import index

urlpatterns = [

    path("admin/", admin.site.urls),

    # config endpoints
    path("api/config/", config_views.config_create, name='setup-data'),
    path("api/config/read", config_views.config_get, name='get-data'),

    # search endpoints
    path("api/documents/search", document_views.document_search, name='document-search'),
    path("api/documents/text/search", document_views.DocumentTextSearchView.as_view(), name='document-text-search'),

    # document endpoints
    path("api/documents/", document_views.DocumentListView.as_view()),
    path("api/documents/<str:filename>", document_views.document_create, name='document-create'),
    path("api/documents/<int:id>/details", document_views.DocumentView.as_view()),
    path("api/documents/<int:id>/data", document_views.DocumentDataView.as_view()),

    # folder endpoints
    path("api/folders/", folder_views.FolderListView.as_view(), name='folder-create'),
    path("api/folders/<int:pk>", folder_views.FolderDetailView.as_view(), name='folder-detail'),
    path("api/folders/<int:pk>/document", folder_views.FolderAddDocumentView.as_view(), name='folder-add-document'),
    path("api/folders/<int:pk>/document/<int:doc_id>", folder_views.FolderDocumentDetailView.as_view(),
         name='folder-document-detail'),

    # static file endpoints
    path("<path:resource>", index),
    path("", index),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
