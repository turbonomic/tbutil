# Installing TBUtil PODs

| Info | Value |
| ---- | ----- |
| Date | 20 May 2021 |
| Author | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil Version | 1.3h |

TBUtil is a command-line utility for accessing various features of Turbonomic/CWOM. It also includes a customised JavaScript 5 programming environment to allow users to develop custom scripts and reports.

TBUtil is available as a download for installation into Linux, Windows or MAC (Darwin) 64 bit platforms or as a set of pre-defined docker containers for installation into the "turbonomic" Kubernetes namespace.


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
| base | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3h/tbutil-base-k8s-1.3h.zip) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/base/volume.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/base/volume-local.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/base/deploy-online.yaml) |
| actionscripts | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3h/tbutil-actionscripts-k8s-1.3h.zip) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/actionscripts/volume.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/actionscripts/volume-local.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/actionscripts/deploy-online.yaml) |
| hotwarm | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3h/tbutil-hotwarm-k8s-1.3h.zip) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/hotwarm/volume.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/hotwarm/volume-local.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/hotwarm/deploy-online.yaml) |
| flexera | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3h/tbutil-flexera-k8s-1.3h.zip) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/flexera/volume.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/flexera/volume-local.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/flexera/deploy-online.yaml) |
| full | [click here](https://github.com/turbonomic/tbutil/releases/download/v1.3h/tbutil-full-k8s-1.3h.zip) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/full/volume.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/full/volume-local.yaml) | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/full/deploy-online.yaml) |



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

1. Download the container `tbutil-{FLAVOUR}-k8s-1.3h.zip` file by clicking on the relevant entry in the "Zip" column in the "Downloads" table above. This should download it onto your laptop/desktop system.

2. Copy the downloaded zip file into the `/tmp` directory on the Turbonomic OVA system using WinSCP (on Windows), scp or sftp (on Linux or MAC) or equivalent.

> For example (copying the 'hotwarm' zip file from a linux desktop)..
> <pre>
> [chris@song1 ]$ <b>scp tbutil-hotwarm-k8s-1.3h.zip turbo@10.11.19.111:/tmp</b>
> tbutil-hotwarm-k8s-1.3h.zip                 100%   16MB   2.1MB/s   00:08  </pre>

3. Log in to the Turbonomic system as user "turbo" using SSH (the popular free "putty" app is a good tool for this for windows users).
4. Unzip the file using the `unzip` command (or your equivalent). This will create some new files in the current directory.

> For example (unzipping the 'hotwarm' zip file)..
> <pre>
> [turbo@node1 ~]$ <b>cd /opt/turbonomic</b>
> [turbo@node1 ~]$ <b>unzip /tmp/tbutil-hotwarm-k8s-1.3h.zip </b>
> Archive:  tbutil-hotwarm-k8s-1.3h.zip
>   inflating: README.md               
>   inflating: deploy-lab.yaml         
>   inflating: deploy-offline.yaml     
>   inflating: deploy-online.yaml      
>   inflating: tbutil-hotwarm-1.3h.tgz  
>   inflating: volume-local.yaml       
>   inflating: volume.yaml   </pre>

8. Push the container image into the local docker using the commands:
    - `gunzip -v tbutil-{FLAVOUR}-1.3h.tgz`
    - `sudo docker image load -i tbutil-{FLAVOUR}-1.3h.tar`
    - `sudo docker images | fgrep tbutil-{FLAVOUR}`

> For example (loading and checking the 'hotwarm' image)..
> <pre>
> [turbo@node1 ~]$ <b>gunzip -v tbutil-hotwarm-1.3h.tgz </b>
> tbutil-hotwarm-1.3h.tgz:  58.8% -- replaced with tbutil-hotwarm-1.3h.tar
> 
> [turbo@node1 ~]$ <b>sudo docker image load -i tbutil-hotwarm-1.3h.tar </b>
> Loaded image: tbutil-hotwarm:1.3h
> 
> [turbo@node1 ~]$ <b>sudo docker images | fgrep tbutil-hotwarm </b>
> tbutil-hotwarm    1.3h       6d127268e6dd        2 minutes ago        41.7MB  </pre>


Now, jump to the steps listed in the section "Installing the K8S components", below.


## On-Line installation

On-line installation is the process of deploying the latest TBUtil container POD into a Kubernetes environment that has direct connection to the public docker hub via the internet.

In the following instructions, the string "{FLAVOUR}" should be replaced by the relevant flavour name (from the "Name" column of the table at the top of this page).

1. Select the `volume` yaml file that you need by referring to the "Determine the volume type" section, above.
2. Download the chosen file onto the system from which you run "`kubectl`" (possibly: on the OVA system itself) using one of these commands..
   - `wget https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/{FLAVOUR}/volume.yaml`
   - `wget https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/{FLAVOUR}/volume-local.yaml`
3. If the volume type is "turbo-local-storage" then create the required directory by logging in to the Turbonomic platform and running the following commands:
    - `mkdir /data/turbonomic/tbutil-{FLAVOUR}`
    - `chmod 777 /data/turbonomic/tbutil-{FLAVOUR}`
3. Download the `deploy-online.yaml` file using "`wget`" or equivalent.
   - `wget https://raw.githubusercontent.com/turbonomic/tbutil/v1.3h/yaml/{FLAVOUR}/deploy-online.yaml`
4. Review the downloaded yaml files and make any required edits.

Now, continue with the steps listed in the section "Installing the K8S components", below.


## Installing the K8S components.

1. Identify which of the volume yaml files you should use (see above)

> For example (showing that this system uses 'gluster-heketi' volumes)..
> <pre>
> [turbo@node1 ~]$ <b>kubectl get pvc -n turbonomic</b>
> NAME       STATUS  VOLUME                   CAPACITY  ACCESS MODES  STORAGECLASS    AGE
> api        Bound   pvc-66fe88cd-d31a-11ea   1Gi       RWO           gluster-heketi  279d
> api-certs  Bound   pvc-66ff87d5-d31a-11ea   1Gi       RWO           gluster-heketi  279d
> arangodb   Bound   pvc-66ff84eb-d31a-11ea   100Gi     RWO           gluster-heketi  279d </pre>

2. If the storage class was shown as "turbo-local-storage" then create the required directory using the following commands:
    - `sudo mkdir /data/turbonomic/tbutil-{FLAVOUR}`
    - `sudo chmod 777 /data/turbonomic/tbutil-{FLAVOUR}`

> For example (creating the directory for the 'hotwarm' flavour)..
> <pre>
> [turbo@node1 ~]$ <b>sudo mkdir /data/turbonomic/tbutil-hotwarm</b>
> [turbo@node1 ~]$ <b>sudo chmod 777 /data/turbonomic/tbutil-hotwarm</b> </pre>    

3. Review the selected volume yaml and the deploy-offline.yaml file and edit them if required.
4. Create the persistent volume by running one of the following commands (depending on the volume file you require - see above)
    - `kubectl apply -f volume.yaml`
    - `kubectl apply -f volume-local.yaml`

   Then check that the new PVC has been created:

    - `kubectl get pvc | fgrep tbutil-{FLAVOUR}`

> For example (creating and checking the gluster-heketi volume for the 'hotwarm' flavour)..
> <pre>
> [turbo@node1 ~]$ <b>kubectl apply -f volume.yaml </b>
> persistentvolumeclaim/tbutil-hotwarm-volume created
>
> [turbo@node1 ~]$ <b>kubectl get pvc | fgrep tbutil-hotwarm</b>
> tbutil-hotwarm-volume   Bound    pvc-751defe0-ae74-93c4  1Gi    RWO   gluster-heketi   4m35s </pre>
> Or (creating and checking a local volume)..
> <pre>
> [turbo@node1 ~]$ <b>kubectl apply -f volume-local.yaml</b>
> persistentvolumeclaim/tbutil-hotwarm-volume created
> persistentvolume/local-pv-tbutil-hotwarm-volume created
>
> [turbo@node1 ~]$ <b>kubectl get pvc | fgrep tbutil-hotwarm</b>
> tbutil-hotwarm-volume   Bound   local-pv-tbutil-hotwarm-volume   1Gi   RWO   turbo-local-storage   82s</pre>

5. Create the deployment and POD by running one of these two commands (depending on whether you are doing an on-line or off-line installation).
    - `kubectl apply -f deploy-online.yaml`
    - `kubectl apply -f deploy-offline.yaml`

> For example (creating the 'hotwarm' flavour deployment, off line)..
> <pre>
> [turbo@node1 ~]$ <b>kubectl apply -f deploy-offline.yaml </b>
> deployment.apps/tbutil-hotwarm created
>
> [turbo@node1 ~]$ <b>kubectl get pods | grep tbutil-hotwarm</b>
> tbutil-hotwarm-85df445bfb-nzqv6   1/1   Running   0   25s </pre>

6. Open the bash shell in the pod using the commands:
    - `pod=$(kubectl get pods | awk '/tbutil-{FLAVOUR}/ {print $1}')`
    - `kubectl exec -ti "$pod" -- /bin/bash`

> For example (creating the 'hotwarm' flavour deployment)..
> <pre>
> [turbo@node1 ~]$ <b>pod=`kubectl get pods | awk '/tbutil-hotwarm/ {print $1}'`</b>
> [turbo@node1 ~]$ <b>kubectl exec -ti $pod -- /bin/bash</b>
> 
> TBUTIL: Unsupported Software, Copyright (C) Turbonomic 2018,2019,2020,2021
> GIT Tag     : 1.3g
> Commit Hash : fd883c00e0634c4b15b13df26b83d305d603e47f
> Commit Time : 2021-05-05 12:14:47 +0100
> Build Time  : 2021-05-05 11:26:35 +0000
> API Version : 6.4.35
> 
> **********************************************
> *                                            *
> *   Please install a valid unlock key file   *
> *                                            *
> **********************************************
> 
> tbutil@tbutil-hotwarm-85df445bfb-nzqv6:~ $ </pre>

7. Save the unlock key you obtained earlier into `/home/tbutil/.tbutilissue`. There are several ways to do this using standard linux commands. One easy way is to use the shell "read" command to allow the unlock key to be pasted into a shell variable and then written to the file. To use this approach; make sure you are logged into the pod (as described above) and run the command:
    - `read -p "Key: " key`

    You should see the prompt "Key:".

    Cut-and-paste the unlock text into the putty window and press return - you should get the shell prompt back.

    Next: save the contents of the variable into the file using the command..

    - `echo "$key" > /home/tbutil/.tbutilissue`

    Then check that this has worked by running the following command..

    - `tbutil -V`

    This should show the tbutil version information, WITHOUT the "Please install a valid unlock key file" message.

> For example (using the cut-and-paste approach described above)..
> <pre>
> tbutil@tbutil-hotwarm-85df445bfb-nzqv6:~ $ <b>read -p "Key: " key</b>
> Key: <b>mickey.mouse@mail.example.com:$2a$10$RPY3izDOuj2akTA7..Jox/r3LBCAuyrS/3Zgd1PLbQggQ</b>
> 
> tbutil@tbutil-hotwarm-85df445bfb-nzqv6:~ $ <b>echo "$key" > /home/tbutil/.tbutilissue</b>
>
> tbutil@tbutil-hotwarm-85df445bfb-nzqv6:~ $ <b>tbutil -V</b>
> TBUTIL: Unsupported Software, Copyright (C) Turbonomic 2018,2019,2020,2021
> Issued To   : mickey.mouse@mail.example.com
> GIT Tag     : 1.3h
> Commit Hash : fd883c00e0634c4b15b13df26b83d305d603e47f
> Commit Time : 2021-05-05 12:14:47 +0100
> Build Time  : 2021-05-05 12:16:14 +0100
> API Version : 6.4.35 </pre>

Now you are ready to run through the flavour-specific set up steps (click on the relevant link in the left-hand column of the "container flavours" table at the top of this page for more details).
