FROM node:14 AS js

WORKDIR /srv
COPY client /srv/client

RUN cd client && \
    npm i && \
    npm run build

FROM python:3.9-slim

EXPOSE 8000

WORKDIR /srv
COPY . /srv
COPY --from=js /srv/client/build /srv/librarian/static
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN apt-get update && \
    apt-get install -y make supervisor imagemagick

RUN pip install -U pip && \
    pip install poetry

COPY pyproject.toml .
RUN poetry install

# see https://stackoverflow.com/questions/52998331/imagemagick-security-policy-pdf-blocking-conversion
COPY policy.xml /etc/ImageMagick-6/policy.xml

CMD ["bash", "-c", "cd /srv && make migrate && supervisord"]
