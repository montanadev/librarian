.PHONY: run rum-worker migrate makemigrations test test-coverage

run:
	poetry run ./manage.py runserver

run-worker:
	poetry run ./manage.py worker

migrate:
	poetry run ./manage.py migrate

makemigrations:
	poetry run ./manage.py makemigrations

test:
	poetry run ./manage.py test

test-coverage:
	poetry run coverage run ./manage.py test && poetry run coverage xml
