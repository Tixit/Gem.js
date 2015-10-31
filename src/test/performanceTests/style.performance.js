
var testUtils = require('testUtils')
var Block = require("Components/Block")
var Text = require('Components/Text')
var Style = require('Style')

var test = testUtils.performanceTest
var buildNestedStructure = testUtils.buildNestedStructure
var buildNestedStyle = testUtils.buildNestedStyle


// warm up (not sure if this is really a good warm up)
for(var n=0; n<100; n++) {
    Block().add(Text("x"))
}


// todo: test performance of changing the style of the parent without changing its stylemap



//*

test("simple pure css style creation", function() {

    var style;
    this.time(function() {
        for(var n=0; n<100; n++) {
            style = Style({
                color: 'red'
            })
        }
    })
})

test("simple pure css style", function() {
    var c = Block()
    var nodes = testUtils.demo(1, c)

    var style = Style({
        color: 'red'
    })

    this.time(function() {
        for(var n=0; n<100; n++) {
            c.style = style
        }
    })

    testUtils.cleanupDemo(nodes)
})
test("simple pure css style 2", function() {
    var c = Block()
    var nodes = testUtils.demo(1, c)

    this.time(function() {
        for(var n=0; n<100; n++) {
            c.style = Style({
                color: 'red'
            })
        }
    })

    testUtils.cleanupDemo(nodes)
})

test("simple pure css style on a list of nodes", function() {
    var c = Block()
    var nodes = testUtils.demo(1, c)

    for(var n=0; n<100; n++) {
        c.add(Text("hi"))
    }

    var style = Style({
        color: 'red'
    })

    this.time(function() {
        for(var n=0; n<100; n++) {
            c.style = style
        }
    })

    testUtils.cleanupDemo(nodes)
})


test("pure css style with a substyle on a list of nodes", function() {
    var c = Block()
    var nodes = testUtils.demo(1, c)

    for(var n=0; n<100; n++) {
        c.add(Block("hi",[]))
    }

    var style = Style({
        color: 'red',
        Block: {
            color: 'green'
        }
    })

    this.time(function() {
        for(var n=0; n<100; n++) {
            c.style = style
        }
    })

    testUtils.cleanupDemo(nodes)
})


test("state style with a substyle on a list of nodes", function() {
    var c = Block()
    var nodes = testUtils.demo(1, c)

    for(var n=0; n<100; n++) {
        var structure = buildNestedStructure(5)
        c.add(structure.top)
    }

    var stateStyle = Style({
        color: 'blue'
    })

    var style = Style({
        color: 'red',
        $state: function() {
            return stateStyle
        },

        Block: {
            color: 'green'
        }
    })

    this.time(function() {
        for(var n=0; n<100; n++) {
            c.style = style
        }
    })

    testUtils.cleanupDemo(nodes)
})

//*/