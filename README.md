![tests](https://github.com/de1ux/librarian/actions/workflows/test-build-and-push.yml/badge.svg) [![librarian](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/p6c21i&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/p6c21i/runs) [![codecov](https://codecov.io/gh/montanadev/librarian/branch/main/graph/badge.svg?token=NPUS7FR2GZ)](https://codecov.io/gh/montanadev/librarian)

# Librarian

Librarian is a high-quality, self-hosted app for your documents.

Features

* configurable, automatic backups to a NAS (over NFS)
* document OCR (via Google Cloud Vision)
* document search

![demo](demo.gif)

## Contributing

### Prerequisites

Tools used to build Librarian

* make
* [npm](https://www.npmjs.com/get-npm)
* python (>3.9)
* poetry
* [libnfs](https://github.com/sahlberg/libnfs)
* imagemagick

On macOS via Homebrew

```
$ brew install node python@3.9 poetry libnfs imagemagick 
```

### Google Cloud Vision API

Librarian's OCR is performed by GCV. It can't detect text without credentials to talk to GCV. To get your own credentials for Librarian to use:

1. Go to https://cloud.google.com/docs/authentication/getting-started
2. Follow the `Creating a service account > Cloud Console` instructions. Create a new project, if necessary.
3. After downloading the JSON key file, move it into this folder, rename it `service-account.json`
4. Visit the [API library page](https://console.cloud.google.com/apis/library), search for `Cloud Vision API`
5. Enable the `Cloud Vision API`

### Installation

For the backend

```bash
$ make migrate
$ make run
```

For the frontend

```bash
$ npm i
$ npm start
```

See [Makefile](Makefile) for additional commands.

### Environment variables

| Name | Default | Example | Description |
| --- | --- | --- | --- |
| NFS_PATH | None | nfs://192.168.1.1/volume1/librarian | Path to an NFS folder to backup documents to |
| GOOGLE_APPLICATION_CREDENTIALS | None | service-account.json | Path a JSON file containing service account credentials for Google Compute Vision |
| SECRET_KEY | None | nvm5k(6t%ybnfd+8*)9r9p@hatnm#1%w3yx(#o1+zo44x2b3yd | Secret key for Django -- can generate one with `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` |

### Scripts

Test uploads without drag-n-dropping on the frontend

```
$ curl 'http://0.0.0.0:8000/api/documents/home-title.pdf' -H 'Content-Type: application/pdf' --data-binary  '@home-title.pdf'
```

### Roadmap

See [roadmap.md](ROADMAP.md)
