# SqLite3 Plugin for TBUtil

*Last updated: 3 Aug 2021*

---

This plugin allows simple access to SqLite3 databases.

It is available for 64bit Linux and Windows (not currently on MAC Darwin).

The plugin exposes the following functions..

| Name   | Description                              |
|--------|------------------------------------------|
| open   | Open access to a database                |
| close  | Close access to a database               |
| exec   | Execute a SQL update                     |
| query  | Run a SQL query and access the results   |

## open

The open() method establishes a database connection and returns a DB access object.



Example usage:

```javascript
var p = plugin("sqlite3-plugin");
var db = p.open(dbDef)
```

The `dbDef` is optional, and specifies the name of the sqlite3 file. For example:

| Example                | Notes  |
|----------------------- | ------ |
| "mydatabase.db"        | Access to the DB held in the named file |

The resulting `db` object can then be used to access the `close`, `exec` and `query` methods.

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


