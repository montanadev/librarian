import logging

from django.db import models

from librarian.api.models import DocumentStatus
from librarian.utils.enum import BaseEnum

logger = logging.getLogger(__name__)


class DocumentJob(models.Model):
    class Kind(BaseEnum):
        persist = "PERSIST"
        translate_pdf_to_images = "TRANSLATE_TO_IMAGES"
        annotate = "ANNOTATE"

    document = models.ForeignKey("Document", on_delete=models.CASCADE)
    kind = models.TextField(choices=Kind.choices())

    current_status = models.TextField(choices=DocumentStatus.choices())
    desired_status = models.TextField(choices=DocumentStatus.choices())

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True)

    successful = models.BooleanField(null=True)
    failed_reason = models.TextField(null=True)
