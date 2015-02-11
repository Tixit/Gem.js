var Block = require('../BlockBase')
var proto = require('proto')

var domUtils = require("../domUtils")

module.exports = proto(Block, function(superclass) {

	// static properties

    this.name = 'TextField'

	this.init = function(password) {
        superclass.init.call(this, undefined, document.createElement("input")) // superclass constructor

		var that = this

		var elem = this.elem = this.domNode
        elem.className = 'field'
		domUtils.setAttribute(elem,'type','text');
        if(password)
            domUtils.setAttribute(elem, 'type', 'password')

		elem.addEventListener("click",function(e) {
			that.emit("click",e);
		});
		elem.addEventListener("change",function(e) {
			that.emit("change",e);
		});
        elem.addEventListener("keypress",function(e) {
			that.emit("keypress",e);
		})
        elem.addEventListener("keyup",function(e) {
			that.emit("keyup",e);
		})
	}


	// instance properties

    Object.defineProperty(this, 'val', {
        get: function() {
            return this.elem.value
        }, set: function(v) {
            this.elem.value = v
        }
    })

    // obsolete - user the val property instead
    this.value = function() {
        return this.elem.value
    }

    this.focus = function() {
        this.elem.focus()
    }

});
