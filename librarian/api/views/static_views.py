from django.shortcuts import render


def index(request, resource=None):
    if resource == "pdf.worker.js":
        return render(request, "build/" + resource, content_type='application/javascript')

    return render(request, "build/index.html")
