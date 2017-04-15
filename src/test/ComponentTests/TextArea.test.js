var testUtils = require('testUtils')
var Block = require("Components/Block")
var syn = require("fsyn")

var TextArea = require('Components/TextArea')

module.exports = function(t) {

    var container = Block()
    testUtils.demo("TextArea", container)

	this.test('basic usage',function(t) {
        this.count(3)

		var obj = TextArea()
        container.add(obj)

        this.test("events", function(t) {
            this.count(5)

            obj.on("click",function() {
                event('click')
            })
            obj.on("change",function() {
                event('change')
            })

            var event = testUtils.seq(function(name) {
                t.eq(name, 'change')
                t.eq(obj.val, "first!")
            },function(name) {
                t.eq(name, 'click')
            },function(name) {
                t.eq(name, 'change')
                t.eq(obj.val, "first!second")
            })
        })

        obj.val = "first!"
        this.eq(obj.val, "first!")

        syn.click(obj.domNode).then(function() {
            return syn.type(obj.domNode, "second")
        }).then(function() {
            t.eq(obj.val, "first!second")
            obj.domNode.blur()
        }).done()
	});

    this.test("label argument", function() {
        var t = TextArea("label")
        this.eq(t.label, "label")
    })
        
    this.test("quiet", function(t) {
        var obj = TextArea()
        obj.on('change', function() {
            t.ok(false)
        })
        
        obj.quiet.val = 'hi'
        this.eq(obj.val, 'hi')
    })
};
