# This Makefile is based on the Makefile defined in the Python Best Practices repository:
# https://git.datapunt.amsterdam.nl/Datapunt/python-best-practices/blob/master/dependency_management/
#
# VERSION = 2020.01.29
.PHONY: app manifests

dc = docker compose
run = $(dc) run --rm

ENVIRONMENT ?= local
VERSION ?= latest
HELM_ARGS = manifests/chart \
	-f manifests/values.yaml \
	-f manifests/env/${ENVIRONMENT}.yaml \
	--set image.tag=${VERSION} \
	--set image.registry=${REGISTRY}

help:                               ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

requirements:
	npm i --package-lock-only

build:                              ## Build docker image
	$(dc) build

push:                               ## Push docker image to registry
	$(dc) push

test:                               ## Execute tests
	# TODO

dev:
	$(dc) up

clean:                              ## Clean docker stuff
	$(dc) down -v --remove-orphans

env:                                ## Print current env
	env | sort

trivy: 								## Detect image vulnerabilities
	$(dc) build --no-cache api
	trivy image --ignore-unfixed localhost:5000/opdrachten/openstad-image:latest