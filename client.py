import requests


def update_database():
    my_data = {
        'gcvKey': 'my better gcv key!',
        'storageOption': 'my better storage!',
        'djangoSecretKey': 'my better secret key!'
    }

    requests.post("http://localhost:8000/api/config/", json=my_data)


def get_data():
    response = requests.get("http://localhost:8000/api/config/read")
    print(response.json())
