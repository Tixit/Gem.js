var testUtils = require('testUtils')
var Block = require("Components/Block")
var domUtils = require("domUtils")

var Text = require("Components/Text")
var List = require('Components/List')

module.exports = function(t) {


    var container = Block()
    testUtils.demo("List", container)

    this.test("simple creation - unordered", function() {
        var list = List([Text('a'), Text('b'), Text('c')])

        container.add(Text("list1"), list)

        this.eq(list.children.length, 3)
        this.ok(list.children[0] instanceof List.Item)
        this.ok(list.children[1] instanceof List.Item)
        this.ok(list.children[2] instanceof List.Item)
        this.eq(list.domNode.nodeName, 'UL') // default is unordered list

        var firstItem = $($(list.domNode).find("li")[0])[0]
        this.eq(firstItem[domUtils.textProperty], 'a')

        this.test("list constructed with raw strings instead of elements", function() {
            var list = List(['a', 'b'])

            container.add(Text("list2"), list)

            this.eq(list.children.length, 2)
            this.eq(list.children[0].domNode[domUtils.textProperty], 'a')
        })
    })

    this.test("simple creation - ordered", function() {
        var list = List(true, [Text('a'), Text('b'), Text('c')])
        this.eq(list.domNode.nodeName, 'OL')    // the true argument means ordered list
        container.add(Text("olist"), list)

        var list = List(false, [Text('a'), Text('b'), Text('c')])
        this.eq(list.domNode.nodeName, 'UL')    // false means unordered
    })

    this.test("individual item creation", function() {
        var list = List()

        this.eq(list.domNode.nodeName, 'UL') // default is unordered list

        var item1 = list.item(Text('a'))
        this.eq(list.children.length, 1)

        var item2 = list.item(Text('B'))

        this.eq(list.children.length, 2)
        this.ok(list.children[0] instanceof List.Item)
        this.ok(list.children[1] instanceof List.Item)
        this.ok(list.children[0] === item1)
        this.ok(list.children[1] === item2)

        this.eq(list.children[0].children[0].text, 'a')
        var firstItem = $($(list.domNode).find("li")[0])[0]
        this.eq(firstItem[domUtils.textProperty], 'a')

        this.test("items constructed with raw strings instead of elements", function() {
            var list = List()

            var item1 = list.item('a')

            this.eq(list.children.length, 1)
            this.eq(list.children[0].domNode[domUtils.textProperty], 'a')
        })

        this.test("ordering argument alone", function() {
            var list = List(true)
            this.eq(list.domNode.nodeName, 'OL')

            var list2 = List(false)
            this.eq(list2.domNode.nodeName, 'UL')
        })
    })

    this.test("label arguments", function() {
        var list1 = List('aLabel')
        var list2 = List('aLabel2', ['a', 'b', 'c'])
        this.eq(list1.label, 'aLabel')
        this.eq(list2.label, 'aLabel2')
        this.eq(list1.domNode.nodeName, 'UL')
        this.eq(list2.domNode.nodeName, 'UL')
        this.eq(list1.children.length, 0)
        this.eq(list2.children.length, 3)

        var item1 = list1.item('aLabel4', 'e')
        this.eq(list1.children.length, 1)
        this.eq(item1.label, 'aLabel4')
        this.eq(item1.domNode[domUtils.textProperty], 'e')

        var list3 = List('aLabel5', true)
        this.eq(list3.label, 'aLabel5')
        this.eq(list3.domNode.nodeName, 'OL')
        this.eq(list3.children.length, 0)

        var list4 = List('aLabel6', false)
        this.eq(list4.label, 'aLabel6')
        this.eq(list4.domNode.nodeName, 'UL')
        this.eq(list4.children.length, 0)

        var list5 = List('aLabel7', true, ['x'])
        this.eq(list5.label, 'aLabel7')
        this.eq(list5.domNode.nodeName, 'OL')
        this.eq(list5.children.length, 1)

        var list6 = List('aLabel8', false, ['y'])
        this.eq(list6.label, 'aLabel8')
        this.eq(list6.domNode.nodeName, 'UL')
        this.eq(list6.children.length, 1)

    })
};
