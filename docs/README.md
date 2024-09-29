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
