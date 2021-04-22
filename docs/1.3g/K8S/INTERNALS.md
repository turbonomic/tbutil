In the following notes, the string "{FLAVOUR}" should be replaced by the flavour name of the TBUtil pod being considered. Valid names currently include:

- base
- hotwarm
- actionscripts
- flexera
- full


## Container Structure

All flavours are based on the "Alpine" 3.13.4 container with a number of minor changes, as follows.

- Two users called "tbutil" and "tbexport" have been created. Their home directories are maintained in a persistent Gluster-Heketi volume so any files (including the tbutil configuration) stored there are retained over container cycles.
- The "tbutil" binary and a flavour-dependent selection of plugins are installed in /usr/local/bin. All of these are built for Alpine 64bit Linux using the "musl" library and loader.
- A "Set uid/gid" version of "busybox" is added, and a selection of utilities are linked to it. The current set includes:
    - sudo
    - su
    - passwd
    - crontab
    - ping
- A number of additional APK packages are installed
    - all flavours have "sudo" and "bash" installed.
    - other packages have been added to a subset of flavours as required. These include "jq", "mysql-client", "openssh" and "sqlite"
- If the openssh package is installed then the system ssh certificates are created and placed in persistent storage.


## File Persistence

The container uses a K8S PVC (persistent volume claim) to ensure that the files in a number of key directorys are retained even when the container itself is cycled. The single PVC that contains all these directories is defined in the `volume.yaml` file and is called turbo&#x2011;{FLAVOUR}&#x2011;volume. The different mount points are defined as sub folders of the PVC.

| Directory Path | PVC Sub Path | Description |
| -------------- | ------------ | ----------- |
| /etc/crontabs  | etc&#x2011;crontabs | This directory contains user-specific crontab definitions which are typically set up at configuration time and so need to be retained. |
| /etc/ssh       | etc&#x2011;ssh      | This directory contains the SSH configuration and global certificates. This needs to be retained so that action-script server connections survive pod cycling. |
| /home/tbutil   | tbutil       | This is the home directory of the user account used to run tbutil integrations. It includes custom copies of scripts and configuration, user ssh certificates and tbutil credential storage. |
| /home/tbexport | tbexport     | This is the home directory of a user to which files to be collected are typically passed. This user does not have the ability to run tbutil scripts or subcommands but has been provided as the account that external data collection tools can connect to safely. |


## Exposed Ports

The following ports are exposed as K8S "node ports"..

| Internal Port | POD Flavour | Exposed Port |
| ------------- | ----------- | ------------ |
| 22            | flexera     | 31122        |
| 22            | full        | 31222        |
| 80            | full        | 31280        |

Port 22 is exposed on different ports for different flavours so that the two flavours can co-exist in the same K8S cluster.


## K8S API Access

TBUtil access to a subset of the local K8S APIs has been enabled for flavours that use it.


## VCenter API Access

TBUtil access is enabled (for flavours that require it) to vCenters that are validated targets in the local Turbonomic instance. To support this, the Topology Processor's "helper" directory is mounted read-only.
