var syn = require("fsyn")
var testUtils = require('testUtils')

var Button = require('Components/Button')

module.exports = function(t) {
    t.count(5)

    var obj = new Button("Text");
    obj.on("click",function() {
        t.ok(true);
    })

    testUtils.demo("Button", obj)

    this.eq(obj.text, "Text")
    this.eq(obj.domNode.value, "Text")
    obj.text = "MOOOO"
    this.eq(obj.text, "MOOOO")
    this.eq(obj.domNode.value, "MOOOO")

    syn.click(obj.domNode)
};
