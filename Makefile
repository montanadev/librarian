.PHONY: run migrate makemigrations format

run:
	poetry run ./manage.py runserver

run-worker:
	echo $(ls /etc/) && cp policy.xml /etc/ImageMagick-7/policy.xml && poetry run ./manage.py worker

migrate:
	poetry run ./manage.py migrate

makemigrations:
	poetry run ./manage.py makemigrations

test:
	poetry run ./manage.py test
