# TBUtil Template Action Scripts POD

| Label          | Value       |
| -------------- | ----------- |
| Date           | 22 Apr 2021 |
| Author         | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil version | 1.3g |


## Installing the POD

Install the container as a K8S POD by following [these instructions](INSTALL.html) with "actionscripts" as the POD flavour.

Once installed, you can set up the scripts and then register the script server with Turbonomic.


## Script location

The action scripts implemented by the the POD live in one of two directories.

| Directory | Persistent? | Description |
| --------- | ----------- | ----------- |
| /usr/local/actionScripts | No | Scripts that are supplied with the container image (or images that are based on it). Any edits made to these files will be reversed if the POD is ever deleted (for example: during an update). To edit one of these, copy to /home/tbutil/actionScripts (using the same base name) and edit the copy. |
| /home/tbutil/actionScripts | Yes | Custom scripts, or editted versions of the supplied scripts.|

If a script in /home/tbutil/actionScripts has the same name as one in /usr/local/actionScripts then the former one overrides the latter.

## Script format

All scripts must have an extension of ".sh" and must include the following comments in the header...

| Key | Meaning |
| --- | ------- |
| @enabled | Either "true" or "false" to indicate whether or not the script is enabled. |
| @name | The script name that will be shown in the Turbonomic UI. |
| @description | A one-line description of the script. This is effectively just a comment. |
| @entityType | The type of entity. The script can only be applied to actions on entities of this type. |
| @actionType | The type of action to which the script can be applied. |
| @actionPhase | The action phase to which the script can be applied. |

Valid entityTypes are:

- APPLICATION_COMPONENT
- BUSINESS_APPLICATION
- BUSINESS_TRANSACTION
- BUSINESS_USER
- CONTAINER_POD
- CONTAINER_SPEC
- DATABASE
- DATABASE_SERVER
- DESKTOP_POOL
- DISK_ARRAY
- PHYSICAL_MACHINE
- IO_MODULE
- LOGICAL_POOL
- SERVICE
- STORAGE_CONTROLLER
- STORAGE
- SWITCH
- VIEW_POD
- VIRTUAL_MACHINE
- VIRTUAL_VOLUME
- WORKLOAD_CONTROLLER

Valid actionTypes are:

- ADD_PROVIDER
- CHANGE
- CROSS_TARGET_MOVE
- DELETE
- MOVE
- MOVE_TOGETHER
- PROVISION
- RECONFIGURE
- RESIZE
- RESIZE_CAPACITY
- RIGHT_SIZE
- SCALE
- START
- SUSPEND
- TERMINATE

Valid actionPhases are:

- AFTER_EXECUTION
- APPROVAL
- ON_GENERATION
- POST
- PRE
- REPLACE

For example:

```shell
#! /bin/bash

# @enabled: false
# @name: VmMovePre
# @description: Execute this script in preperation for a VM Move
# @entityType: VIRTUAL_MACHINE
# @actionType: MOVE
# @actionPhase: PRE

... script code follows here ...
```

## Registering the script server

Turbonomic needs to discover the POD and the scripts it contains, but first you should configure the Turbonomic credentials for the POD.

1. Log in to the POD using the command `kubectl exec -ti deploy/tbutil-actionscripts -- /bin/bash`
2. Configure credentials using the command `tbutil save credentials`.
    - **IP address or hostname**: It is mandatory to give the answer "`nginx`" (this is the default anyway).
    - **API/UI User name**: Give the name of a user with admin rights. The default of `administrator` is usually good.
    - **password**: Give the user's password
3. Ensure that the action scripts you want to register are correct, as described above.
4. Register the script server by running the command: `add-actionscript-target`


Note that it can take 10 or so minutes for the scripts you have defined to be visible to the Turbonomic policy editor UI.
