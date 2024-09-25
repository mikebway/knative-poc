# Running Knative on Minikube locally

## Objective

Demonstrate how Knative can be deployed on top of Minikube in an Apple Mac environment.

## Prerequisites

As a baseline, this project assumes that you have already followed the instructions for 
[Running Istio on Minikube locally](https://github.com/mikebway/k8s-istio-poc) and have that configuration up and
running.

While this project can be used as a rough map for Windows and Linux installation, it's primary audience is 
Mac users. As a Mac user, it is assumed that have [Homebrew](https://brew.sh/) installed.

You should familiarize yourself with the basic architecture of Knative before starting. That way you will have a
better sense for what each of the steps is accomplishing. A quick scan of the following will get you started:

* [Knative Serving Overview](https://knative.dev/docs/serving/)
* [Knative Service Architecture](https://knative.dev/docs/serving/architecture/)
* [Knative Request Flow](https://knative.dev/docs/serving/request-flow/)

## Installation

The two primary mechanisms to install Knative are via [YAML files alone](https://knative.dev/docs/install/yaml-install/) 
or through a [Kubernetes Operator](https://knative.dev/docs/install/operator/knative-with-operators/). For simplicity,
we have used the operator approach. 

Installing Knative into a managed Kubernetes cluster, e.g. GKE on Google Cloud, is likely to follow a different process.
For example, see [Installing Knative serving on Google Cloud](https://cloud.google.com/kubernetes-engine/enterprise/knative-serving/docs/install/on-gcp).

### Support tools

* [`cosign`](https://docs.sigstore.dev/cosign/system_config/installation/) for cryptographic signature verification;
  not essential, only needed if you want to verify downloads have not been tampered with before downloading them.
  ```shell
  brew install cosign
  ```
* [jq](https://jqlang.github.io/jq/download/) for command line JSON processing.
  ```shell
  brew install jq
  ```
  
* The [Modify Header Value (HTTP Headers)](https://chromewebstore.google.com/detail/modify-header-value-http/cbdibdfhahmknbkkojljfncpnhmacdek)
  Chrome browser extension. This will allow you to set the `Host` header on your browser requests to something other
  than `localhost` in order to have Knative Serving recognize the request and trigger a matching on-demand service.


### Install the Knative CLI

See the [Installing the Knative CLI documentation](https://knative.dev/docs/client/install-kn/) for alternative
installation methods for `kn`, otherwise the Homebrew command is: 

```shell
brew install knative/client/kn
```

### Install Knative using the Knative Operator

Check for the latest release version of Knative [here](https://github.com/knative/serving/releases) and replace the
`v1.15.4` strings in the following as appropriate.

```shell
# Replace v1.15.4 with the appropriate, more recent version string as necessary
kubectl apply -f https://github.com/knative/operator/releases/download/knative-v1.15.4/operator.yaml
```

The above will install Knative in the `knative-operator` namespace (at the time of writing, the official [documentation](https://knative.dev/docs/install/operator/knative-with-operators/#verify-your-knative-operator-installation)
wrongly states that the operator gets deployed to the `default` namespace; ignore that).

Verify deployment with this:

```shell
kubectl get deployment -n knative-operator
```

You should see two entries:

```text
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
knative-operator   1/1     1            1           2m22s
operator-webhook   1/1     1            1           2m22s
```
Should you wish to revert to naked Minikube, sans Knative Serving, exectute the following after reverting all later
steps:

```shell
# Replace v1.15.4 with the appropriate, more recent version string as necessary
kubectl delete -f https://github.com/knative/operator/releases/download/knative-v1.15.4/operator.yaml
```

**Be warned:** this can take several minutes to complete; be patient.

### Enable Knative Serving & Eventing

Establish the `knative-serving` and `knative-eventing` namespaces, and the `knative-serving` and `knative-eventing` 
resource types:

```shell
kubectl apply -f namespace-kind.yaml
```

If you started with the Minikube configuration described by the [Running Istio on Minikube locally](https://github.com/mikebway/k8s-istio-poc)
project then the external IP address of your Istio ingress gateway will be 127.0.0.1. If you followed some other path
to set up your local Kubernetes test cluster with Istio, run the following and record the **EXTERNAL-IP** address
value that is displayed:

```shell
kubectl get svc istio-ingressgateway -n istio-system
```

#### Verify the Knative Serving deployment

Run this and that confirm that you see out put similar to that show after the command:

```shell
kubectl get deployment -n knative-serving
```

... which should show something like this:

```text
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
activator              1/1     1            1           52s
autoscaler             1/1     1            1           51s
autoscaler-hpa         1/1     1            1           50s
controller             1/1     1            1           51s
net-istio-controller   1/1     1            1           48s
net-istio-webhook      1/1     1            1           47s
webhook                1/1     1            1           50s
```

#### Verify the Knative Eventing deployment

Run this and that confirm that you see out put similar to that show after the command:

```shell
kubectl get deployment -n knative-eventing
```

... which should show something like this:

```text
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
eventing-controller     1/1     1            1           51s
eventing-webhook        1/1     1            1           49s
imc-controller          1/1     1            1           46s
imc-dispatcher          1/1     1            1           45s
job-sink                1/1     1            1           50s
mt-broker-controller    1/1     1            1           43s
mt-broker-filter        1/1     1            1           44s
mt-broker-ingress       1/1     1            1           43s
pingsource-mt-adapter   0/0     0            0           50s
```




