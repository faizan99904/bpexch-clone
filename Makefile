.PHONY: start
start:
	ng serve --port 4200

setup:
	corepack enable && \
	yarn set version 4.5.0 && \
	yarn install
