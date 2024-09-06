install-deps:
	npm install

copy-envs:
	cp .env.example .env

setup-local:
	@$(MAKE) install-deps
	@$(MAKE) copy-envs

run-local-infra:
	docker compose -f ../infra/local/docker-compose.yaml --project-name lottery up -d mysql

sync-db:
	npm run build && npm run typeorm migration:run

format:
	npm run format
