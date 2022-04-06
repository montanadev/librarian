import logging
from time import sleep

from django.core.management.base import BaseCommand
from librarian.api.engine import engine

from librarian.api.models import DocumentJob

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    def handle(self, *args, **options):
        logger.info("Running worker...")
        while True:
            for job in DocumentJob.objects.filter(completed_at__isnull=True):
                engine.run(job)

            if DocumentJob.objects.filter(completed_at__isnull=True).count():
                # jobs appeared since processing started, skip sleep
                continue

            sleep(3)
