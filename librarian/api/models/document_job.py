import logging
import os
import subprocess
import tempfile
from datetime import datetime

from django.db import models

from librarian.utils.google_cloud_vision import annotate
from librarian.api.models import DocumentPageImage, DocumentStatus, Settings, SourceContentTypes
from librarian.utils.attrs import setattrs
from librarian.utils.enum import BaseEnum

logger = logging.getLogger(__name__)


class DocumentJobJobs(BaseEnum):
    persist = "PERSIST"
    translate_pdf_to_images = "TRANSLATE_TO_IMAGES"
    annotate = "ANNOTATE"


class DocumentJob(models.Model):
    document = models.ForeignKey("Document", on_delete=models.CASCADE)
    job = models.TextField(choices=DocumentJobJobs.choices())

    current_status = models.TextField(choices=DocumentStatus.choices())
    desired_status = models.TextField(choices=DocumentStatus.choices())

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True)

    successful = models.BooleanField(null=True)
    failed_reason = models.TextField(null=True)

    def run(self):
        settings = Settings.objects.first()
        if not settings:
            raise Exception("Settings not configured, exiting")

        dc = self.document
        dc.status = self.current_status
        dc.save()

        if self.job == DocumentJobJobs.persist:
            # non-pdfs need to be converted before persistence
            if dc.source_content_type != SourceContentTypes.PDF:
                logger.debug("Non-pdf detected, preconverting to pdf before persistence...")
                cmd = (
                    f"convert -density 150 {dc.temp_path} -quality 90 {dc.temp_path}.pdf"
                )
                subprocess.call(cmd.split(" "))
                dc.temp_path += '.pdf'
                dc.filename += '.pdf'
                dc.save()

                logger.debug("Non-pdf detected, preconverting to pdf before persistence...done")
                logger.debug(f"Pdf converted and saved to {dc.temp_path}")

            logger.debug(f"Persistence mode {settings.storage_mode}")
            if settings.storage_mode == "local":
                dest = os.path.join(settings.storage_path, dc.filename)
                logger.debug(f"Persisting to {dest}")
                # TODO - no need to open / write, just move from temp to filestore path
                with open(dest, mode="wb") as local_f, open(
                    dc.temp_path, "rb"
                ) as tmp_f:
                    local_f.write(bytearray(tmp_f.read()))
            elif settings.storage_mode == "nfs":
                import libnfs

                # read temp file into nfs
                nfs = libnfs.NFS(settings.storage_path)
                nfs_f = nfs.open("/" + dc.filename, mode="wb")
                with open(dc.temp_path, "rb") as tmp_f:
                    nfs_f.write(bytearray(tmp_f.read()))
                nfs_f.close()
            else:
                raise Exception(
                    f"Storage mode {settings.storage_mode} not recognized, quitting"
                )

            # cleanup temp file
            os.remove(dc.temp_path)

            setattrs(
                dc,
                temp_path=None,
                status=self.desired_status,
            )
            dc.save()

            # TODO - this might not be the best place to kick off next transition
            dc.translate_pdf_to_images()

        if self.job == DocumentJobJobs.translate_pdf_to_images:
            b = dc.get_bytes_from_filestore(settings)

            # temp dir to hold imagemagick output images
            image_dir = tempfile.mkdtemp()
            # temp file to write file to disk for imagemagick
            fd, input_file = tempfile.mkstemp()
            with open(fd, "w+b") as f:
                f.write(b)

            cmd = (
                f"convert -density 150 {input_file} -quality 90 {image_dir}/output.png"
            )

            start_time = datetime.now()
            logger.debug(f"Starting conversion...: \n{cmd}")

            subprocess.call(cmd.split(" "))

            duration = (datetime.now() - start_time).total_seconds()
            logger.debug(f"Starting conversion...done in {duration}s: \n{cmd}")

            seen = 0
            # list images from pdf split
            for filename in os.listdir(image_dir):
                seen += 1
                page_number = 0

                if filename != "output.png":
                    # take "output-5.png" and split to "5.png"
                    _, filename_parts = filename.split("-")
                    # split "5.png" to 5
                    page_number, _ = filename_parts.split(".")

                DocumentPageImage.objects.create(
                    document=dc,
                    temp_path=f"{image_dir}/{filename}",
                    page_number=int(page_number),
                )

            if not seen:
                logger.warning(
                    f"No images detected from imagemagick convert command: '{cmd}'"
                )
            logger.debug(f"Stored {seen} pages from imagemagick convert command")

            # cleanup temp file,  but dont cleanup images: still needed for annotation
            os.remove(input_file)

            dc.status = self.desired_status
            dc.save()
            dc.annotate()

        if self.job == DocumentJobJobs.annotate:
            logger.debug(f"Annotating {dc.pages.count()} pages...")
            for page in dc.pages.all():
                with open(page.temp_path, mode="r+b") as tmp_f:
                    text, metadata = annotate(tmp_f.read(), settings)
                    setattrs(page, text=text, metadata=metadata)
                    page.save()

            logger.debug(f"Annotating {dc.pages.count()} pages...done")
            logger.debug("Freeing up /tmp image files...")

            for page in dc.pages.all():
                os.remove(page.temp_path)
                page.temp_path = None
                page.save()

            logger.debug("Freeing up /tmp image files...done")

            dc.status = self.desired_status
            dc.save()
