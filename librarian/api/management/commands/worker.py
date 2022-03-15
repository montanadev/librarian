import logging
from time import sleep

from django.core.management.base import BaseCommand
from django.utils import timezone

from librarian.api.models import DocumentJob
from librarian.utils.attrs import setattrs

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def handle(self, *args, **options):
        logger.info("Running worker...")
        running = False
        while True:
            for job in DocumentJob.objects.filter(completed_at__isnull=True):
                running = True
                successful = True
                failed_reason = None

                logger.info(f"Running job '{job.job}'...")

                try:
                    job.run()
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

            if running:
                logger.info("\nNo more jobs, sleeping\n")
                running = False

            sleep(2)
