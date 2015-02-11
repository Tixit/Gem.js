var Block = require('../BlockBase')
var proto = require('proto')

module.exports = proto(Block, function(superclass) {

    //static properties

    this.name = 'Text'

    this.init = function(/*[label,] text*/) {
        if(arguments.length === 1) {
            var text = arguments[0]
        } else {
            var label = arguments[0]
            var text = arguments[1]
        }

        if (text === undefined) text = '';

        superclass.init.call(this) // superclass constructor

        var that = this

        this.label = label
        this.text = text
        this.domNode.style["white-space"] = "pre";
        this.domNode.addEventListener("click",function(e) {
                that.emit("click",e);
        });

        this.domNode.addEventListener("input",function(data) {
                var eventData = {newText:data.srcElement.textContent,oldText:that.oldText};
                that.oldText = eventData.newText;
                that.emit("input",eventData);
        });

        this.domNode.addEventListener("blur",function(data) {
                var eventData = {newText:data.srcElement.textContent,oldText:that.lastFocus};
                that.lastFocus = eventData.newText;
                that.emit("blur",eventData);
        });
    }

    // instance properties

    Object.defineProperty(this, 'text', {
        get: function() {
            return this.domNode.textContent
        }, set: function(v) {
            this.domNode.innerHTML = v.toString().replace(/</g, '&lt;').replace(/\n/g, '<br>')
        }
    })
});
