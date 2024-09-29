.DEFAULT_GOAL := help

.PHONY: help
help: ## List of available commands
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: build
build: npm.installed ## Build all of the GraphQL server container in the Minikube package store
	eval $(minikube docker-env) &\
 	docker build -t kn-graphql:v1 .

.PHONY: deploy
deploy: ## Deploy the container as a Knative service
	eval $(minikube docker-env) &\
	kubectl apply -f kn-service.yaml

.PHONY: undeploy
undeploy: ## Destroy the deployment/pod/service in Kubernetes
	kubectl delete -f kn-service.yaml

# Update the npm packages if necessary
npm.installed: package.json
	npm install
	touch npm.installed
