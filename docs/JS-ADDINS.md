# Add-ins available to TBUtil 2.0h JS formatters and TBScripts

*Last updated: 6 Sep 2021*

Note: the selection of features and functions available to scripts depends on the context in which they are called. The following context types exist..

| Context type | Description |
| ------------ | ----------- |
| Formatter scripts | A number of the "`tbutil`" built-in sub commands allow custom scripts to be used to perform non-standard formatting of their output. These are specified using the "-s" option on the command line, are purely for formatting and have no ability to make additional API calls. |
| Table output | A small subset of the built-in subcommands write sophisticated tables when the "-x" option is used. In a few cases, embedded JS scripts are used for this. In such cases, the script has an additional set of functions avalable to assist in formatting the output.  |
| Pure-JavaScript sub-commands | Some subcommands are written purely in embedded JS. They have a handful of additional functions that allow them to perform API calls, inspect the command line arguments and handle secret payload content. |
| TB Scripts | x |


## Template strings

tbscript has limited support for ES6 template strings (this is implemented as a patch to the "Otto" interpreter code).

This feature is used when strings are specified between a pair of back-ticks. In this case, the string can span multiple lines and is passed to the function "interpolate" for processing at the point of declaration. This makes the following ...

```javascript
var a = `Hello ${who},
Nice to see you`;
```

Equivalent to ...

```javascript
var a = interpolate("Hello ${who}\n" +
"Nice to see you");
```

Unlike ES6, you cannot prepend the name of a function to the string to specify custom processing. Instead, you can declare an "interpolate" function of your own in the calling context.

The default "interpolate" function works like the ES6 template parser.

See "interpolate" function for more details.


## args[ ]

An array of arguments passed to the script itself.

Note that if the script has the "#!" syntax on line 1 and has execute permission, it can be run on Linux or Darwin without naming the tbscript binary, like this..

```
myscript.js -c @demo 009128713-123--123 -x
```

In this specific style, the "-c" flag is reserved and the value that follows does NOT show up in "args". So args[0] would be "009128713-123--123" and args[1] would be "-x".


## {array}.includes(value)

The `includes` method is an extension to the Array object type in JavaScript.

It returns true if the array contains one or more instances of the specified value.

It returns false if the value is not present in the array.


## call(subCommand [,arguments ...])

This function allows a tbutil subcommand that is coded in JavaScript to be called as if it were a subroutine. `call` locates and runs the subCommand code and passes the arguments to it in the `args` array. The function returns the code that the subCommand would otherwise return to the shell.

The values in `arguments` can be scalars or arrays. The list is flattened before being passed to the command.

The difference between this and `{client}.tbutil` is that the latter spawns a new process to handle the command where as `call` invokes the subCommand as a subroutine in the same JsVM as the caller.

You can wrap the invokation of `call` using the `collect` function if you want to capture the standard input and standard error strings emitted by the subCommand.

Here's a simple example that prints the list of targets on the standard output.

```
call("list targets", "-l");
```

Here's an example that collects the JSON data for the targets and prints the number of entries.

```
var rtn = collect(function() { call("list targets", "-j"); });
var obj = JSON.parse(rtn[2]);
println(obj.length);
```


## client

The object via which the API for the Turbonomic instance can be accessed. The connection with the instance is defined according to the credentials specified on the TBScript command line, or the @default credentials from .tbutilrc if none are specified explicitly.

Example..

```javascript
var groups = client.getGroups();
```

The list of methods that can be called using this object includes...

* The methods listed in the REFERENCE.md (and REFERENCE.pdf) files from the turbo-api-client-lib project.
* The methods declared in the "jsmodules/client_addins.js" script.
* The methods listed below.

Note: `client` is implemented internally as an alias to a function call, so trying to set it's value results in a syntax error.


### {client}.close( )

Closes the client connection, meaning that it cannot be used for any further API calls,


### {client}.findByName(type, name [, multipleOk])



### {client}.findInstance(type, displayName)

Searches for an instance with the specified type and/or display name. Returns the instance or null if none (or more than one) is found. This leverages the "search" endpoint with the "types" and "q" fields set.


### {client}.findInstances(type, displayName)

Searches for instances with the specified type and/or display name. Returns the instance list - which may be empty. This call leverages the "search" endpoint with the "types" and "q" fields set.


### {client}.getCookie(name)

Gets the value of the named cookie used in the communication with Turbonomic. Note that this should be called AFTER access to a REST API method to ensure that the cookie is up to date.


### {client}.getCredentialKey( )

If the credentials for the Turbonomic instance were specified on the command line or in the TURBO_CREDENTIALS environment variable using the "@...." syntax (and hence: lifted from the .tbutilrc file), this function returns the credential key used.

If credentials were specified on the command line or in the TURBO_CREDENTIALS environment variable using the "user:password@host" syntax, then this function returns an empty string.


### {client}.getFact(fact_name)

Returns the specified persistent fact string for the client connection. Facts are typically used internally by the API code to differentiate between different Turbonomic instance types.

Note: facts are stored during the API login phase. If no REST API calls have yet been made on the client connection, then the fact will come back empty.


### {client}.getGroupByNameOrUuid()


### {client}.getHost( )

Returns the name of the host (or IP) for the Turbonomic instance to which "client" refers.


### {client}.getInstances([func, ]type ...)

Collects and returns the information for all instances of the specified types. This uses the "getSearchResults" API endpoint.

If the first argument is a function then pagination is used and the function is called for each object found. The return value in this case is the number of objects found.


### {client}.getSwagger( )

Collects the SWAGGER definiiton of the API from the Turbonomic instance, and returns it as a JavaScript object.


### {client}.getUrl( )

Returns the URL used to access the Turbonomic instance. This does NOT include the username or password.


### {client}.hasDbCredentials( )

Returns true if the client credentials include the details needed to allow access the instance's MySQL DB.


### {client}.hasSshCredentials( )

Returns true if the client credentials include the details needed to access the instance using SSH.


### {client}.http.delete(path, options, body)

Allows direct access to any Turbonomic API call that uses the "DELETE" web method.

The "path" parameter omits the protocol, username, password, host, port, base path and query parameters but includes the API-specific subpath. If "path" starts with "\~" then the configured base URL path is ignored.

The options argument is a JS object that contains the key:value pairs for any URL query options that need to be passed. You can use null if there are none.

The body is a JS object that will be used as the method body. If none is needed, using the null value.

For example - deleting a group who's UUID is known ...

```javascript
var rtn = client.http.delete("/groups/"+group_uuid, null, null);
```


### {client}.http.get(path, options)

Allows access to any Turbonomic API call that uses the "GET" web method.

The "path" parameter omits the protocol, username, password, host, port, base path and query parameters but includes the API-specific subpath. If "path" starts with "\~" then the configured base URL path is ignored.

The options argument is a JS object that contains the key:value pairs for any URL query options that need to be passed. You can use null if there are none.

Example - getting the details of a group ...

```javascript
var group = client.http.get("/groups/"+uuid, { include_aspects: true });
```


### {client}.http.get_anon(path, options)

Allows access to any Turbonomic API call that uses the anonymous "GET" web method (ie: "GET" calls that do not required a login token).

The "path" parameter omits the protocol, username, password, host, port, base path and query parameters but includes the API-specific subpath. If "path" starts with "\~" then the configured base URL path is ignored.

The options argument is a JS object that contains the key:value pairs for any URL query options that need to be passed. You can use null if there are none.

Example - getting the details of a group ...

```javascript
var version = client.http.get_anon("/admin/versions");
```


### {client}.http.post(path, options, body)

Allows access to any Turbonomic API call that uses the "POST" web method.

The "path" parameter omits the protocol, username, password, host, port, base path and query parameters but includes the API-specific subpath. If "path" starts with "\~" then the configured base URL path is ignored.

The options argument is a JS object that contains the key:value pairs for any URL query options that need to be passed. You can use null if there are none.

The body is a JS object that will be used as the method body. If none is needed, using the null value.


### {client}.http.postXml(path, options, name, fileName, body)


### {client}.http.put(path, options, body)

Allows access to any Turbonomic API call that uses the "PUT" web method.

The "path" parameter omits the protocol, username, password, host, port, base path and query parameters but includes the API-specific subpath. If "path" starts with "\~" then the configured base URL path is ignored.

The options argument is a JS object that contains the key:value pairs for any URL query options that need to be passed. You can use null if there are none.

The body is a JS object that will be used as the method body. If none is needed, using the null value.


### {client}.isIWO( )

Returns `true` if the client connection refers to an IWO instance, otherwise it returns `false`.


### {client}.isLocal( )

Returns `true` if the client connection refers to the local host or any of it's local IP addresses, otherwise it returns `false`.


### {client}.isXL( )

Returns `true` if the client connection refers to a Turbonomic V7 (also known as "XL") instance, otherwise it returns false.

Note: IWO is also an "XL" style platform. Is `isXL` returns `true` for IWO instances as well.


### {client}.lastException( )

This call returns details of the last exception reported by the API when accessed via the client object. The actual exception has to be caught using try/catch in order to avoid the automatic script termination. For that reason, this call is normally used in the "catch" clause.

The function returns the REST error body as a JS object. This normally has the following properties...

| Property  | Description |
|-----------|-------------|
| type      | integer: the HTTP protocol status code. Eg: 404 for "not found". |
| status    | The string representation of the HTTP status code. |
| exception | The JAVA exception as a string. |
| message   | The message field of the java exception (not always present). |
| isNotFound | bool: true if the error denotes a not-found response (type 404). |

Example: delete a policy but do not complain if it didnt exist...

```javascript
try {
	client.deleteSettingsPolicyByUuid(uuid);
} catch(err) {
	if (client.lastException().type !== 404) {
		throw err;
	}
}
```

### {client}.lastTime( )

Returns the time value contained in the response to the last API call made. This allows the script to learn the time as known by the instance server.

The value returned is the integer count of the number of seconds since the UNIX Epoch.


### {client}.nextCursor( )

Exposes the "next-cursor" header used on API functions that implement paging. These APIs are those that include a "cursor" and "limit" field in their options object (see REFERENCE.md).

Example of use that processes all the VMs in the market in pages of 250 (see the comments for details of how the cursor value and nextCursor() function should be used)...

```javascript
var cursor = "0";  // always use "0" to seed the pagination loop (must be string, not integer)

while (cursor !== "") {  // an empty cursor string marks the end of the results.

	var opts = {
		scopes: [ "Market" ],
		types: [ "VirtualMachine" ]
		cursor: cursor,   // copy the cursor value into the opts object
		limit: 250        // number of objects to return per page
	};

	var found = client.getSearchResults(opts);

	cursor = client.nextCursor();  // update the cursor after each call to the API function

	// now do something with the contents of "found"
}
```

See also `{client}.totalRecordCount()`


### {client}.paginate(funcName, [args, ]opts[, body], callback)


### {client}.setCache([duration, directory_or_null])

Sets the client up for cached exchanges. This allows for repeated calls to be made without actually exchanging data. It should ONLY be used when the possibly negative impact is understood. The feature is designed primarily to assist unit testing of the tbutil tool itself.

If no arguments are specified, the values of the env vars TURBO_CACHE_TIME and TURBO_CACHE_DIR are used (note: the function is implicitly called this way for the default initial client connection used by JS code).

The `duration` indicates how long the cached packets are valid for. It may be specified as an integer number in seconds, or a GO language duration string.

> A duration string is a possibly signed sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms", "-1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".

The `directory_or_null` argument indicates the name of the directory where the cache files are to be stored. If null, then the default directory "turbo-cache.d" will be used.


### {client}.setTimeout(duration_string)

This function sets the timeout applied to all the following REST API transactions for the client. The `duration_string` must be given in the format supported by the GOLang `time.ParseDuration` function.

A value of "0" turns the timeout feature off, meaning that the timeout drops back to the OS's default times for the socket system calls.

> A duration string is a possibly signed sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms", "-1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". 

This function overrides any values specified using the `TURBO_HTTP_TIMEOUT` environment variable.

Note: the `newClient` function call performs some API queries so to specifiy a timeout early enough to impact those, you should use the `timeout` argument in the `newClient` function itself.


### {client}.ssh

This is an object that allows the "loadXXX()" commands to be used to access files on a remote Turbonomic instance using SSH. For example ..

```javascript
var data = client.ssh.loadCsv("/tmp/data-file.csv");
```

This mechanism supports the following methods..

- download
- executeShellCommand
- loadCsv
- loadJson
- loadGrep
- loadText
- loadDiscoveryData
- loadXml

The file name in each "load...()" case must the name of a file on the remote file system OR a shell command line, ending with a pipe character ("`|`""). In this latter case, the shell command is executed and its standard output is treated as if it was the content of the file. For example:

```javascript
var files = client.ssh.loadText("ls -l /srv/tomcat/data |");
```

Note: You must define the SSH credentials for the client connection using "tbutil [@key] save ssh credentials", and the mechanism only works for connections estalished using a credential key set up in this way (specified either on the tbscript command line or as the parameter to the `newClient` function).


### {client}.ssh.download(remote_source_file_name, local_target_file_name, may_unzip)


### {client}.ssh.executeShellCommand(command [, standard_input ])


### {client}.ssh.loadCsv( ... )


### {client}.ssh.loadJson( ... )


### {client}.ssh.loadGrep( ... )


### {client}.ssh.loadText( ... )


### {client}.ssh.loadDiscoveryData( ... )


### {client}.ssh.loadXml( ... )


### {client}.tbutil(sub_command, capture_stdout, arguments_list)

This command can be used to execute any of the tbutil built-in commands, and optionally capture the output.

The `sub_command` parameter is a string specifying the action to take. An example would be "create static group".

The `capture_stdout` parameter is a boolean. If true, then the text written to the standard output by the subcommand is collected into the "out" field of the return object instead of being written to the stdout device or file. This allows the calling script to inspect the returned information.

The `arguments_list` parameter is an array of strings, containing the arguments to be passed to the command.

The function returns an object with the following fields:

* `status`: the integer value the sub command returned (0=okay, 1=warning, 2=error)
* `out`: if capture_stdout is true, then this field contains the text that the sub command wrote to the standard output.

For example..

```javascript
var rtn = client.tbutil("create static group", true, _.flatten(["New Group", "VirtualMachine", "-u", vmUuids]) );
if (rtn.status === 0) {
	var uuid = rtn.out.trim();
	printf("Created group with uuid %s\n", uuid);
}
```

See the `call` and `collect` functions for an alternative approach.


### {client}.totalRecordCount()

The value of the "totalRecordCount" REST API header will be placed here for calls that make use of pagination. This operation returns the most recently seen value of the header.

See also `{client}.nextCursor()`


## clone(function_name ...)

Context: only usable in a go-routine.

When a user JS function is executed using the "`go`" command it is COPIED into a new, otherwise empty, JVM. The logic and rules surrounding this approach are described against the "`go`" command, below.

Other user JS functions in the main JVM are NOT copied over by this process and so they cannot be used in the new JVM - UNLESS they are also explicitly copied over by the new JVM using the "`clone`" command.

For example ....

```javascript
function sayHello() {
	println("Hello");
}

function sayGoodbye() {
	println("Bye!");
}

function sayHelloAndGoodbye() {
	clone("sayHello");
	sayHello();   // that works because it was cloned
	sayGoodbye(); // that fails with "function not found" error becase it wasnt cloned
}

var ch = go(sayHelloAndGoodbye);
wait(ch);
```

Note that cloned functions must be specified by name and that it does not work with anon functions like this..

```javascript
var myFunc = function() {
	println("Hello");
};

function sayHello() {
	clone("myFunc");		// fails: function not found
}

var ch = go(sayHello);
wait(ch);
```


## collect(function...)

Runs the specified JS function and collects and returns an array that contains four values in the following order ...

* The function's return value or null.
* The error thrown (if any) or null.
* The text written to standard output.
* The text written to standard error.

Note: if the function aborts the script using `exit` or `woops` etc, then that is genuinely the end of the script's life and the collect() function does not return to the caller.


## colour([colourName ...])

When the console or terminal supports colours, this command can be used to select the colour of the text that follows.

NOTE: "colour" has the British/English spelling.

Recognised colour names are..
* green
* blue
* red
* yellow
* cyan
* magenta
* white
* black

The names can be specified in any combination of letter case, so "GREEN", "Green" and "green" all mean the same thing.

Prepending the string "hi" to a colour name causes the bright version of that colour to be used. Example: "hiBlue".

Prepending "bg" causes the background colour to be set. To use both "bg" and "hi", the "bg" must come first. So "bgHiBlue" is valid bit "hiBgBlue" is not.

You can also use the following special codes to set different attributes of the text to be displayed. Support for these attributes is limited on many terminals (including putty), but "bold" and "underline" are supported on many. Use of the others is probably best avoided.
* bold
* faint
* italic
* underline
* blinkslow
* blinkrapid
* reversevideo
* concealed
* crossedout

Multiple non-conflicting codes can be used in the same command, for example:

```
colour("blue", "bgHiCyan", "underline")

```

Calling `colour()` with no arguments resets the following output to the default terminal profile (typically white text on a black background).


## commandPipe(command, arguments)

This function runs a local `command` with the specified `arguments` and collects the standard output via a system pipe. The complete standard output text is returned as a string.

The `command` string follows the normal conventions of the local shell (ie: it considers the contents of the PATH environment variable).

The `arguments` parameter is an array which must always be specified, even if it is empty.

If the command exists with a non-zero status, `commandPipe()` throws an error.

For example..

```javascript
var files = commandPipe("ls", [ "-l", "/"] );
print(files);
```


## credentials

This variable contains the credentials string specified on the command line when tbscript was started.


## {date}.format(format_string)

Returns the date/time object formatted using the GOLang time formatting logic. See https://golang.org/pkg/time/#Time.Format

Example: This prints the current date in the format YYYY-MM-DD ..

```
var now = new Date();
println(now.format("2006-01-02"));
```


## dnsLookup(host [, dnsServerAndPort])

Performs a DNS lookup for the host using the specified DNS server. The `dnsServerAndPort` string must contain both the host name or IP and port number of the DNS server, delimited in the traditional way with a colon. Like this: "localhost:4091".

If dnsServerAndPort is not specified, then the default operating system resolver is used and the system configured list of domains will be searched.

If `dnsServerAndPort` is specified and `host` is not an IPv4 address, then the host name must be the fully qualified name and no automated searching is employed. If the host name does not end with dot, the dot is added.

If the `host` is actually an IPv4 address string and no `dnsServerAndPort` is specified then the function will attempt a reverse DNS lookup and return any names it finds.


## encryptPassword(pass, type)

Returns: encrypted password.

| Type | Description |
| ---- | ----------- |
| 1    | encrypt for API, SSH and DB passwords in .tbutilrc |
| 2    | encrypt for use in import files (eg: for targets or users) |


## eprint(value ...)

Prints the specified values on the standard error one after the other, NOT followed by a "new line" character.

If possible, the text is coloured red.


## eprintf(format, value ...)

Prints the values on the standard error device using the format specified. If possible, the text is coloured red.

See "printf" for information about the correct syntax for the format string.

Example ..

```javascript
eprintf("Cant find group %v\n", groupName);
```


## eprintln(value ...)

Prints the specified values on the standard error one after the other, followed by a "new line" character.

If possible, the text is coloured red.


## exists(fileName [, followLink])

Checks the file's existance and type and returns ...

| Value | Meaning |
| ----- | ------- |
| null | the file doesnt exist |
| "f"  | it exists and is a regular file |
| "d"  | it exists and is a directory |
| "p"  | it exists and is a named pipe |
| "l"  | it exists and is a symbolic link |
| "c"  | it exists and is a character device |
| "b"  | it exists and is a block device |
| "s"  | it exists and is a named socket |
| "-"  | it exists but is not one of the known types |

The optional `followLink` argument is a boolean that changes the behavour if the named file is a symbolic link. If `true` (or not specified) then the reply refers to the linked-to file. If `false` then the reply refers to the link itself.

See also "filepath"


## exit(status)

Exit the script, aborting the JVM and return the integer status to the calling shell.

See also: return


## filepath

The `filepath` object gives acess to a subset of the GOLang filepath features, as follows..


### filepath.abs(path)

`abs` returns an absolute representation of path. If the path is not absolute it will be joined with the current working directory to turn it into an absolute path. The absolute path name for a given file is not guaranteed to be unique.


### filepath.base(path)

`base` returns the last element of path. Trailing path separators are removed before extracting the last element.


### filepath.clean(path)

`clean` returns the shortest path name equivalent to path by purely lexical processing.


### filepath.dir(path)

`dir` returns all but the last element of path, typically the path's directory.


### filepath.ext(path)

`ext` returns the file name extension used by path. The extension is the suffix beginning at the final dot in the final element of path; it is empty if there is no dot.


### filepath.isAbs(path)

`isAbs` reports whether the path is absolute.


## functions module -- {F}


### {F}.argOption(option)


### {F}.argValue(option)


### {F}.checkForExpectedPaths(tree, expected)


### {F}.compareStrings(a, b)


### {F}.extendedOptions


### {F}.findStat


### {F}.getFilterFunc


### {F}.getUniquePaths(tree)


### {F}.printSortedTable(headers, rows, sort_column)


### {F}.printTree(args_object, tree)


### {F}.sortBy


### {F}.sortByDisplayName


### {F}.sortByStringProperty


### {F}.sortTable(rows, byColumn)


### {F}.tabulate(tree, config_object)


### {F}.writeSortedTable(args_object, headers, rows, sort_column)


## getenv(env_var_name)

Gets the specified environment variable from the operating system. If it is not set, then null is returned instead.

Example ..

```javascript
var pathDirs = getenv("PATH").split(":");
```

Some special env_var_name strings are handled...

| Name | Description |
| ---- | ----------- |
| @CWD | The current working directory. |
| @EGID | The effective group ID (-1 on Windows). |
| @EUID | The effective user ID (-1 on Windows). |
| @EXECUTABLE | The path name for the tbutil or tbscript executable that started the current process. |
| @GID | The group ID (-1 on Windows). |
| @GROUPS | The list of the numeric ids of groups that the caller belongs to (null on Windows). |
| @HOSTNAME | The host name reported by the kernel. |
| @IS_CLASSIC_OVA_PLATFORM | Boolean: is this a classic OVA-built platform? |
| @IS_DARWIN | Boolean: is this a MAC (Darwin) platform? |
| @IS_DYNAMIC | Boolean: is this a dynamic-build version of the tool? |
| @IS_LINUX | Boolean: is this a Linux platform? |
| @IS_LOCAL_PLATFORM | Boolean: is this a Turbonomic VM platform? |
| @IS_WINDOWS | Boolean: is this a Windows platform? |
| @IS_XL_OVA_PLATFORM | Boolean: is this an XL OVA-built platform? |
| @IS_XL_CONTAINER | Boolean: is this an XL K8S pod? |
| @ISSUEDTO | The name (or email address) of the person to whom this copy of tbutil has been issued to |
| @LOCAL_IP | The local IP address (if possible to determine), or null. |
| @MACHINE_ID | The real (or synthetic) machine ID. |
| @PATH | The system path, as a list of directory names. |
| @PID | The process ID of the tbutil/tbscript process. |
| @PPID | The parent process ID of the tbutil/tbscript process. |
| @UID | The user ID (-1 on Windows). |
| @TWIDTH | The width of the terminal (or null) |
| @THEIGHT | The height of the terminal (or null) |
| @USERHOMEDIR | The current user's home directory. On Unix, including macOS, it returns the $HOME environment variable. On Windows, it returns %USERPROFILE%. |
| @USERCACHEDIR | The default root directory to use for user-specific cached data. Users should create their own application-specific subdirectory within this one and use that. On Unix systems, it returns $XDG_CACHE_HOME if non-empty, else $HOME/.cache. On Darwin, it returns $HOME/Library/Caches. On Windows, it returns %LocalAppData%. |
| @USERCONFIGDIR | The default root directory to use for user-specific configuration data. Users should create their own application-specific subdirectory within this one and use that. On Unix systems, it returns $XDG_CONFIG_HOME if non-empty, else $HOME/.config. On Darwin, it returns $HOME/Library/Application Support. On Windows, it returns %AppData%. |
| * | The list of available environment variable names (excluding the "@..." ones). |


## go(function_reference, arguments ...)

The "`go`" command is used to create a new JavaScript VM (aka: JVM), copy the specified function into it and run it asynchronously in a private go-routine (aka: thread). "`go`" returns a channel identifier which can be used with "`wait`" to synchronise with the main JVM and allow its return value to be retrieved. For example ...

```javascript
function getGroupMembers(credentials, uuid) {
	var connection = newClient(credentials);
	var members = connection.getMembersByGroupUuid(uuid);
	connnection.close();
	return members;
}

// start the process of collecting group members for backup and primary instances in parallel
var ch1 = go(getGroupMembers, "@backup", uuid);
var ch2 = go(getGroupMembers, "@primary", uuid);

// collect the results of the API operations
var result1 = wait(ch1);
var result2 = wait(ch2);
```

Note that the "`go`" command *copies* the referenced function into the new JVM, passes *copies* of the arguments to it and starts it running asychronously.

The word "copies" (which appears twice in that sentence) is VERY important to understand. It means that..

* When the referenced function runs, it runs in a different JVM to the main one and so has no access to any of the other JS functions and variables declared there (even global ones). It CAN however use the standard JS functions provided by OTTO and the specific addin functions provided by tbscript or tbutil (these are listed in this document).
* The exception to the above rule is that functions in the main JVM can be copied explicitly into the new one using the "clone" function (see above). This is NOT possible for variables or data structures, however.
* Any arguments specified to the "`go`" command are deep-copied into the new JVM. This means that changes made to them in the new JVM are NOT reflected in the main one.
* Functions in the main JVM *cannot* be passed as arguments to the new JVM. Or rather: if they are, they cannot be called.
* The only way to pass information back to the main JVM is to use "`return`" in the new JVM, and collect the results using "`wait`" in the main JVM.
* The "`client`" object is NOT connected to any Turbonomic instance in the new JVM. You should use "`newClient`" to establish the desired connection in the new JVM.
* Any client objects passed as arguments to "`go`" MUST have been openned using a credential key (eg: @demo). The value passed to the function is the credential key used. The function must use then "newClient" to establish the connection in the new JVM.

There are three configuration parameters that are relevant to this mechanism which can be set using the goConfig() function or the TURBO_GOCONFIG environment variable. For details of these configuration values, please refer to the "goConfig" section below.

The `go` function returns a positive channel number on success, but can return -1 if the request queue is full (and `panicFlag` is false) and the request has therefore not been queued. Note: it does not wait for space to become available (ie the 'send to request queue' action is non-blocking). This allows the calling JS code to push as many requests as possible, and when the queue is full it will be informed by the return value of -1, allowing it to drain some waiting results in order to liberate more workers. Here is a design pattern that leverages this mechanism. It uses the following variables..
- collect: the function that is to be called for each instance in the child JVMs/threads.
- collectResults: function gathers the results from "collect" and processes them in the main JVM/thread.
- instanceCreds: array of credential strings.
- chans: array of results channels
- collectionIdx: index of the last instance from whom we have collected results.


```javascript
function collect(instanceCred) {
	var client = newClient(instanceCred);
	// do something with the client;
	return results;
}

var chans = [ ];
var instanceCreds = args;
var collectionIdx = 0;

function collectResults(index) {
	var results = wait(chans[index]);
	// do something with "results" from instanceCreds[index]
}

for (var i=0; i<instanceCreds.length; i+=1) {
	var chan = go(collect, instanceCreds[i]);
	if (chan === -1) {
		collectResults(collectionIdx ++);
	} else {
		chans[i++] = chan;
	}
}

for (var j=collectionIdx; j<instanceCreds.length; j+=1) {
	collectResults(j);
}
```

An alternative approach is to ensure that there are at least as many slots in the request queue as there are requests to be queued. This can be set using the "goConfig" call. With this approach, the code can enqueue all the requests using "go" and then switch to collecting and processing the results using "wait".

This mechanism is not intended to supply a full-function multi-threaded, data-sharing paradigm. It is designed to allow API calls to be made in parallel to multiple Turbonmic instances using secure sandboxes to avoid the programming challenges normally associated with multi-threadded applications. For this reason we expect that the referenced function's logic will be simple and brief and the limitations mentioned above are not significant.

Typical use cases involve making the same API calls to multiple instances in parallel, and returning the data to the main process for amalgamation there.

Please DO NOT use this mechanism to make multiple parallel API calls to the SAME Turbonomic instance. TButil does not prevent such a programming style, but it's impact on the target instance could be detrimental.

Have a look at the "top-storage-users.js" script for full-featured example of the go/wait mechanism in use.

NB: If you use a plugin from within a "go()" JVM, its "shutdown()" function will automatically be called when the JVM terminates.


## goConfig(startQueueSize, numJvms, panicFlag)

This function is used to tune the way that that the "`go`" function works and if it is called, it MUST be called before any calls to "`go`" are made (it will fail if this rule is not followed).

The "`numJvms`" number indicates the ceiling on the number of JVM instances can be run in parallel. Additional "`go`" Requests  are queued and will be serviced as existing JVMs become free.

The "`startQueueSize`" number indicates how many go() requests can be placed in the start queue.

The "`panicFlag`" boolean indicates what to do if the queue is full. `true` causes `go()` to panic, `false` causes it to return the value -1.

The default values (if `goConfig` is not called) are: 32, 4, false.

The figure below shows how components of the mechanism are used.

```
          go()                   +-->  JVM#1  --+
Main JVM  --->  Request Queue  --+-->  JVM#2  --+-->  Results queue  --+
 ^                               +-->  JVM#3  --+                      |
 |  wait()                                                             |
 +---------------------------------------------------------------------+
```

Code in the Main JVM sends requests for asynchronous processing to the request queue (which can hold upto `startQueueSize` entries) using the "`go`" function. The asynchronous JVMs each wait to read a single request from the queue, process it and put the returned result onto the results queue [blocking if the main process is not executing the `wait` call]. They then loop back to read and process another. The size of the results queue is fixed at 1.

The "wait" function called in the main JVM drains results from ANY child threads that have results ready, places them all into a memory cache, then selects one to return to the caller.


## handleFunc(path, func)

See the entry for "listenAndServe".


## httpExecute(method, url, headers)

Executes a generic HTTP web request.

The `method` must be a method supported by the server. Typical examples include `GET`, `PUT`, `POST` and `DELETE` .

The `url` is the fully qualified URL, including any encoded query parameters.

The `headers` is a map that contains key-value pairs for placing into the HTTP request header. If the call requires a body text, then the special header `$body` should be used for this purpose. Note: it is not possible to specify multiple headers with the same name.

The returned object contains the HTTP headers from the response message (names are all lower case) and the following special properties:

| Name | Description |
| ---- | ----------- |
| `$body` | the body of the response. |
| `$status` | the numeric HTTP status code. eg: 200 for okay. |
| `$proto` | the response protocol; eg 'HTTP/1.1'. |

If a header occurs multiple times, then the value seen in the return map is an array, otherwise it is the string value (integer in case of '$status').

The HTTP exchange occurs with the following configuration values pre-set:

| Description | Value |
| ----------- | ----- |
| Timeout | 60 seconds |
| Keep alives | enabled |
| Compression | enabled |
| SSL certification verification | disabled |


## interpolate(str)

NB: Consider using back-tick quotes to specify a template string instead of calling "interpolate()" direcly.

This function processes the string argument, replacing any sub-expressions bounded by "${" and "}" with the results of evaluating the expression in the current context.

For example:

```javascript
var a = "one";
var b = interpolate("${a.toUpperCase()} two");
println(b);
```

prints the text "ONE two".

The expressions can be arbitrarily complex.

The above example can also be written using an ES6-like syntactic sugar..

```javascript
var a = "one";
var b = `${a.toUpperCase()} two`;
println(b);
```

In this case, the string is bounded by back-ticks, and the call to "interpolate" is implied.

The other advantage of back-ticked template strings is that they can span multiple lines.

The TBScript version of the Otto interpreter has been extended to allow template strings to be specified between back-ticks in this way. When this feature is used, the "interpolate" function is automatically called with the provided string as argument. This mirrors a slightly reduced version of the way ES6 "template strings" feature works. The key differences being..

* Tagged templates are not support (you cannot prepend a function name to the string).
* Interpolation is performed by the function "interpolate()", which can be overridden.
* Custom interpolation requires you to write you own "interpolate" function, making it available in the same context as the back-ticked string.

An example of overriding the interpolation function ...

```javascript
var interpolate = function(s) { return s.toUpperCase(); }
var a = "one";
var b = `${a.toUpperCase()} two`;
println(b);
```

prints the text "${A.TOUPPERCASE()} TWO"


## jsonpath module -- {JP}


### {JP}.jsonPath(array_object, path_expression)


## listenAndServe(addr)

The `listenAndServe` and `handleFunc` functions combine to expose the GO language web server mechanism to tbscript. This allows you to use tbscipt to write a simple web service. The approach used here is described in the GO documentation for the "http" module.

`listenAndServe` listens on the TCP network address addr and handles requests on incoming connections. Accepted connections are configured to enable TCP keep-alives.

`listenAndServe` always blocks or throws an error.

`handleFunc` registers the handler function for the given pattern. The notes below explain how patterns are matched...

*The following is a paraphrase of the relevant GO documentation ....*

> The HTTP request multiplexer matches the URL of each incoming request against a list of registered patterns and calls the handler for the pattern that most closely matches the URL.
>
> Patterns name fixed, rooted paths, like "/favicon.ico", or rooted subtrees, like "/images/" (note the trailing slash). Longer patterns take precedence over shorter ones, so that if there are handlers registered for both "/images/" and "/images/thumbnails/", the latter handler will be called for paths beginning "/images/thumbnails/" and the former will receive requests for any other paths in the "/images/" subtree.
> 
> Note that since a pattern ending in a slash names a rooted subtree, the pattern "/" matches all paths not matched by other registered patterns, not just the URL with Path == "/".
>
> If a subtree has been registered and a request is received naming the subtree root without its trailing slash, the multiplexer redirects that request to the subtree root (adding the trailing slash). This behavior can be overridden with a separate registration for the path without the trailing slash. For example, registering "/images/" causes the multiplexer to redirect a request for "/images" to "/images/", unless "/images" has been registered separately.
>
> Patterns may optionally begin with a host name, restricting matches to URLs on that host only. Host-specific patterns take precedence over general patterns, so that a handler might register for the two patterns "/codesearch" and "codesearch.google.com/" without also taking over requests for "http://www.google.com/".
>
> The multiplexer also takes care of sanitizing the URL request path and the Host header, stripping the port number and redirecting any request containing . or .. elements or repeated slashes to an equivalent, cleaner URL.

The handler functions passed as the second argument to `handlerFunc` have the following signature..

```javascript
function myHandlerFunction(writer, request)
```

The `writer` argument is of type `TBHttpResponseWriter` and has the following methods...

| Signature | Description |
| --------- | ------------|
| setStatus(number) | Set the HTTP response status code. Eg 404 for "Not found". |
| addHeader(name, value) | Append a header, Eg: "Content-Type", "application/json". |
| setHeader(name, value) | Set the header, deleting all existing headers with the same name. |
| getHeader(name) | Get all values of headers with the specified name. The return is an array. |
| delHeader(name) | Delete all headers with the specified name. |
| print(value ...) | Write the values to the body of the response. |
| println(value ...) | As "print()" but add a newline at the end. |
| printf(format, value ...) | as "print()" but using a GO formatting string. |
| printJson(value) | Write a human-readable representation of the value as a JSON document to the body of the response. |
| copyFile(fileName) | Copy the contents of the file to the body without loading it all into memory. |
| template(fileName, argMap, funcMap) | Writes the contents of the template file (see the `template` function) |

Tne `request` argument is of type `TBHttpRequest` and has the following methods and attributes...

| Signature / Name | Description |
| ---------------- | ----------- |
| getHeader(name) | Get all values of headers with the specified name. The return is an array.  |
| method | Attribute containing the request method (eg: "GET" or "POST"). |
| protocol | Attribute containing the protocol string ("http" or "https"). |
| host | Attribute containing the host name or IP used by the client when making the request. |
| remoteAddr | Attribute containing the client's IP address. |
| body | Attribute containing the text of the request body. |
| path | Attribute containing the request URL path. |
| query | Attribute containing the raw request URL query string. |
| params | An object containing a map of the URL query parameters. |


Here is an example "hello world" server that returns the text "Hello world" when you browse to the URL `http://serverName:8111/hello`.

```javascript
function helloWorld(w, r) {
	w.println("Hello world");
}

handleFunc("/hello", helloWorld);
listenAndServe("0.0.0.0:8111");
```

## loadCredentials(cred_key)

Loads the credentials for the specified credential key. Note that the passwords are not exposed by this function.


## loadCsv(fileName)

Loads the CSV file from the local file system and parses it's contents into a matrix which is returned as a JavaScript array of arrays. Each sub-array contains the fields of one line of the file.

Example..

```javascript
var data = loadCsv("myfile.csv");
println("The 2nd value on line 1 of the file = '"+data[0][1]+"'");
```

Note: The filename "@" can be used to refer to the standard input.

You can also use this function to access CSV files on a remote Turbonomic instance via SSH using the following syntax..

```javascript
var data = client.ssh.loadCsv("/tmp/myfile.csv");
```

See notes for "{client}.ssh" for information about using and configuring this approach.


## loadDiscoveryData(filename)

A number of the files written by Turbonomic (classic) to the instance's local /srv/tomcat/data/discoveries folder use a DTO structured format that is neither JSON, XML or CSV. This function loads such files into a JS object to allow its contents to be inspected. The files in the folder have both a ".dto" and a ".txt" file with the same base name. This function should be used to load the ".txt" file.

Example:

```javaScript
var file = "vCenter_vsphere_dc9.eng.vmturbo.com-2018.10.18.10.34.13.528-FULL.txt";
var dir = "/srv/tomcat/data/discoveries";
var info = loadDiscoveryData(dir + "/" + file);
```

You can also use this function to access files on a remote Turbonomic classic instance via SSH using the following syntax..

```javascript
var data = client.ssh.loadDiscoveryData(dir + "/" + file);
```

See notes for "{client}.ssh" for information about using and configuring this approach.


## loadGrep(fileName, regex_pattern ...)

Opens the specified file and looks for lines that match all the specified regex patterns. The return is an array of arrays of strings where each row of the outer array contains a sub-array of the captured substrings as specified using the RE bracket syntax in the patterns.

This feature can sometimes be used as a light-weight XML parser for handling files that are too large to load into memory.

The regex syntax used is the GO language RE. For details refer to https://github.com/google/re2/wiki/Syntax

See the "examples/numvcpus.js" script for an example of this function in use.

You can also use this function to "grep" files on a remote Turbonomic instance via SSH using the syntax `{client}.ssh.loadGrep(....)`.

See notes for "{client}.ssh" for information about using and configuring this approach.


## loadJson(fileName_or_json_string)

Loads data from the specified json file and parses into a JS object which is returned to the caller.

Example..

```javascript
var conf = loadJson("/etc/patterns.json");
println(conf.version.major);
```

The special filename "@" can be used to refer to the standard input.

The file name can be an http or https URL, in which case the referenced document is download. Note that in this case authentication schemes other than "basic" are not supported.

If the argument is a JSON string, then this function delegates it's actions to the JSON.parse(..) function to parse the string rather than loading from a file from disk.

You can also use this function to access JSON files on a remote Turbonomic instance via SSH using the following syntax..

```javascript
var data = client.ssh.loadJson("/etc/patterns.json");
```

See notes for "{client}.ssh" for information about using and configuring this approach.


## loadScript(fileNameOrCode)

Loads a JS script from the specified file, pre-processes it to convert the V6 extensions info the format that can be executed by OTTO's V5 engine and returns the cooked script as a string.

The syntax "cooking" handles V6 arrow functions and back-ticked strings.

If the `fileNameOrCode` contains "{" and "}" characters then the argument is assumed to contain the JS code rather than the name of a file containing the code. In this case the `fileNameOrCode` is pre-processed to "cook" the V6 elements and convert to V5.


## loadText(fileName)

Loads the text file from the local file system and returns an array of strings where each line of the file is held in a separate element of the array.

Example..

```javascript
var data = loadText("myfile.txt");
println("Line 1 of the file contains '"+data[0]+"'");

```

The special filename "@" can be used to refer to the standard input.

The file name can be an http or https URL, in which case the document referenced is downloaded. Note that in this case authentication schemes other than "basic" are not supported.

You can also use this function to access TEXT files on a remote Turbonomic instance via SSH using the following syntax..

```javascript
var data = client.ssh.loadText("/tmp/vms.txt");
```

See notes for "{client}.ssh" for information about using and configuring this approach.


## loadXml(filename)

Loads the specified XML file from the local file system and unmarshals it into a JS object.

Note: This function uses the "xml-plugin" module. If this is not installed in the same directory as the tbutil binary, the call will fail. The call maps to the "loadXml" function of that plugin.

Also note that the plugin provides additional features that allow XML files to be loaded and re-saved while preserving their layout and format (see the loadXmlSeq and writeXmlSeq functions of the plugin for these use cases).

Example..

```javascript
var data = loadXml("/srv/tomcat/data/topology/DefaultGroups.group.topology");
```

The "print-default-group-tree.js" example script shows a use case for this command.


## loadYaml(fileName)

Reads and parses the specified YAML file and returns its contents as a JS object. The return is an array, each element of which contains the mapped content of one of the blocks in the file.


## Logger( ... ) / logger

Objects of the `Logger` class can be used to write log messages in a controlled manner. The object supports three methods: `print`, `fatal` and `panic`.

Logger objects can be created as follows..

| Syntax | Result |
| ------ | ------ |
| new Logger() | Log messages are written to the standard error device handle. |
| new Logger("on") | Log messages are written to the standard error device. |
| new Logger(fileName) | Log messages are written to the specified file. |
| new Logger(null) | Log messages are not written. |
| new Logger("off") | Log messaages are not written. |
| new Logger(object_or_plugin_ref) | Log messages are written using the `log(progName, message)` method of the object or plugin. |
| new Logger(function) | Log messages are written using the function which must take 2 arguments: progName and message. |

On Linux or Mac (not Windows) you can write to the local syslog server using the syntax..

```javascript
var s = plugin("sys-plugin");
var logger = new Logger(s);
logger.print("This is a message to be written to the syslog");
```

The methods provided by the created object take the following action if logging is active but do nothing if logging is turned off.

| Method | Action |
| ------ | ------ |
| print(message, ...) | the messages are written. |
| fatal(message, ...) | the messages are written and the script exits with code 1. |
| panic(message, ...) | the messages are written and the interpreter aborts with a 'panic'. |


## mkdir(dirname [, allFlag])

Creates the named directory. If allFlag is true, then any required parents are also created.

Fails if the directory already exists or cannot otherwise be created.


## newClient(credentials[ ,options])

Creates a client connection object to a Turbonomic instance other than the one specified on the command line. This can be used to access all the methods documented for the "client" object described earlier.

The credentials can be specified in any of the formats support by tbutil. The following are all valid..

```
@demo2
@demo2:10.10.123.16
mickey-mouse:good-boy-pluto@10.10.123.5
mickey-mouse:good-boy-pluto%21@10.10.123.5
https://mickey-mouse:good-boy-pluto%21@10.10.123.5:443/vmturbo/rest
```

In addition, the call can be used to clone an existing client connection by specifying an existing client object as the argument.

```javascript
var clonedClient = newClient(client);
```

Note that if any credential format that doesnt start with a '@' is used, any "special" characters in the username and password should be encoded as "%" followed by 2 hex digits of ascii value of the character. For example...

* %21: exclamation mark
* %25: percent sign
* %3A: a colon
* %40: the "@" symbol

A number of RFCs define the list of characters that need to be escaped and there is some confusion to be found there. The best (as in: safest) approach is to escape anything in the user name and password fields other than..

* Letters
* Numbers
* Hyphens (minus signs)
* Full stops

Example ..

```javascript
var c2 = newClient("@primary");
var groups = c2.getGroups();
```

Note: `newClient` ignores the TURBO_CACHE_TIME and TURBO_CACHE_DIR environment variables. If you need to set up API caching for the client, then use the `setCache` method.

If `options` is specified, then it should be a JavaScript object containing the options to apply to the connection. The following options are supported:

| Option | Description |
| ------ | ----------- |
| timeout | see the `setTimeout` method |
| skipSwagger | if true, then the client will not download the swagger description and so will not include the API methods declared in it. You can still use the "`client.http` and other built-in methods. |


## newJsvm([fileName])

Creates a new/detached JSVM and methods to allow values to be set and collected. 

BEWARE: any objects or functions shared between the VMs are really shared - which can mess context up quite badly if you get too clever.

If a fileName is specifed, then the file is loaded into the JSVM and is executed.

The function returns an object that has the following methods...


### {vm}.set(name, value)

Sets the named variable to the specified value in the JSVM.


### {vm}.get(name)

Retrieves the value of the named variable from the JSVM.


### {vm}.run(js_code)

Executes the specified code (which is passed as a string) in the JSVM. The value returned by the code (if any) is returned to the caller.


## newUuid()

Returns a new, random UUID string.


## parseCIDR(cidr_string)

This function gives access to the GO language API for IPNets (see https://golang.org/pkg/net/#ParseCIDR). It returns a net.IPNet object that can be used to inspect the information related to the network described by the string. This can be an IPv4 or IPv6 address. The fields and operators for the IPNet object can be accessed from the returned object.

For example, the following code prints "true".

```
var net = parseCIDR("192.168.0.0/24");
var ip = parseCIDR("192.168.0.115/32");
println(net.Contains(ip.IP));
```


## plugin(plugin_filename)

This function loads a binary plugin and provides an object reference through which it's resources can be accessed.

A number of proof-of-concept plugins are available in the "plugins" directory and each comes with it's own .md (and possibly a .pdf) documentation. Please refer to these to understand how to use each of the plugins.

Example usage (see excel-plugin.md for details) ...

```javascript
var p = plugin("excel-plugin");
var wb = p.open();
wb.addRow("hbc", "Name", "Size (GB)", "Description");
wb.freezeRows(1);
wb.addRow("l r l", "Demo1", 16, "Demonstration VM");
wb.save("test1.xlsx");
wb.close();
```

Note that the plugin names follow the convention of ending with the suffix "-plugin" and must be placed in the same directory as the tbutil binary (or other directory on the path specified in the TBPLUGINPATH environment variable).

The conventions for writing your own plugin are documented in plugins/README.md.


### {plugin}.shutdown()

Each plugin provides a distinct library of functions to the caller, but all plugins support the "shutdown()" function - which unloads the plugin from memory and invalidates the plugin reference.

```javascript
var p = plugin("excel-plugin");
// ... use the plugin functions, then when finished ...
p.shutdown();
```

If you use a plugin from within a "go()" JVM, its "shutdown()" function will be called automatically when the JVM thread terminates.


## print(value ...)

Prints the specified values on the standard output one after the other, NOT followed by a "new line" character.


## printCsv([headers,] rows)

If headers is missing, null or an empty array then no header line is written.


## printf(format, value ...)

Prints the specified values using the format defined in the first argument.

This function makes use of a slightly modified version of the "GO Lang" "fmt.Printf" function, and so the format verbs you can use are those that the GO version supports (but see notes on the "wrinkle" below)

The detailed documentation of the available verbs can be found in the "Printing" section of the page ..

https://golang.org/pkg/fmt/

One wrinkle to bear in mind is that JavaScript has no integer type. All numbers are processed by the language as floats. This means that the "%v" verb may show you a floating-point style output for some integers. The way to avoid this issue is to use the "%d" verb (and similar ones) when you want to be specific about obtaining integer number outputs. TButil and TBscript use a modified version of the FMT library that allows this.

 ```javascript
 printf("There are %d groups that match '%s'\n", found.length, groupNamePattern)
 ```

## printJson(object_or_array [, options])

Prints the object or array using the JSON format, optionally with white space indentation used for readability.

The "options" argument is a string containing any combination of:

* "i": indent the output for readability
* "n": append a newline sequence to the output
* all other characters are silently ignored.

The default value of options is "ni"

Note that "printJson" and "writeJson" differ in there default values for "options".


## println(value ...)

Prints the specified values on the standard output one after the other, followed by a "new line" character.


## printTable(headers, rows)

The "headers" parameter is an array of strings that are used as column headers. The following special header formats are understood..
- If a header string starts with ">", then content of the column is right-justified.
- If a header starts with "#", then the content is dispayed as a right-justified integer.
- If a header starts with a "{...}" specification, then this is stripped and ignored (this syntax is used for Excel output formatting by `writeTable()` but is ignored by `printTable()`).
  - To find the correct format string use Excel's "Format Cell" dialogue and select number/custom.
  - Example: to format a number with 2 digit precision you could use "{0.00}".
- A header starting  with ">{...}" is equivalent to "{...}" but the column is right-justified.

The "rows" parameter is an array of arrays. The number of cells in each sub-array MUST be the same as the number of header strings.


## printYaml(object_or_array)

Prints the object or array using the YAML format.


## processUsingJSFile(object, fileName, [extras])

Loads the named JS source file, passes the object to it in the variable "`tree`" and runs it. If "`extras`" is specified, this is a JS object that allows additional values to be passed over.

This is equivalent to the logic used by tbutil's sub commands that handle the "-s" formatter option.


## readDir(pattern)

This function returns a list of files who's names match the pattern. For details of the syntax of the pattern see..

https://golang.org/pkg/path/filepath/#Match


## require(module_name_or_path [, arguments])

Loads the specified JS file as a module and gives access to it's exported elements. The logic used is a highly simpified version of that employed by NodeJS.

For example: if the module "mylib.js" contains the following...

```javascript
exports = {
	sayHello: function() {
		println("Hello there");
	},
	sayBye: function(name) {
		printf("Good bye %v\n", name);
	},
	square: function(n) {
		return n * n;
	}
};
```

Then a script can access the functions in this module as follows..

```javascript
var m = require("./mylib.js");
m.sayHello();
m.sayBye("John");
var sq = m.square(n1);
```

Notes:

If any arguments are specified after the file name, these are visible to the module code in the JS "arguments" structure.

The value returned by "`require`" is the merged value of the "`exports`" and "`module.exports`" objects populated by the module script.

You can use either "module.exports" (for NodeJS compatibility) or "exports" (for tbutil legacy compatibility). interchangeably.

The module code should not try to access variables or functions in the caller's script unless they are passed as parameters to module functions. In most cases, such back-references are prevented but it is possible (though bad practice) to gain access through global variables.

TBScript keeps a note of the modules that have been loaded and aims to prevent the same module being loaded more than once.

If the module file path has no extension specified, then the extension ".js" is assumed.

If the module file path name contains any slashes, then the script is loaded from the location specified. So using the prefix "./" causes the module to be loaded from the working directory.

If the module file name starts with "@/" then the module is loaded from the internal module repository embedded in the tbutil/tbscript binary itself.

If the module file name does NOT contain any slashes then tbutil  searches the directories listed below. The directories are checked in the order shown and the search stops at the first directory in the list that contains the module file.

* The directory "tbscript.d" in the working directory
* The directoy "tbscript.d" in the user's home directory.
* "/usr/local/lib/tbscript.d" (on Linux and Darwin OS).

This search can be changed by setting the environment variable TBSCRIPTPATH to contain the list of desired directories in the required order, and delimited by colons (on Linux and Darwin) or semi-colons (on Windows).


## readLine(prompt)

Displays the prompt string and then reads a line of text from the standard input and returns it. If EOF is encountered (if the user pressed ^D on Linux or Mac or ^Z on Windows) then an error is thrown with a message of "EOF".

```
var input = null;
try {
	input = readLine("Enter something: ");
} catch (ex) {
	if (ex.message != "EOF") {
		throw ex;
	}
}
```


## readPassword(prompt, askTwice)

Returns: encrypted password


## return

The "return" keyword is NOT an add-in as such but it is worth noting it's behaviour when used at the script's outer-most scope to exit it..

If an interger value is returned, then this becomes the exit status that is returned to the calling shell. By convention, the following are commonly used.

* 0: Okay
* 1: Warning
* 2: Error

Example..

```javascript
return 2; // something failed
```

If a string is returned in formatter context, tbutil prints that string and exists with status 0.

Other return types in other contexts have context-specific meanings.

In almost all cases, you'll want to return one of the three integer values shown above.

See also: exit


## scriptName

When running a script who's file name is specified on the tbutil or tbscript command line, this variable contains the name of the script file as specified when called.


## setenv(name, value)


## sshConnect(client_or_credential_key)

```javascript
s.execute(cmd, input, env...);
s.tunnel(address, multiConnect);
s.isOpen();
s.close();
```

This function establishes an SSH connection with the specified Turbonomic client. The the client MUST have SSH credentials configured.

The returned objected can be used to execute shell commands or open a TCP/IP tunnel to a service running on the instance. For Turbonomic XL, please note that this approach for getting access to one of the internal services works for instances installed in a VM using the OVA. It does not work for SAAS instances or instances installed in OpenShift (etc).

The "tunnel" method is largely equivalent to using the "ssTunnel" function, described below but gives a little more control.


## sshTunnel(client_or_credential_key [, target_port])

Opens a temporary SSH tunnel to the system identified by the API client reference or credential key (specified in the first argument) and the specified target port (default is 3306 - the MySQL port) and returns a string that contains the locahost IP address and the tunnel port like this: `127.0.0.1:47612`. This return string can then be used in (for example) the MySQL db specfication on an "open" statement against the mysql-plugin.

The first argument is either an API client reference (see the "client" variable and "newClient()" function) that has been extablishing using credentials specified using the "@key" syntax or a string containing a valid credential key (starting with "@").

The client's key (or the explicity specified one) must have it's SSH credentials defined in the .tbutilrc file using "tbutil save ssh credentials" before hand.

For security reasons, the tunnel listener terminates as soon as the first connection is established and is limited to accepting connection requests from localhost.

It is rare that you'd ever need to call this function yourself. The MySQL-plugin uses it internally when it is used to acccess a remote DB.


## sleep(num_seconds)

Sleep for the specific number of seconds


## sprintf(format, values ...)

See "printf" for information about the correct syntax for the format string.

Returns a string, formatted according to the "format" specification. It returns the string that the equivalent "printf" command would write to stdout.


## standardOptions(allowed_flags)

This function performs parsing of the command line options following the tbutil subcommand syntax convention.

The allowed_flags argument is a string that consists of one or more characters from the set...

| Option | Meaning |
| ------ | ------- |
| l | output a long listing |
| j | output JSON |
| y | output YAML |
| s | output using a specified JS script |
| x | write to a specified table file |

it returns an object with the following fields..

| Field | Description |
| ----- | ----------- |
| flag  | The output format flag specified on the command line or an empty string (eg: '-j'). Only the flags specified in the allowed_flags parameter are recognised. |
| fileName | If "-s" or "-x" were specified on the command line and the matching character is listed in allowed_flags, then this contains the name of the file specified after the option. |
| remaining | An array of strings containing the command line arguments specified after the formatting option (if any). |

Example (from the "print group" code)...

```javaScript
var args = standardOptions("jy");
if (args.remaining.length !== 1) {
	usage();
}

var g = client.getGroupByUuid(args.remaining[0], {});

switch (args.flag) {
	case "-j":
	case "":
		printJson(g); break;
	case "-y":
		printYaml(g); break;
}

return 0;
```


## startProgram(path, argsArray)

Runs the specified program as a separate process, with the specified arguments passed to it.

The standard output and error are discarded.

Returns PID of the started program

Use "stopProgram" to kill it (if it is still running) and clean up.


## stopProgram(pid)

Stops the program started using the `startProgram` function, above.


## {string}.contains(sub_string)

Indictes whether the strings contains the sub_string. The check is case sensitive.

Returns true or false.

```javascript
if (name.contains("UK")) {
	println("In the United Kingdom");
}
```


## {string}.decodeBase64([output_type])

Decodes the base64 encoded string into a byte array or string, depending on the value of "output_type".

If output_type is "s" (or not specified) then the return is a string.
If output_type is "b" then the return is an array of integer byte values


## {string}.encodeBase64()

Encode the string using base64 encoding and return a string containing the encoded value.


## {string}.hasPrefix(sub_string)

Indicates whether the string starts with the substring. The function returns true or false.

Example...

```javascript
var h = "hello world";
if (h.hasPrefix("hello")) {
	println("Match found");
}
```


## {string}.hasSuffix(sub_string)

Indicates whether the string ends with the substring. The function returns true or false.

Example...

```javascript
var h = "hello world";
if (h.hasSuffix("ld")) {
	println("Match found");
}
```


## {string}.left(length)

Returns the `length` left-most characters of the string. If `length` is greater than the length of the string, the string itself is returned.


## {string}.limitLength(max_length)

If the string is longer than max_length, it is trimmed to be max_length-4 characters long and then has " ..." appended to it. This is indended to facilitate the process of formatting tables where potentially long strings need truncating to fit, and is typically used when adding values to table rows that are printed by "printTable" or "writeTable".


## {string}.md5sum()

Returns the MD5 sum of the string as a string of 32 hexadecimal digits.

```javascript
var sum = group.displayName.md5sum();
```


## {string}.quoteRegexpMeta([tether])

Escapes the string to quote any regexp meta characters it contains. This returns a string that is suitable for use as the q= parameter of the getSearchResults API calls (and others that use regex search expressions). If tether is true, the returned string has "^" prepended and "$" appended.

```javascript
var found = client.getSearchResults( { q: groupName.quoteRegexpMeta(true) } );
```


## {string}.repeat(n)

Returns the string, repeated `n` times.


## {string}.right(length)

Returns the `length` right-most characters of the string. If `length` is greater than the length of the string, the string itself is returned.


## {string}.template(obj, funcMap)


## {string}.trimSuffix(sub_string)

If the strings ends with the sub_string then the return is the result of removing it. Otherwise, the original string is returned.


## {string}.trimPrefix(sub_string)

If the strings starts with the sub_string then the return is the result of removing it. Otherwise, the original string is returned.


## {string}.wordWrap(len)


## subCommand

This variable contains the subcommand being executed.

For example, it will contain the text "`list groups`" if the command "`tbutil @dev01 list groups -s myscipt.js`" is executed.

When a tbscript script is run, it will contain the string "-s".

In other contexts it will be blank.


## tcell

An object that exposes elements of the GOLang "tcell" module. It exposes the following operations..

| Function | Description |
| ---------| ----------- |
| tcell.GetColor( ... ) | |
| tcell.KeyEvent( ... ) | |
| tcell.NewStyle( ... ) | |

`tcell` also supplies a lot of enumerations, which call into four groups, as follows..

| Enumeration group | Description |
| ----------------- | ----------- |
| _Attr...          | enmerations for the various supported text attributes. Eg: tcell.\_AttrBold |
| _Color...         | enumerations for the supported colours. Eg: tcell.\_ColorDeepPink |
| _Key...           | enumerations for the supported keyboard keys. Eg tcell.\_KeyPgDn |
| _Mod...           | enumerations for the supported keyboard modifies. Eg: tcell.\_ModCtrl |

You can use JS code to list all the supported enumerations. By way of example; the following script prints all the `_Color...` ones...

```
var enums = _.keys(tcell).filter(e => ( e.hasPrefix("_Color")));
enums.sort();
printTable( [ "Name", "Value" ], enums.map(e => ([e, tcell[e]])));
```

## tempFile(content)

Creates a temporary file and writes the specified string content to it. The return value is an object from which the file can be managed.

Example:

```javascript
var f = tempFile(JSON.stringify(data));
var path = f.path();
f.clean();
```

The returned handle supports the following methods..

| Synopsis  | Description |
| --------- | ----------- |
| f.path()  | returns the path of the file. |
| f.clean() | deletes the temporary file. |


## template(fileName, obj, funcMap)

This function uses the "GO" template mechanism to populate and return a text document by combining the template contained in `fileName` with the specified object `obj` and the function map in `funcMap`. The resulting text is returned.

For a description of the accepted template file format, see https://golang.org/pkg/text/template/.

For example, with the following text in the file `t1.tmpl` ..

```javascript
Number = {{ add .x.num 20 }}
```

The following script will output the text "Number = 1254"

```javascript
var values = { "num": 1234 };
function add(n1, n2) { return n1 + n2; }
var funcs = { "add": add };
var a = template("t1.tmpl", values, funcs);
```

## tree

Context: formatter scripts only.

The JS object holding the parsed body returned by the selected sub-command. This may be an exact of copy of the JSON returned by the API function, or (in some cases) may have been "cooked" to some extent.


## tview

An object that exposes elements of the GOLang tview module. It exposes the following operations..

| Function | Description |
| -------- | ----------- |
| tview.NewApplication( ) | creates and returns a new application. |
| tview.NewBox( ) | returns a Box without a border. |
| tview.NewButton( label ) | returns a new button using the specified label. |
| tview.NewCheckbox( ) |  returns a new input field. |
| tview.NewDropDown( ) | returns a new drop-down. |
| tview.NewFlex( ) | returns a new flexbox layout container with no primitives and its direction initially set to FlexColumn. |
| tview.NewForm( ) | returns a new form. |
| tview.NewGrid( ) | returns a new grid-based layout container with no initial primitives |
| tview.NewInputField( ) |  returns a new input field. |
| tview.NewList( ) | returns a new list. |
| tview.NewPages( ) | returns a new Pages object. |
| tview.NewTable( ) | returns a new table. |
| tview.NewTableCell( text ) | returns a new table cell with sensible defaults. |
| tview.NewTextView( ) | returns a new text view. |
| tview.NewTreeNode( text) | returns a new tree node. |
| tview.NewTreeView( ) | returns a new tree view. |

These functions return objects which further expose a number of operations (many of which are available to JavaScript through otto's reflection mechanism). See the tview package documentation for details: https://github.com/rivo/tview

A number of core tview enumerations are also exposed using names that start with an underbar. For example "`tview._AlignLeft`". These are..

| Enumberation | Description |
| ------------ | ----------- |
| tview._Align... | the tview alignment enumerations (AlignLeft, AlignCenter, AlignRight) |
| tview._Mouse... | the tview mouse event type enumerations (see https://pkg.go.dev/github.com/rivo/tview#MouseAction) |


## unlink(filePath, all)

Deletes the specified file or path.

If `all` is true: `unlink` removes filePath and any children it contains. It removes everything it can but throws the first error it encounters. No error is thrown if the path does not exist. (see https://golang.org/pkg/os/#RemoveAll)

If `all` is false `unlink` removes the named file or (empty) directory. An error is thrown if the file does not exist. (see https://golang.org/pkg/os/#Remove)


## usage()

Prints the standard tbutil usage message and exits back to the calling shell with a status of 2 (error).


## wait(channel)

Waits for the go-routine (aka: thread) started with the `go` command to finish and returns the data it returns.

The channel returned by the matching `go` should be used as the argument to the `wait` call, or if `channel` is -1, then the channel for the next goRoutine to finish is handled.

The `wait` function returns the value returned by the go-routine.

```javascript
var ch1 = go(my_func, "@primary", "Groups", false);
var ch2 = go(my_func, "@secondary", "Groups", true);
var rtn1 = wait(ch1);
var rtn2 = wait(ch2);
```

See the description of the "go" function above for more details.


## woops(format, value ...)

Prints a warning message (preceded by the word "WOOPS") and aborts the tbscript run.

See "printf()" for info about how formatting is handled.

Note that "woops" is different from the standard JS "throw" in that your code can catch the errors generated by "throw" but cannot catch those thrown by "woops"; "woops" always terminates the script, even if used in a try/catch block.


## writeFile(fileName, string [, options])

Writes the specfied string to the file.

The file is created (if it doesn't exist), appended or overwritten entirely depending on the value of "options".

The "options" argument is a string containing any combination of:
* "a": the output is appended to the exsting content of the file (if any)
* all other characters are silently ignored.

The default value options is an empty string (the output replaces the file contents entirely).


## writeJson(fileName, object_or_array [, options])

Writes the object or array to the specified file using the JSON format, optionally with white space indentation used for readability.

If the file exists, its contents will be replaced. If the file does not exist, it will be created with mode 0644 (rw-r--r--)

The "options" argument is a string containing any combination of:
* "a": the output is appended to the exsting content of the file (if any)
* "i": indent the output for readability
* "n": append a newline sequence to the output
* all other characters are silently ignored.

The default value of options is an empty string (ie: neither indentation, not newlines are used).

With no option "i", this call is equivalent to ...

```javascript
writeFile(fileName, JSON.stringify(object_or_array));
```


Note that "printJson" and "writeJson" differ in that their default value of the "options" flag.

## writeTable(filename, [headers,] rows)

Writes the table to the specified file. The file extension determines the type of output as follows..

| Extension | Description |
| --------- | ----------- |
| csv       | Writes a CSV file |
| txt       | Writes a text table looking like the output of the "-l" option on many of the "List" sub commands |
| html or htm | Writes a HTML table |
| xlsx      | Writes an excel spread sheet |

See the "printTable" function for information on how the "headers" and "rows" parameters are handled.

For CSV files only: if the headers argument is missing, null or an empty list then no header line is prepended to the output.

If the env var TURBO_TABLE_TITLE is set when writing an Excel file, then the title string it contains is written to the top of the spreadsheet along with the Turbonomic logo.
