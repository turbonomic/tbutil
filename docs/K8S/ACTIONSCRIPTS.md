# TBUtil Action Scripts Pod

| Label          | Value       |
| -------------- | ----------- |
| Date           | 16 Jun 2021 |
| Author         | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil version | 2.0a |


The TBUtil actionscript flavoured pod provides a useful base for writing Turbonomic actions scripts, and a tool to assist in deploying them.

It also provides a couple of dummy template scripts that do nothing, but that can be used as a starting point for creating your own.


## Action scripts - product documentation

Turbonomic action scripts are documented in the product's on-line user guide, which you can read at https://docs.turbonomic.com.

To find the relevant section, select the html version of the user guide and browse to..
- Turbonomic reference / Working with policies / Automation policies / Action orchestration

Note that the information about the context in which a script is being called is passed to it via environment variables and a JSON document on it's standard input.


## Configuring the scripts

Setting up a script involves the steps described in the documentation. The TBUtil astionscript pod helps to simplify some of them for you.

The high-level steps are ..

- Write the script and install it on a system where it can be reached using SSH.
    - _the TBUtil actionscript flavour pod provides such a platform_.
- Create a manfest file that describes your script as per the documentation.
    - _the TBUtil pod has a script that does this for you based on "magic comments" you supply in your script_.
- Create a Turbonomic Orchestrator target and configure it with the address of the SSH service, the name of the manfiest file, the user name and private key.
    - _the script also does this for you_.
- Configure policies using the Turbonomic UI to call the scripts at the desired steps of their workflows.


## Installing the pod

Install the container as a K8S pod by following [these instructions](INSTALL.md) using the word "actionscripts" as the pod flavour.

Once installed, you can set up the scripts and then register the script server with Turbonomic.

The scripts need to be placed in one of two locations (described below) and include some special comments (also described below). Once these have been placed into the pod, the `add-actionscript-target` script can be used to complete the process.


## Script location

The action scripts in the pod live in one of two directories.

| Directory | Persistent? | Description |
| --------- | ----------- | ----------- |
| /usr/local/actionScripts | No | Contains scripts that are supplied with the container image (or images that are based on it). Any edits made to these files will be reversed if the pod is ever deleted (for example: during an update). To edit one of these, first copy it to /home/tbutil/actionScripts (using the same base name) and edit the copy. |
| /home/tbutil/actionScripts | Yes | Custom scripts, or editted versions of the supplied scripts.|

If a script in /home/tbutil/actionScripts has the same name as one in /usr/local/actionScripts then the `add-actionscript-target` utility (described below) causes the former one to be used in place of the latter.


## Script format

All action scripts to be implemented on the pod (and be configured using `add-actionscript-target`) must have an extension of ".sh" and include the following "magic" comments in the header...

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

Here's a valid example...

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

## Coding a new script.

When using the TBUtil action script pod, we recommend writing your scripts using the BASH shell language and following the conventions that allow the `add-actionscript-target` tool to recognise them. You should...

- Place your script in /home/tbutil/actionScripts.
- Make it executable:
    - Give it execution rights using `chmod +x FILENAME`
    - Give it a first line, reading `#! /bin/bash`
    - Give it the extension "`.sh`".
- Populate the magic comments noted above.
- Place any configuration and other files it uses and that need to be persistent in /home/tbutil or a child directory.

Your code can:

 - Inspect the JSON document passed on its standard input using [jq](https://stedolan.github.io/jq) or `tbscript`.
 - Inspect the environment variables (see the product documentation for the values to expect).
 - Query the Turbonomic REST API using `tbutil` or `tbscript`.
 - Take any other actions that it needs, using the available linux commands.

Your code should:

 - Avoid CPU or Memory-intensive actions.
 - Check errors and log them to a file of your choice.

If your script needs Alpine linux packages that are not installed in the supplied pod, then you can create your own container using ours as the "FROM" base in the Dockerfile, and add the packages you need to that.


## Registering the script server

Turbonomic needs to discover the pod and the scripts it contains, but first you should configure the Turbonomic credentials for the pod.

1. Log in to the pod using the command `kubectl exec -ti deploy/tbutil-actionscripts -- /bin/bash`
2. Configure credentials using the command `tbutil save credentials`.
    - **IP address or hostname**: The answer is almost certainly "`nginx`" (this is the default anyway).
    - **API/UI User name**: Give the name of a user with admin rights. The default of `administrator` is usually good.
    - **password**: Give the user's password
3. Ensure that the action scripts you want to register are correct, as described above.
4. Register the script server by running the command: `add-actionscript-target`


Note that it can take 10 or so minutes for the scripts you have defined to be visible to the Turbonomic policy editor UI.
