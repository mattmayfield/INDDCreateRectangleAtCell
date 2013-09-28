//  This is open source software licensed under the MIT license.
//
// Copyright (c) 2013 Flying Duck Computer, Inc.
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//
//  This determines the geometric bounds of the table in [y1,x1,y2,x2] format
//  based on the size of the table and the justification of the text frame in
//  which it's contained. The returned object has two members, upperLeft and
//  lowerRight, each of which has an x and y property.
//
//  Following the functions is a test suite designed to be used with
//  the TableRectangleDemo.indd file.
//

/*
 * @fileoverview This file contains three useful functions which can be used
   with Adobe InDesign CS5.

   ObjectBounds()       An object providing the boundaries of an InDesign element. 
   FindTableBounds()    Finds the upper left and lower right bounds of a table.
   FindCellBounds()     Finds the upper left and lower right bounds of a cell in a table
   CreateRectangleAtCell()  Creates a rectangle with the same sized and position as a table cell
*/

/*
    @class This wraps an object's location into two properties, upperLeft
    and lowerRight. These properties each have an x and y property.
    @constructor
    @param(number) ul_x The x coordinate for the upper left
    @param(number) ul_y The y coordinate for the upper left
    @param(number) lr_x The x coordinate for the lower right
    @param(number) lr_y The y coordinate for the lower right
*/
function ObjectBounds(ul_x, ul_y, lr_x, lr_y)
{
    this.upperLeft = { "x": ul_x, "y": ul_y };
    this.lowerRight = { "x": lr_x, "y": lr_y };
}

/*
This returns the upper left and lower right bounds of a table. The
return value is a structure formatted as an object with two properties,
upperLeft and lowerRight. Each of these has an x and y property.

If this function is failing to find the bounds of a table that is centered
vertically, try adjusting the bounds of the textframe (increase or decrease
the size a little). There appears to be a "feature" of InDesign where now
and then a centered table gets shifted slightly up or down and INDD
doesn't correct it.

@param{Table} A reference to an InDesign table object.
@returns ObjectBounds
*/
function FindTableBounds(tbl)
{
    var textFrame = tbl.parent;
    var textBounds = textFrame.geometricBounds;
    var tblWidth = tbl.width;
    var tblHeight = tbl.height;

    // see how we're justified vertically
    var pref = textFrame.textFramePreferences;

    // the inset is either an equal measure for all four sides or an array.
    // we will use it as an array.
    var inset = pref.insetSpacing;
    if (inset.length != 4) inset = [inset, inset, inset, inset];

    // now let's find the top
    var y1 = 0;
    if (pref.verticalJustification == VerticalJustification.TOP_ALIGN)
    {
        // against the top edge
        y1 = textBounds[0] + inset[0];
    }
    else if (pref.verticalJustification == VerticalJustification.BOTTOM_ALIGN)
    {
        y1 = textBounds[2] - inset[2] - tblHeight;
    }
    else
    {
        // center alignment
        y1 =  ((textBounds[0] + inset[0]) + (textBounds[2] - inset[2])) / 2 - tblHeight / 2;
    }

    // now the left
    var just = textFrame.insertionPoints[0].justification;
    var x1 = 0;
    if (just == Justification.LEFT_JUSTIFIED || just == Justification.LEFT_ALIGN)
    {
        x1 = textBounds[1] + inset[1];
    }
    else if (just == Justification.RIGHT_JUSTIFIED || just == Justification.RIGHT_ALIGN)
    {
        x1 = textBounds[3] - inset[3] - tblWidth;
    }
    else
    {
        x1 = ((textBounds[1] + inset[1]) + (textBounds[3] - inset[3])) / 2 - tblWidth / 2;
    }
    return new ObjectBounds(x1, y1, x1 + tblWidth, y1 + tblHeight);
}

/*
* This finds the geometric bounds of a table cell within the
* given table. The returned value is either null if the row
* or column (both of which are zero based) is outside of the
* bounds of the table, or else an ObjectBounds object.
*
*@param{Table} A reference to an InDesign table object.
*@param{int} Zero based row number
*@param{int} Zero based column number
*@returns ObjectBounds
*/
function FindCellBounds(tbl, row, col)
{
    var tblBounds = this.FindTableBounds(tbl);
    if (tblBounds == null) return null;

    // are the row and column numbers reasonable?
    if (row < 0 || row >= tbl.rows.length) return null;
    if (col < 0 || col >= tbl.columns.length) return null;

    // get our base positions
    var x1 = tblBounds.upperLeft.x;
    var y1 = tblBounds.upperLeft.y;
    for (var r = 0; r < row; ++r) y1 += tbl.rows[r].height;
    for (var c = 0; c < col; ++c) x1 += tbl.columns[c].width;
    return new ObjectBounds(x1, y1, x1 + tbl.columns[col].width, y1 + tbl.rows[row].height);
}

/*
* Create a rectangle (for an image) to place in the same location
*  as a table cell.
*
*@param{Table} A reference to an InDesign table object.
*@param{int} Zero based row number
*@param{int} Zero based column number
*@param{object} Optional properties to apply to the rectangle
*@returns  Rectangle
*/
function CreateRectangleAtCell(tbl, row, col, prop)
{
    // get the location of the cell
    var pos = this.FindCellBounds(tbl, row, col);
    if (pos == null) return null;
    var textFrame = tbl.parent;
    var pg = textFrame.parentPage;

    // add our position settings to the caller's properties
    if (prop == null) prop = new Object();
    prop.geometricBounds = new Array(pos.upperLeft.y, pos.upperLeft.x, pos.lowerRight.y, pos.lowerRight.x);

    //  create the rectangle. There is a method for creating rectangles that takes the properties as the third parameter,
    // however in most cases this method will fail.
    var r = pg.rectangles.add();
    r.properties = prop;
    return r;
}



