var Block = require('../BlockBase')
var proto = require('proto')
var TableCell = require("./TableCell");

var TableRow = module.exports = proto(Block, function(superclass) {
	///////////////////////////
	// static variables
	///////////////////////////
	this.name = 'TableRow'
	
	/////////////////////////////
	// instance methods
	/////////////////////////////
	this.init = function() {
		superclass.init.call(this,  undefined, document.createElement("tr")) // superclass constructor
	}
	
	this.addCell = function(data) {
		if (data === undefined) data = [];
		var cell = new TableCell(data);
		this.add(cell);
		return cell;
	}

	this.addCells = function(cellList) {
		var cells = [];
		for (var i=0;i<cellList.length;i++) {
			var cell = cellList[i];
			if (cellList[i].name !== "TableCell") {
				cell = new TableCell(cell);
			}
			this.add(cell);
			cells.push(cell);
		}
		return cells;
	}
	
	this.removeSelf = function() {
		this.parent.remove(this);
	}
	
	this.addAfter = function() {
		var row = new TableRow();
		this.parent.addAfter(this,[row]);
		return row;
	}
	
	this.addBefore = function() {
		var row = new TableRow();
		this.parent.addBefore(this,[row]);
		return row;
	}
});
