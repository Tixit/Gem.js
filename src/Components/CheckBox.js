var Block = require('../BlockBase')
var proto = require('proto')
var Label = require("./Label");

module.exports = proto(Block, function(superclass) {
	// static variables
    this.name = 'CheckBox'

	// instance methods
	this.init = function(label) {
		if (label === undefined) label = "";
        superclass.init.call(this, label, document.createElement("input")) // superclass constructor

		var that = this

		this.attr('type','checkbox');
		this.domNode.addEventListener("click",function(e) {
			that.emit("click",e);
		});
		
		this.domNode.addEventListener("change",function() {
			that.emit("change",that.domNode.checked)
		})
	}

    // if no parameters are passed, it returns whether or not the checkbox is checked
    // if one parameter is passed, it sets the value of the checkbox to the passed value (true for checked)
    this.check = this.val = function() {
        if(arguments.length === 0) {
            return this.domNode.checked
        } else {
            this.domNode.checked = arguments[0]
            this.emit('change', arguments[0]) // the browser has no listenable event that is triggered on change of the 'checked' property
        }
    }
});
