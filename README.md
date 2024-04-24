# Sample Node.js application

This repository is a sample Node.js application for Docker's documentation.


docker run -d --name some-postgres -e POSTGRES_PASSWORD=123 -e PGDATA=/var/lib/postgresql/data/pgdata -e POSTGRES_DB=lib postgres