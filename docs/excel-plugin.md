# EXCEL plugin for TBUtil

*Last updated: 18 Mar 2021*

---

A tbutil/tbscript plugin for creating MS Excel spreadsheets using highly simplified logic.

All writes to the workbook are effectively "appends". So: "addRow" appends a row to the active sheet, "addSheet" appends a new sheet to the workbook -- etc.

This plugin is not designed to be a full-functioned Excel sheet creator and formatter. If the very simple rules it provides do not meet your needs, we suggest considering using an alternative mechanism.

The plugin works on all 64bit tbutil platforms, namely: Linux, Darwin/MAC and Windows

The plugin supports the following methods:

| Name | Description |
| ---- | ----------- |
| open | create a new workbook, and create an empty initial sheet |
| close | close and delete an open workbook |
| save | save the workbook to a local file |
| get  | collect an in-memory binary copy of the sheet that can be used to mail as an attachment |
| addSheet | append a new sheet to the workbook and make it active |
| setSheetName | change the name of the active sheet |
| addRow | append a row to the active sheet and apply some simple formatting to the cells. |
| freezeRows | lock and number of rows at the top of the sheet so they dont scroll with the other rows |


## open()

Starts the creation of a new excel workbook, and returns a handle against which other commands can be called.

The new workbook initially contains a single sheet named "Sheet1".

All following calls to "addRow" add to this sheet until "addSheet" is called. The name of the active sheet may be changed using the "setSheetName" method.

	
```javascript
var p = plugin("excel-plugin");
var wb = p.open();
```


## close()

Closes an open workbook. The workbook and all sheets, rows and cells it contains will be discarded.

```javascript
wb.close();
```


## save(file_name)

Saves the open workbook to the named file.

```javascript
wb.save("mysheet.xlsx")
```

Note: the file name MUST have a ".xlsx" extension.


## get()

Returns the spreadsheet contents as an array of bytes, suitable for use with the "`client.ssh.writeTempFile`" and "`client.ssh.emailAttachment`" functions.

Example usage ...

```javascript
var bytes = wb.get()
var fileName = client.ssh.writeTempFile(bytes, ".xlsx")
```


## addSheet()

Appends a new sheet to the workbook, giving it a default name. The new sheet becomes the active sheet and subsequent calls to "addRow" add rows to it (starting a row 1).

```javascript
wb.addSheet()
```


## setSheetName(sheet_name)

Changes the name of the active sheet. The function returns the actual name used (it may have had 'illegal' characters removed and/or a salt number added).

```javascript
var actual_name = wb.setSheetName("Costs")
```

## addRow(format, values ...)

Appends a new row to the active sheet and writes values to the row, left to right, starting in column A.

The first argument indicates how the values in the row should be formatted. The second and subsequent arguments contain the values to be added (these should be simple scalar values - string, number, etc).

If the arguments list contains any arrays, these are "flattened" into a singe level array with the scalar values. The side effect of this is that the "addRow" lines in the example below all have exactly the same effect.

```javascript
var format = "lb l r r";
wb.addRow(format, "Oranges", "Seville", 12, 1.5);
wb.addRow(format, "Oranges", ["Seville", 12], 1.5);
wb.addRow(format, ["Oranges", ["Seville", 12], 1.5]);
var values = ["Oranges", "Seville", 12, 1.5];
wb.addRow(format, values);
wb.addRow(format, [values]);
```

The format string consits of a number of specifications separated by spaces. The first specificaion refers to column A, the second to B, .. etc. If there are fewer specifications than columns, then the last specification refers to ALL remaining columns.

Example: the following centers ALL the cells in the row except the first (which is left-aligned)..

```javascript
var format = "l c";
wb.addRow(format, "Oranges", "Seville", 12, 1.5);
```

The format specifications consist of one or more of the following (blank specifications are not supported)...

| Format | Meaning |
| ------ | ------- |
| l      | left align (the default) |
| r      | right align |
| c      | centered |
| b      | bold text |
| h      | colour blue (used traditionally for primary headers) |
| g      | colour green (suggested for secondary headers) |
| s      | striped rows |
| T      | Title font (with Logo image included) |
| B      | Slightly bigger than normal font size |
| mN     | merge this cell with the next N cells to it's right (N must be an integer number) |
| {xxx}  | excel format specification, enclosed in braces - eg {0.000} to display to 3 decimal places |

All other characters are ignored

Note:

- the letter "h" stands for header and implies "blue". "b" is used for "bold" so could not also be used for "blue".
- the format "lbh" is recommended for cells in the primary header row.
- merged header cells tend to look best if centered (eg: "cbhm2")


## freezeRows(number_of_rows)

Causes the top "`number_of_rows`" rows to be frozen - which means they do not scroll with the rest of the sheet.
