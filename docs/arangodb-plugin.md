# ArangoDB plugin for TBUtil

*Last updated: 30 Apr 2021*

---

In these notes, the following variables are used..

| Name | Description |
| ---- | ----------- |
| A    | Reference to the plugin library |
| conn | A server connection reference object |
| db   | A database reference object |
| coll | A collection reference object |
| doc  | A JSON document contents |
| key  | A document key |

The functions listed below call those with equivalent names in the GoLang ArangoDB library. For details see https://godoc.org/github.com/arangodb/go-driver .

## Plugin initialisation and shutdown

```
var A = plugin("arangodb-plugin");

var conn = A.connect(arangoDb_URL, user_name, password);

A.shutdown();
```


## Datbase management methods

Get a list of the names of all accessible databases.

```
var database_names = conn.getDatabases();
```

Create a new database, and return a handle through which it can be referenced.

```
var db = conn.createDatabase(database_name);
```

Get a handle to an existing database - through which it can then be referenced. The database must exist before this call is made.

```
var db = conn.database(database_name);
```


## Collection management methods

### getCollections

Get a list of the names of all collections in the database.

```
var collection_names = db.getCollections();
```

### createCollection

Create a new collection in the database and return a handle that can be used to reference it.

```
var col = db.createCollection(collection_name);
```

### collection

Get a handle onto an existing collection, through which it can then be referenced.

```
var col = db.collection(collection_name);
```

### truncate

Empty the collection - delete all documents it contains.

```
col.truncate();
```

### removeCollection

Delete an existing collection from the database.

```
db.removeCollection(collection_name);
```

## Document management methods

```
var doc = coll.readDocument(key);

var key = coll.createDocument(doc);

coll.removeDocument(key);

coll.updateDocument(key, doc);

coll.replaceDocument(key, doc);

coll.updateDocument(key, updates_object);
```

## AQL Query methods

```
var cursor = conn.query(aql_string, bindings_object);

while (cursor.hasMore()) {
	var doc = cursor.readDocument();
}

cursor.close();
```

