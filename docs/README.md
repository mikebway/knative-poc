# Running Knative on Minikube locally

## Objective

Demonstrate how [Knative](https://knative.dev/docs/) can be deployed and used on top of Minikube in an Apple Mac environment.

## Knative installation

Follow the instructions here: [Install Knative on Minikube locally](Installation.md)

**WARNING:** The completed installation entails the startup of more than 70 service containers, this can take more than 
a few seconds. If any step fails with some difficult to explain error, wait a few beats (even quite a lot of beats) and
try again.

## Reminders & dashboards

* Don't forget to start the TCP tunnel that connects localhost port 80 to the cluster:
  ```shell
  minikube tunnel
  ```
  If you get an error starting the tunnel to the effect `... another tunnel is already running ...` when you 
  don't have the tunnel in another shell window, delete the local file found at:
  ```shell
  rm ~/.minikube/profiles/minikube/.tunnel_lock
  ```
  If you close a shell window without Ctrl-C shutting down an open tunnel, the lock file can be left in place even
  though the tunnel is not running.
* Don't forget to specify namespaces with using `kn` to list or manage Knative Serving:
  ```shell
  kn service list -n kn-poc-services
  ```
* You can open the Kubernetes dashboard web console with:
  ```shell
  minikube dashboard
  ```
  To obtain the dashboard URL and open the browser for yourself, add the `-url` option: 
  ```shell
  minikube dashboard -url
  ```
* You can view the Istio service mesh status and maps using the Kiali:
  ```shell
  istioctl dashboard kiali
  ```
* You can follow the ingress gateway logs with the following command:
  ```shell
  kubectl logs -l app=istio-ingressgateway -n istio-system -f
  ```
* Install and use the `stern` tool to monitor the logs of all services in one terminal shell: see [Using `stern`](stern.md).

## Doing some Knative Serving

* Deploy and run a GraphQL service using Knative Serving: [GraphQL service](svc-graphql.md).
* Deploy and run a gRPC service using Knative Serving from the Knative GraphQL service: [gRPC service](svc-grpc.md); 
  i.e. a Knative service calling Knative service.
* Demonstrate calling a Knative gRPC service from a non-Knative service: [ping web page](svc-mfe2grpc.md).

## Starting with Knative Eventing

* Deploy a CloudEvent consumer: [Ping Event Counter](svc-pingcount.md) to maintain a count of `cron` ping events in Redis.
* Deploy a CloudEvent source: [Ping Event Source](svc-pingsource.md) to generate `cron` ping events.
* Deploy a Web page service to display the ping count: [Redis Display](svc-redis.md).

## Brokering events

---diff
- UNDER CONSTRUCTION
-
- This section has not yet been written. 
---

* Mediate between event sources and consumers with a broker: [Event Broker](event-broker.md).