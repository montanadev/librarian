import logging

from django.conf import settings
from google.cloud import vision
from google.cloud.vision_v1 import AnnotateImageResponse

logger = logging.getLogger(__name__)


def annotate(content):
    client = vision.ImageAnnotatorClient.from_service_account_file(
        settings.GOOGLE_APPLICATION_CREDENTIALS
    )
    image = vision.Image(content=content)

    pb_response = client.text_detection(image=image)
    metadata = AnnotateImageResponse.to_dict(pb_response)

    return pb_response
import logging

from django.conf import settings
from google.cloud import vision
from google.cloud.vision_v1 import AnnotateImageResponse

logger = logging.getLogger(__name__)


def annotate(content):
    client = vision.ImageAnnotatorClient.from_service_account_file(
        settings.GOOGLE_APPLICATION_CREDENTIALS
    )
    image = vision.Image(content=content)

    pb_response = client.text_detection(image=image)
    metadata = AnnotateImageResponse.to_json(pb_response)

    return pb_response.full_text_annotation.text, metadata
