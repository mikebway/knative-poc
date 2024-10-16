.DEFAULT_GOAL := help
PROTO_FILES := $(wildcard api/v1/*.proto)
GENERATED_FILES := $(wildcard ping/*.go)

.PHONY: help
help: ## List of available commands
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: build
build: generate ## Build the ping server container in the Minikube package store
	eval $(minikube docker-env) &\
 	docker build -t dev.local/kn-grpc-ping:v1 .

.PHONY: deploy
deploy: ## Deploy the container as a Knative service
	eval $(minikube docker-env) &\
	kubectl apply -f kn-service.yaml

.PHONY: undeploy
undeploy: ## Destroy the deployment/pod/service in Kubernetes
	kubectl delete -f kn-service.yaml

.PHONY: run
run: ## Run the service locally
	go run .

.PHONY: generate
generate: ## Regenerate the protocol buffer gRPC Ping service definition
	protoc --go_out=. --go-grpc_out=. api/v1/ping.proto