# Build and Deploy a Redis Data Display Service

The `redis-ux` service extends the `authtest` Web application of the [Running Istio on Minikube locally](https://github.com/mikebway/k8s-istio-poc) project to
displaay the contents of selected key values from a Redis database.

The `redis-ux` service is built and deployed in exactly the same way as the `kn-grpc-ping` service.

# Build and manage with `make`

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/mfe2grpc`](../mfe2grpc)
directory.

The easiest way to build, start and manage the `redis-ux` Knative service is using `make`. Running `make` without any
parameters will display the following usage help:

```text
help               List of available commands
build              Build the authtest Docker container
deploy             Deploy the container as a pod/service in Kubernetes
undeploy           Destroy the deployment/pod/service in Kubernetes
start              Start the service
stop               Stop the service
run                Run the service locally
```

At a minimum, you will want to do the following:

```shell
# Build the docker image and push it to the Minikube package store 
make build

# Deploy and start the container as a service
makde deploy

# Update the Istio ingress gateway to add this service to the authtest application
kubectl apply -f virtual-service.yaml
```

## Build and manage the ~~hard~~ expert way

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/mfe2grpc`](../mfe2grpc)
directory.

In a terminal shell, run the following:

```shell
# Configure environment variables to instruct docker to target the Minikube
# package store
eval $(minikube docker-env)

# Build the docker container image
docker build -t dev.local/redis-ux:v1 .

# Create the Kubernetes service  
kubectl apply -f service.yaml

# Update the Istio ingress gateway to add this service to the authtest application
kubectl apply -f virtual-service.yaml
```

## Confirm that the service is running ok

Assumming that you have the `minikube tunnel` running, you should be able to hit http://example.com/data in your browser.
Unless, that is, you insist on using Chrome, in which case you will need to go to `http://\<your-system-name\>.local/data`.

But you can always use `curl` if you have added example.com to your `hosts` file:

```shell
curl -X GET http://example.com/data -H "Cookie: session=Mickey Mouse"
````

You should see something like this in the response:

```text
Host:		example.com
Path:		/data
Last path:	/data
Ping count:	3
```

If, after a minute or two, the `Ping count` line does not contain a count value then you have a problem with the 
deployment to debug.

## Making code changes

If you modify the source code and need to redeploy them without getting into the hassle of Kubernetes and Knative
versioning, first undeploy the service using ether:

```text
make undeploy
```

or

```text
kubectl delete -f deployment.yaml
```

Then rebuild and deploy again following the instructions at the top, above.

## Next ...

Its been useful to demonstrate access to our GraphQL and gRPC services from a browser and `curl` commands, but
we probably should not have such services be accessible from the public internet. The next step is to revert the
configuration that made this possible: [Removing public access to Knative services](private.md).