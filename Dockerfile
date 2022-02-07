FROM python:3.9-slim

EXPOSE 8000

RUN apt-get update && \
    apt-get install -y make supervisor imagemagick

RUN pip install -U pip && \
    pip install poetry

WORKDIR /srv

COPY pyproject.toml .
RUN poetry install

COPY . /srv
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY client/build /srv/librarian/static

# see https://stackoverflow.com/questions/52998331/imagemagick-security-policy-pdf-blocking-conversion
COPY policy.xml /etc/ImageMagick-6/policy.xml

CMD ["/usr/bin/supervisord"]
