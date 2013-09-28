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
#include "CreateRectangleAtCell.js"

//
//  Test suite - the following functions are for demonstrating
//  the use of the functions
//

/*  This function creates a set of rectangles at the same position as a set of cells in a table
*
*@param{int} The page number in the document, the first page is #1
*@param{string} The script label for a text frame containing a single table for our test
*@param{object} An object containing the properties to apply to the rectangle. See the InDesign reference for "Rectangle" for allowed properties.
*@param{array} An array consisting of [row,col] pairs indicating where the rectangles are to be created
*/
function RunTest(pageNum, textFrameLabel, props, rectList)
{
    // the page number we're given is 1 based, the array is zero based.
    if ( pageNum < 1 || pageNum > app.activeDocument.pages.length )
    {
        throw "RunTest: page number out of bounds, "+pageNum.toString();
    }
    var pg = app.activeDocument.pages[pageNum - 1];
    
    // now we need to find our text frame
    var tbl = null;
    for (var tfidx = 0; tfidx < pg.textFrames.length; ++tfidx)
    {
        if (pg.textFrames[tfidx].label == textFrameLabel)
        {
            // assume this is a textframe and that it has exactly
            // one table in it
            tbl = pg.textFrames[tfidx].tables[0];
            break;
        }
    }

    if (tbl == null)
    {
        throw "RunTest: failed to find table, textframe "+textFrameLabel+", page "+pageNum.toString();
    }

    for (var idx = 0; idx < rectList.length; ++idx)
    {
        // each element of the rectangle list has a row and column of the
        // cell where we're to create a rectangle
        var pos = rectList[idx];
        var rect = CreateRectangleAtCell(tbl, pos[0], pos[1], props);

        // at this point we could manipulate the rectangle further,
        // for example we could place an image in it.
    }
}


// properties to apply to our tests
var props = new Object(
        { "itemLayer" : "AboveTables", // The layer "AboveTables" is one that I set up in the demo document.
                                                    // the other two layers in the test document are "Tables" and "BelowTables"
           "fillColor" : "Orange",          // Orange is a color I created in the swatches
           "fillTint" : 100,                    // 100%
           "strokeWeight" : 0,             // no border on the rectangle
           "textWrapPreferences":      // prevent the text in the table cells from being shoved aside
                { "textWrapMode": TextWrapModes.NONE },
           "transparencySettings" :     // when over the text, lets the text appear
                 { "blendingSettings" :  { "opacity" : 25 } }
            });

// these tables are aligned to the top of their text frames
RunTest(2, "TopLeft", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);
RunTest(2, "TopCenter", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);
RunTest(2, "TopRight", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);

// these are centered vertically within the frames
RunTest(2, "CenterLeft", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);
RunTest(2, "CenterCenter", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);
RunTest(2, "CenterRight", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);

// and these are at the bottom of the frames
RunTest(3, "BottomLeft", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);
RunTest(3, "BottomCenter", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);
RunTest(3, "BottomRight", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);

// this table has rows and columns of varying sizes
RunTest(3, "Variable", props, [ [0,0], [0,4], [4,0], [4,4], [2,2] ]);

// this table has many rows and columns
RunTest(4,"LargeTable", props, [ [0,0], [39,0], [0,7], [39,7]  ]);

// end of tests