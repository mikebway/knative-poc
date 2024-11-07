# Build and Deploy the `kn-grpc-ping` Knative Service

The `kn-grpc-ping` service is a simple gRPC service that the `kn-graphql` service can call. The `kn-grpc-ping` service 
is written in Go to provide two methods: a `Ping` request returning  a "pong" response. And a streaming version of the
same method that returns a stream of "pong" responses.

The `kn-grpc-ping` service is built and deployed in much the same way as the `kn-graphql` service. 

# Build and manage with `make`

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/grpc-ping`](../grpc-ping)
directory.

The easiest way to build, start and manage the `kn-grpc-ping` Knative service is using `make`. Running `make` without any
parameters will display the following usage help:

```text
help                           List of available commands
build                          Build the ping server container in the Minikube package store
deploy                         Deploy the container as a Knative service
undeploy                       Destroy the deployment/pod/service in Kubernetes
run                            Run the service locally
generate                       Regenerate the protocol buffer gRPC Ping service definition
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

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/grpc-ping`](../grpc-ping)
directory.

In a terminal shell, run the following:

```shell
# Configure environment variables to instruct docker to target the Minikube
# package store
eval $(minikube docker-env)

# Build the docker container image
docker build -t dev.local/kn-grpc-ping:v1 .

# Create the Knative service  
kubectl apply -f kn-service.yaml
```

## The `dev.local` image prefix

The `dev.local/` prefix of the `kn-graphql` image tag in the [`Dockerfile`](../graphql/Dockerfile) is required for
Knative Serving to recognize that the container image is to be found in the local Minikube registry and not in the
default `docker.io` registry.

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
NAME        URL                                       LATEST            AGE     CONDITIONS   READY   REASON
graphql     http://graphql.kn-poc-services.kn.com     graphql-00001     8m57s   3 OK / 3     True
grpc-ping   http://grpc-ping.kn-poc-services.kn.com   grpc-ping-00001   33s     3 OK / 3     True
```

Now run this:

```shell
kubectl get revision -n kn-poc-services
```

You should see something like this:

```text
NAME              CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
graphql-00001     graphql       1            True             0                 0
grpc-ping-00001   grpc-ping     1            True             0                 0
```

If you see something like this instead, see **Troubleshooting** below.

```text
NAME              CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
graphql-00001     graphql       1            True             0                 0
grpc-ping-00001   grpc-ping     1            False   ContainerMissing
```

### Troubleshooting

If you don't see what you expect and some type of error is indicated, then you can get more details with:

```shell
kubectl get revision -n kn-poc-services -o yaml
```

Most likely, your issue will be with one of these conditions:

* The `dev.local/kn-grpc-ping:v1` container image is not present in the Minikube container registry.
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

## Testing with gRPCurl

If you have followed the Knative Service installation steps in sequence up to this point, the `kn-grpc-ping` service 
should be accessible from outside of the Minikube cluster via the Istio ingress gateway. You should be able to invoke
the `Ping` method using a `grpccurl` command, but first you will need to add `grpc-ping.kn-poc-services.kn.internal` to
your `/etc/hosts` file:

```text
127.0.0.1       grpc-ping.kn-poc-services.kn.internal
```

Now you can try to hit the `Ping` method with the following command from the [`grpc-ping`](../grpc-ping) directory:

```shell
grpcurl -import-path api/v1 -proto ping.proto \
  -plaintext \
  -H 'Cookie: session=Salvador-Dali' \
  -d '{"msg": "Pinging you"}' \
  grpc-ping.kn-poc-services.kn.internal:80 \
  ping.PingService/Ping
```

You should get a response that looks like this:

```json
{
  "msg": "Pinging you again - pong (subject: Salvador-Dali)"
}
```

The GraphQL service has a query method that invokes the `kn-grpc-ping` service. You can test this with the following 
`curl` command:

```shell
curl -X POST http://example.com/graphql \
  -H "Cookie: session=Mickey Mouse" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ ping(message: \"Pinging you\") }"}'
```

### Whats with the `-import-path api/v1 -proto ping.proto` stuff?

**gRPCurl** needs to know the service definition in order to format its request and understand the response. By default,
**gRPCurl** expects the gRPC service to support reflection to provide the Protocol Buffer schema but the `kn-grpc-ping`
service does not support reflection. 

The `-import-path` and `-proto` flags allow **gRPCurl** to load the service definition from the source `ping.proto` file.

## Making code changes

If you modify the source code and need to redeploy them without getting into the hassle of Kubernetes and Knative
versioning, first undeploy the service using `make undeploy` or `kubectl delete -f kn-service.yaml`. The rebuild and
and deploy again following the instructions at the top, above.

## Next ...

Now we want to demonstrate calling the Knative `kn-grpc-ping` service from a non-Knative front-end service
See [Build and Deploy the `mfe2grpc` Knative Service](svc-mfe2grpc.md).


