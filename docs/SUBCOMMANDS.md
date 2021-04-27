# TBUtil 1.3g Sub Commands

*Last updated: 27 Apr 2021*

## To do

- custom report handling
- handling of schedules - list / export / import (etc)

## Index of commands by topic

| Topic   | Commands |
| ------- | -------- |
| REST functions | [`delete`](#delete), [`get`](#get), [`post`](#post), [`put`](#put) |
| actions | [`accept action`](#accept-action), [`list actions`](#list-actions), [`list accepted actions`](#list-accepted-actions), [`print action`](#print-action), [`reject action`](#reject-action) |
| clusters | |
| credentials | [`save credentials`](#save-credentials), [`downgrade credentials`](#downgrade-credentials), [`upgrade credentials`](#upgrade-credentials) |
| dashboards | [`delete dashboard`](#delete-dashboard), [`export dashboard`](#export-dashboard), [`import dashboard`](#import-dashboard), [`list dashboards`](#list-dashboards) |
| groups | [`create static group`](#create-static-group), [`delete group`](#delete-group), [`export group`](#export-group), [`import group`](#import-group), [`list groups`](#list-groups), [`list group members`](#list-group-members), [`list related groups`](#list-related-groups) |
| help | [`help`](#help), [`get swagger`](#get-swagger), [`opensource licenses`](#opensource-licenses), [`what`](#what) |
| markets | [`delete market`](#delete-market), [`list markets`](#list-markets), [`print market`](#print-market) |
| license | [`delete license`](#delete-license), [`import license`](#import-license), [`list licenses`](#list-licenses), [`print license`](#print-license) |
| notifications | [`list notifications`](#list-notifications) |
| plans (scenarios) | [`delete scenario`](#delete-scenario), [`export scenario`](#export-scenario), [`import scenario`](#import-scenario), [`list scenarios`](#list-scenarios) |
| pms | [`list pms`](#list-pms) |
| policies | [`delete policy`](#delete-policy), [`export policy`](#export-policy), [`export all policies`](#export-all-policies), [`import policy`](#import-policy), [`list policies`](#list-policies), [`print policy changes`](#print-policy-changes), [`reset policy`](#reset-policy) |
| reports | [`delete report instance`](#delete-report-instance), [`delete report schedule`](#delete-report-schedule), [`download report instance`](#download-report-instance), [`execute report query`](#execute-report-query), [`export report`](#export-report), [`list report instances`](#list-report-instances), [`list report queries`](#list-report-queries), [`list report schedules`](#list-report-schedules), [`list report templates`](#list-report-templates) |
| statistics | |
| targets | [`crypt`](#crypt), [`delete target`](#delete-target), [`export target`](#export-target), [`import target`](#import-target), [`list targets`](#list-targets), [`rediscover target`](#rediscover-target), [`validate target`](#validate-target) |
| templates | [`delete template`](#delete-template), [`export template`](#export-template), [`import template`](#import-template), [`list templates`](#list-templates) |
| users | [`create local user`](#create-local-user), [`delete user`](#delete-user), [`export user`](#export-user), [`import user`](#import-user), [`list users`](#list-users) |
| vms | [`list vms`](#list-vms) |


## Common options

Many of TBUtil's sub commands support a sub-set of common formatting options. These are..

| Option | Meaning |
| ------ | ------- |
| `-j`   | Output as a JSON text document |
| `-l`   | Output in long text format as opposed to just listing the element UUIDs |
| `-s`   | Format the output using a [custom formatter script](#formatter-scripts) (written in JavaScript). The name of the file containing the script follows the option itself.<br>Example: `-s myscript.js` |
| `-x`   | Output to a named spread-sheet file. The format of the file depends on its extension.<br>Supported types are: `.xlsx`, `.csv`, `.lst`, `.html` or `.txt`.<br>Example: `-x clusters.xlsx` |
| `-y`   | Output as a YAML text document |
| `-columns` | The output is limited to just the specified columns. These are specified as a single string of comma-delimited numbers. Column 0 is the first column.<br>Example: `-columns "0,2,3,5"` |

The `-x` file types are indicated by the file extension. Supported extensions are..

| Extension | Output file format |
| --------- | ------------------ |
| `.csv` | A standard CSV file with...<br>- A header line.<br>- Comma-delimited fields.<br>- One record per row.<br>- Fields will be quoted if required to handle fields that contain commas or new lines. ||
| `.lst` | A simple listing with...<br>- One record per row.<br>- No header line.<br>- Fields are delimited by the pipe symbol.<br>- No quoting is used so fields that contain pipes or newlines are challenging to parse. |
| `.txt` | A text file containing the same format as the `-l` option produces. |
| `.html` | A text file containing an HTML table. |
| `.xlsx` | An Excel spread sheet. |

The special names "@.csv", "@.lst", "@.txt" and "@.html" can be used to write the desired format to the standard output ("@.xlsx" is NOT supported).

The "import" commands typically take one or more of ..

| Option | Meaning |
| ------ | ------- |
| `-create` | the imported item will be created (it must NOT already exist). |
| `-edit` | the imported item will be updated (it MUST already exist).
| `-dry-run` | the command should take all it's actions EXCEPT for final step of making the actual change. This can be useful for testing purposes. |

If neither `-create` nor `-edit` are specified then the user will be created if it doesnt exist, or editted if it does - as appropriate.

## Credentials

ADD INFO HERE ON THE HADLING OF CREDENTIALS.

## Formatter Scripts

A number of commands dislay lists of data in a variety of formats, depending on the command line options used. Many of these commands allow you to write your own custom formatting logic in tbscript's JavaScript dialect. The script can then be used by specifying the `-s` option on the command line (but only for commands that support it).

For example: you could write a script called `vm-summary.js` and use it to format the output of the [`list vms`](#list-vms) command using the syntax ...

```
tbutil list vms -s vm-summary.js
```

When this feature is used, the tbutil command collects all the data needed by making one or more Turbonomic API calls and optionally performs some basic pre-processing of the result. The tool then places the data into a JS object (which the script can reference using the `tree` variable) and calls the script. The script typically inspects the contents of "tree" and uses "`print...()`" functions to output the data to screen. Alternatively, the script can use one of the `tbutil` plugins to write to other file types or systems (eg: MySQL. SqLite, Excel, XML, etc).

In the vast majority of cases, the `tree` object contains an array of JS object records, but there are small number of instances where `tree` is a single JS hash object.

Before writing your script, you will probably want to see what the data in `tree` looks like. Two ways of doing that are..

1. Using the `-j` option on the command line instead of `-s`.
2. Write a script to dump the `tree` object using the `printJson` JS function. The simplest form of such a script just needs to contain the single line: `printJson(tree)`.

When filter script finishes, it can use the JS `return` statement to indicate how the tool should exit. The actions taken depend on the data type returned, as follows..

| Type | Action |
| ---- | ------ |
| integer | exit with the specified system exit code. By convention: 0 means "ok", 1 means "warning" and 2 means "error". Other codes between 0 and 255 can be used. |
| string | the sting is printed to the standard output and the program exits with status 0. |
| object | the object is dumped in JSON format and the program exits with status 0. |

## Filter scripts

If the `-jsfilter` option is supported and specified for a sub command, then the tool loads the named JS script (which must be written in tbscript-compatible JavaScript and define a function called 'include') and runs its `include()` function for each list entry. Only the sub-set of entries for which the function returns true will be included in the listing.

Here's an example filter script for the "list groups" command that causes it to list only CLOUD groups who's display names start with "VM"...

```
function include(group) {
	return group.environmentType === "CLOUD" && group.displayName.hasPrefix("VM");
}
```

If the file "cloud-vms.js" contains the above script, you can use it to filter the output of "list groups" as follows...

```
tbutil list groups -l -jsfilter cloud-vms.js
```

You can also specify a simple JS expression instead of a script file name by wrapping it in brackets. In this case, the expression is evaluated as if it were part of the following script..

```
function include($) {
   return ( YOUR_EXPRESSION_HERE );
}
```

Here's an example of using this feature to list VMs with the word "chris" in their names..

```
tbutil list vms -l -jsfilter '($.displayName.match(/chris/i))'
```

## Sub commands

### accept action

**Usage:**

```
tbutil [{cred}] accept action {action_uuid}
```

Accepts the pending action identified by it's uuid. This is equivalent to selecting the action in the UI and clicking "execute".

The action_uuid can be determined using `list actions` or similar commands.

**See also:**
[`list actions`](#list-actions),
[`list accepted actions`](#list-accepted-actions),
[`print action`](#print-action),
[`reject action`](#reject-action)

### cluster headroom

See: [`print cluster headroom`](#print-cluster-headroom)

### create local user

**Usage:**

```
tbutil [{cred}] create local user {user_name} {role} {password}
```

Creates the named local user (which must not already exist).

The `role` must be one of the recognised Turbonomic user roles, namely:

- administrator
- advisor
- automator
- deployer
- observer

Example:

```
tbutil @my_instance create local user mickey advisor "good boyY plut0!"
```

The tool displays the JSON description of the new user. Note that the fields in the returned JSON may not be the same for all releases (for example: XL does not return an UUID whereas v6 does).

**See also:**
[`delete user`](#delete-user),
[`export user`](#export-user),
[`import user`](#import-user),
[`list users`](#list-users)

### create static group

The "create static group" command can be called using one of three different syntaxes...

```
tbutil [{cred}] create static group [-j] [-edit|-create] {name} {member_type} -u {member_id ...}
```

or

```
tbutil [{cred}] create static group [-j] [-edit|-create] {name} {member_type} -f {uuid_file}
```

or

```
tbutil [{cred}] create static group [-j] [-edit|-create] [-ignore-case] [-active-only] [-cache] {name} {member_type} -F {displayName_file}
```

In the first usage (with the "`-u`" option), the list of UUIDs of the objects to form the group
are specified on the command line. You can create an empty group by listing no member_ids.

In the second (with the "`-f`" option), the list of member UUIDs is read from the file which
may either be a text file with one UUID per line or a JSON array of UUID strings.

In the third (with the "`-F`" option), the list of member display names is read from the file
which may either be a text file with one name per line or a JSON array of names.
NOTE: This is by far the SLOWEST option because it needs to retrieve the full list of ALL
entities of the give type in order to be able to map names to UUIDs before creating the group.

The `-ignore-case` option causes the search for members by name to be done in a case-insenstive
manner. Without this option, member names in the file must match the display names in Turbonomic
exactly.

If the `-active-only` option is used in the third syntax, then any entities that are found that have
a state other than "ACTIVE" will be omitted. Note that not all classes of entity differentiate
between active and idle - meaning that using this option for classes that dont will result in an
empty group being created.

The `-edit` option indicates that the group must already exist, and the list of members is to be
updated. The `-create` option indicates that the group must NOT exist and that it is to be created
from scratch. If neither of these options is specified then the group will be created if it does
not exist, or updated if it does (retaining it's UUID)

The "`name`" is the display name to be given to the new group.

The "`member_type`" is the class of object to form the new group. For example the
string "VirtualMachine" is a commonly used one.

The "`member_id`"s are the UUIDs of the objects to form the new group.

The "`uuid_file`" or "`displayName_file`" is the name of a pure text or JSON file, or the
special value "-", in which case the input is read from stdin.


**See also:**
[`delete group`](#delete-group),
[`export group`](#export-group),
[`import group`](#import-group),
[`list groups`](#list-groups),
[`list group members`](#list-group-members),
[`list related groups`](#list-related-groups)

### crypt

The "crypt" command is used to add encrypted passwords to user and target export files. It has six modes of operation..

```
tbutil crypt
```

This is the tool's interactive mode. It presents the following menu...

```
c: create key file
d: delete key file
t: add password to 'target' json file
u: add password to 'user' json file
q: quit
```

These actions are the same as those listed below for the CLI syntaxes, except that the file names are requested interactively rather than being specified on te command line.

```
tbutil crypt -create-key
```

The `-create-key` option is used to create the random encryption key file used by `-target`, `-user` and `-encode`. The key must exist before those commands can be used. The key is stored in the file $HOME/.tbutilkey.

Note 1: If this file is deleted or changed then tbutil will no longer be able to import the users and targets who's passwords have been stored in the export files.

Note 2: If you wish to copy the import files over to another system and import them by running "tbutil import ..." there, you should also copy the .tbutilkey file over.

Note 3: This command is normally run by the tbutil `install` program so you will not normally need to run it yourself.

```
tbutil crypt -delete-key
```

The `-delete-key` option can be used to delete the key file created with `-create-key`.

Note: This will effectively invalidate any user or target export files who's passwords have been written using the now-deleted key.

```
tbutil crypt -target {target_file}
```

The `-target` option adds the encrypted fields (passwords etc) to a target export file created with [`export target`](#export-target). Note that this **must** be done before the file can used by [`import target`](#import-target).

Note: The command is interactive and asks for the passwords etc from the user but hides what is typed. It also accepts the answers to its questions from an "input redirect" file, in which case the prompts are not displayed.

```
tbutil crypt -user {user_file}
```

The `-user` option adds the encrypted password to a user export file created with [`export user`](#export-user). Note that this **must** be done before the file can used by [`import user`](#import-user).

Note: The command is interactive and asks for the password from the user but hides what is typed. It also accepts the password an "input redirect" file, in which case the prompts are not displayed.

```
tbutil crypt -encode {clear_text}]
```

The `-encode` option prints the encoded version of the supplied clear-text password. This is useful for scripts that create import files and need to patch the passwords directly.

**See also:**
[`export target`](#export-target),
[`import target`](#import-target),
[`export user`](#export-user),
[`import user`](#import-user)

### delete

**Usage:**

```
tbutil [{cred}] delete [-j|-s ..|-y] {path} < {json_body_file}
```

The "delete" command calls the specified raw `DELETE` REST API endpoint and pass the conents of the `json_body_file` as the request body.

**See also**:
[`get`](#get),
[`post`](#post),
[`put`](#put)

### delete ad group

```
tbutil [{cred}] delete ad group {uuid}
```

### delete dashboard

**Usage:**

```
tbutil [{cred}] delete dashboard [-by-name] {dashboard_id_or_name} ...
```

Deletes a dashboard, identified by it's id or (if `-by-name` is specfied) name. Use the [`list dashboards`](#list-dashboards) command to find the ID of the dashboard of interest.

**See also**:
[`export dashboard`](#export-dashboard),
[`import dashboard`](#import-dashboard),
[`list dashboards`](#list-dashboards)

### delete group

**Usage:**

```
tbutil [{cred}] delete [{type}] group [-by-name] [-force] {group_id_or_name} ...
tbutil [{cred}] delete my groups [-v]
```

The singular variant deletes the groups which are specified using their UUIDs or (if the `-by-name` option is used) by their names.

The optional `type` may be "dynamic" or "static" to enforce that only groups of that type are deleted. If the UUID or name of a group that is not of the specified type is given, then an error is reported.

If option `-force` is used, then it is not an error for the identified groups not to exist.

The plural variant deletes all custom groups. Option `-v` causes the tool to be verbose about the actions it is taking.

**See also:**
[`create static group`](#create-static-group),
[`export group`](#export-group),
[`import group`](#import-group),
[`list groups`](#list-groups),
[`list group members`](#list-group-members),
[`list related groups`](#list-related-groups)

### delete license

**Usage:**

```
tbutil [{cred}] delete license {license_id} ...
```

Deletes the software license, identified by it's ID (which can be identified using [`list licenses`](#list-licenses)).

**See also:**
[`import license`](#import-license),
[`list licenses`](#list-licenses),
[`print license`](#print-license)

### delete market

**Usage:**

```
tbutil [{cred}] delete market [-wait] {market_id} ...
```

Deletes the specified market (created as the result of running a plan). Note: this should be a **plan** market, not the live running market.

You can find the market's ID from the output of [`list markets`](#list-markets).

If the market is associated with a plan, then the related scenario objects will also be deleted.

Market deletion normally runs in the background, but you can use the `-wait` flag to wait until the job is complete.

**See also:**
[`list markets`](#list-markets),
[`print market`](#print-market)

### delete policy

**Usage:**

```
tbutil [{cred}] delete automation policy [-d] [-by-name] {policy_id_or_name} ...
tbutil [{cred}] delete all placement policies [-v]
tbutil [{cred}] delete placement policy [-by-name] {policy_id_or_name} ...
```

Delete the specified placement or automation policy by ID or name (if the `-by-name` option is used).

If you specify `-d` then any associated schedule will also be deleted if no other policies refer to it.

The `all` variant deletes all the existing placement policies. Option `-v` makes this verbose. See `reset policy` for the command to do something similar for autmation policies.

**See also:**
[`export all policies`](#export-all-policies),
[`export policy`](#export-policy),
[`import policy`](#import-policy),
[`list policies`](#list-policies),
[`print policy changes`](#print-policy-changes),
[`reset policy`](#reset-policy)

### delete report instance

**Usage:**

```
tbutil [{cred}] delete report instance {id_or_filename} ...
```

Deletes the specified report instances from the Turbonomic file system. Use the [`list report instances`](#list-report-instances) command to get the IDs of the reports to delete.

**See also:**
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### delete report schedule

**Usage:**

```
tbutil [{cred}] delete report schedule {id} ...
```

Deletes the specified report schedules from Turbonomic. Use the [`list report schedules`](#list-report-schedules) command to get the IDs of the schedules to delete.

**See also:**
[`delete report instance`](#delete-report-instance),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### delete scenario

**Usage:**

```
tbutil [{cred}] delete scenario {scenario_id} ...
```

Deletes the specified plan scenarios, the IDs of which can be found using [`list markets`](#list-markets) or [`list scenarios`](#list-markets).

**Note:** it is better practice to use [`delete market`](#delete-market) to delete the plan market and related scenarios than to use this command (except, maybe, where some scenario garbage collection is needed).

**See also:**
[`delete scenario`](#delete-scenario),
[`export scenario`](#export-scenario),
[`import scenario`](#import-scenario),
[`list scenarios`](#list-scenarios)


### delete schedule

```
tbutil [{cred}] delete all schedules [-v]
```

### delete target

**Usage:**

```
tbutil [{cred}] delete target [-force] [-by-name] {target_id_or_name} ...
```

Deletes the targets identified by their IDs or names (if `-by-name` is specified) on the command line. You can find the IDs of the existing targets using [`list targets`](#list-targets).

If option `-force` is used, then it is not an error for the identified targets not to exist.

**See also:**
[`crypt`](#crypt),
[`export target`](#export-target),
[`import target`](#import-target),
[`list targets`](#list-targets),
[`rediscover target`](#rediscover-target),
[`validate target`](#validate-target)

### delete template

**Usage:**

```
tbutil [{cred}] delete template [-force] [-by-name] {template_id_or_name} ...
tbutil [{cred}] delete templates [-v]
```

Deletes the templates identified by their IDs or names (if `-by-name` is specified) on the command line. You can find the IDs of the existing templates using [`list templates`](#list-templates).

The plural variant of the command deletes ALL the custom templates (system-generated ones are left in place). The `-v` option can used to output verbose messages.

If option `-force` is used, then it is not an error for the identified templates not to exist.

**See also:**
[`export template`](#export-template),
[`import template`](#import-template),
[`list templates`](#list-templates)

### delete user

**Usage:**

```
tbutil [{cred}] delete user [-force] [-by-name] {user_name_or_id}
```

Deletes the user identified by his/her name or ID (aka: UUID). Use the [`list users`](#list-users) command to find the known users and their IDs.

The `-by-name` flag indicates that the user name is provided instead of the UUID.

The `-force` flag means that an attempt to delete a non-existant user is NOT an error, and is silently ignored.

**See also:**
[`create local user`](#create-local-user),
[`export user`](#export-user),
[`import user`](#import-user),
[`list users`](#list-users)

### downgrade credentials

**Usage:**

```
tbutil downgrade credentials
```

Reverses the effect of [`upgrade credentials`](#upgrade-credentials) and returns the `.tbutilrc` file into the format understood by `tbutil` version 1.1r and earlier.

**See also:**
[`save credentials`](#save-credentials),
[`upgrade credentials`](#upgrade-credentials)

### download report instance

**Usage:**

```
tbutil [{cred}] download report instance {id} {target_file_name}
```

Downloads an existing report instance file. You can find the ID and file name from the output of the [`list report instances`](#list-report-instances) command.

**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### execute report query

**Usage:**

```
tbutil [{cred}] execute report query [-j|-s ..|-y|-x ..] [-columns ..] [-o {csv_file}] {template_id_or_filename} {query_name} [{parameter} ...]
```

This allows you to run a query that is embedded in a report template stored on the Turbonomic instance.

You need to identity the query by is template name and query id. You can find the template names using [`list report templates`](#list-report-templates), and query names for a selected template using [`list report queries`](#list-report-queries) (which also indicates the number of parameters to be passed to the query).

The command supports the following set of [common format_options](#common-options): `-j`, `-s`, `-y`, `-x` and `-columns`.

For queries that return large amounts of rows, this command can consume a lot of memory. In such cases you can use the `-o` option to cause the MySQL plugin to write the ouput directly to the named CSV rather than holding it in memory.

If [`list report queries`](#list-report-queries) shows that the query takes parameters, then the values specified on the command line will be passed to the query.

**Example:**

"`tbutil list report templates -l`" lists existing report template details, of which we select one entry for use ..

```
File Name                                    Category                 Title                                                 
-------------------------------------------  -----------------------  --------------------------------------------
...
vm_group_daily_over_under_prov_grid_30_days  Capacity Management/VMs  Month Based VM Group Over Under Provisioning
...
```

"`tbutil list report queries -l vm_group_daily_over_under_prov_grid_30_days`" gives the following output, showing a potentially interesting query called `underprovisioned_vms` which takes one parameter. From here we can also get a clue that the parameter should be the UUID of a VM group.

```
Query Name                  N. Params  SQL Size  Param Names               
--------------------------  ---------  --------  --------------------------
overprovisioned_vms                 2      2294  n_days, selected_item_uuid
underprovisioned_vms                1      2363  selected_item_uuid        
dormant_vms_count                   1      1487  selected_item_uuid        
customer_image                      1        79  customer_name             
underprovisioned_vms_count          1      2379  selected_item_uuid        
vm_groups                           1       583  selected_item_uuid        
thresholds                          0       552                            
active_over_vms_count               2      2331  n_days, selected_item_uuid
```

We need the UUID of a group in order to run the `underprovisioned_vms` query, and can use [`list groups`](#list-groups) to find it. Once found, we can run the query like this..

```
tbutil execute report query vm_group_daily_over_under_prov_grid_30_days underprovisioned_vms b70b26eb25501faac470c
```

This gives an output like this (this has been contracted to fit here)...

```
instance_name                            thin_provisioned  thin_used  avg_cpu  max_cpu  avg_mem  max_mem ...
---------------------------------------  ----------------  ---------  -------  -------  -------  ------- ...
pankaj.batra - Clone of BarryDEMO        0                 0          0.868    1.666    0.693    0.92    ...
EndreDemo                                0                 0          0.924    1.526    0.367    0.77    ...
VDI-MikeI ZVM                            0                 0          0.971    1.362    0.103    0.49    ...
V0050569C57DD (rds.demo.turbonomic.com)  0                 0          0.989    1.245    0.164    0.99    ...
tess.turbonomic-opsmgr-6.2.11.ova        0                 0          0.877    1.094    0.853    0.96    ...
```


**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### export ad group

```
tbutil [{cred}] export ad group [-j|-s ..|-y] {group_name_or_uuid}
```

### export dashboard

**Usage:**

```
tbutil [{cred}] export dashboard [-j|-s ..|-y] [-by-name] {dashboard_id_or_name}
```

Exports the details of the dashboard identified by the `dashboard_id_or_name` to a JSON text that can be used with [`import dashboard`](#import-dashboard) to recreate it or copy to a different instance of Turbonomic. Use [`list dashboards`](#list-dashboards) to list the available dashboards and determine the ID of the one of interest.

If `-by-name` is used, then the exported dashboard should be identified by it's name instead of it's ID.

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import dashboard`](#import-dashboard).

The supported formatting flags are `-j`, `-s` and `-y`.

**See also:**
[`delete dashboard`](#delete-dashboard),
[`import dashboard`](#import-dashboard),
[`list dashboards`](#list-dashboards)

### export group

**Usage:**

```
tbutil [{cred}] export dynamic|static group [-j|-s ..|-y] [-by-name] [-indirect] {group_id_or_name}
tbutil [{cred}] export my groups [-v] {directory_name}
```

The singular variant exports a specified group by printing a JSON document containing all the details required to recreate it. You would normally use the shells output redirection syntax to save this to a file for later importing.

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import group`](#import-group).

If `-indirect` is specified when exporting a static group, then the export includes the entities in any child groups of the specified group.

The supported formatting flags are `-j` and `-y` for both variants of the command, and `-s` for the "static" version only (see [common formatting options](#common-options)).

The plural variant exports all custom groups to the specified directory (which must not pre-exist). The `-v` option causes the export files to contain the full DTO rather than the contracted version that is otherwise created.

**See also:**
[`create static group`](#create-static-group),
[`delete group`](#delete-group),
[`import group`](#import-group),
[`list groups`](#list-groups),
[`list group members`](#list-group-members),
[`list related groups`](#list-related-groups)

### export persistence config

**Usage:**

```
tbutil [{cred}] export persistence config [-j|-s ..|-y]
```

Exports the persistence configuration (the number of hours, days, months of persisted metrics - etc) as a JSON document that can be re-imported using [`import persistence config`](#import-persistence-config).

**See also:**
[`import persistence config`](#import-persistence-config)

### export all policies

**Usage:**

```
 tbutil [{cred}] export [all] automation policies [-v] {directory_name}
 tbutil [{cred}] export [all] placement policies [-v] {directory_name}
```

These commands create the specified directory (which must not already exist) and record the exported details of the policies in files in there. The directory is suitable for importing using the [`import all policies`](#import-all-policies) commands.

The `-v` option causes the export files to contain the full, unmodified DTO structures for the policies. These files are NOT suitable for re-importing.

**See also:**
[`delete policy`](#delete-policy),
[`export policy`](#export-policy),
[`import policy`](#import-policy),
[`list policies`](#list-policies),
[`print policy changes`](#print-policy-changes),
[`reset policy`](#reset-policy)

### export policy

**Usage:**

```
 tbutil [{cred}] export automation policy [-j|-s ..|-y] [-by-name] [-src ..] [-defaults] {policy_uuid_or_name}
 tbutil [{cred}] export placement policy [-j|-s ..|-y] [-by-name] [-src ..] {policy_id_or_name}
```

Exports the specified placement or automation policy by printing a JSON document that can be used to re-import the same policy using [`import policy`](#import-policy). The policy can be specified by name or ID, which can be discovered using [`list policies`](#list-policies).

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import policy`](#import-policy).

The supported formatting flags are `-j`, `-s` and `-y` (see [common formatting options](#common-options))

The `-src` option can be used to read policy data in from the specified json file (which has been created using the [`list policies`](#list-policies) command with the `-j` option).

The `-defaults` option causes the exported data to contain the default values for the policy rather than the actual ones.

**See also:**
[`delete policy`](#delete-policy),
[`export all policies`](#export-all-policies),
[`import policy`](#import-policy),
[`list policies`](#list-policies),
[`print policy changes`](#print-policy-changes),
[`reset policy`](#reset-policy)

### export report

**Usage:**

```
tbutil [{cred}] export report query {template_id_or_filename} {name}
```

```
tbutil [{cred}] export report template {template_id_or_filename}
```

These commands can be used to export a representation of a report template or the SQL queries it contains. This can be useful to explore how the reports gather and present the metrics they include.

The `export report query` command returns a SQL query script.

The `export report template` command returns the report template, converted into a JSON document. Note that this cannot be used to edit and re-import the report, but assists in gaining an understand of how the report works.

Use [`list report templates`](#list-report-templates) to see the known templates and [`list report queries`](#list-report-queries) to list the SQL queries used by a report.

You can also use [`execute report query`](#execute-report-query) to actually execute a SQL query contained within a report template definition.

**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### export scenario

**Usage:**

```
tbutil [{cred}] export scenario [-j|-s ..|-y] [-by-name] {scenario_id_or_name}
```

Prints a scenerio configuration as a JSON document which can be used for later re-importing into the same or a different Turbonomic instance using [`import scenario`](#import-scenario).

Note that "scenario" is the internal name for a "plan". So this command is effectively "export plan".

Use [`list scenarios`](#list-scenarios) to find the scenario name or ID to use on the command line.

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import scenario`](#import-scenario).

The supported formatting flags are `-j`, `-s` and `-y` (see [common formatting options](#common-options))

**See also:**
[`delete scenario`](#delete-scenario),
[`import scenario`](#import-scenario),
[`list scenarios`](#list-scenarios)

### export smtp config

**Usage:**

```
tbutil [{cred}] export smtp config [-j|-s ..|-y]
```

Prints the SMTP (Simple Mail Transport Protocol) configuration from a Turbonomic instance. The printed output is formatted as a JSON document that can be re-imported using [`import smtp config`](#import-smtp-config).

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import smtp config`](#import-smtp-config).

The supported formatting flags are `-j`, `-s` and `-y` (see [common formatting options](#common-options))

**See also:**
[`import smtp config`](#import-smtp-config),


### export target

**Usage:**

```
tbutil [{cred}] export target [-j|-s ..|-y] [-ask-secrets] {target_id}
```

Prints a JSON document containing the definition of the target who's UUID is given as the argument, suitable for editting and/or re-importing using the [`import target`](#import-target) command.

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import target`](#import-target).

The supported formatting flags are `-j`, `-s` and `-y` (see [common formatting options](#common-options))

Note: Turbonomic does not return the password for the target, so the resulting text needs to have a password added to it (encrypted) before it can be imported. You have three choices to answer this requirement:

1. Run `export target` with the `-ask-secrets` option, which causes it to prompt you for the passwords as it runs. The passwords you enter are added to the exported JSON body. You can also pipe the passwords in on the standard input instead of typing them by hand.
2. Use the `-ask-secrets` option with `import targets`, in which case the questions are asked when you import and do not need to be written to the file. You can also pipe the passwords in on the standard input instead of typing them by hand.
3. Use the [`crypt`](#crypt) command to patch the passwords in to the file after exporting and before importing.

See [`crypt`](#crypt) for more information.

**See also:**
[`crypt`](#crypt),
[`delete target`](#delete-target),
[`import target`](#import-target),
[`list targets`](#list-targets),
[`rediscover target`](#rediscover-target),
[`validate target`](#validate-target)

### export template

**Usage:**

```
tbutil [{cred}] export template [-j|-s ..|-y] [-by-name] {template_id_or_name}
tbutil [{cred}] export [all] templates [-v] {directory_name}

```

The singular variant outputs the definition of the specified template as a JSON document that can be editted and/or re-imported into a Turbonomic instance using the [`import template`](#import-template) command.

If any of the allowed [common formatting options](#common-options) are specified, then the output is the unprocessed output of the API call used. The resulting text is NOT suitable to be imported using [`import template`](#import-template).

The supported formatting flags are `-j`, `-s` and `-y` (see [common formatting options](#common-options))

The plural variant exports all custom templates to files in the named directory. The tool first creates the directory (which must not pre-exist). The option `-v` means that the export files contain the full template DTO rather than the simplified version. Files created using `-v` are NOT suitable for re-importing.

If `all` is used with the plural variant, then system-generated templates are included in the export directory. Note that they CANNOT be re-imported.

**See also:**
[`delete template`](#delete-template),
[`import template`](#import-template),
[`list templates`](#list-templates)

### export user

**Usage:**

```
tbutil [{cred}] export user [-j|-s ..|-y] {user_name_or_uuid}
```

**TODO**: add `-by-name` option.

Prints a JSON document containing the details required to import the user into another instance of Turbonomic.

`user_name_or_uuid` can either be the name or the UUID of the user being exported. You can use [`list users`](#list-users) to find the relevant user UUID.

The options `-j`, `-s` or `-y` can be used to specify how the output is formatted (see "[common options](#common-options)"). If any of these is used, the output consists of the body returned by the API and is NOT suitable for re-importing using `import user`.

Note: Turbonomic does not return the password for the user, so the resulting text needs to have a password added to it (encrypted) before it can be imported. See [`crypt`](#crypt) for more information.


**See also:**
[`create local user`](#create-local-user),
[`crypt`](#crypt),
[`delete user`](#delete-user),
[`import user`](#import-user),
[`list users`](#list-users)

### get

**Usage:**

```
tbutil [{cred}] get [anon] [-j|-s ..|-y] [-jsfilter ..] {path}
```

The `get` command can be used to invoke a Turbonomic raw REST "get" API function if you know it's path and query options. The results are displayed (by default) as a JSON document.

Note that the `path` should exclude the `/vmturbo/rest` fixed component. So the 'groups' endpoint should be specified as `/groups`, not `/vmturbo/rest/groups`.

The options `-j`, `-s` or `-y` can be used to specify how the output is formatted (see "[common options](#common-options)").

The `anon` keyword can be used to get the result of a "GET" call against REST API endpoints that dont require authentication (there are a small number of these).

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of records for which the function returns true are included in the output.

**Example:**

This lists upto 10 members of the group who's UUID is given in the path ..

```
tbutil @instance_1 get "/groups/8b3b69301a90673bfe1c7856af425706a8f4cc6c/members?limit=10"
```

**See also:**
[`delete`](#delete),
[`post`](#post),
[`put`](#put)

### get swagger

```
tbutil [{cred}] get swagger
```

### help

```
tbutil help [{keyword} | all | env-vars]
```

### import dashboard

**Usage:**

```
tbutil [{cred}] import dashboard [-create|-edit] [-dry-run] {file_name}
```

Imports a dashboard using the definition generated by the corresponding [`export dashboard`](#export-dashboard) command.

The name of the file is specified in the `file_name` argument.

The command line options are common to many `import` commands. See [common options](#common-options) for details.

The usual process for exporting a re-importing a dashboard is as follows..

- Find the UUID of the dashboard of interest in the Turbonomic instance in which it already exists.
    - Eg: `tbutil @instance1 ` [`list dashboards`](#list-dashboards) ` -l`
- Export the dashboard, and save the details in a JSON format file
    - Eg: `tbutil @instance1 ` [`export dashboard`](#export-dashboard) ` 0NQoJNqEemds5DLjBIQ1w > dashboard1.json`
- Edit the file to make other changes if needed
    - Eg: `vi dashboard1.json`
- Import into the target Turbonomic instance
    - Eg: `tbutil @instance2 ` [`import dashboard`](#import-dashboard) ` -create dashboard1.json`

**See also:**
[`delete dashboard`](#delete-dashboard),
[`export dashboard`](#export-dashboard),
[`list dashboards`](#list-dashboards)

### import group

**Usage:**

```
tbutil [{cred}] import dynamic group [-create|-edit] [-dry-run] {file_name}
tbutil [{cred}] import static group [-j [-create|-edit] [-ignore-case] {file_name}
tbutil [{cred}] import my groups [-clean] {directory_name}
```

The singular variants of this command import a group using the definition generated by the matching [`export group`](#export-group) command.

The name of the file is specified in the `file_name` argument.

The command line options are common to many `import` commands. See [common options](#common-options) for details.

The usual process for exporting a re-importing a group is as follows..

- Find the UUID of the group of interest in the Turbonomic instance in which it already exists.
    - Eg: `tbutil @instance1 ` [`list groups`](#list-groups) ` -l`
- Export the group, and save the details in a JSON format file
    - Eg: `tbutil @instance1 ` [`export static group`](#export-group) ` 0NQoJNqEemds5DLjBIQ1w > group1.json`
- Edit the file to make other changes if needed
    - Eg: `vi group1.json`
- Import into the target Turbonomic instance
    - Eg: `tbutil @instance2 ` [`import static group`](#import-group) ` -create group1.json`

The plural variant imports custom (aka `my`) groups from the files contained in the specified directory. The directory should have been created and populated using the [`export my groups`](#export-group) command. The `-clean` flag causes the tool to delete all custom groups that are not mentioned in any of the files in the directory (though system-generated groups are left in place).

**See also:**
[`create static group`](#create-static-group),
[`delete group`](#delete-group),
[`export group`](#export-group),
[`list groups`](#list-groups),
[`list group members`](#list-group-members),
[`list related groups`](#list-related-groups)

### import license

**Usage:**

```
tbutil [{cred}] import license [-dry-run] [-replace-all] {license-file.xml}
```

Imports a license from the specified XML file.

The `-dry-run` option can be used to cause the command to report actions that **would** be taken and check the validity of the license without actually making any changes.

The `-replace-all` option causes the command to delete **all** existing licenses before applying the new one.

**See also:**
[`delete license`](#delete-license),
[`list licenses`](#list-licenses),
[`print license`](#print-license)

### import persistence config

```
tbutil [{cred}] import persistence config {file_name}
```

### import policy

**Usage:**

```
tbutil [{cred}] import automation policies [-clean] {directory_name}
tbutil [{cred}] import automation policy [-j] [-create|-edit] [-reset-defaults] {file_name}
tbutil [{cred}] import placement policies [-clean] {directory_name}
tbutil [{cred}] import placement policy [-j] [-create|-edit] {file_name}
```

The plural vesions of these commands import all the policies of the specified type from the name directory. The directory in question should have been created using `export all ... policies` against a Turbonomic instance running the same release of software (or at least: where the policy DTO is the same).

The `-clean` flag causes all policies not listed in the directory to be deleted or (in the case of default automation policies) to be reset to the default values.

The single versions of the commands import a single policy. `-create` or `-edit` can be used to mandate that the policy does not pre-exist (`-create`) or does (`-edit`).

The `-reset-defaults` flag resets ALL fields in the policy to their default values before applying the subset of values specified in the import file.


**See also:**
[`delete policy`](#delete-policy),
[`export all policies`](#export-all-policies),
[`export policy`](#export-policy),
[`list policies`](#list-policies),
[`print policy changes`](#print-policy-changes),
[`reset policy`](#reset-policy)

### import scenario

**Usage:**

```
tbutil [{cred}] import scenario [-run] [-stats] [-columns ..] [-json-stats] [-keep] [-trace] [-wait ..] {file_name}
```

Import and optionally run a scenario (aka: "plan") from a JSON file created by [`export scenario`](#export-scenario).

| Option | Description |
| ------ | ----------- |
| `-run` | Run the plan after importing the scenario and wait for it to complete. |
| `-stats` | Report the resulting statistics when the plan is complete. |
| `-columns` | Select the columns to be displayed by the `stats` option. |
| `-json-stats` | Like `stats` but format the report as a JSON document. |
| `-keep` | Keep the scenario and market objects after a plan run has completed and the stats have been reported. |
| `-trace` | Show trace messages during the processing of the plan. |
| `-wait` | The number of seconds to wait for the plan to complete. Note: `tbutil` polls the status every 10 seconds. |

**See also:**
[`delete scenario`](#delete-scenario),
[`export scenario`](#export-scenario),
[`import scenario`](#import-scenario),
[`list scenarios`](#list-scenarios)

### import smtp config

**Usage:**

```
tbutil [{cred}] import smtp config {file_name}
```

Imports the SMTP configuration for Turbonomic, from a JSON file created using [`export smtp config`](#export-smtp-config).

**See also:**
[`export smtp config`](#export-smtp-config)

### import target

**Usage:**

```
tbutil [{cred}] import target [-j] [-create|-edit] [-dry-run] [-ask-secrets] {file_name}
```

Note: The target configuration needs to have the passwords added to it (encrypted) before it can be imported. You have three choices to answer this requirement:

1. Run `export target` with the `-ask-secrets` option, which causes it to prompt you for the passwords as it runs. The passwords you enter are added to the exported JSON body. You can also pipe the passwords in on the standard input instead of typing them by hand.
2. Use the `-ask-secrets` option with `import targets`, in which case the questions are asked when you import and do not need to be written to the file. You can also pipe the passwords in on the standard input instead of typing them by hand.
3. Use the [`crypt`](#crypt) command to patch the passwords in to the file after exporting and before importing.

**See also:**
[`crypt`](#crypt),
[`delete target`](#delete-target),
[`export target`](#export-target),
[`list targets`](#list-targets),
[`rediscover target`](#rediscover-target),
[`validate target`](#validate-target)

### import template

**Usage:**

```
tbutil [{cred}] import template [-j] [-create|-edit] {file_name}
tbutil [{cred}] import templates [-clean] {directory_name}
```

The singular variant of this command imports a template from the specified file. The file should be the output of an [`export template`](#export-template) command run. If `-create` is specified, then the template must not pre-exist. If `-edit` is specified, then it must pre-exist.

The `-j` flag causes the commit to display the entire returned DTO rather than just the uuid of the imported template.

The plural variant imports all the templates described in files in the specified directory (which should have been created using `export templates`). The `-clean` options causes the tool to delete any custom templates that are not referenced in any of the import files.

Note: system-generated templates cannot be imported or overwritten, and not deleted when `-clean` is used.

**See also:**
[`delete template`](#delete-template),
[`export template`](#export-template),
[`list templates`](#list-templates)

### import user

**Usage:**

```
tbutil [{cred}] import user [-create|-edit] [-dry-run] {file_name}
```

Creates a new user by importing details from a file that contains the output of the [`export user`](#export-user) command.

The name of the file is specified in the `file_name` argument.

The command line options are common to many `import` commands. See [common options](#common-options) for details.

The usual process for exporting and re-importing a user is as follows..

- Find the UUID of the user of interest in the Turbonomic instance in which it already exists.
    - Eg: `tbutil @instance1 ` [`list users`](#list-users) ` -l`
- Export the user, and save the details in a JSON format file
    - Eg: `tbutil @instance1 ` [`export user`](#export-user) ` 0NQoJNqEemds5DLjBIQ1w > user1.json`
- Add the encrypted password to the file
    -  Eg: `tbutil ` [`crypt`](#crypt) ` -user user1.json`
- Edit the file to make other changes if needed
    - Eg: `vi user1.json`
- Import into the target Turbonomic instance
    - Eg: `tbutil @instance2 ` [`import user`](#import-user) ` -create user1.json`

**See also:**
[`create local user`](#create-local-user),
[`crypt`](#crypt),
[`delete user`](#delete-user),
[`export user`](#export-user),
[`list users`](#list-users)

### license

### list accepted actions

```
tbutil [{cred}] list accepted actions [-help] [-l|-j|-s ..|-y|-x ..] [-columns ..] [-filter {expr}] [-jsfilter ..] [-startTime {yyyy-mm-dd}] [-endTime {yyyy-mm-dd}] [{uuid}]
```

**See also:**
[`accept action`](#accept-action),
[`list actions`](#list-actions),
[`print action`](#print-action),
[`reject action`](#reject-action)

### list actions

```
tbutil [{cred}] list actions [-help] [-l|-j|-s ..|-y|-x ..] [-columns ..] [-filter {expr}] [-jsfilter ..] [-risks] [-details] [{[environment_type:]entity_id}]
```

**See also:**
[`accept action`](#accept-action),
[`list accepted actions`](#list-accepted-actions),
[`print action`](#print-action),
[`reject action`](#reject-action)

### list ad groups

```
tbutil [{cred}] list ad groups [-l|-j|-s ..|-y|-x ..] [-jsfilter ..]
```

### list businessunits

```
tbutil [{cred}] list businessunits [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

### list clusters

```
tbutil [{cred}] list clusters [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

### list containers

```
tbutil [{cred}] list containers [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..] [-q ..] [-scope ..] 
```

### list dashboards

**Usage:**

```
tbutil [{cred}] list [custom] dashboards [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..]
```

Lists the dashboards defined in the Turbonomic instance. If the `custom` keyword is specified, then the list is limited to custom dashboards only.

The following [common formatting options](#common-options) are supported: `-l`, `-j`, `-s`, `-y`, `-x`, `-columns`.

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of dashboards for which the function returns true are included in the listing.

**See also:**
[`delete dashboard`](#delete-dashboard),
[`export dashboard`](#export-dashboard),
[`import dashboard`](#import-dashboard)

### list entities

```
tbutil [{cred}] list [active] entities [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..] [-q ..] [-scope ..] {[environment_type:]entity_types}
```
  
### list group members

**Usage:**

```
tbutil [{cred}] list group members [-l|-j|-s ..|-y|-x ..] [-columns ..] [-direct] [-jsfilter ..] {group_id_or_name}
```

**TODO**: add `-by-name` option.

List the members of a specified group. The parent group may be identified by UUID or name.

The following [common formatting options](#common-options) are supported: `-l`, `-j`, `-s`, `-y`, `-x`, `-columns`.

The option `-direct` filters the listing to include only those elements that are direct descendants of the specified group (these may include child groups). If this flag is omitted then the list includes all entiries in the tree below the specified group (child groups are not included).

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of group members for which the function returns true are included in the listing.

**See also:**
[`create static group`](#create-static-group),
[`delete group`](#delete-group),
[`export group`](#export-group),
[`import group`](#import-group)
[`list groups`](#list-groups),
[`list related groups`](#list-related-groups)

### list groups

**Usage:**

Style 1:

```
tbutil [{cred}] list [{source}] [{type}] groups [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..] [-q ..] [{member_type}]
```

Style 2:

```
tbutil [{cred}] list [cluster] {category} groups {format_options} [-count-direct] [-show-targets] [-jsfilter ..]
```

Style 1 of this command lists groups by type and source.

Style 2 lists groups by their parentage in the group hierarchy.

In style 1, the {source} may be..

| Source | Meaning |
| ------ | ------- |
| &nbsp; | If no source is specified, the default list of groups (those returned by the search API) of the selected type is printed. |
| all    | The listing includes all groups, including the ones the system hides from the "Search" APIs (this needs some definition). |
| discovered | Groups that have been discovered from targets are listed. |
| my     | Groups that have been configued by a user are listed. |

Note: if a source is specified, the `-q` option cannot be used.

In style 1, the {type} may be...

| Type   | Meaning |
| ------ | ------- |
| &nbsp; | If not type is specified, the listing includes both static and dynamic groups. |
| dynamic | Limit the list to dynamic groups only. |
| static | Limit the list to static groups only. |

In style 2, the {category} may be...

| Category   | Meaning |
| ------ | ------- |
| pm | Lists the groups in the GROUP-PMGroups or GROUP-PhysicalMachineByCluster hierarchy (depending on whether the word "cluster" is specified). |
| storage | Lists the groups in the GROUP-STGroups or GROUP-StorageByCluster hierarchy (depending on whether the word "cluster" is specified). | |
| vm | Lists the groups in the GROUP-VMGroups or GROUP-VirtualMachineByCluster hierarchy (depending on whether the word "cluster" is specified).. |

These commands support the following set of [common format_options](#common-options): `-l`, `-j`, `-s`, `-y`, `-x` and `-columns`.

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of groups for which the function returns true are included in the listing.

A subset of the commands support the `-q` option to allow the search API to return only the subset of groups who's display names match the specified regular expression.

**See also:**
[`create static group`](#create-static-group),
[`delete group`](#delete-group),
[`export group`](#export-group),
[`import group`](#import-group)
[`list group members`](#list-group-members),
[`list related groups`](#list-related-groups)

### list hosts

See: [`list pms`](#list-pms)

### list licenses

**Usage:**

```
tbutil [{cred}] list licenses [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

Lists the licenses loaded into the Turbonomic instance.

The command supports the following set of [common format_options](#common-options): `-l`, `-j`, `-s`, `-y`, `-x` and `-columns`.

**See also:**
[`delete license`](#delete-license),
[`import license`](#import-license),
[`print license`](#print-license)

### list logging levels

```
tbutil [{cred}] list logging levels [-j|-y|-x ..]
```

### list markets

**Usagge:**

```
tbutil [{cred}] list [stopped|running|plan] markets [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..]
```

**See also:**
[`delete market`](#delete-market),
[`print market`](#print-market)

### list notifications

**Usage:**

```
tbutil [{cred}] list [group|entity|market] notifications [-l|-j|-s ..|-y|-x ..] [-columns ..] [{context_uuid}]
```

### list policies

**Usage:**

```
tbutil [{cred}] list [all] placement policies [-l|-j|-s ..|-y|-x ..] [-src ..] [-columns ..] [-jsfilter ..]
tbutil [{cred}] list [all] [default|scoped] automation policies [-l|-j|-s ..|-y|-x ..] [-src ..] [-columns ..] [-jsfilter ..]
```

**See also:**
[`delete policy`](#delete-policy),
[`export all policies`](#export-all-policies),
[`export policy`](#export-policy),
[`import policy`](#import-policy),
[`print policy changes`](#print-policy-changes),
[`reset policy`](#reset-policy)

### list policy changes

```
tbutil [{cred}] list automation policy changes [-src ..] {policy_uuid_or_name}
```

### list pms

**Usage:**

```
tbutil [{cred}] list [active|idle] pms [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..] [-q ..] [-scope ..] [-show-targets]
```

### list related

**Usage:**

```
tbutil [{cred}] list related [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..] [-aspects] {type} {entity_id}
```

Lists the elements of the specified `type` that are related to the object who's UUID is specified as `entity_id`.

The `entity_id` can refer to any object that can be used to scope the UI including Markets, VMs, PMs, Clusters, VDCs, Targets (and more).

The resulting list is the one that the UI would be scoped to by clicking on the equivalent circle in the supply chain graphic on the left hand side.

Valid types for the entity are those that are shown by the [`list supplychain`](#list-supplychain) command using the same entity UUID as the `scope_uuid` argument.

The command supports the following set of [common format_options](#common-options): `-l`, `-j`, `-s`, `-y`, `-x` and `-columns`.

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of objects for which the function returns true are included in the listing.

**See also:**
[`list supplychain`](#list-supplychain)

### list related groups

**Usage:**

```
tbutil [{cred}] list [all] related groups [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..] {entity_id}
```

Lists the groups that the specified entity is a member of. The entity may be a VM, host or any other entity type that can be grouped and must be specified by it's UUID.

If the `all` option not is specified then only "leaf" groups that contain the entity are listed. If `all` is specified, then the parent, grand parent, great gaand parent (etc) groups are listed.

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of groups for which the function returns true are included in the listing.

**See also:**
[`create static group`](#create-static-group),
[`delete group`](#delete-group),
[`export group`](#export-group),
[`import group`](#import-group)
[`list groups`](#list-groups),
[`list group members`](#list-group-members)

### list report instances

**Usage:**

```
tbutil [{cred}] list report instances [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### list report queries

**Usage:**

```
tbutil [{cred}] list [all] report queries [-j|-s ..|-y|-x ..] [-columns ..] {template_id_or_filename}
```

**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report schedules`](#list-report-schedules),
[`list report templates`](#list-report-templates)

### list report schedules

**Usage:**

```
tbutil [{cred}] list report schedules [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report templates`](#list-report-templates)

### list report templates

**Usage:**

```
tbutil [{cred}] list report templates [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

**See also:**
[`delete report instance`](#delete-report-instance),
[`delete report schedule`](#delete-report-schedule),
[`download report instance`](#download-report-instance),
[`execute report query`](#execute-report-query),
[`export report`](#export-report),
[`list report instances`](#list-report-instances),
[`list report queries`](#list-report-queries),
[`list report schedules`](#list-report-schedules)

### list scenarios

```
tbutil [{cred}] list [all] scenarios [-l|-j|-s ..|-y|-x ..] [-columns ..]
```

**See also:**
[`delete scenario`](#delete-scenario),
[`export scenario`](#export-scenario),
[`import scenario`](#import-scenario)

### list supplychain

**Usage:**

```
tbutil [{cred}] list [hybrid|onprem|cloud] supplychain [-l|-j|-s ..|-y|-x ..] [-columns ..] [{scope_uuid}]
```

Lists the number of elements of the object types related to the specified scope, broken down by state. Here's an example output..

```
Type               Count  Active  Normal  Minor  Major  Critical
-----------------  -----  ------  ------  -----  -----  --------
Application           39      20      39      0      0         0
DataCenter             2       2       2      0      0         0
DesktopPool           10      10      10      0      0         0
DiskArray              5       4       5      0      0         0
DPod                   1       1       1      0      0         0
LogicalPool            1       1       1      0      0         0
Network                3       2       3      0      0         0
PhysicalMachine        5       5       4      0      0         1
Storage                3       2       2      0      0         1
StorageController      1       1       1      0      0         0
ViewPod                1       1       1      0      0         0
VirtualDataCenter     17      17      17      0      0         0
VirtualMachine        39      20      30      7      0         2
```

The `scope_uuid` can refer to any object that can be used to scope the UI including Markets, VMs, PMs, Clusters, VDCs, Targets (and more). If no `scope_uuid` is specified, then the command scope is set to the entire hybrid market.

You can use [`list related`](#list-related) to list the objects in a particular class, related to a specified scope.

The command supports the following set of [common format_options](#common-options): `-l`, `-j`, `-s`, `-y`, `-x` and `-columns`.

**See also:**
[`list related`](#list-related)

### list targets

**Usage:**

```
tbutil [{cred}] list [all] targets [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..]
```

**See also:**
[`crypt`](#crypt),
[`delete target`](#delete-target),
[`export target`](#export-target),
[`import target`](#import-target),
[`rediscover target`](#rediscover-target),
[`validate target`](#validate-target)

### list target types

```
tbutil [{cred}] list target types [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..]
```

### list templates

**Usage:**

```
tbutil [{cred}] list [all|discovered|configured] templates [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..]
```

**See also:**
[`delete template`](#delete-template),
[`export template`](#export-template),
[`import template`](#import-template)

### list turbo components

```
tbutil [{cred}] list turbo components [-l|-x ..] [-columns ..]
```

### list users

**Usage:**

```
tbutil [{cred}] list [ad|local] users [-l|-j|-s ..|-y|-x ..] [-jsfilter ..]
```

Lists the users defined in Turbonomic.

The following [common formatting options](#common-options) are supported: `-l`, `-j`, `-s`, `-y`, `-x`.

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of users for which the function returns true are included in the listing.

**See also:**
[`create local user`](#create-local-user),
[`delete user`](#delete-user),
[`export user`](#export-user),
[`import user`](#import-user)

### list vms

**Usage:**

```
tbutil [{cred}] list [{state}] [{environment}] vms {formatting_options} [-aspects] [-jsfilter ..] [-q {regexp}] [-scope ..] [-show-targets]
```

Lists the Virtual Machines known to Turbonomic.

The following [common formatting options](#common-options) are supported: `-l`, `-j`, `-s`, `-y`, `-x`, `-columns`.

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of VMs for which the function returns true are included in the listing.

If the `-q` option is specified it can be used to limit the VMs returned by the API to those who's names match the regular expression.

The {state} filters the listing as follows ..

| State | Meaning |
| ----- | ------- |
| &nbsp; | No state filter is apply if none is specified. Both IDLE and ACTIVE VMs are listed. |
| idle | Limit the list to VMs that are flagged as IDLE. |
| active | Limit the list to VMs that are flagged as ACTIVE. |

The {enironment} filters the listing as follows ..

| Environment | Meaning |
| ----------- | ------- |
| &nbsp; | |
| hybrid | |
| cloud | |
| onprem | |

Examples:

```
tbutil list active vms -l
tbutil @inst01 list vms -x vms.xlsx
tbutil list idle cloud vms -s myscript.js
```

### list wasted storage

```
tbutil [{cred}] list wasted cloud|onprem|hybrid storage [-l|-j|-s ..|-y|-x ..] [-columns ..] [-jsfilter ..]
tbutil [{cred}] list wasted storage [-l|-j|-s ..|-y|-x ..]
```

### opensource licenses

```
tbutil opensource licenses
```

### ping

**Usage:**

```
tbutil [{cred}] ping [-sql|-ssh|-isXL]
```

### post

**Usage:**

```
tbutil [{cred}] post [-j|-s ..|-y] [-jsfilter ..] {path} < {json_body_file}
```

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of records for which the function returns true are output.

**See also:**
[`delete`](#delete),
[`get`](#get),
[`put`](#put)

### print action

```
tbutil [{cred}] print action [-j|-s ..|-y] {action_id}
```

**See also:**
[`accept action`](#accept-action),
[`list actions`](#list-actions),
[`list accepted actions`](#list-accepted-actions),
[`reject action`](#reject-action)

### print cluster headroom

**Usage:**

```
tbutil [{cred}] print cluster headroom [-l|-j|-s ..|-y]
```

### print group

```
tbutil [{cred}] print group [-j|-y] [-by-name] {group_id_or_name}
```

### print headroom stats

### print license

***Usage:***

```
tbutil [{cred}] print license [-j|-s {script_file}|-y] [-days-left]
```

Print a JSON representation of the current license (note: this is **not** a suitable format for importing with [`import license`](#import-license)).

The command supports the following set of [common format_options](#common-options): `-j`, `-s` and `-y`.

The `-days-left` option prints an integer number which indicates the number of days remaining in the license or one of the following messages..

- "License has expired"
- "License is not valid"
- "No expirationDateTime in response from server"

**See also:**
[`delete license`](#delete-license),
[`import license`](#import-license),
[`list licenses`](#list-licenses)

### print market

**Usage:**

```
tbutil [{cred}] print market [-j|-s ..|-y] {market_id}
```

**See also:**
[`delete market`](#delete-market),
[`list markets`](#list-markets)

### print stats

**Usage:**

```
tbutil [{cred}] print stats [-j|-s ..|-y|-x ..] [-columns ..] [-simple-json] {entitiy_id}
```

### print version

**Usage:**

```
tbutil [{cred}] print version [-j|-s ..|-y|{field_name}]
```

### psql

**Usage:**

```
tbutil [{cred}] psql find entities [-l|-x ..] [-columns ..] {pattern}
tbutil [{cred}] psql list vms|hosts|clusters|groups|entities|types [-l|-x ..] [-columns ..] [-where ..]
tbutil [{cred}] psql [-l|-x ..] [-columns ..] {psql_file.sql} [{arg} ...]
```

### put

**Usage:**

```
 tbutil [{cred}] put [-j|-s ..|-y] [-jsfilter ..] {path} < {json_body_file}
```

If the `-jsfilter` option is specified then the tool loads and runs the specified [filter script](#filter-scripts). Only the sub-set of records for which the function returns true are output.

**See also:**
[`delete`](#delete),
[`get`](#get),
[`post`](#post)

### rediscover target

**Usage:**

```
tbutil [{cred}] rediscover target [-by-name] {target_id_or_name} ...
```

**See also:**
[`crypt`](#crypt),
[`delete target`](#delete-target),
[`export target`](#export-target),
[`import target`](#import-target),
[`list targets`](#list-targets),
[`validate target`](#validate-target)

### reject action

**See also:**
[`accept action`](#accept-action),
[`list actions`](#list-actions),
[`list accepted actions`](#list-accepted-actions),
[`print action`](#print-action)

### reset policy

**Usage:**

```
tbutil [{cred}] reset all automation policies [-v] [-d]
tbutil [{cred}] reset automation policy [-by-name] {policy_uuid_or_name}
```

Resets the identified policy to it's default configuration. The policy ID or name can be determined using [`list automation policies`](#list-policies).

If the option `-by-name` is used, then the policy name (rather than it's ID) should be used as the argument.

The `all` variant resets all the existing default automation policies and deletes an existing custom automation policies. The `-v` option instructs the tool to be verbose. The `-d` option means that releated schedules will be deleted too.

**See also:**
[`delete policy`](#delete-policy),
[`export all policies`](#export-all-policies),
[`export policy`](#export-policy),
[`import policy`](#import-policy),
[`list policies`](#list-policies),
[`print policy changes`](#print-policy-changes)

### reset logging levels

```
tbutil [{cred}] reset logging levels
```

### save credentials

The 'save credentials' commands request the credential information from the user interactively and save it (by default) in the file '$HOME/.tbutilrc' against the credential_key specified on the command line (or '@default' if none was specified).

This file will then be used as the source of credentials when the utility is run without credentials being specified on the command line or environment, or when a credential_key (preceded by "@") is specified.

The name of the file used can be changed by setting the environment variable `TURBO_CREDENTIALS_FILE`.

Only limited validation of the answers is performed, so errors made when entering the fields will be detected only when they are used to establish a connection.

```
tbutil [@cred] save credentials [-help] [-advanced]
```

This command saves the credentials needed to access the Turbonomic REST API.

It asks for the following fields:

- Protocol (must be 'http' or 'https')                  - *advanced mode only*
- Host name or IP address
- Port number (blank to use the default protocol port)  - *advanced mode only*
- URI path (blank to use the default '/vmturbo/rest')   - *advanced mode only*
- API/UI User name and Password

The password is entered with echo turned off, and it is stored in the file using AES encryption.

```
tbutil [@cred] save ssh credentials [-help] [-advanced]
```

The "save ssh credentials" command saves credentials for accessing the ssh service on the Turbonomic instance. This is used for accessing the MySQL DB (or other features) on the instance platform using tunnels.

The command asks the following questions..

- SSH user login name
- SSH authentication type (1:password, 2:certificate, 3:agent)
- SSH login password (for auth type 1 only)
- SSH private key file (for auth type 2 only)
- SSH port (default is 22. Can include a host name if different from the API host) *advanced mode only*

```
tbutil [@cred] save db credentials [-help] [-advanced]
```

This command saves the credentials needed when accessing the MySQL database on the Turbonomic instance. A number of different connection styles are supported.

The command asks the following questions and presents some information to help you select the best answers.

- MySQL DB name
- MySQL DB LoginName (default='vmtreader')
- MySQL DB password
- MySQL Connection type
    - 1=direct/local
    - 2=direct/remote
    - 3=ssh tunnel for Classic
    - 4=ssh tunnel for XL
- MySQL Service Port (default=3360)

```
tbutil [@cred] save all credentials [-help] [-advanced]
```

This command runs all three commands listed above as a single command.

#### Non-interactive use

You can specify the answers to any of the questions asked by these commands by using
the following environment variables...

| Variable | Description |
| -------- | ----------- |
| TURBO_CRED_PROTOCOL    | (Advanced mode only) The REST API protocol (http or http). |
| TURBO_CRED_HOST        | The host name or IP of the Turbonomic instance. |
| TURBO_CRED_PORT        | (Advanced mode only) The port at which the REST API can be reached. |
| TURBO_CRED_PATH        | (Advanced mode only) The URI base path. By default this is "/vmturbo/rest". |
| TURBO_CRED_USER        | The user name used to access the REST API. "administrator"is the standard admin user. |
| TURBO_CRED_PASS        | The REST API password. |
| TURBO_CRED_SSH_USER    | The SSH user name . |
| TURBO_CRED_SSH_AUTH_TYPE | The type of SSH authentication.<br>1: direct/local<br>2: direct/remote<br>3: ssh tunnel<br>4: ssh tunnel for XL |
| TURBO_CRED_SSH_PASS    | SSH Password (for auth type 1). |
| TURBO_CRED_SSH_PORT    | (Advanced mode only) SSH service port to connect to. |
| TURBO_CRED_SSH_KEYFILE | Path name of the SSH key file (for auth type 2). |
| TURBO_CRED_DB_NAME     | Name of the MySQL database. |
| TURBO_CRED_DB_USER     | The MySQL DB user name (recommended: vmtreader). |
| TURBO_CRED_DB_PASS     | The MySQL DB password for the specified user. |
| TURBO_CRED_DB_CONNTYPE | A code that indicates the style of MySQL connection to use.<br>1: local<br>2: direct/remote<br>3: ssh-tunnel<br>4: tunnel for XL |
| TURBO_CRED_DB_PORT     | The MySQL service port number. |

**See also:**
[`downgrade credentials`](#downgrade-credentials),
[`upgrade credentials`](#upgrade-credentials)

### script

```
tbutil [{cred}] -s|script {js-file-name} [{arguments} ...]
```

### set logging level

```
tbutil [{cred}] set logging level {compnent_name} {level}
```

### shell

```
tbutil [{cred}] shell {arguments ....}
```

### sql

```
tbutil [{cred}] sql [-help|-test] [-j|-s ..|-y|-x ..] [-columns ..] [-o {csv_file}] {sql_file} [{arg} ...]
```

### stats

This is an alias for [`print stats`](#print-stats)


### upgrade credentials

**Usage:**

```
tbutil upgrade credentials
```

Changes the way passwords are stored in the .tbutilrc file to give better security than provided by 1.0 and 1.1 versions of the tool. Once updated, the file cannot be copied and used on other platforms even if their host names are the same (which was a short-coming of the earlier method).

Note that once upgraded, the passords cannot be used by the earlier tbutil releases that relied on the older approach (1.0 and 1.1). If you need to use an earlier version then you can reverse the upgrading by running the [`downgrade credentials`](#downgrade-credentials) sub command.

**See also:**
[`save credentials`](#save-credentials),
[`downgrade credentials`](#downgrade-credentials)

### validate target

**Usage:**

```
tbutil [{cred}] validate target [-by-name] {target_id_or_name} ...
```

**See also:**
[`crypt`](#crypt),
[`delete target`](#delete-target),
[`export target`](#export-target),
[`import target`](#import-target),
[`list targets`](#list-targets),
[`rediscover target`](#rediscover-target)

### version

This is an alias for [`print version`](#print-version)

### wasted storage

This is an alias for [`list wasted storage`](#list-wasted-storage)

### what

```
tbutil what [-help] {method} {url}
```
