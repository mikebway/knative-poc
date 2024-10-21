# Using `stern`

The `stern` tool is a multi-container log tailing tool. It is useful for monitoring the logs of multiple containers in a
Kubernetes pod. It is particularly useful for monitoring the logs of Knative services since it tracks the instantiation
of new pods and the deletion of old pods, providing continuous log monitoring as the Knative service scales up and down.

## Installation

```shell
brew install stern
```

## Usage

The Medium article [Unlocking Kubernetes Logs with Stern tool: Real-Time Monitoring and Incident Management](https://medium.com/@aruns89/unlocking-kubernetes-logs-with-stern-tool-real-time-monitoring-and-incident-management-30c5ab5906e6)
provides a helpful overview of the `stern` tool.

The following command will tail the logs of all pods across your entire Minikube cluster: 

```shell
stern . -A --tail 1 --max-log-requests 300
```

The `.` matches all services while the `--tail 1` option will show only the last log line for each container in each
pod. Without `--tail 1`, your screen would scroll for a long time to catch up with hundreds of lines from each log file.

The `--max-log-requests 300` option ovverides the default of 100 log lines in a single pull. This is essential since, 
even on our small cluster, the initial log pull can exceed 100 lines across all containers.