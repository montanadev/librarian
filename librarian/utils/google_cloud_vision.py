import json
from google.cloud import vision
from google.cloud.vision_v1 import AnnotateImageResponse


def annotate(content, settings):
    client = vision.ImageAnnotatorClient.from_service_account_info(
        settings.read_google_cloud_api_key()
    )
    image = vision.Image(content=content)
    pb_response = client.text_detection(image=image)
    json_str_response = AnnotateImageResponse.to_json(pb_response)

    return pb_response.full_text_annotation.text, json_str_response
