var syn = require("fsyn")
var testUtils = require('testUtils')

var CheckBox = require('Components/CheckBox')

module.exports = function(t) {
    t.count(15)

    
    
    
    //*
        
    var obj = new CheckBox()
    this.test("clicks", function(t) {
        this.count(2)
        obj.on("click",function() {
            t.ok(true)
        })
    })
    this.test("clicks", function(t) {
        this.count(4)
        obj.on("change",function() {
            t.ok(true)
        })
    })

    testUtils.demo("Checkbox", obj)

    this.eq(obj.selected, false)
    this.eq(obj.domNode.checked, false)

    obj.selected = true          // causes a change event (but no click)
    this.eq(obj.selected, true)
    this.eq(obj.domNode.checked, true)

    obj.selected = true          // nothing should happen since its already selected
    this.eq(obj.selected, true)
    this.eq(obj.domNode.checked, true)

    obj.selected = false         // causes a change event (but no click)
    this.eq(obj.selected, false)
    this.eq(obj.domNode.checked, false)

    syn.click(obj.domNode).then(function() {     // causes a change event and a click event
        t.eq(obj.selected, true)
        t.eq(obj.domNode.checked, true)

        return syn.click(obj.domNode)            // causes a change event and a click event
    }).then(function(){
        t.eq(obj.selected, false)
        t.eq(obj.domNode.checked, false)
    }).done()
    
    this.test("quiet", function(t) {
        var obj = CheckBox()                  
        obj.quiet.selected = 'moose'
        
        obj.on('change', function() {
            t.ok(false)
        })
        
        obj.quiet.selected = true
        this.eq(obj.selected, true)
    })
    
    // */
};
