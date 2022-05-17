.PHONY: run run-worker shell migrate makemigrations test test-coverage

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
