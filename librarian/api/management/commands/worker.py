import logging
from time import sleep

from django.core.management.base import BaseCommand, CommandError

from librarian.api.models import DocumentJob

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def handle(self, *args, **options):
        logger.info("Running worker...")
        while True:
            for i in DocumentJob.objects.filter(completed_at__isnull=True):
                logger.info(f"Running job '{i.job}'...")
                i.run()
                logger.info(f"Running job '{i.job}'...done")

            sleep(1)
