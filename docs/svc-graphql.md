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
docker build -t dev.local/kn-graphql:v1 .

# Create the Knative service  
kubectl apply -f kn-service.yaml
```

**IMPORTANT:** The `dev.local/` prefix of the `kn-graphql` image tag is required for Knative Serving to recognize
that the container image is to be found in the local Minikube registry and not in the default `docker.io` registry.

Deploying containers to Minikube outside of Knative Serving does not require this prefix; Minikube naturally assumes
that an unadorned image reference is for the Minikube registry if that addon has been installed. Knative does not
know that it is running under Minikube and behaves as it would when running in any normal Kubernetes cluster.

## Confirm that the service is known to Knative Serving

Run the following:

```shell
kn service list -n kn-poc-services
```

You should see something like this:

```text
NAME      URL                                     LATEST          AGE     CONDITIONS   READY   REASON
graphql   http://graphql.kn-poc-services.kn.com   graphql-00001   8m57s   3 OK / 3     True
```

If you see something like this instead, see **Troubleshooting** below.

```text
NAME      URL                                                LATEST   AGE   CONDITIONS   READY   REASON
graphql   http://graphql.kn-poc-services.svc.cluster.local            12s   0 OK / 3     False   RevisionMissing : Configuration "graphql" does not have any ready Revision.
```

Now run this:

```shell
kubectl get revision -n kn-poc-services
```

You should see something like this:

```text
NAME            CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
graphql-00001   graphql       1            True             0                 0
```

If you see something like this instead, see **Troubleshooting** below.

```text
NAME            CONFIG NAME   GENERATION   READY   REASON             ACTUAL REPLICAS   DESIRED REPLICAS
graphql-00001   graphql       1            False   ContainerMissing
```

## Troubleshooting

If you don't see what you expect and some type of error is indicated, then you can get more details with:

```shell
kubectl get revision -n kn-poc-services -o yaml
```

Most likely, your issue will be with one of these conditions:

* The `dev.local/kn-graphql:v1` container image is not present in the Minikube container registry.
* Knative Serving has not been instructed to ignore digest validation of containers in the `dev.local` registry.

You may be able to learn more from the logs of the Knative Server `controller` pod. List the pods in the `knative-serving`
namespace to find the instance name for the controller pod:

```shell
kubectl get pod -n knative-serving
```

Then substitute for the `controller-67c77bd44d-mr8gl` instance name in this (the optional `-f` causes the log to be followed rather 
than just dumping the most recent entries):

```shell
kubectl logs -n knative-serving controller-67c77bd44d-mr8gl -f
```

