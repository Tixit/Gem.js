var Block = require('../BlockBase')
var proto = require('proto')
var TableRow = require("./TableRow");

module.exports = proto(TableRow, function(superclass) {
	///////////////////////
	// static variables
	///////////////////////
	this.name = 'TableHeader'
	
	///////////////////////
	// instance methods
	///////////////////////
	this.init = function() {
		superclass.init.call(this) // superclass constructor
		var that = this
	}
});
