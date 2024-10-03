# Running Knative on Minikube locally

## Objective

Demonstrate how Knative can be deployed and used on top of Minikube in an Apple Mac environment.

## Installation

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
  rem .minikube/profiles/minikube/.tunnel_lock
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

## Open questions

Do we need to do this?

```shell
kubectl label namespace knative-serving istio-injection=enabled
```

or this:

```shell
kubectl label namespace kn-poc-services istio-injection=enabled
kubectl label namespace kn-poc-eventing istio-injection=enabled
```


