# vCenter plugin for TBUtil

*Last updated: 1 Jun 2021*

---

A plugin for calling a subset of API functions for a specified vCenter instance.

The plugin provides the following functions to connect to vCenter and return a client connection object.

| Name | Description |
| ---- | ----------- |
| open | Open a connection to a vCenter. |
| openTarget | Open a connection using a Turbonomic target. |

It also provides the following functions to call methods against an object client connection.

| Name | Description |
| ---- | ----------- |
| close | Close the connection. |
| detachTag | Detach a specified tag from an object. |
| find | Find managed objects by name or path. |
| findClusters | Find clusters. |
| findDatacenters | Find data centers. |
| findDatastores | Find data stores. |
| findHosts | Find hosts. |
| findResourcePools | Find resource pools. |
| findVms | Find virtual machines. |
| get | Get details of a managed object. |
| getAttachedTags | Get the tags attached to a managed object. |
| getAttachedObjects | Get the objects attached to a tag. |
| getClusterInfo | Get info about a specified cluster. |
| getDatastoreInfo | Get into about a specified data store. |
| getHostInfo | Get info about a specified host. |
| getResourcePoolInfo | Get info about a specified resource pool. |
| getVmInfo | Get info about a specified VM. |
| list | List managed objects of a specified type. |
| method | Call one of a subset of methods for a specified managed object. |
| migrateVM | Move a VM to a new host, data store, resource pool or folder. |


## open(url, user, password [, withTagManager])

Opens a connection to the vCenter specified using it's URL, user name and password and returns an object through with further API methods can be called.

The password must be passed in encrypted form, as returned by the command..

```
tbutil crypt -encode CLEAR_TEXT_PASSWORD_HERE
```

If `withTagManager` is specified and is true, then the plugin will perform two logins. One to the vCenter REST API and another to the tag manager API. This opens up some additional features but consumes more resources.

Example:

```
var P = plugin("vcenter-plugin");
var pass = "19dc72526c583bf0e0d97a94d780b619a8a09de0cfbcacfd20e3c2b9c22d00c86ffa052e1ed696661f154cc5ef449ab5";
var vc = P.open("http://vcenter1.local", "apiUser", pass, false);
```


## openTarget(targetDto [, withTagManager])

This function can only be used by TBScripts that run in a K8S pod in the same namespace as the Turbonomic software itself, and can only refer to targets known to the local instance.

The function opens a connection to the vCenter described in the provided Turbonomic target DTO object (which should not include a value for the password). The returned object can then be used to call the API methods described below.

If `withTagManager` is specified and is true, then the plugin will perform two logins. One to the vCenter REST API and another to the tag manager API. This opens up some additional features but consumes more resources.

Example:

```
var uuid = "7123123123123";
var target = client.getTarget(uuid);
var vc = P.openTarget(target, false);
```


## close()

Close the connection.

Example:

```
vc.close();
```


## detachTag(class, name, catName)

Detach a specified tag from an object.


## find(dc, class, path)

Find managed objects by name or path.


## findClusters(dc, pattern)

Find clusters.


## findDatacenters(pattern)

Find data centers.


## findDatastores(dc, pattern)

Find data stores.


## findHosts(dc, pattern)

Find hosts.


## findResourcePools(dc, pattern)

Find resource pools.


## findVms(dc, pattern)

Find virtual machines.


## get(class, name, fields [, pathToo])

Get details of a managed object.


## getAttachedTags(class, name [, catsToo])

Get the tags attached to a managed object.


## getAttachedObjects(tagId)

Get the objects attached to a tag.


## getClusterInfo(id, fields [, pathToo])

Get info about a specified cluster.


## getDatastoreInfo(id, fields [, pathToo])

Get into about a specified data store.


## getHostInfo(id, fields [, pathToo])

Get info about a specified host.


## getResourcePoolInfo(id, fields [, pathToo])

Get info about a specified resource pool.


## getVmInfo(id, fields [, pathToo])

Get info about a specified VM.


## list(dc, class)

List managed objects of a specified type.


## method(class, name, method)

Call one of a subset of methods for a specified managed object.


## migrateVM(vmId, relocations)

Move a VM to a new host, data store, resource pool or folder.

