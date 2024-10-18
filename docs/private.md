# Removing public access to Knative services

Having Knative services accessible from the public internet is not, generally speaking, a good idea. 

You can label an individual Knative service to restrict access to only within the cluster (see [Configuring private Services](https://knative.dev/docs/serving/services/private-services/)), 
but the default is public access. Sooner or later someone will forget to apply the label for their service and it
might be publically accessible for months before anyone notices.

**Bottom line:** If you don't want to ever have Knative Services accessible from the public internet, don't 
make the Knative Serving `config-domain` and `config-istio` ConfigMap changes that we made following the initial
[Install Knative on Minikube locally](Installation.md) instructions. That allowed us to verify everything was working from
a browser or `curl` command line but we would not do that in a production environment.

To revert the Istio ingress gateway configuration to its original state, perform the following three steps.

### 1. Revert the `config-domain` ConfigMap patch

Revert the patch applied from the [patch-config-domain.yaml](../patch-config-domain.yaml) file by editing 
the Knative Serving `config-istio` ConfigMap:

```shell
kubectl edit configmap/config-domain -n knative-serving
```

Then finding an deleting the line that contains the `kn.com` domain:

```yaml
  kn.com: ""
```

### 2. Revert the `config-istio` ConfigMap patch

Revert the patch applied from the [patch-config-istio.yaml](../patch-config-istio.yaml) file by editing
the Knative Serving `config-istio` ConfigMap:

```shell
kubectl edit configmap/config-istio -n knative-serving
```

Then finding an deleting the following lines:

```yaml
  external-gateways: |
    - name: knative-ingress-gateway
      namespace: knative-serving
      service: istio-ingressgateway.istio-system.svc.cluster.local
```

### 3. Restart the Istio ingress gateway

The configuration changes made to the `config-istio` ConfigMap are not propagated to the Istio ingress gateway;
it has to be restarted. This can be done without disrupting service (check before trusting assertion) by the 
following command:

```shell
kubectl rollout restart deployment istio-ingressgateway -n istio-system
```

### Verify that the changes have taken effect

Hitting the Knative GraphQL with the following `curl` command should now fail:

```shell
curl -X POST http://localhost/graphql -i \
  -H "Host: graphql.kn-poc-services.kn.com" \
  -H "Cookie: session=Mickey Mouse" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ ping(message: \"Pinging you\") }"}'
```

The `-i` option causes the headers to be displayed in the response. The response should include a `404 Not Found` 
status like this:

```text
HTTP/1.1 404 Not Found
date: Fri, 18 Oct 2024 16:31:17 GMT
server: istio-envoy
connection: close
content-length: 0
```