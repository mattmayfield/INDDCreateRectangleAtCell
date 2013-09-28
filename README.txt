This repository contains:

CreateRectangleAtCell.js	JavaScript functions for use with InDesign CS5
CreateRectangleDemo.indd	A test file to demonstrate the use of the JavaScript
CreateRectangleDemo.js		A JavaScript file to use to test/demo the functions
LICENSE.txt			The license requirements of this open source software
README.txt			This file


CreateRectangleAtCell.js contains the following:

function FindTableBounds(tbl)

This function takes a reference to an InDesign table as source and
returns an object of type ObjectBounds (see below) which provides
the upper left and lower right boundaries of the table.

function FindCellBounds(tbl,row,col)

This function uses FindTableBounds() to determine the base location
of the table then steps through the rows and columns of the table
to determine the boundaries of the indicated cell in the table.

Note that the row and column are zero based.

function CreateRectangleAtCell(tbl, row, col, prop)

This function uses FindCellBounds() to determine the location of the
table cell then creates a rectangle at the same size and location.

The optional prop object can be used to apply properties to the newly
created rectangle.

The function returns a reference to the rectangle.

Row and col are zero based.

There is also a helper class within the file, ObjectBounds() which has
two properties, upperLeft and lowerRight. Each of these properties has
an x and y property. These are used to return the locations of the diagonally
opposing corners of a table or cell.

The CreateRectangleDemo.js file works with the TableRectangleDemo.indd to demonstrate
and test the functions. To perform the demo, 

1. Open the TableRectangleDemo.indd file in InDesign CS5. 
2. Copy the two JavaScript files to the scripts panel folder - if you do not know
where this folder is, open the Scripts panel in InDesign by selecting Window -> 
Utilities -> Scripts. Click the menu in the upper right of this panel and select
"reveal in explorer".
3. From the scripts panel, right click the CreateRectangleDemo.js file and select
"run script"
4. The script will run and place orange, partially transparent rectangles over table
cells in the document.

