Voilab Pdf Table
====================

PdfKit wrapper that helps to draw informations in simple tables.

## Installation

```
npm install --save voilab-pdf-table
```

## Usage

```js
// in some service
var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');

module.exports = {
    create: function () {
        // create a PDF from PDFKit, and a table from PDFTable
        var pdf = new PdfDocument({
                autoFirstPage: false
            }),
            table = new PdfTable(pdf, {
                bottomMargin: 30
            });

        table
            // add some plugins (here, a 'fit-to-width' for a column)
            .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
                column: 'description'
            }))
            // set defaults to your columns
            .setColumnsDefaults({
                headerBorder: 'B',
                align: 'right'
            })
            // add table columns
            .addColumns([
                {
                    id: 'description',
                    header: 'Product',
                    align: 'left'
                },
                {
                    id: 'quantity',
                    header: 'Quantity',
                    width: 50
                },
                {
                    id: 'price',
                    header: 'Price',
                    width: 40
                },
                {
                    id: 'total',
                    header: 'Total',
                    width: 70,
                    renderer: function (tb, data) {
                        return 'CHF ' + data.total;
                    }
                }
            ])
            // add events (here, we draw headers on each new page)
            .onPageAdded(function (tb) {
                tb.addHeader();
            });

        // if no page already exists in your PDF, do not forget to add one
        pdf.addPage();

        // draw content, by passing data to the addBody method
        table.addBody([
            {description: 'Product 1', quantity: 1, price: 20.10, total: 20.10},
            {description: 'Product 2', quantity: 4, price: 4.00, total: 16.00},
            {description: 'Product 3', quantity: 2, price: 17.85, total: 35.70}
        ]);

        return pdf;
    }
};
```

```js
// with express, in some route
app.get('/some/route', function (req, res, next) {
   var pdf = require('some/service').create();
   pdf.pipe(res);
   pdf.end();
});
```

### Page breaks

You can customize how page breaks are done during table process like this:

```js
table.onPageAdd(function (table, row, ev) {
    // do something like
    table.pdf.addPage();
    // cancel event so the automatic page add is not triggered
    ev.cancel = true;
});
```

## Changelogs

### 0.5.1
**From #End-S**

+ added rowshader plugin (see https://github.com/voilab/voilab-pdf-table/pull/42)

**various**

+ updated dependancies

### 0.5.0
**From #Drieger**

+ if value is `Number(0)` the renderer displays it. It could be a breaking
change, so the version is bumped to 0.5.0

### 0.4.2
+ added ellipsis support (no height calculation is done for this cell)

### 0.4.1
Thank you, contributors!

**From #vikram1992**

+ added `headerOpacity` and `headerBorderOpacity` in column configuration
+ added `headerCellAdded` and `cellAdded` as a function in column configuration

### 0.4.0
Thank you, contributors!

**From #MichielDeMey**

+ better handling for padding
+ some modifications about pos calculation

**From #cbwebdevelopment**

+ added `onCellBackgroundAdd` and `onCellBackgroundAdded` events
+ added `onCellBorderAdd` and `onCellBorderAdded` events
+ the current row index is passed in events
+ some modifications about pos calculation

### 0.3.0
+ new pages are better handeled. No more need to call `setNewPageFn`
+ removed `setNewPageFn`. Check documentation for how you can customize page
add. Deprecated mention will be definitively removed in next release

### 0.2.0
+ added event `onColumnPropertyChanged`
+ added event `onColumnAdded`
+ removed `onColumnWidthChanged`. Use `onColumnPropertyChanged` instead.
Deprecated mention will be definitively removed in next release
+ Issue #1 fix

### 0.1.5
First shot

## Licence

This code is released under the MIT License (MIT)
