var proto = require('proto')

var Block = require('../BlockBase')
var domUtils = require('../domUtils')
var Label = require("./Label")


module.exports = proto(Block, function(superclass) {
	/////////////////////////
	// static variables
	/////////////////////////
    this.name = 'Radio'

	//////////////////////////
	// instance methods
	//////////////////////////
	this.init = function(groupName,options) {
        superclass.init.call(this) // superclass constructor
		var that = this

		options.forEach(function(elem,index) {
			var elem = document.createElement('input');
			domUtils.setAttribute(elem,'type','radio');
			domUtils.setAttribute(elem,'name',groupName);
			domUtils.setAttribute(elem,'value',elem.value);
			
			elem.addEventListener("click",function(data) {
				that.emit("change",data);
				data.value = elem.value;
				that.emit("click",data);
			});
			
			that.domNode.appendChild(elem);
			that.add(new Label(elem.text));
			that.domNode.appendChild(document.createElement("br"));
		});
	}
});
