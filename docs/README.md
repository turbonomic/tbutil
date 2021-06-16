# TButil 2.0a - Turbonomic Command-Line Utility

*Last updated: 1 Jun 2021*

## Introduction

"tbutil" is a swiss-army-knife command line utility for accessing a running Turbonomic instance using the REST API. The utility provides a number of low and high level function abstractions, the full list of which can be displayed by running "tbutil" with no command line arguments.

64-bit executable binaries are available for the Linux, MAC (aka "Darwin") and Windows operating systems.

The tool is written in the Golang and JavaScript languages and makes extensive use of the Turbnomic GoLang API client library (turbo-api-client-lib).

TButil includes an embedded JavaScript engine that can be used to format the output of queries or drive the API directly. A slightly extended instance of the pure-go "OTTO" JavaScript engine is used for this purpose. Note: "OTTO" is *not* "NODEJS", and attention has been paid to keeping the use of JS scripts as simple as possible (no need to wrestle with asynchronous I/O or promices).

## Download and Install pre-compiled binaries.

Download from the project's S3 site..

https://github.com/turbonomic/tbutil/blob/v2.0a/docs/release.md

Once you've downloaded the relevant ZIP, follow the instructions contained in the QUICK-INSTALL.pdf file it contains. This takes you through the process step by step.

## Scripted non-interactive installation.

(This information is also held in the "QUICK-INSTALL" guide).

If you need to install using a script rather than by answering questions interactively, this can be achieved by setting a number of environment variables prior to running install.sh or install.bat. The variables that can be used for this purpose are..

- `TARGET_DIRECTORY_NUMBER` = 1, 2, 3 or 4 (defaults to 4 if `TARGET_DIRECTORY_PATH` is set)
- `TARGET_DIRECTORY_PATH` = full path name (not relevant if number 1, 2 or 3 selected)
- `CREATE_DIRECTORY` = y or n (defaults to 'y' if `TARGET_DIRECTORY_NUMBER` is 4)
- `DELETE_EXISTING` = y or n (defaults to 'y' if `TARGET_DIRECTORY_NUMBER` is 4)

It is normally enough just to set the `TARGET_DIRECTORY_PATH` - this setting drives defaults for the other three variables.

## Configuring credentials

Note: the approach for configuring credentials for IWO is described in the IWO.pdf document. What follows refers to Turbonomic and CWOM variants only.

Before using "tbutil" you need to determine the API user name, password and IP address or hostname of the Turbonomic VM and an optional port number (if not the default).

These can be passed to the utility in one of four ways..

* As a URL, in the first parameter of the command line when running "tbutil".
* As a URL in the environment variable "TURBO_CREDENTIALS".
* Saved in the file $HOME/.tbutilrc (or the file named in the TURBO_CREDENTIALS_FILE environment variable) by the "tbutil save credentials" command (DONT edit this file by hand).
* As a reference to a saved credemtial block, named in the "TURBO_CREDENTIALS" env var.

The third or fourth approaches are the recommended ones.

If one of the first two options is used, the credentials should be combined into a single string, the shortest form of which looks like..

```
username:password@host
```

Note: if the username or password include any special characters (such as "/", ":", "%", "+" or "@") that are part of the URL syntax, then these should be escaped using a "%" followed by the two hex digits that represent the character. For example: use "%21" to encode an exclamation mark (you dont need to worry about this issue when using "save credentials").

The fuller format follows the URL syntax standard, but *must* include the basic authentication fields ...

```
[protocol://]username:password@host[:port][/base_path]
```

Here again: special characters must be escaped.

If the credentials are to be saved into the .tbutilrc file (or equivalent) then the subcommand "save credentials" should be used to do this in order to save the password in an encrypted form. When answering the questions, you should NOT escape special characters - that will be done automatically for you.

In this case, sets of credentials are saved in the file against key strings (which can be the turbo instance host name or anything else). The key is specified following a "@" as the first parameter of the tbutil command line when saving or using credentials.

For example:

```
$ tbutil @demo1 save credentials
... answer the questions asked
$ tbutil @demo1 list markets -l
```

If the first argument is neither a "@name" or a URL and the TURBO_CREDENTIALS environment variable is not set, then the tool attempts to use the "default" block in the .tbutilrc file. This means that these two commands are equivalent..

```
$ tbutil list markets -l
$ tbutil @default list markets -l
```

The fields of the credentials are...

| Component | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| protocol  | either "http" or "https". The default is "https".                                |
| username  | (mandatory) the API access user name or "?".                                     |
| password  | (mandatory) the password to use or "?".                                          |
| host      | (mandatory) the IP address (or resolvable host name) of the Turbonomic instance. |
| port      | the port number. Default is 443 (for https) or 80 (for http).                  |
| base_path | the URI base of the REST API. Default is "/vmturbo/rest".                        |

For example, to list the known clusters, you can use the enviroment variable approach ...

```
$ export TURBO_CREDENTIALS="mickey.mouse:good-boy-pluto@10.11.12.13"
$ tbutil list clusters -l
```

or the command line argument approach ...

```
$ tbutil mickey.mouse@good-boy-pluto@10.11.12.13 list clusters -l
```

or the default block "save credentials" approach ...

```
$ tbutil save credentials
$ tbutil list clusters -l
```

or use an explict "save credentials" block ...

```
$ tbutil @testlab save credentials
$ tbutil @testlab list clusters -l
```

or use a credentials block named in the environment variable ...

```
$ TURBO_CREDENTIALS="@testlab"
$ tbutil save credentials
$ tbutil list clusters -l
```

The IP address (and optionally; the port) can be modified when using the "@xxxx" syntax, to allow the same username and password to be used for a different instance. The syntax looks like this..

```
$ tbutil @testlab:10.10.13.227 list clusters -l
$ tbutil @testlab:10.10.13.227:1443 list clusters -l
```

This allows the credentials saved using the "@testlab" key to be used to access the turbonomic instance at 10.10.13.227 (and optionally at a different port)

To change just the port, leave the IP address out and use two colons..

```
$ tbutil @testlab::1443 list clusters -l
```

### SSH and MySQL DB Credentials (V6/Classic instances)

In order to use the tbutil/tbscript features that allow access to a remote Turbonomic instance's database and/or file system, you need set the SSH and MySQL credentials. This is done using two variants of the "save credentials" command as follows..

```
tbutil @key save ssh credentials
tbutil @key save db credentials
```

Note: when running `tbutil` or `tbscript` on the Turbonomic instance itself, you should NOT configure SSH credentials.


### Storing credentials using a non-interactive script.

When you run any of the "save credentials" family of sub commands, you can provide the answers to the questions using environment variables. If all the required variables are defined, the credential saving can be fully non-interactive. If you miss any out then those particular settings well be prompted for. The environment variables used for this purpose are the "TURBO_CRED_" ones.

See the output of "tbutil help env-vars TURBO_CRED_" for a description of the supported variables.


## Command line conventions

The tool implements a number of API actions which are identified by multi-word sub-commands, for example: "list groups", "export dynamic group", etc. The wording of these sub-commands is designed to be moderately self-explanatory.

Many of these sub commands take an optional flag that describes how to format the output. These are common to many commands and have the same meaning in all contexts.

The "list" commands typically list the relevant entity UUIDs when no flags are specified (use the "-l" option to get more detail).

Where a command requires textual input (for example: some of the "import" commands), tbutil may take it from the standard input. So if you run one of these without an input redirection, the command can silently appear to hang (but it is actully waiting for input).

The tool is not intended to expose ALL the available Turbonomi API calls via mnemonic commands - just a subset that has been identified over time as useful to the EMEA CS group. However you can use the "get", "delete", "put" and "post" commands to access the missing API functions if you know the URI, query parameters and body content conventions. The swagger documentation is your friend here.

The following option flags are supported by different subsets of the commands..

| Flag | Meaning |
|------|---------|
| -j   | Write the output in "JSON" format |
| -l   | Long output written to stdout, listing the UUID and subset of additional values |
| -n   | Dont wait: Turbonomic executes the command asynchronously |
| -s   | Use a JavaScript script to format the output. The path name of the script file follows the flag  |
| -x   | Write the output to an Excel workbook (or CSV or HTML file), who's name is supplied in the argument following the flag. The file's extension must be either ".xlsx", ".csv", ".txt" or ".html". |
| -y   | Write the output in "yaml" format |
| -help | Display some addition sub-command-specific help (only a small subset of commands have this) |

It is the intention of the author to arrange for the tool to support all format flags on all relevant sub commands in due course. A subset of these combinations is currently avaiable - as documented in the help text that you can view by running the tool with no arguments.

Following the flag, any arguments required by the command are specified.

So, consider the following command line ..

```
$ tbutil list actions -x actions.xlsx Market
```

The requested sub command is "list actions" - which (you'd guessed) lists the actions for an entity who's UUID is given.

In this example, the entitiy UUID is the string "Market".

The "-x" flag above tells the program to write it's output to the Excel workbook "actions.xlsx".

You can also use "-x" to write to a CSV, TXT or HTML file. If the specified file name has a ".csv" extension then a CSV file is written. If ".txt" then a text table is written. If it has a ".html" extension then an HTML TABLE is written. If the file name has a ".xlsx" extension then an EXCEL file is written. Other extensions are not permitted.

Notes:
- if "-x" is used to write to a .csv file, the Linux end-of-line sequence (LF) is used rather than the CRLF sequence specified in RFC4180. If you want a file that uses CRLF end-of-lines, then use a tool such as "unix2dos" to convert the created file (NB: this is even true on Windows).
- Many commands that support "-x" or "-l" also support a "-columns" option which allows you to reduce the number of columns included in the output. The value passed to the option should be a list of integers, delimited by commas and combined into a single string (eg: `-colunms 0,2,9`). The first column is number 0.
- Special file names are support by the "-x" option to write to the standard output. These are "@.csv", "@.txt" and "@.html".

## JavaScript formatters.

Commands that support the "-s" option can format their output using a simple JS script. This mechanism uses the "otto" JavaScript interpreter and so the supported JS verson is that provided by "otto", and any limitations of "otto" are limitations on "tbutil" too. For fuller details, please refer to..

https://github.com/robertkrimen/otto

In particular: note that "otto" is not "NodeJS" (so: there are no "promises" or asynchrous logic to get to grips with!)

When tbutil makes it's API call (or calls) it formats the results into a JSON object which is made available to the JS script using the variable named `tree`. The same JSON object can be printed using the "-j" option on the command line.

The script can process the contents of `tree` using any logic supported by otto and can either print the results or return them (as a single string) as the return value of the script.

If the script returns an integer, tbutil will exit with that code (traditionally: 0=success, 1=warning, 2=error).

If the script returns a string then tbutil will print that value to stdout.

As well as the `tree` variable, tbutil provides a handful of additional built-in functions to the set normally provided by JS. These are described the JS-ADDINS.md (and JS-ADDINS.pdf) file.

## TBScript

The tool can also run a pure JS script without the results of a pre-defined query being passed, but with direct access to the full set of Turbonomic API functions. The command line looks like this ...

```
$ tbutil -s scriptfile.js argument argument2 .. 
```

If the "tbutil" binary is soft or hard-linked as "tbscript", you can also use the alternative command line:

```
$ tbscript scriptfile.js argument argument2 .. 
```

On Linux and Darwin systems, if the script file starts with the line "#! /usr/bin/env tbscript" AND is in the path AND has execute permission, you can call it directly by name:

```
$ scriptfile.js argument argument2 .. 
```

If you need to specifiy credentials on the command line in this latter case you have to use the "-c" flag, like this...

```
$ scriptfile.js -c @demo arg1 arg2 ...
```

Scripts run in this way have access to a number of additional built-in functions and objects that are not available to JS formatter scripts. See JS-ADDINS.md (.pdf) for details.

The script uses the connected "client" object to make all the API calls directly in JS code. For example, this script finds and lists the UUID and name of all entities of a specified class (this example can be found in the "examples" folder)..

```
#! /usr/bin/env tbscript

if (args.length != 1) {
  print("Usage is: findEntities.js {entityClass}")
  return 2
}

var opts = {
  q: "",
  types: args[0]
}
rtn = client.getSearchResults(opts)

var headers = [ "UUID", "Name "]
var rows = [ ]
for (var i = 0; i < rtn.length; i +=1) {
  rows.push([rtn[i].uuid, rtn[i].displayName])
}

if (rows.length == 0) {
  println("** No entities found **")
  return 1;
} else {
  rows.sort(function (a,b) {
    if (a[1] > b[1]) return 1
    if (a[1] < b[1]) return -1
    return 0
  })
  printTable(headers, rows)
  return 0;
}
```

### JS Language syntax extensions.

The "otto" interpreter used by tbutil/tbscript is EcmaScript 5 compatible but we have added limited support for a couple of nice ES6 features too.

#### Template strings

Template strings are enclosed in back-tick quotes and can..
- Span mutiple lines
- Have embeded expressions that are expanded on evaluation.

Our implemented does NOT support the use of a leading function name to provide custom expansion but makes use of a fixed name function called "`interpolate`" instead. If you wish, you can provide an alternative implementation of this function. See the JS-ADDONS document for details.

This feature is currently implemented as a custom patch to the "Otto" interpreter code.

#### Arrow functions

Arrow functions are "syntactic sugar" that are typically used to declare callback functions in a more visually appealing way. For example, the code...

```
myList.forEach(entity => { println(entity.name); });
```

Is equivalent to...

```
myList.forEach(function(entity) { println(entity.name); });
```

Our implementation of this feature works by performing source code parsing when scripts are loaded into tbscript (rather than by patching the otto interpreter). The following differences exists between tbscript's implementation and the full ES6 versions...
- The code MUST be enclosed in braces or brackets following the arrow. Brackets are used to represent a single expression and a "return" is implied in this case. Braces are used to contain more complex logic and if the function returns a value, the code must include a "return" statement.
- The function has the same scope conventions as a regular anonymous function. In particular there is no special handling of the "this" variable (so it's use should be avoided).

Example: given the list of numbers, the three following lines are equivalent.

```
var numbers = [1,2,3,4,5,6];

var oddNumbers = numbers.filter(n => ( n % 2 ));
var oddNumbers = numbers.filter(n => { return n % 2; });
var oddNumbers = numbers.filter(function(n) { return n % 2; });

```

#### Using "babel" to give fuller ES6 syntax support

If you want to write your code using all the features of true ES6, consider using the free "`babel`" utility to "compile" your ES6 source into an ES5 equivalent. There is plenty of information on the internet about this tool. But in summary, use the command:

```
babel --presets=env my-es6-script.js > es5-equivalent.js
```

### Error handling

Errors returned by Turbonomic in response to API requests made by the tool result in exceptions being thrown by the `client` API functions. You can catch these using JavaScript's try/catch syntax. You can also obtain details of the error body (if it was in a JSON format) using `client.lastException()`. This typically returns an object with two or three fields (type [integer], exception [string] and optionally: message [string]).

```
try {
  var opts = {
    q: "",
    types: args[0]
  }
  var rtn = client.getSearchResults(opts)
} catch (err) {
  eprintln("ERROR : "+err);
  eprintln(client.lastException().message)
}
```

## Usage Examples

### Get usage help

Just run "tbutil" with no arguments.

```text
TBUTIL: Unsupported Software, Copyright (C) Turbonomic 2018,2019,2020,2021
Issued To   : chris.lowth@turbonomic.com
GIT Tag     : 2.0a
Commit Hash : 47c0222b6b0fd2309fad2e0313310a4af135c987
Commit Time : 2021-06-16 10:06:51 +0100
Build Time  : 2021-06-16 10:08:51 +0100
(use "tbutil -version" for more version info)

Usage:
  tbutil [{cred}] accept|reject action {action_uuid}
  tbutil [{cred}] create|delete|export|import|list|logging|print|psql|reset [-help] ...
  tbutil [{cred}] delete|post|put [-j|-s ..|-y] [-jsfilter ..] {path} < {json_body_file}
  tbutil [{cred}] get swagger
  tbutil [{cred}] get [anon] [-j|-s ..|-y] [-jsfilter ..] {path}
  tbutil [{cred}] ping [-sql|-ssh|-isXL|-isIWO]
  tbutil [{cred}] rediscover|validate target [-by-name] {target_id_or_name} ...
  tbutil [{cred}] shell {arguments} ...
  tbutil [{cred}] sql [-help|-test] [-j|-s ..|-y|-x ..] [-columns ..] [-o {csv_file}] {sql_file} [{arg} ...]
  tbutil [{cred}] what {method} {url}
  tbutil crypt [ -create-key | -delete-key | -target {file} | -user {file} | -proxy {file} | -encode [{clear_text}] ]
  tbutil help [{keyword}|all|env_vars|functions]
  tbutil opensource licenses

  tbutil [{cred}] -s|script [-p] {js-file-name} [{arguments} ...]

Options:
  -by-name    : the item is specified by display name rather than uuid
  -columns    : list of column numbers to show (comma delimited, starting at 0)
  -create-key : create the encryption key file
  -delete-key : delete the encryption key file
  -encode     : display the encoded version of the clear text
  -help       : display help about the sub command (only those with the option shown)
  -isIWO      : print 'true' if the instance is IWO, or 'false' otherwise
  -isXL       : print 'true' if the instance is running Turbonomic XL, or 'false' if classic
  -j          : output to stdout in JSON format (use capital -J to exclude indentation spaces)
  -jsfilter   : use the specified JS script or expression to filter the rows displayed
  -o          : write output to the CSV file directly
  -proxy      : edit a 'http proxy' export file
  -s          : output to stdout using the specified JS script
  -sql        : test the connection with the MySQL service
  -ssh        : test the connection with the SSH service
  -target     : edit a 'target' export file
  -test       : test the connection
  -user       : edit a 'user' export file
  -x          : output to the specified xlsx, csv, lst, txt or html file
  -y          : output to stdout in YAML format

The optional '{cred}' argument provides the credentials for the connection with Turbonomic. It may be..
* A URL in the format: [PROTOCOL://]USER:PASS@HOST[:PORT][/PATH]
* "@" followed by a name: credentials taken from the named block in .tbutilrc (see "save credentials").
* Absent, in which case the TURBO_CREDENTIALS environment variable will be used if defined.
* Absent but no TURBO_CREDENTIALS defined: the "@default" block from .tbutilrc is used.

Download code and docs from:
   https://github.com/turbonomic/tbutil/blob/v2.0a/docs/release.md
```

### Get the list of clusters

```
$ tbutil list clusters -l
UUID                                                        Class    Name                                               Environment  Severity  
----------------------------------------------------        -------  -------------------------------------------------  -----------  --------  
vcvmt.demo.vmturbo.com-ClusterComputeResource-domain-c83    Cluster  HawthorneCloud\Production                          ONPREM       Major     
vcenter.demo.vmturbo.com-ClusterComputeResource-domain-c26  Cluster  HawthorneSales\Turbonomic SE Lab                   ONPREM       Major     
99408929-82cf-4dc7-a532-9d998063fa95                        Cluster  RedHatDC-NFS\RedHatDC-NFS\RedHatCluster-NFS        ONPREM       Minor     
77b4dd1f-573a-4bab-b5cc-23f023e0bbcb                        Cluster  RedHatDC-NFS\RedHatDC-NFS\RedHatCluster2-NFS       ONPREM       Normal    
0e0501b6-797a-4058-93bf-f7119433a756                        Cluster  RedHatDC-iSCSI\RedHatDC-iSCSI\RedHatCluster-iSCSI  ONPREM       Normal    
```

### List templates

To get a summarized list of templates on stdout..

```
$ tbutil list templates -l
```

To get a fuller extract into an multi-sheet Excel workbook that includes all the parameters configured for each template.

```
$ tbutil list templates -x templates.xlsx
```

Or similarly, to a csv file:

```
$ tbutil list templates -x templates.csv
```

## Turbonomic database access.

See the sql-plugin documentation for more info.


## Configuration Export and Import

A growing number of configuration features can be exported from Turbonomic instances and imported back using tbutil.

There are "export" and "import" subcommands in tbutil for these features, and these all work the same way.

It is the author's intent to cover all Turbonomic configuration object types in due course. To identify those that are currently supported run..

```
tbutil help import
tbutil help export
```

### Exporting

The "export" commands perform the required API calls to extract the details of a configuration element identified by a key (uuid or name) and write the information to stdout in a JSON format. The output is NOT an exact duplicate of the data returned by the API call(s) used but is simplified to be human readable, and importable using the matching "import" command. The resulting file has some fields (such as UUIDs) stripped from it and others combined or simplified. The resulting file does not include secrets (such as passwords) - see below for instructions on handling these).

The export sub commands all support the formatting options of "-j", "-y" and "-s" which allow the actual raw API body to be presented as desired. If the "export" command is run without any of these options, the output is formatted for use by the matching "import" command (this is the normal use case).

The export subcommand usage is..

```
tbutil [credentials] export {configuration_type} [-j|-y|-s {script_name}] {uuid} > {json_output_file}
```

Example: first find the UUID of the configuration object (using list -l) and then export it, like this..

```
tbutil @demo2 list templates -l

# Select the UUID for the template of interest from those just listed and use in the "export" command...

tbutil @demo2 export template _wIBz8Jj4EeC6nYMiQT1jqA > template1.json
```

### Importing

Once you have the exported file, you can edit it and import it back into the same (or another) Turbonomic instance, like this ...

```
tbutil @chris_demo import template template1.json
```

If the "-edit" option is specified on the "import" command line, then the configuration must already exist and the new configuration details will replace the existing ones.

If the "-create" option is specified, then the configuration item MUST be new (an error will be thrown if it already exists).

If neither "-edit" nor "-create" are specified then the command either creates or edits the configuration as appropriate.

### A note about scopes

If the configuration refers to a scope (eg: one or more groups) then the "import" command searches for those scopes by name and updates their details to include the relevant UUIDs. In these cases it is an error for the scrope group NOT to exist in the target Turbonomic instance, or for more than one group to exist with the specified name.

### Handling secrets

If the configuration object has secret information (like passwords) associated with it, the Turbonomic API does not return them in the payload of the "export" APIs. This is a very reasonable limitation to accept for obvious security reasons.

In these cases, the "export" function provides a field in the output who's name starts with a dollar symbol and who's value is an empty string. Before importing the resulting file you must add the password to the file in encrypted form. A file with blank secrets cannot be imported.

The interactive "tbutil crypt" tool is provided for this purpose. When you run it without further parameters, the command presents a simple text menu. The options of which are..

| Option | Description |
| ------ | ----------- |
| q | Quit the utility |
| c | Create an encryption key file in $HOME/.tbutilkey. This MUST exist before passwords can be encrypted and written to the JSON configuration files. |
| d | Delete the encryption key file if it exists (you will be asked for confirmation first). |
| t | Insert an encrypted password (and, optionally, other target-specific secrets) into a "target" configuration export file. |
| u | Insert an encrypted password into a "user" configuration export file. |

### Example walk-through

Here's an example showing how to export a target from the system who's credentials are stored against the key "@demo3", add a password to the file and import the target to the instance with credentials "@other_turbo".

First: if the credentials for "@demo3" have not yet been defined then you'll need to run...

```
$ tbutil @demo3 save credentials
  (answer the questions it asks)
```

Then find the target of interest, make a note of its UUID and use that to export it...

```
$ tbutil @demo3 list targets -l
$ tbutil @demo3 export target _PXzKoGgkEeiMLvmQukui5A > target.json
```

This is what the resulting file looks like. Note the empty "$encrypted" field in the "Password" bock.

```
$ cat target.json
{
    "category": "Hypervisor",
    "displayName": "rhevm.demo.vmturbo.com",
    "inputFields": [
        {
            "displayName": "Address",
            "name": "address",
            "value": "rhevm.demo.vmturbo.com"
        },
        {
            "displayName": "Username",
            "name": "username",
            "value": "admin"
        },
        {
            "$encrypted": "",
            "displayName": "Password",
            "name": "password"
        }
    ],
    "type": "Red Hat Virtualization Manager"
}
```

Before you can import this file into an instance you need add the encrypted password to the file.

And before you can do THAT you need to ensure the encryption key has been created on your local system. If you have already created the key on another system or as another user, just copy the ".tbutilkey" file into your home directory. But if you haven't got a key file already, then run the "c" menu option of "tbutil crypt", like this ...

```
$ tbutil crypt
=======================================================================
Key file = '/home/chris/.tbutilkey'
=======================================================================
c: create key file
d: delete key file
t: add password to 'target' json file
u: add password to 'user' json file
q: quit
>> c

Created /home/chris/.tbutilkey

=======================================================================
Key file = '/home/chris/.tbutilkey'
=======================================================================
c: create key file
d: delete key file
t: add password to 'target' json file
u: add password to 'user' json file
q: quit
>> q
```

Now you are ready to add the password to the export file using either the "t" menu choice or the "-target" command line switch of "tbutil crypt". For example...

```
$ tbutil crypt -target target.json 
Password: 
```

Note that you'd use the "-user" option in place of "-target" if you're adding a password to a user export file.

Also note that the password is hidden as you type it (except on cygwin).

You can now import the target into another Turbonimic instance. If the system you are going to run the "import" command on is different from the one you performed the above steps on then you need to copy "$HOME/.tbutilkey" and the export files over. Once that has been done, you can run the import command...

```
$ tbutil @other_turbo import target target.json
```

The UUID of the newly created target will be displayed if the command runs successfully.

### Example: script to change target's password.

The following shell script could be used as the foundation of a script to change the password for a target.

The following variables must be pre-set.

| Variable | Description |
| -------- | ----------- |
| CREDENTIALKEY | The tbutil credential key |
| TARGETNAME | The name of the target |
| PASSWORD | The new password |

Note: this assumes that the .tbutilkey file already exists.

```
CREDENTIALKEY=turbonomic-credential-key-here
TARGETNAME=vcenter-hostname-here
PASSWORD=secret-password-here

# Step 1 - map a target name to it's UUUID
UUID=$(tbutil @$CREDENTIALKEY list targets -j -jsfilter '($.displayName=="'$TARGETNAME'")' | jq -r '.[].uuid')

if [ "$UUID" = "" ]; then
	echo UUID not found
	exit 2
fi

# Step 2 - export the existing target configuration
tbutil @$CREDENTIALKEY export target $UUID > /tmp/target$$.json || exit 2

# Step 3 - patch the password into the file
echo "$PASSWORD" | tbutil crypt -target /tmp/target$$.json || exit 2

# Step 4 - apply the updated target configuration
tbutil @$CREDENTIALKEY import target -edit /tmp/target$$.json || exit 2

# Step 5 - clean up the temporary file
rm /tmp/target$$.json
```

NB: The above should not be considered "production worthy" but is supplied as an example. It does not (for example) do thorough error checking.

## Environment variables

Tbutil understands and uses a number of environment variables. You can obtain a list of these with a brief description of each by running the command:

```
tbutil help env-vars
```

Please also see the "non-interactive installation" and "non-interactive credential storage" sections above for info about some additional variables not listed in *this* section.

They can be set in the normal way using the client system's mechanisms, OR by using "magic comments" in the script code.

The most popular way of setting temporary env vars in systems that use the BASH shell is to specify them immediately before the command, like this ...

```
TURBO_CREDENTIALS=@demo tbutil list groups -l
```

You can do this using the "env" program too ...

```
env TURBO_CREDENTIALS=@demo tbutil list groups -l
```

If you want the variable to be set longer term, then use the "export" command ...

```
export TURBO_CREDENTIALS=@demo
tbutil list groups -l
```

Or you can added specially formatted comments to your JavaScript code, like this ...

```
 // :setenv: TURBO_CREDENTIALS=@demo
 // :setenv: TURBO_JS_DEBUG=on
```

or by using the JavaScript function `setenv()`, like this..

```
setenv("TURBO_CREDENTIALS", "@demo");
setenv("TURBO_JS_DEBUG", "on");
```

## Files

The tbutil suite of programs use a number of files to hold credential and other security-released information. These are described below.

On Linux, these are all stored in the user's home directory (unless otherwise indicated in environment variables). On windows, they are stored in the user's profile directory.

### .tbutilrc

This is a JSON file that holds all the configured credentials that are saved using "save credentials" and are referenced using key names starting with "@". The file contains the IP address of the instance and the usernames and passwords needed to access the API and optionally SSH and MySQL DB.

The file path can be overridden by setting the TURBO_CREDENTIALS_FILE environment variable.

### .tbutilcookies

This directory is where the HTTP cookies are cached for the REST API calls.

### .tbutilkey

The file that holds the encryption key used and managed by the "tbutil crypt" command. See also the TURBO_CRYPTO_KEY_FILE env var.

### .ssh/id_rsa

The file that (by default) holds the ssh certificate for certificated connections.
