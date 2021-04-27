# TBUtil Hot/Warm Standby POD

| Label          | Value       |
| -------------- | ----------- |
| Date           | 27 Apr 2021 |
| Author         | Chris Lowth - chris.lowth@turbonomic.com |
| TBUtil version | 1.3g |
| Script Version | Phase 1 of 2 |

Important: This tool should be installed in the WARM instance K8S cluster.

The tool copies the following configuration elements..

- Custom groups
- Custom placement and automation policies
- Schedules
- Custom templates
- SMTP configuration
- HTTP Proxy configuration
- Persistence configuration
- Dashboards and user home page changes (in phase 2).

## Dependencies and notes

The following points should be noted prior to deploying the hot/warm logic.

- The hot and warm instances should be running the exact same version of Turbonomic.
- The two instances should have the same set of targets, which have been configured to match EXACTLY.
    - The spelling and letter case used for the host name and all other parameters must match.
    - The same user accounts must be used.
    - All "hot" instance targets must be present in the "warm" instance.
    - "warm" must not have any targets that are not also present in "hot".
    - All targets on both instances should be fully validated.
- The tbutil-hotwarm pod should be deployed on the **warm** instance following the steps below.
- Network routing and firewalls should allow the tbutil-hotwarm pod on the warm instance to access the hot instance on port 443 (the Turbonomic REST API port).
- If full mirroring of dashboards and custom home pages is required, then the warm instance must be able to access the MySQL database on the hot instance via port 3306. Without this in place, only dashboards belonging to the adminstrator user can be mirrored.
- The name and password for an administrator needs to be known for both instances. If the password is changed in either instance then the change must also be made to the configuration of the hot/warm logic by re-running the "hot-warm-setup" command (as in step 4, below).
- The "hot-warm.log" file should be reviewed from time to time to verify that the logic is not experiencing any issues.
- Schedules that end in the past cannot be migrated, and neither can policies that use them. You should consider deleting or updating these policies or schedules.
- Group and other object name duplication can cause problems. Review the hot-warm.log file for details.
- Policies or dashboards that are scoped to objects that have been deleted in the "hot" cannot be migrated. You should fix these in the hot instance.
- If the HTTP proxy uses a password, the migration of that element will not currently work.

## Installation

### Step 1: Install the POD

Install the container as a K8S POD by following [these instructions](INSTALL.md) with "hotwarm" as the POD flavour.

### Step 2: Configure

This step is not required if you are updating from the earlier release because the configuration is stored in the persistent volume (unless you have deleted the PV, of course).

Log in to the POD using "bash"

```shell
kubectl exec -it deploy/tbutil-hotwarm -- /bin/bash
```

From inside the POD, run the command "hot-warm-setup" to set up the credentials for local (warm) and remote (hot) instances and define the time when the script should run.

```shell
hot-warm-setup
```

Answer the questions asked.

Once completed, exit the POD shell session by typing the command `exit`.

## Fail over

If the "hot" system fails, the steps to take are.

- If possible: turn all actions off in the hot system using the UI.
    - Settings / Policies / Defaults / Global Defaults / Disable all actions = on
- Shut the hot system down completely (prevent it from restarting).
- Scale down the tbutil-hotwarm POD on the warm system using the command:
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
- Start the tbutil-hotwarm POD on the warm system using the command:
    - `kubectl scale --replicas=1 deploy/tbutil-hotwarm`
