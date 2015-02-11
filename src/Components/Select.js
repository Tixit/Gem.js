var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {
	//////////////////////
	// static variables
	//////////////////////
    this.name = 'Select';
	
    this.Option = proto(Block, function(superclass) {
		//////////////////////
		// staic variables
		//////////////////////
        this.name = 'Option'

		//////////////////////
		// instance methods
		//////////////////////
        this.init = function(value, text) {
            superclass.init.call(this, undefined, document.createElement("option")) // superclass constructor

            this.domNode.innerHTML = text
            this.domNode.value = value
        }

        this.select = function(selected) {
            this.domNode.selected = selected
        }
    })

	///////////////////////
	// instance methods
	///////////////////////
	this.init = function(options,multiple,selectedValue) {
        superclass.init.call(this, undefined, document.createElement("select")) // superclass constructor

		var that = this
		this.multiple = multiple;

		var elem = this.domNode;
		if (multiple) {
			this.createAttribute(elem,'multiple','multiple');
		}
		
		for (var i=0;i<options.length;i++) {
			var val = undefined;
			var text = undefined;
			if (typeof options[i] === "string") {
				val = options[i];
				text = options[i];
			} else {
				val = options[i].value;
				text = options[i].text;
			}
			var selected = false;
			if (val === selectedValue) {
				selected = true;
			}
			this.addOption(val,text,selected)
		}
		
		elem.addEventListener("change",function(e) {
			that.emit("change",{value:that.value()});
		});
	}

    this.value = function() {
		if(!this.multiple) {
            return this.domNode.value
        } else {
            var values = [];
            if (this.domNode.length == 0) return values;
            for (var i=0;i<this.domNode.length;i++) {
                var option = this.domNode.options[i];
                if (option.selected) {
                    values.push(option.value);
                    if (!this.multiple) break;
                }
            }
            if (values.length === 0 && !this.multiple) {
                values.push(this.domNode.options[0].value);
            }
            return values;
        }
    }
	
	this.addOption = function(value,text,selected) {
		var option = this.Option(value,text)
        if (selected !== undefined) option.select(selected)
		this.add(option)
	}

    this.removeOption = function(value) {
        for (var i=0;i<this.domNode.length;i++) {
            var option = this.domNode.options[i];
            if(option.value === value) {
                this.remove(option)
            }
        }
    }
	
	this.set = this.setValue = function(value) {
        if(!this.multiple) {
            if(this.domNode.value !== value) {
                this.domNode.value = value
                this.emit("change",{value:value});
            }
        } else {
            var set = false;
            for (var i=0;i<this.domNode.length;i++) {
                var option = this.domNode.options[i];
                if (option.value == value) {
                    if (option.selected === false) set = true;
                    option.selected = true
                } else {
                    option.selected = false;
                }
            }
            if (set) {
                this.emit("change",{value:value});
            }
        }
	}
})
