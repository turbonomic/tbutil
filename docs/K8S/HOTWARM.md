# TBUtil Hot/Warm Standby Pod

| Label          | Value       |
| -------------- | ----------- |
| Date           | 7 Sep 2021 |
| Author         | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil version | 2.0h |


## Introduction

The tool copies the following configuration elements from an active ("hot") instance to a running standby ("warm" or "mirror") instance.

- Custom groups.
- Custom placement and automation policies.
- Schedules.
- Custom templates.
- SMTP configuration.
- HTTP Proxy configuration.
- Persistence configuration.
- Targets (but see notes about passwords etc).
- AD server configuration.
- AD users and groups.
- Local users (but see notes about passwords).
- Dashboards and user home page changes (see notes below).

It does not copy:

- Historic metrics.
- Action history.
- Action Script targets.
- Custom report definitions.
- Plans.
- Reservations.
- Billing and cost configuration.
- Licenses.
- Feedback, diagnostic or logging levels.

Since the two instances target the same infrastructure, all actions are disabled in the warm and should only turned on in the event of a failure of the hot instance.

## Dependencies and notes

The following points should be noted prior to deploying the hot/warm logic.

- The tool works with Turbonomic version 8 and CWOM 3 only.
  - It can not be used with IWO or earlier versions of CWOM or Turbonomic.
- Both the hot and warm instances must be up and have a valid license.
  - The licensed features on the two instances must be the same.
- The hot and warm instances should be running the identical versions of Turbonomic. If you update the hot instance, you should also update the warm to the same release. The mirroring will not work if there is a mismatch.
- If you choose to configure the targets on the warm by hand (see the notes below), then they must be configured to match their counterparts in the hot EXACTLY. This means:
  - The spelling and letter case used for the host name and all other parameters must match.
  - The same user accounts must be used.
  - All "hot" instance targets must be present in the "warm" instance.
  - "warm" must not have any targets that are not also present in "hot".
  - All targets on both instances should be fully validated.
- The tbutil-hotwarm pod should be deployed and used on the **warm** instance following the steps below. If mirroring of dashboards and user home page changes is required, then a slave copy of the pod on the hot is also required.
- Network routing and firewalls should allow the tbutil-hotwarm pod on the warm instance to access the following TCP/IP ports on the hot instance:
  * port 443 (the Turbonomic REST API port).
  * port 31322 (for a trusted SSH connection, but only if you require mirroring of dashboards).
- The name and password for an administrator needs to be known for both instances. If the password is changed in either instance then the change must also be made to the configuration of the hot/warm logic by re-running the "hot-warm-setup" command.
- The "hot-warm.log" file (in /home/tbutil on the warm instance) should be reviewed from time to time to verify that the logic is not experiencing any issues.
- Schedules that end in the past cannot be migrated, and neither can policies that use them. You should consider deleting or updating these policies or schedules.
- Group and other object name duplication can cause problems. Review the hot-warm.log file for details.
- Policies or dashboards that are scoped to objects that have been deleted in the "hot" cannot be fully migrated. You should fix these in the hot instance.
- If the HTTP proxy uses a password, the migration of that element will not currently work.


***Dashboards***

In order to copy dashboards (particularly those created by users other than the administrator), the tool needs access to the MySQL database on both the hot and warm systems.

In this case you will run the tool, as usual, on the warm system, and it will use an "ssh" connection to the hot to collect the information needed. To allow this to happen, we need to install the tool on both instances and set up a one-way SSH trust between them. The process involved in setting this up is handled for you by the `hot-warm-setup` script.

Although the tool is installed on both instances in this case, you will still drive the configuration and operation of the pod from the warm instance alone. The hot instance pod acts as the warm's slave in this context.

If you dont need to copy dashboards then the hot/warm pod should only be installed on the warm instance.


***Target secrets***

The majority of targets have at least one "secret" configuration value (such as a password or token). For very good reasons of security, Turbonomic's API doesn't provide a facility for exporting them.

This means that mirroring targets needs to involve:
* Either - using random (or user-specified) known-to-be-wrong secrets (for new targets) which the administrator subsequently corrects using the UI. This is the approach taken by the default configuration. When this option is used, secrets on any existing targets in the warm are not changed.
* Or - configuring the targets in the warm instance by hand using the UI before running the tool.
* Or - providing a JSON file that contains the needed secret values (optionally: encrypted).
* Or - providing some custom code and data to extract the secrets from an accessible source (this involves writing some script code).

So: you either need human intervention to supply the right secret strings OR you need a JSON file or custom script to do the work (Turbonomic field staff can assist you with these options).


***Target dependencies***

It is important to understand that the discovery of targets can often be a pre-requisite for the correct population of groups, policies, dashboards, users and user groups that depend on the entities that they discover.

And further: target discovery takes time.

For these reasons, it is likely that the tool will report group or scope errors when it is first run and following the discovery of new targets on the warm instance. These errors will show up in the tool's log file. The good news is that these issues are likely to resolve when the tool is next run following a time delay, typically during the following day's run.

Some targets use group scopes in their configuration. These targets may also fail to validate if the group on which they depend has not been properly discovered or cloned. So there may be a chain of dependencies at play:
* Scoped targets depend on groups
* But those groups may also depend on un-scoped targets.

This can mean that it actually takes three runs of the tool following the creation of new targets in the hot instance to reach stability and provide a full copy. However the good news is: the risk involed is mitigated by the fact that all the required entity definitions are held in the export files stored in a persistent volume in the warm instance's file system, which means that even if the hot instance fails before the warm instance has a full mirror, the situation can quickly be remedied by re-running the "import" phase of the tool.


***Local users***

The Turbonomic API does not expose local user passwords (quite rightly so). This means that the tool cannot copy passwords when copying local users. Two approaches to this problem are supported. You can:
* Either specify that **new** local users are allocated random passwords (or a fixed one), which the administrator must subsequently change using the warm system's UI.
* Or: supply JS code that returns the password to use for new users.

Note #1 - passwords for existing local users are never changed by the tool.

Note #2 - the "administrator" user is never touched by the import process.


## Installation

The hot/warm tool is installed as a K8S pod in the Turbonomic name space in the warm instance.

If your requirements include the mirroring of dashboards, then a second copy of the pod needs to be installed on the hot instance as well, but nearly all the configuration and control will still be done from the warm.


### Step 1: Install the pod(s)

Install the container as a K8S pod onto the warm instance by following [these instructions](INSTALL.md) using the word "hotwarm" as the pod flavour.

If your requirements including the mirroring of dashboards, then:
* install the pod on the hot system as well, following the same instructions as above for the warm.
* once the pod has been installed on the hot, give it's "tbutil" user a temporary password..
  * `kubectl get pods`  (note the tbutil-hotwarm pod's full name)
  * `kubectl exec -ti TBUTIL-HOTWARM-POD-FULL-NAME-HERE -- sudo passwd tbutil`
  * note: you should NOT do this on the warm instance.
  * also note: this temporary password will be deleted for you automatically during the configuration process.


### Step 2: Configure the mechanism's options.

The mechanism can be configured by editting the `hotwarm.json` file to fine tune its actions. In most cases, the supplied file contains suitable default values that you wont need to change.

If you need to edit the file, copy it from `/usr/local/config/hotwarm.json` to `/home/tbutil/hotwarm.json` on the warm instance and edit the copy. If you dont do it this way, your changes will be lost if the pod is ever stopped and recreated.

Note: do not edit the file on the hot instance.

The configuration file is JSON formatted and contains a block of parameters per entity type that can be mirrored. These are..
* active_directory
* automation_policies
* dashboards
* groups
* http_proxy
* local_users
* placement_policies
* retention
* schedules
* smtp
* targets
* templates
* topology_definitions

Each block has an `enabled` parameter that indicates whether entities of that object type should be mirrored or not. A value of `true` causes the type to be included. `false` causes it to be skipped.

Some blocks (but not all) have a boolean `clean` parameter. This indicates whether candidate objects of that type that exist in the warm but do not exist in the hot should be removed from the warm. It can be `true` (to perform the cleanup) or `false` (to leave redundant objects in place). By default (unless you change the configuration) this flag is set to `true` for all the relevant entity types.

Note: the "targets" block does not support the "clean" flag. Excess targets must be deleted (if desired) by hand using the Warm instance UI.

In addition to these common settings, the following advanced options are available:

| Section          | Setting name       | Description |
| ---------------- | ------------------ | ----------- |
| active_directory | groups             | Sub-block containing "enabled" and "clean" options for AD groups. |
| active_directory | users              | Sub-block containing "enabled" and "clean" options for AD users. |
| dashboards       | include_home_pages | Boolean: whether or not to include user's individual customised home pages when migrating dashboards. |
| local_users      | fixed_password     | Optional fixed password to use for any new local users. |
| local_users      | get_passwords      | Optional name of file containing JS code to return passwords to use for new local users (see note#1) |
| local_users      | random_passwords   | Boolean: should new local users be assigned random passwords? |
| targets          | get_secrets        | Optional name of file containing JS code that returns secrets for targets (see note#1) |
| targets          | secrets_file       | Optional name of a JSON file that contains the secrets for your targets (see note#1 and note#2). |
| targets          | random_secrets     | Boolean: should secret fields of new targets be assigned random values? |

*Note#1: If you are cloning dashboards (and hence have a copy of the pod installed on the hot instance) then the JS code file and any files it refers to need to be stored on the file system of the HOT instance - ideally in the persistent volume. If you are not cloning dashboards then these files should live on the WARM instance.*

*Note#2: The format of the required file is described in [here](https://github.com/turbonomic/tbutil/wiki/_target-secrets-file)*

The configuration file also contains a section called "unsafe" that includes options that should NOT normally be set to true. In some rare cases you may consider turning them on, however we suggest that you seek advise from Turbonomic's professional services team first.

### Step 3: Configure credentials and CRON job

This step is not required if you are updating from the earlier release because the configuration is stored in the persistent volume (unless you have deleted the PV, of course).

Execute an interactive BASH shell in the pod on the warm instance..

```shell
kubectl exec -it TBUTIL-HOTWARM-POD-FULL-NAME-HERE -- /bin/bash
```

From inside the pod, run the command "hot-warm-setup" to set up the credentials for local (warm) and remote (hot) instances and define the time when the script should run.

```shell
hot-warm-setup
```

Answer the questions asked.

Once completed, exit the pod shell session by typing the command `exit`.

## Fail over

If the "hot" system fails, the steps to take are.

- If possible: turn all actions off in the hot system using the UI.
    - Settings / Policies / Defaults / Global Defaults / Disable all actions = on
- Shut the hot system down completely (prevent it from restarting).
- Scale down the tbutil-hotwarm pod on the warm system using the command:
    - `kubectl scale --replicas=0 deploy/tbutil-hotwarm`
- Turn actions on in the warm instance using the UI
    - Settings / Policies / Defaults / Global Defaults / Disable all actions = off

Now the warm system is managing your environment.

### Fail back

Once the "hot" is ready to be restarted, take these steps in this order..

- Turn actions off in the warm instance using the UI
    - Settings / Policies / Defaults / Global Defaults / Disable all actions = on
- Start the "hot" instance and verify that it is fully booted, including all the Turbonmic Pods.
    - Check that the system is fully functioning using the UI, but note: if "Disable all actions" is on then no actions will be seen.
- Turn actions on in the "hot" instance (if they are currently off).
    - Settings / Policies / Defaults / Global Defaults / Disable all actions = off
- Re-Start the tbutil-hotwarm pod on the warm system using the command:
    - `kubectl scale --replicas=1 deploy/tbutil-hotwarm`
- If your use-case involves mirroing dashboards then make sure the tbutil-hotwarm pod is present and running on the hot instance too. If it's not, then re-install it and re-run the configuration step from the warm (see the instructions above).
