# Build and Deploy the `kn-graphql` Knative Service

The `kn-graphql` service is a minimal Graphql service that includes a Graphiql user interface. 

The service is deployed to an `kn-poc-services` namespace, exposing port 4000.

## Prerequisites

Building and deploying the `kn-graphql` Knative service assumes that you have already completed all the steps 
outlined in [Install Knative on Minikube locally](Installation.md) with Minikube started and its TCP tunnel open.

## Build and manage with `make`

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/graphql`](../kn-graphql)
directory.

The easiest way to build, start and manage the `kn-graphql` Knative service is using `make`. Running `make` without any
parameters will display the following usage help:

```text
help          List of available commands
build         Build all of the GraphQL server container in the Minikube package store
deploy        Deploy the container as a Knative service
undeploy      Destroy the deployment/pod/service in Kubernetes
```

At a minimum, you will want to do the following:

```shell
# Build the docker image and push it to the Minikube package store 
make build

# Deploy and start the container as a service
makde deploy
```

## Build and manage the ~~hard~~ expert way 

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/graphql`](../kn-graphql)
directory.

In a terminal shell, run the following:

```shell
# Configure environment variables to instruct docker to target the Minikube
# package store
eval $(minikube docker-env)

# Ensure that all the required npm packages are present
npm install

# Build the docker container image
docker build -t kn-graphql:v1 .

# Create the Knative service  
kubectl apply -f kn-service.yaml
```

## Confirm that the service is known to Knative Serving

Run the following:

```shell
kn service list -n kn-poc-services
```

You should see something like this:

```shell
NAME      URL                                                LATEST   AGE   CONDITIONS   READY   REASON
graphql   http://graphql.kn-poc-services.svc.cluster.local            12s   0 OK / 3     False   RevisionMissing : Configuration "graphql" does not have any ready Revision.
```
