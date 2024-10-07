.DEFAULT_GOAL := help

.PHONY: help
help: ## List of available commands
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: build
build: npm.installed ## Build all of the GraphQL server container in the Minikube package store
	eval $(minikube docker-env) &\
 	docker build -t dev.local/kn-graphql:v1 .

.PHONY: deploy
deploy: ## Deploy the container as a Knative service
	eval $(minikube docker-env) &\
	kubectl apply -f kn-service.yaml

.PHONY: undeploy
undeploy: ## Destroy the deployment/pod/service in Kubernetes
	kubectl delete -f kn-service.yaml

.PHONY: run
run: npm.installed ## Run the service locally with nodemon for auto reload
	GRPC_SERVICE=grpc-ping.kn-poc-services.kn.com PORT=80 npx nodemon ./server.js

.PHONY: protobuf
protobuf: npm.installed ## Regenerate the protocol buffer gRPC Ping service definition
	npx pbjs -t static-module -w commonjs -o gen/grpc-ping.cjs ../grpc-ping/proto/*.proto

# Update the npm packages if necessary
npm.installed: package.json
	npm install
	touch npm.installed
