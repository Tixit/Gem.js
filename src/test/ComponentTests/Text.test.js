var testUtils = require('testUtils')
var Block = require("Components/Block")
var domUtils = require('domUtils')

var Text = require('Components/Text');

module.exports = function() {

    var container = Block()
    testUtils.demo("Text", container)

	this.test('basic usage',function(t) {
		var obj = new Text();
        container.add(obj)
        t.eq(obj.text,"");

        obj.text = "   "
		t.ok(obj.domNode.offsetWidth > 0); // make sure the spaces aren't collapsed (by default)

        var obj2 = Text("<div>whatever</div>")
        container.add(obj2)
        t.eq(obj2.text,"<div>whatever</div>");
        t.eq(obj2.domNode[domUtils.textProperty], "<div>whatever</div>")

	});

    this.test("label argument", function() {
        var t = Text("label", "text")

        this.eq(t.label, "label")
        this.eq(t.domNode[domUtils.textProperty], "text")
    })
};
