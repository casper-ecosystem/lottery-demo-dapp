build-client-docker:
	docker build -f infra/docker/client.dockerfile -t lottery-client .

build-api-docker:
	docker build -f infra/docker/api.dockerfile -t lottery-api .

build-event-handler-docker:
	docker build -f infra/docker/event-handler.dockerfile -t lottery-event-handler .
