.PHONY: run

run:
	docker compose up -d

dev:
	docker compose -f docker-compose.dev.yml up -d && docker compose logs -f

npm-ci:
	docker compose run --rm nodecg npm ci