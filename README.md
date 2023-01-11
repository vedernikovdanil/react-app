# BUILD

## production

`docker compose up --build`

or

`make prod`

## development

`docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

or

`make dev`

# START

After build and run on your server you can use this link http://127.0.0.1:8000

default port: 8000

> Adapted for mobile devices (use server host to try)
