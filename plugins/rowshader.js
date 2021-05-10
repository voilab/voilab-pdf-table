/*jslint node: true, unparam: true, nomen: true */
'use strict';

var lodash = require('lodash'),

  /**
   * Plugin constructor. Configuration may take parameters listed below.
   *
   * @param {String} shade1 first colour to shade the row with
   * @param {String} shade2 second colour to shade the alternating row with
   * @param {String} textColor text colour to revert to after shading
   * @param {Number} x X position where shading starts
   * @param {Number} width width of the shading
   * @param {Boolean} offsetHeader offset the header height if a header is drawn on each new page
   */
  PdfTableRowShader = function (conf) {
    lodash.merge(this, {

      id: 'rowshader',

      /**
       * The first colour to shade the row with
       * @var {String}
       */
      shade1: null,

      /**
       * The second colour to shade the alternating row with
       * @var {String}
       */
      shade2: null,

      /**
       * The text colour to revert to after shading
       * @var {String}
       */
      textColor: null,

      /**
       * The X position where shading starts
       * @var {Number}
       */
      x: null,

      /**
       * The width of the shading
       * @var {Number}
       */
      width: null,

      /**
       * Offset the header height if a header is drawn on each new page
       * @var {Boolean}
       */
      offsetHeader: false,

    }, lodash.clone(conf || {}));
  };

lodash.assign(PdfTableRowShader.prototype, {
  /**
   * Configure plugin by attaching functions to table events
   *
   * @param {PdfTable}
   * @return {void}
   */
  configure: function (table) {
    // setup internal values
    lodash.merge(this, {
      _currentRowHeight: 0,
      _shadingCount: 0,
      _headerHeight: 0,
    })
    // set defaults
    if (!this.x) this.x = 72;
    if (!this.shade1) this.shade1 = '#DAE6F2';
    if (!this.shade2) this.shade2 = '#BACEE6';
    if (!this.textColor) this.textColor = '#000';
    if (!this.width) this.width = 449;

    table
      .onRowAdd(this.onRowAdd.bind(this))
      .onPageAdded(this.onPageAdded.bind(this))
      .onHeaderHeightCalculated(this.onHeaderHeightCalculated.bind(this))
  },

  /**
   * Draws a background behind the row, unless the page is about to break
   *
   * @param {PdfTable} table
   * @param {row} row about to be added
   * @return {void}
   */
  onRowAdd: function (table, row) {
    var page = table.pdf.page;
    // calculate y value where the page will break
    var pageBreakPoint = page.height - page.margins.bottom - table.bottomMargin;

    this._currentRowHeight = row._renderedContent.height;
    // check if a page break is about to occur when the row is added
    // if so return and allow onPageAdded to set the row background
    if (table.pdf.y > (pageBreakPoint - this._currentRowHeight)) return;

    var shade = this._shadingCount % 2 === 0 ? this.shade1 : this.shade2;
    // shade the row
    this.rowShading(table.pdf, this.x, table.pdf.y, this.width, this._currentRowHeight, shade)
      .fillAndStroke(this.textColor, this.textColor); // revert back to text colour

    this._shadingCount++;
  },

  /**
   *  Shade the first row after a page is added
   *
   * @param {PdfTable} table
   * @return {void}
   */
  onPageAdded: function (table) {
    var shade = this._shadingCount % 2 === 0 ? this.shade1 : this.shade2;
    var y = this.offsetHeader ? table.pdf.y + this._headerHeight : table.pdf.y
    // shades the first row after a page break
    this.rowShading(table.pdf, this.x, y, this.width, this._currentRowHeight, shade)
      .fillAndStroke(this.textColor, this.textColor); // revert back to text colour

    this._shadingCount++;
  },

  /**
   * Get the height of the table header
   *
   * @param {PdfTable} table
   * @param {header} header with height calculation
   * @return {void}
   */
  onHeaderHeightCalculated: function (table, header) {
    this._headerHeight = header._renderedContent.height;
  },

  /**
   * Draw a rectangle with the chosen shade of colour
   *
   * @param {pdf} pdf document
   * @param {x} X pos of shading
   * @param {y} Y pos of shading
   * @param {w} width of shading
   * @param {h} height of shading
   * @param {shade} colour of shading
   *
   * @return {pdf}
   */
  rowShading: (pdf, x, y, w, h, shade) => {
    return pdf
      .rect(x, y, w, h)
      .fillAndStroke(shade, shade);
  }

});

module.exports = PdfTableRowShader;
