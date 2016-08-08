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
                    width: 40
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

## Licence

This code is released under the MIT License (MIT)
