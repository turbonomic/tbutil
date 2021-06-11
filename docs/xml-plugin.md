# XML Plugin for TBUtil

*Last updated: 1 Jun 2021*

---

This plugin allows tbscripts to read, parse and write XML documents.

Note: this plugin is used internally by the "loadXml" and "client.ssh.loadXml" functions.


## Initialisation

Use the "plugin" function to obtain a reference from which the plugin's methods can be called.

```javascript
var x = plugin("xml-plugin");
```


## loadXml(fileName)

Loads the spcified local XML file, parses it and populates a JS object with it's contents using a simplified schema.

```javascript
var obj = x.loadXml("/srv/tomcat/data/topology/DefaultGroups.group.topology");
```

The resulting object is easy to navigate but omits a number XML features, making it unsiutable for use when writing back. If you want a more complete XML representation use `loadXmlSeq()` instead.

Using `loadXml`...

- Attributes names are prefixed with a hyphen.
- If the element is a simple element and has attributes, the element value is given the key `#text`.
- XML comments, directives, and process instructions are ignored.
- Name space names are dropped from the keys.
- Single-entry elements are parsed to objects. Multi-entry elements are parsed to lists of objects.

See also: `parseXml()`


## loadXmlSeq(fileName)

Loads the spcified local XML file, parses it and populates a JS object with it's contents, supporting all XML features using special field names that begin with a "#" character.

```javascript
var obj = x.loadXmlSeq("/srv/tomcat/data/topology/DefaultGroups.group.topology");
```

- Attributes are parsed to object fields where the `<attr_label>` value has "#text" and "#seq" keys - the "#text" key holds the value for `<attr_label>`.
- All elements, except for the root, have a "#seq" key.
- Comments, directives, and process instructions are unmarshalled into the object using the keys "#comment", "#directive", and "#procinst", respectively.
- The optional file header is unmarshalled into the object using the key "#header".
- Name space syntax is preserved

This style of object is more complex to nagivate but is suitable for writing back using the `writeXmlSeq()` method.


## parseXml(xml_document_text)

Parses the XML text and populates a JS object with it's contents using the same simplified schema as "loadXml".

```javascript
var obj = x.parseXml(xml_doc);
```


## writeXmlSeq(fileName, object)

Writes the contents of an object that was created using `loadXmlSeq` to the specified XML file.

Provided the strucure of the object is maintained between `loadXmlSeq` and `writeXmlSeq` then the resulting output XML file will be equivalent to the one that was originally loaded (albeit: with possible changes to the attribute order and use of white space).

```javascript
x.writeXmlSeq("DefaultGroups.group.topology", obj);
```
