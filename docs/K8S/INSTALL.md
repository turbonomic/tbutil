# Installing TBUtil PODs

| Info | Value |
| ---- | ----- |
| Date | 23 Apr 2021 |
| Author | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil Version | 1.3g |

TBUtil is a command-line utility for accessing various features of Turbonomic/CWOM. It also includes a customised JavaScript 5 programming environment to allow users to develop custom scripts and reports.

TBUtil is available as a download for installation into Linux, Windows or MAC (Darwin) 64 bit platforms or as a set of pre-defined docker containers for installation into the "turbonomic" Kubernetes namespace.

This document describes the installation of the container options.

## Container Flavours

A number of flavours of TBUtil container are available. They are all based on the "Alpine" 3.13.4 container but include variations of TBUtil features as required, and so vary in size.

The following flavours are currently available:

| Name | Description |
| ------- | ----------- |
| base | A basic TBUtil installation with no plugins or other extended features. This forms the basis of all other flavours. |
| [actionscripts](ACTIONSCRIPTS.md) | This adds some skeleton action scripts (and an openssh server) to the base flavour. You can use this as the starting point for building your own real actions script integrations. |
| [hotwarm](HOTWARM.md) | A TBUtil container with features for hot/warm standby backup of the Turbonomic system. |
| [flexera](FLEXERA.md) | A TButil container with features for extracting VM, Host and Cluster details into CSV files that can be imported into Flexera. |
| full | All the above the features, merged into a single container. |


## Downloads

When the instructions that follow require a file to be downloaded, refer to the following table and click on the relevant link.

| Flavour | Zip | volume.yaml | deploy-online.yaml |
| ------- | --- | ----------- | ------------------ |
| base | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-base-k8s-1.3g.tgz) | [click here](../../../yaml/base/volume.yaml) | [click here](../../../yaml/base/deploy-online.yaml) |
| actionscripts | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-actionscripts-k8s-1.3g.tgz) | [click here](../../../yaml/actionscripts/volume.yaml) | [click here](../../../yaml/actionscripts/deploy-online.yaml) |
| hotwarm | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-hotwarm-k8s-1.3g.tgz) | [click here](../../../yaml/hotwarm/volume.yaml) | [click here](../../../yaml/hotwarm/deploy-online.yaml) |
| flexera | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-flexera-k8s-1.3g.tgz) | [click here](../../../yaml/flexera/volume.yaml) | [click here](../../../yaml/flexera/deploy-online.yaml) |
| full | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-full-k8s-1.3g.tgz) | [click here](../../../yaml/full/volume.yaml) | [click here](../../../yaml/full/deploy-online.yaml) |

Note: the volume.yaml files supplied assume that the PVC uses Gluster/Heketi. You will need to edit the file if your installation uses a different persistent storage provider.

## Off-Line installation (Turbonomic OVA deployments)

Off-line installation is the process of deploying a TBUtil container POD into a Kubernetes environment that has no direct connection to the public (or private) docker hub. Typically, this will be on a Turbonomic OVA installation.

In the following instructions, the string "{FLAVOUR}" should be replaced by the relevant flavour name (from the "Name" column of the table at the top of this page).

1. Download the container zip file from the relevant entry in the "Zip" column in the "Downloads" table above.
2. Copy the downloaded zip file onto the Turbonomic OVA system using WinSCP (on Windows), scp or sftp (on Linux or MAC) or equivalent.
3. Log in to the Turbonomic system as user "turbo" using SSH.
4. Unzip the file using the `unzip` command. This will create four new files in the current directory:
    - volume.yaml
    - deploy-online.yaml
    - deploy-offline.yaml
    - tbutil-{FLAVOUR}-1.3g.tgz
5. Review the yaml files and edit if required.
6. Create the persistent volume by running the command:
    - `kubectl apply -f volume.yaml`
7. Push the container image into the local docker using the command:
    - `gunzip < tbutil-{FLAVOUR}-1.3g.tgz | sudo docker image load`
8. Create the deployment and POD by running the command:
    - `kubectl apply -f deploy-offline.yaml`
9. Open the bash shell in the pod using the command:
    - `kubectl exec -ti deploy/tbutil-{FLAVOUR} -- /bin/bash`

Now you are ready to run through the flavour-specific set up steps.


## On-Line installation

On-line installation is the process of deploying the latest TBUtil container POD into a Kubernetes environment that has direct connection to the public docker hub via the internet.

In the following instructions, the string "{FLAVOUR}" should be replaced by the relevant flavour name (from the "Name" column of the table at the top of this page).

1. Download the `volume.yaml` and `deploy-online.yaml` files from the relevant row in the "Downloads" table above.
2. Review the yaml files and edit if required.
3. Create the persistent volume by running the command:
    - `kubectl apply -f volume.yaml`
4. Create the deployment and POD by running the command:
    - `kubectl apply -f deploy-online.yaml`
5. Open the bash shell in the pod using the command:
    - `kubectl exec -ti deploy/tbutil-{FLAVOUR} -- /bin/bash`

If you want to install an older release instead, then download it's zip file (as described in step 1 for off-line installation) and extract the "`volume.yaml`" and "`deploy-online.yaml`" files from that, review then and then run:

- `kubectl apply -f volume.yaml`
- `kubectl apply -f deploy-online.yaml`

Now you are ready to run through the flavour-specific set up steps.
