from librarian.utils.enum import BaseEnum


class DocumentStatus(BaseEnum):
    created = "CREATED"

    persisting = "PERSISTING"
    persisted = "PERSISTED"

    translating_pdf_to_images = "TRANSLATING_PDF_TO_IMAGES"
    translated_pdf_to_images = "TRANSLATED_PDF_TO_IMAGES"

    annotating = "ANNOTATING"
    annotated = "ANNOTATED"
