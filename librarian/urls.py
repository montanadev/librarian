from django.contrib import admin
from django.urls import path

from librarian.api.views import document_views, config_views

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/config/", config_views.config_create),
    path("api/config/", config_models),
    path("api/documents/", document_views.DocumentListView.as_view()),
    path("api/documents/<str:filename>", document_views.document_create),
    path("api/documents/<int:id>/details", document_views.DocumentView.as_view()),
    path("api/documents/<int:id>/data", document_views.DocumentDataView.as_view())
]
