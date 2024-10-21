.PHONY: help
help: ## List of available commands
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: build
build: ## Build the authtest Docker container
	eval $(minikube docker-env) &\
 	docker build -t dev.local/ke-pingcount:v1 .

.PHONY: deploy
deploy: ## Deploy the container as a pod/service in Kubernetes
	eval $(minikube docker-env) &\
	kubectl apply -f ke-service.yaml

.PHONY: undeploy
undeploy: ## Destroy the deployment/pod/service in Kubernetes
	kubectl delete -f ke-service.yaml

.PHONY: run
run: ## Run the service locally assuming that will listen on port 8080
	go run .


