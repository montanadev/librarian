from django.contrib import admin
from django.urls import path

from librarian.api import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/documents/", views.DocumentListView.as_view()),
    path("api/documents/<str:filename>", views.document_create),
    path("api/documents/<int:id>/details", views.DocumentView.as_view()),
    path("api/documents/<int:id>/data", views.DocumentDataView.as_view())
]
