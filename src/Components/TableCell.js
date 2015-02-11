var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {
	/////////////////////////////
	// static variables
	/////////////////////////////
	this.name = 'TableCell'
	
	//////////////////////
	// instance methods
	//////////////////////
	this.init = function(data) {
		superclass.init.call(this, undefined, document.createElement("td")) // superclass constructor
		if (data !== undefined) {
			this.add(data);
		}
	}

	this.columns = function(cols) {
		this.attr('colspan',cols);
	}
	
	this.removeSelf = function() {
		this.parent.remove(this);
	}
});
