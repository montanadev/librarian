## Librarian

On OSX, need to install libnfs, imagemagick

```
$ brew install libnfs imagemagick
```

To test uploads without the frontend, use
```
$ curl 'http://0.0.0.0:8000/api/documents/home-title.pdf' -H 'Content-Type: application/pdf' --data-binary  '@home-title.pdf'
```

## Known issues

### Viewer performance

Perf is pretty bad on PDFs >10 pages. Probably need a virtualized list https://github.com/michaeldzjap/react-pdf-sample

### Images not supported

Only PDFs are supported -- jpg/png should also be accepted.

### No search

GCV 