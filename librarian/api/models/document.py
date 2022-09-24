import logging
import tempfile

from django.apps import apps
from django.db import models

from librarian.api.models import DocumentStatus, SourceContentTypes
from librarian.api.models.folder import Folder

logger = logging.getLogger(__name__)


class Document(models.Model):
    id = models.BigAutoField(primary_key=True)
    filename = models.TextField()
    source_content_type = models.IntegerField(choices=SourceContentTypes.choices, default=SourceContentTypes.PDF)
    hash = models.TextField(null=True)
    temp_path = models.TextField(null=True)
    # filestore_path is the original filename on disk, as the `filename` property can be changed by user
    filestore_path = models.TextField(null=True)
    folder = models.ForeignKey(
        Folder, null=True, related_name="documents", on_delete=models.SET_NULL
    )

    status = models.TextField(
        choices=DocumentStatus.choices(), default=DocumentStatus.created.value
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def create_from_filename(cls, filename, hash):
        # add new doc to the default folder
        Folder = apps.get_model("api", "Folder")

        source_content_type = SourceContentTypes.PDF
        if '.jpg' in filename or '.jpeg' in filename:
            source_content_type = SourceContentTypes.JPEG
        if '.png' in filename:
            source_content_type = SourceContentTypes.PNG

        return cls.objects.create(
            filename=filename,
            source_content_type=source_content_type,
            hash=hash,
            status=DocumentStatus.created,
            folder=Folder.get_default(),
        )

    def persist_to_filestore(self, content):
        # store file uploaded by user to tempfile until persistence to blob store is
        # complete
        fd, path = tempfile.mkstemp()
        with open(fd, "wb") as f:
            f.write(content)

        self.temp_path = path
        logger.debug(f"Temp persist: {path}")
        self.save()

        DocumentJob = apps.get_model("api", "DocumentJob")
        DocumentJob.objects.create(
            kind=DocumentJob.Kind.persist,
            document=self,
            current_status=DocumentStatus.persisting,
            desired_status=DocumentStatus.persisted,
        )

    def translate_pdf_to_images(self):
        DocumentJob = apps.get_model("api", "DocumentJob")
        DocumentJob.objects.create(
            kind=DocumentJob.Kind.translate_pdf_to_images,
            document=self,
            current_status=DocumentStatus.translating_pdf_to_images,
            desired_status=DocumentStatus.translated_pdf_to_images,
        )

    def annotate(self):
        DocumentJob = apps.get_model("api", "DocumentJob")
        DocumentJob.objects.create(
            kind=DocumentJob.Kind.annotate,
            document=self,
            current_status=DocumentStatus.annotating,
            desired_status=DocumentStatus.annotated,
        )
