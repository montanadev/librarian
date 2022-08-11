FROM node:14 AS js

WORKDIR /srv
COPY client /srv/client

RUN cd client && \
    npm i && \
    npm run build


FROM python:3.9-slim

ENV LIBRARIAN_WORKERS 2
ENV LIBRARIAN_TIMEOUT 60

EXPOSE 8000

WORKDIR /srv
COPY . /srv
COPY --from=js /srv/client/build /srv/client/build
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN apt-get update && \
    apt-get install -y make supervisor imagemagick gcc libnfs-dev

RUN pip install -U pip && \
    pip install poetry

COPY pyproject.toml .
RUN poetry install

# see https://stackoverflow.com/questions/52998331/imagemagick-security-policy-pdf-blocking-conversion
COPY policy.xml /etc/ImageMagick-6/policy.xml

CMD ["bash", "-c", "cd /srv && poetry run make collectstatic && poetry run make migrate && supervisord"]
