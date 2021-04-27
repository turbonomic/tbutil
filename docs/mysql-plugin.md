# MySQL Plugin for TBUtil

*Last updated: 27 Apr 2021*

---

This plugin allows simple access to MySQL databases.

It is available for 64bit Linux, Windows and MAC Darwin.

The Linux and Darwin versions of the MySQL plugin can optionally gain read-only access to the MySQL database located on a remote Turbonomic instance using a built-in SSH tunnel (this mechanism is ONLY usable in this context - it cannot be used to tunnel to remote databases in other use cases or from Windows clients).

The plugin exposes the following functions..

| Name   | Description                              |
|--------|------------------------------------------|
| open   | Open access to a database                |
| close  | Close access to a database               |
| exec   | Execute a SQL update                     |
| query  | Run a SQL query and access the results   |

## open

The open() method establishes a database connection and returns a DB access object.

A read-only connection can optionally be established against a remote Turbonomic instance database using a built-in SSH tunnel by calling "open" with no arguments.

Example usage:

```javascript
var p = plugin("mysql-plugin");
var db = p.open(dbDef)
```

The `dbDef` is optional, and specifies the database. For example:

| Example                | Notes |
|----------------------- | ------ |
| "user:pass@/dbName" | Access to the local database using the specified user name and password |
| "user:pass@tcp(host:port)/dbName" | Access to a remote database using the specified user name and password |
| "@key"                 | Access to the Turbonomic instance database using the credentials stored against the specified key (via an SSH tunnel, if needed) |
| "@key:host"            | Access to the Turbonomic instance database running on the host using the credentials stored against the specified key (via an SSH tunnel, if needed) |
| client_object_ref      | Access to the database on the Turbonomic instance to which the client object refers (via an SSH tunnel, if needed) |
| <no arguments>         | Access to the database on the Turbonomic instance referenced by the built-in "client" variable (via an SSH tunnel, if needed) |

The resulting `db` object can then be used to access the `close`, `exec` and `query` methods.


See the section "SSH Tunneling", below for information on setting up and using MySQL SSH tunnels for accessing Turbonomic instance databases.

## close

Closes a previously openned DB handle.

```javascript
db.close()
```

## exec

Executes a non-query SQL statement (eg: create, update, drop).

```javascript
var info = db.exec(statement, [arguments])
```

Where:

| Name               | Description                                                     |
|--------------------|-----------------------------------------------------------------|
| db                 | DB access handle, returned by "open".                           |
| statement          | The SQL statement with possible "?" value placeholders.         |
| arguments          | Array of values to be substituted into the "?" placeholders.    |
| info               | Object containing results of the action. It has two fields..    |
| info.insert_id     | The row id inserted if the SQL auto-increment feature was used. |
| info.rows_affected | The number of rows updated or otherwise impacted by the action. |

Example ..

```javascript
var info = db.exec("update table1 set cost = num * price where type in (?, ?)", ["apple", "pear"]);
printf("%v rows changed\n", info.rows_affected);
```

Note: this function cannot be used when accessing a Turbonomic MySQL instance database remotely.

## query

Executes a query SQL statement (eg: select) and returns the results.

```javascript
var results = db.query(statement, [arguments], [options]);
```

Where:

| Name               | Description                                                                  |
|--------------------|------------------------------------------------------------------------------|
| db                 | DB access handle, returned by "open". |
| statement          | The SQL statement with possible "?" value placeholders. A null value should be passed when called for the second or subsequent time in a paging loop (see below for more details). |
| arguments          | Array of values to be substituted into the "?" placeholders (ignored on the second or subsequent calls in a paging loop. |
| options            | A JS Object containing options to change how the query results are returned. |
| results            | Array containing results of the query. |

The returned result is an array of objects; one per row returned by the SQL query.

Each entry in the array is a map of column names mapped to their corresponding values (unless the byColumn option has been specified - see below). If the plugin has been unable to determine the column type automatically, the column value is returned as a string and a further field is added to provide the type as reported by the DB driver. It's name is the name of the column tagged with ".T", and it's value is the driver's name for the type.

The following fields in the "`options`" object are understood..

| Option     | Description |
|------------|-------------|
| byColumn   | If set, the query returns the values from the specified column only as a simple array. Column numbering starts at 1. |
| columnInfo | If set to true, then the first row of the return is a list of the column names. |
| limit      | If set to a positive number, this allows pagination of the results to be performed. See "pagination" below for more info. This option should not be confused with the "limit" SQL keyword. |
| outputCsvFile | If set, the output of the query is written to the specified CSV file on the local file system rather than being returned to the caller. The function return in this case is the number of rows processed. |

Example ..

```javascript
var n_legs = 4;

var results = db.query("select * from animals where num_legs = ?", [n_legs]);

results.forEach(function(row) {
    printf("%v, %v, %v, %v\n", row.genus, row.species, row.breed, rows.is_extinct);
});
```

## Query Results Pagination 

If a query has the possibility of returning a large number of rows, it may be a good idea to collect them in smaller batches and process those one at a time. When properly used, this can save memory and potentially prevent issues with memory overflow and performance.

The "`query`" method supports pagination using the "limit" option and a null value in place of the SQL statement on the second and subsequent calls.

The logic to use is illustrated by the following example...

``` javaScript
var sql = "select * from vm_stats_by_day";
var pageSize = 500;

while (true) {
	var rows = db.query(sql, null, {limit: pageSize});

	// stop the loop once all the results have been collected
	if (rows.length === 0)
		break;

	// add code to handle the returned rows here.
	rows.forEach(function(row) {

		// do something with the row's data

	});

	// change the SQL statement to a null value for 2nd and subsequent iterations.
	sql = null;
}
```

In the example above, the script collects 500 rows at a time (as set by the "`limit`" option). The SQL statement should be passed as the first argument when "`query`" is called for the first time. A `null` value should be passed in the second and subsequent calls. The "`query`" function returns an empty array When all the available rows have been collected from the SQL server.

If a new query is started before all the results are collected, the uncollected results are discarded.


## SSH Tunneling

You can use this plugin to gain read-only access to the database on a remote Turbonomic instance using a built-in SSH tunneling feature.

The tunneling logic is not currently supported under Windows (and hence: neither is remote Turbonomic DB access), and can ONLY be used to access Turbonomic instance databases.

In order to set up the connection to a Turbonomic instance DB you'll need to know...

| Item | Comment |
|------|---------|
| Credential key | The credential store keyname used to access the Turbonomic API. For example "@demo2". |
| SSH User | The name of the username used to SSH-login to the host. This is NOT needed if you are going to run the script locally. |
| SSH Password | The password used to SSH-login. This is NOT needed if there is an SSH trust certificate or active SSH agent that allows password-less login or you are going to run the script locally |
| DB User | The DB login name that allows the SSH user to access the DB. The name "vmtreader" is recommended for this purpose. |
| DB Password | The DB login password that allows the DB user to access the DB |

These credentials may be added to the credential store using the command "tbutil @key save db credentials". Where "@key" is the credential key for the instance.

Note that the credential block must have been created using "tbutil @key save credentials" (ie: without the "db" option) first.

Here's an example of using this command to define remote access using a passworded SSH tunnel..

```
$ tbutil @demo2 save db credentials
SSH Login Name (blank if local): root
SSH Auth type (1:password, 2:certificate, 3:agent): 1
SSH Login Password: **********
MySQL DB Login Name (default='vmtreader'):
MySQL Login Password: **********

Writing to: /home/chris/.tbutilrc ...
```

Or for remote access where a local SSH agent is available..

```
$ tbutil @demo2 save db credentials
SSH Login Name (blank if local): root
SSH Auth type (1:password, 2:certificate, 3:agent): 3
MySQL DB Login Name (default='vmtreader'): 
MySQL Login Password: **********

Writing to: /home/chris/.tbutilrc ...
```

Or for remote access where an SSH certificate pair exists (but there is no agent)..

```
$ tbutil @demo2 save db credentials
SSH Login Name (blank if local): root
SSH Auth type (1:password, 2:certificate, 3:agent): 2
SSH private key file (default='/home/chris/.ssh/id_rsa'):
MySQL DB Login Name (default='vmtreader'): 
MySQL Login Password: **********

Writing to: /home/chris/.tbutilrc ...
```

Or for local access (SSH is not needed) ..

```
$ tbutil @demo2 save db credentials
SSH Login Name (blank if local):
MySQL DB Login Name (default='vmtreader'):
MySQL Login Password: **********

Writing to: /home/chris/.tbutilrc ...
```

The chosen DB user must ONLY have "select" privileges when using tunneled remote MySQL access. You will not be able to connect if this rule is not followed. The "vmtreader" user is pre-defined on most Turbonomic systems and normally has the required privilege set for this purpose. If you want to verify that a particular user is correctly set up, login to MySQL as that user and run the following command. All rows displayed must only have the word "SELECT" in the "PRIVILEGE_TYPE" column.

```mysql
select * from information_schema.schema_privileges;
```

If you want to use the MySQL plugin to perform updates, then you can only use LOCAL access (ie: the tbutil binary and your script must be located on the file system of the Turbonomic instance).

When an SSH certificate is used to authenticate remote access, the following requirements must be met:
* a public/private key pair must have been created. This is usually done using the "ssh-keygen" utility, locally.
* the key pair must NOT have an associated pass phrase.
* the private key MUST exist in the file named in the credential store (default=$HOME/.ssh/id_rsa) on the system on which the script is being run.
* the corresponding public key must be installed on the target instance system. This is usally done with the "ssh-copy-id" utility, locally.
* The flag "AllowTcpForwarding" must be set to "true" in the sshd_config file on the target instance.


