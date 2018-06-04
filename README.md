# Kubernetes Tutorial

A repo to contain notes and examples from taking the Kubernetes Basics tutorial on the Kubernetes website.

These notes will hopefully demonstrate how to install, configure and run Kubernetes on a workstation running linux (specifically Ubuntu 18.04).

## Installation

In order to run Kubernetes on a workstation running Linux, you will need to install Minikube.

In order to install Minikube, you first need to install a couple of prerequisites.

### Minikube Prerequisites

1.  A Hypervisor (VirtualBox, KVM, etc.)
2.  kubectl

For the Hypervisor prerequisite, I installed VirtualBox (5.2.12 for Ubuntu 18.04) from the [VirtualBox download page](https://www.virtualbox.org/wiki/Linux_Downloads).

For the kubectl prerequisite, I had to execute a few shell commands, per the [Kubernetes kubectl installation page](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

#### tldr

```sh
sudo apt update

sudo apt install apt-transport-https

sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

# create kubernetes.list in /etc/apt/sources/list.d/ with the following line:
# deb http://apt.kubernetes.io/ kubernetes-xenial main

sudo apt update

sudo apt install kubectl
```

Once you have kubectl installed you can verify that it is installed correctly

```sh
kubectl cluster-info
```

NOTE: If you haven't yet installed Minikube (next step), you'll likely get an error message similar to the following:

`The connection to the server <server-name:port> was refused - did you specify the right host or port?`

### Minikube

Since I'm installing things on Ubuntu, I downloaded the .deb package (v0.27.0) from the [Minikube GitHub page here](https://github.com/kubernetes/minikube/releases).

Once Minikube is installed we should be able to start it up, which should download a VM to house the Kubernetes cluster. On my Ubuntu workstation, the .ISO for the VM as well as other settings are all stored in `~/.minikube`.

```sh
minikube start

minikube get-k8s-versions

kubectl cluster-info
```

This time, if you run cluster-info, you should see information about the Kubernetes master and the KubeDNS.

```sh
Kubernetes master is running at https://XXX.XXX.XXX.XXX:8443
KubeDNS is running at https://XXX.XXX.XXX.XXX:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

## Verification

### hello-minikube (echoserver)

In order to verify that everything is installed and configured correctly, we can run through a very simple example, outlined in the [Kubernetes getting started guide](https://kubernetes.io/docs/getting-started-guides/minikube/).

```sh
kubectl run hello-minikube --image=k8s.gcr.io/echoserver:1.10 --port=8080

kubectl expose deployment hello-minikube --type=NodePort

kubectl get pod

curl $(minikube service hello-minikube --url)
```

The information returned by the curl statement should look something like this.

```sh
Hostname: hello-minikube-77c777b68cff-dg7gs

Pod Information:
  -no pod information available-

Server values:
  server_version=nginx: 1.13.3 - lua: 10008

Request Information:
  client_address=XXX.XXX.XXX.XXX
  method=GET
  real path=/
  query=
  request_version=1.1
  request_scheme=http
  request_url=http://XXX.XXX.XXX.XXX:8080

Request Headers:
  accept=*/*
  host=XXX.XXX.XXX.XXX:30038
  user-agent=curl/7.58.0

Request Body:
  -no body in request-
```

And then once you have completed this simple verification you can clean things up.

```sh
kubectl delete services hello-minikube

kubectl delete deployment hello-minikube
```

Finally, you can stop the Minikube altogether once you are done.

```sh
minikube stop
```

### hello-node

#### Create a HelloWorld node.js application

Create a file called `server.js` and add the following Javascript to it.

```javascript
var http = require('http');

var handleRequest = (request, response) => {
  console.log(`Received request for URL: ${request.url}`);
  response.writeHead(200);
  response.end('HelloWorld');
};

var www = http.createServer(handleRequest);

www.listen(8080);
```

Run the application

```sh
node server.js
```

The Node application should respond with HelloWorld when you navigate to [http://localhost:8080](http://localhost:8080) in a browser.

Stop the application with `Ctrl + C`.

#### Create a Docker container image
