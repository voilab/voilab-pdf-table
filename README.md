Voilab Pdf Table
====================

PdfKit wrapper that helps to draw informations in simple tables.

## Installation

```
node install --save voilab-pdf-table
```

## Usage

```js
// in some service
var PdfTable = require('voilab-pdf-table'),
    PdfDocument = require('pdfkit');

module.exports = {
    create: function () {
        var pdf = new PdfDocument({
                autoFirstPage: false
            }),
            table = new PdfTable(pdf, {
                bottomMargin: 30
            });

        table
            .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
                column: 'description'
            }))
            .setColumnsDefaults({
                headerBorder: 'B',
                align: 'right'
            })
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
            .onPageAdded(function (tb) {
                tb.addHeader();
            });

        pdf.addPage();

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
table.setNewPageFn(function (table, row) {
    // do something like
    table.pdf.addPage();
});
```

## Changelogs

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
