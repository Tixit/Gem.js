var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {

	// static properties

    this.name = 'Block'


	// instance properties

	this.init = function (/*[label,] content*/) {
        if(arguments.length === 0) {
            var content = []
        } else if(arguments.length === 1) {
            var content = arguments[0]
        } else {
            var label = arguments[0]
            var content = arguments[1]
        }

		var that = this
        superclass.init.call(this) // superclass constructor

        this.label = label

		if(content !== undefined)
            this.add(content)

		this.domNode.addEventListener("click",function(data) {
			that.emit("click",data);
		});
	}
});
