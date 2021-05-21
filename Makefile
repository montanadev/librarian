.PHONY: run migrate makemigrations format

run:
	poetry run ./manage.py runserver

migrate:
	poetry run ./manage.py migrate

makemigrations:
	poetry run ./manage.py makemigrations

format:
	poetry run black .