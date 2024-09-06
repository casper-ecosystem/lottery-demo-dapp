build-client-docker:
	docker build -f infra/docker/client.dockerfile -t lottery-client .

build-api-docker:
	docker build -f infra/docker/api.dockerfile -t lottery-api .

build-event-handler-docker:
	docker build -f infra/docker/event-handler.dockerfile -t lottery-event-handler .

setup:
	cp ./server/.env.example ./server/.env

build-demo:
	docker compose -f infra/local/docker-compose.yaml --project-name lottery build

run-demo:
	docker compose -f infra/local/docker-compose.yaml --project-name lottery up -d

stop-demo:
	docker compose -f infra/local/docker-compose.yaml --project-name lottery down

prune-demo:
	docker compose -f infra/local/docker-compose.yaml --project-name lottery down -v
