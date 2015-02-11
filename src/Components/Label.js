var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {
	////////////////////////
	// static variables
	////////////////////////
    this.name = 'Label'

	////////////////////////
	// instance methods
	////////////////////////
	this.init = function(text,header) {
        if (header === undefined) header = false;

        superclass.init.call(this) // superclass constructor
		var that = this

		var style = "";
		if (header)
            style = "display: block;";
		this.attr('style', style)

		this.domNode.textContent = text;
		this.domNode.addEventListener("click",function(e) {
			that.emit("click",e);
		});
	}
	
	this.set = function(text) {
		this.domNode.textContent = text;
	}

	// this is needed for stuff like html entities
	this.setRaw = function(text) {
		this.domNode.innerHTML = text;
	}
	
	this.get = function() {
		return this.domNode.textContent;
	}

	this.width = function(width) {
		if (width === undefined) {
			return parseInt(this.domNode.style.width.replace("px",""));
		} else {
			this.domNode.style.width = width + "px";
		}
	}
});
