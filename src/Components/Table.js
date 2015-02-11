var Block = require('../BlockBase')
var proto = require('proto')
var TableHeader = require("./TableHeader");
var TableRow = require("./TableRow");
var TableCell = require("./TableCell");

module.exports = proto(Block, function(superclass) {
	//////////////////////
	// static variables
	//////////////////////
	this.name = 'Table'

    this.Row = TableRow
	this.Header = TableHeader;
    this.Cell = TableCell

	///////////////////////////
	// instance methods
	///////////////////////////
	this.init = function() {
		superclass.init.call(this, undefined, document.createElement("table")) // superclass constructor
		this.attr("cellspacing",0);
	}
	
	this.addHeader = function(posDom) {
		var row = new TableHeader();
		if (posDom === undefined) {
			this.add(row);
		} else {
			this.addBeforeNode(posDom,[row]);
		}
		return row;
	}

	this.addRow = function() {
		var row = new TableRow();
		this.add(row);
		return row;
	}
	
	this.rowCount = function() {
		return this.domNode.childNodes.length;
	}
});
