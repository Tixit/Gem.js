
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



//*

test("simple repetitive add performance", function() {
    var c = Block()
    this.time(function() {
        for(var n=0; n<100; n++) {
            c.add(Text("x"))
        }
    })
})

test("performance of repetitive add on already-attached block", function(){
    var c = Block()
    var nodes = testUtils.demo(1, c)

    this.time(function() {
        for(var n=0; n<1000; n++) {
            c.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})


test("performance of add on end of nested structure - 5 nestings", function(){
    var structure = buildNestedStructure(5)
    var nodes = testUtils.demo(2, structure.top)
    var innerMost = structure.innerMost

    this.time(function() {
        for(var n=0; n<1000; n++) {
            innerMost.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})
test("performance of add on end of nested structure - 100 nestings", function(){
    var structure = buildNestedStructure(100)
    var nodes = testUtils.demo(3, structure.top)
    var innerMost = structure.innerMost

    this.time(function() {
        for(var n=0; n<1000; n++) {
            innerMost.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})
test("performance of add on end of nested structure - 1000 nestings", function(){
    var structure = buildNestedStructure(1000)
    var nodes = testUtils.demo(4, structure.top)
    var innerMost = structure.innerMost

    this.time(function() {
        for(var n=0; n<1000; n++) {
            innerMost.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})


test("performance of add on end of nested structure - 5 nestings, 5 style nestings", function(){
    var structure = buildNestedStructure(5)
    structure.top.style = buildNestedStyle(5)
    var nodes = testUtils.demo(5, structure.top)
    var innerMost = structure.innerMost

    this.time(function() {
        for(var n=0; n<1000; n++) {
            innerMost.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})
test("performance of add on end of nested structure - 100 nestings, 100 style nestings", function(){
    var structure = buildNestedStructure(100)
    structure.top.style = buildNestedStyle(100)
    var nodes = testUtils.demo(6, structure.top)
    var innerMost = structure.innerMost

    this.time(function() {
        for(var n=0; n<1000; n++) {
            innerMost.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})


test("performance of add on end of nested structure with native pseudoclass style", function(){
    var structure = buildNestedStructure(5)
    structure.top.style = Style({
        Block: {
            hover: {
                Block: {
                    color: 'blue'
                }
            }
        }
    })
    var nodes = testUtils.demo(5, structure.top)
    var innerMost = structure.innerMost

    this.time(function() {
        for(var n=0; n<1000; n++) {
            innerMost.add(Text("x"))
        }
    })

    testUtils.cleanupDemo(nodes)
})

//*/