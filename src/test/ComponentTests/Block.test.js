var syn = require("fsyn")
var testUtils = require('testUtils')

var Block = require('Components/Block')
var Text = require("Components/Text")

module.exports = function() {

    this.test('basic usage', function(t) {
        t.count(18)

        var demoContainer = Block()
        testUtils.demo("Block", demoContainer)


        var text1 = Text('a')
        var c1 = Block(text1)
        demoContainer.add(c1)

        this.eq(c1.children.length, 1)
        this.eq(c1.domNode.childNodes.length, 1)
        this.eq(c1.children[0], text1)
        this.eq(c1.domNode.childNodes[0], text1.domNode)

        c1.on("click",function(e) {
            t.ok(e !== undefined)
        })

        syn.click(text1.domNode)  // produces a click event
        syn.click(c1.domNode)     // produces another click event


        var text2 = Text('b'), text3 = Text('c')
        var c2 = Block(text2, text3)
        demoContainer.add(c2)

        this.eq(c2.children.length, 2)
        this.eq(c2.children[0], text2)
        this.eq(c2.children[1], text3)


        var text4 = Text('d'), text5 = Text('e')
        var c3 = Block([text4, text5])
        demoContainer.add(c3)

        this.eq(c3.children.length, 2)
        this.eq(c3.children[0], text4)
        this.eq(c3.children[1], text5)


        // test to make sure label arguments work

        var c4 = Block('aLabel1', Text('e'))
        this.eq(c4.children.length, 1)
        this.eq(c4.attr('label', 'aLabel1'))

        var c5 = Block('aLabel2', Text('f'), Text('g'))
        this.eq(c5.children.length, 2)
        this.eq(c5.attr('label', 'aLabel2'))

        var c6 = Block('aLabel3', [Text('h')])
        this.eq(c6.children.length, 1)
        this.eq(c6.attr('label', 'aLabel3'))

    })

    this.test('label arguments', function() {
        var c1 = Block("label1")
        var c2 = Block("label2", [])
        var c3 = Block("label3", Text("a"), Text("b"))

        this.eq(c1.label, "label1")
        this.eq(c2.label, "label2")
        this.eq(c3.label, "label3")

        this.eq(c1.children.length, 0)
        this.eq(c2.children.length, 0)
        this.eq(c3.children.length, 2)
    })
};
