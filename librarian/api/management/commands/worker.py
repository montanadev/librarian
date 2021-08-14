import logging
from time import sleep

from django.core.management.base import BaseCommand, CommandError

from librarian.api.models import DocumentJob

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def handle(self, *args, **options):
        logger.info("Running worker...")
        running = False
        while True:
            for i in DocumentJob.objects.filter(completed_at__isnull=True):
                running = True
                logger.info(f"Running job '{i.job}'...")
                i.run()
                logger.info(f"Running job '{i.job}'...done")

            if running:
                logger.info("\nNo more jobs, sleeping\n")
                running = False

            sleep(2)
