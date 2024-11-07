# Ping Event Source

[PingSource] is a sample Knative event source that is installed as a standard component of [Knative Eventing](https://knative.dev/docs/eventing/).

Quoting [Configure event source defaults](https://knative.dev/docs/eventing/configuration/sources-configuration/) from
the Knative documentation for PingSource:

> PingSource is an event source that produces events with a fixed payload on a specified cron schedule. For how to 
> create a new PingSource, see [Creating a PingSource object](https://knative.dev/docs/eventing/sources/ping-source/. 
> For the available parameters, see [PingSource reference](https://knative.dev/docs/eventing/sources/ping-source/reference/).

Unfortunately, none of the documentation is correct to the letter. To save you the hassle of debugging the details of
the YAML configuration necessary to establish a PingSource, you can execute the following command from the project
root directory:

```shell
kubectl apply -f pingsource/diect-sink.yaml
````

This will create a `PingSource` that sends a `cron` CloudEvent every minute directly to the [Ping Event Counter](svc-pingcount.md).

To verify that the `PingSource` is working as expected, allow a minute or two to elapse while using the following 
[stern](stern.md) command:

```shell
stern . -n kn-poc-eventing -E istio-proxy
```
The `istio-proxy` container logging can get a little noisy, so the `-E istio-proxy` option filters them out.

You should see a log entry every minute form the `ke-pingcount...` pod's `user-container` that looks something like 
this:

```text
☁️  cloudevents.Event
Context Attributes,
  specversion: 1.0
  type: dev.knative.sources.ping
  source: /apis/v1/namespaces/kn-poc-eventing/pingsources/ping-every-minute
  id: a3397760-98c7-444d-961a-e44a19bf0ecf
  time: 2024-10-22T09:53:00.409905116Z
  datacontenttype: application/text
Data,
  1 minute ping data
```

If you don't see these log entries, see if the following command provides any clues as to the problem:

```shell
kubectl get events -n kn-poc-eventing
```
Do check the age of the event log entry in the left most column to check that it is relevant to the recent actions 
you have taken.

## Next ...

Finally, we will deploy a [Redis Display](svc-redis.md) service to display the ping count.

