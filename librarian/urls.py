from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from librarian.api.views import document_views, folder_views, settings_views, tag_views
from librarian.api.views.static_views import index

urlpatterns = [
    path("admin/", admin.site.urls),
    #
    # config endpoints
    #
    path("api/settings", settings_views.get_or_create_settings_view, name="settings"),
    #
    # search endpoints
    #
    path(
        "api/documents/search", document_views.document_search, name="document-search"
    ),
    path("api/documents/text/search", document_views.DocumentTextSearchView.as_view(), name="document-text-search"),
    #
    # tag endpoints
    #
    path("api/tags/", tag_views.TagListView.as_view(), name="tag-list"),
    #
    # document endpoints
    #
    path("api/documents/", document_views.DocumentListView.as_view()),
    path("api/documents/<str:filename>", document_views.document_create, name="document-create"),
    path("api/documents/<int:pk>/details", document_views.DocumentView.as_view(), name="document-detail"),
    path("api/documents/<int:pk>/tags", document_views.DocumentTagsView.as_view(), name="document-tags"),
    path("api/documents/<int:pk>/tags/<int:tag_id>", document_views.DocumentTagDetailView.as_view(), name="document-tag-detail"),
    path("api/documents/<int:pk>/data", document_views.DocumentDataView.as_view()),
    #
    # folder endpoints
    #
    path("api/folders/", folder_views.FolderListView.as_view(), name="folder-create"),
    path("api/folders/<int:pk>", folder_views.FolderDetailView.as_view(), name="folder-detail"),
    path("api/folders/<int:pk>/document", folder_views.FolderAddDocumentView.as_view(), name="folder-add-document"),
    path("api/folders/<int:pk>/document/<int:doc_id>", folder_views.FolderDocumentDetailView.as_view(), name="folder-document-detail"),
    #
    # static file endpoints
    #
    path("<path:resource>", index),
    path("", index),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
