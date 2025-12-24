.PHONY: format lint check dev dev-all dev-fresh build preview generate-api

dev-all:
	@trap 'kill 0' EXIT; npm run dev & npm run dev:docs

dev-fresh: generate-api
	@trap 'kill 0' EXIT; npm run dev & npm run dev:docs

generate-api:
	@echo "Regenerating API docs from OpenAPI spec..."
	@cp src/lib/fixtures/openapi.json docs/openapi.json
	@rm -rf docs/content/docs/api docs/.source docs/.next docs/openapi-processed.json
	@cd docs && node scripts/generate-api-docs.mjs

format:
	npm run format

lint:
	npm run lint

check:
	npm run check

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview
