![tests](https://github.com/de1ux/librarian/actions/workflows/build-and-push.yml/badge.svg) 
[![librarian](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/p6c21i&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/p6c21i/runs) 
[![codecov](https://codecov.io/gh/montanadev/librarian/branch/main/graph/badge.svg?token=NPUS7FR2GZ)](https://codecov.io/gh/montanadev/librarian)

# Librarian

Librarian is an easy-to-use viewer for scanned home documents

Features:

* support for PDFs, JPGs and PNGs
* document backups to a mounted volume (or a NAS via NFS!)
* search engine for scanned text (OCR via Google Compute Vision)
* tagging, folders, organize how you want

## Demo

Check out a demo at https://librarian-demo.montanadev.com

## Installation

### Docker

```bash
$ docker run -p 8000:8000 \
             -e DATABASE_URL=postgresql://user:password@address/database \
    ghcr.io/montanadev/librarian:main
```

### Kubernetes

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: librarian-config
  labels:
    app: librarian
data:
  DATABASE_URL: 'postgresql://user:password@address/database'
  
---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: librarian
  labels:
    app: librarian
spec:
  selector:
    matchLabels:
      app: librarian
  replicas: 1
  template:
    metadata:
      labels:
        app: librarian
    spec:
      containers:
      - name: librarian
        image: ghcr.io/montanadev/librarian:main
        imagePullPolicy: Always
        envFrom:
          - configMapRef:
              name: librarian-config
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "256Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "2000m"
```

### Don't skip! Google Cloud Vision API

Librarian's OCR is performed by GCV -- it can't detect text without credentials. To get an API key:

1. Go to https://cloud.google.com/docs/authentication/getting-started
2. Follow the `Creating a service account > Cloud Console` instructions. Create a new project, if necessary.
3. Visit the [API library page](https://console.cloud.google.com/apis/library), search for `Cloud Vision API`
4. Enable the `Cloud Vision API` for the service account you just created
5. Go back to Librarian, click `Settings`, and paste the service account JSON key into the `Cloud Vision API Key` box

As of writing, each month the first 1k pages are free and each 1k pages after that are $1.60.

## Configuration

The only required environment variable is `DATABASE_URL`, which should be pointed at a working postgres instance. The rest are optional.

| Name | Default | Example | Description |
| --- | --- | --- | --- |
| DATABASE_URL | | postgresql://username:password@127.0.0.1/librarian | Database to store document metadata | 
| ALLOWED_HOSTS | * | localhost,my-site.com | Django setting ([more](https://docs.djangoproject.com/en/4.0/ref/settings/#allowed-hosts))
| SECRET_KEY | | | Django setting ([more](https://docs.djangoproject.com/en/4.0/ref/settings/#secret-key))
| ALLOW_REUPLOAD | false | | Set true to allow the same document to be reuploaded as unique documents |
| DISABLE_ANNOTATION | false | | Set to true if you don't like OCR and document search

## Security

It would be a real bad idea to put Librarian in a public environment.

Librarian doesn't (currently) require logins, or block anonymous access. I also haven't made XSS prevention and enforcing file types a priority. 

## Development

### Prerequisites

Tools used to build Librarian

* make
* [npm](https://www.npmjs.com/get-npm)
* python (>3.9)
* poetry
* [libnfs](https://github.com/sahlberg/libnfs)
* imagemagick

You can install some of these on macOS via Homebrew

```
$ brew install node python@3.9 poetry libnfs imagemagick 
```

For the backend

```bash
$ make migrate
$ make run
```

For the frontend

```bash
$ cd client
$ npm i
$ npm start
```

See [Makefile](Makefile) for additional commands.

### Scripts

Test uploads without drag-n-dropping on the frontend

```
$ curl 'http://0.0.0.0:8000/api/documents/home-title.pdf' -H 'Content-Type: application/pdf' --data-binary  '@home-title.pdf'
```

### Roadmap

See [roadmap.md](ROADMAP.md)
