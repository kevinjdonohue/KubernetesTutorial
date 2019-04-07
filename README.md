# Kubernetes Tutorial

A repo to contain notes and examples from taking the Kubernetes Basics tutorial on the Kubernetes website.

These notes will hopefully demonstrate how to install, configure and run Kubernetes on a workstation running linux (specifically Ubuntu 18.04).

## Installation

In order to run Kubernetes on a workstation running Linux, you will need to install Minikube.

In order to install Minikube, you first need to install a couple of prerequisites.

### Minikube Prerequisites

1. A Hypervisor (VirtualBox, KVM, etc.)
1. kubectl

For the Hypervisor prerequisite, I installed VirtualBox (5.2.12 for Ubuntu 18.04) from the [VirtualBox download page](https://www.virtualbox.org/wiki/Linux_Downloads).

**UPDATE**:  For the Hypervisor prerequisite on openSUSE Tumbleweed, I installed KVM instead.

The opneSUSE documentation provided a nice, straight-forward method for installing the packages necessary to get KVM via a [Zypper pattern](https://doc.opensuse.org/documentation/leap/virtualization/html/book.virt/cha.vt.installation.html).  A couple of aspects that were a little tricky.  

1. [libvert](https://doc.opensuse.org/documentation/leap/virtualization/html/book.virt/cha.libvirt.overview.html) -- This is a service that needs to be running on your workstation.  Since I didn't want to run this service all the time, I didn't configure it to run all the time.  Therefoe, you just need to get it running first and *then* run minikube.
1. [KVM2 Driver](https://github.com/kubernetes/minikube/blob/master/docs/drivers.md#kvm2-driver) -- This is required to run KVM2 on your workstation.

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
# this starts minikube with the default Hypervisor, which is VirtualBox
minikube start

# on openSUSE Tumbleweed with the KVM2 Hypervisor instead, you need to pass an arg:
minikube start --vm-driver=kvm2

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
kubectl delete service hello-minikube

kubectl delete deployment hello-minikube
```

Finally, you can stop the Minikube altogether once you are done.

```sh
minikube stop
```

## Hello Minikube Tutorial

In order to get more familiar with Kubernetes and Docker this is a mini-tutorial for creating a HelloWorld application, creating a Docker image for it, and then deploying the Docker image in Kubernetes. These instructions are taken from the [Kubernetes hello-minikube tutorial](https://kubernetes.io/docs/tutorials/hello-minikube/).

### Create a Kubernetes Deployment

A little background information is necessary here because by creating a Deployment, there are several things occurring.

**Deployment (def):**  "A Kubernetes Deployment is a type of Kubernetes Controller that provides declarative states for Pods (and ReplicaSets)"

A Deployment is said to be the "recommended way to manage the creation and scaling of Pods".  It has the responsibility of checking on the health of a Pod, restarting the Pod's container(s) if they terminate, etc.

**Pod (def):**  "A Kubernetes Pod is a group of one or more Containers [Docker], tied together for the purposes of administration and networking."

In the tutorial example, we are going to create a Pod by creating a Deployment, which is going to be based on an existing Docker image hosted by Google in the Google Container Registry (GCR).

```sh
kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
```

The results from running this command are:  the creation of a Deployment and the creation of a Pod.

```sh
# list the Deployments that exist in your Kubernetes cluster
kubectl get deployments

# list the Pods in your Kubernetes cluster
kubectl get Pods
```

So, what have we done so far?

We've created a Pod in our Kubernetes cluster via a Deployment.  Within that Pod there is a Docker Container running that has the example Node application running in it.

Okay, great, now what?

Well, so all of that is great but by default the Pod we created is NOT accessible to anything outside the cluster; the Container is literally only accessible via its internal IP address.  In order to make the Pod valuable to us and usable we need to create a Kubernetes Service.

### Create a Kubernetes Service

Again, some background before we actually create the Service.

**Service (def)"** "A Kubernetes Service is "an abstraction which defines a logical set of Pods and a policy by which to access them -- sometimes called a micro-service".

```sh
# expose the Pod outside of the Kubernetes cluster
kubectl expose deployment hello-node --type=LoadBalancer --port=8080
```

The results from running this command are:  the creation of a Service (of type LoadBalancer).  Note, since we are running things on minikube and NOT on a cloud provider this will make the Service available via a command in minikube.  If we were hosting the Kubernetes cluster on a cloud provider, then the creation of a LoadBalancer type Service would have triggered the creation of an external load balancer within the cloud provider's environment.

```sh
# view the Service in your Kubernetes cluster
kubectl get services
```

In order to access the Load Balancer in our local environment (minikube), you can execute the following command.

```sh
minikube service hello-node
```

The result from running this minikube command should be a browser window is launched with the application running!

Once you have completed this tutorial you can clean things up (just like in above verification).

```sh
kubectl delete service hello-node

kubectl delete deployment hello-node
```

Finally, you can stop the Minikube altogether once you are done.

```sh
minikube stop

# optionally, if you are cleaning up everything you can get rid of the Minikube VM
minikube delete
```

## Learn Kubernetes Basics Tutorial

