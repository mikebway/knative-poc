# Ping Event Counter (event sink)

This service listens for `cron` ping CloudEvents and maintains a count of the number of events received. The count is 
stored in Redis under the `pingCount` key.

Events are sourced from the Knative sample [Ping Event Source](ping-source.md).

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
```

At a minimum, you will want to do the following:

```shell
# Build the docker image and push it to the Minikube package store 
make build

# Deploy and start the container as a service
makde deploy
```

## Build and manage the ~~hard~~ expert way

**IMPORTANT:** The following assumes that your current working directory is the [`knative-poc/grpc-ping`](../grpc-ping)
directory.

In a terminal shell, run the following:

```shell
# Configure environment variables to instruct docker to target the Minikube
# package store
eval $(minikube docker-env)

# Build the docker container image
docker build -t dev.local/ke-pingcount:v1 .

# Create the Knative service  
kubectl apply -f ke-service.yaml
```

**IMPORTANT:** The `dev.local/` prefix of the `ke-pingcount` image tag is required for Knative Serving to recognize
that the container image is to be found in the local Minikube registry and not in the default `docker.io` registry.

## Confirm that the service is known to Knative Serving

Run the following:

```shell
kn service list -n kn-poc-eventing
```

You should see something like this:

```text
NAME           URL                                                     LATEST               AGE   CONDITIONS   READY   REASON
ke-pingcount   http://ke-pingcount.kn-poc-eventing.svc.cluster.local   ke-pingcount-00001   8s    3 OK / 3     True
```

Now run this:

```shell
kubectl get revision -n kn-poc-eventing
```

You should see something like this:

```text
NAME                 CONFIG NAME    GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
ke-pingcount-00001   ke-pingcount   1            True             0                 0
```

If you see something like this instead, follow the same diagnostic process as described in the **Troubleshooting** 
section for the [kn-grpc-ping](svc-grpc.md) service. Just be sure to substitute the `kn-poc-eventing` namespace for the
`kn-poc-services` namespace.

```text
NAME                 CONFIG NAME    GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
ke-pingcount-00001   ke-pingcount   1            False   ContainerMissing
```
