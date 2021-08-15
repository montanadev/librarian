FROM python:3.9-alpine

RUN apk update && \
    apk add --no-cache \
        musl-dev \
        python3-dev \
        openssl-dev \
        postgresql-dev \
        ca-certificates \
        wget \
        libffi-dev \
        gcc \
        g++ \
        rust \
        cargo

RUN pip install -U pip && \
    pip install poetry

WORKDIR /srv

COPY pyproject.toml .
RUN poetry install

COPY . /srv

CMD ["make", "run"]