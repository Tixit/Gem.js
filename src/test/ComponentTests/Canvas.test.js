var testUtils = require('testUtils')
var Block = require("Components/Block")

var Canvas = require('Components/Canvas');

module.exports = function() {

    var container = Block()
    testUtils.demo("Canvas", container)

	this.test('basic usage',function(t) {
		var obj = Canvas(20,30)
        container.add(obj)

        this.eq(obj.height, 20)
        this.eq(obj.domNode.height, 20)
        this.eq(obj.attr('height'), '20')
        this.eq(obj.width, 30)
        this.eq(obj.domNode.width, 30)
        this.eq(obj.attr('width'), '30')

        this.eq(obj.toDataURL(), obj.toImg())
        this.ok(obj.toImg() !== undefined)

        this.ok(obj.context('2d') instanceof CanvasRenderingContext2D)
        this.ok(obj.context('webgl') === null || obj.context('webgl') instanceof WebGLRenderingContext)
	});

    this.test("label argument", function() {
        var obj = Canvas("label", 30, 40)
        this.eq(obj.label, "label")
        this.eq(obj.height, 30)
        this.eq(obj.domNode.height, 30)
        this.eq(obj.width, 40)
        this.eq(obj.domNode.width, 40)
    })
};
