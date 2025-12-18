.PHONY: format lint check dev dev-all build preview

dev-all:
	@trap 'kill 0' EXIT; npm run dev & npm run dev:docs

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
