.PHONY: run rum-worker migrate makemigrations test test-cover

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

test-cover:
	poetry run coverage run ./manage.py test && coverage xml
