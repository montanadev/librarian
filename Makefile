.PHONY: run run-worker shell migrate makemigrations test test-coverage export-requirements

run:
	./manage.py runserver

run-worker:
	./manage.py worker

shell:
	./manage.py shell

migrate:
	./manage.py migrate

makemigrations:
	./manage.py makemigrations

collectstatic:
	./manage.py collectstatic

test:
	./manage.py test

test-coverage:
	coverage run ./manage.py test && coverage xml

export-requirements:
	poetry export -f requirements.txt --output requirements.txt --without-hashes
