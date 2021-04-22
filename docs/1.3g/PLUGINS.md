# TB Script Plugins

## Introduction to plugins

TBUtil plugins allow tbscripts to access any resources that can be programmed using the GO language. They are executable binaries which communicate with tbscript/tbutil using the standard GO RPC protocol. The operations exposed by the plugins can be accessed using regular JavaScript constructs.

Several plugins are provided in the core tbutil release, including two popular ones: MySQL and Excel.

## Using plugins in TBScripts

TBScript (and tbutil formatters) can make use of plugins by calling the "`plugin()`" function with a single argument that gives its name or path. The function loads the plugin from disk, initialises the internal RPC channel with it and returns an object from which the plugin's methods can be called from JavaScript. Like this...

```
var X = plugin("excel-plugin")
```

The return value (`X` in the example above) can then be used to request the plugin to take actions and collect the results. The syntax looks like this...

```
var wb = X.open()
wb.addRow(format, a, b, c)
```

In the above example, the loaded plugin object (`X`) is used to request the plugin perform it's `open()` action. In this example, this creates a new empty Excel spread sheet. The `open` function returns a new object (the meaning and logic of which are known only to the plugin) from which further actions can be taken.

## Tutorial - Hello-World: Writing a simple plugin.

NB #1: The completed "hello" plugin is included in the plugins folder of the turbo-util get repository.

NB #2: These notes have been tested on a linux build environment (if you dont have one, see the notes in the Dockerfile to create a suitable docker build environment).

For the purposes of explaining how to develop plugins, we'll start by looking at a very simple "hello world" example. Our intended usage from Tbscript is..

```
var H = plugin("hello-plugin")
var message = H.hello("world")
println(message)
H.shutdown()
```

We want the "hello()" function to return the string "Hello " followed by the value of the supplied argument. That should be "Hello world" in the example above.

### Skeleton plugin code

To begin with, you should create the file "hello-plugin.go". The easiest place to create this would be in "plugins" folder of the "tbutil" source directory. The source should have the following components..

* A package name of "main" (but no "main()" function)
* A definition of the type "Plugin" which must be a struct (it can be empty).
* A global string constant called "initScript". To begin with, this can be empty
* A function called "initPlugin" which returns a pointer to type Plugin.

And that's all you need to begin with. You should at least be able to compile it.

Here's the complete code for an empty plugin.

```
package main

type Plugin struct {
}

const initScript = ""

func initPlugin() *Plugin {
	return &Plugin{ }
}
```

Create the file "hello-plugin.go" in the "plugin" folder of the turbo-util package, copy the above program fragement into the file and compile on Linux using the command

```
go build hello-plugin.go plugin.go
```

This should create the file "hello-plugin" in your working directory.

If you try to run the plugin by typing "`./hello-plugin`" you should see the following text..

```
'./hello-plugin' can only be run as a tbutil/tbscript plugin
```

You can now confirm that this plugin will indeed load into a TBScript even if it has no useful functions to offer. You can check this by running the following script using the command `tbscript hello-test.js`.

```
var H = plugin("./hello-plugin")
printJson(H)
```

All being well, you should see the following output...

```
{
    "_rpc_": {},
    "version": "unknown"
}
```

### Adding a function

The next step is to create the foundation of our "`hello`" function, and to do that we need to add the code for an exported function with the right signature in the plugin source. To be exported it must start with a capital letter because that's what "GO" requires. Here's an example that will work ...

```
func hello(this *Plugin, arg, rtn hash) error {
	return nil
}

func (this *Plugin) Hello(argBytes []byte, rtnBytes *[]byte) error {
	return this.call(hello, argBytes, rtnBytes)
}
```

Note that we have created two functions here.

The "Hello" (with a capital H) function is the one that gets called by the GO RPC mechanism and it takes two arguments, both of which are arrays of bytes.

The "hello" (lower case H) function is where the actual logic provided by the plugin will be coded. For now it just returns a nil error.

Some internal decoding of the arguments and other preparation is needed before the actual "hello" (lower case h) function can be invoked, and this what the call to `this.call(....)` in `Hello` (capital H) does. For every function we add to a plugin, the exported version (the one with a leading capital letter to its name) should look EXACTLY like the above - the only variation being in it's name, and the name of the function it references in the first argument to `this.call()`.

So far, this doesnt do anything useful but it should at least be a callable starting point. Lets test that out...

Compile: `go build hello-plugin.go plugin.go`

Create a test script and run it using "`tbscript hello-test.js`"

```
var H = plugin("./hello-plugin")
var rtn = H._rpc_.Call("Hello", { })
printJson(rtn)
```

You should see the output:

```
{}
```

### Returning data

Next, let's change the function to return some real data. In order to do this, you need to know that the "hash" type used for the arg and rtn parameters of "hello" are GO language maps of generic interface objects, keyed by strings. The type declaration is ..

```
type hash map[string]interface{}
```

If the function needs to return real data, this should be put into the "`rtn`" hash. Here's the updated example..

```
func hello(this *Plugin, arg, rtn hash) error {
	rtn["message"] = "Hello World"
	return nil
}
```

Now when you compile the plugin and run our test script, you should see ..

```
{
    "message": "Hello World"
}
```

### Handling arguments

Next: lets see how to supply and process an argument. Change the plugin's "hello" function to accept and process an argument called "name", like this..

```
func hello(this *Plugin, arg, rtn hash) error {
	name := arg["name"].(string)
	rtn["message"] = "Hello " + name
	return nil
}
```

(Yes: I know that's sloppy from the point of view of checking for a nil pointer - but more on error handling later).

Compile the updated plugin code and change the test script to read...

```
var H = plugin("./hello-plugin")
var rtn = H._rpc_.Call("Hello", { name: "Christopher" })
printJson(rtn)
```

Now you should see a different output when you run the test script.

```
{
    "message": "Hello Christopher"
}
```

### Returning an error.

If needed, your function can return an error that can be "caught" in the calling JS code. This is just a matter of getting the plugin function to return a non-nil GO "error" value.

So: Update your "hello" function to check that "name" has really been passed and is not nil by changing it as below (and yes: I know this does not capture all possible error cases, but it serves to show the mechanism)...


```
func hello(this *Plugin, arg, rtn hash) error {
	if arg["name"] == nil {
		return fmt.Errorf("Argument 'name' is nil")
	}
	name := arg["name"].(string)
	rtn["message"] = "Hello " + name
	return nil
}
```

You'll need to import the "fmt" module using an "import" statement to get that to compile by adding the following immediately below the "package" statement..

```
import (
	"fmt"
)
```

Now compile as before and try the following test script..

```
var H = plugin("./hello-plugin")
var rtn = H._rpc_.Call("Hello", { })
printJson(rtn)
```

You should see ..

```
JS Error: Argument 'name' is nil
    at <native code>
    at hello-test.js:7:11
```

If required, you can use the try/catch syntax to handle the error in the calling JS test script.

```
var H = plugin("./hello-plugin")
try {
	var rtn = H._rpc_.Call("Hello", { })
	printJson(rtn)
} catch (err) {
	println("Error caught: "+err)
}
```

Which should give you ..

```
Error caught: JS Error: Argument 'name' is nil
```

### Cleaning up the calling syntax.

At the start of this tutorial, we expressed a wish to be able to call our "hello" function using the syntax ..

```
var message = H.hello("Christopher")
```

rather than ..

```
var rtn = H._rpc_.Call("Hello", { name: "Christopher" })
```

The former is more visually appealing, and arguably less confusing.

This is where the initScript string comes in. The string is a fragment of JavaScript code that gets called when the plugin is loaded. You can place any JS code you like in here, but its primary role is to map the "`_rpc_.Call(....)`" syntax to something more natural looking. it does this by populating functions into a JS object called "`exports`" (the name is fixed). This object in turn defines the return from the "`plugin(..)`" function.

For our example, change the initScript definition in the plugin code to read ...

```
const initScript = `
	exports = {
		hello: function(who) {
			return call("Hello", {name: (who ? who : "world") }).message
		}
	}
`
```

Remember that you are writing JS code inside a string in a GO programme (that's a potential source of confusion).

You might note that that's added an extra feature in the process :- the name defaults to "world" if it isnt specified.

Once you've added the above lines to the plugin source, recompile and test it using an updated test script...

```
var H = plugin("./hello-plugin")

println(H.hello("Christopher"))
println(H.hello())
```

You should see the following output:

```
Hello Christopher
Hello world
```

### Versioning

It might be useful to give your plugin a version number, in case you want to allow for changes in future. The convention used in the example plugins works by populating the version number as string in the export object. Like this...

```
const VERSION = "1.00"

const initScript = `
	exports = {
		version: "`+VERSION+`",

		hello: function(who) {
			return call("Hello", {name: (who ? who : "world") }).message
		}
	}
`
```

If you dont provide a "version" field in the exports object, the TBscript framework populates it with the value "unknown".

With this in place, you do things like...

```
var H = plugin("./hello-plugin")
if (H.version == "1.00") {
	println(H.hello())
}
```

### Printing messages from the plugin.

Sometimes, when you are developing code, it is useful to be able to print information to the screen to track progress (etc). The way GO plugins work introduces a gotcha here because the communication between the caller (tbscript) and the plugin works by exchanging data over the plugin's standard input and output file handles. The implication of this is that if your code prints to the os.Stdout handle or reads from os.Stdin it will break the RPC protocol. For this reason, plugin code MUST NOT print to the standard output. It is, however, okay to print to the standard error handle.

So GO code like this will break your plugin..

```
fmt.Println("This is a debug message");
```

But this is fine..

```
fmt.Fprintln(os.Stderr, "This is a debug message");
```

### Plugin shutdown

Every plugin is automatically provided with a "shutdown()" function which closes the RPC connection and terminates the plugin process. This frees up the memory and other system resources used by the plugin instance.

Example:

```
var H = plugin("./hello-plugin")
println(H.hello("Barry"))
H.shutdown()
println(H.hello("Simon"))
```

This will output:

```
Hello Barry
JS Error: connection is shut down
    at <native code>
    at call (<anonymous>:6:12)
    at <anonymous>:11:11
    at hello-test.js:4:1
```

.. which shows that the second H.hello() call failed because the plugin had been shut down on the previous line.

It is worth noting that "shutdown()" is also automatically called for any plugin loaded with in a tbscript async "go" JVM when the JVM thread terminates.


### Plugin location

When JS code calls the "plugin()" function to load a plugin, it locates the file using the following rules...

1. If the file name includes a "/" (or "\\" in windows) then look for it in that location only. Otherwise...
2. If the environment variable "TBPLUGINPATH" is set, then look for the binary in the directories listed there (in the order specified). Otherwise...
3. Look for it in the directory from which the tbutil or tbscript binary was loaded.
4. Look for it in the directory "tbplugin.d" in the current directory.
5. Look in the directory "tbplugin.d" in the user's home directory.
6. Look in /usr/local/lib/tbplugin.d (Linux and MAC only)

The first of these rules is why we've been using "./hello-plugin" to access it in the examples rather than just "hello-plugin".

The recommended best practice is to leverage the 3rd rule by placing the plugin in same directory as the tbutil binary. And this is the approach taken by the default installer.

---

TODO ..

* Returning handles, object instances and multiple plugin instances.
