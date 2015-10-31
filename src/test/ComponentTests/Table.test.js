var testUtils = require('testUtils')
var Block = require("Components/Block")
var domUtils = require('domUtils')

var Text = require("Components/Text")
var Table = require('Components/Table')

module.exports = function(t) {


    var container = Block()
    testUtils.demo("Table", container)

    this.test("simple creation", function() {
        var table = Table([
            [Text('a'), Text('b'), Text('c'), Text('d')],
            [Text('A'), Text('B'), Text('C'), Text('D'), Text("E")],
            [Text('AY'), Text('BEE'), Text('CEE'), Text('DEE'), Text("EEeeeeee")]
        ])

        container.add(Text("table1"), table)

        this.eq(table.children.length, 3)
        this.ok(table.children[0] instanceof Table.Row)
        this.ok(table.children[1] instanceof Table.Row)
        this.ok(table.children[2] instanceof Table.Row)

        this.eq(table.children[0].children.length, 4)
        this.eq(table.children[1].children.length, 5)
        this.eq(table.children[2].children.length, 5)

        this.ok(table.children[0].children[0] instanceof Table.Cell)
        this.eq(table.children[0].children[0].children[0].text, 'a')
        var firstRow = $($(table.domNode).find("tr")[0])
        this.eq(firstRow.find('td')[0][domUtils.textProperty], 'a')

        this.ok(table.children[2].children[3] instanceof Table.Cell)
        this.ok(table.children[2].children[3].children[0] instanceof Text)
        this.eq(table.children[2].children[3].children[0].text, 'DEE')
        this.eq(table.domNode.children[2].children[3].children[0][domUtils.textProperty], 'DEE')
        var lastRow = $($(table.domNode).find("tr")[2])
        this.eq(lastRow.find('td')[3][domUtils.textProperty], 'DEE')

        this.test("tables constructed with raw strings instead of elements", function() {
            var table = Table([
                ['a', 'b', 'c'],
                ['d', 'e', 'f']
            ])

            container.add(Text("table2"), table)

            this.eq(table.children.length, 2)

            this.eq(table.children[0].children.length, 3)
            this.eq(table.children[0].children[0].domNode[domUtils.textProperty], 'a')

            this.eq(table.children[1].children.length, 3)
            this.eq(table.children[1].children[2].domNode[domUtils.textProperty], 'f')
        })
    })

    this.test("individual row creation", function() {
        var table = Table()

        var row1 = table.row([Text('a'), Text('b'), Text('c'), Text('d')])
        this.eq(table.children.length, 1)

        var row2 = table.row([Text('A'), Text('B'), Text('C'), Text('D'), Text("E")])

        this.eq(table.children.length, 2)
        this.ok(table.children[0] instanceof Table.Row)
        this.ok(table.children[1] instanceof Table.Row)
        this.eq(table.children[0], row1)
        this.eq(table.children[1], row2)

        this.eq(table.children[0].children.length, 4)
        this.eq(table.children[1].children.length, 5)

        this.ok(table.children[0].children[0] instanceof Table.Cell)
        this.eq(table.children[0].children[0].children[0].text, 'a')
        var firstRow = $($(table.domNode).find("tr")[0])
        this.eq(firstRow.find('td')[0][domUtils.textProperty], 'a')

        this.ok(table.children[1].children[3] instanceof Table.Cell)
        this.eq(table.children[1].children[3].children[0].text, 'D')
        this.eq(table.domNode.children[1].children[3][domUtils.textProperty], 'D')
        var lastRow = $($(table.domNode).find("tr")[1])
        this.eq(lastRow.find('td')[3][domUtils.textProperty], 'D')

        this.test("rows constructed with raw strings instead of elements", function() {
            var table = Table()

            table.row(['a', 'b', 'c'])
            table.row(['d', 'e', 'f'])

            this.eq(table.children.length, 2)

            this.eq(table.children[0].children.length, 3)
            this.eq(table.children[0].children[0].domNode[domUtils.textProperty], 'a')

            this.eq(table.children[1].children.length, 3)
            this.eq(table.children[1].children[2].domNode[domUtils.textProperty], 'f')
        })
    })

    // table headers are exactly the same as table rows, except...  apply directly to the forehead
    this.test("individual header creation", function() {
        var table = Table()

        var row1 = table.header([Text('a'), Text('b'), Text('c'), Text('d')])
        this.eq(table.children.length, 1)

        var row2 = table.header([Text('A'), Text('B'), Text('C'), Text('D'), Text("E")])

        this.eq(table.children.length, 2)
        this.ok(table.children[0] instanceof Table.Header)
        this.ok(table.children[1] instanceof Table.Header)
        this.eq(table.children[0], row1)
        this.eq(table.children[1], row2)

        this.eq(table.children[0].children.length, 4)
        this.eq(table.children[1].children.length, 5)

        this.ok(table.children[0].children[0] instanceof Table.Cell)
        this.eq(table.children[0].children[0].children[0].text, 'a')
        var firstRow = $($(table.domNode).find("th")[0])
        this.eq(firstRow.find('td')[0][domUtils.textProperty], 'a')

        this.ok(table.children[1].children[3] instanceof Table.Cell)
        this.eq(table.children[1].children[3].children[0].text, 'D')
        this.eq(table.domNode.children[1].children[3][domUtils.textProperty], 'D')
        var lastRow = $($(table.domNode).find("th")[1])
        this.eq(lastRow.find('td')[3][domUtils.textProperty], 'D')

        this.test("rows constructed with raw strings instead of elements", function() {
            var table = Table()

            table.header(['a', 'b', 'c'])
            table.header(['d', 'e', 'f'])

            this.eq(table.children.length, 2)

            this.eq(table.children[0].children.length, 3)
            this.eq(table.children[0].children[0].domNode[domUtils.textProperty], 'a')

            this.eq(table.children[1].children.length, 3)
            this.eq(table.children[1].children[2].domNode[domUtils.textProperty], 'f')
        })
    })

    this.test('individual cell creation', function() {
        var table = Table()
        container.add(Text("table3"), table)

        var row1 = table.row()
        var row2 = table.row()

        var cell1 = row1.cell(Text('a'))

        var cell2 = row2.cell(Text('A'))
        var cell3 = row2.cell([Text('B')])

        this.eq(table.children.length, 2)
        this.eq(table.children[0], row1)
        this.eq(table.children[1], row2)

        this.eq(table.children[0].children.length, 1)
        this.eq(table.children[1].children.length, 2)

        this.ok(table.children[0].children[0] instanceof Table.Cell)
        this.eq(table.children[0].children[0], cell1)
        this.eq(table.children[0].children[0].children[0].text, 'a')
        var firstRow = $($(table.domNode).find("tr")[0])
        this.eq(firstRow.find('td')[0][domUtils.textProperty], 'a')

        this.ok(table.children[1].children[1] instanceof Table.Cell)
        this.eq(table.children[1].children[0], cell2)
        this.eq(table.children[1].children[1], cell3)
        this.eq(table.children[1].children[1].children[0].text, 'B')
        this.eq(table.domNode.children[1].children[1][domUtils.textProperty], 'B')
        var lastRow = $($(table.domNode).find("tr")[1])
        this.eq(lastRow.find('td')[1][domUtils.textProperty], 'B')

        this.test("colspan", function() {
            cell1.colspan(2)
            this.eq(cell1.attr('colspan'), '2')
        })

        this.test("cells constructed with raw strings instead of elements", function() {
            var table = Table()

            var row1 = table.row()
            var row2 = table.row()

            row1.cell('a')
            row1.cell('b')
            row1.cell('c')

            row2.cell('d')
            row2.cell('e')
            row2.cell('f')

            this.eq(table.children.length, 2)

            this.eq(table.children[0].children.length, 3)
            this.eq(table.children[0].children[0].domNode[domUtils.textProperty], 'a')

            this.eq(table.children[1].children.length, 3)
            this.eq(table.children[1].children[2].domNode[domUtils.textProperty], 'f')
        })
    })

    this.test("label arguments", function() {
        var table1 = Table('aLabel')
        var table2 = Table('aLabel2', [['a', 'b'],['c', 'd'],['e']])
        this.eq(table1.label, 'aLabel')
        this.eq(table2.label, 'aLabel2')
        this.eq(table2.children.length, 3)

        var row1 = table1.row('aLabel3')
        var row2 = table1.row('aLabel4', ['f','g'])
        this.eq(row1.label, 'aLabel3')
        this.eq(row2.label, 'aLabel4')
        this.eq(table1.children.length, 2)

        var cell1 = row1.cell('label5', 'value')
        var cell2 = row1.cell('label6', undefined)
        this.eq(cell1.label, 'label5')
        this.eq(cell1.domNode[domUtils.textProperty], 'value')
        this.eq(cell2.label, 'label6')
    })
};
