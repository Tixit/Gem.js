var testUtils = require('testUtils')
var Block = require("Components/Block")
var syn = require("fsyn")

var TextField = require('Components/TextField')

module.exports = function() {

    var container = Block()
    testUtils.demo("TextArea", container)

	this.test('basic usage',function(t) {
        this.count(3)

		var obj = TextField()
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

    this.test("password (manually verify)", function() {
        var field = TextField(true)
        container.add(field)
        field.val = "something, but it should be like, astrisks"
    })

    this.test("label argument", function() {
        var t = TextField("label", false)
        this.eq(t.label, "label")
    })        
        
    this.test("quiet", function(t) {
        var obj = TextField()
        obj.on('change', function() {
            t.ok(false)
        })
        
        obj.quiet.val = 'hi'
        this.eq(obj.val, 'hi')
    })

    this.test("former bugs", function() {
        this.test("TextField was messing directly with the domNode's classname for god knows what reason", function() {
            var field = TextField(true)
            var inner = Block([field])
            container.add(inner)

            this.eq($(field.domNode).css('box-sizing'), 'border-box')
        })
    })
};
