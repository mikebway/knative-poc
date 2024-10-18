# Build and Deploy the `mfe2grpc` Knative Service

The `mfe2grpc` extends the `authtest` Web application of the [Running Istio on Minikube locally](https://github.com/mikebway/k8s-istio-poc) project to 
demonstrate calling a Knative gRPC service (the [`kn-grpc-ping`](svc-grpc.md) service) from a non-Knative 
front-end service. 

The `mfe2grpc` service is built and deployed in exactly the same way as the `kn-grpc-ping` service. 

# Build and manage with `make`

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/mfe2grpc`](../mfe2grpc)
directory.

The easiest way to build, start and manage the `kn-mfe2grpc` Knative service is using `make`. Running `make` without any
parameters will display the following usage help:

```text
help               List of available commands
build              Build the authtest Docker container
deploy             Deploy the container as a pod/service in Kubernetes
undeploy           Destroy the deployment/pod/service in Kubernetes
start              Start the service
stop               Stop the service
run                Run the service locally assuming that the gRPC Ping service is at port 50051
```

At a minimum, you will want to do the following:

```shell
# Build the docker image and push it to the Minikube package store 
make build

# Deploy and start the container as a service
makde deploy
```

You will not need to run `make generate` because the generated Go code is already included in the repository. If you 
change the protocol buffer definition in the `proto/ping.proto` file, you will then need to regenerate the Go code with
`make generate`.

## Build and manage the ~~hard~~ expert way

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/mfe2grpc`](../mfe2grpc)
directory.

In a terminal shell, run the following:

```shell
# Configure environment variables to instruct docker to target the Minikube
# package store
eval $(minikube docker-env)

# Build the docker container image
docker build -t dev.local/kn-mfe2grpc:v1 .

# Create the Knative service  
kubectl apply -f kn-service.yaml
```

## Confirm that the service is running ok

Assumming that you have the `minikube tunnel` running, you should be able to hit the following URL in your browser:

* http://<your-system-name>.local/ping

Or use `curl`:

```shell
curl -X GET http://localhost/ping \
  -H "Host: knative-demo.local" \
  -H "Cookie: session=Mickey Mouse" \
  -H "Content-Type: application/json" 
````

You should see something like this in the response:

```text
Host:		"knative-demo.local"
Path:		"/ping"
Count:		1
gRPC Ping:	"ping - pong (subject: Mickey Mouse)"
```

The the `gRPC Ping:` line does not contain `(subject: ...)` then you have a problem with the deployment to debug.

## Making code changes

If you modify the source code and need to redeploy them without getting into the hassle of Kubernetes and Knative
versioning, first undeploy the service using ether:

```text
make undeploy
```

or

```text
kubectl delete -f kn-service.yaml`
```

Then rebuild and deploy again following the instructions at the top, above.

## Next ...

Its been useful to demonstrate access to our GraphQL and gRPC services from a browser and `curl` commands, but 
we probably should not have such services be accessible from the public internet. The next step is to revert the 
configuration that made this possible: [Removing public access to Knative services](private.md).