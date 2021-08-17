# Installing TBUtil PODs

| Info | Value |
| ---- | ----- |
| Date | 17 Aug 2021 |
| Author | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil Version | 2.0f |

TBUtil is a command-line utility for accessing various features of Turbonomic/CWOM. It also includes a customised JavaScript 5 programming environment to allow users to develop custom scripts and reports.

TBUtil is available as a download for installation into Linux, Windows or MAC (Darwin) 64 bit platforms or as a set of pre-defined docker containers for installation into the "turbonomic" Kubernetes namespace.


## Container Flavours

***Note: In the following instructions, the string "{FLAVOUR}" should be replaced by the relevant flavour name (from the "Name" column of the table below).***

A number of flavours of TBUtil container are available. They are all based on the "Alpine" 3.13.4 container but include variations of TBUtil features as required, and so vary in size.

The following flavours are currently available:

| Name | Description |
| ------- | ----------- |
| base | A basic TBUtil installation with no plugins or other extended features. This forms the basis of all other flavours. |
| [actionscripts](ACTIONSCRIPTS.md) | This adds some skeleton action scripts (and an openssh server) to the base flavour. You can use this as the starting point for building your own real actions script integrations. |
| [chromedp](CHROMEDP.md) | An experimental TBUtil container with features that allow a headless Chrome browser to be controlled. This can be used to extract PNG images of Turbo UI widgets - etc. This is quite a big pod because it includes the "chromium" browser package. |
| [hotwarm](HOTWARM.md) | A TBUtil container with features for hot/warm standby backup of the Turbonomic system. |
| [flexera](FLEXERA.md) | A TButil container with features for extracting VM, Host and Cluster details into CSV files that can be imported into Flexera. |
| full | All the above the features, merged into a single container. Note: if you want to use the "chromedp" plugin, then you will need to add the "chromium" package to the pod. It is omitted from the standard pod in order to reduce its size. |




## Downloads

When the instructions that follow require a file to be downloaded, refer to the following table and click on the relevant link. You will not need all of these, so please read on and come back to this table to download the files that the instructions refer to.

Please note: `github` uses URL redirection for released files (such as those listed in the table below). This means that if you download using the `curl` Linux command, you need to use the options "-O" and "-L" (not just "-O") when downloading. For example:

```bash
curl -O -L https://...........
```

And **always** check the MD5 sum of any files downloaded before attempting to use them. You can do this by running the `md5sum` command and comparing the last eight characters of the hex string it displays against <span style="color: orange">the value shown in orange</span> for the relevant file in the table below. The Linux command for this is..

```base
md5sum FILE-NAME-GOES-HERE
```

| Flavour | Zip | deploy-online.yaml |
| ------- | --- | ------------------ |
| base | [click here](https://github.com/turbonomic/tbutil/releases/download/v2.0f/tbutil-base-k8s-2.0f.zip)<br><span style="color: orange">0332e84b</span> | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/base/deploy-online.yaml)<br><span style="color: orange">7219bbd5</span> |
| actionscripts | [click here](https://github.com/turbonomic/tbutil/releases/download/v2.0f/tbutil-actionscripts-k8s-2.0f.zip)<br><span style="color: orange">2aac41d3</span> | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/actionscripts/deploy-online.yaml)<br><span style="color: orange">ff19e95b</span> |
| hotwarm | [click here](https://github.com/turbonomic/tbutil/releases/download/v2.0f/tbutil-hotwarm-k8s-2.0f.zip)<br><span style="color: orange">e3ed3863</span> | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/hotwarm/deploy-online.yaml)<br><span style="color: orange">a71aa194</span> |
| chromedp | [click here](https://github.com/turbonomic/tbutil/releases/download/v2.0f/tbutil-chromedp-k8s-2.0f.zip)<br><span style="color: orange">7625a89c</span> | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/chromedp/deploy-online.yaml)<br><span style="color: orange">13a95ff8</span> |
| flexera | [click here](https://github.com/turbonomic/tbutil/releases/download/v2.0f/tbutil-flexera-k8s-2.0f.zip)<br><span style="color: orange">c06cf066</span> | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/flexera/deploy-online.yaml)<br><span style="color: orange">6b89025b</span> |
| full | [click here](https://github.com/turbonomic/tbutil/releases/download/v2.0f/tbutil-full-k8s-2.0f.zip)<br><span style="color: orange">1378cbec</span> | [click here](https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/full/deploy-online.yaml)<br><span style="color: orange">5629c559</span> |



## Volume type

As a rule: Turbonomic OVA versions before 8.1.5 used Gluster/Heketi volumes, as do installations that were updated to 8.1.5 from earlier versions. Newly installed version 8.1.5 systems and later use a local storage volume type. Installations built directly on customer's K8S infrastructure may use other types.

You will need to know what type is in use in your case before installing the TbUtil container. To discover this, run the following command and look at the contents of the STORAGECLASS column.

```
kubectl get pvc -n turbonomic
```

If the storage class is "gluster-heketi", "turbo-local-storage" or "ibmc-file-gold-gid" then the volume and PVC will be created for you automatically (though you will first need to create a specific folder if the class is "turbo-local-storage" - more on this later).

If the storage class is not one of those, then you will need to create a K8S PVC called "tbutil-{FLAVOUR}-volume" by hand in the "turbonomic" namespace before deploying the tbutil pod.


## Unlock key.

The `tbutil` binaries installed in the container require an "unlock key" file to be applied before they can be used. This is **not** a license (it confers no specific rights).

In order to complete the installation, you will need to obtain a key. Please reach out to your Turbonomic field representative or support. They will supply you with a single line text file that includes your name or email address and the key string. This will be needed during the installation process.

**Note for Turbonomic employees**: You can obtain the required key when connected to the company VPN by browsing to https://tbutil.s3.eu-west-2.amazonaws.com/issue.html (this redirects to a private IP address so the redirect wont work without the VPN connection).


## Off-Line installation.

Off-line installation is the process of deploying a TBUtil container POD into a Kubernetes environment that has no direct connection to the public (or private) docker hub. This will be the case on some Turbonomic OVA installations.

1. Download the container `tbutil-{FLAVOUR}-k8s-2.0f.zip` file by clicking on the relevant entry in the "Zip" column in the "Downloads" table above. This should download it onto your laptop/desktop system.

2. Copy the downloaded zip file into the `/tmp` directory on the Turbonomic OVA system using WinSCP (on Windows), scp or sftp (on Linux or MAC) or equivalent.

> For example (copying the 'hotwarm' zip file from a linux desktop)..
> <pre>
> [chris@song1 ]$ <b>scp tbutil-hotwarm-k8s-2.0f.zip turbo@10.11.19.111:/tmp</b>
> tbutil-hotwarm-k8s-2.0f.zip                 100%   16MB   2.1MB/s   00:08  </pre>

3. Log in to the Turbonomic system as user "turbo" using SSH (the popular free "putty" app is a good tool for this for windows users).
4. Unzip the file using the `unzip` command (or your equivalent). This will create some new files in the current directory.

> For example (unzipping the 'hotwarm' zip file)..
> <pre>
> [turbo@node1 ~]$ <b>cd /opt/turbonomic</b>
> [turbo@node1 ~]$ <b>unzip /tmp/tbutil-hotwarm-k8s-2.0f.zip </b>
> Archive:  tbutil-hotwarm-k8s-2.0f.zip
>   inflating: README.md               
>   inflating: deploy-lab.yaml         
>   inflating: deploy-offline.yaml     
>   inflating: deploy-online.yaml      
>   inflating: tbutil-hotwarm-2.0f.tgz  </pre>

5. Push the container image into the local docker using the commands:
    - `gunzip -v tbutil-{FLAVOUR}-2.0f.tgz`
    - `sudo docker image load -i tbutil-{FLAVOUR}-2.0f.tar`
    - `sudo docker images | fgrep tbutil-{FLAVOUR}`

> For example (loading and checking the 'hotwarm' image)..
> <pre>
> [turbo@node1 ~]$ <b>gunzip -v tbutil-hotwarm-2.0f.tgz </b>
> tbutil-hotwarm-2.0f.tgz:  58.8% -- replaced with tbutil-hotwarm-2.0f.tar
> 
> [turbo@node1 ~]$ <b>sudo docker image load -i tbutil-hotwarm-2.0f.tar </b>
> Loaded image: tbutil-hotwarm:2.0f
> 
> [turbo@node1 ~]$ <b>sudo docker images | fgrep tbutil-hotwarm </b>
> tbutil-hotwarm    2.0f       6d127268e6dd        2 minutes ago        41.7MB  </pre>


Now, jump to the steps listed in the section "Installing the K8S components", below.


## On-Line installation

On-line installation is the process of deploying the latest TBUtil container POD into a Kubernetes environment that has direct connection to the public docker hub via the internet, or access to a private repository into which the container images has been loaded.

1. Download the `deploy-online.yaml` file using "`wget`" or equivalent.
   - `wget https://raw.githubusercontent.com/turbonomic/tbutil/v2.0f/yaml/{FLAVOUR}/deploy-online.yaml`

Now, continue with the steps listed in the section "Installing the K8S components", below.


## Installing the K8S components.

1. Identify which storage class your installation uses. You do this by running the following command, and looking the value in the STORAGECLASS column.

```
kubectl get pvc -n turbonomic

```

> For example (showing that this system uses 'gluster-heketi' volumes)..
> <pre>
> [turbo@node1 ~]$ <b>kubectl get pvc -n turbonomic</b>
> NAME       STATUS  VOLUME                   CAPACITY  ACCESS MODES  STORAGECLASS    AGE
> api        Bound   pvc-66fe88cd-d31a-11ea   1Gi       RWO           gluster-heketi  279d
> api-certs  Bound   pvc-66ff87d5-d31a-11ea   1Gi       RWO           gluster-heketi  279d
> arangodb   Bound   pvc-66ff84eb-d31a-11ea   100Gi     RWO           gluster-heketi  279d </pre>

2. If the storage class was shown as "`turbo-local-storage`" then create the required directory using the following commands:
    - `sudo mkdir /data/turbonomic/tbutil-{FLAVOUR}`
    - `sudo chmod 777 /data/turbonomic/tbutil-{FLAVOUR}`

> For example (creating the directory for the 'hotwarm' flavour)..
> <pre>
> [turbo@node1 ~]$ <b>sudo mkdir /data/turbonomic/tbutil-hotwarm</b>
> [turbo@node1 ~]$ <b>sudo chmod 777 /data/turbonomic/tbutil-hotwarm</b> </pre>    

3. If the volume type is _not_ "gluster-heketi", "turbo-local-storage" or "ibmc-file-gold-gid", then create a Kubernetes PVC called "tbutil-{FLAVOUR}-volume" by hand and check that it is created correctly.

4. Review the downloaded deployment yaml files and make any required edits.
   - Review "deploy-online.yaml" or "deploy-offline.yaml" as appropriate.
   - You might need to change the timezone ("TZ" environment variable) in the deploy yaml file (in the field group: `spec / template / spec / containers / env`). This must be have a value that is known to the [IANA Time zone database](https://www.iana.org/time-zones) as used in Alpine Linux. For example "Europe/London", or "GMT".
   - If you are using a private container repository, then you will need to change the image name in the yaml file. This field is found at `spec / template / spec / containers / image`.

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

  You may see a tbutil-{FLAVOUR} pod get created, then another and then the original one be deleted. Wait until this activity has settled down and you have a single "Running" POD with a state of "1/1".

6. Open the bash shell in the pod using the commands:
    - `pod=$(kubectl get pods | awk '/tbutil-{FLAVOUR}/ {print $1}')`
    - `kubectl exec -ti "$pod" -- /bin/bash`

> For example (for the 'hotwarm' flavour deployment)..
> <pre>
> [turbo@node1 ~]$ <b>pod=$(kubectl get pods | awk '/tbutil-hotwarm/ {print $1}')</b>
> [turbo@node1 ~]$ <b>kubectl exec -ti $pod -- /bin/bash</b>
> 
> TBUTIL: Unsupported Software, Copyright (C) Turbonomic 2018,2019,2020,2021
> GIT Tag     : 2.0a
> Commit Hash : fd883c00e0634c4b15b13df26b83d305d603e47f
> Commit Time : 2021-06-11 16:59:27 +0100
> Build Time  : 2021-06-14 09:43:49 +0100
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
> GIT Tag     : 2.0f
> Commit Hash : fd883c00e0634c4b15b13df26b83d305d603e47f
> Commit Time : 2021-05-05 12:14:47 +0100
> Build Time  : 2021-05-05 12:16:14 +0100
> API Version : 6.4.35 </pre>

Now you are ready to run through the flavour-specific set up steps (click on the relevant link in the left-hand column of the "container flavours" table at the top of this page for more details).
