var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {
	////////////////////////
	// static variables
	////////////////////////
    this.name = 'TextArea'

	this.init = function() {
        superclass.init.call(this, undefined, document.createElement("textarea")) // superclass constructor
		var that = this

		var elem = this.domNode
		elem.addEventListener("click",function(e) {
			that.emit("click",e);
		});	
		elem.addEventListener("change",function(e) {
			that.emit("change",e);
		});
	}

	//////////////////////
	// instance properties
	//////////////////////

});
