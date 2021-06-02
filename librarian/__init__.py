import logging

from django.conf import settings
from google.cloud import vision

logger = logging.getLogger(__name__)


def annotate(content):
    client = vision.ImageAnnotatorClient.from_service_account_file(
        settings.GOOGLE_APPLICATION_CREDENTIALS
    )
    image = vision.Image(content=content)
    pb_response = client.text_detection(image=image)

    return pb_response.full_text_annotation.text, str(pb_response)

