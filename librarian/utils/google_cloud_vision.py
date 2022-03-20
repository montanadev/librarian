from google.cloud import vision


def annotate(content, settings):
    client = vision.ImageAnnotatorClient.from_service_account_info(
        settings.read_google_cloud_api_key()
    )
    image = vision.Image(content=content)
    pb_response = client.text_detection(image=image)

    return pb_response.full_text_annotation.text, str(pb_response)
