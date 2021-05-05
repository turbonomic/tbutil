# TBUtil Flexera intergration POD

| Label          | Value       |
| -------------- | ----------- |
| Date           | 5 May 2021 |
| Author         | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil version | 1.3g |

## Installation

### Step 1: Install the POD

Install the container as a K8S POD by following [these instructions](INSTALL.md) using "flexera" as the POD flavour.

### Step 2: Configure

This step is not required if you are updating from the earlier release of the Flexera integration POD because the configuration is already stored in the persistent volume (unless you have deleted the PV, of course).

Log in to the POD using "bash"

```shell
kubectl exec -it deploy/tbutil-flexera -- /bin/bash
```

From inside the POD, run the following command and answer the questions asked:

```shell
flexera-export-setup
```

## Collecting the files

The script creates three CSV files in /tmp that can be collected using SSH tools (SCP or SFTP). The files are..
- /tmp/hosts.csv
- /tmp/vms.csv
- /tmp/clusters.csv

To access these files, use "SSH" to access port 31122 and use the username "tbexport".

Note: You will first need to establish an "SSH trust" by appending the client system's public key to the file `/home/tbexport/.ssh/authorized_keys` in the tbutil-flexera POD. The follow steps show one approach to this.

1. Get the POD id using the command
    - `kubectl get pods | fgrep tbutil-flexera`
2. Copy the public key file to the /tmp directory of the pod using
    - `kubectl cp {file-name-here} {full-pod-name-here}:/tmp/cert`
3. Log in to the POD using
    - `kubectl exec -ti {full-pod-name-here} -- /bin/bash`
4. Copy the cert using the commands..
    - sudo bash
    - cd /home/tbexport/.ssh
    - cat /tmp/cert >> authorized_keys
    - rm /tmp/cert
    - chown tbexport.tbexport authorized_keys
    - chmod 655 authorized_keys
    - passwd -d tbexport
    - exit
5. Log out of the POD
    - exit
