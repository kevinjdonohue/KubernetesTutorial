# Kubernetes Tutorial

A repo to contain notes and examples from taking the Kubernetes Basics tutorial on the Kubernetes website.

These notes will hopefully demonstrate how to install, configure and run Kubernetes on a workstation running linux (specifically Ubuntu 18.04).

## Installation

In order to run Kubernetes on a workstation running Linux, you will need to install Minikube.

In order to install Minikube, you first need to install a couple of prerequisites.

### Minikube Prerequisites

1.  Install a Hypervisor, either VirtualBox or KVM
2.  Install kubectl

For #1, the Hypervisor prerequisite, I installed VirtualBox (5.2.12 for Ubuntu 18.04) from the [VirtualBox download page](https://www.virtualbox.org/wiki/Linux_Downloads).

For #2, the kubectl prerequisite, I had to execute a few shell commands, per the [Kubernetes kubectl installation page](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

```sh
sudo apt update

sudo apt install apt-transport-https

sudo curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

# create kubernetes.list in /etc/apt/sources/list.d/ with the following line:
# deb http://apt.kubernetes.io/ kubernetes-xenial main

sudo apt update

sudo apt install kubectl
```

### Minikube
