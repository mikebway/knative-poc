.DEFAULT_GOAL := help

.PHONY: help
help: ## List of available commands
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: build
build: npm.installed ping.proto ## Build all of the GraphQL server container in the Minikube package store
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
run: npm.installed ping.proto ## Run the service locally with nodemon for auto reload
	NODE_ENV=test GRPC_SERVICE=localhost GRPC_PORT=50051 npx nodemon ./server.js

# Copy protobuf file into the node app runtime directory
ping.proto:
	cp ../grpc-ping/api/v1/ping.proto ./ping.proto

# Update the npm packages if necessary
npm.installed: package.json
	npm install
	touch npm.installed
