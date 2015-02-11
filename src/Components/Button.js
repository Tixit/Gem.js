var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {

    // static variables

    this.name = 'Button'
	this.emits = ["click"];


    // instance properties

	this.init = function(text) {
        superclass.init.call(this, undefined, document.createElement("input")) // superclass constructor
		var that = this

		this.attr('type','button');
		this.attr('value',text);
		
		this.domNode.addEventListener("click",function(data) {
			that.emit("click",data);
		})
	}

    Object.defineProperty(this, 'text', {
        get: function() {
            return this.attr('value')
        },
        set: function(text) {
            this.attr('value', text)
        }
    })

});
