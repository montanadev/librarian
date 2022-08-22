import logging
import os
import subprocess
import tempfile
from datetime import datetime

from django.conf import settings as django_settings
from django.utils import timezone

from librarian.api.engine.storage import storage
from librarian.api.models import DocumentJob
from librarian.api.models import DocumentPageImage, DocumentStatus, Settings, SourceContentTypes
from librarian.utils.attrs import setattrs
from librarian.utils.google_cloud_vision import annotate

logger = logging.getLogger(__name__)


def run(job: DocumentJob):
    successful = True
    failed_reason = None

    logger.info(f"Running job '{job.kind}'...")
    try:
        _run(job)
    except Exception as e:
        successful = False
        failed_reason = str(e)
        logger.exception(e)
    finally:
        setattrs(
            job,
            completed_at=timezone.now(),
            successful=successful,
            failed_reason=failed_reason,
        )
        job.save()
    logger.info(f"Running job '{job.kind}'...done")


def _run(job: DocumentJob):
    settings = Settings.objects.first()
    if not settings:
        settings = Settings.create_default()

    doc = job.document
    doc.status = job.current_status
    doc.save()

    if job.kind == DocumentJob.Kind.persist:
        # non-pdfs need to be converted before persistence
        if doc.source_content_type != SourceContentTypes.PDF:
            logger.debug("Non-pdf detected, preconverting to pdf before persistence...")
            cmd = (
                f"convert -density 150 {doc.temp_path} -quality 90 {doc.temp_path}.pdf"
            )
            subprocess.call(cmd.split(" "))
            doc.temp_path += '.pdf'
            doc.filename += '.pdf'
            doc.save()

            logger.debug("Non-pdf detected, preconverting to pdf before persistence...done")
            logger.debug(f"Pdf converted and saved to {doc.temp_path}")

        logger.debug(f"Persistence mode {settings.storage_mode}")

        # move from temp to durable filestore path
        with open(doc.temp_path, "rb") as tmp_f:
            storage.write(settings, doc, tmp_f.read())

        # cleanup temp file
        os.remove(doc.temp_path)

        setattrs(
            doc,
            temp_path=None,
            status=job.desired_status,
            # filestore_path tracks the original filename as persisted on disk.
            # necessary as the `filename` property may change over time
            filestore_path=doc.filename
        )
        doc.save()

        # TODO - this might not be the best place to kick off next transition
        doc.translate_pdf_to_images()

    if job.kind == DocumentJob.Kind.translate_pdf_to_images:
        # temp dir to hold imagemagick output images
        output_dir = tempfile.mkdtemp()
        # source file may be nfs, which wouldn't exist locally on disk.
        # write source file bytes to disk for imagemagick
        file, filename = tempfile.mkstemp()
        with open(file, "w+b") as f:
            f.write(storage.read(settings, doc))

        cmd = (
            f"convert -density 150 {filename} -quality 90 {output_dir}/output.png"
        )

        start_time = datetime.now()
        logger.debug(f"Starting conversion...: \n{cmd}")

        subprocess.call(cmd.split(" "))

        duration = (datetime.now() - start_time).total_seconds()
        logger.debug(f"Starting conversion...done in {duration}s")

        seen = 0
        # list images from pdf split
        for output_file in os.listdir(output_dir):
            seen += 1
            page_number = 0

            if output_file != "output.png":
                # take "output-5.png" and split to "5.png"
                _, filename_parts = output_file.split("-")
                # split "5.png" to 5
                page_number, _ = filename_parts.split(".")

            DocumentPageImage.objects.create(
                document=doc,
                temp_path=f"{output_dir}/{output_file}",
                page_number=int(page_number),
            )

        if not seen:
            # print(subprocess.check_output(f"cat {filename}", stderr=subprocess.STDOUT, shell=True))
            raise Exception(f"No images detected from imagemagick convert command: '{cmd}'")

        logger.debug(f"Stored {seen} pages from imagemagick convert command")

        # cleanup temp file, but dont cleanup images: still needed for annotation
        os.remove(filename)

        doc.status = job.desired_status
        doc.save()

        if django_settings.DISABLE_ANNOTATION:
            # skip directly to annotated
            logger.warning(f"Skipping annotation for {job.document.filename}")
            doc.status = DocumentStatus.annotated.value
            doc.save()
        else:
            doc.annotate()

    if job.kind == DocumentJob.Kind.annotate:
        logger.debug(f"Annotating {doc.pages.count()} pages...")
        for page in doc.pages.all():
            with open(page.temp_path, mode="r+b") as tmp_f:
                text, metadata = annotate(tmp_f.read(), settings)
                setattrs(page, text=text, metadata=metadata)
                page.save()

        logger.debug(f"Annotating {doc.pages.count()} pages...done")
        logger.debug("Freeing up /tmp image files...")

        for page in doc.pages.all():
            os.remove(page.temp_path)
            page.temp_path = None
            page.save()

        logger.debug("Freeing up /tmp image files...done")

        doc.status = job.desired_status
        doc.save()
