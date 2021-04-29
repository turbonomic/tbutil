# Installing TBUtil PODs

| Info | Value |
| ---- | ----- |
| Date | 29 Apr 2021 |
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

| Flavour | Zip | volume.yaml | volume-local.yaml | deploy-online.yaml |
| ------- | --- | ----------- | ----------------- | ------------------ |
| base | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-base-k8s-1.3g.zip) | [click here](../../yaml/base/volume.yaml) | [click here](../../yaml/base/volume-local.yaml) | [click here](../../yaml/base/deploy-online.yaml) |
| actionscripts | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-actionscripts-k8s-1.3g.zip) | [click here](../../yaml/actionscripts/volume.yaml) | [click here](../../yaml/actionscripts/volume-local.yaml) | [click here](../../yaml/actionscripts/deploy-online.yaml) |
| hotwarm | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-hotwarm-k8s-1.3g.zip) | [click here](../../yaml/hotwarm/volume.yaml) | [click here](../../yaml/hotwarm/volume-local.yaml) | [click here](../../yaml/hotwarm/deploy-online.yaml) |
| flexera | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-flexera-k8s-1.3g.zip) | [click here](../../yaml/flexera/volume.yaml) | [click here](../../yaml/flexera/volume-local.yaml) | [click here](../../yaml/flexera/deploy-online.yaml) |
| full | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3g/tbutil-full-k8s-1.3g.zip) | [click here](../../yaml/full/volume.yaml) | [click here](../../yaml/full/volume-local.yaml) | [click here](../../yaml/full/deploy-online.yaml) |


## Determine the volume type

As a rule: Turbonomic OVA versions before 8.1.5 used Gluster/Heketi volumes, as do installations that were updated to 8.1.5 from earlier versions. Newly installed version 8.1.5 systems and later use a local storage volume type. Installations built directly on customer's K8S infrastructure may use other types.

You will need to know what type is in use in your case before installing the TbUtil container. To discover this, run the following command and look at the contents of the STORAGECLASS column.

```
kubectl get pvc -n turbonomic
```

If the storage class is "gluster-heketi" then you should use the "volume.yaml" file in the instructions that follow.

If the storage class is "turbo-local-storage" then you should use the "volume-local.yaml" file in the instructions that follow.

If the storage class is neither of these, then you will need to craft your own equivalent of the volume.yaml file. Turbonimic will be able to assist with this.


## Obtain the unlock key.

The `tbutil` binaries installed in the container require an "unlock key" file to be applied before they can be used. This is **not** a license (it confers no specific rights).

In order to complete the installation, you will need to obtain a key. Please reach out to your Turbonomic field representative or support. They will supply you with a single line text file that includes your name or email address and the key string. This will be needed during the installation process.


## Off-Line installation (Turbonomic OVA deployments)

Off-line installation is the process of deploying a TBUtil container POD into a Kubernetes environment that has no direct connection to the public (or private) docker hub. Typically, this will be on a Turbonomic OVA installation.

In the following instructions, the string "{FLAVOUR}" should be replaced by the relevant flavour name (from the "Name" column of the table at the top of this page).

1. Download the container tbutil-{FLAVOUR}-k8s-1.3g.zip file from the relevant entry in the "Zip" column in the "Downloads" table above.
2. Copy the downloaded zip file onto the Turbonomic OVA system using WinSCP (on Windows), scp or sftp (on Linux or MAC) or equivalent.
3. Log in to the Turbonomic system as user "turbo" using SSH.
4. Unzip the file using the `unzip` command or similar. This will create some new files in the current directory:
    - volume.yaml
    - volume-local.yaml
    - deploy-lab.yaml (you can ignore this)
    - deploy-online.yaml
    - deploy-offline.yaml
    - tbutil-{FLAVOUR}-1.3g.tgz
5. Identify which of the volume yaml files you should use (see above)
6. If the volume type is "turbo-local-storage" then create the required directory using the following commands:
    - `mkdir /data/turbonomic/tbutil-{FLAVOUR}`
    - `chmod 777 /data/turbonomic/tbutil-{FLAVOUR}`
7. Review the select volume yaml and the deploy-offline.yaml file and edit them if required.
8. Push the container image into the local docker using the commands:
    - `gunzip tbutil-{FLAVOUR}-1.3g.tgz`
    - `sudo docker image load < tbutil-{FLAVOUR}-1.3g.tar`
9. Create the persistent volume by running one of the following commands (depending on the volume file you require - see above)
    - `kubectl apply -f volume.yaml`
    - `kubectl apply -f volume-local.yaml`
10. Create the deployment and POD by running the command:
    - `kubectl apply -f deploy-offline.yaml`
11. Open the bash shell in the pod using the command:
    - `kubectl exec -ti deploy/tbutil-{FLAVOUR} -- /bin/bash`
12. Install the unlock key by copying the file you obtained earlier to `/home/tbutil/.tbutilissue`.

Now you are ready to run through the flavour-specific set up steps.


## On-Line installation

On-line installation is the process of deploying the latest TBUtil container POD into a Kubernetes environment that has direct connection to the public docker hub via the internet.

In the following instructions, the string "{FLAVOUR}" should be replaced by the relevant flavour name (from the "Name" column of the table at the top of this page).

1. Download the required volume yaml file (`volume.yaml` or `volume-local.yaml`) from the relevant row in the "Downloads" table above (or create your own).
2. If the volume type is "turbo-local-storage" then create the required directory by logging in to the Turbonomic platform and running the following commands:
    - `mkdir /data/turbonomic/tbutil-{FLAVOUR}`
    - `chmod 777 /data/turbonomic/tbutil-{FLAVOUR}`
3. Download the `deploy-online.yaml` file from the relevant row in the "Downloads" table above.
4. Review the files and edit if required.
5. Create the persistent volume by running one of the following commands (depending on the volume file you require - see above)
    - `kubectl apply -f volume.yaml`
    - `kubectl apply -f volume-local.yaml`
6. Create the deployment and POD by running the command:
    - `kubectl apply -f deploy-online.yaml`
7. Open the bash shell in the pod using the command:
    - `kubectl exec -ti deploy/tbutil-{FLAVOUR} -- /bin/bash`
8. Install the unlock key by copying the file you obtained earlier to `/home/tbutil/.tbutilissue`

If you want to install an older release instead, then download it's zip file (as described in step 1 for off-line installation) and extract the "`deploy-online.yaml`" and required volume yaml file (or create your own), review then and then run:

- `kubectl apply -f {VOLUME-FILE-NAME}`
- `kubectl apply -f deploy-online.yaml`

Now you are ready to run through the flavour-specific set up steps.
