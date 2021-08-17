# ChromeDP Plugin for TBUtil

*Last updated: 17 Aug 2021*

---

TbUtil plugin for driving a headless Chrome instance. It exposes a subset of the functions available in the GOLang 
module "[chromedp](https://github.com/chromedp/chromedp)".

This document does not attempt to describe the underlying module itself but details the exposed features and nuances introduced by the plugin. The main differences lie in the fact that the plugin is used in JavaScript scripts whereas the module is written for GOLang.

## Initialisation

```javascript
var p = plugin("chromedp-plugin");
p.open(width, height [, client]);
p.verbose(boolean_flag);
```

The `plugin` function is used to load the plugin and return an object reference from which its methods can be accessed.

The `open` method must be the first to be called after loading the plugin, and defines the dimensions of the virtual screen used by the headless chrome instance and (optionally) the credentials to be used. The `width` and `height` must be specified in pixels. If the `client` argument is used it can either be the client handle for an instance or a string starting with "@" (in which case the client described in the tbutil credential store with that key is used). This allows the `sendKeys` function to send the user name or password configured for the client.

The `verbose` method is optional and set the level of verbosity. If the flag is set to `true` then all plugin methods, URLs visited and console output is printed to the standard error file handle.

## Selectors

Many of the remaining functions use a selector and an options list. The options are specified as an array of strings and indicate how the selector is to be interpreted. The table below lists the supported options, the equivalent GOLang option (which you should refer to for detailed documentation) and comments about plugin-specific nuances.

| Option Name | GOLang option | Comments |
| ----------- | ------------- | -------- |
| byQuery     | [ByQuery](https://pkg.go.dev/github.com/chromedp/chromedp#ByQuery) | - |
| byQueryAll  | [ByQueryAll](https://pkg.go.dev/github.com/chromedp/chromedp#ByQueryAll) | - |
| byId        | [ById](https://pkg.go.dev/github.com/chromedp/chromedp#ById) | - |
| bySearch    | [BySearch](https://pkg.go.dev/github.com/chromedp/chromedp#BySearch) | - |
| byJSPath    | [ByJSPath](https://pkg.go.dev/github.com/chromedp/chromedp#ByJSPath) | - |
| byNodeID    | [ByNodeID](https://pkg.go.dev/github.com/chromedp/chromedp#ByNodeID) | The selector must be specified as a single integer number |

Note: you should only specify ONE of the "by..."" options. "BySearch" is the default.

## Query options

In addition to the selector options described above, you can also specify options to indicate what state should be waited for before returning. The table below lists these and the equivalent GOLang option (which you should refer to for detailed documentation)..

| Option Name | GOLang option | Comment |
| ----------- | ------------- | ------- |
| nodeReady | [NodeReady](https://pkg.go.dev/github.com/chromedp/chromedp#NodeReady) | - |
| nodeVisible | [NodeVisible](https://pkg.go.dev/github.com/chromedp/chromedp#NodeVisible) | - |
| nodeNotVisible | [NodeNotVisible](https://pkg.go.dev/github.com/chromedp/chromedp#NodeNotVisible) | - |
| nodeEnabled | [NodeEnabled](https://pkg.go.dev/github.com/chromedp/chromedp#NodeEnabled) | - |
| nodeSelected | [NodeSelected](https://pkg.go.dev/github.com/chromedp/chromedp#NodeSelected) | - |
| nodeNotPresent | [NodeNotPresent](https://pkg.go.dev/github.com/chromedp/chromedp#NodeNotPresent) | - |
| atLeast | [AtLeast](https://pkg.go.dev/github.com/chromedp/chromedp#AtLeast) | See the `atLeast(n)` method |
| fromNode | [FromNode](https://pkg.go.dev/github.com/chromedp/chromedp#FromNode) | See the `fromNode(nodeId)` method |
| cacheNodes | - | Make an in-plugin cache of the nodes returned for use by `fromNode()` - this only works with the `nodes()` function. |

Note: you should only specify ONE of the "node..." options. "NodeReady" is the default.

### atLeast(count)

The `atLeast` method returns an option that causes at least the specified number of nodes to be matched. Not specifiying this is equivalent to setting it to 1. Note that a value of 0 is allowed, and will match even if no nodes are found.

Example:

```javascript
var headers = p.nodes("h1", [ "byQueryAll", p.atLeast(2) ]);
```

### cacheNodes / fromNode(nodeID)

The `"cacheNodes"` option is a string that tells the `nodes` function to cache the matching nodes so that they can 
be used in the `fromNode` function in a subsequent call.

The `fromNode` function returns an option to start the query from the specified root. Note that this does not work with 
all match types and is usually best used with "byQuery" or "byQueryAll" options.

Example:

```javascript
var tables = p.nodes("table", [ "byQueryAll", "cacheNodes" ]);
var table1rows = p.nodes("tr", [ "byQueryAll", p.fromNode(tables[0].nodeID) ]);

```

A call to `nodes` with no `cacheNodes` option clears the cache. Calls with the `cacheNodes` option set augment any existing cache with the newly mached node details. Other plugin methods (such as `get` dont change the cache contents).


## Exposed methods

The plugin exposes the following methods to the script. These should be called using the syntax..

```javascript
p.methodName(arguments);

```

where `p` is the reference returned by the `plugin` function - as above.


### setDownloadPath(directoryName)

This is eqivalent to the GOLang code...

```go
browser.SetDownloadBehavior(browser.SetDownloadBehaviorBehaviorAllowAndName).
	WithDownloadPath(directoryName).
	WithEventsEnabled(false)
```


### navigate(url)

Eqivalent to the GOLang method "[Navigate](https://pkg.go.dev/github.com/chromedp/chromedp#Navigate)"

Example:

```javascript
p.navigate("https://10.11.12.13/");

```


### query(selector [, options])

Eqivalent to the GOLang method "[Query](https://pkg.go.dev/github.com/chromedp/chromedp#Query)"

Example:

```javascript
p.query(129, [ "byNodeID", "nodeVisible" ]);

```


### wait...(selector [, options])

The following GOLang `Wait...` methods are implemented..

| Method Name | GOLang method |
| ----------- | ------------- |
| waitReady | [WaitReady](https://pkg.go.dev/github.com/chromedp/chromedp#WaitReady) |
| waitVisible | [WaitVisible](https://pkg.go.dev/github.com/chromedp/chromedp#WaitVisible) |
| waitNotVisible | [WaitNotVisible](https://pkg.go.dev/github.com/chromedp/chromedp#WaitNotVisible) |
| waitEnabled | [WaitEnabled](https://pkg.go.dev/github.com/chromedp/chromedp#WaitEnabled) |
| waitSelected | [WaitSelected](https://pkg.go.dev/github.com/chromedp/chromedp#WaitSelected) |
| waitNotPresent | [WaitNotPresent](https://pkg.go.dev/github.com/chromedp/chromedp#WaitNotPresent) |

Examples:

```javascript
p.waitVisible("#username");
p.waitEnabled(129, [ "byNodeID" ]);

```


### click(selector [, options [, doubleClick]])

Equivalent to the GLang "[Click](https://pkg.go.dev/github.com/chromedp/chromedp#Click)"
or "[DoubleClick](https://pkg.go.dev/github.com/chromedp/chromedp#DoubleClick)"
function (depending on the value of the `doubleClick` 
boolean).

Example:

```javascript
p.click("button", [], false);

```


### sleep(num_seconds)

Equivalent to the GOLang [Sleep](https://pkg.go.dev/github.com/chromedp/chromedp#Sleep) function.

Example:

```javascript
p.sleep(30);

```


### get(selector, what [, options])

Allows a number of different data about a node to be returned. The value of `what` selects the data type as follows..

| What | GOLang Function | Comments |
| ---- | --------------- | -------- |
| innerHtml | [InnerHtml](https://pkg.go.dev/github.com/chromedp/chromedp#InnerHTML) | returns a string |
| outerHtml | [OuterHtml](https://pkg.go.dev/github.com/chromedp/chromedp#OuterHTML) | returns a string |
| text | [Text](https://pkg.go.dev/github.com/chromedp/chromedp#Text) | returns a string |
| textContent | [TextContent](https://pkg.go.dev/github.com/chromedp/chromedp#TextContent) | returns a string |
| value | [Value](https://pkg.go.dev/github.com/chromedp/chromedp#Value) | returns a string |
| dimensions | [Dimensions](https://pkg.go.dev/github.com/chromedp/chromedp#Dimensions) | returns an object |
| computedStyle | [ComputedStyle](https://pkg.go.dev/github.com/chromedp/chromedp#ComputedStyle) | returns an object |

Example:

```javascript
var pageTitle = p.get("head title", "innerHtml");

```


### sendKeys(selector, keys [, options])

Equivalent to the GOLang "[SendKeys](https://pkg.go.dev/github.com/chromedp/chromedp#SendKeys)" function.

The `keys` parameter can be..

| Type | Description |
| ---- | ----------- |
| any string | The string is sent |
| number 1 | The user name from the credentials specified in `open` is sent |
| number 2 | The password from the credentials specified in `open` is sent |

Examples:

```javascript
p.sendKeys("#username", "administrator");
p.sendKeys("#username", 1);

```

The special case of numbers 1 or 2 will result in nothing being sent if the `client` argument was not specified in the `open` function.


### javascriptAttribute(selector, attr [, options])

Equivalent to the GOLang "[JavascriptAttribute](https://pkg.go.dev/github.com/chromedp/chromedp#JavascriptAttribute) 
function.


### nodes(selector [, options] )

Equivalent to the GOLang "[Nodes](https://pkg.go.dev/github.com/chromedp/chromedp#Nodes)" function.

Returns a list of cdp.Node objects, converted to a JavaScript object. This does not include any class functions 
or hidden fields.

Example:

```javascript
var nodeList = p.nodes("input");

```

If the `cacheNodes` option is used, the returned nodes are cached by their nodeIDs in a lookup-table in the plugin for
later use in the `fromNode` option. In this case, the existing cache is augmented with the newly identified nodes.
If "`cacheNodes`" is not specified, then the cache is cleared.  

Note: while the `nodes` function understands the `cacheNodes` option, other functions do not.


### nodeIDs(selector [, options])

Equivalent to the GOLang "[NodeIDs](https://pkg.go.dev/github.com/chromedp/chromedp#NodeIDs)" function.

Returns a list of integer numbers.

Example:

```javascript
var nodeIDList = p.nodeIDs("button");

```

### screenShot(fileName [, selector [, options]] )

Takes a screen-shot of part (or all) of the screen.

If a selector (and, optionally, a list of options) is specified then this function writes a screen-shot of the first of 
the selected elements to the specified file.

If no selector or options are specified then a screen-shot of the visible screen is written to the file.


### waitQuiet(num_seconds)

This is not a standard chromedp method.

This waits for all the requests to URLs on the navigated-to host to complete (for a maximum of `num_seconds` seconds).
