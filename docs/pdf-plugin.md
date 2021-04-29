# PDF Plugin for TBUtil

*Last updated: 28 Apr 2021*

---

## pdf.addPage()

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.AddPage

`addPage()` adds a new page to the document.

The font which was set before calling is automatically restored. There is no need to call `setFont()` again if you want to continue with the same font. The same is true for colors and line width.

The origin of the coordinate system is at the top-left corner and increasing ordinates go downwards.


## pdf.arc(x, y, rx, ry, degRotate, degStart, degEnd, styleStr)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.Arc

`arc()` draws an elliptical arc centered at point (`x`, `y`). `rx` and `ry` specify its horizontal and vertical radii.

`degRotate` specifies the angle that the arc will be rotated. `degStart` and `degEnd` specify the starting and ending angle of the arc. All angles are specified in degrees and measured counter-clockwise from the 3 o'clock position.

`styleStr` can be "F" for filled, "D" for outlined only, or "DF" or "FD" for outlined and filled. An empty string will be replaced with "D". Drawing uses the current draw color, line width, and cap style centered on the arc's path. Filling uses the current fill color.


## pdf.cell(x, y, text)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.Cell

`cell()` is a simpler version of `cellFormat()` with no fill, border, links or special alignment.


## pdf.cellFormat(w, h, txtStr, borderStr, ln, alignStr, fill, link, linkStr)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.CellFormat

`cellFormat` prints a rectangular cell with optional borders, background color and character string. The upper-left corner of the cell corresponds to the current position. The text can be aligned or centered. After the call, the current position moves to the right or to the next line. It is possible to put a link on the text.

An error will be returned if a call to `setFont()` has not already taken place before this method is called.

If automatic page breaking is enabled and the cell goes beyond the limit, a page break is done before outputting.

`w` and `h` specify the width and height of the cell. If `w `is 0, the cell extends up to the right margin. Specifying 0 for `h` will result in no output, but the current position will be advanced by `w`.

`txtStr` specifies the text to display.

`borderStr` specifies how the cell border will be drawn. An empty string indicates no border, "1" indicates a full border, and one or more of "L", "T", "R" and "B" indicate the  left, top, right and bottom sides of the border.

`ln` indicates where the current position should go after the call. Possible values are 0 (to the right), 1 (to the beginning of the next line), and 2 (below). Putting 1 is equivalent to putting 0 and calling `ln()` just after.

`alignStr` specifies how the text is to be positioned within the cell. Horizontal alignment is controlled by including "L", "C" or "R" (left, center, right) in alignStr. Vertical alignment is controlled by including "T", "M", "B" or "A" (top, middle, bottom, baseline) in alignStr. The default alignment is left middle.

`fill` is true to paint the cell background or false to leave it transparent.

`link` is the identifier returned by `addLink()` or 0 for no internal link.

`linkStr` is a target URL or empty for no external link. A non--zero value for `link` takes precedence over `linkStr`.


## pdf.color[colourName]


## pdf.ellipse(x, y, rx, ry, degRotate, styleStr)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.Ellipse

`ellipse()` draws an ellipse centered at point (`x`, `y`). `rx` and `ry` specify its horizontal and vertical radii.

`degRotate` specifies the counter-clockwise angle in degrees that the ellipse will be rotated.

`styleStr` can be "F" for filled, "D" for outlined only, or "DF" or "FD" for outlined and filled. An empty string will be replaced with "D". Drawing uses the current draw color and line width centered on the ellipse's perimeter. Filling uses the current fill color.


## pdf.getFontSize()

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.GetFontSize

`getFontSize()` returns the size of the current font in points the size in the unit of measure specified in `new()`. The second value can be used as a line height value in drawing operations. The return is a JS object with two fields: `ptSize` and `unitSize`.


## pdf.getXY()

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.GetXY

`getXY()` returns the abscissa and ordinate of the current position.

Note: the value returned for the abscissa will be affected by the current cell margin. To account for this, you may need to either add the value returned by `getCellMargin()` to it or call `setCellMargin(0)` to remove the cell margin. 


## pdf.line(x1, y1, x2, y2)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.Line

`line()` draws a line between points (`x1`, `y1`) and (`x2`, `y2`) using the current draw color, line width and cap style.


## pdf.ln(n)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.Ln

`ln()` performs a line break. The current abscissa goes back to the left margin and the ordinate increases by the amount passed in parameter. A negative value of h indicates the height of the last printed cell. 


## pdf.multiCell(w, h, txtStr, borderStr, alignStr, fill)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.MultiCell

 `multiCell()` supports printing text with line breaks. They can be automatic (as soon as the text reaches the right border of the cell) or explicit (via the \n character). As many cells as necessary are output, one below the other.

Text can be aligned, centered or justified. The cell block can be framed and the background painted. See `cellFormat()` for more details.

The current position after calling `multiCell()` is the beginning of the next line, equivalent to calling `cellFormat()` with `ln` equal to 1.

`w` is the width of the cells. A value of zero indicates cells that reach to the right margin.

`h` indicates the line height of each cell in the unit of measure specified in `new()`.

Note: this method has a known bug that treats UTF-8 fonts differently than non-UTF-8 fonts. With UTF-8 fonts, all trailing newlines in `txtStr` are removed. With a non-UTF-8 font, if `txtStr` has one or more trailing newlines, only the last is removed. In the next major module version, the UTF-8 logic will be changed to match the non-UTF-8 logic. 

## pdf.new(orientationStr, unitStr, sizeStr, fontDirStr)

new() starts the process of creating a new PDF.

See: https://godoc.org/github.com/jung-kurt/gofpdf#New

`orientationStr` specifies the default page orientation. For portrait mode, specify "P" or "Portrait". For landscape mode, specify "L" or "Landscape". An empty string will be replaced with "P".

`unitStr` specifies the unit of length used in size parameters for elements other than fonts, which are always measured in points. Specify "pt" for point, "mm" for millimeter, "cm" for centimeter, or "in" for inch. An empty string will be replaced with "mm".

`sizeStr` specifies the page size. Acceptable values are "A3", "A4", "A5", "Letter", "Legal", or "Tabloid". An empty string will be replaced with "A4".

`fontDirStr` specifies the file system location in which font resources will be found. An empty string is replaced with ".". This argument only needs to reference an actual directory if a font other than one of the core fonts is used. The core fonts are "courier", "helvetica" (also called "arial"), "times", and "zapfdingbats" (also called "symbol"). 

## pdf.outputFileAndClose(fileStr)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.OutputFileAndClose

`outputFileAndClose()` creates or truncates the file specified by `fileStr` and writes the PDF document to it.

## pdf.rect(x, y, w, h, styleStr)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.Rect

`rect()` outputs a rectangle of width `w` and height `h` with the upper left corner positioned at point (`x`, `y`).

It can be drawn (border only), filled (with no border) or both. `styleStr` can be "F" for filled, "D" for outlined only, or "DF" or "FD" for outlined and filled. An empty string will be replaced with "D". Drawing uses the current draw color and line width centered on the rectangle's perimeter. Filling uses the current fill color. 

## pdf.setColor(type, r, g, b)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetFillColor, https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetDrawColor pr https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetTextColor

Sets the specified type of colour. `type` can be "fill", "draw" or "text".

If `type` is "text", setColor defines the color used for text. It is expressed in RGB components (0 - 255). The method can be called before the first page is created. The value is retained from page to page.

If `type` is "fill", setColor defines the color used for all filling operations (filled rectangles and cell backgrounds). It is expressed in RGB components (0 -255). The method can be called before the first page is created and the value is retained from page to page.

If `type` is "draw", setColor defines the color used for all drawing operations (lines, rectangles and cell borders). It is expressed in RGB components (0 - 255). The method can be called before the first page is created. The value is retained from page to page.


## pdf.setFont(familyStr, styleStr, size)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetFont

SetFont sets the font used to print character strings. It is mandatory to call this method at least once before printing text or the resulting document will not be valid.

Standard fonts use the Windows encoding cp1252 (Western Europe).

The method can be called before the first page is created and the font is kept from page to page. If you just wish to change the current font size, it is simpler to call SetFontSize().

Note: the font definition file must be accessible. An error is set if the file cannot be read.

familyStr specifies the font family. It can be one of the standard families (case insensitive): "Courier" for fixed-width, "Helvetica" or "Arial" for sans serif, "Times" for serif, "Symbol" or "ZapfDingbats" for symbolic.

styleStr can be "B" (bold), "I" (italic), "U" (underscore), "S" (strike-out) or any combination. The default value (specified with an empty string) is regular. Bold and italic styles do not apply to Symbol and ZapfDingbats.

size is the font size measured in points. The default value is the current size. If no size has been specified since the beginning of the document, the value taken is 12. 


## pdf.setLineWidth(width)

See: https://pkg.go.dev/github.com/jung-kurt/gofpdf#Fpdf.SetLineWidth

Defines the line width. By default, the value equals 0.2 mm. The method can be called before the first page is created. The value is retained from page to page.


## pdf.setMetaData(meta)

See:
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetSubject
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetTitle
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetAuthor
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetCreator
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetProducer
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetKeywords
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetCreationDate
* https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetModificationDate

Sets one or more meta data fields for the document. The `meta` object can contain any combination of the following fields ..
* subject (string)
* title (string)
* author (string)
* creator (string)
* producer (string)
* keywords (string)
* creationDate (JS date object)
* modificationDate (JS date object)

Example:

```javaScript
pdf.setMetaData({
	subject: "Using TBScript to programme the Turbonomic REST API",
	author: "Turbonomic"
});
```

## pdf.setProtection(actionFlag, userPassStr, ownerPassStr)

## pdf.setXY(x, y)

See: https://godoc.org/github.com/jung-kurt/gofpdf#Fpdf.SetXY

> SetXY defines the abscissa and ordinate of the current position. If the passed values are negative, they are relative respectively to the right and bottom of the page.

Either `x` or `y` can be set to null - in which case `SetX` or `SetY` will be called with the appropriate non-null value as argument.

## pdf.shape(points, styleStr)

## pdf.transformBegin()

## pdf.transformEnd()

## pdf.transformRotate(angle, x, y)

## pdf.writeBasicHTML(lineHt, htmlStr)

See: https://pkg.go.dev/github.com/jung-kurt/gofpdf#HTMLBasicType

> Prints text from the current position using the currently selected font. The text can be encoded with a basic subset of HTML that includes hyperlinks and tags for italic (I), bold (B), underscore (U) and center (CENTER) attributes. When the right margin is reached a line break occurs and text continues from the left margin. Upon method exit, the current position is left at the end of the text.
