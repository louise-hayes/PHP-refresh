/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.18/e-1.9.0
 *
 * Included libraries:
 *   DataTables 1.10.18, Editor 1.9.0
 */

/*! DataTables 1.10.18
 * ©2008-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.18
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		}
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( $.isArray( data ) && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		// Update colspan for no records display. Child rows and extensions will use their own
		// listeners to do this - only need to update the empty table item here
		if ( ! settings.aiDisplay.length ) {
			$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
		}
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector );
		var rows = this.rows( rowSelector );
		var a, i, ien, j, jen;
	
		this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
		}, 1 );
	
	    // Now pass through the cell selector for options
	    var cells = this.cells( a, opts );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.18";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.10.18/e-1.9.0",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.0
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2019 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

(function(){var Y9=[arguments];Y9[7]=2;for(;Y9[7]!==8;){switch(Y9[7]){case 2:Z9(Y9[0][0],function(){var U9=[arguments];return U9[0][0].Array.prototype;},"filter","a2PP");Z9(Y9[0][0],function(){var J9=[arguments];return J9[0][0].String.prototype;},"replace","D2PP");Z9(Y9[0][0],function(){var C9=[arguments];return C9[0][0].Array.prototype;},"map","Q2PP");Z9(Y9[0][0],function(){var G9=[arguments];return G9[0][0];},"window","O2PP");Z9(Y9[0][0],function(){var e9=[arguments];return e9[0][0];},"global","x2PP");Z9(Y9[0][0],function(){var d9=[arguments];return d9[0][0].RegExp.prototype;},"global","x2PP");Y9[7]=8;break;}}function Z9(){var n9=[arguments];try{n9[1]=2;for(;n9[1]!==4;){switch(n9[1]){case 2:n9[7]=n9[0][0].Object.create(null);n9[7].value=(1,n9[0][1])(n9[0][0])[n9[0][2]];n9[1]=5;break;case 5:n9[0][0].Object.defineProperty((1,n9[0][1])(n9[0][0]),n9[0][3],n9[7]);n9[1]=4;break;}}}catch(M9){}}}(typeof window===typeof{}?window:typeof global===typeof{}?global:this));P133.f9=function (){return typeof P133.r9.S==='function'?P133.r9.S.apply(P133.r9,arguments):P133.r9.S;};P133.r0r='object';P133.a9=function (){return typeof P133.r9.S==='function'?P133.r9.S.apply(P133.r9,arguments):P133.r9.S;};P133.Q0r="b";P133.e0r="a";P133.R0r="on";function P133(){}P133.K0r="";P133.z0r="i";P133.A0r="funct";P133.r9=function(d2,T){function k(C2){var A9=2;for(;A9!==15;){switch(A9){case 9:A9=!B--?8:7;break;case 16:n2=g2-C2>O2;A9=19;break;case 3:O2=34;A9=9;break;case 8:q2=T[6];A9=7;break;case 19:return n2;break;case 1:A9=!B--?5:4;break;case 17:n2=C2-x2>O2;A9=19;break;case 10:A9=x2>=0&&g2>=0?20:18;break;case 6:g2=q2&&F2(q2,O2);A9=14;break;case 11:x2=(t2||t2===0)&&F2(t2,O2);A9=10;break;case 2:var n2,O2,q2,g2,t2,x2,F2;A9=1;break;case 20:n2=C2-x2>O2&&g2-C2>O2;A9=19;break;case 12:A9=!B--?11:10;break;case 13:t2=T[7];A9=12;break;case 7:A9=!B--?6:14;break;case 4:A9=!B--?3:9;break;case 18:A9=x2>=0?17:16;break;case 5:F2=X[T[4]];A9=4;break;case 14:A9=!B--?13:12;break;}}}var Q9=2;for(;Q9!==10;){switch(Q9){case 12:k=k(new X[T[0]]()[T[1]]());Q9=11;break;case 4:Q9=!B--?3:9;break;case 2:var X,Y2,a2,B;Q9=1;break;case 14:T=T.Q2PP(function(U2){var z9=2;for(;z9!==13;){switch(z9){case 1:z9=!B--?5:4;break;case 3:z9=N2<U2.length?9:7;break;case 5:E2='';z9=4;break;case 2:var E2;z9=1;break;case 4:var N2=0;z9=3;break;case 8:N2++;z9=3;break;case 9:E2+=X[a2][D2](U2[N2]+101);z9=8;break;case 7:z9=!E2?6:14;break;case 6:return;break;case 14:return E2;break;}}});Q9=13;break;case 1:Q9=!B--?5:4;break;case 3:Y2=typeof d2;Q9=9;break;case 7:a2=Y2.D2PP(new X[Q2]("^['-|]"),'S');Q9=6;break;case 8:Q9=!B--?7:6;break;case 13:Q9=!B--?12:11;break;case 9:var D2='fromCharCode',Q2='RegExp';Q9=8;break;case 6:Q9=!B--?14:13;break;case 11:return{S:function(P2,m2){var R9=2;for(;R9!==16;){switch(R9){case 20:R9=J2===2?19:10;break;case 2:R9=!B--?1:5;break;case 7:R9=K2===0?6:13;break;case 10:R9=J2!==1?20:17;break;case 9:var p2=m2(P2[T[2]](K2),16)[T[3]](2);var y2=p2[T[2]](p2[T[5]]-1);R9=7;break;case 17:return G2?h2:!h2;break;case 14:K2++;R9=3;break;case 13:G2=G2^y2;R9=14;break;case 1:m2=X[T[4]];R9=5;break;case 6:G2=y2;R9=14;break;case 19:(function(){var o9=2;for(;o9!==62;){switch(o9){case 42:I2=27;o9=1;break;case 15:I2=40;o9=1;break;case 47:I2=13;o9=1;break;case 52:I2=42;o9=1;break;case 63:I2=32;o9=1;break;case 45:j2+=u2;var b2=f2;b2+=W2;o9=63;break;case 40:b2+=u2;b2+=r2;b2+=A2;b2+=w2;b2+=W2;o9=54;break;case 46:o9=I2===35?45:1;break;case 23:j2+=A2;j2+=w2;j2+=W2;j2+=r2;o9=34;break;case 19:I2=7;o9=1;break;case 1:o9=I2!==40?5:62;break;case 4:var B2="1";var L2="G";var i2="_";o9=8;break;case 26:j2+=W2;j2+=u2;j2+=r2;o9=23;break;case 33:o9=I2===10?32:41;break;case 32:var w2="i";var A2="f";var r2="e";var u2="d";o9=28;break;case 7:o9=I2===2?6:18;break;case 2:var I2=2;o9=1;break;case 44:var f2="u";o9=43;break;case 41:o9=I2===32?40:51;break;case 43:var j2=f2;o9=42;break;case 27:o9=I2===27?26:33;break;case 8:I2=10;o9=1;break;case 34:I2=35;o9=1;break;case 18:o9=I2===42?17:27;break;case 28:var W2="n";o9=44;break;case 50:var V2="6";var X2="r";var k2="l";o9=47;break;case 12:var S2="E";var T2="0";var H2="q";var M2="M";o9=19;break;case 54:b2+=r2;b2+=u2;o9=52;break;case 6:var R2="3";var c2="w";var l2="x";o9=12;break;case 51:o9=I2===7?50:46;break;case 17:var Z2=typeof O2PP!==b2?O2PP:typeof x2PP!==j2?x2PP:this;try{var K9=2;for(;K9!==52;){switch(K9){case 42:K9=e2===26?41:1;break;case 7:K9=e2===11?6:13;break;case 6:v2+=R2;K9=14;break;case 34:K9=e2===20?33:42;break;case 17:e2=11;K9=1;break;case 21:K9=e2===10?35:34;break;case 14:e2=10;K9=1;break;case 24:v2+=X2;v2+=V2;K9=22;break;case 10:K9=e2===14?20:16;break;case 29:z2+=X2;z2+=V2;z2+=M2;K9=43;break;case 11:e2=33;K9=1;break;case 22:e2=8;K9=1;break;case 53:e2=34;K9=1;break;case 41:z2+=H2;z2+=T2;z2+=S2;z2+=l2;K9=37;break;case 20:v2+=S2;v2+=l2;v2+=c2;K9=17;break;case 16:K9=e2===2?15:21;break;case 37:z2+=c2;z2+=R2;expiredWarning();K9=53;break;case 5:K9=e2===8?4:7;break;case 43:e2=26;K9=1;break;case 8:e2=14;K9=1;break;case 1:K9=e2!==33?5:52;break;case 13:K9=e2===34?12:10;break;case 4:v2+=M2;v2+=H2;K9=9;break;case 9:v2+=T2;K9=8;break;case 33:var z2=i2;z2+=L2;z2+=B2;z2+=k2;K9=29;break;case 12:Z2[z2]=function(){};K9=11;break;case 35:e2=!Z2[v2]?20:33;K9=1;break;case 15:var v2=i2;v2+=L2;v2+=B2;v2+=k2;K9=24;break;case 2:var e2=2;K9=1;break;}}}catch(s2){}o9=15;break;case 5:o9=I2===13?4:7;break;}}}());R9=18;break;case 4:var h2=k;R9=3;break;case 5:var G2,K2=0;R9=4;break;case 3:R9=K2<P2[T[5]]?9:12;break;case 11:var J2=2;R9=10;break;case 12:R9=!h2?11:17;break;case 18:J2=1;R9=10;break;}}}};break;case 5:X=T.a2PP.constructor(d2)();Q9=4;break;}}}('return this',[[-33,-4,15,0],[2,0,15,-17,4,8,0],[-2,3,-4,13,-36,15],[15,10,-18,15,13,4,9,2],[11,-4,13,14,0,-28,9,15],[7,0,9,2,15,3],[15,6,-46,9,-44,3,-2,-2],[14,14,4,14,16,19,-53,-2]]);P133.K6=function(o6){if(P133&&o6)return P133.f9(o6);};P133.X1=function(O1){if(P133&&O1)return P133.a9(O1);};P133.G1=function(C1){if(P133)return P133.a9(C1);};P133.S0=function(T0){if(P133&&T0)return P133.f9(T0);};P133.I7=function(m7){if(P133&&m7)return P133.a9(m7);};P133.H3=function(k3){if(P133&&k3)return P133.f9(k3);};P133.b3=function(h3){if(P133&&h3)return P133.a9(h3);};P133.k5=function(j5){if(P133&&j5)return P133.f9(j5);};P133.F5=function(M5){if(P133&&M5)return P133.a9(M5);};(function(factory){var C16=P133;var p0r="a352";var o0r="6e88";var n0r="ea5";var d0r="md";var f6=C16.e0r;f6+=d0r;var r6=n0r;r6+=C16.Q0r;var p6=C16.A0r;p6+=C16.z0r;p6+=C16.R0r;if(typeof define===(C16.F5(o0r)?C16.K0r:p6)&&define[C16.k5(r6)?C16.K0r:f6]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports===(C16.b3(p0r)?C16.K0r:C16.r0r)){module.exports=function(root,$){if(!root){root=window;}if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else{factory(jQuery,window,document);}}(function($,window,document,undefined){var G16=P133;var N16="CLASS";var F16="editorFields";var P56='en';var Z56='YYYY-MM-DD';var c96="ke";var u96="splay";var B96='year';var v96="_options";var c86='<button class="';var z86="an>";var Z86="opti";var k6U='<tbody>';var j6U='<table class="';var K6U='</tr>';var o6U='<tr>';var h6U="Da";var N6U="firs";var X4U='</td>';var L4U='</span>';var V4U='<span>';var w4U="year";var y4U="selected";var d4U='scroll.';var W4U="_pad";var x4U="getUTCFullYear";var F4U="getFullYear";var M4U="U";var Z4U="etUT";var l4U="_daysInMonth";var j1U="urs";var a1U="getU";var f1U="getUTCHours";var K1U="R";var z1U='disabled';var C1U="bled";var U1U="min";var Y1U="ours";var v1U="getUTCMonth";var H0U="setUTCMinutes";var C0U="has";var W0U="sec";var x0U="np";var E0U="_p";var l0U="parts";var s7U="put";var X7U="classPrefix";var T7U="_setTime";var w7U="_writeOutput";var y7U="UTC";var g7U="momentStrict";var H7U="ormat";var f7U="_dateToUtc";var A7U="pti";var d7U="_se";var G7U="maxDate";var C7U="_setCalan";var J7U="empty";var b7U="_instance";var w3U="format";var y3U="moment";var a3U="-d";var r3U="class";var Q3U="on>";var J3U="<sp";var U3U="-ye";var F3U="onds";var i3U=" class=\"";var B3U="date";var l3U="lendar";var a2U="Title";var p2U="18";var K2U='selected';var n2U="tton";var M2U="itle";var v2U="mi";var q2U="ls";var y5U="utt";var k5U="DTE_Bubble_Triangle";var j5U="icon close";var c5U="DTE_Bubble_Table";var a5U="DTE DTE_Bubble";var f5U="DTE_Inline_Buttons";var r5U="DTE_Inline_Field";var p5U="DTE DTE_Inline";var K5U="DTE_Action_Remove";var o5U="DTE_Action_Edit";var R5U="DTE_Processing_Indicator";var z5U="multi-noEdit";var A5U="DTE_Field_Info";var Q5U="DTE_Field_Message";var n5U="DTE_Field_Error";var d5U="DTE_Label_Info";var e5U="DTE_Label";var G5U="DTE_Field_Name_";var C5U="DTE_Field_Type_";var J5U="btn";var U5U="DTE_Form_Error";var Y5U="DTE_Form_Content";var W5U="DTE_Form";var x5U="DTE_Body_Content";var u5U="DTE_Header_Content";var s9U="rents";var X9U="pa";var c9U="filter";var a9U="alue";var x9U="index";var h9U="led";var q9U="any";var w8U="nodeName";var R8U="indexes";var z8U="rows";var u8U='_basic';var E8U='Minute';var b8U='pm';var h8U='am';var N8U='Fri';var F8U='Thu';var M8U='Mon';var i8U='Sun';var B8U='September';var v8U='May';var q8U='Next';var P8U='Previous';var Z8U="Undo changes";var l8U="Are you sure you wish to delete 1 row?";var t6m="Are you sure you wish to delete %d rows?";var s6m="Delete";var X6m="Edit entry";var O6m="Create";var L6m="Create new entry";var V6m="New";var y6m="dr";var z6m="remo";var J6m="ource";var c4m="idSrc";var o4m="_submitTable";var Q4m="essing";var W4m='changed';var F4m="ny";var M4m="-";var X1m="Tab";var L1m="cre";var S1m="_submit";var y1m="div.";var m1m="_processing";var g1m='inline';var G1m="orm";var N1m="eI";var v1m="options";var t0m="closeIcb";var s0m="next";var w0m="ubmi";var H0m="ction";var a0m=".D";var Q0m="tio";var e0m='keydown';var U0m="non";var u0m="subm";var h0m="onComplete";var N0m="os";var y7m="ngt";var p7m="sArray";var d7m="editData";var e7m="sp";var U7m="_edit";var Y7m='"]';var x7m="af";var b7m="nArray";var N7m="deFields";var P7m="tle";var l7m="xt";var s3m="Ic";var y3m="pts";var D3m="editO";var g3m="functi";var A3m="unshift";var Q3m="lete";var e3m="com";var U3m="dex";var W3m="split";var x3m="indexOf";var E3m="oi";var B3m="status";var Z3m="idSr";var l3m="rra";var O2m="_ajax";var T2m="oin";var w2m="ve";var D2m="spla";var R2m="Table";var z2m="TableTools";var C2m="footer";var x2m="ajaxUrl";var u2m="dbTable";var E2m="ab";var q2m="xte";var P2m="8n";var O5m="sing";var I5m="</di";var H5m="\"/";var z5m="dy";var A5m="oces";var d5m="ev";var e5m="plete";var C5m="_limitLeft";var Y5m="su";var W5m="ll";var x5m="ca";var b5m="rr";var h5m="err";var N5m="sta";var F5m="rs";var i5m="_eve";var B5m="ors";var l5m="pl";var y9m="ess";var g9m='json';var a9m="_event";var e9m="up";var G9m="j";var U9m="isPl";var Y9m="stri";var x9m="pre";var u9m="xtend";var B9m="ma";var P9m="upload";var Z9m="safeId";var l9m="value";var t8m="va";var L8m='value';var V8m="pairs";var H8m='files()';var k8m='file()';var j8m='cells().edit()';var a8m='remove';var f8m='row().delete()';var r8m='edit';var p8m='row().edit()';var K8m="create";var o8m='editor()';var A8m="irm";var J8m="Api";var U8m="title";var h8m="ing";var M8m='button';var i8m="us";var q8m="O";var l8m="eve";var s68="rem";var V68="Class";var T68="vent";var w68="em";var I68='-';var m68="join";var g68="gt";var H68="ay";var k68="Arr";var f68="editOpts";var r68="_clearDynamicInfo";var A68="_eventName";var Q68="one";var d68="_even";var G68="multiSet";var C68="multiGet";var U68="fiel";var E68="crea";var b68="_postopen";var h68="parents";var F68='andSelf';var M68="addBack";var B68="Ar";var v68="targe";var q68="nts";var P68="ont";var l68="li";var s48="am";var O48='div.';var L48="ppend";var S48='.';var T48='"/>';var H48="appe";var r48="<d";var p48="ton";var K48="lac";var n48="displayFields";var e48="formOptions";var G48="ext";var U48="ataSo";var x48="clas";var b48="inline";var B48='#';var q48="edi";var l48="hide";var L18="_message";var V18="rror";var S18="rm";var D18="_f";var I18="enable";var k18="pt";var j18='main';var c18='fields';var r18="dit";var p18="_e";var o18="map";var R18='open';var z18="displayed";var Q18="eac";var n18="disable";var e18="template";var W18="aj";var x18="then";var u18="ctio";var E18="fun";var b18="da";var N18='data';var F18="find";var M18="arget";var i18="ows";var B18="event";var T08="po";var w08='POST';var I08="nge";var m08="ep";var g08=".e";var k08="node";var c08="undependent";var a08="maybeOpen";var f08="_assembleMain";var p08="_for";var o08="_displayReorder";var R08="_actionClass";var z08="action";var Q08="_tidy";var d08="_cr";var e08="ai";var G08="rea";var C08="sty";var J08="_ev";var U08="reate";var x08="_fieldNames";var u08="elds";var b08="splice";var h08="destroy";var N08="field";var v08="keyCode";var P08='keyup';var l08="attr";var t78='string';var s78="ct";var O78="Name";var V78="ml";var S78="I";var w78="tab";var I78="buttons";var m78="i18n";var g78="rray";var H78="isA";var a78="tto";var p78="width";var A78="get";var n78="eft";var d78="tt";var Y78="bu";var W78="includeFields";var x78="_focus";var u78="_close";var E78="click";var b78="off";var h78="et";var B78="utto";var v78="header";var P78="formInfo";var s38="eq";var X38="children";var O38="appendTo";var V38='" />';var w38='<div class="';var g38="_preopen";var H38="_formOptions";var c38="sses";var a38="s=\"";var f38="las";var p38="<di";var R38="/di";var z38="ass=\"";var Q38="ildren";var d38="itl";var e38="but";var J38='bubble';var U38='individual';var Y38='boolean';var W38="bject";var u38="xten";var E38="ns";var h38="form";var N38="ubble";var F38="Source";var M38="_dat";var i38="edit";var B38="lu";var q38="mit";var P38="sub";var Z38='blur';var s28="ajax";var X28="ord";var O28="lic";var V28="order";var S28="pu";var T28="fields";var w28="mData";var I28="multiReset";var m28="editFields";var g28="_dataSource";var a28="ields";var p28="th";var K28="leng";var o28="der";var A28="add";var n28="modifier";var d28="row";var e28="hea";var G28="table";var J28="attach";var U28="dataTable";var Y28="dte";var W28="ion";var x28="act";var u28="ea";var E28="cr";var P28="ch";var X58="div.DTE";var S58=".";var T58="div";var w58="ra";var k58="ta";var j58="Clas";var c58="as";var f58="nimate";var o58="ow";var Q58="offset";var n58="top";var e58="offsetWidth";var u58="lay";var b58="at";var i58="In";var X98="style";var g98="dd";var r98="child";var p98="clos";var o98="ispla";var G98="</div";var h98="unbind";var M98="scrollTop";var q98="ove";var l98="bo";var s88="animate";var X88="per";var L88="offse";var S88="ckground";var T88="ba";var m88='div.DTE_Body_Content';var g88="outerHeight";var a88="ou";var f88="igh";var A88="ap";var Q88="ound";var n88="backgr";var d88="hasClass";var e88="target";var U88='click.DTED_Lightbox';var Y88="bind";var W88='div.DTE_Footer';var E88="_animate";var b88="_dte";var h88="_heightCalc";var N88="background";var M88="conf";var i88='auto';var v88="C";var q88="ad";var P88="tion";var t6G="conte";var X6G="he";var O6G="wra";var L6G="ackground";var V6G="lose";var S6G="ind";var y6G="app";var D6G="wr";var m6G="cli";var c6G="cro";var f6G="_dom";var z6G="oun";var A6G="ackgr";var Q6G="cs";var n6G="ity";var d6G="opac";var G6G="sh";var C6G="_h";var U6G="_sh";var Y6G="_show";var x6G="close";var u6G="append";var b6G="_s";var h6G="te";var N6G="ent";var F6G="ren";var i6G="ach";var B6G="det";var v6G="pend";var Z6G="display";var l6G="od";var s4G="displ";var S4G="v>";var T4G="/";var y4G='row';var D4G='all';var I4G='close';var m4G='submit';var g4G="button";var H4G="displayController";var k4G="text";var j4G="defaults";var c4G="Field";var a4G="call";var p4G="uns";var R4G="info";var z4G='block';var A4G="css";var n4G="ds";var d4G="ult";var U4G="8";var Y4G="i1";var W4G="nf";var u4G="cla";var N4G="htm";var F4G="k";var i4G="parent";var B4G="cti";var q4G=":";var Z4G="an";var l4G="submit";var X1G="ck";var V1G="op";var T1G="remove";var I1G="set";var a1G="isArray";var p1G="replace";var o1G='&';var Q1G="place";var n1G="ace";var e1G="la";var G1G="rep";var Y1G="ssing";var x1G="lock";var u1G="no";var h1G="isPlainObject";var N1G="inArray";var i1G="mu";var q1G="val";var P1G="ngth";var Z1G="multiValues";var O0G="html";var L0G="detach";var V0G="ht";var S0G="pp";var T0G="slideUp";var w0G="host";var I0G="sl";var g0G="lue";var j0G="_t";var f0G="inp";var r0G="contai";var p0G="cus";var K0G="Fn";var R0G="cu";var z0G='input';var A0G="input";var e0G="classes";var C0G="cont";var J0G="hasC";var U0G="multiIds";var Y0G="ength";var x0G="fieldError";var E0G="removeClass";var b0G="tainer";var N0G="error";var M0G="ntainer";var i0G="co";var v0G="classe";var q0G="bl";var P0G="disa";var l0G="con";var s7G="lasses";var X7G="abl";var O7G="en";var L7G='none';var V7G='body';var w7G="ss";var y7G="play";var D7G="addClass";var I7G="container";var m7G="om";var g7G="sse";var H7G="cl";var k7G="ble";var c7G='function';var a7G="ault";var f7G="lt";var p7G="ts";var K7G="apply";var o7G="slice";var R7G="prototype";var z7G="cal";var A7G="ft";var Q7G="hi";var n7G="un";var e7G="multiReturn";var G7G="dom";var C7G="focus";var J7G="al";var U7G="v";var Y7G='readonly';var W7G="disabled";var x7G="multiEditable";var u7G="opts";var E7G="ass";var N7G='click';var F7G="multi";var P7G="models";var l7G='display';var s3G="end";var X3G=null;var O3G='create';var L3G="_typeFn";var S3G="processing";var T3G="fieldInfo";var w3G="message";var m3G='</div>';var k3G="multiValue";var f3G='</label>';var r3G="labelInfo";var K3G="label";var o3G='">';var z3G=' ';var A3G="wrapper";var Q3G="_fnSetObjectDataFn";var n3G="ataFn";var e3G="ed";var G3G="valFromData";var C3G="oApi";var J3G="dat";var U3G="data";var Y3G="ata";var u3G="id";var E3G="name";var b3G="fieldTypes";var h3G="settings";var F3G="extend";var M3G="18n";var i3G="ul";var B3G="eld";var q3G="def";var l3G="iel";var t2G="tend";var s2G="ex";var L2G="lass";var V2G="<div c";var y2G="nam";var a2G="iv";var p2G="/>";var o2G="n>";var R2G="</s";var z2G=">";var e2G="<div";var J2G="\">";var x2G="/div>";var b2G="<div ";var F2G="iv>";var M2G="/d";var i2G="<";var q2G="div>";var P2G="</";var Z2G="exten";var l2G="ol";var t5G="tr";var X5G="inpu";var O5G="el";var S5G="g";var T5G="sa";var y5G="do";var D5G=true;var g5G=false;var H5G="length";var k5G="len";var j5G="gth";var f5G="ha";var K5G="files";var z5G="push";var A5G="each";var Q5G="=\"";var e5G="]";var G5G="\"";var C5G="DataTable";var J5G="fn";var U5G="_constructor";var x5G="ataTables 1.10.7 or newer";var u5G="Editor requires D";var E5G='1.10.7';var b5G="versionCheck";var h5G='s';var N5G='';var q5G="ng";var P5G="ini";var l5G=" ";var H9G="il";var k9G="im";var a9G="ge";var p9G="dataTab";var K9G="tor";var o9G="Edi";var R9G="Fi";var z9G="odels";var A9G="tings";var Q9G="F";var n9G="mode";var d9G="els";var e9G="mo";var G9G="ldType";var C9G="fie";var J9G="io";var U9G="formOpt";var Y9G="lo";var W9G="ur";var x9G="clo";var u9G="oc";var E9G="pla";var b9G="ubb";var h9G="Position";var N9G="bubble";var F9G="ons";var M9G="le";var i9G="nde";var B9G="depe";var v9G="oy";var q9G="str";var P9G="spl";var Z9G="played";var l9G="layNode";var t8G="isp";var s8G="ror";var X8G="fi";var O8G="ile";var L8G="f";var V8G="in";var S8G="ode";var T8G="otyp";var w8G="ot";var y8G="odifier";var D8G="iGet";var I8G="ultiSe";var m8G="ro";var g8G="otype";var H8G="ne";var k8G="move";var j8G="ho";var c8G="totyp";var a8G="submi";var f8G="rototy";var r8G="late";var p8G="temp";var K8G="gist";var o8G="re";var R8G="()";var z8G="eate";var A8G="row.cr";var Q8G=").edit()";var n8G="rows(";var d8G=".delete()";var e8G="rows()";var G8G="it()";var C8G=".ed";var J8G="ll()";var U8G="ce";var Y8G=".dt";var W8G="xh";var x8G="oty";var u8G="prot";var E8G="blur";var b8G="to";var h8G="se";var N8G="_cl";var F8G="yp";var M8G="eReg";var i8G="_clos";var B8G="ototype";var v8G="gs";var q8G="rudAr";var P8G="_c";var Z8G="tot";var l8G="rce";var t6r="_dataSou";var s6r="prototyp";var X6r="eorder";var O6r="playR";var L6r="is";var V6r="_d";var S6r="totype";var T6r="pro";var w6r="even";var y6r="toty";var D6r="fieldFromNode";var I6r="ty";var m6r="oto";var g6r="pr";var H6r="ax";var k6r="yAj";var j6r="ac";var c6r="_leg";var a6r="pdate";var f6r="_optionsU";var r6r="ototy";var p6r="sag";var K6r="mes";var o6r="nfo";var R6r="ltiI";var z6r="_m";var A6r="protot";var Q6r="ype";var n6r="roto";var d6r="type";var e6r="proto";var G6r="rototype";var C6r="p";var J6r="Success";var U6r="_subm";var Y6r="Error";var W6r="bmit";var x6r="_su";var u6r="ray";var E6r="_weakInAr";var b6r="efaul";var h6r="htbox";var N6r="ig";var F6r="Id";var M6r="w";var i6r="T_Ro";var B6r="it";var v6r="Ed";var q6r="ate";var P6r="Up";var Z6r="let";var l6r="De";var t4r="nformation</a>).";var s4r="t/tn/12\">More i";var X4r="A system error has occurred (<a target=\"_blank\" href=\"//datatables.ne";var O4r="es";var L4r="le valu";var V4r="ltip";var S4r="Mu";var T4r="eir individual values.";var w4r="ems contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain th";var y4r="The selected it";var D4r="vidually, but not part of a group.";var I4r="This input can be edited indi";var m4r="y";var g4r="ua";var H4r="Jan";var k4r="ry";var j4r="Februa";var c4r="h";var a4r="c";var f4r="ar";var r4r="M";var p4r="pri";var K4r="A";var o4r="n";var R4r="uly";var z4r="J";var A4r="st";var Q4r="gu";var n4r="Au";var d4r="er";var e4r="Octob";var G4r="vember";var C4r="N";var J4r="ember";var U4r="Dec";var Y4r="We";var W4r="o";var x4r="H";var u4r="eco";var E4r="S";var b4r="nd";var h4r="exte";var N4r="rmOptions";var F4r="fo";var M4r="ions";var i4r="mOp";var B4r="for";var v4r="T";var q4r="ator";var P4r="ic";var Z4r="_Processing_Ind";var l4r="r";var t1r="DTE_Heade";var s1r="ody";var X1r="TE_Foo";var O1r="nt";var L1r="_Conte";var V1r="ter";var S1r="DTE_Foo";var T1r="Form_Info";var w1r="_";var y1r="tons";var D1r="ut";var I1r="DTE_Form_B";var m1r="ield";var g1r="_F";var H1r="DTE";var k1r="nput";var j1r="DTE_Field_I";var c1r="eld_InputControl";var a1r="TE_F";var f1r="_StateError";var r1r="ld";var p1r="DTE_Fie";var K1r="i-value";var o1r="mult";var R1r="-info";var z1r="ti";var A1r="mul";var Q1r="ti-restore";var n1r="l";var d1r="u";var e1r="m";var G1r="able";var C1r="dis";var J1r="tion_Create";var U1r="DTE_Ac";var Y1r="ble_Liner";var W1r="ub";var x1r="TE_B";var u1r="round";var E1r="Backg";var b1r="TE_Bubble_";var h1r="me";var N1r="DateTi";var F1r="teTime";var M1r="D";var i1r="prototy";var B1r="Date";var v1r="Time";var q1r="Dat";var P1r="faults";var Z1r="de";var l1r="ime";var t0r="tet";var s0r="editor-da";var X0r="atetime";var O0r="d";var L0r="x";var V0r="e";var S0r="lds";var T0r="ie";var w0r="editorF";var y0r="s";var D0r="pe";var I0r="fieldTy";var m0r="or";var g0r="t";var H0r="di";var k0r="E";var j0r="vers";var c0r=".0";var a0r=".9";var f0r="1";var u0r=500;var E0r=400;var h0r=100;var F0r=60;var M0r=59;var t7r=27;var X7r=24;var L7r=20;var T7r=13;var w7r=12;var y7r=11;var D7r=10;var m7r=7;var g7r=6;var H7r=4;var k7r=3;var j7r=2;var c7r=1;var a7r=0;var f7r=f0r;f7r+=a0r;f7r+=c0r;var r7r=j0r;r7r+=G16.z0r;r7r+=G16.R0r;var p7r=k0r;p7r+=H0r;p7r+=g0r;p7r+=m0r;var K7r=I0r;K7r+=D0r;K7r+=y0r;var o7r=w0r;o7r+=T0r;o7r+=S0r;var Q7r=V0r;Q7r+=L0r;Q7r+=g0r;var O4K=O0r;O4K+=X0r;var L4K=s0r;L4K+=t0r;L4K+=l1r;var V4K=Z1r;V4K+=P1r;var S4K=q1r;S4K+=V0r;S4K+=v1r;var T4K=B1r;T4K+=v1r;var b5K=i1r;b5K+=D0r;var h5K=M1r;h5K+=G16.e0r;h5K+=F1r;var h9K=N1r;h9K+=h1r;var R6v=M1r;R6v+=b1r;R6v+=E1r;R6v+=u1r;var z6v=M1r;z6v+=x1r;z6v+=W1r;z6v+=Y1r;var A6v=U1r;A6v+=J1r;var Q6v=C1r;Q6v+=G1r;Q6v+=O0r;var n6v=e1r;n6v+=d1r;n6v+=n1r;n6v+=Q1r;var d6v=A1r;d6v+=z1r;d6v+=R1r;var e6v=o1r;e6v+=K1r;var G6v=p1r;G6v+=r1r;G6v+=f1r;var C6v=M1r;C6v+=a1r;C6v+=G16.z0r;C6v+=c1r;var J6v=j1r;J6v+=k1r;var U6v=H1r;U6v+=g1r;U6v+=m1r;var Y6v=I1r;Y6v+=D1r;Y6v+=y1r;var W6v=H1r;W6v+=w1r;W6v+=T1r;var x6v=S1r;x6v+=V1r;x6v+=L1r;x6v+=O1r;var u6v=M1r;u6v+=X1r;u6v+=V1r;var E6v=M1r;E6v+=x1r;E6v+=s1r;var b6v=t1r;b6v+=l4r;var h6v=H1r;h6v+=Z4r;h6v+=P4r;h6v+=q4r;var N6v=M1r;N6v+=v4r;N6v+=k0r;var w0v=B4r;w0v+=i4r;w0v+=g0r;w0v+=M4r;var y0v=F4r;y0v+=N4r;var D0v=h4r;D0v+=b4r;var I0v=E4r;I0v+=u4r;I0v+=b4r;var m0v=x4r;m0v+=W4r;m0v+=d1r;m0v+=l4r;var g0v=E4r;g0v+=G16.e0r;g0v+=g0r;var H0v=Y4r;H0v+=O0r;var k0v=v4r;k0v+=d1r;k0v+=V0r;var j0v=U4r;j0v+=J4r;var c0v=C4r;c0v+=W4r;c0v+=G4r;var a0v=e4r;a0v+=d4r;var f0v=n4r;f0v+=Q4r;f0v+=A4r;var r0v=z4r;r0v+=R4r;var p0v=z4r;p0v+=d1r;p0v+=o4r;p0v+=V0r;var K0v=K4r;K0v+=p4r;K0v+=n1r;var o0v=r4r;o0v+=f4r;o0v+=a4r;o0v+=c4r;var R0v=j4r;R0v+=k4r;var z0v=H4r;z0v+=g4r;z0v+=l4r;z0v+=m4r;var A0v=I4r;A0v+=D4r;var Q0v=y4r;Q0v+=w4r;Q0v+=T4r;var n0v=S4r;n0v+=V4r;n0v+=L4r;n0v+=O4r;var d0v=X4r;d0v+=s4r;d0v+=t4r;var e0v=l6r;e0v+=Z6r;e0v+=V0r;var G0v=P6r;G0v+=O0r;G0v+=q6r;var C0v=v6r;C0v+=B6r;var J0v=M1r;J0v+=i6r;J0v+=M6r;J0v+=F6r;var U0v=n1r;U0v+=N6r;U0v+=h6r;var Y0v=O0r;Y0v+=b6r;Y0v+=g0r;Y0v+=y0r;var W0v=E6r;W0v+=u6r;var L7v=x6r;L7v+=W6r;L7v+=Y6r;var T3v=U6r;T3v+=G16.z0r;T3v+=g0r;T3v+=J6r;var w3v=C6r;w3v+=G6r;var H2v=e6r;H2v+=d6r;var p2v=C6r;p2v+=n6r;p2v+=g0r;p2v+=Q6r;var x2v=A6r;x2v+=Q6r;var N2v=z6r;N2v+=d1r;N2v+=R6r;N2v+=o6r;var s5v=w1r;s5v+=K6r;s5v+=p6r;s5v+=V0r;var X5v=C6r;X5v+=l4r;X5v+=r6r;X5v+=D0r;var y5v=f6r;y5v+=a6r;var p5v=c6r;p5v+=j6r;p5v+=k6r;p5v+=H6r;var K5v=g6r;K5v+=m6r;K5v+=I6r;K5v+=D0r;var G9v=e6r;G9v+=I6r;G9v+=D0r;var U9v=w1r;U9v+=D6r;var x9v=g6r;x9v+=W4r;x9v+=y6r;x9v+=D0r;var M9v=w1r;M9v+=w6r;M9v+=g0r;var j8v=T6r;j8v+=S6r;var G8v=V6r;G8v+=L6r;G8v+=O6r;G8v+=X6r;var C8v=s6r;C8v+=V0r;var Y8v=t6r;Y8v+=l8G;var W8v=T6r;W8v+=Z8G;W8v+=m4r;W8v+=D0r;var N8v=P8G;N8v+=q8G;N8v+=v8G;var F8v=C6r;F8v+=l4r;F8v+=B8G;var i8v=i8G;i8v+=M8G;var B8v=e6r;B8v+=g0r;B8v+=F8G;B8v+=V0r;var O6y=N8G;O6y+=W4r;O6y+=h8G;var L6y=i1r;L6y+=D0r;var y6y=T6r;y6y+=b8G;y6y+=d6r;var c6y=w1r;c6y+=E8G;var a6y=i1r;a6y+=D0r;var d6y=C6r;d6y+=G6r;var r4y=g6r;r4y+=B8G;var Z1y=u8G;Z1y+=x8G;Z1y+=D0r;var r7y=W8G;r7y+=l4r;r7y+=Y8G;var p7y=W4r;p7y+=o4r;var z7y=U8G;z7y+=J8G;z7y+=C8G;z7y+=G8G;var A7y=e8G;A7y+=d8G;var Q7y=n8G;Q7y+=Q8G;var d7y=A8G;d7y+=z8G;d7y+=R8G;var b7y=o8G;b7y+=K8G;b7y+=d4r;var N7y=A6r;N7y+=m4r;N7y+=D0r;var t3y=p8G;t3y+=r8G;var s3y=C6r;s3y+=f8G;s3y+=D0r;var m3y=a8G;m3y+=g0r;var g3y=g6r;g3y+=W4r;g3y+=c8G;g3y+=V0r;var j3y=y0r;j3y+=j8G;j3y+=M6r;var r3y=e6r;r3y+=I6r;r3y+=D0r;var h3y=o8G;h3y+=k8G;var Z3y=T6r;Z3y+=b8G;Z3y+=d6r;var w2y=W4r;w2y+=C6r;w2y+=V0r;w2y+=o4r;var y2y=W4r;y2y+=H8G;var D2y=u8G;D2y+=g8G;var m2y=C6r;m2y+=m8G;m2y+=b8G;m2y+=d6r;var H2y=e6r;H2y+=I6r;H2y+=D0r;var c2y=o4r;c2y+=W4r;c2y+=Z1r;var K2y=e1r;K2y+=I8G;K2y+=g0r;var Q2y=o1r;Q2y+=D8G;var n2y=u8G;n2y+=g8G;var e2y=e1r;e2y+=y8G;var G2y=g6r;G2y+=w8G;G2y+=T8G;G2y+=V0r;var Y2y=e1r;Y2y+=S8G;var Y5y=C6r;Y5y+=m8G;Y5y+=S6r;var h5y=V8G;h5y+=Y6r;var F5y=G16.z0r;F5y+=O0r;F5y+=y0r;var i5y=C6r;i5y+=G6r;var l5y=L8G;l5y+=G16.z0r;l5y+=n1r;l5y+=O4r;var t9y=L8G;t9y+=O8G;var O9y=X8G;O9y+=V0r;O9y+=n1r;O9y+=O0r;var L9y=T6r;L9y+=S6r;var D9y=d4r;D9y+=s8G;var f9y=O0r;f9y+=t8G;f9y+=l9G;var r9y=e6r;r9y+=g0r;r9y+=F8G;r9y+=V0r;var K9y=O0r;K9y+=L6r;K9y+=Z9G;var o9y=H0r;o9y+=P9G;o9y+=G16.e0r;o9y+=m4r;var G9y=Z1r;G9y+=q9G;G9y+=v9G;var X8y=B9G;X8y+=i9G;X8y+=O1r;var r8y=a4r;r8y+=l4r;r8y+=z8G;var p8y=g6r;p8y+=W4r;p8y+=S6r;var A8y=a4r;A8y+=M9G;A8y+=G16.e0r;A8y+=l4r;var Q8y=T6r;Q8y+=Z8G;Q8y+=Q6r;var X6l=G16.Q0r;X6l+=D1r;X6l+=g0r;X6l+=F9G;var O6l=e6r;O6l+=d6r;var d6l=N9G;d6l+=h9G;var e6l=C6r;e6l+=l4r;e6l+=r6r;e6l+=D0r;var a4l=G16.Q0r;a4l+=b9G;a4l+=M9G;var R4l=T6r;R4l+=Z8G;R4l+=F8G;R4l+=V0r;var N4l=g6r;N4l+=B8G;var q3l=H0r;q3l+=y0r;q3l+=E9G;q3l+=m4r;var P3l=L8G;P3l+=u9G;P3l+=d1r;P3l+=y0r;var Z3l=x9G;Z3l+=y0r;Z3l+=V0r;var l3l=G16.Q0r;l3l+=n1r;l3l+=W9G;var t2l=a4r;t2l+=Y9G;t2l+=h8G;var s2l=U9G;s2l+=J9G;s2l+=o4r;s2l+=y0r;var X2l=C9G;X2l+=G9G;var O2l=e9G;O2l+=O0r;O2l+=d9G;var L2l=n9G;L2l+=n1r;L2l+=y0r;var V2l=Q9G;V2l+=T0r;V2l+=r1r;var S2l=y0r;S2l+=V0r;S2l+=g0r;S2l+=A9G;var T2l=e1r;T2l+=z9G;var n9l=u8G;n9l+=x8G;n9l+=D0r;var d9l=R9G;d9l+=V0r;d9l+=n1r;d9l+=O0r;var i8l=R9G;i8l+=V0r;i8l+=n1r;i8l+=O0r;var O6=k0r;O6+=O0r;O6+=B6r;O6+=m0r;var L6=o9G;L6+=K9G;var T6=p9G;T6+=M9G;var w6=L8G;w6+=o4r;'use strict';G16.Y0=function(W0){if(G16&&W0)return G16.a9(W0);};G16.E7=function(b7){if(G16&&b7)return G16.a9(b7);};(function(){var F5G=' day';var M5G="d98b";var i5G="log";var B5G="or trial info - ";var v5G="DataTables Edit";var Z5G="rema";var t9G='Editor - Trial expired';var s9G='Your trial has now expired. To purchase a license ';var X9G="3427";var O9G="Editor\n\n";var L9G="ou for trying DataTables ";var V9G="k y";var S9G="Than";var T9G="net/purchase";var w9G="for Editor, please see https://editor.datatables.";var y9G="9d52";var D9G="ca62";var I9G="cce5";var m9G="291a";var g9G="e152";var j9G="getT";var c9G="tTi";var f9G="9";var r9G="3";var G0r=3664835507;var C0r=1554422400;var U0r=6686;var Y0r=1000;var N0r=65;var H6=L8G;H6+=O0r;H6+=V0r;H6+=r9G;var k6=r9G;k6+=f9G;k6+=a4r;k6+=O0r;var j6=a9G;j6+=c9G;j6+=e1r;j6+=V0r;var c6=j9G;c6+=k9G;c6+=V0r;var a6=a4r;a6+=V0r;a6+=H9G;G16.Z6=function(l6){if(G16&&l6)return G16.f9(l6);};G16.Q4=function(n4){if(G16&&n4)return G16.a9(n4);};var remaining=Math[G16.H3(g9G)?G16.K0r:a6]((new Date((G16.E7(m9G)?G0r:C0r)*Y0r)[c6]()-new Date()[G16.I7(I9G)?j6:G16.K0r]())/((G16.Y0(k6)?Y0r:U0r)*(G16.S0(D9G)?N0r:F0r)*F0r*(G16.G1(y9G)?X7r:k7r)));if(remaining<=(G16.X1(H6)?a7r:g7r)){var m6=w9G;m6+=T9G;var g6=S9G;g6+=V9G;g6+=L9G;g6+=O9G;alert(g6+(G16.Q4(X9G)?G16.K0r:s9G)+m6);throw t9G;}else if(remaining<=m7r){var y6=l5G;y6+=Z5G;y6+=P5G;y6+=q5G;var D6=v5G;D6+=B5G;var I6=L8G;I6+=L8G;I6+=L8G;I6+=G16.Q0r;console[G16.Z6(I6)?G16.K0r:i5G](D6+remaining+(G16.K6(M5G)?F5G:G16.K0r)+(remaining===c7r?N5G:h5G)+y6);}}());var DataTable=$[w6][T6];if(!DataTable||!DataTable[b5G]||!DataTable[b5G](E5G)){var S6=u5G;S6+=x5G;throw S6;}var Editor=function(opts){var Y5G=" instance'";var W5G="DataTables Editor must be initialised as a 'new'";if(!(this instanceof Editor)){var V6=W5G;V6+=Y5G;alert(V6);}this[U5G](opts);};DataTable[L6]=Editor;$[J5G][C5G][O6]=Editor;var _editor_el=function(dis,ctx){var n5G="-dte-e";var d5G="*[data";var s6=G5G;s6+=e5G;var X6=d5G;X6+=n5G;X6+=Q5G;if(ctx===undefined){ctx=document;}return $(X6+dis+s6,ctx);};var __inlineCounter=a7r;var _pluck=function(a,prop){var out=[];$[A5G](a,function(idx,el){out[z5G](el[prop]);});return out;};var _api_file=function(name,id){var o5G=' in table ';var R5G='Unknown file id ';var t6=X8G;t6+=M9G;t6+=y0r;var table=this[t6](name);var file=table[id];if(!file){throw R5G+id+o5G+name;}return table[id];};var _api_files=function(name){var r5G="table name: ";var p5G="Unknown file ";if(!name){return Editor[K5G];}var table=Editor[K5G][name];if(!table){var l8l=p5G;l8l+=r5G;throw l8l+name;}return table;};var _objectKeys=function(o){var c5G="rty";var a5G="OwnPrope";var out=[];for(var key in o){var Z8l=f5G;Z8l+=y0r;Z8l+=a5G;Z8l+=c5G;if(o[Z8l](key)){var P8l=C6r;P8l+=d1r;P8l+=y0r;P8l+=c4r;out[P8l](key);}}return out;};var _deepCompare=function(o1,o2){var I5G="ject";var m5G="ob";var v8l=n1r;v8l+=V0r;v8l+=o4r;v8l+=j5G;var q8l=k5G;q8l+=j5G;if(typeof o1!==G16.r0r||typeof o2!==G16.r0r){return o1==o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[q8l]!==o2Props[H5G]){return g5G;}for(var i=a7r,ien=o1Props[v8l];i<ien;i++){var B8l=m5G;B8l+=I5G;var propName=o1Props[i];if(typeof o1[propName]===B8l){if(!_deepCompare(o1[propName],o2[propName])){return g5G;}}else if(o1[propName]!=o2[propName]){return g5G;}}return D5G;};Editor[i8l]=function(opts,classes,host){var M7G='field-processing';var i7G='multi-info';var B7G='msg-multi';var v7G='multi-value';var q7G='msg-label';var Z7G="none";var t3G='input-control';var V3G='"><span/></div>';var y3G='msg-message';var D3G="multiRestore";var I3G='<div data-dte-e="msg-multi" class="';var g3G="multiInfo";var H3G='<span data-dte-e="multi-info" class="';var j3G='<div data-dte-e="multi-value" class="';var c3G='<div data-dte-e="input-control" class="';var a3G='<div data-dte-e="input" class="';var p3G='<div data-dte-e="msg-label" class="';var R3G="className";var W3G="dataProp";var x3G='DTE_Field_';var N3G="Error adding field - unknown field type ";var v3G="aults";var P3G="pes";var Z3G="dTy";var X2G="oDa";var O2G="valT";var S2G="efi";var T2G="pePr";var w2G="ePrefix";var D2G="bel\" class=\"";var I2G="=\"la";var m2G="l data-dte-e";var g2G="<labe";var H2G="abe";var k2G="=";var j2G="\" fo";var c2G="-labe";var f2G="ntr";var r2G="inputC";var K2G="tit";var A2G="restor";var Q2G="g-error\" class=\"";var n2G="=\"ms";var d2G=" data-dte-e";var G2G="-err";var C2G="msg";var U2G="ssage\" class=\"";var Y2G="sg-";var W2G="<div data-dte-e=\"m";var u2G="\"msg-info\" class=";var E2G="data-dte-e=";var h2G="-inf";var N2G="sg";var B2G="dte-e=\"field-processing\" class=\"";var v2G="<div data-";var s5G="t-con";var L5G="msg-i";var V5G="msg-err";var w5G="msg-mes";var J9l=g0r;J9l+=m4r;J9l+=C6r;J9l+=V0r;var U9l=W4r;U9l+=o4r;var u9l=W4r;u9l+=o4r;var E9l=y5G;E9l+=e1r;var b9l=w5G;b9l+=T5G;b9l+=S5G;b9l+=V0r;var h9l=V5G;h9l+=W4r;h9l+=l4r;var N9l=L5G;N9l+=o4r;N9l+=L8G;N9l+=W4r;var F9l=n1r;F9l+=G16.e0r;F9l+=G16.Q0r;F9l+=O5G;var M9l=X5G;M9l+=s5G;M9l+=t5G;M9l+=l2G;var i9l=y5G;i9l+=e1r;var B9l=Q9G;B9l+=T0r;B9l+=r1r;var v9l=Z2G;v9l+=O0r;var q9l=y5G;q9l+=e1r;var l9l=P2G;l9l+=q2G;var t8l=v2G;t8l+=B2G;var s8l=i2G;s8l+=M2G;s8l+=F2G;var X8l=e1r;X8l+=N2G;X8l+=h2G;X8l+=W4r;var O8l=b2G;O8l+=E2G;O8l+=u2G;O8l+=G5G;var L8l=i2G;L8l+=x2G;var V8l=W2G;V8l+=Y2G;V8l+=h1r;V8l+=U2G;var S8l=J2G;S8l+=i2G;S8l+=M2G;S8l+=F2G;var T8l=C2G;T8l+=G2G;T8l+=m0r;var w8l=e2G;w8l+=d2G;w8l+=n2G;w8l+=Q2G;var y8l=A2G;y8l+=V0r;var D8l=G5G;D8l+=z2G;var I8l=R2G;I8l+=C6r;I8l+=G16.e0r;I8l+=o2G;var m8l=V8G;m8l+=F4r;var g8l=K2G;g8l+=M9G;var H8l=G5G;H8l+=z2G;var k8l=G5G;k8l+=p2G;var j8l=r2G;j8l+=W4r;j8l+=f2G;j8l+=l2G;var c8l=G5G;c8l+=z2G;var a8l=G16.z0r;a8l+=k1r;var f8l=P2G;f8l+=O0r;f8l+=a2G;f8l+=z2G;var r8l=G5G;r8l+=z2G;var p8l=C2G;p8l+=c2G;p8l+=n1r;var K8l=G5G;K8l+=z2G;var o8l=T5G;o8l+=L8G;o8l+=V0r;o8l+=F6r;var R8l=j2G;R8l+=l4r;R8l+=k2G;R8l+=G5G;var z8l=n1r;z8l+=H2G;z8l+=n1r;var A8l=g2G;A8l+=m2G;A8l+=I2G;A8l+=D2G;var Q8l=y2G;Q8l+=w2G;var n8l=I6r;n8l+=T2G;n8l+=S2G;n8l+=L0r;var d8l=V2G;d8l+=L2G;d8l+=Q5G;var e8l=O2G;e8l+=X2G;e8l+=g0r;e8l+=G16.e0r;var J8l=V0r;J8l+=L0r;J8l+=g0r;var x8l=R9G;x8l+=V0r;x8l+=r1r;var u8l=s2G;u8l+=t2G;var b8l=L8G;b8l+=l3G;b8l+=Z3G;b8l+=P3G;var h8l=q3G;h8l+=v3G;var N8l=R9G;N8l+=B3G;var F8l=e1r;F8l+=i3G;F8l+=g0r;F8l+=G16.z0r;var M8l=G16.z0r;M8l+=M3G;var that=this;var multiI18n=host[M8l][F8l];opts=$[F3G](D5G,{},Editor[N8l][h8l],opts);if(!Editor[b8l][opts[d6r]]){var E8l=I6r;E8l+=D0r;throw N3G+opts[E8l];}this[y0r]=$[u8l]({},Editor[x8l][h3G],{type:Editor[b3G][opts[d6r]],name:opts[E3G],classes:classes,host:host,opts:opts,multiValue:g5G});if(!opts[u3G]){var W8l=G16.z0r;W8l+=O0r;opts[W8l]=x3G+opts[E3G];}if(opts[W3G]){var Y8l=O0r;Y8l+=Y3G;opts[Y8l]=opts[W3G];}if(opts[U3G]===N5G){var U8l=J3G;U8l+=G16.e0r;opts[U8l]=opts[E3G];}var dtPrivateApi=DataTable[J8l][C3G];this[G3G]=function(d){var d3G="_fnGetObjectD";var G8l=e3G;G8l+=G16.z0r;G8l+=g0r;G8l+=m0r;var C8l=d3G;C8l+=n3G;return dtPrivateApi[C8l](opts[U3G])(d,G8l);};this[e8l]=dtPrivateApi[Q3G](opts[U3G]);var template=$(d8l+classes[A3G]+z3G+classes[n8l]+opts[d6r]+z3G+classes[Q8l]+opts[E3G]+z3G+opts[R3G]+o3G+A8l+classes[z8l]+R8l+Editor[o8l](opts[u3G])+K8l+opts[K3G]+p3G+classes[p8l]+r8l+opts[r3G]+f8l+f3G+a3G+classes[a8l]+c8l+c3G+classes[j8l]+k8l+j3G+classes[k3G]+H8l+multiI18n[g8l]+H3G+classes[g3G]+o3G+multiI18n[m8l]+I8l+m3G+I3G+classes[D3G]+D8l+multiI18n[y8l]+m3G+w8l+classes[T8l]+S8l+V8l+classes[y3G]+o3G+opts[w3G]+L8l+O8l+classes[X8l]+o3G+opts[T3G]+m3G+s8l+t8l+classes[S3G]+V3G+l9l);var input=this[L3G](O3G,opts);if(input!==X3G){var Z9l=C6r;Z9l+=o8G;Z9l+=C6r;Z9l+=s3G;_editor_el(t3G,template)[Z9l](input);}else{var P9l=a4r;P9l+=y0r;P9l+=y0r;template[P9l](l7G,Z7G);}this[q9l]=$[v9l](D5G,{},Editor[B9l][P7G][i9l],{container:template,inputControl:_editor_el(M9l,template),label:_editor_el(F9l,template),fieldInfo:_editor_el(N9l,template),labelInfo:_editor_el(q7G,template),fieldError:_editor_el(h9l,template),fieldMessage:_editor_el(b9l,template),multi:_editor_el(v7G,template),multiReturn:_editor_el(B7G,template),multiInfo:_editor_el(i7G,template),processing:_editor_el(M7G,template)});this[E9l][F7G][u9l](N7G,function(){var b7G="asCl";var h7G="typ";var W9l=h7G;W9l+=V0r;var x9l=c4r;x9l+=b7G;x9l+=E7G;if(that[y0r][u7G][x7G]&&!template[x9l](classes[W7G])&&opts[W9l]!==Y7G){var Y9l=U7G;Y9l+=J7G;that[Y9l](N5G);that[C7G]();}});this[G7G][e7G][U9l](N7G,function(){that[D3G]();});$[A5G](this[y0r][J9l],function(name,fn){var d7G="func";var C9l=d7G;C9l+=z1r;C9l+=G16.R0r;if(typeof fn===C9l&&that[name]===undefined){that[name]=function(){var e9l=n7G;e9l+=y0r;e9l+=Q7G;e9l+=A7G;var G9l=z7G;G9l+=n1r;var args=Array[R7G][o7G][G9l](arguments);args[e9l](name);var ret=that[L3G][K7G](that,args);return ret===undefined?that:ret;};}});};Editor[d9l][n9l]={def:function(set){var r7G="defau";var Q9l=W4r;Q9l+=C6r;Q9l+=p7G;var opts=this[y0r][Q9l];if(set===undefined){var z9l=r7G;z9l+=f7G;var A9l=q3G;A9l+=a7G;var def=opts[A9l]!==undefined?opts[z9l]:opts[q3G];return typeof def===c7G?def():def;}opts[q3G]=set;return this;},disable:function(){var j7G="isa";var K9l=O0r;K9l+=j7G;K9l+=k7G;var o9l=H7G;o9l+=G16.e0r;o9l+=g7G;o9l+=y0r;var R9l=O0r;R9l+=m7G;this[R9l][I7G][D7G](this[y0r][o9l][W7G]);this[L3G](K9l);return this;},displayed:function(){var S7G="contain";var T7G="ents";var a9l=O0r;a9l+=G16.z0r;a9l+=y0r;a9l+=y7G;var f9l=a4r;f9l+=w7G;var r9l=C6r;r9l+=f4r;r9l+=T7G;var p9l=S7G;p9l+=d4r;var container=this[G7G][p9l];return container[r9l](V7G)[H5G]&&container[f9l](a9l)!=L7G?D5G:g5G;},enable:function(){var Z0G="tain";var t7G="veClass";var H9l=O7G;H9l+=X7G;H9l+=V0r;var k9l=a4r;k9l+=s7G;var j9l=o8G;j9l+=e9G;j9l+=t7G;var c9l=l0G;c9l+=Z0G;c9l+=V0r;c9l+=l4r;this[G7G][c9l][j9l](this[y0r][k9l][W7G]);this[L3G](H9l);return this;},enabled:function(){var B0G="hasClas";var y9l=P0G;y9l+=q0G;y9l+=V0r;y9l+=O0r;var D9l=v0G;D9l+=y0r;var I9l=B0G;I9l+=y0r;var m9l=i0G;m9l+=M0G;var g9l=O0r;g9l+=W4r;g9l+=e1r;return this[g9l][m9l][I9l](this[y0r][D9l][y9l])===g5G;},error:function(msg,fn){var u0G='errorMessage';var h0G="rro";var F0G="ontainer";var L9l=w1r;L9l+=e1r;L9l+=y0r;L9l+=S5G;var w9l=v0G;w9l+=y0r;var classes=this[y0r][w9l];if(msg){var T9l=a4r;T9l+=F0G;this[G7G][T9l][D7G](classes[N0G]);}else{var V9l=V0r;V9l+=h0G;V9l+=l4r;var S9l=l0G;S9l+=b0G;this[G7G][S9l][E0G](classes[V9l]);}this[L3G](u0G,msg);return this[L9l](this[G7G][x0G],msg,fn);},fieldInfo:function(msg){var W0G="_ms";var X9l=y5G;X9l+=e1r;var O9l=W0G;O9l+=S5G;return this[O9l](this[X9l][T3G],msg);},isMultiValue:function(){var s9l=n1r;s9l+=Y0G;return this[y0r][k3G]&&this[y0r][U0G][s9l]!==c7r;},inError:function(){var G0G="aine";var l5l=J0G;l5l+=n1r;l5l+=G16.e0r;l5l+=w7G;var t9l=C0G;t9l+=G0G;t9l+=l4r;return this[G7G][t9l][l5l](this[y0r][e0G][N0G]);},input:function(){var Q0G="xtarea";var n0G="input, select, te";var d0G="ainer";var q5l=l0G;q5l+=g0r;q5l+=d0G;var P5l=n0G;P5l+=Q0G;var Z5l=g0r;Z5l+=m4r;Z5l+=C6r;Z5l+=V0r;return this[y0r][Z5l][A0G]?this[L3G](z0G):$(P5l,this[G7G][q5l]);},focus:function(){var c0G="lect, textarea";var a0G="ut, ";var o0G="_type";var v5l=L8G;v5l+=u9G;v5l+=d1r;v5l+=y0r;if(this[y0r][d6r][v5l]){var i5l=L8G;i5l+=W4r;i5l+=R0G;i5l+=y0r;var B5l=o0G;B5l+=K0G;this[B5l](i5l);}else{var h5l=L8G;h5l+=W4r;h5l+=p0G;var N5l=r0G;N5l+=H8G;N5l+=l4r;var F5l=O0r;F5l+=W4r;F5l+=e1r;var M5l=f0G;M5l+=a0G;M5l+=h8G;M5l+=c0G;$(M5l,this[F5l][N5l])[h5l]();}return this;},get:function(){var m0G='get';var H0G="Va";var k0G="isMulti";var E5l=j0G;E5l+=Q6r;E5l+=Q9G;E5l+=o4r;var b5l=k0G;b5l+=H0G;b5l+=g0G;if(this[b5l]()){return undefined;}var val=this[E5l](m0G);return val!==undefined?val:this[q3G]();},hide:function(animate){var y0G="taine";var D0G="eUp";var W5l=I0G;W5l+=u3G;W5l+=D0G;var x5l=H0r;x5l+=P9G;x5l+=G16.e0r;x5l+=m4r;var u5l=i0G;u5l+=o4r;u5l+=y0G;u5l+=l4r;var el=this[G7G][u5l];if(animate===undefined){animate=D5G;}if(this[y0r][w0G][x5l]()&&animate&&$[J5G][W5l]){el[T0G]();}else{var J5l=o4r;J5l+=W4r;J5l+=H8G;var U5l=H0r;U5l+=y0r;U5l+=E9G;U5l+=m4r;var Y5l=a4r;Y5l+=w7G;el[Y5l](U5l,J5l);}return this;},label:function(str){var e5l=G16.e0r;e5l+=S0G;e5l+=V0r;e5l+=b4r;var G5l=V0G;G5l+=e1r;G5l+=n1r;var C5l=O0r;C5l+=m7G;var label=this[C5l][K3G];var labelInfo=this[G7G][r3G][L0G]();if(str===undefined){return label[O0G]();}label[G5l](str);label[e5l](labelInfo);return this;},labelInfo:function(msg){var X0G="_msg";var d5l=O0r;d5l+=W4r;d5l+=e1r;return this[X0G](this[d5l][r3G],msg);},message:function(msg,fn){var s0G="fieldMessage";var n5l=w1r;n5l+=e1r;n5l+=y0r;n5l+=S5G;return this[n5l](this[G7G][s0G],msg,fn);},multiGet:function(id){var l1G="Value";var t0G="isMu";var Q5l=t0G;Q5l+=f7G;Q5l+=G16.z0r;Q5l+=l1G;var value;var multiValues=this[y0r][Z1G];var multiIds=this[y0r][U0G];var isMultiValue=this[Q5l]();if(id===undefined){var A5l=M9G;A5l+=P1G;var fieldVal=this[q1G]();value={};for(var i=a7r;i<multiIds[A5l];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else{var z5l=U7G;z5l+=G16.e0r;z5l+=n1r;value=this[z5l]();}return value;},multiRestore:function(){var B1G="eck";var v1G="_multiValueC";var R5l=v1G;R5l+=c4r;R5l+=B1G;this[y0r][k3G]=D5G;this[R5l]();},multiSet:function(id,val){var b1G="_multiValueCheck";var F1G="ltiValues";var M1G="tiIds";var K5l=i1G;K5l+=n1r;K5l+=M1G;var o5l=i1G;o5l+=F1G;var multiValues=this[y0r][o5l];var multiIds=this[y0r][K5l];if(val===undefined){val=id;id=undefined;}var set=function(idSrc,val){if($[N1G](multiIds)===-c7r){var p5l=C6r;p5l+=d1r;p5l+=y0r;p5l+=c4r;multiIds[p5l](idSrc);}multiValues[idSrc]=val;};if($[h1G](val)&&id===undefined){var r5l=V0r;r5l+=G16.e0r;r5l+=a4r;r5l+=c4r;$[r5l](val,function(idSrc,innerVal){set(idSrc,innerVal);});}else if(id===undefined){$[A5G](multiIds,function(i,idSrc){set(idSrc,val);});}else{set(id,val);}this[y0r][k3G]=D5G;this[b1G]();return this;},name:function(){return this[y0r][u7G][E3G];},node:function(){var E1G="ner";var f5l=r0G;f5l+=E1G;return this[G7G][f5l][a7r];},processing:function(set){var W1G="proce";var H5l=u1G;H5l+=o4r;H5l+=V0r;var k5l=G16.Q0r;k5l+=x1G;var j5l=C1r;j5l+=E9G;j5l+=m4r;var c5l=a4r;c5l+=y0r;c5l+=y0r;var a5l=W1G;a5l+=Y1G;this[G7G][a5l][c5l](j5l,set?k5l:H5l);return this;},set:function(val,multiCheck){var j1G="ValueCheck";var c1G="_mul";var C1G="opt";var J1G="ecode";var U1G="entityD";var V5l=y0r;V5l+=V0r;V5l+=g0r;var S5l=U1G;S5l+=J1G;var T5l=C1G;T5l+=y0r;var decodeFn=function(d){var f1G='\n';var r1G='\'';var K1G='"';var R1G='<';var z1G='>';var A1G="ri";var d1G="repl";var w5l=G1G;w5l+=e1G;w5l+=a4r;w5l+=V0r;var y5l=o8G;y5l+=C6r;y5l+=e1G;y5l+=U8G;var D5l=d1G;D5l+=n1G;var I5l=o8G;I5l+=Q1G;var m5l=l4r;m5l+=V0r;m5l+=E9G;m5l+=U8G;var g5l=A4r;g5l+=A1G;g5l+=q5G;return typeof d!==g5l?d:d[m5l](/&gt;/g,z1G)[I5l](/&lt;/g,R1G)[D5l](/&amp;/g,o1G)[y5l](/&quot;/g,K1G)[p1G](/&#39;/g,r1G)[w5l](/&#10;/g,f1G);};this[y0r][k3G]=g5G;var decode=this[y0r][T5l][S5l];if(decode===undefined||decode===D5G){if($[a1G](val)){for(var i=a7r,ien=val[H5G];i<ien;i++){val[i]=decodeFn(val[i]);}}else{val=decodeFn(val);}}this[L3G](V5l,val);if(multiCheck===undefined||multiCheck===D5G){var L5l=c1G;L5l+=z1r;L5l+=j1G;this[L5l]();}return this;},show:function(animate){var m1G="eDo";var g1G="slid";var H1G="ain";var k1G="eDown";var l2l=I0G;l2l+=u3G;l2l+=k1G;var t5l=O0r;t5l+=t8G;t5l+=e1G;t5l+=m4r;var s5l=j8G;s5l+=A4r;var X5l=C0G;X5l+=H1G;X5l+=V0r;X5l+=l4r;var O5l=O0r;O5l+=W4r;O5l+=e1r;var el=this[O5l][X5l];if(animate===undefined){animate=D5G;}if(this[y0r][s5l][t5l]()&&animate&&$[J5G][l2l]){var Z2l=g1G;Z2l+=m1G;Z2l+=M6r;Z2l+=o4r;el[Z2l]();}else{var P2l=a4r;P2l+=w7G;el[P2l](l7G,N5G);}return this;},val:function(val){var q2l=S5G;q2l+=V0r;q2l+=g0r;return val===undefined?this[q2l]():this[I1G](val);},compare:function(value,original){var D1G="compare";var compare=this[y0r][u7G][D1G]||_deepCompare;return compare(value,original);},dataSrc:function(){var v2l=J3G;v2l+=G16.e0r;return this[y0r][u7G][v2l];},destroy:function(){var w1G="ntain";var y1G="destr";var i2l=y1G;i2l+=v9G;var B2l=i0G;B2l+=w1G;B2l+=V0r;B2l+=l4r;this[G7G][B2l][T1G]();this[L3G](i2l);return this;},multiEditable:function(){var S1G="ltiEdit";var F2l=i1G;F2l+=S1G;F2l+=G1r;var M2l=V1G;M2l+=g0r;M2l+=y0r;return this[y0r][M2l][F2l];},multiIds:function(){var L1G="ultiId";var N2l=e1r;N2l+=L1G;N2l+=y0r;return this[y0r][N2l];},multiInfoShown:function(show){var s1G="multiI";var O1G="blo";var E2l=O1G;E2l+=X1G;var b2l=a4r;b2l+=y0r;b2l+=y0r;var h2l=s1G;h2l+=o6r;this[G7G][h2l][b2l]({display:show?E2l:L7G});},multiReset:function(){var t1G="iIds";var u2l=e1r;u2l+=i3G;u2l+=g0r;u2l+=t1G;this[y0r][u2l]=[];this[y0r][Z1G]={};},submittable:function(){return this[y0r][u7G][l4G];},valFromData:X3G,valToData:X3G,_errorNode:function(){return this[G7G][x0G];},_msg:function(el,msg,fn){var M4G="slideDown";var v4G="visible";var P4G="mate";var C2l=Z4G;C2l+=G16.z0r;C2l+=P4G;var J2l=L8G;J2l+=o4r;var U2l=q4G;U2l+=v4G;var x2l=L8G;x2l+=n7G;x2l+=B4G;x2l+=G16.R0r;if(msg===undefined){return el[O0G]();}if(typeof msg===x2l){var Y2l=g0r;Y2l+=G16.e0r;Y2l+=q0G;Y2l+=V0r;var W2l=K4r;W2l+=C6r;W2l+=G16.z0r;var editor=this[y0r][w0G];msg=msg(editor,new DataTable[W2l](editor[y0r][Y2l]));}if(el[i4G]()[L6r](U2l)&&$[J2l][C2l]){el[O0G](msg);if(msg){el[M4G](fn);}else{el[T0G](fn);}}else{var d2l=q0G;d2l+=u9G;d2l+=F4G;var e2l=a4r;e2l+=y0r;e2l+=y0r;var G2l=N4G;G2l+=n1r;el[G2l](msg||N5G)[e2l](l7G,msg?d2l:L7G);if(fn){fn();}}return this;},_multiValueCheck:function(){var K4G="toggleClass";var o4G="noMulti";var Q4G="inputControl";var e4G="ultiValues";var G4G="tiValue";var C4G="ultiVa";var J4G="isM";var x4G="iI";var E4G="NoEdit";var b4G="Info";var h4G="_mu";var m2l=h4G;m2l+=n1r;m2l+=z1r;m2l+=b4G;var g2l=F7G;g2l+=E4G;var H2l=u4G;H2l+=g7G;H2l+=y0r;var k2l=o1r;k2l+=x4G;k2l+=W4G;k2l+=W4r;var j2l=O0r;j2l+=W4r;j2l+=e1r;var c2l=Y4G;c2l+=U4G;c2l+=o4r;var a2l=G16.Q0r;a2l+=n1r;a2l+=W4r;a2l+=X1G;var f2l=O0r;f2l+=m7G;var R2l=J4G;R2l+=C4G;R2l+=g0G;var z2l=V1G;z2l+=g0r;z2l+=y0r;var A2l=A1r;A2l+=G4G;var Q2l=e1r;Q2l+=e4G;var n2l=e1r;n2l+=d4G;n2l+=x4G;n2l+=n4G;var last;var ids=this[y0r][n2l];var values=this[y0r][Q2l];var isMultiValue=this[y0r][A2l];var isMultiEditable=this[y0r][z2l][x7G];var val;var different=g5G;if(ids){for(var i=a7r;i<ids[H5G];i++){val=values[ids[i]];if(i>a7r&&!_deepCompare(val,last)){different=D5G;break;}last=val;}}if(different&&isMultiValue||!isMultiEditable&&this[R2l]()){var o2l=a4r;o2l+=y0r;o2l+=y0r;this[G7G][Q4G][o2l]({display:L7G});this[G7G][F7G][A4G]({display:z4G});}else{var r2l=a4r;r2l+=y0r;r2l+=y0r;var p2l=a4r;p2l+=y0r;p2l+=y0r;var K2l=O0r;K2l+=W4r;K2l+=e1r;this[K2l][Q4G][p2l]({display:z4G});this[G7G][F7G][r2l]({display:L7G});if(isMultiValue&&!different){this[I1G](last,g5G);}}this[f2l][e7G][A4G]({display:ids&&ids[H5G]>c7r&&different&&!isMultiValue?a2l:L7G});var i18n=this[y0r][w0G][c2l][F7G];this[j2l][k2l][O0G](isMultiEditable?i18n[R4G]:i18n[o4G]);this[G7G][F7G][K4G](this[y0r][H2l][g2l],!isMultiEditable);this[y0r][w0G][m2l]();return D5G;},_typeFn:function(name){var f4G="ice";var r4G="hif";var y2l=p4G;y2l+=r4G;y2l+=g0r;var D2l=y0r;D2l+=Q7G;D2l+=A7G;var I2l=y0r;I2l+=n1r;I2l+=f4G;var args=Array[R7G][I2l][a4G](arguments);args[D2l]();args[y2l](this[y0r][u7G]);var fn=this[y0r][d6r][name];if(fn){var w2l=c4r;w2l+=W4r;w2l+=A4r;return fn[K7G](this[y0r][w2l],args);}}};Editor[c4G][P7G]={};Editor[c4G][j4G]={"className":G16.K0r,"data":G16.K0r,"def":G16.K0r,"fieldInfo":G16.K0r,"id":G16.K0r,"label":G16.K0r,"labelInfo":G16.K0r,"name":X3G,"type":k4G,"message":G16.K0r,"multiEditable":D5G,"submit":D5G};Editor[c4G][T2l][S2l]={type:X3G,name:X3G,classes:X3G,opts:X3G,host:X3G};Editor[V2l][P7G][G7G]={container:X3G,label:X3G,labelInfo:X3G,fieldInfo:X3G,fieldError:X3G,fieldMessage:X3G};Editor[L2l]={};Editor[O2l][H4G]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[P7G][X2l]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[P7G][h3G]={"ajaxUrl":X3G,"ajax":X3G,"dataSource":X3G,"domTable":X3G,"opts":X3G,"displayController":X3G,"fields":{},"order":[],"id":-c7r,"displayed":g5G,"processing":g5G,"modifier":X3G,"action":X3G,"idSrc":X3G,"unique":a7r};Editor[P7G][g4G]={"label":X3G,"fn":X3G,"className":X3G};Editor[P7G][s2l]={onReturn:m4G,onBlur:t2l,onBackground:l3l,onComplete:I4G,onEsc:Z3l,onFieldError:P3l,submit:D4G,focus:a7r,buttons:D5G,title:D5G,message:D5G,drawType:g5G,scope:y4G};Editor[q3l]={};(function(){var Y98='<div class="DTED_Lightbox_Close"></div>';var W98='<div class="DTED_Lightbox_Background"><div/></div>';var x98='<div class="DTED_Lightbox_Content">';var u98='<div class="DTED_Lightbox_Content_Wrapper">';var E98='<div class="DTED DTED_Lightbox_Wrapper">';var G88="ent_Wrapper";var B88='DTED_Lightbox_Mobile';var P6G="lightbox";var t4G="ayController";var X4G="ightbox_Container\">";var O4G="_L";var L4G="TED";var V4G="<div class=\"D";var w4G="ispl";var s7r=25;var c7l=a4r;c7l+=W4r;c7l+=o4r;c7l+=L8G;var a7l=O0r;a7l+=w4G;a7l+=G16.e0r;a7l+=m4r;var f7l=i2G;f7l+=T4G;f7l+=H0r;f7l+=S4G;var r7l=i2G;r7l+=M2G;r7l+=F2G;var p7l=V4G;p7l+=L4G;p7l+=O4G;p7l+=X4G;var B3l=s4G;B3l+=t4G;var v3l=e1r;v3l+=l6G;v3l+=d9G;var self;Editor[Z6G][P6G]=$[F3G](D5G,{},Editor[v3l][B3l],{"init":function(dte){var q6G="nit";var i3l=w1r;i3l+=G16.z0r;i3l+=q6G;self[i3l]();return self;},"open":function(dte,append,callback){var W6G="_shown";var E6G="hown";var M6G="hild";var x3l=w1r;x3l+=O0r;x3l+=W4r;x3l+=e1r;var u3l=G16.e0r;u3l+=C6r;u3l+=v6G;var E3l=B6G;E3l+=i6G;var b3l=a4r;b3l+=M6G;b3l+=F6G;var h3l=l0G;h3l+=g0r;h3l+=N6G;var N3l=w1r;N3l+=O0r;N3l+=W4r;N3l+=e1r;var F3l=w1r;F3l+=O0r;F3l+=h6G;var M3l=b6G;M3l+=E6G;if(self[M3l]){if(callback){callback();}return;}self[F3l]=dte;var content=self[N3l][h3l];content[b3l]()[E3l]();content[u6G](append)[u3l](self[x3l][x6G]);self[W6G]=D5G;self[Y6G](callback);},"close":function(dte,callback){var e6G="wn";var J6G="own";var J3l=U6G;J3l+=J6G;var U3l=C6G;U3l+=u3G;U3l+=V0r;var Y3l=V6r;Y3l+=g0r;Y3l+=V0r;var W3l=w1r;W3l+=G6G;W3l+=W4r;W3l+=e6G;if(!self[W3l]){if(callback){callback();}return;}self[Y3l]=dte;self[U3l](callback);self[J3l]=g5G;},node:function(dte){var C3l=w1r;C3l+=y5G;C3l+=e1r;return self[C3l][A3G][a7r];},"_init":function(){var r6G='div.DTED_Lightbox_Content';var p6G="ady";var K6G="_re";var o6G="rap";var R6G="pac";var R3l=d6G;R3l+=n6G;var z3l=Q6G;z3l+=y0r;var A3l=G16.Q0r;A3l+=A6G;A3l+=z6G;A3l+=O0r;var Q3l=W4r;Q3l+=R6G;Q3l+=n6G;var n3l=M6r;n3l+=o6G;n3l+=C6r;n3l+=d4r;var d3l=i0G;d3l+=O1r;d3l+=N6G;var e3l=w1r;e3l+=y5G;e3l+=e1r;var G3l=K6G;G3l+=p6G;if(self[G3l]){return;}var dom=self[e3l];dom[d3l]=$(r6G,self[f6G][A3G]);dom[n3l][A4G](Q3l,a7r);dom[A3l][z3l](R3l,a7r);},"_show":function(callback){var p88='<div class="DTED_Lightbox_Shown"/>';var K88="not";var o88="hildren";var R88="x_Shown";var z88="div.DTED_Lightbo";var F88="offsetAni";var Z88="enta";var l88="ori";var s6G="ight";var T6G="_Lightbox_Content_Wrapper";var w6G="div.DTED";var I6G="ck.DTED_Lightbox";var g6G="DTED_L";var H6G="resize.";var k6G="_scr";var j6G="llT";var a6G="ientati";var t3l=m0r;t3l+=a6G;t3l+=G16.R0r;var s3l=y0r;s3l+=c6G;s3l+=j6G;s3l+=V1G;var X3l=G16.Q0r;X3l+=W4r;X3l+=O0r;X3l+=m4r;var O3l=k6G;O3l+=W4r;O3l+=j6G;O3l+=V1G;var L3l=H6G;L3l+=g6G;L3l+=N6r;L3l+=h6r;var T3l=m6G;T3l+=I6G;var w3l=G16.Q0r;w3l+=G16.z0r;w3l+=b4r;var y3l=D6G;y3l+=y6G;y3l+=d4r;var D3l=w6G;D3l+=T6G;var I3l=G16.Q0r;I3l+=S6G;var H3l=a4r;H3l+=V6G;var c3l=G16.Q0r;c3l+=L6G;var a3l=w1r;a3l+=O0r;a3l+=g0r;a3l+=V0r;var f3l=O6G;f3l+=S0G;f3l+=V0r;f3l+=l4r;var r3l=X6G;r3l+=s6G;var p3l=t6G;p3l+=o4r;p3l+=g0r;var o3l=l88;o3l+=Z88;o3l+=P88;var that=this;var dom=self[f6G];if(window[o3l]!==undefined){var K3l=q88;K3l+=O0r;K3l+=v88;K3l+=L2G;$(V7G)[K3l](B88);}dom[p3l][A4G](r3l,i88);dom[A3G][A4G]({top:-self[M88][F88]});$(V7G)[u6G](self[f6G][N88])[u6G](self[f6G][A3G]);self[h88]();self[b88][E88](dom[f3l],{opacity:c7r,top:a7r},callback);self[a3l][E88](dom[c3l],{opacity:c7r});setTimeout(function(){var x88="dent";var u88="text-in";var k3l=u88;k3l+=x88;var j3l=a4r;j3l+=w7G;$(W88)[j3l](k3l,-c7r);},D7r);dom[H3l][Y88](U88,function(e){var m3l=a4r;m3l+=Y9G;m3l+=y0r;m3l+=V0r;var g3l=V6r;g3l+=g0r;g3l+=V0r;self[g3l][m3l]();});dom[N88][I3l](U88,function(e){self[b88][N88]();});$(D3l,dom[y3l])[w3l](T3l,function(e){var C88="tbox_Cont";var J88="DTED_Lig";var S3l=J88;S3l+=c4r;S3l+=C88;S3l+=G88;if($(e[e88])[d88](S3l)){var V3l=n88;V3l+=Q88;self[b88][V3l]();}});$(window)[Y88](L3l,function(){self[h88]();});self[O3l]=$(X3l)[s3l]();if(window[t3l]!==undefined){var q7l=A88;q7l+=C6r;q7l+=O7G;q7l+=O0r;var P7l=z88;P7l+=R88;var Z7l=A88;Z7l+=C6r;Z7l+=V0r;Z7l+=b4r;var l7l=a4r;l7l+=o88;var kids=$(V7G)[l7l]()[K88](dom[N88])[K88](dom[A3G]);$(V7G)[Z7l](p88);$(P7l)[q7l](kids);}},"_heightCalc":function(){var H88="windowPadding";var k88="heig";var j88="iv.DTE_Header";var c88="terHeight";var r88="axHe";var h7l=e1r;h7l+=r88;h7l+=f88;h7l+=g0r;var N7l=D6G;N7l+=y6G;N7l+=V0r;N7l+=l4r;var F7l=a88;F7l+=c88;var M7l=O0r;M7l+=j88;var i7l=l0G;i7l+=L8G;var B7l=k88;B7l+=c4r;B7l+=g0r;var v7l=V6r;v7l+=m7G;var dom=self[v7l];var maxHeight=$(window)[B7l]()-self[i7l][H88]*j7r-$(M7l,dom[A3G])[F7l]()-$(W88,dom[A3G])[g88]();$(m88,dom[N7l])[A4G](h7l,maxHeight);},"_hide":function(callback){var b98='resize.DTED_Lightbox';var F98="_scrollTop";var i98="iv.DTED_Lightbox_Shown";var B98="hildr";var v98="dTo";var P98="ntation";var Z98="orie";var t88="removeCla";var O88="tAni";var V88="dt";var w88="nbind";var y88="Lightbox_Cont";var D88="div.DTED_";var I88="bin";var K7l=d1r;K7l+=o4r;K7l+=I88;K7l+=O0r;var o7l=D88;o7l+=y88;o7l+=G88;var R7l=d1r;R7l+=w88;var z7l=d1r;z7l+=o4r;z7l+=I88;z7l+=O0r;var Q7l=T88;Q7l+=S88;var n7l=w1r;n7l+=V88;n7l+=V0r;var d7l=L88;d7l+=O88;var e7l=a4r;e7l+=W4r;e7l+=o4r;e7l+=L8G;var G7l=O6G;G7l+=C6r;G7l+=X88;var C7l=w1r;C7l+=s88;var J7l=t88;J7l+=w7G;var U7l=l98;U7l+=O0r;U7l+=m4r;var b7l=Z98;b7l+=P98;var dom=self[f6G];if(!callback){callback=function(){};}if(window[b7l]!==undefined){var Y7l=o8G;Y7l+=e1r;Y7l+=q98;var W7l=l98;W7l+=O0r;W7l+=m4r;var x7l=y6G;x7l+=O7G;x7l+=v98;var u7l=a4r;u7l+=B98;u7l+=O7G;var E7l=O0r;E7l+=i98;var show=$(E7l);show[u7l]()[x7l](W7l);show[Y7l]();}$(U7l)[J7l](B88)[M98](self[F98]);self[b88][C7l](dom[G7l],{opacity:a7r,top:self[e7l][d7l]},function(){$(this)[L0G]();callback();});self[n7l][E88](dom[Q7l],{opacity:a7r},function(){var N98="etac";var A7l=O0r;A7l+=N98;A7l+=c4r;$(this)[A7l]();});dom[x6G][z7l](U88);dom[N88][R7l](U88);$(o7l,dom[A3G])[h98](U88);$(window)[K7l](b98);},"_dte":X3G,"_ready":g5G,"_shown":g5G,"_dom":{"wrapper":$(E98+p7l+u98+x98+r7l+m3G+f7l+m3G),"background":$(W98),"close":$(Y98),"content":X3G}});self=Editor[a7l][P6G];self[c7l]={"offsetAni":s7r,"windowPadding":s7r};}());(function(){var Q28='<div class="DTED_Envelope_Close">&times;</div>';var R58="wind";var z58='normal';var M58="apper";var P58="pper";var O98="body";var w98="bac";var j98="yl";var a98="appendChild";var f98="content";var R98="elo";var z98="env";var A98=" DTED_Envelope_Wrapper\">";var Q98="<div class=\"DTED";var n98="hadow\"></div>";var d98="<div class=\"DTED_Envelope_S";var e98="<div class=\"DTED_Envelope_Container\"></di";var C98="Envelope_Background\"><div/></div>";var J98="<div class=\"DTED_";var U98="elop";var W0r=600;var i0r=50;var F4l=O7G;F4l+=U7G;F4l+=U98;F4l+=V0r;var M4l=J98;M4l+=C98;var i4l=G98;i4l+=z2G;var B4l=e98;B4l+=S4G;var v4l=d98;v4l+=n98;var q4l=Q98;q4l+=A98;var k7l=z98;k7l+=R98;k7l+=C6r;k7l+=V0r;var j7l=O0r;j7l+=o98;j7l+=m4r;var self;Editor[j7l][k7l]=$[F3G](D5G,{},Editor[P7G][H4G],{"init":function(dte){var K98="_init";self[b88]=dte;self[K98]();return self;},"open":function(dte,append,callback){var w7l=U6G;w7l+=W4r;w7l+=M6r;var y7l=p98;y7l+=V0r;var D7l=w1r;D7l+=O0r;D7l+=W4r;D7l+=e1r;var I7l=a4r;I7l+=W4r;I7l+=O1r;I7l+=N6G;var m7l=V6r;m7l+=m7G;var g7l=O0r;g7l+=V0r;g7l+=g0r;g7l+=i6G;var H7l=r98;H7l+=F6G;self[b88]=dte;$(self[f6G][f98])[H7l]()[g7l]();self[m7l][f98][a98](append);self[f6G][I7l][a98](self[D7l][y7l]);self[w7l](callback);},"close":function(dte,callback){var c98="hid";var T7l=w1r;T7l+=c98;T7l+=V0r;self[b88]=dte;self[T7l](callback);},node:function(dte){return self[f6G][A3G][a7r];},"_init":function(){var Z58='visible';var l58='opacity';var t98="_cssBackgroundOpacity";var s98="visbility";var L98="ready";var V98="ope_Container";var S98="div.DTED_Envel";var T98="kgr";var y98="ild";var D98="appendCh";var I98="rappe";var m98="und";var H98="yle";var k98="kground";var u0l=A4r;u0l+=j98;u0l+=V0r;var E0l=T88;E0l+=a4r;E0l+=k98;var b0l=o4r;b0l+=W4r;b0l+=o4r;b0l+=V0r;var h0l=C1r;h0l+=y7G;var N0l=A4r;N0l+=H98;var F0l=G16.Q0r;F0l+=G16.e0r;F0l+=S88;var M0l=V6r;M0l+=m7G;var i0l=A4r;i0l+=m4r;i0l+=M9G;var B0l=G16.Q0r;B0l+=L6G;var v0l=w1r;v0l+=O0r;v0l+=m7G;var q0l=c4r;q0l+=G16.z0r;q0l+=g98;q0l+=O7G;var P0l=G16.Q0r;P0l+=A6G;P0l+=W4r;P0l+=m98;var Z0l=w1r;Z0l+=y5G;Z0l+=e1r;var l0l=M6r;l0l+=I98;l0l+=l4r;var t7l=D98;t7l+=y98;var s7l=w98;s7l+=T98;s7l+=z6G;s7l+=O0r;var X7l=V6r;X7l+=W4r;X7l+=e1r;var O7l=w1r;O7l+=O0r;O7l+=m7G;var L7l=S98;L7l+=V98;var V7l=C0G;V7l+=V0r;V7l+=O1r;var S7l=w1r;S7l+=L98;if(self[S7l]){return;}self[f6G][V7l]=$(L7l,self[O7l][A3G])[a7r];document[O98][a98](self[X7l][s7l]);document[O98][t7l](self[f6G][l0l]);self[Z0l][P0l][X98][s98]=q0l;self[v0l][B0l][i0l][Z6G]=z4G;self[t98]=$(self[f6G][N88])[A4G](l58);self[M0l][F0l][N0l][h0l]=b0l;self[f6G][E0l][u0l][s98]=Z58;},"_show":function(callback){var m58='resize.DTED_Envelope';var a58='click.DTED_Envelope';var p58="html,";var K58="Padding";var A58="offsetHeight";var d58="px";var G58="_findAttachRow";var C58="eig";var J58="ci";var U58="tyle";var Y58="ef";var W58="marginL";var x58="nte";var E58="backgrou";var h58="oundOpacity";var N58="gr";var F58="_cssBack";var B58="ndowScroll";var v58="wi";var q58="div.DTED_Lightbox_Content_Wrapp";var u1l=G16.Q0r;u1l+=G16.z0r;u1l+=o4r;u1l+=O0r;var N1l=O6G;N1l+=P58;var F1l=w1r;F1l+=O0r;F1l+=W4r;F1l+=e1r;var M1l=q58;M1l+=d4r;var v1l=V6r;v1l+=m7G;var P1l=w1r;P1l+=y5G;P1l+=e1r;var S0l=v58;S0l+=B58;var T0l=L8G;T0l+=G16.e0r;T0l+=Z1r;T0l+=i58;var w0l=D6G;w0l+=M58;var y0l=F58;y0l+=N58;y0l+=h58;var D0l=Z4G;D0l+=k9G;D0l+=b58;D0l+=V0r;var I0l=E58;I0l+=b4r;var m0l=w1r;m0l+=O0r;m0l+=m7G;var g0l=G16.Q0r;g0l+=x1G;var H0l=O0r;H0l+=L6r;H0l+=C6r;H0l+=u58;var k0l=y0r;k0l+=g0r;k0l+=m4r;k0l+=M9G;var j0l=G16.Q0r;j0l+=A6G;j0l+=Q88;var c0l=w1r;c0l+=O0r;c0l+=W4r;c0l+=e1r;var a0l=d6G;a0l+=G16.z0r;a0l+=I6r;var f0l=G16.Q0r;f0l+=A6G;f0l+=a88;f0l+=b4r;var r0l=w1r;r0l+=y5G;r0l+=e1r;var p0l=y0r;p0l+=g0r;p0l+=m4r;p0l+=M9G;var K0l=i0G;K0l+=x58;K0l+=O1r;var o0l=y0r;o0l+=g0r;o0l+=j98;o0l+=V0r;var R0l=C6r;R0l+=L0r;var z0l=W58;z0l+=Y58;z0l+=g0r;var A0l=y0r;A0l+=I6r;A0l+=M9G;var Q0l=v58;Q0l+=O0r;Q0l+=g0r;Q0l+=c4r;var n0l=y0r;n0l+=U58;var d0l=O6G;d0l+=C6r;d0l+=X88;var e0l=V1G;e0l+=j6r;e0l+=n6G;var G0l=o4r;G0l+=W4r;G0l+=o4r;G0l+=V0r;var C0l=O0r;C0l+=L6r;C0l+=y7G;var J0l=V1G;J0l+=G16.e0r;J0l+=J58;J0l+=I6r;var U0l=M6r;U0l+=l4r;U0l+=G16.e0r;U0l+=P58;var Y0l=w1r;Y0l+=G7G;var W0l=c4r;W0l+=C58;W0l+=V0G;var x0l=y0r;x0l+=U58;var that=this;var formHeight;if(!callback){callback=function(){};}self[f6G][f98][x0l][W0l]=i88;var style=self[Y0l][U0l][X98];style[J0l]=a7r;style[C0l]=z4G;var targetRow=self[G58]();var height=self[h88]();var width=targetRow[e58];style[Z6G]=G0l;style[e0l]=c7r;self[f6G][d0l][n0l][Q0l]=width+d58;self[f6G][A3G][A0l][z0l]=-(width/j7r)+R0l;self[f6G][A3G][o0l][n58]=$(targetRow)[Q58]()[n58]+targetRow[A58]+d58;self[f6G][K0l][p0l][n58]=-c7r*height-L7r+d58;self[r0l][f0l][X98][a0l]=a7r;self[c0l][j0l][k0l][H0l]=g0l;$(self[m0l][I0l])[D0l]({'opacity':self[y0l]},z58);$(self[f6G][w0l])[T0l]();if(self[M88][S0l]){var X0l=R58;X0l+=o58;X0l+=K58;var O0l=a4r;O0l+=W4r;O0l+=o4r;O0l+=L8G;var L0l=b8G;L0l+=C6r;var V0l=p58;V0l+=O98;$(V0l)[s88]({"scrollTop":$(targetRow)[Q58]()[L0l]+targetRow[A58]-self[O0l][X0l]},function(){var r58="ani";var t0l=r58;t0l+=e1r;t0l+=q6r;var s0l=C0G;s0l+=O7G;s0l+=g0r;$(self[f6G][s0l])[t0l]({"top":a7r},W0r,callback);});}else{var Z1l=G16.e0r;Z1l+=f58;var l1l=w1r;l1l+=O0r;l1l+=W4r;l1l+=e1r;$(self[l1l][f98])[Z1l]({"top":a7r},W0r,callback);}$(self[P1l][x6G])[Y88](a58,function(e){var q1l=V6r;q1l+=h6G;self[q1l][x6G]();});$(self[v1l][N88])[Y88](a58,function(e){var i1l=w98;i1l+=F4G;i1l+=S5G;i1l+=u1r;var B1l=w1r;B1l+=O0r;B1l+=g0r;B1l+=V0r;self[B1l][i1l]();});$(M1l,self[F1l][N1l])[Y88](a58,function(e){var g58='DTED_Envelope_Content_Wrapper';var H58="rget";var b1l=c4r;b1l+=c58;b1l+=j58;b1l+=y0r;var h1l=k58;h1l+=H58;if($(e[h1l])[b1l](g58)){var E1l=V6r;E1l+=h6G;self[E1l][N88]();}});$(window)[u1l](m58,function(){self[h88]();});},"_heightCalc":function(){var B28="heightCalc";var v28="heightCal";var q28="dren";var Z28="gh";var l28="ei";var t58="owPadding";var s58="_Header";var O58="wrap";var L58="_Content";var V58="DTE_Body";var y58="eight";var D58="maxH";var I58="uterHeight";var K1l=W4r;K1l+=I58;var o1l=O0r;o1l+=m7G;var R1l=D58;R1l+=y58;var z1l=M6r;z1l+=w58;z1l+=P58;var A1l=w1r;A1l+=O0r;A1l+=W4r;A1l+=e1r;var Q1l=T58;Q1l+=S58;Q1l+=V58;Q1l+=L58;var n1l=D6G;n1l+=y6G;n1l+=V0r;n1l+=l4r;var d1l=V6r;d1l+=m7G;var e1l=O58;e1l+=C6r;e1l+=d4r;var G1l=X58;G1l+=s58;var C1l=R58;C1l+=t58;var J1l=a4r;J1l+=W4r;J1l+=o4r;J1l+=L8G;var U1l=c4r;U1l+=l28;U1l+=Z28;U1l+=g0r;var Y1l=X6G;Y1l+=f88;Y1l+=g0r;var W1l=P28;W1l+=H9G;W1l+=q28;var x1l=v28;x1l+=a4r;var formHeight;formHeight=self[M88][B28]?self[M88][x1l](self[f6G][A3G]):$(self[f6G][f98])[W1l]()[Y1l]();var maxHeight=$(window)[U1l]()-self[J1l][C1l]*j7r-$(G1l,self[f6G][e1l])[g88]()-$(W88,self[d1l][n1l])[g88]();$(Q1l,self[A1l][z1l])[A4G](R1l,maxHeight);return $(self[b88][o1l][A3G])[K1l]();},"_hide":function(callback){var h28="offsetHeigh";var N28="DTED_Lightbox_Content_Wra";var F28="ightbox";var M28=".DTED_L";var i28="esize";var D1l=l4r;D1l+=i28;D1l+=M28;D1l+=F28;var I1l=D6G;I1l+=M58;var m1l=w1r;m1l+=O0r;m1l+=W4r;m1l+=e1r;var g1l=T58;g1l+=S58;g1l+=N28;g1l+=P58;var H1l=n7G;H1l+=G16.Q0r;H1l+=S6G;var k1l=a4r;k1l+=Y9G;k1l+=y0r;k1l+=V0r;var j1l=w1r;j1l+=O0r;j1l+=W4r;j1l+=e1r;var a1l=h28;a1l+=g0r;var f1l=a4r;f1l+=W4r;f1l+=O1r;f1l+=N6G;var r1l=w1r;r1l+=G7G;var p1l=V6r;p1l+=W4r;p1l+=e1r;if(!callback){callback=function(){};}$(self[p1l][f98])[s88]({"top":-(self[r1l][f1l][a1l]+i0r)},W0r,function(){var b28="fadeOut";var c1l=n88;c1l+=z6G;c1l+=O0r;$([self[f6G][A3G],self[f6G][c1l]])[b28](z58,callback);});$(self[j1l][k1l])[H1l](U88);$(self[f6G][N88])[h98](U88);$(g1l,self[m1l][I1l])[h98](U88);$(window)[h98](D1l);},"_findAttachRow":function(){var C28="eade";var t1l=E28;t1l+=u28;t1l+=h6G;var s1l=x28;s1l+=W28;var X1l=w1r;X1l+=Y28;var L1l=c4r;L1l+=V0r;L1l+=G16.e0r;L1l+=O0r;var V1l=a4r;V1l+=W4r;V1l+=o4r;V1l+=L8G;var S1l=g0r;S1l+=G16.e0r;S1l+=G16.Q0r;S1l+=M9G;var T1l=w1r;T1l+=O0r;T1l+=g0r;T1l+=V0r;var w1l=K4r;w1l+=C6r;w1l+=G16.z0r;var y1l=L8G;y1l+=o4r;var dt=new $[y1l][U28][w1l](self[T1l][y0r][S1l]);if(self[V1l][J28]===L1l){var O1l=c4r;O1l+=C28;O1l+=l4r;return dt[G28]()[O1l]();}else if(self[X1l][y0r][s1l]===t1l){var l4l=e28;l4l+=Z1r;l4l+=l4r;return dt[G28]()[l4l]();}else{var P4l=o4r;P4l+=W4r;P4l+=O0r;P4l+=V0r;var Z4l=V6r;Z4l+=h6G;return dt[d28](self[Z4l][y0r][n28])[P4l]();}},"_dte":X3G,"_ready":g5G,"_cssBackgroundOpacity":c7r,"_dom":{"wrapper":$(q4l+v4l+B4l+i4l)[a7r],"background":$(M4l)[a7r],"close":$(Q28)[a7r],"content":X3G}});self=Editor[Z6G][F4l];self[M88]={"windowPadding":i0r,"heightCalc":X3G,"attach":d28,"windowScroll":D5G};}());Editor[N4l][A28]=function(cfg,after){var L28="shif";var H28=" adding field '";var k28="dy exists with this name";var j28="'. A field alre";var c28="Error adding field. The field requires a `name` option";var f28="tFie";var r28="ever";var R28="ayReo";var z28="_displ";var z4l=z28;z4l+=R28;z4l+=l4r;z4l+=o28;if($[a1G](cfg)){var b4l=K28;b4l+=p28;if(after!==undefined){var h4l=l4r;h4l+=r28;h4l+=h8G;cfg[h4l]();}for(var i=a7r;i<cfg[b4l];i++){var E4l=G16.e0r;E4l+=O0r;E4l+=O0r;this[E4l](cfg[i],after);}}else{var C4l=e1r;C4l+=W4r;C4l+=O0r;C4l+=V0r;var J4l=L8G;J4l+=m1r;var U4l=H7G;U4l+=E7G;U4l+=V0r;U4l+=y0r;var Y4l=P5G;Y4l+=f28;Y4l+=n1r;Y4l+=O0r;var u4l=L8G;u4l+=a28;var name=cfg[E3G];if(name===undefined){throw c28;}if(this[y0r][u4l][name]){var W4l=j28;W4l+=G16.e0r;W4l+=k28;var x4l=Y6r;x4l+=H28;throw x4l+name+W4l;}this[g28](Y4l,cfg);var field=new Editor[c4G](cfg,this[U4l][J4l],this);if(this[y0r][C4l]){var editFields=this[y0r][m28];field[I28]();$[A5G](editFields,function(idSrc,edit){var y28="lFro";var D28="multiSe";var e4l=D28;e4l+=g0r;var val;if(edit[U3G]){var G4l=U7G;G4l+=G16.e0r;G4l+=y28;G4l+=w28;val=field[G4l](edit[U3G]);}field[e4l](idSrc,val!==undefined?val:field[q3G]());});}this[y0r][T28][name]=field;if(after===undefined){var d4l=S28;d4l+=G6G;this[y0r][V28][d4l](name);}else if(after===X3G){var n4l=n7G;n4l+=L28;n4l+=g0r;this[y0r][V28][n4l](name);}else{var A4l=y0r;A4l+=C6r;A4l+=O28;A4l+=V0r;var Q4l=X28;Q4l+=d4r;var idx=$[N1G](after,this[y0r][Q4l]);this[y0r][V28][A4l](idx+c7r,a7r,name);}}this[z4l](this[V28]());return this;};Editor[R4l][s28]=function(newAjax){if(newAjax){this[y0r][s28]=newAjax;return this;}return this[y0r][s28];};Editor[R7G][N88]=function(){var l38="editOp";var t28="onBackgrou";var K4l=t28;K4l+=b4r;var o4l=l38;o4l+=g0r;o4l+=y0r;var onBackground=this[y0r][o4l][K4l];if(typeof onBackground===c7G){onBackground(this);}else if(onBackground===Z38){var p4l=G16.Q0r;p4l+=n1r;p4l+=d1r;p4l+=l4r;this[p4l]();}else if(onBackground===I4G){this[x6G]();}else if(onBackground===m4G){var r4l=P38;r4l+=q38;this[r4l]();}return this;};Editor[R7G][E8G]=function(){var v38="_b";var f4l=v38;f4l+=B38;f4l+=l4r;this[f4l]();return this;};Editor[R7G][a4l]=function(cells,fieldNames,show,opts){var x38="isPlainO";var b38="Optio";var I4l=w1r;I4l+=i38;var m4l=M38;m4l+=G16.e0r;m4l+=F38;var g4l=G16.Q0r;g4l+=N38;var H4l=h38;H4l+=b38;H4l+=E38;var k4l=V0r;k4l+=u38;k4l+=O0r;var j4l=x38;j4l+=W38;var c4l=j0G;c4l+=G16.z0r;c4l+=O0r;c4l+=m4r;var that=this;if(this[c4l](function(){that[N9G](cells,fieldNames,opts);})){return this;}if($[j4l](fieldNames)){opts=fieldNames;fieldNames=undefined;show=D5G;}else if(typeof fieldNames===Y38){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[h1G](show)){opts=show;show=D5G;}if(show===undefined){show=D5G;}opts=$[k4l]({},this[y0r][H4l][g4l],opts);var editFields=this[m4l](U38,cells,fieldNames);this[I4l](cells,editFields,J38,opts,function(){var i78="_closeReg";var q78="prepen";var Z78="epend";var l78="prepend";var t38="formError";var L38='<div class="DTE_Processing_Indicator"><span></div>';var S38='"><div/></div>';var T38="bg";var y38='attach';var D38="concat";var I38="bubbleNodes";var m38="bubblePosition";var k38="ze.";var j38="si";var r38="v c";var K38="rapper";var o38="<div class=";var A38="poin";var n38="essa";var G38="stopen";var C38="_po";var G6l=C38;G6l+=G38;var C6l=H7G;C6l+=G16.z0r;C6l+=X1G;var x6l=e38;x6l+=y1r;var b6l=g0r;b6l+=d38;b6l+=V0r;var F6l=e1r;F6l+=n38;F6l+=a9G;var M6l=P28;M6l+=Q38;var v6l=A38;v6l+=V1r;var q6l=V2G;q6l+=n1r;q6l+=z38;var P6l=i2G;P6l+=x2G;var Z6l=i2G;Z6l+=R38;Z6l+=S4G;var l6l=x9G;l6l+=h8G;var t4l=G5G;t4l+=z2G;var s4l=o38;s4l+=G5G;var X4l=n1r;X4l+=G16.z0r;X4l+=H8G;X4l+=l4r;var O4l=o38;O4l+=G5G;var L4l=G5G;L4l+=z2G;var V4l=M6r;V4l+=K38;var S4l=p38;S4l+=r38;S4l+=f38;S4l+=a38;var T4l=G16.Q0r;T4l+=N38;var w4l=u4G;w4l+=c38;var y4l=l4r;y4l+=V0r;y4l+=j38;y4l+=k38;var D4l=W4r;D4l+=o4r;var namespace=that[H38](opts);var ret=that[g38](J38);if(!ret){return that;}$(window)[D4l](y4l+namespace,function(){that[m38]();});var nodes=[];that[y0r][I38]=nodes[D38][K7G](nodes,_pluck(editFields,y38));var classes=that[w4l][T4l];var background=$(w38+classes[T38]+S38);var container=$(S4l+classes[V4l]+L4l+O4l+classes[X4l]+o3G+s4l+classes[G28]+t4l+w38+classes[l6l]+V38+L38+Z6l+P6l+q6l+classes[v6l]+V38+m3G);if(show){var i6l=G16.Q0r;i6l+=l6G;i6l+=m4r;var B6l=G16.Q0r;B6l+=s1r;container[O38](B6l);background[O38](i6l);}var liner=container[X38]()[s38](a7r);var table=liner[M6l]();var close=table[X38]();liner[u6G](that[G7G][t38]);table[l78](that[G7G][h38]);if(opts[F6l]){var h6l=O0r;h6l+=W4r;h6l+=e1r;var N6l=C6r;N6l+=l4r;N6l+=Z78;liner[N6l](that[h6l][P78]);}if(opts[b6l]){var u6l=O0r;u6l+=W4r;u6l+=e1r;var E6l=q78;E6l+=O0r;liner[E6l](that[u6l][v78]);}if(opts[x6l]){var W6l=G16.Q0r;W6l+=B78;W6l+=o4r;W6l+=y0r;table[u6G](that[G7G][W6l]);}var pair=$()[A28](container)[A28](background);that[i78](function(submitComplete){that[E88](pair,{opacity:a7r},function(){var N78="size";var F78="micInfo";var M78="_clearDyna";var J6l=M78;J6l+=F78;var U6l=l4r;U6l+=V0r;U6l+=N78;U6l+=S58;var Y6l=O0r;Y6l+=h78;Y6l+=i6G;pair[Y6l]();$(window)[b78](U6l+namespace);that[J6l]();});});background[E78](function(){that[E8G]();});close[C6l](function(){that[u78]();});that[m38]();that[E88](pair,{opacity:c7r});that[x78](that[y0r][W78],opts[C7G]);that[G6l](J38);});return this;};Editor[e6l][d6l]=function(){var j78="lef";var c78="bel";var f78="low";var r78="be";var K78="outerWidth";var o78="bottom";var R78="left";var z78="right";var G78='div.DTE_Bubble';var C78="Line";var J78="div.DTE_Bubble_";var U78="bbleNodes";var V7r=15;var m6l=K28;m6l+=g0r;m6l+=c4r;var g6l=a4r;g6l+=w7G;var H6l=u4G;H6l+=y0r;H6l+=y0r;H6l+=O4r;var k6l=b8G;k6l+=C6r;var j6l=M9G;j6l+=P1G;var c6l=M9G;c6l+=o4r;c6l+=S5G;c6l+=p28;var a6l=n1r;a6l+=V0r;a6l+=L8G;a6l+=g0r;var Q6l=Y78;Q6l+=U78;var n6l=J78;n6l+=C78;n6l+=l4r;var wrapper=$(G78),liner=$(n6l),nodes=this[y0r][Q6l];var position={top:a7r,left:a7r,right:a7r,bottom:a7r};$[A5G](nodes,function(i,node){var Q78="ffs";var e78="tHe";var f6l=L88;f6l+=e78;f6l+=f88;f6l+=g0r;var r6l=g0r;r6l+=W4r;r6l+=C6r;var p6l=G16.Q0r;p6l+=W4r;p6l+=d78;p6l+=m7G;var K6l=M9G;K6l+=L8G;K6l+=g0r;var o6l=n1r;o6l+=n78;var R6l=b8G;R6l+=C6r;var z6l=g0r;z6l+=V1G;var A6l=W4r;A6l+=Q78;A6l+=V0r;A6l+=g0r;var pos=$(node)[A6l]();node=$(node)[A78](a7r);position[z6l]+=pos[R6l];position[o6l]+=pos[K6l];position[z78]+=pos[R78]+node[e58];position[p6l]+=pos[r6l]+node[f6l];});position[n58]/=nodes[H5G];position[a6l]/=nodes[c6l];position[z78]/=nodes[H5G];position[o78]/=nodes[j6l];var top=position[k6l],left=(position[R78]+position[z78])/j7r,width=liner[K78](),visLeft=left-width/j7r,visRight=visLeft+width,docWidth=$(window)[p78](),padding=V7r,classes=this[H6l][N9G];wrapper[g6l]({top:top,left:left});if(liner[m6l]&&liner[Q58]()[n58]<a7r){var y6l=r78;y6l+=f78;var D6l=G16.Q0r;D6l+=W4r;D6l+=a78;D6l+=e1r;var I6l=g0r;I6l+=W4r;I6l+=C6r;wrapper[A4G](I6l,position[D6l])[D7G](y6l);}else{var w6l=c78;w6l+=W4r;w6l+=M6r;wrapper[E0G](w6l);}if(visRight+padding>docWidth){var S6l=j78;S6l+=g0r;var T6l=Q6G;T6l+=y0r;var diff=visRight-docWidth;liner[T6l](S6l,visLeft<padding?-(visLeft-padding):-(diff+padding));}else{var L6l=n1r;L6l+=V0r;L6l+=A7G;var V6l=a4r;V6l+=w7G;liner[V6l](L6l,visLeft<padding?-(visLeft-padding):a7r);}return this;};Editor[O6l][X6l]=function(buttons){var k78="empt";var v8y=V0r;v8y+=G16.e0r;v8y+=a4r;v8y+=c4r;var q8y=k78;q8y+=m4r;var P8y=O0r;P8y+=W4r;P8y+=e1r;var Z8y=H78;Z8y+=g78;var s6l=w1r;s6l+=G16.Q0r;s6l+=c58;s6l+=P4r;var that=this;if(buttons===s6l){var l8y=P38;l8y+=q38;var t6l=G16.e0r;t6l+=a4r;t6l+=z1r;t6l+=G16.R0r;buttons=[{text:this[m78][this[y0r][t6l]][l8y],action:function(){this[l4G]();}}];}else if(!$[Z8y](buttons)){buttons=[buttons];}$(this[P8y][I78])[q8y]();$[v8y](buttons,function(i,btn){var Z08='tabindex';var X78="button/>";var L78="assName";var T78="Index";var y78="keyp";var D78="appendT";var n8y=D78;n8y+=W4r;var G8y=y78;G8y+=o8G;G8y+=w7G;var U8y=W4r;U8y+=o4r;var Y8y=w78;Y8y+=T78;var W8y=w78;W8y+=S78;W8y+=i9G;W8y+=L0r;var x8y=V0G;x8y+=V78;var u8y=a4r;u8y+=n1r;u8y+=L78;var E8y=a4r;E8y+=L2G;E8y+=O78;var b8y=F4r;b8y+=l4r;b8y+=e1r;var h8y=H7G;h8y+=G16.e0r;h8y+=c38;var N8y=i2G;N8y+=X78;var F8y=L8G;F8y+=o4r;var M8y=G16.e0r;M8y+=s78;M8y+=G16.z0r;M8y+=G16.R0r;var i8y=g0r;i8y+=s2G;i8y+=g0r;if(typeof btn===t78){btn={text:btn,action:function(){var B8y=P38;B8y+=q38;this[B8y]();}};}var text=btn[i8y]||btn[K3G];var action=btn[M8y]||btn[F8y];$(N8y,{'class':that[h8y][b8y][g4G]+(btn[E8y]?z3G+btn[u8y]:N5G)})[x8y](typeof text===c7G?text(that):text||N5G)[l08](Z08,btn[W8y]!==undefined?btn[Y8y]:a7r)[U8y](P08,function(e){var q08="yCode";var J8y=F4G;J8y+=V0r;J8y+=q08;if(e[J8y]===T7r&&action){var C8y=a4r;C8y+=G16.e0r;C8y+=n1r;C8y+=n1r;action[C8y](that);}})[G16.R0r](G8y,function(e){var i08="ntDefault";var B08="preve";if(e[v08]===T7r){var e8y=B08;e8y+=i08;e[e8y]();}})[G16.R0r](N7G,function(e){var M08="preventDefau";var d8y=M08;d8y+=f7G;e[d8y]();if(action){action[a4G](that);}})[n8y](that[G7G][I78]);});return this;};Editor[Q8y][A8y]=function(fieldName){var E08="includeFi";var F08="includeFie";var z8y=C9G;z8y+=r1r;z8y+=y0r;var that=this;var fields=this[y0r][z8y];if(typeof fieldName===t78){var o8y=F08;o8y+=S0r;var R8y=m0r;R8y+=O0r;R8y+=V0r;R8y+=l4r;that[N08](fieldName)[h08]();delete fields[fieldName];var orderIdx=$[N1G](fieldName,this[y0r][V28]);this[y0r][R8y][b08](orderIdx,c7r);var includeIdx=$[N1G](fieldName,this[y0r][o8y]);if(includeIdx!==-c7r){var K8y=E08;K8y+=u08;this[y0r][K8y][b08](includeIdx,c7r);}}else{$[A5G](this[x08](fieldName),function(i,name){var W08="clear";that[W08](name);});}return this;};Editor[R7G][x6G]=function(){this[u78](g5G);return this;};Editor[p8y][r8y]=function(arg1,arg2,arg3,arg4){var A08='number';var n08="udAr";var Y08="tC";var S8y=P5G;S8y+=Y08;S8y+=U08;var T8y=J08;T8y+=N6G;var D8y=C9G;D8y+=n1r;D8y+=n4G;var I8y=C08;I8y+=M9G;var m8y=L8G;m8y+=W4r;m8y+=l4r;m8y+=e1r;var g8y=O0r;g8y+=W4r;g8y+=e1r;var H8y=a4r;H8y+=G08;H8y+=g0r;H8y+=V0r;var k8y=e1r;k8y+=e08;k8y+=o4r;var j8y=e1r;j8y+=W4r;j8y+=O0r;j8y+=V0r;var c8y=d08;c8y+=n08;c8y+=S5G;c8y+=y0r;var that=this;var fields=this[y0r][T28];var count=c7r;if(this[Q08](function(){var f8y=E28;f8y+=u28;f8y+=g0r;f8y+=V0r;that[f8y](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1===A08){count=arg1;arg1=arg2;arg2=arg3;}this[y0r][m28]={};for(var i=a7r;i<count;i++){var a8y=L8G;a8y+=l3G;a8y+=O0r;a8y+=y0r;this[y0r][m28][i]={fields:this[y0r][a8y]};}var argOpts=this[c8y](arg1,arg2,arg3,arg4);this[y0r][j8y]=k8y;this[y0r][z08]=H8y;this[y0r][n28]=X3G;this[g8y][m8y][I8y][Z6G]=z4G;this[R08]();this[o08](this[D8y]());$[A5G](fields,function(name,field){var K08="iS";var w8y=Z1r;w8y+=L8G;field[I28]();for(var i=a7r;i<count;i++){var y8y=e1r;y8y+=d4G;y8y+=K08;y8y+=h78;field[y8y](i,field[q3G]());}field[I1G](field[w8y]());});this[T8y](S8y,X3G,function(){var r08="mOptions";var V8y=p08;V8y+=r08;that[f08]();that[V8y](argOpts[u7G]);argOpts[a08]();});return this;};Editor[R7G][c08]=function(parent){var H08='.edep';var j08="undepende";var O8y=W4r;O8y+=L8G;O8y+=L8G;if($[a1G](parent)){for(var i=a7r,ien=parent[H5G];i<ien;i++){var L8y=j08;L8y+=O1r;this[L8y](parent[i]);}return this;}var field=this[N08](parent);$(field[k08]())[O8y](H08);return this;};Editor[R7G][X8y]=function(parent,url,opts){var y08="dependent";var D08="jso";var F9y=g08;F9y+=O0r;F9y+=m08;var M9y=W4r;M9y+=o4r;var i9y=o4r;i9y+=W4r;i9y+=O0r;i9y+=V0r;var Z9y=a4r;Z9y+=f5G;Z9y+=I08;var l9y=D08;l9y+=o4r;var t8y=L8G;t8y+=l3G;t8y+=O0r;var s8y=H78;s8y+=g78;if($[s8y](parent)){for(var i=a7r,ien=parent[H5G];i<ien;i++){this[y08](parent[i],url,opts);}return this;}var that=this;var field=this[t8y](parent);var ajaxOpts={type:w08,dataType:l9y};opts=$[F3G]({event:Z9y,data:X3G,preUpdate:X3G,postUpdate:X3G},opts);var update=function(json){var v18="postUpdate";var q18='disable';var P18='enable';var Z18='hide';var l18='error';var t08='message';var s08='update';var X08='label';var O08="preUpdate";var L08="eUpda";var V08="pd";var S08="stU";var B9y=T08;B9y+=S08;B9y+=V08;B9y+=q6r;var v9y=y0r;v9y+=j8G;v9y+=M6r;var q9y=U7G;q9y+=G16.e0r;q9y+=n1r;var P9y=C6r;P9y+=l4r;P9y+=L08;P9y+=h6G;if(opts[P9y]){opts[O08](json);}$[A5G]({labels:X08,options:s08,values:q9y,messages:t08,errors:l18},function(jsonProp,fieldFn){if(json[jsonProp]){$[A5G](json[jsonProp],function(field,val){that[N08](field)[fieldFn](val);});}});$[A5G]([Z18,v9y,P18,q18],function(i,key){if(json[key]){that[key](json[key],json[s88]);}});if(opts[B9y]){opts[v18](json);}field[S3G](g5G);};$(field[i9y]())[M9y](opts[B18]+F9y,function(e){var U18="inObject";var Y18="isPla";var h18="values";var u9y=O0r;u9y+=b58;u9y+=G16.e0r;var E9y=l4r;E9y+=i18;var b9y=d28;b9y+=y0r;var h9y=l4r;h9y+=W4r;h9y+=M6r;h9y+=y0r;var N9y=g0r;N9y+=M18;if($(field[k08]())[F18](e[N9y])[H5G]===a7r){return;}field[S3G](D5G);var data={};data[h9y]=that[y0r][m28]?_pluck(that[y0r][m28],N18):X3G;data[d28]=data[b9y]?data[E9y][a7r]:X3G;data[h18]=that[q1G]();if(opts[u9y]){var x9y=b18;x9y+=g0r;x9y+=G16.e0r;var ret=opts[x9y](data);if(ret){opts[U3G]=ret;}}if(typeof url===c7G){var o=url(field[q1G](),data,update);if(o){var W9y=E18;W9y+=u18;W9y+=o4r;if(typeof o===G16.r0r&&typeof o[x18]===W9y){o[x18](function(resolved){if(resolved){update(resolved);}});}else{update(o);}}}else{var C9y=V0r;C9y+=L0r;C9y+=t2G;var J9y=W18;J9y+=H6r;var Y9y=Y18;Y9y+=U18;if($[Y9y](url)){$[F3G](ajaxOpts,url);}else{var U9y=d1r;U9y+=l4r;U9y+=n1r;ajaxOpts[U9y]=url;}$[J9y]($[C9y](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[R7G][G9y]=function(){var d18='.dte';var G18="yController";var C18="ue";var J18="iq";var A9y=n7G;A9y+=J18;A9y+=C18;var Q9y=O0r;Q9y+=o98;Q9y+=G18;var n9y=H7G;n9y+=V0r;n9y+=G16.e0r;n9y+=l4r;var e9y=C1r;e9y+=y7G;e9y+=e3G;if(this[y0r][e9y]){var d9y=a4r;d9y+=Y9G;d9y+=y0r;d9y+=V0r;this[d9y]();}this[n9y]();if(this[y0r][e18]){$(V7G)[u6G](this[y0r][e18]);}var controller=this[y0r][Q9y];if(controller[h08]){controller[h08](this);}$(document)[b78](d18+this[y0r][A9y]);this[G7G]=X3G;this[y0r]=X3G;};Editor[R7G][n18]=function(name){var z9y=Q18;z9y+=c4r;var that=this;$[z9y](this[x08](name),function(i,n){var A18="isab";var R9y=O0r;R9y+=A18;R9y+=n1r;R9y+=V0r;that[N08](n)[R9y]();});return this;};Editor[R7G][o9y]=function(show){if(show===undefined){return this[y0r][z18];}return this[show?R18:I4G]();};Editor[R7G][K9y]=function(){var p9y=L8G;p9y+=a28;return $[o18](this[y0r][p9y],function(field,name){return field[z18]()?name:X3G;});};Editor[r9y][f9y]=function(){return this[y0r][H4G][k08](this);};Editor[R7G][i38]=function(items,arg1,arg2,arg3,arg4){var a18="rgs";var f18="udA";var K18="_dataSo";var j9y=K18;j9y+=W9G;j9y+=U8G;var c9y=p18;c9y+=r18;var a9y=d08;a9y+=f18;a9y+=a18;var that=this;if(this[Q08](function(){that[i38](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[a9y](arg1,arg2,arg3,arg4);this[c9y](items,this[j9y](c18,items),j18,argOpts[u7G],function(){var m18="assembleMain";var g18="rmOption";var H18="_fo";var g9y=W4r;g9y+=k18;g9y+=y0r;var H9y=H18;H9y+=g18;H9y+=y0r;var k9y=w1r;k9y+=m18;that[k9y]();that[H9y](argOpts[g9y]);argOpts[a08]();});return this;};Editor[R7G][I18]=function(name){var y18="Names";var I9y=D18;I9y+=G16.z0r;I9y+=B3G;I9y+=y18;var m9y=V0r;m9y+=G16.e0r;m9y+=a4r;m9y+=c4r;var that=this;$[m9y](this[I9y](name),function(i,n){that[N08](n)[I18]();});return this;};Editor[R7G][D9y]=function(name,msg){var T18="lE";var w18="globa";if(msg===undefined){var T9y=w18;T9y+=T18;T9y+=l4r;T9y+=s8G;var w9y=F4r;w9y+=S18;w9y+=k0r;w9y+=V18;var y9y=O0r;y9y+=W4r;y9y+=e1r;this[L18](this[y9y][w9y],name);this[y0r][T9y]=name;}else{var V9y=V0r;V9y+=l4r;V9y+=m8G;V9y+=l4r;var S9y=L8G;S9y+=T0r;S9y+=r1r;this[S9y](name)[V9y](msg);}return this;};Editor[L9y][O9y]=function(name){var t18="- ";var s18="me ";var X18="wn field na";var O18="Unkno";var fields=this[y0r][T28];if(!fields[name]){var X9y=O18;X9y+=X18;X9y+=s18;X9y+=t18;throw X9y+name;}return fields[name];};Editor[R7G][T28]=function(){var s9y=e1r;s9y+=G16.e0r;s9y+=C6r;return $[s9y](this[y0r][T28],function(field,name){return name;});};Editor[R7G][t9y]=_api_file;Editor[R7G][l5y]=_api_files;Editor[R7G][A78]=function(name){var B5y=S5G;B5y+=h78;var v5y=X8G;v5y+=B3G;var that=this;if(!name){name=this[T28]();}if($[a1G](name)){var Z5y=u28;Z5y+=a4r;Z5y+=c4r;var out={};$[Z5y](name,function(i,n){var q5y=S5G;q5y+=V0r;q5y+=g0r;var P5y=L8G;P5y+=G16.z0r;P5y+=O5G;P5y+=O0r;out[n]=that[P5y](n)[q5y]();});return out;}return this[v5y](name)[B5y]();};Editor[i5y][l48]=function(names,animate){var P48="eldNames";var Z48="_fi";var M5y=Z48;M5y+=P48;var that=this;$[A5G](this[M5y](names),function(i,n){that[N08](n)[l48](animate);});return this;};Editor[R7G][F5y]=function(includeHash){var v48="tFi";var N5y=q48;N5y+=v48;N5y+=u08;return $[o18](this[y0r][N5y],function(edit,idSrc){return includeHash===D5G?B48+idSrc:idSrc;});};Editor[R7G][h5y]=function(inNames){var h48="inError";var N48="ormEr";var F48="global";var M48="Nam";var i48="_fie";var x5y=K28;x5y+=g0r;x5y+=c4r;var u5y=i48;u5y+=r1r;u5y+=M48;u5y+=O4r;var E5y=F48;E5y+=k0r;E5y+=l4r;E5y+=s8G;var b5y=L8G;b5y+=N48;b5y+=s8G;var formError=$(this[G7G][b5y]);if(this[y0r][E5y]){return D5G;}var names=this[u5y](inNames);for(var i=a7r,ien=names[x5y];i<ien;i++){var W5y=X8G;W5y+=B3G;if(this[W5y](names[i])[h48]()){return D5G;}}return g5G;};Editor[Y5y][b48]=function(cell,fieldName,opts){var C48="ine";var J48="urc";var Y48="individu";var W48="ses";var u48="_Field";var E48="nli";var o5y=G16.z0r;o5y+=E48;o5y+=o4r;o5y+=V0r;var R5y=w1r;R5y+=e3G;R5y+=B6r;var A5y=j0G;A5y+=G16.z0r;A5y+=O0r;A5y+=m4r;var Q5y=k5G;Q5y+=S5G;Q5y+=p28;var n5y=X58;n5y+=u48;var e5y=x48;e5y+=W48;var G5y=Y48;G5y+=J7G;var C5y=V6r;C5y+=U48;C5y+=J48;C5y+=V0r;var J5y=V8G;J5y+=n1r;J5y+=C48;var U5y=G48;U5y+=s3G;var that=this;if($[h1G](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[U5y]({},this[y0r][e48][J5y],opts);var editFields=this[C5y](G5y,cell,fieldName);var node,field;var countOuter=a7r,countInner;var closed=g5G;var classes=this[e5y][b48];$[A5G](editFields,function(i,editField){var d48='Cannot edit more than one row inline at a time';if(countOuter>a7r){throw d48;}node=$(editField[J28][a7r]);countInner=a7r;$[A5G](editField[n48],function(j,f){var A48="t a time";var Q48="Cannot edit more than one field inline a";if(countInner>a7r){var d5y=Q48;d5y+=A48;throw d5y;}field=f;countInner++;});countOuter++;});if($(n5y,node)[Q5y]){return this;}if(this[A5y](function(){var z5y=V8G;z5y+=n1r;z5y+=V8G;z5y+=V0r;that[z5y](cell,fieldName,opts);})){return this;}this[R5y](cell,editFields,o5y,opts,function(){var V48="ttons";var w48='px">';var y48="liner";var D48="contents";var I48="ormOp";var m48="nl";var g48="tac";var k48="lass=\"";var j48="le=\"width";var c48=" sty";var a48="ssing_Indicator\"><span/></div>";var f48=" class=\"DTE_Proce";var o48="eg";var R48="loseR";var z48="line";var u2y=V8G;u2y+=z48;var l2y=w1r;l2y+=a4r;l2y+=R48;l2y+=o48;var L5y=F4r;L5y+=S18;L5y+=k0r;L5y+=V18;var V5y=o4r;V5y+=W4r;V5y+=O0r;V5y+=V0r;var S5y=y6G;S5y+=s3G;var T5y=l4r;T5y+=m08;T5y+=K48;T5y+=V0r;var w5y=O0r;w5y+=G16.z0r;w5y+=U7G;w5y+=S58;var y5y=L8G;y5y+=S6G;var D5y=i2G;D5y+=x2G;var I5y=G16.Q0r;I5y+=D1r;I5y+=p48;I5y+=y0r;var m5y=r48;m5y+=a2G;m5y+=f48;m5y+=a48;var g5y=M6r;g5y+=u3G;g5y+=p28;var H5y=G5G;H5y+=c48;H5y+=j48;H5y+=q4G;var k5y=e2G;k5y+=l5G;k5y+=a4r;k5y+=k48;var j5y=G5G;j5y+=z2G;var c5y=O6G;c5y+=C6r;c5y+=X88;var a5y=b2G;a5y+=a4r;a5y+=f38;a5y+=a38;var f5y=H48;f5y+=o4r;f5y+=O0r;var r5y=Z1r;r5y+=g48;r5y+=c4r;var p5y=G16.z0r;p5y+=m48;p5y+=G16.z0r;p5y+=H8G;var K5y=D18;K5y+=I48;K5y+=z1r;K5y+=F9G;var namespace=that[K5y](opts);var ret=that[g38](p5y);if(!ret){return that;}var children=node[D48]()[r5y]();node[f5y]($(a5y+classes[c5y]+j5y+k5y+classes[y48]+H5y+node[g5y]()+w48+m5y+m3G+w38+classes[I5y]+T48+D5y));node[y5y](w5y+classes[y48][T5y](/ /g,S48))[S5y](field[V5y]())[u6G](that[G7G][L5y]);if(opts[I78]){var t5y=Y78;t5y+=V48;var s5y=O0r;s5y+=W4r;s5y+=e1r;var X5y=G16.e0r;X5y+=L48;var O5y=L8G;O5y+=V8G;O5y+=O0r;node[O5y](O48+classes[I78][p1G](/ /g,S48))[X5y](that[s5y][t5y]);}that[l2y](function(submitComplete,action){var Z68="of";var t48="icIn";var X48="_clearDyn";var M2y=X48;M2y+=s48;M2y+=t48;M2y+=F4r;var q2y=V0r;q2y+=O0r;q2y+=G16.z0r;q2y+=g0r;var P2y=a4r;P2y+=l68;P2y+=a4r;P2y+=F4G;var Z2y=Z68;Z2y+=L8G;closed=D5G;$(document)[Z2y](P2y+namespace);if(!submitComplete||action!==q2y){var i2y=A88;i2y+=C6r;i2y+=V0r;i2y+=b4r;var B2y=Z1r;B2y+=g0r;B2y+=i6G;var v2y=a4r;v2y+=P68;v2y+=V0r;v2y+=q68;node[v2y]()[B2y]();node[i2y](children);}that[M2y]();});setTimeout(function(){var F2y=m6G;F2y+=X1G;if(closed){return;}$(document)[G16.R0r](F2y+namespace,function(e){var N68='owns';var i68="ddBack";var b2y=v68;b2y+=g0r;var h2y=V8G;h2y+=B68;h2y+=u6r;var N2y=G16.e0r;N2y+=i68;var back=$[J5G][M68]?N2y:F68;if(!field[L3G](N68,e[e88])&&$[h2y](node[a7r],$(e[b2y])[h68]()[back]())===-c7r){var E2y=q0G;E2y+=d1r;E2y+=l4r;that[E2y]();}});},a7r);that[x78]([field],opts[C7G]);that[b68](u2y);});return this;};Editor[R7G][w3G]=function(name,msg){if(msg===undefined){var x2y=O0r;x2y+=W4r;x2y+=e1r;this[L18](this[x2y][P78],name);}else{var W2y=L8G;W2y+=T0r;W2y+=r1r;this[W2y](name)[w3G](msg);}return this;};Editor[R7G][Y2y]=function(mode){var x68='Changing from create mode is not supported';var u68='Not currently in an editing mode';var C2y=E68;C2y+=h6G;var J2y=G16.e0r;J2y+=s78;J2y+=J9G;J2y+=o4r;if(!mode){var U2y=x28;U2y+=W28;return this[y0r][U2y];}if(!this[y0r][J2y]){throw new Error(u68);}else if(this[y0r][z08]===C2y&&mode!==O3G){throw new Error(x68);}this[y0r][z08]=mode;return this;};Editor[G2y][e2y]=function(){var Y68="ifie";var W68="mod";var d2y=W68;d2y+=Y68;d2y+=l4r;return this[y0r][d2y];};Editor[n2y][Q2y]=function(fieldNames){var J68="sAr";var o2y=U68;o2y+=O0r;var z2y=G16.z0r;z2y+=J68;z2y+=w58;z2y+=m4r;var that=this;if(fieldNames===undefined){var A2y=L8G;A2y+=G16.z0r;A2y+=O5G;A2y+=n4G;fieldNames=this[A2y]();}if($[z2y](fieldNames)){var R2y=V0r;R2y+=G16.e0r;R2y+=P28;var out={};$[R2y](fieldNames,function(i,name){out[name]=that[N08](name)[C68]();});return out;}return this[o2y](fieldNames)[C68]();};Editor[R7G][K2y]=function(fieldNames,val){var e68="iSet";var that=this;if($[h1G](fieldNames)&&val===undefined){var p2y=Q18;p2y+=c4r;$[p2y](fieldNames,function(name,value){var r2y=L8G;r2y+=l3G;r2y+=O0r;that[r2y](name)[G68](value);});}else{var a2y=e1r;a2y+=d1r;a2y+=f7G;a2y+=e68;var f2y=X8G;f2y+=V0r;f2y+=r1r;this[f2y](fieldNames)[a2y](val);}return this;};Editor[R7G][c2y]=function(name){var k2y=H78;k2y+=l4r;k2y+=u6r;var that=this;if(!name){var j2y=W4r;j2y+=l4r;j2y+=O0r;j2y+=d4r;name=this[j2y]();}return $[k2y](name)?$[o18](name,function(n){return that[N08](n)[k08]();}):this[N08](name)[k08]();};Editor[H2y][b78]=function(name,fn){var n68="tName";var g2y=d68;g2y+=n68;$(this)[b78](this[g2y](name),fn);return this;};Editor[m2y][G16.R0r]=function(name,fn){var I2y=J08;I2y+=N6G;I2y+=O78;$(this)[G16.R0r](this[I2y](name),fn);return this;};Editor[D2y][y2y]=function(name,fn){$(this)[Q68](this[A68](name),fn);return this;};Editor[R7G][w2y]=function(){var p68="layRe";var K68="_disp";var o68="Reg";var R68="_clo";var z68="_pos";var l3y=e1r;l3y+=G16.e0r;l3y+=G16.z0r;l3y+=o4r;var t2y=z68;t2y+=b8G;t2y+=C6r;t2y+=O7G;var V2y=V1G;V2y+=O7G;var S2y=R68;S2y+=y0r;S2y+=V0r;S2y+=o68;var T2y=K68;T2y+=p68;T2y+=m0r;T2y+=o28;var that=this;this[T2y]();this[S2y](function(submitComplete){that[y0r][H4G][x6G](that,function(){that[r68]();});});var ret=this[g38](j18);if(!ret){return this;}this[y0r][H4G][V2y](this,this[G7G][A3G],function(){var s2y=F4r;s2y+=p0G;var O2y=m0r;O2y+=o28;var L2y=e1r;L2y+=G16.e0r;L2y+=C6r;that[x78]($[L2y](that[y0r][O2y],function(name){var X2y=L8G;X2y+=T0r;X2y+=n1r;X2y+=n4G;return that[y0r][X2y][name];}),that[y0r][f68][s2y]);});this[t2y](l3y);return this;};Editor[Z3y][V28]=function(set){var D68="All fields, and no additional fields, must be provided for ordering.";var j68="lice";var c68="ort";var a68="so";var N3y=m0r;N3y+=Z1r;N3y+=l4r;var F3y=a68;F3y+=l4r;F3y+=g0r;var M3y=y0r;M3y+=c68;var i3y=y0r;i3y+=j68;var q3y=G16.z0r;q3y+=y0r;q3y+=k68;q3y+=H68;var P3y=k5G;P3y+=g68;P3y+=c4r;if(!set){return this[y0r][V28];}if(arguments[P3y]&&!$[q3y](set)){var B3y=I0G;B3y+=G16.z0r;B3y+=a4r;B3y+=V0r;var v3y=e6r;v3y+=d6r;set=Array[v3y][B3y][a4G](arguments);}if(this[y0r][V28][i3y]()[M3y]()[m68](I68)!==set[o7G]()[F3y]()[m68](I68)){throw D68;}$[F3G](this[y0r][N3y],set);this[o08]();return this;};Editor[R7G][h3y]=function(items,arg1,arg2,arg3,arg4){var t68='node';var X68="tidy";var O68="_crudA";var L68="aSour";var S68="_action";var y68="initR";var d3y=y68;d3y+=w68;d3y+=q98;var e3y=w1r;e3y+=V0r;e3y+=T68;var G3y=S68;G3y+=V68;var C3y=C08;C3y+=n1r;C3y+=V0r;var J3y=F4r;J3y+=S18;var U3y=O0r;U3y+=W4r;U3y+=e1r;var Y3y=e3G;Y3y+=B6r;Y3y+=R9G;Y3y+=u08;var W3y=V6r;W3y+=b58;W3y+=L68;W3y+=U8G;var x3y=O68;x3y+=l4r;x3y+=v8G;var u3y=k5G;u3y+=S5G;u3y+=p28;var b3y=w1r;b3y+=X68;var that=this;if(this[b3y](function(){var E3y=s68;E3y+=q98;that[E3y](items,arg1,arg2,arg3,arg4);})){return this;}if(items[u3y]===undefined){items=[items];}var argOpts=this[x3y](arg1,arg2,arg3,arg4);var editFields=this[W3y](c18,items);this[y0r][z08]=T1G;this[y0r][n28]=items;this[y0r][Y3y]=editFields;this[U3y][J3y][C3y][Z6G]=L7G;this[G3y]();this[e3y](d3y,[_pluck(editFields,t68),_pluck(editFields,N18),items],function(){var Z8m='initMultiRemove';var n3y=w1r;n3y+=l8m;n3y+=O1r;that[n3y](Z8m,[editFields,items],function(){var B8m="assembleMai";var v8m="ptions";var P8m="aybeOpen";var R3y=e1r;R3y+=P8m;var z3y=W4r;z3y+=k18;z3y+=y0r;var A3y=p08;A3y+=e1r;A3y+=q8m;A3y+=v8m;var Q3y=w1r;Q3y+=B8m;Q3y+=o4r;that[Q3y]();that[A3y](argOpts[z3y]);argOpts[R3y]();var opts=that[y0r][f68];if(opts[C7G]!==X3G){var p3y=L8G;p3y+=u9G;p3y+=i8m;var K3y=F4r;K3y+=a4r;K3y+=d1r;K3y+=y0r;var o3y=O0r;o3y+=W4r;o3y+=e1r;$(M8m,that[o3y][I78])[s38](opts[K3y])[p3y]();}});});return this;};Editor[r3y][I1G]=function(set,val){var F8m="sPlainO";var f3y=G16.z0r;f3y+=F8m;f3y+=W38;var that=this;if(!$[f3y](set)){var o={};o[set]=val;set=o;}$[A5G](set,function(n,v){var c3y=h8G;c3y+=g0r;var a3y=C9G;a3y+=n1r;a3y+=O0r;that[a3y](n)[c3y](v);});return this;};Editor[R7G][j3y]=function(names,animate){var that=this;$[A5G](this[x08](names),function(i,n){var H3y=y0r;H3y+=c4r;H3y+=W4r;H3y+=M6r;var k3y=L8G;k3y+=l3G;k3y+=O0r;that[k3y](n)[H3y](animate);});return this;};Editor[g3y][m3y]=function(successCallback,errorCallback,formatdata,hide){var N8m="_proce";var y3y=N8m;y3y+=Y1G;var D3y=G16.e0r;D3y+=s78;D3y+=J9G;D3y+=o4r;var I3y=T6r;I3y+=U8G;I3y+=w7G;I3y+=h8m;var that=this,fields=this[y0r][T28],errorFields=[],errorReady=a7r,sent=g5G;if(this[y0r][I3y]||!this[y0r][D3y]){return this;}this[y3y](D5G);var send=function(){var E8m='initSubmit';var b8m="eng";var S3y=x28;S3y+=W28;var T3y=d68;T3y+=g0r;var w3y=n1r;w3y+=b8m;w3y+=g0r;w3y+=c4r;if(errorFields[w3y]!==errorReady||sent){return;}that[T3y](E8m,[that[y0r][S3y]],function(result){var u8m="_proc";var L3y=U6r;L3y+=B6r;if(result===g5G){var V3y=u8m;V3y+=O4r;V3y+=y0r;V3y+=h8m;that[V3y](g5G);return;}sent=D5G;that[L3y](successCallback,errorCallback,formatdata,hide);});};this[N0G]();$[A5G](fields,function(name,field){var x8m="inEr";var O3y=x8m;O3y+=s8G;if(field[O3y]()){errorFields[z5G](name);}});$[A5G](errorFields,function(i,name){var X3y=V0r;X3y+=V18;fields[name][X3y](N5G,function(){errorReady++;send();});});send();return this;};Editor[s3y][t3y]=function(set){var Y8m="mplate";var W8m="templ";var Z7y=W8m;Z7y+=q6r;if(set===undefined){var l7y=h6G;l7y+=Y8m;return this[y0r][l7y];}this[y0r][Z7y]=set===X3G?X3G:$(set);return this;};Editor[R7G][U8m]=function(title){var M7y=G16.A0r;M7y+=W28;var B7y=C0G;B7y+=O7G;B7y+=g0r;var v7y=r98;v7y+=l4r;v7y+=O7G;var q7y=e28;q7y+=o28;var P7y=O0r;P7y+=W4r;P7y+=e1r;var header=$(this[P7y][q7y])[v7y](O48+this[e0G][v78][B7y]);if(title===undefined){var i7y=N4G;i7y+=n1r;return header[i7y]();}if(typeof title===M7y){var F7y=k58;F7y+=G16.Q0r;F7y+=n1r;F7y+=V0r;title=title(this,new DataTable[J8m](this[y0r][F7y]));}header[O0G](title);return this;};Editor[N7y][q1G]=function(field,value){if(value!==undefined||$[h1G](field)){var h7y=y0r;h7y+=V0r;h7y+=g0r;return this[h7y](field,value);}return this[A78](field);};var apiRegister=DataTable[J8m][b7y];function __getInst(api){var e8m="context";var G8m="oIn";var C8m="_edi";var x7y=C8m;x7y+=b8G;x7y+=l4r;var u7y=e3G;u7y+=G16.z0r;u7y+=b8G;u7y+=l4r;var E7y=G8m;E7y+=G16.z0r;E7y+=g0r;var ctx=api[e8m][a7r];return ctx[E7y][u7y]||ctx[x7y];}function __setBasic(inst,opts,type,plural){var R8m='1';var z8m=/%d/;var Q8m="ag";var n8m="asi";var d8m="essage";var U7y=e1r;U7y+=d8m;if(!opts){opts={};}if(opts[I78]===undefined){var W7y=w1r;W7y+=G16.Q0r;W7y+=n8m;W7y+=a4r;opts[I78]=W7y;}if(opts[U8m]===undefined){var Y7y=g0r;Y7y+=d38;Y7y+=V0r;opts[Y7y]=inst[m78][type][U8m];}if(opts[U7y]===undefined){var J7y=l4r;J7y+=V0r;J7y+=e1r;J7y+=q98;if(type===J7y){var e7y=G1G;e7y+=K48;e7y+=V0r;var G7y=K6r;G7y+=y0r;G7y+=Q8m;G7y+=V0r;var C7y=M88;C7y+=A8m;var confirm=inst[m78][type][C7y];opts[G7y]=plural!==c7r?confirm[w1r][e7y](z8m,plural):confirm[R8m];}else{opts[w3G]=N5G;}}return opts;}apiRegister(o8m,function(){return __getInst(this);});apiRegister(d7y,function(opts){var inst=__getInst(this);inst[K8m](__setBasic(inst,opts,O3G));return this;});apiRegister(p8m,function(opts){var n7y=V0r;n7y+=r18;var inst=__getInst(this);inst[i38](this[a7r][a7r],__setBasic(inst,opts,n7y));return this;});apiRegister(Q7y,function(opts){var inst=__getInst(this);inst[i38](this[a7r],__setBasic(inst,opts,r8m));return this;});apiRegister(f8m,function(opts){var inst=__getInst(this);inst[T1G](this[a7r][a7r],__setBasic(inst,opts,a8m,c7r));return this;});apiRegister(A7y,function(opts){var inst=__getInst(this);inst[T1G](this[a7r],__setBasic(inst,opts,a8m,this[a7r][H5G]));return this;});apiRegister(z7y,function(type,opts){var c8m="nline";if(!type){var R7y=G16.z0r;R7y+=c8m;type=R7y;}else if($[h1G](type)){var o7y=V8G;o7y+=l68;o7y+=o4r;o7y+=V0r;opts=type;type=o7y;}__getInst(this)[type](this[a7r][a7r],opts);return this;});apiRegister(j8m,function(opts){var K7y=G16.Q0r;K7y+=N38;__getInst(this)[K7y](this[a7r],opts);return this;});apiRegister(k8m,_api_file);apiRegister(H8m,_api_files);$(document)[p7y](r7y,function(e,ctx,json){var I8m="file";var m8m='dt';var g8m="espac";var f7y=y2G;f7y+=g8m;f7y+=V0r;if(e[f7y]!==m8m){return;}if(json&&json[K5G]){var c7y=I8m;c7y+=y0r;var a7y=V0r;a7y+=G16.e0r;a7y+=a4r;a7y+=c4r;$[a7y](json[c7y],function(name,files){var y8m="fil";var D8m="les";var H7y=X8G;H7y+=D8m;var j7y=y8m;j7y+=V0r;j7y+=y0r;if(!Editor[j7y][name]){var k7y=X8G;k7y+=D8m;Editor[k7y][name]={};}$[F3G](Editor[H7y][name],files);});}});Editor[N0G]=function(msg,tn){var S8m="atatables.net/tn/";var T8m="https://d";var w8m=" For more information, please refer to ";var g7y=w8m;g7y+=T8m;g7y+=S8m;throw tn?msg+g7y+tn:msg;};Editor[V8m]=function(data,props,fn){var s8m="nObje";var X8m="lai";var O8m="isP";var I7y=n1r;I7y+=G16.e0r;I7y+=G16.Q0r;I7y+=O5G;var m7y=V0r;m7y+=L0r;m7y+=g0r;m7y+=s3G;var i,ien,dataPoint;props=$[m7y]({label:I7y,value:L8m},props);if($[a1G](data)){var D7y=n1r;D7y+=O7G;D7y+=S5G;D7y+=p28;for(i=a7r,ien=data[D7y];i<ien;i++){var y7y=O8m;y7y+=X8m;y7y+=s8m;y7y+=s78;dataPoint=data[i];if($[y7y](dataPoint)){var T7y=e1G;T7y+=G16.Q0r;T7y+=V0r;T7y+=n1r;var w7y=t8m;w7y+=n1r;w7y+=d1r;w7y+=V0r;fn(dataPoint[props[l9m]]===undefined?dataPoint[props[K3G]]:dataPoint[props[w7y]],dataPoint[props[T7y]],i,dataPoint[l08]);}else{fn(dataPoint,dataPoint,i);}}}else{i=a7r;$[A5G](data,function(key,val){fn(val,key,i);i++;});}};Editor[Z9m]=function(id){return id[p1G](/\./g,I68);};Editor[P9m]=function(editor,conf,files,progressCallback,completeCallback){var c9m="readAsDataURL";var E9m="onload";var b9m="<i>Uploading file</i>";var h9m="fileReadText";var N9m="jax";var F9m='A server error occurred while uploading the file';var M9m="erro";var i9m="functio";var v9m="L";var q9m="_limit";var t0y=q9m;t0y+=v9m;t0y+=n78;var s0y=B9m;s0y+=C6r;var L7y=i9m;L7y+=o4r;var V7y=o4r;V7y+=G16.e0r;V7y+=e1r;V7y+=V0r;var S7y=M9m;S7y+=l4r;var reader=new FileReader();var counter=a7r;var ids=[];var generalError=F9m;editor[S7y](conf[V7y],N5G);if(typeof conf[s28]===L7y){var O7y=G16.e0r;O7y+=N9m;conf[O7y](files,function(ids){completeCallback[a4G](editor,ids);});return;}progressCallback(conf,conf[h9m]||b9m);reader[E9m]=function(e){var m9m="upl";var H9m='post';var k9m='preSubmit.DTE_Upload';var j9m="all";var f9m=" upload plug-in";var r9m=" Ajax option specified fo";var p9m="No";var K9m="plo";var o9m="aja";var R9m="axDa";var z9m="ajaxData";var A9m='action';var Q9m="uploa";var n9m="oadFie";var d9m="oad";var C9m="je";var J9m="ainOb";var W9m="Upload";var e0y=V0r;e0y+=u9m;var G0y=W4r;G0y+=o4r;var U0y=x9m;U0y+=W9m;var x0y=O0r;x0y+=b58;x0y+=G16.e0r;var u0y=A4r;u0y+=l4r;u0y+=G16.z0r;u0y+=q5G;var h0y=Y9m;h0y+=q5G;var i0y=U9m;i0y+=J9m;i0y+=C9m;i0y+=s78;var v0y=G16.e0r;v0y+=G9m;v0y+=G16.e0r;v0y+=L0r;var P0y=e9m;P0y+=n1r;P0y+=d9m;var Z0y=A88;Z0y+=D0r;Z0y+=o4r;Z0y+=O0r;var l0y=o4r;l0y+=G16.e0r;l0y+=e1r;l0y+=V0r;var t7y=e9m;t7y+=n1r;t7y+=n9m;t7y+=r1r;var s7y=Q9m;s7y+=O0r;var X7y=G16.e0r;X7y+=C6r;X7y+=v6G;var data=new FormData();var ajax;data[X7y](A9m,s7y);data[u6G](t7y,conf[l0y]);data[Z0y](P0y,files[counter]);if(conf[z9m]){var q0y=W18;q0y+=R9m;q0y+=g0r;q0y+=G16.e0r;conf[q0y](data);}if(conf[v0y]){var B0y=W18;B0y+=G16.e0r;B0y+=L0r;ajax=conf[B0y];}else if($[i0y](editor[y0r][s28])){var N0y=o9m;N0y+=L0r;var F0y=d1r;F0y+=K9m;F0y+=G16.e0r;F0y+=O0r;var M0y=G16.e0r;M0y+=G9m;M0y+=G16.e0r;M0y+=L0r;ajax=editor[y0r][M0y][F0y]?editor[y0r][s28][P9m]:editor[y0r][N0y];}else if(typeof editor[y0r][s28]===h0y){var b0y=G16.e0r;b0y+=N9m;ajax=editor[y0r][b0y];}if(!ajax){var E0y=p9m;E0y+=r9m;E0y+=l4r;E0y+=f9m;throw E0y;}if(typeof ajax===u0y){ajax={url:ajax};}if(typeof ajax[x0y]===c7G){var W0y=b18;W0y+=g0r;W0y+=G16.e0r;var d={};var ret=ajax[W0y](d);if(ret!==undefined&&typeof ret!==t78){d=ret;}$[A5G](d,function(key,value){var Y0y=G16.e0r;Y0y+=L48;data[Y0y](key,value);});}var preRet=editor[a9m](U0y,[conf[E3G],files[counter],data]);if(preRet===g5G){var J0y=n1r;J0y+=Y0G;if(counter<files[J0y]-c7r){counter++;reader[c9m](files[counter]);}else{var C0y=a4r;C0y+=j9m;completeCallback[C0y](editor,ids);}return;}var submit=g5G;editor[G0y](k9m,function(){submit=D5G;return g5G;});$[s28]($[e0y]({},ajax,{type:H9m,data:data,dataType:g9m,contentType:g5G,processData:g5G,xhr:function(){var D9m="onprogr";var I9m="xSettin";var Q0y=m9m;Q0y+=d9m;var n0y=L0r;n0y+=c4r;n0y+=l4r;var d0y=o9m;d0y+=I9m;d0y+=v8G;var xhr=$[d0y][n0y]();if(xhr[Q0y]){var o0y=E9m;o0y+=s3G;var z0y=D9m;z0y+=y9m;var A0y=m9m;A0y+=d9m;xhr[A0y][z0y]=function(e){var X9m=':';var O9m="%";var L9m="total";var V9m="loaded";var S9m="xed";var T9m="toFi";var w9m="lengthComputable";if(e[w9m]){var R0y=T9m;R0y+=S9m;var percent=(e[V9m]/e[L9m]*h0r)[R0y](a7r)+O9m;progressCallback(conf,files[H5G]===c7r?percent:counter+X9m+files[H5G]+z3G+percent);}};xhr[P9m][o0y]=function(e){var t9m='Processing';var s9m="processingText";progressCallback(conf,conf[s9m]||t9m);};}return xhr;},success:function(json){var u5m="sDataURL";var E5m="readA";var M5m='uploadXhrSuccess';var v5m="fieldErr";var q5m="rrors";var P5m="dE";var Z5m="oa";var I0y=d1r;I0y+=l5m;I0y+=d9m;var m0y=m9m;m0y+=Z5m;m0y+=O0r;var a0y=M9G;a0y+=o4r;a0y+=S5G;a0y+=p28;var f0y=X8G;f0y+=O5G;f0y+=P5m;f0y+=q5m;var r0y=v5m;r0y+=B5m;var p0y=o4r;p0y+=G16.e0r;p0y+=e1r;p0y+=V0r;var K0y=i5m;K0y+=o4r;K0y+=g0r;editor[b78](k9m);editor[K0y](M5m,[conf[p0y],json]);if(json[r0y]&&json[f0y][a0y]){var j0y=M9G;j0y+=P1G;var c0y=v5m;c0y+=W4r;c0y+=F5m;var errors=json[c0y];for(var i=a7r,ien=errors[j0y];i<ien;i++){var H0y=N5m;H0y+=g0r;H0y+=i8m;var k0y=o4r;k0y+=G16.e0r;k0y+=e1r;k0y+=V0r;editor[N0G](errors[i][k0y],errors[i][H0y]);}}else if(json[N0G]){var g0y=h5m;g0y+=W4r;g0y+=l4r;editor[N0G](json[g0y]);}else if(!json[m0y]||!json[I0y][u3G]){var y0y=o4r;y0y+=G16.e0r;y0y+=e1r;y0y+=V0r;var D0y=V0r;D0y+=b5m;D0y+=W4r;D0y+=l4r;editor[D0y](conf[y0y],generalError);}else{if(json[K5G]){var w0y=V0r;w0y+=G16.e0r;w0y+=P28;$[w0y](json[K5G],function(table,files){var T0y=X8G;T0y+=M9G;T0y+=y0r;if(!Editor[K5G][table]){Editor[K5G][table]={};}$[F3G](Editor[T0y][table],files);});}ids[z5G](json[P9m][u3G]);if(counter<files[H5G]-c7r){var S0y=E5m;S0y+=u5m;counter++;reader[S0y](files[counter]);}else{var V0y=x5m;V0y+=W5m;completeCallback[V0y](editor,ids);if(submit){var L0y=Y5m;L0y+=W6r;editor[L0y]();}}}progressCallback(conf);},error:function(xhr){var J5m="ploadXhrError";var U5m="na";var X0y=U5m;X0y+=e1r;X0y+=V0r;var O0y=d1r;O0y+=J5m;editor[a9m](O0y,[conf[X0y],xhr]);editor[N0G](conf[E3G],generalError);progressCallback(conf);}}));};files=$[s0y](files,function(val){return val;});if(conf[t0y]!==undefined){var l1y=K28;l1y+=p28;files[b08](conf[C5m],files[l1y]);}reader[c9m](files[a7r]);};Editor[Z1y][U5G]=function(init){var k2m='init.dt.dte';var j2m='body_content';var c2m='form_content';var a2m="events";var p2m="BUTTONS";var K2m="aTable";var o2m="Tools";var A2m='"/></div>';var Q2m='"><div class="';var n2m='<div data-dte-e="form_info" class="';var d2m='<div data-dte-e="form_error" class="';var e2m='<div data-dte-e="form_content" class="';var G2m='<form data-dte-e="form" class="';var J2m='<div data-dte-e="foot" class="';var U2m='<div data-dte-e="body" class="';var Y2m="indicator";var W2m="unique";var b2m="omT";var h2m="Sr";var N2m="domTa";var F2m="tabl";var M2m="aSources";var i2m="cyA";var B2m="lega";var v2m="empla";var Z2m="del";var l2m="ettings";var t5m="-e=\"processing\" class=\"";var s5m="ata-dte";var X5m="<div d";var L5m="proces";var V5m="></";var S5m="pan/";var T5m="\"><s";var w5m="dy_content\" class=\"";var y5m="dte-e=\"bo";var D5m=" data-";var m5m="oot";var g5m="<div clas";var k5m="form>";var j5m="ead\" clas";var c5m="<div data-dte-e=\"h";var a5m="class=\"";var f5m="<div data-dte-e=\"form_buttons\" ";var r5m="ontent";var p5m="rmC";var K5m="oter";var o5m="oo";var R5m="Cont";var Q5m="xhr";var n5m="uniqu";var G5m="initCom";var p4y=G5m;p4y+=e5m;var K4y=w1r;K4y+=d5m;K4y+=N6G;var e4y=n5m;e4y+=V0r;var G4y=Q5m;G4y+=Y8G;G4y+=S58;G4y+=Y28;var C4y=W4r;C4y+=o4r;var Y4y=L8G;Y4y+=l3G;Y4y+=n4G;var W4y=g6r;W4y+=A5m;W4y+=y0r;W4y+=h8m;var x4y=l98;x4y+=z5m;x4y+=R5m;x4y+=N6G;var u4y=G16.Q0r;u4y+=s1r;var E4y=G16.Q0r;E4y+=l6G;E4y+=m4r;var b4y=L8G;b4y+=o5m;b4y+=g0r;var h4y=F4r;h4y+=K5m;var N4y=F4r;N4y+=S18;var F4y=F4r;F4y+=p5m;F4y+=r5m;var M4y=D6G;M4y+=A88;M4y+=C6r;M4y+=d4r;var i4y=O0r;i4y+=m7G;var t1y=U3G;t1y+=v4r;t1y+=G16.e0r;t1y+=k7G;var s1y=G5G;s1y+=p2G;var X1y=L8G;X1y+=W4r;X1y+=l4r;X1y+=e1r;var O1y=f5m;O1y+=a5m;var L1y=i0G;L1y+=o4r;L1y+=h6G;L1y+=O1r;var V1y=e28;V1y+=o28;var S1y=c5m;S1y+=j5m;S1y+=a38;var T1y=G5G;T1y+=T4G;T1y+=z2G;var w1y=d4r;w1y+=l4r;w1y+=W4r;w1y+=l4r;var y1y=P2G;y1y+=k5m;var D1y=G5G;D1y+=T4G;D1y+=z2G;var I1y=i0G;I1y+=O1r;I1y+=O7G;I1y+=g0r;var m1y=G5G;m1y+=z2G;var g1y=g0r;g1y+=G16.e0r;g1y+=S5G;var H1y=H5m;H1y+=z2G;var k1y=l0G;k1y+=g0r;k1y+=N6G;var j1y=g5m;j1y+=a38;var c1y=L8G;c1y+=m5m;c1y+=d4r;var a1y=I5m;a1y+=S4G;var f1y=G5G;f1y+=T4G;f1y+=z2G;var r1y=t6G;r1y+=O1r;var p1y=G16.Q0r;p1y+=W4r;p1y+=O0r;p1y+=m4r;var K1y=e2G;K1y+=D5m;K1y+=y5m;K1y+=w5m;var o1y=G16.Q0r;o1y+=W4r;o1y+=O0r;o1y+=m4r;var R1y=T5m;R1y+=S5m;R1y+=V5m;R1y+=q2G;var z1y=L5m;z1y+=O5m;var A1y=X5m;A1y+=s5m;A1y+=t5m;var Q1y=b2G;Q1y+=H7G;Q1y+=z38;var n1y=O0r;n1y+=W4r;n1y+=e1r;var d1y=u4G;d1y+=y0r;d1y+=y0r;d1y+=O4r;var e1y=y0r;e1y+=l2m;var G1y=e1r;G1y+=W4r;G1y+=Z2m;G1y+=y0r;var C1y=G16.z0r;C1y+=f0r;C1y+=P2m;var J1y=G16.z0r;J1y+=f0r;J1y+=U4G;J1y+=o4r;var U1y=u4G;U1y+=c38;var Y1y=V0r;Y1y+=q2m;Y1y+=b4r;var W1y=a4r;W1y+=s7G;var x1y=B6G;x1y+=G16.e0r;x1y+=a4r;x1y+=c4r;var u1y=g0r;u1y+=v2m;u1y+=h6G;var E1y=B2m;E1y+=i2m;E1y+=G9m;E1y+=H6r;var b1y=V0G;b1y+=e1r;b1y+=n1r;var h1y=J3G;h1y+=M2m;var N1y=J3G;N1y+=M2m;var F1y=F2m;F1y+=V0r;var M1y=N2m;M1y+=G16.Q0r;M1y+=M9G;var i1y=G16.z0r;i1y+=O0r;i1y+=h2m;i1y+=a4r;var B1y=g0r;B1y+=G16.e0r;B1y+=G16.Q0r;B1y+=M9G;var v1y=O0r;v1y+=b2m;v1y+=E2m;v1y+=M9G;var q1y=V0r;q1y+=L0r;q1y+=t2G;var P1y=G48;P1y+=V0r;P1y+=b4r;init=$[P1y](D5G,{},Editor[j4G],init);this[y0r]=$[q1y](D5G,{},Editor[P7G][h3G],{table:init[v1y]||init[B1y],dbTable:init[u2m]||X3G,ajaxUrl:init[x2m],ajax:init[s28],idSrc:init[i1y],dataSource:init[M1y]||init[F1y]?Editor[N1y][U28]:Editor[h1y][b1y],formOptions:init[e48],legacyAjax:init[E1y],template:init[u1y]?$(init[e18])[x1y]():X3G});this[W1y]=$[Y1y](D5G,{},Editor[U1y]);this[J1y]=init[C1y];Editor[G1y][e1y][W2m]++;var that=this;var classes=this[d1y];this[n1y]={"wrapper":$(Q1y+classes[A3G]+o3G+A1y+classes[z1y][Y2m]+R1y+U2m+classes[o1y][A3G]+o3G+K1y+classes[p1y][r1y]+f1y+a1y+J2m+classes[c1y][A3G]+o3G+j1y+classes[C2m][k1y]+H1y+m3G+m3G)[a7r],"form":$(G2m+classes[h38][g1y]+m1y+e2m+classes[h38][I1y]+D1y+y1y)[a7r],"formError":$(d2m+classes[h38][w1y]+T1y)[a7r],"formInfo":$(n2m+classes[h38][R4G]+T48)[a7r],"header":$(S1y+classes[V1y][A3G]+Q2m+classes[v78][L1y]+A2m)[a7r],"buttons":$(O1y+classes[X1y][I78]+s1y)[a7r]};if($[J5G][t1y][z2m]){var Z4y=R2m;Z4y+=o2m;var l4y=O0r;l4y+=b58;l4y+=K2m;var ttButtons=$[J5G][l4y][Z4y][p2m];var i18n=this[m78];$[A5G]([O3G,r8m,a8m],function(i,val){var f2m="sButtonText";var r2m='editor_';var P4y=G16.Q0r;P4y+=d1r;P4y+=d78;P4y+=G16.R0r;ttButtons[r2m+val][f2m]=i18n[val][P4y];});}$[A5G](init[a2m],function(evt,fn){that[G16.R0r](evt,function(){var B4y=G6G;B4y+=G16.z0r;B4y+=L8G;B4y+=g0r;var v4y=y0r;v4y+=n1r;v4y+=G16.z0r;v4y+=U8G;var q4y=u8G;q4y+=w8G;q4y+=Q6r;var args=Array[q4y][v4y][a4G](arguments);args[B4y]();fn[K7G](that,args);});});var dom=this[i4y];var wrapper=dom[M4y];dom[F4y]=_editor_el(c2m,dom[N4y])[a7r];dom[h4y]=_editor_el(b4y,wrapper)[a7r];dom[E4y]=_editor_el(u4y,wrapper)[a7r];dom[x4y]=_editor_el(j2m,wrapper)[a7r];dom[S3G]=_editor_el(W4y,wrapper)[a7r];if(init[Y4y]){var U4y=G16.e0r;U4y+=O0r;U4y+=O0r;this[U4y](init[T28]);}$(document)[G16.R0r](k2m+this[y0r][W2m],function(e,settings,json){var g2m="_editor";var H2m="nTable";var J4y=k58;J4y+=k7G;if(that[y0r][J4y]&&settings[H2m]===$(that[y0r][G28])[A78](a7r)){settings[g2m]=that;}})[C4y](G4y+this[y0r][e4y],function(e,settings,json){var I2m="_optionsUpdate";var m2m="nT";var Q4y=S5G;Q4y+=V0r;Q4y+=g0r;var n4y=m2m;n4y+=G1r;var d4y=w78;d4y+=M9G;if(json&&that[y0r][d4y]&&settings[n4y]===$(that[y0r][G28])[Q4y](a7r)){that[I2m](json);}});try{var R4y=G16.z0r;R4y+=o4r;R4y+=G16.z0r;R4y+=g0r;var z4y=O0r;z4y+=G16.z0r;z4y+=P9G;z4y+=H68;var A4y=O0r;A4y+=G16.z0r;A4y+=y0r;A4y+=y7G;this[y0r][H4G]=Editor[A4y][init[z4y]][R4y](this);}catch(e){var y2m='Cannot find display controller ';var o4y=H0r;o4y+=D2m;o4y+=m4r;throw y2m+init[o4y];}this[K4y](p4y,[]);};Editor[r4y][R08]=function(){var L2m="addClas";var V2m="Cl";var S2m="actions";var m4y=s68;m4y+=W4r;m4y+=w2m;var c4y=G9m;c4y+=T2m;var a4y=V0r;a4y+=O0r;a4y+=G16.z0r;a4y+=g0r;var f4y=M6r;f4y+=w58;f4y+=C6r;f4y+=X88;var classesActions=this[e0G][S2m];var action=this[y0r][z08];var wrapper=$(this[G7G][f4y]);wrapper[E0G]([classesActions[K8m],classesActions[a4y],classesActions[T1G]][c4y](z3G));if(action===K8m){var k4y=a4r;k4y+=o8G;k4y+=b58;k4y+=V0r;var j4y=A28;j4y+=V2m;j4y+=c58;j4y+=y0r;wrapper[j4y](classesActions[k4y]);}else if(action===i38){var g4y=V0r;g4y+=r18;var H4y=A28;H4y+=v88;H4y+=L2G;wrapper[H4y](classesActions[g4y]);}else if(action===m4y){var I4y=L2m;I4y+=y0r;wrapper[I4y](classesActions[T1G]);}};Editor[R7G][O2m]=function(data,success,error,submitParams){var r3m='?';var p3m="param";var K3m="dexO";var o3m="deleteBody";var R3m="nc";var z3m="fu";var n3m="comp";var d3m="if";var G3m="complete";var C3m="url";var J3m="Of";var Y3m=/_id_/;var u3m=',';var P3m="Url";var t2m="unct";var s2m="ELETE";var X2m="eteBo";var u6y=Z1r;u6y+=n1r;u6y+=X2m;u6y+=z5m;var E6y=M1r;E6y+=s2m;var b6y=I6r;b6y+=C6r;b6y+=V0r;var M6y=d1r;M6y+=l4r;M6y+=n1r;var t4y=y0r;t4y+=t5G;t4y+=G16.z0r;t4y+=q5G;var X4y=L8G;X4y+=t2m;X4y+=J9G;X4y+=o4r;var L4y=H78;L4y+=l3m;L4y+=m4r;var V4y=Z3m;V4y+=a4r;var S4y=s28;S4y+=P3m;var T4y=G16.e0r;T4y+=G9m;T4y+=G16.e0r;T4y+=L0r;var that=this;var action=this[y0r][z08];var thrown;var opts={type:w08,dataType:g9m,data:X3G,error:[function(xhr,text,err){thrown=err;}],success:[],complete:[function(xhr,text){var b3m="responseText";var h3m="parseJSON";var N3m="responseJSON";var F3m="nseJSON";var M3m="respo";var i3m='null';var v3m="seText";var q3m="resp";var b0r=204;var D4y=q3m;D4y+=G16.R0r;D4y+=v3m;var json=X3G;if(xhr[B3m]===b0r||xhr[D4y]===i3m){json={};}else{try{var y4y=M3m;y4y+=F3m;json=xhr[y4y]?xhr[N3m]:$[h3m](xhr[b3m]);}catch(e){}}if($[h1G](json)||$[a1G](json)){var w4y=A4r;w4y+=G16.e0r;w4y+=g0r;w4y+=i8m;success(json,xhr[w4y]>=E0r,xhr);}else{error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[y0r][T4y]||this[y0r][S4y];var id=action===r8m||action===a8m?_pluck(this[y0r][m28],V4y):X3G;if($[L4y](id)){var O4y=G9m;O4y+=E3m;O4y+=o4r;id=id[O4y](u3m);}if($[h1G](ajaxSrc)&&ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc===X4y){var uri=X3G;var method=X3G;if(this[y0r][x2m]){var s4y=E68;s4y+=g0r;s4y+=V0r;var url=this[y0r][x2m];if(url[s4y]){uri=url[action];}if(uri[x3m](z3G)!==-c7r){a=uri[W3m](z3G);method=a[a7r];uri=a[c7r];}uri=uri[p1G](Y3m,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc===t4y){var l6y=G16.z0r;l6y+=o4r;l6y+=U3m;l6y+=J3m;if(ajaxSrc[l6y](z3G)!==-c7r){var Z6y=g0r;Z6y+=m4r;Z6y+=D0r;a=ajaxSrc[W3m](z3G);opts[Z6y]=a[a7r];opts[C3m]=a[c7r];}else{opts[C3m]=ajaxSrc;}}else{var B6y=V0r;B6y+=b5m;B6y+=m0r;var optsCopy=$[F3G]({},ajaxSrc||{});if(optsCopy[G3m]){var v6y=e3m;v6y+=e5m;var q6y=p4G;q6y+=c4r;q6y+=d3m;q6y+=g0r;var P6y=n3m;P6y+=Q3m;opts[P6y][q6y](optsCopy[v6y]);delete optsCopy[G3m];}if(optsCopy[B6y]){var i6y=d4r;i6y+=l4r;i6y+=W4r;i6y+=l4r;opts[N0G][A3m](optsCopy[N0G]);delete optsCopy[i6y];}opts=$[F3G]({},opts,optsCopy);}opts[C3m]=opts[M6y][p1G](Y3m,id);if(opts[U3G]){var h6y=V0r;h6y+=u38;h6y+=O0r;var N6y=O0r;N6y+=G16.e0r;N6y+=g0r;N6y+=G16.e0r;var F6y=z3m;F6y+=R3m;F6y+=z1r;F6y+=G16.R0r;var isFn=typeof opts[U3G]===F6y;var newData=isFn?opts[N6y](data):opts[U3G];data=isFn&&newData?newData:$[h6y](D5G,data,newData);}opts[U3G]=data;if(opts[b6y]===E6y&&(opts[o3m]===undefined||opts[u6y]===D5G)){var J6y=b18;J6y+=k58;var U6y=G16.z0r;U6y+=o4r;U6y+=K3m;U6y+=L8G;var Y6y=d1r;Y6y+=l4r;Y6y+=n1r;var W6y=d1r;W6y+=l4r;W6y+=n1r;var x6y=O0r;x6y+=G16.e0r;x6y+=g0r;x6y+=G16.e0r;var params=$[p3m](opts[x6y]);opts[W6y]+=opts[Y6y][U6y](r3m)===-c7r?r3m+params:o1G+params;delete opts[J6y];}$[s28](opts);};Editor[R7G][E88]=function(target,style,time,callback){var a3m="stop";var f3m="anim";var C6y=G16.e0r;C6y+=f58;if($[J5G][C6y]){var G6y=f3m;G6y+=b58;G6y+=V0r;target[a3m]()[G6y](style,time,callback);}else{target[A4G](style);if(typeof time===c7G){time[a4G](target);}else if(callback){var e6y=a4r;e6y+=G16.e0r;e6y+=n1r;e6y+=n1r;callback[e6y](target);}}};Editor[d6y][f08]=function(){var k3m="formErro";var j3m="dyContent";var c3m="formIn";var f6y=H48;f6y+=b4r;var r6y=c3m;r6y+=F4r;var p6y=y6G;p6y+=V0r;p6y+=b4r;var K6y=l98;K6y+=j3m;var o6y=e38;o6y+=g0r;o6y+=F9G;var R6y=H48;R6y+=b4r;var z6y=k3m;z6y+=l4r;var A6y=G16.e0r;A6y+=L48;var Q6y=X6G;Q6y+=G16.e0r;Q6y+=o28;var n6y=C6r;n6y+=l4r;n6y+=m08;n6y+=s3G;var dom=this[G7G];$(dom[A3G])[n6y](dom[Q6y]);$(dom[C2m])[A6y](dom[z6y])[R6y](dom[o6y]);$(dom[K6y])[p6y](dom[r6y])[f6y](dom[h38]);};Editor[a6y][c6y]=function(){var w3m="ubm";var I3m="onB";var m3m="eBlur";var H3m="bmi";var I6y=y0r;I6y+=d1r;I6y+=H3m;I6y+=g0r;var m6y=g3m;m6y+=W4r;m6y+=o4r;var g6y=g6r;g6y+=m3m;var H6y=w1r;H6y+=B18;var k6y=I3m;k6y+=B38;k6y+=l4r;var j6y=D3m;j6y+=y3m;var opts=this[y0r][j6y];var onBlur=opts[k6y];if(this[H6y](g6y)===g5G){return;}if(typeof onBlur===m6y){onBlur(this);}else if(onBlur===I6y){var D6y=y0r;D6y+=w3m;D6y+=G16.z0r;D6y+=g0r;this[D6y]();}else if(onBlur===I4G){this[u78]();}};Editor[y6y][r68]=function(){var V6y=K6r;V6y+=y0r;V6y+=G16.e0r;V6y+=a9G;var S6y=V0r;S6y+=G16.e0r;S6y+=a4r;S6y+=c4r;var T6y=N08;T6y+=y0r;var w6y=V0r;w6y+=l4r;w6y+=l4r;w6y+=m0r;if(!this[y0r]){return;}var errorClass=this[e0G][N08][w6y];var fields=this[y0r][T6y];$(O48+errorClass,this[G7G][A3G])[E0G](errorClass);$[S6y](fields,function(name,field){field[N0G](N5G)[w3G](N5G);});this[N0G](N5G)[V6y](N5G);};Editor[L6y][O6y]=function(submitComplete,mode){var t3m="eIcb";var X3m="closeCb";var O3m='preClose';var L3m="Cb";var V3m="eIc";var S3m="r-focus";var T3m="focus.edi";var v8v=a4r;v8v+=Y9G;v8v+=y0r;v8v+=V0r;var q8v=w1r;q8v+=V0r;q8v+=U7G;q8v+=N6G;var P8v=T3m;P8v+=b8G;P8v+=S3m;var Z8v=W4r;Z8v+=L8G;Z8v+=L8G;var s6y=p98;s6y+=V3m;s6y+=G16.Q0r;var X6y=x6G;X6y+=L3m;if(this[a9m](O3m)===g5G){return;}if(this[y0r][X6y]){this[y0r][X3m](submitComplete,mode);this[y0r][X3m]=X3G;}if(this[y0r][s6y]){var l8v=x9G;l8v+=h8G;l8v+=s3m;l8v+=G16.Q0r;var t6y=p98;t6y+=t3m;this[y0r][t6y]();this[y0r][l8v]=X3G;}$(V7G)[Z8v](P8v);this[y0r][z18]=g5G;this[q8v](v8v);};Editor[B8v][i8v]=function(fn){var M8v=a4r;M8v+=V6G;M8v+=v88;M8v+=G16.Q0r;this[y0r][M8v]=fn;};Editor[F8v][N8v]=function(arg1,arg2,arg3,arg4){var q7m="butt";var Z7m="ainO";var x8v=e1r;x8v+=G16.e0r;x8v+=G16.z0r;x8v+=o4r;var u8v=V0r;u8v+=l7m;u8v+=O7G;u8v+=O0r;var h8v=U9m;h8v+=Z7m;h8v+=W38;var that=this;var title;var buttons;var show;var opts;if($[h8v](arg1)){opts=arg1;}else if(typeof arg1===Y38){show=arg1;opts=arg2;}else{title=arg1;buttons=arg2;show=arg3;opts=arg4;}if(show===undefined){show=D5G;}if(title){var b8v=z1r;b8v+=P7m;that[b8v](title);}if(buttons){var E8v=q7m;E8v+=W4r;E8v+=E38;that[E8v](buttons);}return{opts:$[u8v]({},this[y0r][e48][x8v],opts),maybeOpen:function(){var v7m="open";if(show){that[v7m]();}}};};Editor[W8v][Y8v]=function(name){var B7m="shift";var J8v=U3G;J8v+=F38;var U8v=x5m;U8v+=n1r;U8v+=n1r;var args=Array[R7G][o7G][U8v](arguments);args[B7m]();var fn=this[y0r][J8v][name];if(fn){return fn[K7G](this,args);}};Editor[C8v][G8v]=function(includeFields){var F7m="inc";var M7m="formContent";var i7m="playOr";var c8v=C1r;c8v+=i7m;c8v+=Z1r;c8v+=l4r;var a8v=p18;a8v+=T68;var f8v=e1r;f8v+=G16.e0r;f8v+=G16.z0r;f8v+=o4r;var n8v=V0r;n8v+=j6r;n8v+=c4r;var e8v=O0r;e8v+=W4r;e8v+=e1r;var that=this;var formContent=$(this[e8v][M7m]);var fields=this[y0r][T28];var order=this[y0r][V28];var template=this[y0r][e18];var mode=this[y0r][n9G]||j18;if(includeFields){var d8v=F7m;d8v+=n1r;d8v+=d1r;d8v+=N7m;this[y0r][d8v]=includeFields;}else{includeFields=this[y0r][W78];}formContent[X38]()[L0G]();$[n8v](order,function(i,fieldOrName){var W7m='editor-field[name="';var u7m="mplate=\"";var E7m="[data-editor-te";var h7m="_weakI";var A8v=h7m;A8v+=b7m;var Q8v=R9G;Q8v+=B3G;var name=fieldOrName instanceof Editor[Q8v]?fieldOrName[E3G]():fieldOrName;if(that[A8v](name,includeFields)!==-c7r){if(template&&mode===j18){var p8v=o4r;p8v+=W4r;p8v+=O0r;p8v+=V0r;var K8v=A88;K8v+=C6r;K8v+=s3G;var o8v=E7m;o8v+=u7m;var R8v=u1G;R8v+=O0r;R8v+=V0r;var z8v=x7m;z8v+=g0r;z8v+=V0r;z8v+=l4r;template[F18](W7m+name+Y7m)[z8v](fields[name][R8v]());template[F18](o8v+name+Y7m)[K8v](fields[name][p8v]());}else{var r8v=A88;r8v+=C6r;r8v+=V0r;r8v+=b4r;formContent[r8v](fields[name][k08]());}}});if(template&&mode===f8v){template[O38](formContent);}this[a8v](c8v,[this[y0r][z18],this[y0r][z08],formContent]);};Editor[j8v][U7m]=function(items,editFields,type,formOptions,setupDone){var o7m='initEdit';var R7m="toString";var G7m="sli";var C7m="Reorder";var J7m="nod";var v9v=b18;v9v+=k58;var q9v=J7m;q9v+=V0r;var P9v=V6r;P9v+=t8G;P9v+=u58;P9v+=C7m;var Z9v=n1r;Z9v+=Y0G;var l9v=G7m;l9v+=U8G;var t8v=X28;t8v+=d4r;var D8v=u28;D8v+=a4r;D8v+=c4r;var I8v=e1r;I8v+=S8G;var m8v=H0r;m8v+=e7m;m8v+=e1G;m8v+=m4r;var g8v=O0r;g8v+=W4r;g8v+=e1r;var H8v=V0r;H8v+=O0r;H8v+=G16.z0r;H8v+=g0r;var k8v=x28;k8v+=G16.z0r;k8v+=W4r;k8v+=o4r;var that=this;var fields=this[y0r][T28];var usedFields=[];var includeInOrder;var editData={};this[y0r][m28]=editFields;this[y0r][d7m]=editData;this[y0r][n28]=items;this[y0r][k8v]=H8v;this[g8v][h38][X98][m8v]=z4G;this[y0r][I8v]=type;this[R08]();$[D8v](fields,function(name,field){var X8v=K28;X8v+=p28;field[I28]();includeInOrder=g5G;editData[name]={};$[A5G](editFields,function(idSrc,edit){var z7m="yFields";var A7m="ayFi";var Q7m="ope";var n7m="sc";if(edit[T28][name]){var T8v=n7m;T8v+=Q7m;var w8v=y0r;w8v+=l68;w8v+=a4r;w8v+=V0r;var y8v=O0r;y8v+=G16.e0r;y8v+=k58;var val=field[G3G](edit[y8v]);editData[name][idSrc]=val===X3G?N5G:$[a1G](val)?val[w8v]():val;if(!formOptions||formOptions[T8v]===y4G){var S8v=O0r;S8v+=V0r;S8v+=L8G;field[G68](idSrc,val!==undefined?val:field[S8v]());if(!edit[n48]||edit[n48][name]){includeInOrder=D5G;}}else{var L8v=s4G;L8v+=A7m;L8v+=B3G;L8v+=y0r;var V8v=s4G;V8v+=G16.e0r;V8v+=z7m;if(!edit[V8v]||edit[L8v][name]){var O8v=O0r;O8v+=V0r;O8v+=L8G;field[G68](idSrc,val!==undefined?val:field[O8v]());includeInOrder=D5G;}}}});if(field[U0G]()[X8v]!==a7r&&includeInOrder){var s8v=C6r;s8v+=i8m;s8v+=c4r;usedFields[s8v](name);}});var currOrder=this[t8v]()[l9v]();for(var i=currOrder[Z9v]-c7r;i>=a7r;i--){if($[N1G](currOrder[i][R7m](),usedFields)===-c7r){currOrder[b08](i,c7r);}}this[P9v](currOrder);this[a9m](o7m,[_pluck(editFields,q9v)[a7r],_pluck(editFields,v9v)[a7r],items,type],function(){var K7m="nitMultiEdi";var i9v=G16.z0r;i9v+=K7m;i9v+=g0r;var B9v=w1r;B9v+=w6r;B9v+=g0r;that[B9v](i9v,[editFields,items,type],function(){setupDone();});});};Editor[R7G][M9v]=function(trigger,args,promiseComplete){var g7m="result";var H7m='Cancelled';var k7m="Event";var j7m='pre';var c7m="triggerHandler";var a7m="Eve";var f7m="sult";var r7m="esul";var F9v=G16.z0r;F9v+=p7m;if(!args){args=[];}if($[F9v](trigger)){for(var i=a7r,ien=trigger[H5G];i<ien;i++){var N9v=w1r;N9v+=l8m;N9v+=o4r;N9v+=g0r;this[N9v](trigger[i],args);}}else{var u9v=l4r;u9v+=r7m;u9v+=g0r;var b9v=o8G;b9v+=f7m;var h9v=a7m;h9v+=o4r;h9v+=g0r;var e=$[h9v](trigger);$(this)[c7m](e,args);if(trigger[x3m](j7m)===a7r&&e[b9v]===g5G){$(this)[c7m]($[k7m](trigger+H7m),args);}if(promiseComplete){var E9v=g0r;E9v+=c4r;E9v+=V0r;E9v+=o4r;if(e[g7m]&&typeof e[g7m]===G16.r0r&&e[g7m][E9v]){e[g7m][x18](promiseComplete);}else{promiseComplete();}}return e[u9v];}};Editor[x9v][A68]=function(input){var D7m="substring";var I7m="toLowerCase";var m7m=/^on([A-Z])/;var W9v=e7m;W9v+=n1r;W9v+=G16.z0r;W9v+=g0r;var name;var names=input[W9v](z3G);for(var i=a7r,ien=names[H5G];i<ien;i++){var Y9v=B9m;Y9v+=g0r;Y9v+=a4r;Y9v+=c4r;name=names[i];var onStyle=name[Y9v](m7m);if(onStyle){name=onStyle[c7r][I7m]()+name[D7m](k7r);}names[i]=name;}return names[m68](z3G);};Editor[R7G][U9v]=function(node){var J9v=X8G;J9v+=u08;var foundField=X3G;$[A5G](this[y0r][J9v],function(name,field){var C9v=n1r;C9v+=V0r;C9v+=y7m;C9v+=c4r;if($(field[k08]())[F18](node)[C9v]){foundField=field;}});return foundField;};Editor[G9v][x08]=function(fieldNames){var e9v=H78;e9v+=b5m;e9v+=H68;if(fieldNames===undefined){return this[T28]();}else if(!$[e9v](fieldNames)){return[fieldNames];}return fieldNames;};Editor[R7G][x78]=function(fieldsIn,focus){var X7m=/^jq:/;var O7m='div.DTE ';var L7m="dexOf";var V7m="q:";var T7m="numb";var w7m="etFoc";var o9v=y0r;o9v+=w7m;o9v+=d1r;o9v+=y0r;var Q9v=T7m;Q9v+=d4r;var that=this;var field;var fields=$[o18](fieldsIn,function(fieldOrName){var S7m="rin";var n9v=X8G;n9v+=V0r;n9v+=S0r;var d9v=y0r;d9v+=g0r;d9v+=S7m;d9v+=S5G;return typeof fieldOrName===d9v?that[y0r][n9v][fieldOrName]:fieldOrName;});if(typeof focus===Q9v){field=fields[focus];}else if(focus){var z9v=G9m;z9v+=V7m;var A9v=G16.z0r;A9v+=o4r;A9v+=L7m;if(focus[A9v](z9v)===a7r){var R9v=G1G;R9v+=e1G;R9v+=U8G;field=$(O7m+focus[R9v](X7m,N5G));}else{field=this[y0r][T28][focus];}}this[y0r][o9v]=field;if(field){field[C7G]();}};Editor[R7G][H38]=function(opts){var R0m="ubmit";var A0m="canRe";var n0m="activeElement";var G0m="messa";var C0m="onBackground";var J0m="urOnBackgr";var Y0m="onRetur";var W0m="urn";var x0m="submitOnRe";var E0m="onBlur";var b0m="submitOnBlur";var F0m='.dteInline';var M0m="OnComplete";var i0m="eturn";var B0m="submitOnR";var v0m="ackgroun";var q0m="OnB";var P0m="ditOpts";var Z0m="itCount";var l0m="ring";var t7m="ssage";var s7m="messag";var M5v=W4r;M5v+=o4r;var l5v=l98;l5v+=l2G;l5v+=V0r;l5v+=Z4G;var t9v=e38;t9v+=g0r;t9v+=G16.R0r;t9v+=y0r;var X9v=s7m;X9v+=V0r;var O9v=q9G;O9v+=h8m;var L9v=h1r;L9v+=t7m;var S9v=g3m;S9v+=G16.R0r;var T9v=A4r;T9v+=l0m;var w9v=V0r;w9v+=O0r;w9v+=Z0m;var y9v=V0r;y9v+=P0m;var m9v=E8G;m9v+=q0m;m9v+=v0m;m9v+=O0r;var c9v=B0m;c9v+=i0m;var K9v=x6G;K9v+=M0m;var that=this;var inlineCount=__inlineCounter++;var namespace=F0m+inlineCount;if(opts[K9v]!==undefined){var r9v=a4r;r9v+=n1r;r9v+=N0m;r9v+=V0r;var p9v=H7G;p9v+=N0m;p9v+=V0r;p9v+=M0m;opts[h0m]=opts[p9v]?r9v:L7G;}if(opts[b0m]!==undefined){var a9v=H7G;a9v+=W4r;a9v+=y0r;a9v+=V0r;var f9v=Y5m;f9v+=W6r;opts[E0m]=opts[b0m]?f9v:a9v;}if(opts[c9v]!==undefined){var g9v=o4r;g9v+=W4r;g9v+=o4r;g9v+=V0r;var H9v=u0m;H9v+=B6r;var k9v=x0m;k9v+=g0r;k9v+=W0m;var j9v=Y0m;j9v+=o4r;opts[j9v]=opts[k9v]?H9v:g9v;}if(opts[m9v]!==undefined){var D9v=U0m;D9v+=V0r;var I9v=q0G;I9v+=J0m;I9v+=Q88;opts[C0m]=opts[I9v]?Z38:D9v;}this[y0r][y9v]=opts;this[y0r][w9v]=inlineCount;if(typeof opts[U8m]===T9v||typeof opts[U8m]===S9v){var V9v=g0r;V9v+=G16.z0r;V9v+=P7m;this[U8m](opts[V9v]);opts[U8m]=D5G;}if(typeof opts[L9v]===O9v||typeof opts[X9v]===c7G){var s9v=G0m;s9v+=a9G;this[w3G](opts[s9v]);opts[w3G]=D5G;}if(typeof opts[t9v]!==l5v){var Z5v=e38;Z5v+=b8G;Z5v+=E38;this[I78](opts[I78]);opts[Z5v]=D5G;}$(document)[G16.R0r](e0m+namespace,function(e){var f0m="Default";var r0m="revent";var p0m="canReturnSubmit";var K0m="rom";var o0m="_fieldF";var z0m="turnS";var d0m="keyCo";var P5v=d0m;P5v+=O0r;P5v+=V0r;if(e[P5v]===T7r&&that[y0r][z18]){var el=$(document[n0m]);if(el){var B5v=E18;B5v+=a4r;B5v+=Q0m;B5v+=o4r;var v5v=A0m;v5v+=z0m;v5v+=R0m;var q5v=o0m;q5v+=K0m;q5v+=C4r;q5v+=S8G;var field=that[q5v](el);if(field&&typeof field[v5v]===B5v&&field[p0m](el)){var i5v=C6r;i5v+=r0m;i5v+=f0m;e[i5v]();}}}});$(document)[M5v](P08+namespace,function(e){var X0m="eyC";var O0m="onEsc";var L0m="tDef";var V0m="prev";var S0m="onReturn";var T0m="preventDefault";var y0m="onRetu";var D0m="romNo";var I0m="dF";var m0m="_fiel";var g0m="Submit";var k0m="eturnSubmit";var j0m="canR";var c0m="orm_Button";var B0r=39;var v0r=37;var n5v=n1r;n5v+=O7G;n5v+=g68;n5v+=c4r;var d5v=a0m;d5v+=a1r;d5v+=c0m;d5v+=y0r;var F5v=C1r;F5v+=Z9G;var el=$(document[n0m]);if(e[v08]===T7r&&that[y0r][F5v]){var E5v=j0m;E5v+=k0m;var b5v=E18;b5v+=H0m;var h5v=A0m;h5v+=g0r;h5v+=W0m;h5v+=g0m;var N5v=m0m;N5v+=I0m;N5v+=D0m;N5v+=Z1r;var field=that[N5v](el);if(field&&typeof field[h5v]===b5v&&field[E5v](el)){var Y5v=E18;Y5v+=a4r;Y5v+=P88;var x5v=y0r;x5v+=R0m;var u5v=y0m;u5v+=l4r;u5v+=o4r;if(opts[u5v]===x5v){var W5v=y0r;W5v+=w0m;W5v+=g0r;e[T0m]();that[W5v]();}else if(typeof opts[S0m]===Y5v){var U5v=V0m;U5v+=O7G;U5v+=L0m;U5v+=a7G;e[U5v]();opts[S0m](that,e);}}}else if(e[v08]===t7r){var G5v=P38;G5v+=q38;var C5v=H7G;C5v+=W4r;C5v+=y0r;C5v+=V0r;var J5v=G16.A0r;J5v+=W28;e[T0m]();if(typeof opts[O0m]===J5v){opts[O0m](that,e);}else if(opts[O0m]===Z38){that[E8G]();}else if(opts[O0m]===C5v){that[x6G]();}else if(opts[O0m]===G5v){var e5v=y0r;e5v+=W1r;e5v+=q38;that[e5v]();}}else if(el[h68](d5v)[n5v]){var Q5v=F4G;Q5v+=X0m;Q5v+=l6G;Q5v+=V0r;if(e[Q5v]===v0r){var z5v=L8G;z5v+=W4r;z5v+=R0G;z5v+=y0r;var A5v=C6r;A5v+=l4r;A5v+=V0r;A5v+=U7G;el[A5v](M8m)[z5v]();}else if(e[v08]===B0r){var R5v=L8G;R5v+=W4r;R5v+=a4r;R5v+=i8m;el[s0m](M8m)[R5v]();}}});this[y0r][t0m]=function(){var o5v=W4r;o5v+=L8G;o5v+=L8G;$(document)[b78](e0m+namespace);$(document)[o5v](P08+namespace);};return namespace;};Editor[K5v][p5v]=function(direction,action,data){var Z1m='send';var l1m="legacyAjax";if(!this[y0r][l1m]||!data){return;}if(direction===Z1m){var r5v=E28;r5v+=z8G;if(action===r5v||action===r8m){var j5v=V0r;j5v+=O0r;j5v+=G16.z0r;j5v+=g0r;var c5v=O0r;c5v+=G16.e0r;c5v+=g0r;c5v+=G16.e0r;var f5v=b18;f5v+=k58;var id;$[A5G](data[f5v],function(rowId,values){var q1m=" Multi-row editing is not supported by the legacy Ajax data format";var P1m="Editor:";if(id!==undefined){var a5v=P1m;a5v+=q1m;throw a5v;}id=rowId;});data[U3G]=data[c5v][id];if(action===j5v){var k5v=G16.z0r;k5v+=O0r;data[k5v]=id;}}else{var g5v=O0r;g5v+=b58;g5v+=G16.e0r;var H5v=e1r;H5v+=G16.e0r;H5v+=C6r;data[u3G]=$[H5v](data[g5v],function(values,id){return id;});delete data[U3G];}}else{var D5v=J3G;D5v+=G16.e0r;var m5v=l4r;m5v+=W4r;m5v+=M6r;if(!data[U3G]&&data[m5v]){var I5v=J3G;I5v+=G16.e0r;data[I5v]=[data[d28]];}else if(!data[D5v]){data[U3G]=[];}}};Editor[R7G][y5v]=function(json){var that=this;if(json[v1m]){var T5v=X8G;T5v+=V0r;T5v+=n1r;T5v+=n4G;var w5v=V0r;w5v+=G16.e0r;w5v+=P28;$[w5v](this[y0r][T5v],function(name,field){var S5v=V1G;S5v+=Q0m;S5v+=o4r;S5v+=y0r;if(json[S5v][name]!==undefined){var V5v=d1r;V5v+=a6r;var fieldInst=that[N08](name);if(fieldInst&&fieldInst[V5v]){var O5v=V1G;O5v+=g0r;O5v+=M4r;var L5v=e9m;L5v+=J3G;L5v+=V0r;fieldInst[L5v](json[O5v][name]);}}});}};Editor[X5v][s5v]=function(el,msg){var F1m="fa";var M1m="isplay";var i1m="fadeO";var B1m="anima";var l2v=B1m;l2v+=g0r;l2v+=V0r;var t5v=L8G;t5v+=o4r;var canAnimate=$[t5v][l2v]?D5G:g5G;if(typeof msg===c7G){var P2v=g0r;P2v+=G16.e0r;P2v+=k7G;var Z2v=K4r;Z2v+=C6r;Z2v+=G16.z0r;msg=msg(this,new DataTable[Z2v](this[y0r][P2v]));}el=$(el);if(canAnimate){var q2v=y0r;q2v+=n58;el[q2v]();}if(!msg){if(this[y0r][z18]&&canAnimate){var v2v=i1m;v2v+=D1r;el[v2v](function(){el[O0G](N5G);});}else{var B2v=V0G;B2v+=V78;el[B2v](N5G)[A4G](l7G,L7G);}}else{var i2v=O0r;i2v+=M1m;i2v+=e3G;if(this[y0r][i2v]&&canAnimate){var M2v=F1m;M2v+=O0r;M2v+=N1m;M2v+=o4r;el[O0G](msg)[M2v]();}else{var F2v=q0G;F2v+=W4r;F2v+=a4r;F2v+=F4G;el[O0G](msg)[A4G](l7G,F2v);}}};Editor[R7G][N2v]=function(){var u1m="isMultiValue";var E1m="sMultiValue";var b1m="oShown";var h1m="clu";var b2v=M9G;b2v+=P1G;var h2v=V8G;h2v+=h1m;h2v+=N7m;var fields=this[y0r][T28];var include=this[y0r][h2v];var show=D5G;var state;if(!include){return;}for(var i=a7r,ien=include[b2v];i<ien;i++){var u2v=F7G;u2v+=i58;u2v+=L8G;u2v+=b1m;var E2v=G16.z0r;E2v+=E1m;var field=fields[include[i]];var multiEditable=field[x7G]();if(field[E2v]()&&multiEditable&&show){state=D5G;show=g5G;}else if(field[u1m]()&&!multiEditable){state=D5G;}else{state=g5G;}fields[include[i]][u2v](state);}};Editor[x2v][b68]=function(type){var r1m="_multiInfo";var Q1m='focus.editor-focus';var e1m="captureFocus";var C1m="ernal";var J1m="or-int";var U1m=".edit";var Y1m="rnal";var W1m="or-inte";var x1m="submit.edit";var K2v=G16.e0r;K2v+=u18;K2v+=o4r;var o2v=w1r;o2v+=V0r;o2v+=w2m;o2v+=O1r;var C2v=x1m;C2v+=W1m;C2v+=Y1m;var J2v=W4r;J2v+=o4r;var U2v=l4G;U2v+=U1m;U2v+=J1m;U2v+=C1m;var Y2v=L8G;Y2v+=G1m;var W2v=O0r;W2v+=W4r;W2v+=e1r;var that=this;var focusCapture=this[y0r][H4G][e1m];if(focusCapture===undefined){focusCapture=D5G;}$(this[W2v][Y2v])[b78](U2v)[J2v](C2v,function(e){var n1m="efault";var d1m="preventD";var G2v=d1m;G2v+=n1m;e[G2v]();});if(focusCapture&&(type===j18||type===J38)){var e2v=G16.Q0r;e2v+=W4r;e2v+=O0r;e2v+=m4r;$(e2v)[G16.R0r](Q1m,function(){var p1m="setFocus";var K1m="focu";var o1m="Fo";var R1m="ctiveElement";var z1m="activeElemen";var A1m="TE";var A2v=a0m;A2v+=A1m;A2v+=M1r;var Q2v=z1m;Q2v+=g0r;var n2v=S58;n2v+=M1r;n2v+=v4r;n2v+=k0r;var d2v=G16.e0r;d2v+=R1m;if($(document[d2v])[h68](n2v)[H5G]===a7r&&$(document[Q2v])[h68](A2v)[H5G]===a7r){var z2v=I1G;z2v+=o1m;z2v+=p0G;if(that[y0r][z2v]){var R2v=K1m;R2v+=y0r;that[y0r][p1m][R2v]();}}});}this[r1m]();this[o2v](R18,[type,this[y0r][K2v]]);return D5G;};Editor[p2v][g38]=function(type){var H1m="namicI";var k1m="arDy";var j1m="_cle";var c1m="pen";var a1m="ancel";var f1m="Op";var r2v=x9m;r2v+=f1m;r2v+=O7G;if(this[a9m](r2v,[type,this[y0r][z08]])===g5G){var k2v=x6G;k2v+=s3m;k2v+=G16.Q0r;var j2v=e1r;j2v+=W4r;j2v+=O0r;j2v+=V0r;var c2v=e1r;c2v+=S8G;var a2v=a4r;a2v+=a1m;a2v+=q8m;a2v+=c1m;var f2v=j1m;f2v+=k1m;f2v+=H1m;f2v+=o6r;this[f2v]();this[a9m](a2v,[type,this[y0r][z08]]);if((this[y0r][c2v]===g1m||this[y0r][j2v]===J38)&&this[y0r][k2v]){this[y0r][t0m]();}this[y0r][t0m]=X3G;return g5G;}this[y0r][z18]=type;return D5G;};Editor[H2v][m1m]=function(processing){var T1m='processing';var w1m="DT";var D1m="ggleC";var I1m="ocessin";var w2v=i5m;w2v+=o4r;w2v+=g0r;var y2v=g6r;y2v+=I1m;y2v+=S5G;var D2v=b8G;D2v+=D1m;D2v+=L2G;var I2v=y1m;I2v+=w1m;I2v+=k0r;var m2v=j6r;m2v+=z1r;m2v+=U7G;m2v+=V0r;var g2v=a4r;g2v+=e1G;g2v+=c38;var procClass=this[g2v][S3G][m2v];$([I2v,this[G7G][A3G]])[D2v](procClass,processing);this[y0r][y2v]=processing;this[w2v](T1m,[processing]);};Editor[R7G][S1m]=function(successCallback,errorCallback,formatdata,hide){var n4m="proc";var d4m='preSubmit';var e4m="_legacyAjax";var G4m="nCom";var C4m="ose";var J4m="onComp";var U4m="cessi";var Y4m="itComplete";var P4m="creat";var Z4m="allIfChang";var l4m="Sou";var t1m="Cou";var s1m="itOp";var O1m="db";var V1m="bmitTable";var R3v=a4r;R3v+=J7G;R3v+=n1r;var z3v=x6r;z3v+=V1m;var Q3v=i5m;Q3v+=o4r;Q3v+=g0r;var n3v=y0r;n3v+=V0r;n3v+=o4r;n3v+=O0r;var e3v=o8G;e3v+=k8G;var t2v=V0r;t2v+=O0r;t2v+=G16.z0r;t2v+=g0r;var s2v=L1m;s2v+=q6r;var X2v=O1m;X2v+=X1m;X2v+=M9G;var O2v=e3G;O2v+=s1m;O2v+=g0r;O2v+=y0r;var L2v=i38;L2v+=t1m;L2v+=O1r;var V2v=U68;V2v+=n4G;var S2v=U3G;S2v+=l4m;S2v+=l8G;var T2v=W4r;T2v+=J8m;var that=this;var i,iLen,eventRet,errorNodes;var changed=g5G,allData={},changedData={};var setBuilder=DataTable[G48][T2v][Q3G];var dataSource=this[y0r][S2v];var fields=this[y0r][V2v];var editCount=this[y0r][L2v];var modifier=this[y0r][n28];var editFields=this[y0r][m28];var editData=this[y0r][d7m];var opts=this[y0r][O2v];var changedSubmit=opts[l4G];var submitParamsLocal;var action=this[y0r][z08];var submitParams={"action":action,"data":{}};if(this[y0r][X2v]){submitParams[G28]=this[y0r][u2m];}if(action===s2v||action===t2v){var E3v=Z4m;E3v+=e3G;var b3v=P4m;b3v+=V0r;$[A5G](editFields,function(idSrc,edit){var B4m="ect";var v4m="isEmptyO";var q4m="sEmptyObjec";var h3v=G16.z0r;h3v+=q4m;h3v+=g0r;var N3v=v4m;N3v+=G16.Q0r;N3v+=G9m;N3v+=B4m;var l3v=V0r;l3v+=G16.e0r;l3v+=P28;var allRowData={};var changedRowData={};$[l3v](fields,function(name,field){var x4m=/\[.*$/;var u4m='[]';var E4m="valFromDat";var b4m="Arra";var h4m="exO";var N4m="-count";var i4m="submittable";var Z3v=U68;Z3v+=O0r;Z3v+=y0r;if(edit[Z3v][name]&&field[i4m]()){var F3v=e3m;F3v+=C6r;F3v+=G16.e0r;F3v+=o8G;var i3v=M4m;i3v+=B9m;i3v+=F4m;i3v+=N4m;var B3v=G1G;B3v+=K48;B3v+=V0r;var v3v=G16.z0r;v3v+=b4r;v3v+=h4m;v3v+=L8G;var q3v=L6r;q3v+=b4m;q3v+=m4r;var multiGet=field[C68]();var builder=setBuilder(name);if(multiGet[idSrc]===undefined){var P3v=E4m;P3v+=G16.e0r;var originalVal=field[P3v](edit[U3G]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=$[q3v](value)&&name[v3v](u4m)!==-c7r?setBuilder(name[B3v](x4m,N5G)+i3v):X3G;builder(allRowData,value);if(manyBuilder){var M3v=n1r;M3v+=V0r;M3v+=y7m;M3v+=c4r;manyBuilder(allRowData,value[M3v]);}if(action===r8m&&(!editData[name]||!field[F3v](value,editData[name][idSrc]))){builder(changedRowData,value);changed=D5G;if(manyBuilder){manyBuilder(changedRowData,value[H5G]);}}}});if(!$[N3v](allRowData)){allData[idSrc]=allRowData;}if(!$[h3v](changedRowData)){changedData[idSrc]=changedRowData;}});if(action===b3v||changedSubmit===D4G||changedSubmit===E3v&&changed){var u3v=b18;u3v+=g0r;u3v+=G16.e0r;submitParams[u3v]=allData;}else if(changedSubmit===W4m&&changed){submitParams[U3G]=changedData;}else{var G3v=u0m;G3v+=Y4m;var C3v=w1r;C3v+=T6r;C3v+=U4m;C3v+=q5G;var U3v=J4m;U3v+=Z6r;U3v+=V0r;var W3v=p98;W3v+=V0r;var x3v=G16.e0r;x3v+=B4G;x3v+=G16.R0r;this[y0r][x3v]=X3G;if(opts[h0m]===W3v&&(hide===undefined||hide)){var Y3v=P8G;Y3v+=n1r;Y3v+=C4m;this[Y3v](g5G);}else if(typeof opts[U3v]===c7G){var J3v=W4r;J3v+=G4m;J3v+=e5m;opts[J3v](this);}if(successCallback){successCallback[a4G](this);}this[C3v](g5G);this[a9m](G3v);return;}}else if(action===e3v){$[A5G](editFields,function(idSrc,edit){var d3v=O0r;d3v+=G16.e0r;d3v+=g0r;d3v+=G16.e0r;submitParams[U3G][idSrc]=edit[d3v];});}this[e4m](n3v,action,submitParams);submitParamsLocal=$[F3G](D5G,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[Q3v](d4m,[submitParams,action])===g5G){var A3v=w1r;A3v+=n4m;A3v+=Q4m;this[A3v](g5G);return;}var submitWire=this[y0r][s28]||this[y0r][x2m]?this[O2m]:this[z3v];submitWire[R3v](this,submitParams,function(json,notGood,xhr){var z4m="ccess";var A4m="itSu";var K3v=x28;K3v+=W28;var o3v=U6r;o3v+=A4m;o3v+=z4m;that[o3v](json,notGood,submitParams,submitParamsLocal,that[y0r][K3v],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var R4m="_submitEr";var p3v=R4m;p3v+=l4r;p3v+=W4r;p3v+=l4r;that[p3v](xhr,err,thrown,errorCallback,submitParams,that[y0r][z08]);},submitParams);};Editor[R7G][o4m]=function(data,success,error,submitParams){var g4m="taSou";var H4m="_da";var k4m="ier";var j4m="dif";var a4m="aFn";var f4m="ObjectDat";var r4m="_fnGet";var p4m="bjectD";var K4m="_fnSetO";var c3v=K4m;c3v+=p4m;c3v+=n3G;var a3v=W4r;a3v+=K4r;a3v+=C6r;a3v+=G16.z0r;var f3v=r4m;f3v+=f4m;f3v+=a4m;var r3v=W4r;r3v+=K4r;r3v+=C6r;r3v+=G16.z0r;var that=this;var action=data[z08];var out={data:[]};var idGet=DataTable[G48][r3v][f3v](this[y0r][c4m]);var idSet=DataTable[G48][a3v][c3v](this[y0r][c4m]);if(action!==a8m){var g3v=J3G;g3v+=G16.e0r;var H3v=e1r;H3v+=W4r;H3v+=j4m;H3v+=k4m;var k3v=H4m;k3v+=g4m;k3v+=l4r;k3v+=U8G;var j3v=e1r;j3v+=W4r;j3v+=O0r;j3v+=V0r;var originalData=this[y0r][j3v]===j18?this[g28](c18,this[n28]()):this[k3v](U38,this[H3v]());$[A5G](data[g3v],function(key,vals){var y4m="dataTableExt";var D4m="oA";var I4m="Ext";var m4m="_fn";var y3v=L1m;y3v+=q6r;var D3v=m4m;D3v+=I4m;D3v+=s3G;var I3v=D4m;I3v+=C6r;I3v+=G16.z0r;var m3v=L8G;m3v+=o4r;var toSave;var extender=$[m3v][y4m][I3v][D3v];if(action===r8m){var rowData=originalData[key][U3G];toSave=extender({},rowData,D5G);toSave=extender(toSave,vals,D5G);}else{toSave=extender({},vals,D5G);}var overrideId=idGet(toSave);if(action===y3v&&overrideId===undefined){idSet(toSave,+new Date()+N5G+key);}else{idSet(toSave,overrideId);}out[U3G][z5G](toSave);});}success(out);};Editor[w3v][T3v]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var r6m='postRemove';var p6m="ids";var K6m='prep';var o6m="aSourc";var R6m="eRemove";var A6m="urce";var Q6m="mmi";var n6m="preE";var d6m="Edit";var e6m="ost";var G6m='postCreate';var C6m='preCreate';var U6m="_dataS";var Y6m="eat";var W6m="ataSource";var x6m="mm";var u6m="reat";var E6m="unt";var b6m="tCo";var h6m="ucce";var N6m="tS";var F6m='<br>';var l6m="ful";var t4m="submitUnsuccess";var s4m="eldErr";var X4m="fieldErrors";var O4m="modifi";var L4m="yAjax";var V4m="leg";var S4m="bm";var T4m="postSu";var w4m="Complete";var V7v=P38;V7v+=q38;V7v+=w4m;var O3v=T4m;O3v+=S4m;O3v+=B6r;var L3v=o8G;L3v+=U8G;L3v+=G16.z0r;L3v+=w2m;var V3v=w1r;V3v+=V4m;V3v+=j6r;V3v+=L4m;var S3v=O4m;S3v+=d4r;var that=this;var setData;var fields=this[y0r][T28];var opts=this[y0r][f68];var modifier=this[y0r][S3v];this[V3v](L3v,action,json);this[a9m](O3v,[json,submitParams,action,xhr]);if(!json[N0G]){json[N0G]=G16.K0r;}if(!json[X4m]){var X3v=X8G;X3v+=s4m;X3v+=B5m;json[X3v]=[];}if(notGood||json[N0G]||json[X4m][H5G]){var b7v=t4m;b7v+=l6m;var h7v=d68;h7v+=g0r;var N7v=G9m;N7v+=W4r;N7v+=V8G;var F7v=V0r;F7v+=b5m;F7v+=W4r;F7v+=l4r;var s3v=V0r;s3v+=l4r;s3v+=l4r;s3v+=m0r;var globalError=[];if(json[s3v]){var l7v=V0r;l7v+=l4r;l7v+=s8G;var t3v=S28;t3v+=y0r;t3v+=c4r;globalError[t3v](json[l7v]);}$[A5G](json[X4m],function(i,err){var M6m=': ';var i6m="position";var B6m="bodyContent";var v6m='focus';var q6m="onFieldError";var P6m="eld: ";var Z6m="Unknown ";var Z7v=o4r;Z7v+=G16.e0r;Z7v+=e1r;Z7v+=V0r;var field=fields[err[Z7v]];if(!field){var P7v=Z6m;P7v+=X8G;P7v+=P6m;throw new Error(P7v+err[E3G]);}else if(field[z18]()){var q7v=V0r;q7v+=l4r;q7v+=m8G;q7v+=l4r;field[q7v](err[B3m]||Y6r);if(i===a7r){var B7v=E18;B7v+=H0m;if(opts[q6m]===v6m){var v7v=g0r;v7v+=W4r;v7v+=C6r;that[E88]($(that[G7G][B6m],that[y0r][A3G]),{scrollTop:$(field[k08]())[i6m]()[v7v]},u0r);field[C7G]();}else if(typeof opts[q6m]===B7v){opts[q6m](that,err);}}}else{var M7v=N5m;M7v+=g0r;M7v+=i8m;var i7v=C6r;i7v+=d1r;i7v+=G6G;globalError[i7v](field[E3G]()+M6m+(err[M7v]||Y6r));}});this[F7v](globalError[N7v](F6m));this[h7v](b7v,[json]);if(errorCallback){var E7v=x5m;E7v+=W5m;errorCallback[E7v](that,json);}}else{var S7v=a8G;S7v+=N6m;S7v+=h6m;S7v+=w7G;var y7v=q48;y7v+=b6m;y7v+=E6m;var x7v=a4r;x7v+=u6m;x7v+=V0r;var u7v=O0r;u7v+=G16.e0r;u7v+=g0r;u7v+=G16.e0r;var store={};if(json[u7v]&&(action===x7v||action===i38)){var r7v=O0r;r7v+=b58;r7v+=G16.e0r;var p7v=a4r;p7v+=W4r;p7v+=x6m;p7v+=B6r;var U7v=n1r;U7v+=O7G;U7v+=S5G;U7v+=p28;var Y7v=x9m;Y7v+=C6r;var W7v=V6r;W7v+=W6m;this[W7v](Y7v,action,modifier,submitParamsLocal,json,store);for(var i=a7r;i<json[U3G][U7v];i++){var Q7v=e3G;Q7v+=G16.z0r;Q7v+=g0r;var e7v=E28;e7v+=Y6m;e7v+=V0r;var G7v=y0r;G7v+=h78;G7v+=q1r;G7v+=G16.e0r;var C7v=G16.z0r;C7v+=O0r;var J7v=b18;J7v+=k58;setData=json[J7v][i];var id=this[g28](C7v,setData);this[a9m](G7v,[json,setData,action]);if(action===e7v){var n7v=U6m;n7v+=J6m;var d7v=p18;d7v+=w2m;d7v+=O1r;this[d7v](C6m,[json,setData,id]);this[n7v](O3G,fields,setData,store);this[a9m]([O3G,G6m],[json,setData,id]);}else if(action===Q7v){var K7v=C6r;K7v+=e6m;K7v+=d6m;var o7v=V0r;o7v+=O0r;o7v+=G16.z0r;o7v+=g0r;var R7v=w1r;R7v+=d5m;R7v+=V0r;R7v+=O1r;var z7v=n6m;z7v+=H0r;z7v+=g0r;var A7v=J08;A7v+=O7G;A7v+=g0r;this[A7v](z7v,[json,setData,id]);this[g28](r8m,modifier,fields,setData,store);this[R7v]([o7v,K7v],[json,setData,id]);}}this[g28](p7v,action,modifier,json[r7v],store);}else if(action===T1G){var D7v=J3G;D7v+=G16.e0r;var I7v=a4r;I7v+=W4r;I7v+=Q6m;I7v+=g0r;var m7v=V6r;m7v+=U48;m7v+=A6m;var g7v=G16.z0r;g7v+=O0r;g7v+=y0r;var H7v=z6m;H7v+=w2m;var k7v=J08;k7v+=N6G;var j7v=z6m;j7v+=U7G;j7v+=V0r;var c7v=g6r;c7v+=R6m;var a7v=i5m;a7v+=o4r;a7v+=g0r;var f7v=M38;f7v+=o6m;f7v+=V0r;this[f7v](K6m,action,modifier,submitParamsLocal,json,store);this[a7v](c7v,[json,this[p6m]()]);this[g28](j7v,modifier,fields,store);this[k7v]([H7v,r6m],[json,this[g7v]()]);this[m7v](I7v,action,modifier,json[D7v],store);}if(editCount===this[y0r][y7v]){var w7v=p98;w7v+=V0r;var action=this[y0r][z08];this[y0r][z08]=X3G;if(opts[h0m]===w7v&&(hide===undefined||hide)){var T7v=P8G;T7v+=Y9G;T7v+=y0r;T7v+=V0r;this[T7v](json[U3G]?D5G:g5G,action);}else if(typeof opts[h0m]===c7G){opts[h0m](this);}}if(successCallback){successCallback[a4G](that,json);}this[a9m](S7v,[json,setData,action]);}this[m1m](g5G);this[a9m](V7v,[json,setData,action]);};Editor[R7G][L7v]=function(xhr,err,thrown,errorCallback,submitParams,action){var j6m='submitComplete';var c6m='submitError';var a6m="Submi";var f6m="sy";var Z0v=w1r;Z0v+=l8m;Z0v+=O1r;var t7v=f6m;t7v+=A4r;t7v+=V0r;t7v+=e1r;var s7v=G16.z0r;s7v+=f0r;s7v+=P2m;var X7v=T08;X7v+=A4r;X7v+=a6m;X7v+=g0r;var O7v=w1r;O7v+=d5m;O7v+=N6G;this[O7v](X7v,[X3G,submitParams,action,xhr]);this[N0G](this[s7v][N0G][t7v]);this[m1m](g5G);if(errorCallback){var l0v=a4r;l0v+=J7G;l0v+=n1r;errorCallback[l0v](this,xhr,err,thrown);}this[Z0v]([c6m,j6m],[xhr,err,thrown,submitParams]);};Editor[R7G][Q08]=function(fn){var T6m="los";var D6m="tComp";var I6m="bServerSide";var m6m="etting";var g6m="tur";var H6m="Fea";var k6m="rocessi";var N0v=O0r;N0v+=o98;N0v+=m4r;var B0v=C6r;B0v+=k6m;B0v+=q5G;var P0v=U3G;P0v+=R2m;var that=this;var dt=this[y0r][G28]?new $[J5G][P0v][J8m](this[y0r][G28]):X3G;var ssp=g5G;if(dt){var v0v=W4r;v0v+=H6m;v0v+=g6m;v0v+=O4r;var q0v=y0r;q0v+=m6m;q0v+=y0r;ssp=dt[q0v]()[a7r][v0v][I6m];}if(this[y0r][B0v]){var M0v=a8G;M0v+=D6m;M0v+=Q3m;var i0v=W4r;i0v+=o4r;i0v+=V0r;this[i0v](M0v,function(){var w6m="aw";if(ssp){var F0v=y6m;F0v+=w6m;dt[Q68](F0v,fn);}else{setTimeout(function(){fn();},D7r);}});return D5G;}else if(this[N0v]()===g1m||this[Z6G]()===J38){var h0v=a4r;h0v+=T6m;h0v+=V0r;this[Q68](h0v,function(){var S6m="submitComple";var b0v=g6r;b0v+=u9G;b0v+=Q4m;if(!that[y0r][b0v]){setTimeout(function(){if(that[y0r]){fn();}},D7r);}else{var E0v=S6m;E0v+=h6G;that[Q68](E0v,function(e,json){if(ssp&&json){var x0v=y6m;x0v+=G16.e0r;x0v+=M6r;var u0v=G16.R0r;u0v+=V0r;dt[u0v](x0v,fn);}else{setTimeout(function(){if(that[y0r]){fn();}},D7r);}});}})[E8G]();return D5G;}return g5G;};Editor[R7G][W0v]=function(name,arr){for(var i=a7r,ien=arr[H5G];i<ien;i++){if(name==arr[i]){return i;}}return-c7r;};Editor[Y0v]={"table":X3G,"ajaxUrl":X3G,"fields":[],"display":U0v,"ajax":X3G,"idSrc":J0v,"events":{},"i18n":{"create":{"button":V6m,"title":L6m,"submit":O6m},"edit":{"button":C0v,"title":X6m,"submit":G0v},"remove":{"button":s6m,"title":s6m,"submit":e0v,"confirm":{"_":t6m,"1":l8U}},"error":{"system":d0v},multi:{title:n0v,info:Q0v,restore:Z8U,noMulti:A0v},datetime:{previous:P8U,next:q8U,months:[z0v,R0v,o0v,K0v,v8U,p0v,r0v,f0v,B8U,a0v,c0v,j0v],weekdays:[i8U,M8U,k0v,H0v,F8U,N8U,g0v],amPm:[h8U,b8U],hours:m0v,minutes:E8U,seconds:I0v,unknown:I68}},formOptions:{bubble:$[D0v]({},Editor[P7G][y0v],{title:g5G,message:g5G,buttons:u8U,submit:W4m}),inline:$[F3G]({},Editor[P7G][w0v],{buttons:g5G,submit:W4m}),main:$[F3G]({},Editor[P7G][e48])},legacyAjax:g5G};(function(){var v5U='keyless';var F9U="rowIds";var s8U="_fnGetObjectDataFn";var I8U="tach";var m8U="cells";var x8U="dataS";var n1v=U3G;n1v+=X1m;n1v+=M9G;var T0v=x8U;T0v+=J6m;T0v+=y0r;var __dataSources=Editor[T0v]={};var __dtIsSsp=function(dt,editor){var J8U="oFeatures";var U8U="rSide";var Y8U="bServe";var W8U="wTy";var O0v=U0m;O0v+=V0r;var L0v=y6m;L0v+=G16.e0r;L0v+=W8U;L0v+=D0r;var V0v=D3m;V0v+=k18;V0v+=y0r;var S0v=Y8U;S0v+=U8U;return dt[h3G]()[a7r][J8U][S0v]&&editor[y0r][V0v][L0v]!==O0v;};var __dtApi=function(table){return $(table)[C5G]();};var __dtHighlight=function(node){node=$(node);setTimeout(function(){var C8U='highlight';var X0v=A28;X0v+=V68;node[X0v](C8U);setTimeout(function(){var d8U="ighlight";var e8U="noH";var G8U="moveClas";var x0r=550;var t0v=o8G;t0v+=G8U;t0v+=y0r;var s0v=e8U;s0v+=d8U;node[D7G](s0v)[t0v](C8U);setTimeout(function(){var A8U="oveCl";var Q8U="ghlight";var n8U="noHi";var Z1v=n8U;Z1v+=Q8U;var l1v=s68;l1v+=A8U;l1v+=E7G;node[l1v](Z1v);},x0r);},u0r);},L7r);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){dt[z8U](identifier)[R8U]()[A5G](function(idx){var K8U=" find row identifier";var o8U="Unable to";var S7r=14;var P1v=O0r;P1v+=G16.e0r;P1v+=g0r;P1v+=G16.e0r;var row=dt[d28](idx);var data=row[P1v]();var idSrc=idFn(data);if(idSrc===undefined){var q1v=o8U;q1v+=K8U;Editor[N0G](q1v,S7r);}out[idSrc]={idSrc:idSrc,data:data,node:row[k08](),fields:fields,type:y4G};});};var __dtFieldsFromIdx=function(dt,fields,idx){var g8U="ield name.";var H8U="y the f";var k8U="Please specif";var j8U="Unable to automatically determine field from source. ";var c8U="editField";var a8U="aoColumns";var f8U="editF";var r8U="yObject";var p8U="Empt";var M1v=G16.z0r;M1v+=y0r;M1v+=p8U;M1v+=r8U;var v1v=f8U;v1v+=T0r;v1v+=n1r;v1v+=O0r;var field;var col=dt[h3G]()[a7r][a8U][idx];var dataSrc=col[c8U]!==undefined?col[v1v]:col[w28];var resolvedFields={};var run=function(field,dataSrc){if(field[E3G]()===dataSrc){resolvedFields[field[E3G]()]=field;}};$[A5G](fields,function(name,fieldInst){var B1v=L6r;B1v+=B68;B1v+=l4r;B1v+=H68;if($[B1v](dataSrc)){var i1v=K28;i1v+=p28;for(var i=a7r;i<dataSrc[i1v];i++){run(fieldInst,dataSrc[i]);}}else{run(fieldInst,dataSrc);}});if($[M1v](resolvedFields)){var F1v=j8U;F1v+=k8U;F1v+=H8U;F1v+=g8U;Editor[N0G](F1v,y7r);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){dt[m8U](identifier)[R8U]()[A5G](function(idx){var y8U="lum";var D8U="obje";var C1v=V0r;C1v+=q2m;C1v+=b4r;var J1v=u1G;J1v+=Z1r;var U1v=S5G;U1v+=V0r;U1v+=g0r;var Y1v=C6r;Y1v+=d1r;Y1v+=y0r;Y1v+=c4r;var W1v=b58;W1v+=I8U;var x1v=D8U;x1v+=a4r;x1v+=g0r;var u1v=i0G;u1v+=y8U;u1v+=o4r;var E1v=O0r;E1v+=G16.e0r;E1v+=g0r;E1v+=G16.e0r;var b1v=l4r;b1v+=W4r;b1v+=M6r;var h1v=l4r;h1v+=o58;var N1v=a4r;N1v+=V0r;N1v+=W5m;var cell=dt[N1v](idx);var row=dt[h1v](idx[b1v]);var data=row[E1v]();var idSrc=idFn(data);var fields=forceFields||__dtFieldsFromIdx(dt,allFields,idx[u1v]);var isNode=typeof identifier===x1v&&identifier[w8U]||identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){prevAttach=out[idSrc][J28];prevDisplayFields=out[idSrc][n48];}__dtRowSelector(out,dt,idx[d28],allFields,idFn);out[idSrc][J28]=prevAttach||[];out[idSrc][W1v][Y1v](isNode?$(identifier)[U1v](a7r):cell[J1v]());out[idSrc][n48]=prevDisplayFields||{};$[C1v](out[idSrc][n48],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var T8U="cel";var G1v=T8U;G1v+=n1r;G1v+=y0r;dt[G1v](X3G,identifier)[R8U]()[A5G](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var S8U='\\$1';var d1v=o8G;d1v+=Q1G;var e1v=Y9m;e1v+=q5G;return typeof id===e1v?B48+id[d1v](/(:|\.|\[|\]|,)/g,S8U):B48+id;};__dataSources[n1v]={id:function(data){var O8U="oAp";var L8U="etObjectData";var V8U="_fnG";var z1v=V8U;z1v+=L8U;z1v+=K0G;var A1v=O8U;A1v+=G16.z0r;var Q1v=V0r;Q1v+=L0r;Q1v+=g0r;var idFn=DataTable[Q1v][A1v][z1v](this[y0r][c4m]);return idFn(data);},individual:function(identifier,fieldNames){var X8U="rc";var p1v=C9G;p1v+=r1r;p1v+=y0r;var K1v=w78;K1v+=M9G;var o1v=G16.z0r;o1v+=O0r;o1v+=E4r;o1v+=X8U;var R1v=V0r;R1v+=L0r;R1v+=g0r;var idFn=DataTable[R1v][C3G][s8U](this[y0r][o1v]);var dt=__dtApi(this[y0r][K1v]);var fields=this[y0r][p1v];var out={};var forceFields;var responsiveNode;if(fieldNames){var r1v=L6r;r1v+=k68;r1v+=G16.e0r;r1v+=m4r;if(!$[r1v](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[A5G](fieldNames,function(i,name){forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var Z9U="columns";var l9U="um";var t8U="column";var j1v=a4r;j1v+=O5G;j1v+=n1r;j1v+=y0r;var c1v=t8U;c1v+=y0r;var a1v=Z3m;a1v+=a4r;var f1v=s2G;f1v+=g0r;var idFn=DataTable[f1v][C3G][s8U](this[y0r][a1v]);var dt=__dtApi(this[y0r][G28]);var fields=this[y0r][T28];var out={};if($[h1G](identifier)&&(identifier[z8U]!==undefined||identifier[c1v]!==undefined||identifier[j1v]!==undefined)){var k1v=i0G;k1v+=n1r;k1v+=l9U;k1v+=E38;if(identifier[z8U]!==undefined){__dtRowSelector(out,dt,identifier[z8U],fields,idFn);}if(identifier[k1v]!==undefined){__dtColumnSelector(out,dt,identifier[Z9U],fields,idFn);}if(identifier[m8U]!==undefined){__dtCellSelector(out,dt,identifier[m8U],fields,idFn);}}else{__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[y0r][G28]);if(!__dtIsSsp(dt,this)){var H1v=u1G;H1v+=O0r;H1v+=V0r;var row=dt[d28][A28](data);__dtHighlight(row[H1v]());}},edit:function(identifier,fields,data,store){var M9U="TableExt";var i9U="nExte";var B9U="owI";var v9U="pli";var P9U="drawType";var that=this;var dt=__dtApi(this[y0r][G28]);if(!__dtIsSsp(dt,this)||this[y0r][f68][P9U]===L7G){var m1v=G16.z0r;m1v+=O0r;var g1v=O0r;g1v+=Y3G;g1v+=R2m;var rowId=__dataSources[g1v][m1v][a4G](this,data);var row;try{row=dt[d28](__dtjqId(rowId));}catch(e){row=dt;}if(!row[q9U]()){row=dt[d28](function(rowIdx,rowData,rowNode){var I1v=a4r;I1v+=G16.e0r;I1v+=n1r;I1v+=n1r;return rowId==__dataSources[U28][u3G][I1v](that,rowData);});}if(row[q9U]()){var L1v=y0r;L1v+=v9U;L1v+=a4r;L1v+=V0r;var V1v=l4r;V1v+=B9U;V1v+=n4G;var S1v=O0r;S1v+=G16.e0r;S1v+=k58;var T1v=O0r;T1v+=G16.e0r;T1v+=g0r;T1v+=G16.e0r;var w1v=D18;w1v+=i9U;w1v+=b4r;var y1v=U3G;y1v+=M9U;var D1v=L8G;D1v+=o4r;var extender=$[D1v][y1v][C3G][w1v];var toSave=extender({},row[T1v](),D5G);toSave=extender(toSave,data,D5G);row[S1v](toSave);var idx=$[N1G](rowId,store[F9U]);store[V1v][L1v](idx,c7r);}else{var X1v=G16.e0r;X1v+=O0r;X1v+=O0r;var O1v=l4r;O1v+=W4r;O1v+=M6r;row=dt[O1v][X1v](data);}__dtHighlight(row[k08]());}},remove:function(identifier,fields,store){var E9U="every";var b9U="ws";var N9U="ance";var t1v=k5G;t1v+=j5G;var s1v=a4r;s1v+=N9U;s1v+=n1r;s1v+=h9U;var that=this;var dt=__dtApi(this[y0r][G28]);var cancelled=store[s1v];if(cancelled[t1v]===a7r){var l4v=m8G;l4v+=b9U;dt[l4v](identifier)[T1G]();}else{var B4v=l4r;B4v+=W4r;B4v+=M6r;B4v+=y0r;var indexes=[];dt[z8U](identifier)[E9U](function(){var u9U="pus";var q4v=V8G;q4v+=B68;q4v+=l4r;q4v+=H68;var P4v=O0r;P4v+=Y3G;var Z4v=x5m;Z4v+=n1r;Z4v+=n1r;var id=__dataSources[U28][u3G][Z4v](that,this[P4v]());if($[q4v](id,cancelled)===-c7r){var v4v=u9U;v4v+=c4r;indexes[v4v](this[x9U]());}});dt[B4v](indexes)[T1G]();}},prep:function(action,identifier,submit,json,store){var G9U="cancelled";var Y9U="celled";var W9U="can";var i4v=q48;i4v+=g0r;if(action===i4v){var M4v=W9U;M4v+=Y9U;var cancelled=json[M4v]||[];store[F9U]=$[o18](submit[U3G],function(val,key){var C9U="tyObject";var J9U="mp";var U9U="isE";var F4v=U9U;F4v+=J9U;F4v+=C9U;return!$[F4v](submit[U3G][key])&&$[N1G](key,cancelled)===-c7r?key:undefined;});}else if(action===a8m){store[G9U]=json[G9U]||[];}},commit:function(action,identifier,data,store){var R9U="draw";var z9U="Features";var A9U="verSi";var Q9U="bSe";var d9U="Ty";var e9U="dra";var J4v=e9U;J4v+=M6r;J4v+=d9U;J4v+=D0r;var U4v=q48;U4v+=g0r;U4v+=q8m;U4v+=y3m;var h4v=M9G;h4v+=o4r;h4v+=S5G;h4v+=p28;var N4v=V0r;N4v+=O0r;N4v+=B6r;var that=this;var dt=__dtApi(this[y0r][G28]);if(!__dtIsSsp(dt,this)&&action===N4v&&store[F9U][h4v]){var u4v=K28;u4v+=p28;var ids=store[F9U];var row;var compare=function(id){return function(rowIdx,rowData,rowNode){var n9U="dataTa";var E4v=a4r;E4v+=G16.e0r;E4v+=W5m;var b4v=n9U;b4v+=k7G;return id==__dataSources[b4v][u3G][E4v](that,rowData);};};for(var i=a7r,ien=ids[u4v];i<ien;i++){var Y4v=Q9U;Y4v+=l4r;Y4v+=A9U;Y4v+=Z1r;var W4v=W4r;W4v+=z9U;var x4v=G16.e0r;x4v+=o4r;x4v+=m4r;try{row=dt[d28](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[x4v]()){row=dt[d28](compare(ids[i]));}if(row[q9U]()&&!dt[h3G]()[a7r][W4v][Y4v]){row[T1G]();}}}var drawType=this[y0r][U4v][J4v];if(drawType!==L7G){dt[R9U](drawType);}}};function __html_id(identifier){var p9U='Could not find an element with `data-editor-id` or `id` of: ';var K9U='[data-editor-id="';var o9U="yless";var C4v=F4G;C4v+=V0r;C4v+=o9U;var context=document;if(identifier!==C4v){context=$(K9U+identifier+Y7m);if(context[H5G]===a7r){context=typeof identifier===t78?$(__dtjqId(identifier)):$(identifier);}if(context[H5G]===a7r){throw p9U+identifier;}}return context;}function __html_el(identifier,name){var r9U='[data-editor-field="';var G4v=G5G;G4v+=e5G;var context=__html_id(identifier);return $(r9U+name+G4v,context);}function __html_els(identifier,names){var e4v=M9G;e4v+=P1G;var out=$();for(var i=a7r,ien=names[e4v];i<ien;i++){var d4v=G16.e0r;d4v+=g98;out=out[d4v](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var j9U='[data-editor-value]';var f9U="data-editor-v";var Q4v=f9U;Q4v+=a9U;var n4v=n1r;n4v+=Y0G;var el=__html_el(identifier,dataSrc);return el[c9U](j9U)[n4v]?el[l08](Q4v):el[O0G]();}function __html_set(identifier,fields,data){$[A5G](fields,function(name,field){var D9U='data-editor-value';var I9U="dataSrc";var m9U="lter";var g9U="lue]";var H9U="tor-va";var k9U="[data-edi";var val=field[G3G](data);if(val!==undefined){var z4v=k9U;z4v+=H9U;z4v+=g9U;var A4v=X8G;A4v+=m9U;var el=__html_el(identifier,field[I9U]());if(el[A4v](z4v)[H5G]){var R4v=G16.e0r;R4v+=g0r;R4v+=g0r;R4v+=l4r;el[R4v](D9U,val);}else{var p4v=N4G;p4v+=n1r;el[A5G](function(){var S9U="removeChild";var T9U="irstChild";var w9U="childNodes";var y9U="lengt";var o4v=y9U;o4v+=c4r;while(this[w9U][o4v]){var K4v=L8G;K4v+=T9U;this[S9U](this[K4v]);}})[p4v](val);}}});}__dataSources[O0G]={id:function(data){var r4v=V0r;r4v+=L0r;r4v+=g0r;var idFn=DataTable[r4v][C3G][s8U](this[y0r][c4m]);return idFn(data);},initField:function(cfg){var O9U="or-label=\"";var L9U="[data-edit";var V9U="lab";var c4v=V9U;c4v+=O5G;var a4v=G5G;a4v+=e5G;var f4v=L9U;f4v+=O9U;var label=$(f4v+(cfg[U3G]||cfg[E3G])+a4v);if(!cfg[c4v]&&label[H5G]){var j4v=n1r;j4v+=G16.e0r;j4v+=G16.Q0r;j4v+=O5G;cfg[j4v]=label[O0G]();}},individual:function(identifier,fieldNames){var B5U='Cannot automatically determine field name from data source';var q5U='editor-id';var P5U='[data-editor-id]';var Z5U="ta-editor-";var l5U="ack";var t9U="B";var y4v=Q18;y4v+=c4r;var D4v=V0r;D4v+=G16.e0r;D4v+=a4r;D4v+=c4r;var I4v=C9G;I4v+=n1r;I4v+=n4G;var m4v=N4G;m4v+=n1r;var attachEl;if(identifier instanceof $||identifier[w8U]){var g4v=X9U;g4v+=s9U;var H4v=A28;H4v+=t9U;H4v+=l5U;attachEl=identifier;if(!fieldNames){var k4v=O0r;k4v+=G16.e0r;k4v+=Z5U;k4v+=N08;fieldNames=[$(identifier)[l08](k4v)];}var back=$[J5G][M68]?H4v:F68;identifier=$(identifier)[g4v](P5U)[back]()[U3G](q5U);}if(!identifier){identifier=v5U;}if(fieldNames&&!$[a1G](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames||fieldNames[H5G]===a7r){throw B5U;}var out=__dataSources[m4v][T28][a4G](this,identifier);var fields=this[y0r][I4v];var forceFields={};$[D4v](fieldNames,function(i,name){forceFields[name]=fields[name];});$[y4v](out,function(id,set){var M5U='cell';var i5U="ayFields";var V4v=s4G;V4v+=i5U;var S4v=b8G;S4v+=B68;S4v+=u6r;var T4v=b58;T4v+=I8U;var w4v=g0r;w4v+=m4r;w4v+=D0r;set[w4v]=M5U;set[T4v]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[S4v]();set[T28]=fields;set[V4v]=forceFields;});return out;},fields:function(identifier){var Z6v=l4r;Z6v+=W4r;Z6v+=M6r;var s4v=V0r;s4v+=j6r;s4v+=c4r;var L4v=c4r;L4v+=g0r;L4v+=V78;var out={};var self=__dataSources[L4v];if($[a1G](identifier)){var O4v=k5G;O4v+=j5G;for(var i=a7r,ien=identifier[O4v];i<ien;i++){var X4v=x5m;X4v+=W5m;var res=self[T28][X4v](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[y0r][T28];if(!identifier){identifier=v5U;}$[s4v](fields,function(name,field){var N5U="oD";var F5U="lT";var l6v=t8m;l6v+=F5U;l6v+=N5U;l6v+=Y3G;var t4v=x8U;t4v+=l4r;t4v+=a4r;var val=__html_get(identifier,field[t4v]());field[l6v](data,val===X3G?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:Z6v};return out;},create:function(fields,data){var h5U="tm";if(data){var q6v=G16.z0r;q6v+=O0r;var P6v=c4r;P6v+=h5U;P6v+=n1r;var id=__dataSources[P6v][q6v][a4G](this,data);try{var v6v=n1r;v6v+=O7G;v6v+=S5G;v6v+=p28;if(__html_id(id)[v6v]){__html_set(id,fields,data);}}catch(e){}}},edit:function(identifier,fields,data){var b5U="keyl";var M6v=b5U;M6v+=y9m;var i6v=z7G;i6v+=n1r;var B6v=G16.z0r;B6v+=O0r;var id=__dataSources[O0G][B6v][i6v](this,data)||M6v;__html_set(id,fields,data);},remove:function(identifier,fields){var E5U="mov";var F6v=o8G;F6v+=E5U;F6v+=V0r;__html_id(identifier)[F6v]();}};}());Editor[e0G]={"wrapper":N6v,"processing":{"indicator":h6v,"active":S3G},"header":{"wrapper":b6v,"content":u5U},"body":{"wrapper":E6v,"content":x5U},"footer":{"wrapper":u6v,"content":x6v},"form":{"wrapper":W5U,"content":Y5U,"tag":G16.K0r,"info":W6v,"error":U5U,"buttons":Y6v,"button":J5U,"buttonInternal":J5U},"field":{"wrapper":U6v,"typePrefix":C5U,"namePrefix":G5U,"label":e5U,"input":J6v,"inputControl":C6v,"error":G6v,"msg-label":d5U,"msg-error":n5U,"msg-message":Q5U,"msg-info":A5U,"multiValue":e6v,"multiInfo":d6v,"multiRestore":n6v,"multiNoEdit":z5U,"disabled":Q6v,"processing":R5U},"actions":{"create":A6v,"edit":o5U,"remove":K5U},"inline":{"wrapper":p5U,"liner":r5U,"buttons":f5U},"bubble":{"wrapper":a5U,"liner":z6v,"table":c5U,"close":j5U,"pointer":k5U,"bg":R6v}};(function(){var X2U="removeSingle";var O2U='selectedSingle';var D2U='buttons-remove';var o2U="formMessage";var d2U="confirm";var F2U="ditor";var i2U="formButtons";var B2U="editor";var P2U="bleToo";var Z2U="Ta";var l2U="NS";var t5U="BUTTO";var s5U="or_c";var X5U="or_edit";var O5U="ingl";var L5U="ect_s";var V5U="itor_";var S5U="sel";var T5U="uttons";var w5U="ons-create";var D5U="buttons-";var I5U="Single";var m5U="ditSingle";var g5U="ngle";var H5U="selectedSi";var N9K=H5U;N9K+=g5U;var F9K=V0r;F9K+=m5U;var M9K=V0r;M9K+=H0r;M9K+=g0r;var i9K=V0r;i9K+=l7m;i9K+=O7G;i9K+=O0r;var B9K=i38;B9K+=I5U;var m8K=l4r;m8K+=i18;var n8K=D5U;n8K+=i38;var E8K=G16.Q0r;E8K+=y5U;E8K+=w5U;var F8K=G16.Q0r;F8K+=T5U;if(DataTable[z2m]){var S6v=S5U;S6v+=V0r;S6v+=a4r;S6v+=g0r;var T6v=e3G;T6v+=V5U;T6v+=s68;T6v+=q98;var H6v=S5U;H6v+=L5U;H6v+=O5U;H6v+=V0r;var k6v=s2G;k6v+=t2G;var j6v=q48;j6v+=g0r;j6v+=X5U;var f6v=g0r;f6v+=G48;var r6v=s2G;r6v+=h6G;r6v+=o4r;r6v+=O0r;var p6v=i38;p6v+=s5U;p6v+=U08;var K6v=t5U;K6v+=l2U;var o6v=Z2U;o6v+=P2U;o6v+=q2U;var ttButtons=DataTable[o6v][K6v];var ttButtonBase={sButtonText:X3G,editor:X3G,formTitle:X3G};ttButtons[p6v]=$[r6v](D5G,ttButtons[f6v],ttButtonBase,{formButtons:[{label:X3G,fn:function(e){var a6v=Y5m;a6v+=G16.Q0r;a6v+=v2U;a6v+=g0r;this[a6v]();}}],fnClick:function(button,config){var c6v=E28;c6v+=z8G;var editor=config[B2U];var i18nCreate=editor[m78][c6v];var buttons=config[i2U];if(!buttons[a7r][K3G]){buttons[a7r][K3G]=i18nCreate[l4G];}editor[K8m]({title:i18nCreate[U8m],buttons:buttons});}});ttButtons[j6v]=$[k6v](D5G,ttButtons[H6v],ttButtonBase,{formButtons:[{label:X3G,fn:function(e){this[l4G]();}}],fnClick:function(button,config){var N2U="fnGetSelectedIndexes";var w6v=g0r;w6v+=M2U;var y6v=V0r;y6v+=O0r;y6v+=G16.z0r;y6v+=g0r;var I6v=G16.z0r;I6v+=M3G;var m6v=V0r;m6v+=F2U;var g6v=M9G;g6v+=y7m;g6v+=c4r;var selected=this[N2U]();if(selected[g6v]!==c7r){return;}var editor=config[m6v];var i18nEdit=editor[I6v][i38];var buttons=config[i2U];if(!buttons[a7r][K3G]){var D6v=y0r;D6v+=w0m;D6v+=g0r;buttons[a7r][K3G]=i18nEdit[D6v];}editor[y6v](selected[a7r],{title:i18nEdit[w6v],buttons:buttons});}});ttButtons[T6v]=$[F3G](D5G,ttButtons[S6v],ttButtonBase,{question:X3G,formButtons:[{label:X3G,fn:function(e){var that=this;this[l4G](function(json){var W2U="fnSelectNone";var x2U="ableTo";var u2U="nce";var E2U="nsta";var b2U="tI";var h2U="fnGe";var O6v=h2U;O6v+=b2U;O6v+=E2U;O6v+=u2U;var L6v=v4r;L6v+=x2U;L6v+=W4r;L6v+=q2U;var V6v=p9G;V6v+=M9G;var tt=$[J5G][V6v][L6v][O6v]($(that[y0r][G28])[C5G]()[G28]()[k08]());tt[W2U]();});}}],fnClick:function(button,config){var e2U="xes";var G2U="edInde";var C2U="fnGetSelect";var J2U="emo";var U2U="formB";var Y2U="firm";var M8K=l4r;M8K+=V0r;M8K+=l5m;M8K+=n1G;var B8K=n1r;B8K+=E2m;B8K+=O5G;var v8K=l0G;v8K+=Y2U;var q8K=k5G;q8K+=j5G;var P8K=M9G;P8K+=o4r;P8K+=g68;P8K+=c4r;var Z8K=y0r;Z8K+=g0r;Z8K+=l4r;Z8K+=h8m;var l8K=U2U;l8K+=D1r;l8K+=p48;l8K+=y0r;var t6v=l4r;t6v+=J2U;t6v+=w2m;var s6v=V0r;s6v+=r18;s6v+=W4r;s6v+=l4r;var X6v=C2U;X6v+=G2U;X6v+=e2U;var rows=this[X6v]();if(rows[H5G]===a7r){return;}var editor=config[s6v];var i18nRemove=editor[m78][t6v];var buttons=config[l8K];var question=typeof i18nRemove[d2U]===Z8K?i18nRemove[d2U]:i18nRemove[d2U][rows[P8K]]?i18nRemove[d2U][rows[q8K]]:i18nRemove[v8K][w1r];if(!buttons[a7r][B8K]){var i8K=u0m;i8K+=B6r;buttons[a7r][K3G]=i18nRemove[i8K];}editor[T1G](rows,{message:question[M8K](/%d/g,rows[H5G]),title:i18nRemove[U8m],buttons:buttons});}});}var _buttons=DataTable[G48][F8K];$[F3G](_buttons,{create:{text:function(dt,node,config){var Q2U='buttons.create';var b8K=Y78;b8K+=n2U;var h8K=a4r;h8K+=G08;h8K+=h6G;var N8K=V0r;N8K+=F2U;return dt[m78](Q2U,config[N8K][m78][h8K][b8K]);},className:E8K,editor:X3G,formButtons:{text:function(editor){var u8K=L1m;u8K+=b58;u8K+=V0r;return editor[m78][u8K][l4G];},action:function(e){var x8K=P38;x8K+=e1r;x8K+=G16.z0r;x8K+=g0r;this[x8K]();}},formMessage:X3G,formTitle:X3G,action:function(e,dt,node,config){var R2U='preOpen';var z2U="formBu";var A2U="Ti";var J8K=L1m;J8K+=G16.e0r;J8K+=g0r;J8K+=V0r;var U8K=F4r;U8K+=S18;U8K+=A2U;U8K+=P7m;var Y8K=z2U;Y8K+=a78;Y8K+=E38;var W8K=L1m;W8K+=q6r;var that=this;var editor=config[B2U];var buttons=config[i2U];this[S3G](D5G);editor[Q68](R2U,function(){that[S3G](g5G);})[W8K]({buttons:config[Y8K],message:config[o2U],title:config[U8K]||editor[m78][J8K][U8m]});}},edit:{extend:K2U,text:function(dt,node,config){var r2U='buttons.edit';var d8K=V0r;d8K+=r18;var e8K=G16.z0r;e8K+=p2U;e8K+=o4r;var G8K=i38;G8K+=m0r;var C8K=Y4G;C8K+=P2m;return dt[C8K](r2U,config[G8K][e8K][d8K][g4G]);},className:n8K,editor:X3G,formButtons:{text:function(editor){var Q8K=G16.z0r;Q8K+=f0r;Q8K+=P2m;return editor[Q8K][i38][l4G];},action:function(e){this[l4G]();}},formMessage:X3G,formTitle:X3G,action:function(e,dt,node,config){var g2U="itor";var H2U="mns";var k2U="colu";var j2U="ell";var c2U="Ope";var f2U="i18";var g8K=z1r;g8K+=g0r;g8K+=n1r;g8K+=V0r;var H8K=V0r;H8K+=O0r;H8K+=G16.z0r;H8K+=g0r;var k8K=f2U;k8K+=o4r;var j8K=h38;j8K+=a2U;var c8K=V0r;c8K+=r18;var f8K=x9m;f8K+=c2U;f8K+=o4r;var r8K=n1r;r8K+=Y0G;var p8K=V8G;p8K+=U3m;p8K+=O4r;var K8K=a4r;K8K+=j2U;K8K+=y0r;var o8K=k2U;o8K+=H2U;var R8K=x9U;R8K+=O4r;var z8K=l4r;z8K+=i18;var A8K=e3G;A8K+=g2U;var that=this;var editor=config[A8K];var rows=dt[z8K]({selected:D5G})[R8K]();var columns=dt[o8K]({selected:D5G})[R8U]();var cells=dt[K8K]({selected:D5G})[p8K]();var items=columns[r8K]||cells[H5G]?{rows:rows,columns:columns,cells:cells}:rows;this[S3G](D5G);editor[Q68](f8K,function(){var m2U="cess";var a8K=T6r;a8K+=m2U;a8K+=G16.z0r;a8K+=q5G;that[a8K](g5G);})[c8K](items,{message:config[o2U],buttons:config[i2U],title:config[j8K]||editor[k8K][H8K][g8K]});}},remove:{extend:K2U,limitTo:[m8K],text:function(dt,node,config){var I2U='buttons.remove';var D8K=z6m;D8K+=w2m;var I8K=V0r;I8K+=F2U;return dt[m78](I2U,config[I8K][m78][D8K][g4G]);},className:D2U,editor:X3G,formButtons:{text:function(editor){var y8K=Y4G;y8K+=U4G;y8K+=o4r;return editor[y8K][T1G][l4G];},action:function(e){this[l4G]();}},formMessage:function(editor,dt){var w2U="nfir";var y2U="repla";var L8K=k5G;L8K+=j5G;var V8K=y2U;V8K+=U8G;var S8K=M9G;S8K+=P1G;var T8K=i0G;T8K+=w2U;T8K+=e1r;var w8K=i0G;w8K+=W4G;w8K+=A8m;var rows=dt[z8U]({selected:D5G})[R8U]();var i18n=editor[m78][T1G];var question=typeof i18n[d2U]===t78?i18n[w8K]:i18n[T8K][rows[S8K]]?i18n[d2U][rows[H5G]]:i18n[d2U][w1r];return question[V8K](/%d/g,rows[L8K]);},formTitle:X3G,action:function(e,dt,node,config){var V2U="eOp";var S2U="ndexes";var T2U="formTitl";var v9K=g0r;v9K+=d38;v9K+=V0r;var q9K=T2U;q9K+=V0r;var P9K=G16.z0r;P9K+=S2U;var Z9K=l4r;Z9K+=o58;Z9K+=y0r;var l9K=o8G;l9K+=e9G;l9K+=w2m;var s8K=g6r;s8K+=V2U;s8K+=O7G;var X8K=g6r;X8K+=A5m;X8K+=O5m;var O8K=i38;O8K+=m0r;var that=this;var editor=config[O8K];this[X8K](D5G);editor[Q68](s8K,function(){var L2U="rocessing";var t8K=C6r;t8K+=L2U;that[t8K](g5G);})[l9K](dt[Z9K]({selected:D5G})[P9K](),{buttons:config[i2U],message:config[o2U],title:config[q9K]||editor[m78][T1G][v9K]});}}});_buttons[B9K]=$[i9K]({},_buttons[M9K]);_buttons[F9K][F3G]=O2U;_buttons[X2U]=$[F3G]({},_buttons[T1G]);_buttons[X2U][F3G]=N9K;}());Editor[b3G]={};Editor[h9K]=function(input,opts){var W7U=/[haA]/;var x7U=/[Hhm]|LT|LTS/;var u7U=/[YMD]|L(?!T)|l/;var E7U="match";var h7U='editor-dateime-';var N7U='-title';var F7U='-error"/>';var M7U='-time">';var i7U='<select class="';var B7U='-month"/>';var v7U='<span/>';var q7U='-label">';var P7U="previous";var Z7U='<button>';var l7U='-iconLeft">';var S3U="tjs only the format 'YYYY-MM-DD' can be used";var T3U="Editor datetime: Without momen";var D3U="classPref";var I3U="DD";var m3U="MM-";var g3U="Y-";var H3U="YYY";var k3U="ss=\"";var j3U=" cla";var c3U="ate\">";var f3U="itle\">";var p3U="</b";var K3U="ght\">";var o3U="Ri";var R3U="-ico";var z3U="ton>";var A3U="<bu";var n3U="lect class=";var d3U="<se";var e3U="el\"";var G3U="-la";var C3U="n/>";var Y3U="alendar";var W3U="-c";var x3U=" c";var u3U="rs\"/>";var E3U="-hou";var b3U="v class=";var h3U="inutes\"/>";var N3U="\"/>";var M3U="-se";var v3U="nda";var q3U="-cale";var P3U="exOf";var Z3U="tl";var t2U="tructor";var s2U="cons";var N5K=w1r;N5K+=s2U;N5K+=t2U;var F5K=a4r;F5K+=G16.e0r;F5K+=l3U;var M5K=g0r;M5K+=G16.z0r;M5K+=Z3U;M5K+=V0r;var i5K=G16.e0r;i5K+=L48;var B5K=z1r;B5K+=h1r;var v5K=y5G;v5K+=e1r;var q5K=y6G;q5K+=s3G;var P5K=y6G;P5K+=V0r;P5K+=b4r;var Z5K=i0G;Z5K+=M0G;var l5K=L8G;l5K+=G1m;l5K+=b58;var t9K=G16.z0r;t9K+=b4r;t9K+=P3U;var s9K=L8G;s9K+=m0r;s9K+=e1r;s9K+=b58;var X9K=N1r;X9K+=e1r;X9K+=V0r;var O9K=M4m;O9K+=h5m;O9K+=W4r;O9K+=l4r;var L9K=X8G;L9K+=b4r;var V9K=M4m;V9K+=g0r;V9K+=G16.z0r;V9K+=h1r;var S9K=L8G;S9K+=G16.z0r;S9K+=o4r;S9K+=O0r;var T9K=q3U;T9K+=v3U;T9K+=l4r;var w9K=M4m;w9K+=B3U;var y9K=L8G;y9K+=G16.z0r;y9K+=b4r;var D9K=e2G;D9K+=i3U;var I9K=M3U;I9K+=a4r;I9K+=F3U;I9K+=N3U;var m9K=M4m;m9K+=e1r;m9K+=h3U;var g9K=p38;g9K+=b3U;g9K+=G5G;var H9K=E3U;H9K+=u3U;var k9K=e2G;k9K+=x3U;k9K+=n1r;k9K+=z38;var j9K=i2G;j9K+=T4G;j9K+=T58;j9K+=z2G;var c9K=W3U;c9K+=Y3U;c9K+=G5G;c9K+=p2G;var a9K=G98;a9K+=z2G;var f9K=U3U;f9K+=f4r;f9K+=H5m;f9K+=z2G;var r9K=J3U;r9K+=G16.e0r;r9K+=C3U;var p9K=G3U;p9K+=G16.Q0r;p9K+=e3U;p9K+=z2G;var K9K=d3U;K9K+=n3U;K9K+=G5G;var o9K=P2G;o9K+=G16.Q0r;o9K+=y5U;o9K+=Q3U;var R9K=A3U;R9K+=g0r;R9K+=z3U;var z9K=R3U;z9K+=o4r;z9K+=o3U;z9K+=K3U;var A9K=p3U;A9K+=B78;A9K+=o2G;var Q9K=b2G;Q9K+=r3U;Q9K+=Q5G;var n9K=M4m;n9K+=g0r;n9K+=f3U;var d9K=a3U;d9K+=c3U;var e9K=r48;e9K+=a2G;e9K+=j3U;e9K+=k3U;var G9K=G5G;G9K+=z2G;var x9K=H3U;x9K+=g3U;x9K+=m3U;x9K+=I3U;var u9K=D3U;u9K+=G16.z0r;u9K+=L0r;var E9K=B1r;E9K+=v1r;var b9K=G48;b9K+=V0r;b9K+=b4r;this[a4r]=$[b9K](D5G,{},Editor[E9K][j4G],opts);var classPrefix=this[a4r][u9K];var i18n=this[a4r][m78];if(!window[y3U]&&this[a4r][w3U]!==x9K){var W9K=T3U;W9K+=S3U;throw W9K;}var timeBlock=function(type){var X3U=" class=";var O3U="k\">";var L3U="loc";var V3U="-timeb";var J9K=P2G;J9K+=O0r;J9K+=F2G;var U9K=V3U;U9K+=L3U;U9K+=O3U;var Y9K=e2G;Y9K+=X3U;Y9K+=G5G;return Y9K+classPrefix+U9K+J9K;};var gap=function(){var t3U="span>";var s3U="<span>:<";var C9K=s3U;C9K+=T4G;C9K+=t3U;return C9K;};var structure=$(w38+classPrefix+G9K+e9K+classPrefix+d9K+w38+classPrefix+n9K+Q9K+classPrefix+l7U+Z7U+i18n[P7U]+A9K+m3G+w38+classPrefix+z9K+R9K+i18n[s0m]+o9K+m3G+w38+classPrefix+q7U+v7U+K9K+classPrefix+B7U+m3G+w38+classPrefix+p9K+r9K+i7U+classPrefix+f9K+a9K+m3G+w38+classPrefix+c9K+j9K+w38+classPrefix+M7U+k9K+classPrefix+H9K+g9K+classPrefix+m9K+w38+classPrefix+I9K+m3G+D9K+classPrefix+F7U+m3G);this[G7G]={container:structure,date:structure[y9K](S48+classPrefix+w9K),title:structure[F18](S48+classPrefix+N7U),calendar:structure[F18](S48+classPrefix+T9K),time:structure[S9K](S48+classPrefix+V9K),error:structure[L9K](S48+classPrefix+O9K),input:$(input)};this[y0r]={d:X3G,display:X3G,minutesRange:X3G,secondsRange:X3G,namespace:h7U+Editor[X9K][b7U]++,parts:{date:this[a4r][w3U][E7U](u7U)!==X3G,time:this[a4r][w3U][E7U](x7U)!==X3G,seconds:this[a4r][s9K][t9K](h5G)!==-c7r,hours12:this[a4r][l5K][E7U](W7U)!==X3G}};this[G7G][Z5K][P5K](this[G7G][B3U])[q5K](this[v5K][B5K])[i5K](this[G7G][N0G]);this[G7G][B3U][u6G](this[G7G][M5K])[u6G](this[G7G][F5K]);this[N5K]();};$[F3G](Editor[h5K][b5K],{destroy:function(){var U7U="ide";var Y7U="tor-datetime";var U5K=g08;U5K+=H0r;U5K+=Y7U;var Y5K=W4r;Y5K+=L8G;Y5K+=L8G;var W5K=O0r;W5K+=W4r;W5K+=e1r;var x5K=W4r;x5K+=L8G;x5K+=L8G;var u5K=O0r;u5K+=W4r;u5K+=e1r;var E5K=w1r;E5K+=c4r;E5K+=U7U;this[E5K]();this[u5K][I7G][x5K]()[J7U]();this[W5K][A0G][Y5K](U5K);},errorMsg:function(msg){var C5K=V0r;C5K+=l4r;C5K+=m8G;C5K+=l4r;var J5K=y5G;J5K+=e1r;var error=this[J5K][C5K];if(msg){var G5K=V0G;G5K+=V78;error[G5K](msg);}else{var e5K=V0r;e5K+=e1r;e5K+=k18;e5K+=m4r;error[e5K]();}},hide:function(){var d5K=C6G;d5K+=u3G;d5K+=V0r;this[d5K]();},max:function(date){var e7U="_optionsTitle";var n5K=C7U;n5K+=o28;this[a4r][G7U]=date;this[e7U]();this[n5K]();},min:function(date){var R7U="minDate";var z7U="nsTitle";var Q7U="_o";var n7U="tCalan";var A5K=d7U;A5K+=n7U;A5K+=o28;var Q5K=Q7U;Q5K+=A7U;Q5K+=W4r;Q5K+=z7U;this[a4r][R7U]=date;this[Q5K]();this[A5K]();},owns:function(node){var o7U="ntaine";var o5K=n1r;o5K+=O7G;o5K+=g68;o5K+=c4r;var R5K=a4r;R5K+=W4r;R5K+=o7U;R5K+=l4r;var z5K=X8G;z5K+=n1r;z5K+=V1r;return $(node)[h68]()[z5K](this[G7G][R5K])[o5K]>a7r;},val:function(set,write){var D7U=/(\d{4})\-(\d{2})\-(\d{2})/;var I7U="mat";var m7U="toDate";var k7U="ale";var j7U="omentLoc";var c7U="isV";var a7U="mom";var r7U="oStr";var p7U="setUTCD";var K7U="_setT";var D5K=C7U;D5K+=o28;var I5K=K7U;I5K+=M2U;var m5K=p7U;m5K+=G16.e0r;m5K+=h6G;var g5K=O0r;g5K+=G16.z0r;g5K+=y0r;g5K+=y7G;var H5K=g0r;H5K+=r7U;H5K+=h8m;var K5K=y0r;K5K+=t5G;K5K+=G16.z0r;K5K+=q5G;if(set===undefined){return this[y0r][O0r];}if(set instanceof Date){this[y0r][O0r]=this[f7U](set);}else if(set===X3G||set===N5G){this[y0r][O0r]=X3G;}else if(typeof set===K5K){var p5K=a7U;p5K+=O7G;p5K+=g0r;if(window[p5K]){var c5K=c7U;c5K+=G16.e0r;c5K+=l68;c5K+=O0r;var a5K=e1r;a5K+=j7U;a5K+=k7U;var f5K=L8G;f5K+=H7U;var r5K=D1r;r5K+=a4r;var m=window[y3U][r5K](set,this[a4r][f5K],this[a4r][a5K],this[a4r][g7U]);this[y0r][O0r]=m[c5K]()?m[m7U]():X3G;}else{var j5K=I7U;j5K+=a4r;j5K+=c4r;var match=set[j5K](D7U);this[y0r][O0r]=match?new Date(Date[y7U](match[c7r],match[j7r]-c7r,match[k7r])):X3G;}}if(write||write===undefined){if(this[y0r][O0r]){this[w7U]();}else{var k5K=U7G;k5K+=J7G;this[G7G][A0G][k5K](set);}}if(!this[y0r][O0r]){this[y0r][O0r]=this[f7U](new Date());}this[y0r][Z6G]=new Date(this[y0r][O0r][H5K]());this[y0r][g5K][m5K](c7r);this[I5K]();this[D5K]();this[T7U]();},_constructor:function(){var f0U="Hours";var d0U="_correctMonth";var b0U='select';var h0U='keyup.editor-datetime';var F0U=':visible';var M0U='autocomplete';var i0U="-sec";var B0U="emov";var v0U="tim";var q0U="remov";var P0U="seconds";var Z0U="time";var O7U="arts";var L7U="_optionsTit";var V7U="etime click.editor-datetime";var S7U="ocus.editor-d";var X2K=W4r;X2K+=o4r;var z2K=a4r;z2K+=f5G;z2K+=q5G;z2K+=V0r;var A2K=i0G;A2K+=M0G;var Q2K=O0r;Q2K+=W4r;Q2K+=e1r;var C2K=W4r;C2K+=o4r;var b2K=L8G;b2K+=S7U;b2K+=b58;b2K+=V7U;var h2K=W4r;h2K+=o4r;var N2K=W4r;N2K+=L8G;N2K+=L8G;var F2K=L7U;F2K+=M9G;var L5K=b18;L5K+=g0r;L5K+=V0r;var V5K=C6r;V5K+=O7U;var that=this;var classPrefix=this[a4r][X7U];var onChange=function(){var t7U="nChan";var S5K=G16.z0r;S5K+=k1r;var T5K=O0r;T5K+=W4r;T5K+=e1r;var w5K=V8G;w5K+=s7U;var y5K=W4r;y5K+=t7U;y5K+=S5G;y5K+=V0r;that[a4r][y5K][a4G](that,that[G7G][w5K][q1G](),that[y0r][O0r],that[T5K][S5K]);};if(!this[y0r][V5K][L5K]){var X5K=a4r;X5K+=y0r;X5K+=y0r;var O5K=y5G;O5K+=e1r;this[O5K][B3U][X5K](l7G,L7G);}if(!this[y0r][l0U][Z0U]){var s5K=a4r;s5K+=y0r;s5K+=y0r;this[G7G][Z0U][s5K](l7G,L7G);}if(!this[y0r][l0U][P0U]){var M2K=q0U;M2K+=V0r;var i2K=y0r;i2K+=C6r;i2K+=G16.e0r;i2K+=o4r;var B2K=a4r;B2K+=c4r;B2K+=Q38;var v2K=v0U;v2K+=V0r;var q2K=O0r;q2K+=W4r;q2K+=e1r;var P2K=l4r;P2K+=B0U;P2K+=V0r;var Z2K=i0U;Z2K+=F3U;var l2K=g0r;l2K+=G16.z0r;l2K+=e1r;l2K+=V0r;var t5K=O0r;t5K+=m7G;this[t5K][l2K][X38](O48+classPrefix+Z2K)[P2K]();this[q2K][v2K][B2K](i2K)[s38](c7r)[M2K]();}this[F2K]();this[G7G][A0G][l08](M0U,N2K)[h2K](b2K,function(){var N0U=':disabled';var J2K=U7G;J2K+=G16.e0r;J2K+=n1r;var U2K=V8G;U2K+=S28;U2K+=g0r;var Y2K=y5G;Y2K+=e1r;var W2K=V8G;W2K+=S28;W2K+=g0r;var x2K=G16.z0r;x2K+=y0r;var u2K=i0G;u2K+=M0G;var E2K=O0r;E2K+=W4r;E2K+=e1r;if(that[E2K][u2K][x2K](F0U)||that[G7G][W2K][L6r](N0U)){return;}that[q1G](that[Y2K][U2K][J2K](),g5G);that[Y6G]();})[C2K](h0U,function(){var e2K=G16.z0r;e2K+=y0r;var G2K=C0G;G2K+=e08;G2K+=H8G;G2K+=l4r;if(that[G7G][G2K][e2K](F0U)){var n2K=f0G;n2K+=d1r;n2K+=g0r;var d2K=U7G;d2K+=G16.e0r;d2K+=n1r;that[d2K](that[G7G][n2K][q1G](),g5G);}});this[Q2K][A2K][G16.R0r](z2K,b0U,function(){var g0U="tSeconds";var k0U="_writeOu";var j0U='-minutes';var c0U="setUTCH";var a0U='-ampm';var r0U="tUT";var p0U="hours12";var K0U="etTime";var o0U="_writeOutpu";var R0U='-hours';var z0U="_setCalander";var A0U="Year";var Q0U="tUTCFull";var n0U="_setTitle";var e0U="_setCaland";var G0U='-month';var J0U="-am";var U0U="asClass";var Y0U="ond";var u0U="siti";var O2K=E0U;O2K+=W4r;O2K+=u0U;O2K+=G16.R0r;var L2K=G16.z0r;L2K+=x0U;L2K+=D1r;var V2K=O0r;V2K+=W4r;V2K+=e1r;var T2K=M4m;T2K+=W0U;T2K+=Y0U;T2K+=y0r;var w2K=c4r;w2K+=U0U;var f2K=J0U;f2K+=C6r;f2K+=e1r;var r2K=J0G;r2K+=f38;r2K+=y0r;var K2K=U3U;K2K+=f4r;var R2K=C0U;R2K+=V68;var select=$(this);var val=select[q1G]();if(select[R2K](classPrefix+G0U)){var o2K=e0U;o2K+=d4r;that[d0U](that[y0r][Z6G],val);that[n0U]();that[o2K]();}else if(select[d88](classPrefix+K2K)){var p2K=y0r;p2K+=V0r;p2K+=Q0U;p2K+=A0U;that[y0r][Z6G][p2K](val);that[n0U]();that[z0U]();}else if(select[r2K](classPrefix+R0U)||select[d88](classPrefix+f2K)){var I2K=o0U;I2K+=g0r;var m2K=b6G;m2K+=K0U;var a2K=X9U;a2K+=l4r;a2K+=g0r;a2K+=y0r;if(that[y0r][a2K][p0U]){var H2K=h8G;H2K+=r0U;H2K+=v88;H2K+=f0U;var k2K=C6r;k2K+=e1r;var j2K=X8G;j2K+=b4r;var c2K=L8G;c2K+=S6G;var hours=$(that[G7G][I7G])[c2K](S48+classPrefix+R0U)[q1G]()*c7r;var pm=$(that[G7G][I7G])[j2K](S48+classPrefix+a0U)[q1G]()===k2K;that[y0r][O0r][H2K](hours===w7r&&!pm?a7r:pm&&hours!==w7r?hours+w7r:hours);}else{var g2K=c0U;g2K+=W4r;g2K+=d1r;g2K+=F5m;that[y0r][O0r][g2K](val);}that[m2K]();that[I2K](D5G);onChange();}else if(select[d88](classPrefix+j0U)){var y2K=k0U;y2K+=g0r;y2K+=s7U;var D2K=b6G;D2K+=h78;D2K+=v4r;D2K+=l1r;that[y0r][O0r][H0U](val);that[D2K]();that[y2K](D5G);onChange();}else if(select[w2K](classPrefix+T2K)){var S2K=h8G;S2K+=g0U;that[y0r][O0r][S2K](val);that[T7U]();that[w7U](D5G);onChange();}that[V2K][L2K][C7G]();that[O2K]();})[X2K](N7G,function(e){var V1U="ocu";var S1U="Calan";var T1U="_set";var w1U="setUTCMonth";var y1U="setUTCFullYear";var D1U="eToUtc";var I1U="TCDate";var m1U="tU";var g1U="onth";var H1U="etUTCD";var k1U="getUT";var c1U="TCHo";var r1U="getUTC";var p1U="ndsR";var o1U="etTim";var R1U='range';var A1U="sC";var Q1U='seconds';var n1U="ange";var d1U="sR";var e1U="minute";var G1U="minutesRange";var J1U="utes";var W1U="setUTCHou";var x1U="nu";var u1U="setUTCMinut";var E1U="tSecon";var b1U="setTime";var h1U="teOutput";var N1U="_wri";var F1U="etUTCMonth";var M1U="ander";var i1U="setCal";var B1U='-iconRight';var q1U="setUTCMon";var P1U="tTitle";var Z1U="nder";var l1U="_setCala";var t0U='-iconLeft';var s0U="sabled";var X0U="asC";var O0U="parentNode";var L0U="ase";var V0U="werC";var S0U="spa";var T0U="tar";var w0U="eName";var y0U="werCase";var D0U="toLo";var I0U="agation";var m0U="opProp";var B3K=A4r;B3K+=m0U;B3K+=I0U;var v3K=D0U;v3K+=y0U;var q3K=u1G;q3K+=O0r;q3K+=w0U;var P3K=g0r;P3K+=M18;var Z3K=T0U;Z3K+=A78;var l3K=S0U;l3K+=o4r;var t2K=D0U;t2K+=V0U;t2K+=L0U;var s2K=k58;s2K+=l4r;s2K+=A78;var d=that[y0r][O0r];var nodeName=e[s2K][w8U][t2K]();var target=nodeName===l3K?e[Z3K][O0U]:e[P3K];nodeName=target[q3K][v3K]();if(nodeName===b0U){return;}e[B3K]();if(nodeName===M8m){var n3K=M4m;n3K+=Z0U;var d3K=X9U;d3K+=F6G;d3K+=p7G;var b3K=c4r;b3K+=X0U;b3K+=L2G;var N3K=w58;N3K+=q5G;N3K+=V0r;var F3K=c4r;F3K+=X0U;F3K+=f38;F3K+=y0r;var M3K=H0r;M3K+=s0U;var i3K=f5G;i3K+=y0r;i3K+=j58;i3K+=y0r;var button=$(target);var parent=button[i4G]();if(parent[i3K](M3K)&&!parent[F3K](N3K)){var h3K=q0G;h3K+=W9G;button[h3K]();return;}if(parent[b3K](classPrefix+t0U)){var Y3K=O0r;Y3K+=W4r;Y3K+=e1r;var W3K=l1U;W3K+=Z1U;var x3K=d7U;x3K+=P1U;var u3K=q1U;u3K+=p28;var E3K=C1r;E3K+=l5m;E3K+=H68;that[y0r][E3K][u3K](that[y0r][Z6G][v1U]()-c7r);that[x3K]();that[W3K]();that[Y3K][A0G][C7G]();}else if(parent[d88](classPrefix+B1U)){var e3K=F4r;e3K+=p0G;var G3K=w1r;G3K+=i1U;G3K+=M1U;var C3K=b6G;C3K+=V0r;C3K+=g0r;C3K+=a2U;var J3K=S5G;J3K+=F1U;var U3K=C1r;U3K+=C6r;U3K+=e1G;U3K+=m4r;that[d0U](that[y0r][Z6G],that[y0r][U3K][J3K]()+c7r);that[C3K]();that[G3K]();that[G7G][A0G][e3K]();}else if(button[d3K](S48+classPrefix+n3K)[H5G]){var O3K=N1U;O3K+=h1U;var L3K=w1r;L3K+=b1U;var V3K=h8G;V3K+=E1U;V3K+=O0r;V3K+=y0r;var S3K=u1U;S3K+=V0r;S3K+=y0r;var T3K=v2U;T3K+=x1U;T3K+=g0r;T3K+=O4r;var w3K=W1U;w3K+=F5m;var y3K=c4r;y3K+=Y1U;var m3K=C6r;m3K+=e1r;var H3K=G16.e0r;H3K+=e1r;var o3K=U1U;o3K+=J1U;var R3K=d1r;R3K+=o4r;R3K+=G16.z0r;R3K+=g0r;var z3K=J3G;z3K+=G16.e0r;var A3K=t8m;A3K+=g0G;var Q3K=b18;Q3K+=k58;var val=button[Q3K](A3K);var unit=button[z3K](R3K);if(unit===o3K){var p3K=w58;p3K+=I08;var K3K=C1r;K3K+=G16.e0r;K3K+=C1U;if(parent[d88](K3K)&&parent[d88](p3K)){var r3K=b6G;r3K+=V0r;r3K+=g0r;r3K+=v1r;that[y0r][G1U]=val;that[r3K]();return;}else{var f3K=e1U;f3K+=d1U;f3K+=n1U;that[y0r][f3K]=X3G;}}if(unit===Q1U){var a3K=f5G;a3K+=A1U;a3K+=n1r;a3K+=E7G;if(parent[d88](z1U)&&parent[a3K](R1U)){var j3K=b6G;j3K+=o1U;j3K+=V0r;var c3K=P0U;c3K+=K1U;c3K+=n1U;that[y0r][c3K]=val;that[j3K]();return;}else{var k3K=W0U;k3K+=W4r;k3K+=p1U;k3K+=n1U;that[y0r][k3K]=X3G;}}if(val===H3K){var g3K=r1U;g3K+=x4r;g3K+=Y1U;if(d[g3K]()>=w7r){val=d[f1U]()-w7r;}else{return;}}else if(val===m3K){var I3K=a1U;I3K+=c1U;I3K+=j1U;if(d[I3K]()<w7r){var D3K=k1U;D3K+=v88;D3K+=f0U;val=d[D3K]()+w7r;}else{return;}}var set=unit===y3K?w3K:unit===T3K?S3K:V3K;d[set](val);that[L3K]();that[O3K](D5G);onChange();}else{var B7K=O0r;B7K+=G16.e0r;B7K+=m4r;var v7K=J3G;v7K+=G16.e0r;var q7K=y0r;q7K+=H1U;q7K+=q6r;var P7K=e1r;P7K+=g1U;var Z7K=O0r;Z7K+=G16.e0r;Z7K+=g0r;Z7K+=G16.e0r;var l7K=m4r;l7K+=u28;l7K+=l4r;var t3K=b18;t3K+=g0r;t3K+=G16.e0r;var s3K=y0r;s3K+=V0r;s3K+=m1U;s3K+=I1U;if(!d){var X3K=w1r;X3K+=O0r;X3K+=b58;X3K+=D1U;d=that[X3K](new Date());}d[s3K](c7r);d[y1U](button[t3K](l7K));d[w1U](button[Z7K](P7K));d[q7K](button[v7K](B7K));that[w7U](D5G);if(!that[y0r][l0U][Z0U]){setTimeout(function(){var i7K=C6G;i7K+=G16.z0r;i7K+=Z1r;that[i7K]();},D7r);}else{var M7K=T1U;M7K+=S1U;M7K+=Z1r;M7K+=l4r;that[M7K]();}onChange();}}else{var N7K=L8G;N7K+=V1U;N7K+=y0r;var F7K=f0G;F7K+=D1r;that[G7G][F7K][N7K]();}});},_compareDates:function(a,b){var O1U="_dateToUtcStrin";var L1U="String";var b7K=f7U;b7K+=L1U;var h7K=O1U;h7K+=S5G;return this[h7K](a)===this[b7K](b);},_correctMonth:function(date,month){var v4U="CDat";var q4U="setUT";var P4U="Month";var t1U="etUTCFullYear";var s1U="UTCDate";var X1U="UTCMo";var x7K=I1G;x7K+=X1U;x7K+=O1r;x7K+=c4r;var u7K=S5G;u7K+=V0r;u7K+=g0r;u7K+=s1U;var E7K=S5G;E7K+=t1U;var days=this[l4U](date[E7K](),month);var correctDays=date[u7K]()>days;date[x7K](month);if(correctDays){var Y7K=y0r;Y7K+=Z4U;Y7K+=v88;Y7K+=P4U;var W7K=q4U;W7K+=v4U;W7K+=V0r;date[W7K](days);date[Y7K](month);}},_daysInMonth:function(year,month){var q0r=31;var P0r=30;var Z0r=29;var l0r=28;var isLeap=year%H7r===a7r&&(year%h0r!==a7r||year%E0r===a7r);var months=[q0r,isLeap?Z0r:l0r,q0r,P0r,q0r,P0r,q0r,q0r,P0r,q0r,P0r,q0r];return months[month];},_dateToUtc:function(s){var b4U="getMinutes";var h4U="getHours";var N4U="getMonth";var i4U="getD";var B4U="Seconds";var C7K=A78;C7K+=B4U;var J7K=i4U;J7K+=q6r;var U7K=M4U;U7K+=v4r;U7K+=v88;return new Date(Date[U7K](s[F4U](),s[N4U](),s[J7K](),s[h4U](),s[b4U](),s[C7K]()));},_dateToUtcString:function(d){var u4U="Mon";var E4U="CDate";var e7K=a1U;e7K+=v4r;e7K+=E4U;var G7K=A78;G7K+=y7U;G7K+=u4U;G7K+=p28;return d[x4U]()+I68+this[W4U](d[G7K]()+c7r)+I68+this[W4U](d[e7K]());},_hide:function(){var n4U='click.';var e4U='keydown.';var G4U="namespace";var C4U="containe";var J4U="ntent";var U4U="TE_Body_Co";var Y4U="iv.D";var z7K=l98;z7K+=z5m;var A7K=O0r;A7K+=Y4U;A7K+=U4U;A7K+=J4U;var Q7K=W4r;Q7K+=L8G;Q7K+=L8G;var n7K=C4U;n7K+=l4r;var d7K=O0r;d7K+=W4r;d7K+=e1r;var namespace=this[y0r][G4U];this[d7K][n7K][L0G]();$(window)[Q7K](S48+namespace);$(document)[b78](e4U+namespace);$(A7K)[b78](d4U+namespace);$(z7K)[b78](n4U+namespace);},_hours24To12:function(val){return val===a7r?w7r:val>w7r?val-w7r:val;},_htmlDay:function(day){var O4U='</button>';var S4U="day";var T4U='" data-day="';var D4U="today";var I4U='selectable';var m4U="pty\"></td>";var g4U="ass=\"em";var H4U="<td c";var k4U="pty";var j4U="abled";var c4U="-day=";var a4U="<td d";var f4U="<button cla";var r4U="n ";var p4U="-butto";var K4U="\" type=\"button\" ";var o4U="ar=\"";var R4U="a-ye";var z4U="h=";var A4U="-mont";var Q4U="\" data";var w7K=O0r;w7K+=G16.e0r;w7K+=m4r;var y7K=G5G;y7K+=z2G;var D7K=e1r;D7K+=W4r;D7K+=O1r;D7K+=c4r;var I7K=Q4U;I7K+=A4U;I7K+=z4U;I7K+=G5G;var m7K=J3G;m7K+=R4U;m7K+=o4U;var g7K=a3U;g7K+=G16.e0r;g7K+=m4r;g7K+=K4U;var H7K=p4U;H7K+=r4U;var k7K=f4U;k7K+=w7G;k7K+=Q5G;var j7K=G5G;j7K+=z2G;var c7K=G5G;c7K+=i3U;var a7K=b18;a7K+=m4r;var f7K=a4U;f7K+=Y3G;f7K+=c4U;f7K+=G5G;var K7K=C1r;K7K+=j4U;var R7K=w68;R7K+=k4U;if(day[R7K]){var o7K=H4U;o7K+=n1r;o7K+=g4U;o7K+=m4U;return o7K;}var classes=[I4U];var classPrefix=this[a4r][X7U];if(day[K7K]){var p7K=S28;p7K+=G6G;classes[p7K](z1U);}if(day[D4U]){var r7K=o4r;r7K+=W4r;r7K+=M6r;classes[z5G](r7K);}if(day[y4U]){classes[z5G](K2U);}return f7K+day[a7K]+c7K+classes[m68](z3G)+j7K+k7K+classPrefix+H7K+classPrefix+g7K+m7K+day[w4U]+I7K+day[D7K]+T4U+day[S4U]+y7K+V4U+day[w7K]+L4U+O4U+X4U;},_htmlMonth:function(year,month){var H6U='</table>';var c6U="-iconRig";var a6U="onLeft";var f6U="-ic";var r6U="mb";var p6U=" weekNu";var R6U="_htmlWeekOfYear";var z6U="showWeekNumber";var A6U="getUTCDay";var Q6U="_compareDates";var n6U="Dates";var d6U="mpar";var e6U="_co";var G6U="ableDay";var C6U="Day";var J6U="_html";var U6U="CHours";var Y6U="UT";var W6U="tSeco";var x6U="setUTCHour";var u6U="inut";var E6U="setUTC";var b6U="tSecond";var F6U="firstDay";var M6U="Utc";var i6U="dateTo";var B6U="CDay";var v6U="-tab";var q6U="thead>";var P6U="tmlMonthHea";var Z6U="ad>";var l6U="/the";var t4U="dy>";var s4U="</tbo";var O7r=23;var Q0K=s4U;Q0K+=t4U;var n0K=G9m;n0K+=W4r;n0K+=V8G;var d0K=i2G;d0K+=l6U;d0K+=Z6U;var e0K=w1r;e0K+=c4r;e0K+=P6U;e0K+=O0r;var G0K=i2G;G0K+=q6U;var N0K=v6U;N0K+=n1r;N0K+=V0r;var L7K=v2U;L7K+=o4r;L7K+=B1r;var S7K=S5G;S7K+=Z4U;S7K+=B6U;var T7K=w1r;T7K+=i6U;T7K+=M6U;var now=this[T7K](new Date()),days=this[l4U](year,month),before=new Date(Date[y7U](year,month,c7r))[S7K](),data=[],row=[];if(this[a4r][F6U]>a7r){var V7K=N6U;V7K+=g0r;V7K+=h6U;V7K+=m4r;before-=this[a4r][V7K];if(before<a7r){before+=m7r;}}var cells=days+before,after=cells;while(after>m7r){after-=m7r;}cells+=m7r-after;var minDate=this[a4r][L7K];var maxDate=this[a4r][G7U];if(minDate){var s7K=h8G;s7K+=b6U;s7K+=y0r;var X7K=E6U;X7K+=r4r;X7K+=u6U;X7K+=O4r;var O7K=x6U;O7K+=y0r;minDate[O7K](a7r);minDate[X7K](a7r);minDate[s7K](a7r);}if(maxDate){var l0K=h8G;l0K+=W6U;l0K+=o4r;l0K+=n4G;var t7K=y0r;t7K+=h78;t7K+=Y6U;t7K+=U6U;maxDate[t7K](O7r);maxDate[H0U](M0r);maxDate[l0K](M0r);}for(var i=a7r,r=a7r;i<cells;i++){var i0K=J6U;i0K+=C6U;var B0K=S28;B0K+=y0r;B0K+=c4r;var v0K=E18;v0K+=B4G;v0K+=G16.R0r;var q0K=V8G;q0K+=K4r;q0K+=l3m;q0K+=m4r;var P0K=C1r;P0K+=G6U;P0K+=y0r;var Z0K=e6U;Z0K+=d6U;Z0K+=V0r;Z0K+=n6U;var day=new Date(Date[y7U](year,month,c7r+(i-before))),selected=this[y0r][O0r]?this[Q6U](day,this[y0r][O0r]):g5G,today=this[Z0K](day,now),empty=i<before||i>=days+before,disabled=minDate&&day<minDate||maxDate&&day>maxDate;var disableDays=this[a4r][P0K];if($[a1G](disableDays)&&$[q0K](day[A6U](),disableDays)!==-c7r){disabled=D5G;}else if(typeof disableDays===v0K&&disableDays(day)===D5G){disabled=D5G;}var dayConfig={day:c7r+(i-before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[B0K](this[i0K](dayConfig));if(++r===m7r){var F0K=G9m;F0K+=T2m;var M0K=C6r;M0K+=d1r;M0K+=y0r;M0K+=c4r;if(this[a4r][z6U]){row[A3m](this[R6U](i-before,month,year));}data[M0K](o6U+row[F0K](N5G)+K6U);row=[];r=a7r;}}var classPrefix=this[a4r][X7U];var className=classPrefix+N0K;if(this[a4r][z6U]){var h0K=p6U;h0K+=r6U;h0K+=V0r;h0K+=l4r;className+=h0K;}if(minDate){var u0K=a4r;u0K+=w7G;var E0K=f6U;E0K+=a6U;var b0K=g0r;b0K+=M2U;var underMin=minDate>=new Date(Date[y7U](year,month,c7r,a7r,a7r,a7r));this[G7G][b0K][F18](O48+classPrefix+E0K)[u0K](l7G,underMin?L7G:z4G);}if(maxDate){var C0K=q0G;C0K+=u9G;C0K+=F4G;var J0K=o4r;J0K+=Q68;var U0K=H0r;U0K+=y0r;U0K+=l5m;U0K+=H68;var Y0K=c6U;Y0K+=V0G;var W0K=O0r;W0K+=G16.z0r;W0K+=U7G;W0K+=S58;var x0K=M4U;x0K+=v4r;x0K+=v88;var overMax=maxDate<new Date(Date[x0K](year,month+c7r,c7r,a7r,a7r,a7r));this[G7G][U8m][F18](W0K+classPrefix+Y0K)[A4G](U0K,overMax?J0K:C0K);}return j6U+className+o3G+G0K+this[e0K]()+d0K+k6U+data[n0K](N5G)+Q0K+H6U;},_htmlMonthHead:function(){var T6U='</th>';var w6U="<t";var y6U='<th></th>';var I6U="tDay";var m6U="ekNumb";var g6U="show";var p0K=G9m;p0K+=E3m;p0K+=o4r;var R0K=g6U;R0K+=Y4r;R0K+=m6U;R0K+=d4r;var z0K=G16.z0r;z0K+=f0r;z0K+=P2m;var A0K=N6U;A0K+=I6U;var a=[];var firstDay=this[a4r][A0K];var i18n=this[a4r][z0K];var dayName=function(day){var D6U="weekdays";day+=firstDay;while(day>=m7r){day-=m7r;}return i18n[D6U][day];};if(this[a4r][R0K]){a[z5G](y6U);}for(var i=a7r;i<m7r;i++){var K0K=w6U;K0K+=c4r;K0K+=z2G;var o0K=C6r;o0K+=d1r;o0K+=y0r;o0K+=c4r;a[o0K](K0K+dayName(i)+T6U);}return a[p0K](N5G);},_htmlWeekOfYear:function(d,m,y){var s6U="ceil";var X6U="etD";var O6U="<td class=";var L6U="Prefi";var V6U="eek";var S6U="-w";var J0r=86400000;var k0K=S6U;k0K+=V6U;k0K+=J2G;var j0K=r3U;j0K+=L6U;j0K+=L0r;var c0K=O6U;c0K+=G5G;var a0K=S5G;a0K+=X6U;a0K+=G16.e0r;a0K+=m4r;var f0K=S5G;f0K+=h78;f0K+=M1r;f0K+=q6r;var r0K=I1G;r0K+=h6U;r0K+=g0r;r0K+=V0r;var date=new Date(y,m,d,a7r,a7r,a7r,a7r);date[r0K](date[f0K]()+H7r-(date[a0K]()||m7r));var oneJan=new Date(y,a7r,c7r);var weekNum=Math[s6U](((date-oneJan)/J0r+c7r)/m7r);return c0K+this[a4r][j0K]+k0K+weekNum+X4U;},_options:function(selector,values,labels){var v86="ppe";var q86="value=\"";var P86="ption ";var l86='select.';var t6U="sPrefix";var I0K=x48;I0K+=t6U;var m0K=L8G;m0K+=V8G;m0K+=O0r;var g0K=r0G;g0K+=o4r;g0K+=d4r;var H0K=O0r;H0K+=m7G;if(!labels){labels=values;}var select=this[H0K][g0K][m0K](l86+this[a4r][I0K]+I68+selector);select[J7U]();for(var i=a7r,ien=values[H5G];i<ien;i++){var w0K=i2G;w0K+=T4G;w0K+=Z86;w0K+=Q3U;var y0K=i2G;y0K+=W4r;y0K+=P86;y0K+=q86;var D0K=G16.e0r;D0K+=v86;D0K+=o4r;D0K+=O0r;select[D0K](y0K+values[i]+o3G+labels[i]+w0K);}},_optionSet:function(selector,val){var x86="unknown";var u86="ect.";var E86="ix";var b86="ref";var h86="lassP";var N86="dre";var F86="hil";var M86="lected";var i86="option:se";var B86="engt";var P1K=G16.z0r;P1K+=p2U;P1K+=o4r;var Z1K=g0r;Z1K+=V0r;Z1K+=L0r;Z1K+=g0r;var l1K=n1r;l1K+=B86;l1K+=c4r;var t0K=i86;t0K+=M86;var s0K=L8G;s0K+=G16.z0r;s0K+=o4r;s0K+=O0r;var X0K=t8m;X0K+=n1r;var O0K=y0r;O0K+=X9U;O0K+=o4r;var L0K=a4r;L0K+=F86;L0K+=N86;L0K+=o4r;var V0K=a4r;V0K+=h86;V0K+=b86;V0K+=E86;var S0K=h8G;S0K+=n1r;S0K+=u86;var T0K=L8G;T0K+=V8G;T0K+=O0r;var select=this[G7G][I7G][T0K](S0K+this[a4r][V0K]+I68+selector);var span=select[i4G]()[L0K](O0K);select[X0K](val);var selected=select[s0K](t0K);span[O0G](selected[l1K]!==a7r?selected[Z1K]():this[a4r][P1K][x86]);},_optionsTime:function(unit,count,val,allowed,range){var L86='</th></tr></thead>';var V86='-nospace"><tbody>';var S86="ran";var T86="thead><table class=";var w86="</tbody></";var y86="loor";var D86="<tr";var I86="r>";var m86="amPm";var g86="mPm";var H86="/tr>";var Q86='-table';var n86="Prefix";var d86="fix";var e86="lassPr";var G86="><tr><th colspan=\"";var C86="<the";var J86="ody>";var U86="</tb";var Y86="e>";var W86="</t";var f1K=W86;f1K+=X7G;f1K+=Y86;var r1K=U86;r1K+=J86;var p1K=C86;p1K+=q88;p1K+=G86;var K1K=G5G;K1K+=z2G;var i1K=K28;i1K+=g0r;i1K+=c4r;var B1K=G16.z0r;B1K+=M3G;var v1K=a4r;v1K+=e86;v1K+=V0r;v1K+=d86;var q1K=r3U;q1K+=n86;var classPrefix=this[a4r][q1K];var container=this[G7G][I7G][F18](O48+classPrefix+I68+unit);var i,j;var render=count===w7r?function(i){return i;}:this[W4U];var classPrefix=this[a4r][v1K];var className=classPrefix+Q86;var i18n=this[a4r][B1K];if(!container[i1K]){return;}var a=N5G;var span=D7r;var button=function(value,label,className){var k86='-day" type="button" data-unit="';var j86='-button ';var a86="isabled";var f86=" d";var r86="umb";var p86="elected";var K86="ss=\"selectable ";var o86="<td cla";var R86=" data-value";var A86="</bu";var U1K=P2G;U1K+=g0r;U1K+=O0r;U1K+=z2G;var Y1K=A86;Y1K+=n2U;Y1K+=z2G;var W1K=J3U;W1K+=z86;var x1K=G5G;x1K+=R86;x1K+=Q5G;var u1K=G5G;u1K+=z2G;var E1K=o86;E1K+=K86;var h1K=G16.z0r;h1K+=b7m;var N1K=y0r;N1K+=p86;var F1K=G16.e0r;F1K+=e1r;var M1K=o4r;M1K+=r86;M1K+=d4r;if(count===w7r&&val>=w7r&&typeof value===M1K){value+=w7r;}var selected=val===value||value===F1K&&val<w7r||value===b8U&&val>=w7r?N1K:N5G;if(allowed&&$[h1K](value,allowed)===-c7r){var b1K=f86;b1K+=a86;selected+=b1K;}if(className){selected+=z3G+className;}return E1K+selected+u1K+c86+classPrefix+j86+classPrefix+k86+unit+x1K+value+o3G+W1K+label+L4U+Y1K+U1K;};if(count===w7r){var d1K=i2G;d1K+=H86;var e1K=C6r;e1K+=e1r;var G1K=G16.e0r;G1K+=g86;var C1K=G16.e0r;C1K+=e1r;var J1K=i2G;J1K+=g0r;J1K+=l4r;J1K+=z2G;a+=J1K;for(i=c7r;i<=g7r;i++){a+=button(i,render(i));}a+=button(C1K,i18n[G1K][a7r]);a+=K6U;a+=o6U;for(i=m7r;i<=w7r;i++){a+=button(i,render(i));}a+=button(e1K,i18n[m86][c7r]);a+=d1K;span=m7r;}else if(count===X7r){var c=a7r;for(j=a7r;j<H7r;j++){var Q1K=i2G;Q1K+=T4G;Q1K+=g0r;Q1K+=I86;var n1K=i2G;n1K+=g0r;n1K+=l4r;n1K+=z2G;a+=n1K;for(i=a7r;i<g7r;i++){a+=button(c,render(c));c++;}a+=Q1K;}span=g7r;}else{var o1K=D86;o1K+=z2G;var R1K=L8G;R1K+=y86;var z1K=w86;z1K+=T86;z1K+=G5G;a+=o6U;for(j=a7r;j<F0r;j+=D7r){var A1K=S86;A1K+=S5G;A1K+=V0r;a+=button(j,render(j),A1K);}a+=K6U;a+=z1K+className+z3G+className+V86;var start=range!==X3G?range:Math[R1K](val/D7r)*D7r;a+=o1K;for(j=start+c7r;j<start+D7r;j++){a+=button(j,render(j));}a+=K6U;span=g7r;}container[J7U]()[u6G](j6U+className+K1K+p1K+span+o3G+i18n[unit]+L86+k6U+a+r1K+f1K);},_optionsTitle:function(){var q96="_range";var P96="yearRange";var Z96="FullYe";var l96="ear";var t86="getFullY";var s86="optio";var X86="ths";var O86="mon";var I1K=O86;I1K+=X86;var m1K=e1r;m1K+=P68;m1K+=c4r;var g1K=w1r;g1K+=s86;g1K+=o4r;g1K+=y0r;var H1K=w4U;H1K+=K1U;H1K+=G16.e0r;H1K+=I08;var k1K=t86;k1K+=l96;var j1K=S5G;j1K+=h78;j1K+=Z96;j1K+=f4r;var c1K=U1U;c1K+=M1r;c1K+=G16.e0r;c1K+=h6G;var a1K=G16.z0r;a1K+=M3G;var i18n=this[a4r][a1K];var min=this[a4r][c1K];var max=this[a4r][G7U];var minYear=min?min[F4U]():X3G;var maxYear=max?max[j1K]():X3G;var i=minYear!==X3G?minYear:new Date()[F4U]()-this[a4r][P96];var j=maxYear!==X3G?maxYear:new Date()[k1K]()+this[a4r][H1K];this[g1K](m1K,this[q96](a7r,y7r),i18n[I1K]);this[v96](B96,this[q96](i,j));},_pad:function(i){var i96='0';return i<D7r?i96+i:i;},_position:function(){var E96="wid";var b96="height";var h96="offs";var N96="Heigh";var F96="ndTo";var M96="outerW";var s1K=n1r;s1K+=V0r;s1K+=L8G;s1K+=g0r;var O1K=M96;O1K+=u3G;O1K+=g0r;O1K+=c4r;var L1K=G16.e0r;L1K+=C6r;L1K+=D0r;L1K+=F96;var V1K=n1r;V1K+=V0r;V1K+=L8G;V1K+=g0r;var S1K=a88;S1K+=V1r;S1K+=N96;S1K+=g0r;var T1K=O0r;T1K+=W4r;T1K+=e1r;var w1K=l0G;w1K+=b0G;var y1K=y5G;y1K+=e1r;var D1K=h96;D1K+=h78;var offset=this[G7G][A0G][D1K]();var container=this[y1K][w1K];var inputHeight=this[T1K][A0G][S1K]();container[A4G]({top:offset[n58]+inputHeight,left:offset[V1K]})[L1K](V7G);var calHeight=container[g88]();var calWidth=container[O1K]();var scrollTop=$(window)[M98]();if(offset[n58]+inputHeight+calHeight-scrollTop>$(window)[b96]()){var X1K=g0r;X1K+=W4r;X1K+=C6r;var newTop=offset[n58]-calHeight;container[A4G](X1K,newTop<a7r?a7r:newTop);}if(calWidth+offset[s1K]>$(window)[p78]()){var l4K=n1r;l4K+=n78;var t1K=E96;t1K+=p28;var newLeft=$(window)[t1K]()-calWidth;container[A4G](l4K,newLeft<a7r?a7r:newLeft);}},_range:function(start,end,inc){var a=[];if(!inc){inc=c7r;}for(var i=start;i<=end;i+=inc){var Z4K=S28;Z4K+=G6G;a[Z4K](i);}return a;},_setCalander:function(){var W96="_htmlMonth";var x96="mpty";var P4K=H0r;P4K+=y0r;P4K+=y7G;if(this[y0r][P4K]){var B4K=H0r;B4K+=u96;var v4K=V0r;v4K+=x96;var q4K=x5m;q4K+=l3U;this[G7G][q4K][v4K]()[u6G](this[W96](this[y0r][B4K][x4U](),this[y0r][Z6G][v1U]()));}},_setTitle:function(){var J96='month';var U96="_optionSet";var Y96="disp";var i4K=Y96;i4K+=n1r;i4K+=H68;this[U96](J96,this[y0r][i4K][v1U]());this[U96](B96,this[y0r][Z6G][x4U]());},_setTime:function(){var a96="secondsRange";var f96="getUTCMinutes";var r96='minutes';var p96="_optionsTime";var A96="12";var Q96="hoursAvail";var n96="sRange";var d96="inute";var e96="nsT";var G96="_optio";var C96="etSecond";var U4K=W0U;U4K+=F3U;var Y4K=S5G;Y4K+=C96;Y4K+=y0r;var W4K=W0U;W4K+=F3U;var x4K=G96;x4K+=e96;x4K+=l1r;var u4K=e1r;u4K+=d96;u4K+=n96;var E4K=v96;E4K+=v1r;var b4K=Q96;b4K+=G16.e0r;b4K+=k7G;var h4K=c4r;h4K+=W4r;h4K+=j1U;h4K+=A96;var N4K=c4r;N4K+=Y1U;var that=this;var d=this[y0r][O0r];var hours=d?d[f1U]():a7r;var allowed=function(prop){var K96='Available';var o96="_ra";var R96="ement";var z96="Incr";var F4K=z96;F4K+=R96;var M4K=o96;M4K+=I08;return that[a4r][prop+K96]?that[a4r][prop+K96]:that[M4K](a7r,M0r,that[a4r][prop+F4K]);};this[p96](N4K,this[y0r][l0U][h4K]?w7r:X7r,hours,this[a4r][b4K]);this[E4K](r96,F0r,d?d[f96]():a7r,allowed(r96),this[y0r][u4K]);this[x4K](W4K,F0r,d?d[Y4K]():a7r,allowed(U4K),this[y0r][a96]);},_show:function(){var m96="_position";var g96="namespa";var H96="l.";var k96="resiz";var j96="own.";var Q4K=c96;Q4K+=m4r;Q4K+=O0r;Q4K+=j96;var n4K=W4r;n4K+=o4r;var e4K=W4r;e4K+=o4r;var G4K=l5G;G4K+=k96;G4K+=V0r;G4K+=S58;var C4K=y0r;C4K+=c6G;C4K+=n1r;C4K+=H96;var J4K=g96;J4K+=U8G;var that=this;var namespace=this[y0r][J4K];this[m96]();$(window)[G16.R0r](C4K+namespace+G4K+namespace,function(){that[m96]();});$(m88)[e4K](d4U+namespace,function(){var I96="ition";var d4K=E0U;d4K+=N0m;d4K+=I96;that[d4K]();});$(document)[n4K](Q4K+namespace,function(e){var w96="_hide";var y96="Code";var D96="ey";var I7r=9;var A4K=F4G;A4K+=D96;A4K+=y96;if(e[A4K]===I7r||e[v08]===t7r||e[v08]===T7r){that[w96]();}});setTimeout(function(){var S96="bod";var T96="k.";var o4K=a4r;o4K+=O28;o4K+=T96;var R4K=W4r;R4K+=o4r;var z4K=S96;z4K+=m4r;$(z4K)[R4K](o4K+namespace,function(e){var L96="iner";var V96="nta";var c4K=O0r;c4K+=W4r;c4K+=e1r;var a4K=v68;a4K+=g0r;var f4K=M9G;f4K+=P1G;var r4K=i0G;r4K+=V96;r4K+=L96;var p4K=O0r;p4K+=W4r;p4K+=e1r;var K4K=C6r;K4K+=G16.e0r;K4K+=s9U;var parents=$(e[e88])[K4K]();if(!parents[c9U](that[p4K][r4K])[f4K]&&e[a4K]!==that[c4K][A0G][a7r]){var j4K=w1r;j4K+=l48;that[j4K]();}});},D7r);},_writeOutput:function(focus){var l56="getUTCDate";var t96="momentLocale";var s96="utc";var X96="ome";var O96="TCMon";var D4K=X5G;D4K+=g0r;var I4K=O0r;I4K+=W4r;I4K+=e1r;var m4K=E0U;m4K+=q88;var g4K=a1U;g4K+=O96;g4K+=g0r;g4K+=c4r;var H4K=e1r;H4K+=X96;H4K+=O1r;var k4K=e9G;k4K+=h1r;k4K+=O1r;var date=this[y0r][O0r];var out=window[k4K]?window[H4K][s96](date,undefined,this[a4r][t96],this[a4r][g7U])[w3U](this[a4r][w3U]):date[x4U]()+I68+this[W4U](date[g4K]()+c7r)+I68+this[m4K](date[l56]());this[I4K][D4K][q1G](out);if(focus){var w4K=X5G;w4K+=g0r;var y4K=O0r;y4K+=W4r;y4K+=e1r;this[y4K][w4K][C7G]();}}});Editor[T4K][b7U]=a7r;Editor[S4K][V4K]={classPrefix:L4K,disableDays:X3G,firstDay:c7r,format:Z56,hoursAvailable:X3G,i18n:Editor[j4G][m78][O4K],maxDate:X3G,minDate:X3G,minutesAvailable:X3G,minutesIncrement:c7r,momentStrict:D5G,momentLocale:P56,onChange:function(){},secondsAvailable:X3G,secondsIncrement:c7r,showWeekNumber:g5G,yearRange:D7r};(function(){var H06="uplo";var K06="_container";var R06="Hide";var Q06="uploadMany";var U06="noFileText";var u06="_va";var X76="_picker";var V76="eFn";var S76="datetime";var Y76="datepicker";var Z76="_inp";var H36="radio";var c36="prop";var n36="_addOptions";var U36='_';var u36="input:";var F36="_editor_val";var v36="parator";var P36="separator";var s26="_lastSet";var V26="select";var w26="selec";var a26="placeholder";var z26="option";var Q26="fe";var d26="password";var e26='text';var G26='<input/>';var J26="saf";var U26="npu";var Y26="_val";var W26="hidden";var x26="_in";var u26="_inpu";var F26='div.clearValue button';var M26='div.rendered';var t56="nabled";var V56="_enabled";var J56="_i";var b56="_input";var M56="Type";var i56="only";var B56="extarea";var v56="lect";var q56="check";var d3r=Z2G;d3r+=O0r;var i5r=G48;i5r+=s3G;var G9r=q56;G9r+=G16.Q0r;G9r+=W4r;G9r+=L0r;var f8r=y0r;f8r+=V0r;f8r+=v56;var A8r=g0r;A8r+=B56;var x8r=Z2G;x8r+=O0r;var F8r=l4r;F8r+=V0r;F8r+=q88;F8r+=i56;var Z8r=L8G;Z8r+=T0r;Z8r+=r1r;Z8r+=M56;var l8r=e1r;l8r+=W4r;l8r+=Z1r;l8r+=q2U;var t6K=V0r;t6K+=u9m;var fieldTypes=Editor[b3G];function _buttonText(conf,text){var E56='div.upload button';var h56="uploadText";var N56="hoose file...";var F56="tml";var t4K=c4r;t4K+=F56;var s4K=X8G;s4K+=o4r;s4K+=O0r;if(text===X3G||text===undefined){var X4K=v88;X4K+=N56;text=conf[h56]||X4K;}conf[b56][s4K](E56)[t4K](text);}function _commonUpload(editor,conf,dropCallback,multiple){var N26='change';var i26="addCla";var B26="noD";var v26='dragover.DTE_Upload drop.DTE_Upload';var Z26='dragover';var l26='over';var s56='dragleave dragexit';var S56='div.drop';var T56="dragDropText";var w56='div.drop span';var y56="fin";var D56="here to upload";var I56="Drag and drop a file ";var m56="dro";var g56="dragDrop";var H56='<div class="row second">';var k56='<div class="cell clearValue">';var j56='multiple';var c56='<div class="cell upload limitHide">';var a56="buttonInternal";var f56="pload\">";var r56="_u";var p56="class=\"editor";var K56="iv class=\"eu_table";var o56="iv class=\"row\">";var R56="ut type=\"file\" ";var z56="<inp";var A56="ell limitHide";var Q56="<div class=\"c";var n56="=\"drop\"><span/></div>";var d56="<div class";var e56="iv class=\"cell\">";var G56="red\"/>";var C56="<div class=\"rende";var U56="_ena";var Y56="FileRead";var W56="lick";var x56="file]";var u56="t[type=";var S6K=X5G;S6K+=u56;S6K+=x56;var D6K=a4r;D6K+=W56;var I6K=L8G;I6K+=G16.z0r;I6K+=b4r;var C6K=Y56;C6K+=d4r;var J6K=U56;J6K+=C1U;var U6K=J56;U6K+=x0U;U6K+=D1r;var Y6K=P2G;Y6K+=H0r;Y6K+=S4G;var W6K=i2G;W6K+=R38;W6K+=U7G;W6K+=z2G;var x6K=C56;x6K+=G56;var u6K=r48;u6K+=e56;var E6K=P2G;E6K+=O0r;E6K+=G16.z0r;E6K+=S4G;var b6K=d56;b6K+=n56;var h6K=Q56;h6K+=A56;h6K+=G5G;h6K+=z2G;var N6K=i2G;N6K+=M2G;N6K+=a2G;N6K+=z2G;var F6K=i2G;F6K+=x2G;var M6K=i2G;M6K+=M2G;M6K+=G16.z0r;M6K+=S4G;var i6K=T4G;i6K+=z2G;var B6K=z56;B6K+=R56;var v6K=G5G;v6K+=l5G;v6K+=T4G;v6K+=z2G;var q6K=r48;q6K+=o56;var P6K=r48;P6K+=K56;P6K+=J2G;var Z6K=b2G;Z6K+=p56;Z6K+=r56;Z6K+=f56;var l6K=L8G;l6K+=m0r;l6K+=e1r;var btnClass=editor[e0G][l6K][a56];var container=$(Z6K+P6K+q6K+c56+c86+btnClass+v6K+B6K+(multiple?j56:N5G)+i6K+M6K+k56+c86+btnClass+V38+F6K+N6K+H56+h6K+b6K+E6K+u6K+x6K+m3G+W6K+Y6K+m3G);conf[U6K]=container;conf[J6K]=D5G;_buttonText(conf);if(window[C6K]&&conf[g56]!==g5G){var a6K=H7G;a6K+=W4r;a6K+=y0r;a6K+=V0r;var K6K=W4r;K6K+=o4r;var R6K=W4r;R6K+=o4r;var n6K=m56;n6K+=C6r;var d6K=W4r;d6K+=o4r;var e6K=I56;e6K+=D56;var G6K=y56;G6K+=O0r;container[G6K](w56)[k4G](conf[T56]||e6K);var dragDrop=container[F18](S56);dragDrop[d6K](n6K,function(e){var X56="originalE";var O56="fer";var L56="Trans";if(conf[V56]){var z6K=W4r;z6K+=U7G;z6K+=d4r;var A6K=U3G;A6K+=L56;A6K+=O56;var Q6K=X56;Q6K+=T68;Editor[P9m](editor,conf,e[Q6K][A6K][K5G],_buttonText,dropCallback);dragDrop[E0G](z6K);}return g5G;})[R6K](s56,function(e){var o6K=p18;o6K+=t56;if(conf[o6K]){dragDrop[E0G](l26);}return g5G;})[K6K](Z26,function(e){var q26="addC";var P26="_en";var p6K=P26;p6K+=G16.e0r;p6K+=k7G;p6K+=O0r;if(conf[p6K]){var r6K=q26;r6K+=L2G;dragDrop[r6K](l26);}return g5G;});editor[G16.R0r](R18,function(){var f6K=W4r;f6K+=o4r;$(V7G)[f6K](v26,function(e){return g5G;});})[G16.R0r](a6K,function(){var j6K=W4r;j6K+=L8G;j6K+=L8G;var c6K=G16.Q0r;c6K+=W4r;c6K+=O0r;c6K+=m4r;$(c6K)[j6K](v26);});}else{var m6K=X8G;m6K+=b4r;var g6K=H48;g6K+=b4r;var H6K=B26;H6K+=m8G;H6K+=C6r;var k6K=i26;k6K+=w7G;container[k6K](H6K);container[g6K](container[m6K](M26));}container[I6K](F26)[G16.R0r](D6K,function(){var T6K=a4r;T6K+=G16.e0r;T6K+=W5m;var w6K=y0r;w6K+=V0r;w6K+=g0r;var y6K=e9m;y6K+=Y9G;y6K+=q88;Editor[b3G][y6K][w6K][T6K](editor,conf,N5G);});container[F18](S6K)[G16.R0r](N26,function(){var V6K=d1r;V6K+=C6r;V6K+=Y9G;V6K+=q88;Editor[V6K](editor,conf,this[K5G],_buttonText,function(ids){var b26="e=f";var h26="input[typ";var O6K=t8m;O6K+=n1r;var L6K=h26;L6K+=b26;L6K+=O8G;L6K+=e5G;dropCallback[a4G](editor,ids);container[F18](L6K)[O6K](N5G);});});return container;}function _triggerChange(input){setTimeout(function(){var E26="gger";var s6K=P28;s6K+=Z4G;s6K+=S5G;s6K+=V0r;var X6K=t5G;X6K+=G16.z0r;X6K+=E26;input[X6K](s6K,{editor:D5G,editorSet:D5G});},a7r);}var baseFieldType=$[t6K](D5G,{},Editor[l8r][Z8r],{get:function(conf){var P8r=J56;P8r+=x0U;P8r+=D1r;return conf[P8r][q1G]();},set:function(conf,val){var v8r=U7G;v8r+=G16.e0r;v8r+=n1r;var q8r=u26;q8r+=g0r;conf[q8r][v8r](val);_triggerChange(conf[b56]);},enable:function(conf){var i8r=g6r;i8r+=V1G;var B8r=x26;B8r+=s7U;conf[B8r][i8r](z1U,g5G);},disable:function(conf){var M8r=g6r;M8r+=V1G;conf[b56][M8r](z1U,D5G);},canReturnSubmit:function(conf,node){return D5G;}});fieldTypes[W26]={create:function(conf){conf[Y26]=conf[l9m];return X3G;},get:function(conf){return conf[Y26];},set:function(conf,val){conf[Y26]=val;}};fieldTypes[F8r]=$[F3G](D5G,{},baseFieldType,{create:function(conf){var C26="eId";var u8r=J56;u8r+=U26;u8r+=g0r;var E8r=g0r;E8r+=G48;var b8r=G16.z0r;b8r+=O0r;var h8r=J26;h8r+=C26;var N8r=s2G;N8r+=g0r;N8r+=O7G;N8r+=O0r;conf[b56]=$(G26)[l08]($[N8r]({id:Editor[h8r](conf[b8r]),type:E8r,readonly:Y7G},conf[l08]||{}));return conf[u8r][a7r];}});fieldTypes[k4G]=$[x8r](D5G,{},baseFieldType,{create:function(conf){var C8r=G16.e0r;C8r+=g0r;C8r+=g0r;C8r+=l4r;var J8r=G16.z0r;J8r+=O0r;var U8r=J26;U8r+=V0r;U8r+=S78;U8r+=O0r;var Y8r=G16.e0r;Y8r+=d78;Y8r+=l4r;var W8r=w1r;W8r+=G16.z0r;W8r+=k1r;conf[W8r]=$(G26)[Y8r]($[F3G]({id:Editor[U8r](conf[J8r]),type:e26},conf[C8r]||{}));return conf[b56][a7r];}});fieldTypes[d26]=$[F3G](D5G,{},baseFieldType,{create:function(conf){var n26='password';var Q8r=w1r;Q8r+=V8G;Q8r+=S28;Q8r+=g0r;var n8r=G16.e0r;n8r+=g0r;n8r+=t5G;var d8r=G16.z0r;d8r+=O0r;var e8r=i2G;e8r+=A0G;e8r+=p2G;var G8r=w1r;G8r+=G16.z0r;G8r+=U26;G8r+=g0r;conf[G8r]=$(e8r)[l08]($[F3G]({id:Editor[Z9m](conf[d8r]),type:n26},conf[n8r]||{}));return conf[Q8r][a7r];}});fieldTypes[A8r]=$[F3G](D5G,{},baseFieldType,{create:function(conf){var A26='<textarea/>';var r8r=x26;r8r+=C6r;r8r+=D1r;var p8r=b58;p8r+=t5G;var K8r=G16.z0r;K8r+=O0r;var o8r=T5G;o8r+=Q26;o8r+=F6r;var R8r=V0r;R8r+=l7m;R8r+=O7G;R8r+=O0r;var z8r=w1r;z8r+=V8G;z8r+=s7U;conf[z8r]=$(A26)[l08]($[R8r]({id:Editor[o8r](conf[K8r])},conf[p8r]||{}));return conf[r8r][a7r];},canReturnSubmit:function(conf,node){return g5G;}});fieldTypes[f8r]=$[F3G](D5G,{},baseFieldType,{_addOptions:function(conf,opts,append){var j26="nsPair";var c26="placeholderDisabled";var f26="placeholderValue";var r26="ceholderV";var p26="olderDisabled";var K26="placeh";var o26="ditor_";var R26="holde";var c8r=z26;c8r+=y0r;var a8r=J56;a8r+=o4r;a8r+=S28;a8r+=g0r;var elOpts=conf[a8r][a7r][c8r];var countOffset=a7r;if(!append){var k8r=Q1G;k8r+=R26;k8r+=l4r;var j8r=M9G;j8r+=P1G;elOpts[j8r]=a7r;if(conf[k8r]!==undefined){var m8r=w1r;m8r+=V0r;m8r+=o26;m8r+=q1G;var g8r=K26;g8r+=p26;var H8r=C6r;H8r+=e1G;H8r+=r26;H8r+=a9U;var placeholderValue=conf[f26]!==undefined?conf[H8r]:N5G;countOffset+=c7r;elOpts[a7r]=new Option(conf[a26],placeholderValue);var disabled=conf[c26]!==undefined?conf[g8r]:D5G;elOpts[a7r][W26]=disabled;elOpts[a7r][W7G]=disabled;elOpts[a7r][m8r]=placeholderValue;}}else{countOffset=elOpts[H5G];}if(opts){var I8r=V1G;I8r+=Q0m;I8r+=j26;Editor[V8m](opts,conf[I8r],function(val,label,i,attr){var k26="or_val";var D8r=w1r;D8r+=V0r;D8r+=r18;D8r+=k26;var option=new Option(label,val);option[D8r]=val;if(attr){var y8r=G16.e0r;y8r+=g0r;y8r+=g0r;y8r+=l4r;$(option)[y8r](attr);}elOpts[i+countOffset]=option;});}},create:function(conf){var L26="ipOpts";var y26='<select/>';var D26="iple";var I26="e.";var m26="chan";var g26="ddOption";var H26="_a";var Z9r=W4r;Z9r+=A7U;Z9r+=F9G;var l9r=H26;l9r+=g26;l9r+=y0r;var L8r=m26;L8r+=S5G;L8r+=I26;L8r+=Y28;var V8r=W4r;V8r+=o4r;var S8r=o1r;S8r+=D26;var T8r=y0r;T8r+=x7m;T8r+=N1m;T8r+=O0r;var w8r=G16.e0r;w8r+=g0r;w8r+=g0r;w8r+=l4r;conf[b56]=$(y26)[w8r]($[F3G]({id:Editor[T8r](conf[u3G]),multiple:conf[S8r]===D5G},conf[l08]||{}))[V8r](L8r,function(e,d){var S26="Set";var T26="_la";var O8r=e3G;O8r+=G16.z0r;O8r+=b8G;O8r+=l4r;if(!d||!d[O8r]){var t8r=S5G;t8r+=V0r;t8r+=g0r;var s8r=w26;s8r+=g0r;var X8r=T26;X8r+=A4r;X8r+=S26;conf[X8r]=fieldTypes[s8r][t8r](conf);}});fieldTypes[V26][l9r](conf,conf[Z9r]||conf[L26]);return conf[b56][a7r];},update:function(conf,options,append){var X26="sele";var O26="ddOpti";var q9r=w1r;q9r+=G16.e0r;q9r+=O26;q9r+=F9G;var P9r=X26;P9r+=s78;fieldTypes[P9r][q9r](conf,options,append);var lastSet=conf[s26];if(lastSet!==undefined){fieldTypes[V26][I1G](conf,lastSet,D5G);}_triggerChange(conf[b56]);},get:function(conf){var Z36="toArray";var t26="ipl";var F9r=n1r;F9r+=Y0G;var M9r=A1r;M9r+=g0r;M9r+=t26;M9r+=V0r;var B9r=z26;B9r+=q4G;B9r+=y4U;var v9r=w1r;v9r+=f0G;v9r+=D1r;var val=conf[v9r][F18](B9r)[o18](function(){var l36="or_v";var i9r=p18;i9r+=r18;i9r+=l36;i9r+=J7G;return this[i9r];})[Z36]();if(conf[M9r]){return conf[P36]?val[m68](conf[P36]):val;}return val[F9r]?val[a7r]:X3G;},set:function(conf,val,localUpdate){var N36="multiple";var i36='option';var B36="ltipl";var q36="sArr";var U9r=M9G;U9r+=o4r;U9r+=S5G;U9r+=p28;var W9r=Z86;W9r+=W4r;W9r+=o4r;var x9r=u26;x9r+=g0r;var u9r=G16.z0r;u9r+=q36;u9r+=G16.e0r;u9r+=m4r;var b9r=L6r;b9r+=B68;b9r+=l4r;b9r+=H68;var h9r=h8G;h9r+=v36;var N9r=i1G;N9r+=B36;N9r+=V0r;if(!localUpdate){conf[s26]=val;}if(conf[N9r]&&conf[h9r]&&!$[b9r](val)){var E9r=y0r;E9r+=t5G;E9r+=G16.z0r;E9r+=q5G;val=typeof val===E9r?val[W3m](conf[P36]):[];}else if(!$[u9r](val)){val=[val];}var i,len=val[H5G],found,allFound=g5G;var options=conf[x9r][F18](i36);conf[b56][F18](W9r)[A5G](function(){var M36="ted";var Y9r=w26;Y9r+=M36;found=g5G;for(i=a7r;i<len;i++){if(this[F36]==val[i]){found=D5G;allFound=D5G;break;}}this[Y9r]=found;});if(conf[a26]&&!allFound&&!conf[N36]&&options[U9r]){options[a7r][y4U]=D5G;}if(!localUpdate){var J9r=w1r;J9r+=G16.z0r;J9r+=o4r;J9r+=s7U;_triggerChange(conf[J9r]);}return allFound;},destroy:function(conf){var h36='change.dte';var C9r=W4r;C9r+=L8G;C9r+=L8G;conf[b56][C9r](h36);}});fieldTypes[G9r]=$[F3G](D5G,{},baseFieldType,{_addOptions:function(conf,opts,append){var b36="Pair";var e9r=J56;e9r+=x0U;e9r+=d1r;e9r+=g0r;var val,label;var jqInput=conf[e9r];var offset=a7r;if(!append){jqInput[J7U]();}else{var d9r=G16.z0r;d9r+=x0U;d9r+=D1r;offset=$(d9r,jqInput)[H5G];}if(opts){var Q9r=V1G;Q9r+=P88;Q9r+=y0r;Q9r+=b36;var n9r=C6r;n9r+=e08;n9r+=F5m;Editor[n9r](opts,conf[Q9r],function(val,label,i,attr){var C36="t:last";var J36='" type="checkbox" />';var Y36='<input id="';var W36="bel for=\"";var x36="last";var E36="alu";var f9r=U7G;f9r+=E36;f9r+=V0r;var r9r=G16.e0r;r9r+=g0r;r9r+=g0r;r9r+=l4r;var p9r=u36;p9r+=x36;var K9r=G98;K9r+=z2G;var o9r=G5G;o9r+=z2G;var R9r=i2G;R9r+=e1G;R9r+=W36;var z9r=G16.z0r;z9r+=O0r;var A9r=r48;A9r+=F2G;jqInput[u6G](A9r+Y36+Editor[Z9m](conf[z9r])+U36+(i+offset)+J36+R9r+Editor[Z9m](conf[u3G])+U36+(i+offset)+o9r+label+f3G+K9r);$(p9r,jqInput)[r9r](f9r,val)[a7r][F36]=val;if(attr){var a9r=G16.z0r;a9r+=U26;a9r+=C36;$(a9r,jqInput)[l08](attr);}});}},create:function(conf){var d36="checkbox";var e36="v ";var G36="pO";var j9r=G16.z0r;j9r+=G36;j9r+=k18;j9r+=y0r;var c9r=i2G;c9r+=H0r;c9r+=e36;c9r+=p2G;conf[b56]=$(c9r);fieldTypes[d36][n36](conf,conf[v1m]||conf[j9r]);return conf[b56][a7r];},get:function(conf){var o36="unselectedValue";var R36='input:checked';var z36="ectedValue";var A36="nse";var Q36="separa";var w9r=Q36;w9r+=K9G;var y9r=G9m;y9r+=W4r;y9r+=V8G;var D9r=Q36;D9r+=g0r;D9r+=m0r;var I9r=y0r;I9r+=V0r;I9r+=v36;var g9r=d1r;g9r+=A36;g9r+=n1r;g9r+=z36;var k9r=w1r;k9r+=f0G;k9r+=D1r;var out=[];var selected=conf[k9r][F18](R36);if(selected[H5G]){var H9r=V0r;H9r+=G16.e0r;H9r+=a4r;H9r+=c4r;selected[H9r](function(){out[z5G](this[F36]);});}else if(conf[g9r]!==undefined){var m9r=C6r;m9r+=d1r;m9r+=y0r;m9r+=c4r;out[m9r](conf[o36]);}return conf[I9r]===undefined||conf[D9r]===X3G?out:out[y9r](conf[w9r]);},set:function(conf,val){var r36='|';var p36="spli";var K36="sArra";var O9r=V0r;O9r+=G16.e0r;O9r+=P28;var L9r=G16.z0r;L9r+=K36;L9r+=m4r;var S9r=G16.z0r;S9r+=p7m;var T9r=V8G;T9r+=C6r;T9r+=d1r;T9r+=g0r;var jqInputs=conf[b56][F18](T9r);if(!$[S9r](val)&&typeof val===t78){var V9r=p36;V9r+=g0r;val=val[V9r](conf[P36]||r36);}else if(!$[L9r](val)){val=[val];}var i,len=val[H5G],found;jqInputs[O9r](function(){var f36="r_val";var s9r=q56;s9r+=e3G;found=g5G;for(i=a7r;i<len;i++){var X9r=p18;X9r+=r18;X9r+=W4r;X9r+=f36;if(this[X9r]==val[i]){found=D5G;break;}}this[s9r]=found;});_triggerChange(jqInputs);},enable:function(conf){var a36="rop";var l5r=C6r;l5r+=a36;var t9r=L8G;t9r+=G16.z0r;t9r+=o4r;t9r+=O0r;conf[b56][t9r](z0G)[l5r](z1U,g5G);},disable:function(conf){var P5r=n18;P5r+=O0r;var Z5r=G16.z0r;Z5r+=U26;Z5r+=g0r;conf[b56][F18](Z5r)[c36](P5r,D5G);},update:function(conf,options,append){var k36="ckbox";var j36="che";var B5r=y0r;B5r+=V0r;B5r+=g0r;var v5r=S5G;v5r+=V0r;v5r+=g0r;var q5r=j36;q5r+=k36;var checkbox=fieldTypes[q5r];var currVal=checkbox[v5r](conf);checkbox[n36](conf,options,append);checkbox[B5r](conf,currVal);}});fieldTypes[H36]=$[i5r](D5G,{},baseFieldType,{_addOptions:function(conf,opts,append){var m36="pai";var g36="ptionsPair";var val,label;var jqInput=conf[b56];var offset=a7r;if(!append){jqInput[J7U]();}else{offset=$(z0G,jqInput)[H5G];}if(opts){var F5r=W4r;F5r+=g36;var M5r=m36;M5r+=F5m;Editor[M5r](opts,conf[F5r],function(val,label,i,attr){var s36='input:last';var X36='<label for="';var O36='" type="radio" name="';var L36='<div>';var V36="d=\"";var S36="<input i";var T36="afeI";var w36="\" /";var y36="feI";var D36="abel>";var I36="/l";var Y5r=I5m;Y5r+=S4G;var W5r=i2G;W5r+=I36;W5r+=D36;var x5r=T5G;x5r+=y36;x5r+=O0r;var u5r=w36;u5r+=z2G;var E5r=o4r;E5r+=s48;E5r+=V0r;var b5r=y0r;b5r+=T36;b5r+=O0r;var h5r=S36;h5r+=V36;var N5r=G16.e0r;N5r+=S0G;N5r+=V0r;N5r+=b4r;jqInput[N5r](L36+h5r+Editor[b5r](conf[u3G])+U36+(i+offset)+O36+conf[E5r]+u5r+X36+Editor[x5r](conf[u3G])+U36+(i+offset)+o3G+label+W5r+Y5r);$(s36,jqInput)[l08](L8m,val)[a7r][F36]=val;if(attr){var J5r=b58;J5r+=g0r;J5r+=l4r;var U5r=u36;U5r+=e1G;U5r+=y0r;U5r+=g0r;$(U5r,jqInput)[J5r](attr);}});}},create:function(conf){var l76="iv ";var t36="ipO";var e5r=t36;e5r+=C6r;e5r+=g0r;e5r+=y0r;var G5r=r48;G5r+=l76;G5r+=p2G;var C5r=w1r;C5r+=V8G;C5r+=s7U;conf[C5r]=$(G5r);fieldTypes[H36][n36](conf,conf[v1m]||conf[e5r]);this[G16.R0r](R18,function(){var n5r=V0r;n5r+=G16.e0r;n5r+=a4r;n5r+=c4r;var d5r=Z76;d5r+=D1r;conf[d5r][F18](z0G)[n5r](function(){var P76="reCheck";var Q5r=w1r;Q5r+=C6r;Q5r+=P76;Q5r+=e3G;if(this[Q5r]){var A5r=P28;A5r+=V0r;A5r+=X1G;A5r+=e3G;this[A5r]=D5G;}});});return conf[b56][a7r];},get:function(conf){var q76=":checked";var R5r=M9G;R5r+=q5G;R5r+=g0r;R5r+=c4r;var z5r=A0G;z5r+=q76;var el=conf[b56][F18](z5r);return el[R5r]?el[a7r][F36]:undefined;},set:function(conf,val){var B76="checked";var v76="nput:";var f5r=G16.z0r;f5r+=v76;f5r+=B76;var r5r=w1r;r5r+=X5G;r5r+=g0r;var K5r=V0r;K5r+=G16.e0r;K5r+=P28;var o5r=w1r;o5r+=G16.z0r;o5r+=U26;o5r+=g0r;var that=this;conf[o5r][F18](z0G)[K5r](function(){var M76="ked";var i76="_preChecked";this[i76]=g5G;if(this[F36]==val){this[B76]=D5G;this[i76]=D5G;}else{var p5r=P28;p5r+=V0r;p5r+=a4r;p5r+=M76;this[p5r]=g5G;this[i76]=g5G;}});_triggerChange(conf[r5r][F18](f5r));},enable:function(conf){var j5r=P0G;j5r+=G16.Q0r;j5r+=M9G;j5r+=O0r;var c5r=g6r;c5r+=V1G;var a5r=V8G;a5r+=C6r;a5r+=d1r;a5r+=g0r;conf[b56][F18](a5r)[c5r](j5r,g5G);},disable:function(conf){var F76="sable";var g5r=O0r;g5r+=G16.z0r;g5r+=F76;g5r+=O0r;var H5r=C6r;H5r+=l4r;H5r+=W4r;H5r+=C6r;var k5r=L8G;k5r+=S6G;conf[b56][k5r](z0G)[H5r](g5r,D5G);},update:function(conf,options,append){var E76='[value="';var b76="dO";var h76="_ad";var N76="q";var L5r=t8m;L5r+=g0G;var V5r=V0r;V5r+=N76;var S5r=k5G;S5r+=S5G;S5r+=g0r;S5r+=c4r;var T5r=G5G;T5r+=e5G;var w5r=X8G;w5r+=f7G;w5r+=d4r;var y5r=y0r;y5r+=V0r;y5r+=g0r;var D5r=L8G;D5r+=G16.z0r;D5r+=o4r;D5r+=O0r;var I5r=h76;I5r+=b76;I5r+=k18;I5r+=M4r;var m5r=S5G;m5r+=V0r;m5r+=g0r;var radio=fieldTypes[H36];var currVal=radio[m5r](conf);radio[I5r](conf,options,append);var inputs=conf[b56][D5r](z0G);radio[y5r](conf,inputs[w5r](E76+currVal+T5r)[S5r]?currVal:inputs[V5r](a7r)[l08](L5r));}});fieldTypes[B3U]=$[F3G](D5G,{},baseFieldType,{create:function(conf){var p76='type';var K76="att";var n76="dateFormat";var d76="icker";var e76="2";var G76="282";var C76="RFC_";var J76='jqueryui';var U76="eFormat";var W76="t />";var x76="<inpu";var u76="afeId";var E2r=w1r;E2r+=X5G;E2r+=g0r;var s5r=y0r;s5r+=u76;var X5r=x76;X5r+=W76;var O5r=w1r;O5r+=G16.z0r;O5r+=o4r;O5r+=s7U;conf[O5r]=$(X5r)[l08]($[F3G]({id:Editor[s5r](conf[u3G]),type:e26},conf[l08]));if($[Y76]){var t5r=J3G;t5r+=U76;conf[b56][D7G](J76);if(!conf[t5r]){var Z2r=C76;Z2r+=G76;Z2r+=e76;var l2r=B3U;l2r+=C6r;l2r+=d76;conf[n76]=$[l2r][Z2r];}setTimeout(function(){var o76="dateImage";var R76="picker";var z76="dateF";var A76="atepicker-div";var Q76="#ui-";var N2r=H0r;N2r+=u96;var F2r=a4r;F2r+=y0r;F2r+=y0r;var M2r=Q76;M2r+=O0r;M2r+=A76;var i2r=W4r;i2r+=k18;i2r+=y0r;var v2r=z76;v2r+=H7U;var q2r=V0r;q2r+=l7m;q2r+=s3G;var P2r=b18;P2r+=h6G;P2r+=R76;$(conf[b56])[P2r]($[q2r]({dateFormat:conf[v2r],buttonImage:conf[o76],buttonImageOnly:D5G,onSelect:function(){var B2r=w1r;B2r+=G16.z0r;B2r+=o4r;B2r+=s7U;conf[B2r][C7G]()[E78]();}},conf[i2r]));$(M2r)[F2r](N2r,L7G);},D7r);}else{var b2r=O0r;b2r+=G16.e0r;b2r+=g0r;b2r+=V0r;var h2r=K76;h2r+=l4r;conf[b56][h2r](p76,b2r);}return conf[E2r][a7r];},set:function(conf,val){var j76="cker";var c76="epi";var a76="setD";var f76="ang";var r76='hasDatepicker';var x2r=C0U;x2r+=V68;var u2r=J56;u2r+=o4r;u2r+=C6r;u2r+=D1r;if($[Y76]&&conf[u2r][x2r](r76)){var U2r=a4r;U2r+=c4r;U2r+=f76;U2r+=V0r;var Y2r=a76;Y2r+=q6r;var W2r=O0r;W2r+=b58;W2r+=c76;W2r+=j76;conf[b56][W2r](Y2r,val)[U2r]();}else{var J2r=w1r;J2r+=V8G;J2r+=C6r;J2r+=D1r;$(conf[J2r])[q1G](val);}},enable:function(conf){var H76="nab";var k76="datepicke";var C2r=k76;C2r+=l4r;if($[C2r]){var G2r=V0r;G2r+=H76;G2r+=n1r;G2r+=V0r;conf[b56][Y76](G2r);}else{var d2r=C1r;d2r+=X7G;d2r+=e3G;var e2r=C6r;e2r+=l4r;e2r+=V1G;$(conf[b56])[e2r](d2r,g5G);}},disable:function(conf){var I76="isabl";var m76="pick";var g76="disabl";if($[Y76]){var A2r=g76;A2r+=V0r;var Q2r=B3U;Q2r+=m76;Q2r+=d4r;var n2r=x26;n2r+=s7U;conf[n2r][Q2r](A2r);}else{var R2r=O0r;R2r+=I76;R2r+=V0r;R2r+=O0r;var z2r=g6r;z2r+=V1G;$(conf[b56])[z2r](R2r,D5G);}},owns:function(conf,node){var T76='div.ui-datepicker-header';var w76='div.ui-datepicker';var y76="par";var D76="pare";var p2r=K28;p2r+=p28;var K2r=D76;K2r+=q68;var o2r=y76;o2r+=O7G;o2r+=p7G;return $(node)[o2r](w76)[H5G]||$(node)[K2r](T76)[p2r]?D5G:g5G;}});fieldTypes[S76]=$[F3G](D5G,{},baseFieldType,{create:function(conf){var q06="_closeFn";var Z06="keydow";var l06="keyInput";var s76="DateTime";var O76='<input />';var L76="dateti";var T2r=H7G;T2r+=W4r;T2r+=h8G;var m2r=w1r;m2r+=p98;m2r+=V76;var H2r=L76;H2r+=e1r;H2r+=V0r;var k2r=G16.z0r;k2r+=M3G;var j2r=F4r;j2r+=l4r;j2r+=e1r;j2r+=b58;var c2r=Z76;c2r+=d1r;c2r+=g0r;var a2r=g0r;a2r+=G48;var f2r=T5G;f2r+=Q26;f2r+=S78;f2r+=O0r;var r2r=w1r;r2r+=V8G;r2r+=C6r;r2r+=D1r;conf[r2r]=$(O76)[l08]($[F3G](D5G,{id:Editor[f2r](conf[u3G]),type:a2r},conf[l08]));conf[X76]=new Editor[s76](conf[c2r],$[F3G]({format:conf[j2r],i18n:this[k2r][H2r],onChange:function(){var g2r=x26;g2r+=s7U;_triggerChange(conf[g2r]);}},conf[u7G]));conf[m2r]=function(){var t76="pic";var I2r=w1r;I2r+=t76;I2r+=c96;I2r+=l4r;conf[I2r][l48]();};if(conf[l06]===g5G){var y2r=Z06;y2r+=o4r;var D2r=W4r;D2r+=o4r;conf[b56][D2r](y2r,function(e){var P06="ventDefault";var w2r=g6r;w2r+=V0r;w2r+=P06;e[w2r]();});}this[G16.R0r](T2r,conf[q06]);return conf[b56][a7r];},set:function(conf,val){var S2r=x26;S2r+=C6r;S2r+=d1r;S2r+=g0r;conf[X76][q1G](val);_triggerChange(conf[S2r]);},owns:function(conf,node){var V2r=W4r;V2r+=M6r;V2r+=o4r;V2r+=y0r;return conf[X76][V2r](node);},errorMessage:function(conf,msg){var v06="errorMsg";conf[X76][v06](msg);},destroy:function(conf){var M06="cke";var i06="_pi";var B06="troy";var t2r=O0r;t2r+=V0r;t2r+=y0r;t2r+=B06;var s2r=i06;s2r+=M06;s2r+=l4r;var X2r=J56;X2r+=k1r;var O2r=i8G;O2r+=V76;var L2r=W4r;L2r+=L8G;L2r+=L8G;this[L2r](I4G,conf[O2r]);conf[X2r][b78](e0m);conf[s2r][t2r]();},minDate:function(conf,min){var F06="_pic";var l3r=F06;l3r+=F4G;l3r+=d4r;conf[l3r][U1U](min);},maxDate:function(conf,max){var N06="max";conf[X76][N06](max);}});fieldTypes[P9m]=$[F3G](D5G,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var E06="ypes";var b06="ldT";var h06="stUpload";var B3r=C6r;B3r+=W4r;B3r+=h06;var v3r=J08;v3r+=O7G;v3r+=g0r;var q3r=x5m;q3r+=n1r;q3r+=n1r;var P3r=y0r;P3r+=V0r;P3r+=g0r;var Z3r=C9G;Z3r+=b06;Z3r+=E06;Editor[Z3r][P9m][P3r][q3r](editor,conf,val[a7r]);editor[v3r](B3r,[conf[E3G],val[a7r]]);});return container;},get:function(conf){var i3r=u06;i3r+=n1r;return conf[i3r];},set:function(conf,val){var d06='noClear';var e06="Text";var G06="cle";var C06="clearText";var J06='No file';var Y06="rHandler";var W06="trigge";var x06="oad.editor";var W3r=d1r;W3r+=l5m;W3r+=x06;var x3r=W06;x3r+=Y06;var E3r=L8G;E3r+=G16.z0r;E3r+=o4r;E3r+=O0r;var F3r=O0r;F3r+=t8G;F3r+=e1G;F3r+=m4r;var M3r=J56;M3r+=x0U;M3r+=d1r;M3r+=g0r;conf[Y26]=val;var container=conf[M3r];if(conf[F3r]){var N3r=w1r;N3r+=U7G;N3r+=G16.e0r;N3r+=n1r;var rendered=container[F18](M26);if(conf[N3r]){rendered[O0G](conf[Z6G](conf[Y26]));}else{var b3r=R2G;b3r+=C6r;b3r+=z86;var h3r=V0r;h3r+=e1r;h3r+=k18;h3r+=m4r;rendered[h3r]()[u6G](V4U+(conf[U06]||J06)+b3r);}}var button=container[E3r](F26);if(val&&conf[C06]){var u3r=G06;u3r+=f4r;u3r+=e06;button[O0G](conf[u3r]);container[E0G](d06);}else{container[D7G](d06);}conf[b56][F18](z0G)[x3r](W3r,[conf[Y26]]);},enable:function(conf){var n06="_enable";var U3r=n06;U3r+=O0r;var Y3r=L8G;Y3r+=G16.z0r;Y3r+=o4r;Y3r+=O0r;conf[b56][Y3r](z0G)[c36](z1U,g5G);conf[U3r]=D5G;},disable:function(conf){var e3r=p18;e3r+=o4r;e3r+=X7G;e3r+=e3G;var G3r=P0G;G3r+=G16.Q0r;G3r+=h9U;var C3r=G16.z0r;C3r+=o4r;C3r+=s7U;var J3r=J56;J3r+=k1r;conf[J3r][F18](C3r)[c36](G3r,D5G);conf[e3r]=g5G;},canReturnSubmit:function(conf,node){return g5G;}});fieldTypes[Q06]=$[d3r](D5G,{},baseFieldType,{_showHide:function(conf){var p06="limit";var o06="imit";var z06="div.l";var A06="lim";var K3r=M9G;K3r+=q5G;K3r+=g0r;K3r+=c4r;var o3r=w1r;o3r+=U7G;o3r+=G16.e0r;o3r+=n1r;var R3r=A06;R3r+=G16.z0r;R3r+=g0r;var z3r=K28;z3r+=p28;var A3r=z06;A3r+=k9G;A3r+=B6r;A3r+=R06;var Q3r=X8G;Q3r+=b4r;var n3r=n1r;n3r+=o06;if(!conf[n3r]){return;}conf[K06][Q3r](A3r)[A4G](l7G,conf[Y26][z3r]>=conf[p06]?L7G:z4G);conf[C5m]=conf[R3r]-conf[o3r][K3r];},create:function(conf){var k06='multi';var f06="dC";var r06="ton.remove";var m3r=e38;m3r+=r06;var g3r=a4r;g3r+=n1r;g3r+=P4r;g3r+=F4G;var H3r=q88;H3r+=f06;H3r+=f38;H3r+=y0r;var editor=this;var container=_commonUpload(editor,conf,function(val){var j06='postUpload';var c06="cat";var a06="ieldTypes";var k3r=w1r;k3r+=U7G;k3r+=G16.e0r;k3r+=n1r;var j3r=w1r;j3r+=B18;var c3r=w1r;c3r+=U7G;c3r+=G16.e0r;c3r+=n1r;var a3r=a4r;a3r+=G16.e0r;a3r+=n1r;a3r+=n1r;var f3r=L8G;f3r+=a06;var r3r=i0G;r3r+=o4r;r3r+=c06;var p3r=u06;p3r+=n1r;conf[Y26]=conf[p3r][r3r](val);Editor[f3r][Q06][I1G][a3r](editor,conf,conf[c3r]);editor[j3r](j06,[conf[E3G],conf[k3r]]);},D5G);container[H3r](k06)[G16.R0r](g3r,m3r,function(e){var y06='idx';var D06="pagation";var I06="stopPr";var m06="ldTypes";var g06="adM";var V3r=w1r;V3r+=q1G;var S3r=a4r;S3r+=J7G;S3r+=n1r;var T3r=y0r;T3r+=V0r;T3r+=g0r;var w3r=H06;w3r+=g06;w3r+=q9U;var y3r=C9G;y3r+=m06;var D3r=O0r;D3r+=b58;D3r+=G16.e0r;var I3r=I06;I3r+=W4r;I3r+=D06;e[I3r]();var idx=$(this)[D3r](y06);conf[Y26][b08](idx,c7r);Editor[y3r][w3r][T3r][S3r](editor,conf,conf[V3r]);});conf[K06]=container;return container;},get:function(conf){var L3r=w1r;L3r+=q1G;return conf[L3r];},set:function(conf,val){var M16='upload.editor';var i16='No files';var B16="<s";var s06="l/>";var X06="<u";var O06="endTo";var L06="rendered";var V06="ve an array as a v";var S06="Upload collections must ha";var T06="adMa";var w06="triggerHa";var Y7r=w1r;Y7r+=U7G;Y7r+=G16.e0r;Y7r+=n1r;var W7r=w06;W7r+=b4r;W7r+=n1r;W7r+=d4r;var x7r=G16.z0r;x7r+=U26;x7r+=g0r;var u7r=L8G;u7r+=G16.z0r;u7r+=o4r;u7r+=O0r;var E7r=b6G;E7r+=c4r;E7r+=o58;E7r+=R06;var b7r=H06;b7r+=T06;b7r+=F4m;var t3r=O0r;t3r+=G16.z0r;t3r+=D2m;t3r+=m4r;var s3r=J56;s3r+=o4r;s3r+=s7U;var X3r=w1r;X3r+=q1G;if(!val){val=[];}if(!$[a1G](val)){var O3r=S06;O3r+=V06;O3r+=a9U;throw O3r;}conf[X3r]=val;var that=this;var container=conf[s3r];if(conf[t3r]){var q7r=n1r;q7r+=O7G;q7r+=S5G;q7r+=p28;var P7r=w68;P7r+=k18;P7r+=m4r;var Z7r=y1m;Z7r+=L06;var l7r=L8G;l7r+=G16.z0r;l7r+=b4r;var rendered=container[l7r](Z7r)[P7r]();if(val[q7r]){var B7r=G16.e0r;B7r+=S0G;B7r+=O06;var v7r=X06;v7r+=s06;var list=$(v7r)[B7r](rendered);$[A5G](val,function(i,file){var v16='</li>';var q16=' remove" data-idx="';var P16=' <button class="';var Z16='<li>';var l16="s;</button>";var t06="\">&time";var N7r=t06;N7r+=l16;var F7r=e38;F7r+=g0r;F7r+=W4r;F7r+=o4r;var M7r=O0r;M7r+=G16.z0r;M7r+=u96;var i7r=H48;i7r+=o4r;i7r+=O0r;list[i7r](Z16+conf[M7r](file,i)+P16+that[e0G][h38][F7r]+q16+i+N7r+v16);});}else{var h7r=B16;h7r+=C6r;h7r+=z86;rendered[u6G](h7r+(conf[U06]||i16)+L4U);}}Editor[b3G][b7r][E7r](conf);conf[b56][u7r](x7r)[W7r](M16,[conf[Y7r]]);},enable:function(conf){var G7r=p18;G7r+=t56;var C7r=P0G;C7r+=q0G;C7r+=e3G;var J7r=V8G;J7r+=C6r;J7r+=d1r;J7r+=g0r;var U7r=L8G;U7r+=G16.z0r;U7r+=b4r;conf[b56][U7r](J7r)[c36](C7r,g5G);conf[G7r]=D5G;},disable:function(conf){var n7r=C6r;n7r+=l4r;n7r+=W4r;n7r+=C6r;var d7r=V8G;d7r+=s7U;var e7r=L8G;e7r+=S6G;conf[b56][e7r](d7r)[n7r](z1U,D5G);conf[V56]=g5G;},canReturnSubmit:function(conf,node){return g5G;}});}());if(DataTable[Q7r][F16]){var R7r=w0r;R7r+=G16.z0r;R7r+=B3G;R7r+=y0r;var z7r=V0r;z7r+=l7m;var A7r=s2G;A7r+=t2G;$[A7r](Editor[b3G],DataTable[z7r][R7r]);}DataTable[G48][o7r]=Editor[K7r];Editor[K5G]={};Editor[R7G][N16]=p7r;Editor[r7r]=f7r;return Editor;}));

