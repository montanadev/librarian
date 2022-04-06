import logging
from time import sleep

from django.core.management.base import BaseCommand
from django.utils import timezone

from librarian.engine import engine
from librarian.api.models import DocumentJob
from librarian.utils.attrs import setattrs

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def handle(self, *args, **options):
        logger.info("Running worker...")
        while True:
            for job in DocumentJob.objects.filter(completed_at__isnull=True):
                successful = True
                failed_reason = None

                logger.info(f"Running job '{job.job}'...")

                try:
                    engine.run(job)
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

                logger.info(f"Running job '{job.job}'...done")

            if DocumentJob.objects.filter(completed_at__isnull=True).count():
                # jobs appeared since processing started, skip sleep
                continue

            sleep(3)
