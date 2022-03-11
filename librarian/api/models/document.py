import logging
import tempfile

from django.apps import apps
from django.conf import settings
from django.db import models

from librarian.api.models import DocumentJob, DocumentJobJobs
from librarian.api.models import DocumentStatus
from librarian.api.models.folder import Folder

logger = logging.getLogger(__name__)


class Document(models.Model):
    id = models.BigAutoField(primary_key=True)
    filename = models.TextField()
    hash = models.TextField(null=True)
    temp_path = models.TextField(null=True)
    filestore_path = models.TextField(null=True)
    folder = models.ForeignKey(Folder, null=True, related_name='documents', on_delete=models.SET_NULL)

    status = models.TextField(choices=DocumentStatus.choices(), default=DocumentStatus.created.value)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_bytes_from_filestore(self):
        if settings.STORAGE_MODE == "local":
            with open(settings.LOCAL_STORAGE_PATH + "/" + self.filestore_path, mode="rb") as f:
                b = f.read()
        elif settings.STORAGE_MODE == "nfs":
            import libnfs
            nfs = libnfs.NFS(settings.NFS_PATH)
            nfs_f = nfs.open("/" + self.filestore_path, mode="rb")
            b = nfs_f.read()
            nfs_f.close()
        else:
            raise Exception(f"Storage mode {settings.STORAGE_MODE} not recognized, quitting")

        return b

    @classmethod
    def create_from_filename(cls, filename, hash):
        # add new doc to the default folder
        Folder = apps.get_model('api', 'Folder')

        return cls.objects.create(filename=filename, hash=hash, status=DocumentStatus.created,
                                  folder=Folder.get_default())

    def persist_to_filestore(self, content):
        # store file uploaded by user to tempfile until persistence to blob store is
        # complete
        fd, path = tempfile.mkstemp()
        with open(fd, "w+b") as f:
            f.write(content)

        self.temp_path = path
        logger.debug(f"Temp persist: {path}")
        self.save()

        DocumentJob.objects.create(
            job=DocumentJobJobs.persist,
            document=self,
            current_status=DocumentStatus.persisting,
            desired_status=DocumentStatus.persisted,
        )

    def translate_pdf_to_images(self):
        DocumentJob.objects.create(
            job=DocumentJobJobs.translate_pdf_to_images,
            document=self,
            current_status=DocumentStatus.translating_pdf_to_images,
            desired_status=DocumentStatus.translated_pdf_to_images,
        )

    def annotate(self):
        DocumentJob.objects.create(
            job=DocumentJobJobs.annotate,
            document=self,
            current_status=DocumentStatus.annotating,
            desired_status=DocumentStatus.annotated,
        )
