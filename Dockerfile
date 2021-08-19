FROM python:3.9-slim

RUN apt-get update
RUN apt-get install make

RUN pip install -U pip && \
    pip install poetry

WORKDIR /srv

COPY pyproject.toml .
RUN poetry install

COPY . /srv

CMD ["make", "run"]