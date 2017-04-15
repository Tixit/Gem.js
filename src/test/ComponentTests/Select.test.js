var testUtils = require('testUtils')
var syn = require("fsyn")
var domUtils = require('domUtils')

var Block = require("Components/Block")
var Text = require("Components/Text")

var Select = require('Components/Select')

module.exports = function() {

    var container = Block()
    testUtils.demo("Select", container)

    
    
    
    //*    
    this.test("basic usage", function(t) {
        this.count(34)

        var s1 = Select({4: 'Option 4', 5: "Option 5"})
        container.add(Text("Select 1: "), s1)

        this.eq(Object.keys(s1.options).length, 2)
        this.eq(s1.options[4].val, "4")
        this.eq(s1.options[5].val, "5")
        this.eq(s1.val, "4") // selects first created option on creation

        var option6 = s1.option(6, "Option 6")

        this.eq(Object.keys(s1.options).length, 3)
        this.eq(s1.options[6], option6)


        this.test("events", function(t) {
            this.count(29)

            s1.on('change', function() {
                event('change','s1')
            })

            s1.options[4].on('click', function() {
                event('click', 'option4')
            })
            s1.options[4].on('change', function() {
                event('change', 'option4')
            })
            s1.options[5].on('click', function() {
                event('click', 'option57')
            })
            s1.options[5].on('change', function() {
                event('change', 'option57')
            })
            option6.on('click', function() {
                event('click', 'option6')
            })
            option6.on('change', function() {
                event('change', 'option6')
            })

            var event = testUtils.seq(
            // change 2
              function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option4')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option57')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val, '5')

            // change selected option value
            }, function(type,element) {
                t.eq(type, 'change')
                t.eq(element, 's1')

            // change 3
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option57')
                t.eq(s1.options[7].selected, false)
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option6')
                t.eq(s1.options[6].selected, true)
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val,6)

            // change 4
            },function(type, element) {
                t.eq(type, 'click')
                t.eq(element, 'option6')

            // change 5
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option6')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option57')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val, 7)
            },function(type, element) {
                t.eq(type, 'click')
                t.eq(element, 'option57')
            })
        })



        // change 1 - really no change because option4 is already selected
        s1.options[4].selected = true
        this.eq(s1.val, "4")
        this.eq(s1.options[4].selected, true)
        this.eq(s1.options[5].selected, false)
        this.eq(s1.options[6].selected, false)

        // change 2
        s1.options[5].selected = true
        this.eq(s1.val, "5")
        this.eq(s1.options[4].selected, false)
        this.eq(s1.options[5].selected, true)
        this.eq(s1.options[6].selected, false)

        // change option value
        s1.options[5].val = 7
        this.eq(s1.options[7].val, 7)
        this.eq(s1.val, 7)
        this.eq(s1.options[4].selected, false)
        this.eq(s1.options[5], undefined)     // moved to value 7
        this.eq(s1.options[6].selected, false)
        this.eq(s1.options[7].selected, true)

        // change option text
        s1.options[7].text = 'Option 7'
        this.eq(s1.options[7].domNode[domUtils.textProperty], 'Option 7')

        // change 3
        // change the value of the select object directly
        s1.val = 6
        this.eq(s1.val, 6)
        this.eq(s1.options[4].selected, false)
        this.eq(s1.options[6].selected, true)
        this.eq(s1.options[7].selected, false)


        // select just one of the already selected options with a click
        // change 4
        syn.click(option6.domNode).then(function() {
            t.eq(s1.val, 6)
            t.eq(s1.options[4].selected, false)
            t.eq(s1.options[6].selected, true)
            t.eq(s1.options[7].selected, false)

            // change 5
            // click one that wasn't already selected
            return syn.click(s1.options[7].domNode)
        }).then(function(){
            t.eq(s1.val, 7)
            t.eq(s1.options[4].selected, false)
            t.eq(s1.options[6].selected, false)
            t.eq(s1.options[7].selected, true)
        }).done()
    })


    // // todo:
    // this.test("test keyboard events", function() {
    //
    //     this.test("basic changing selected options with the keyboard", function(t) {
    //         var select1 = Select({1: 'one', 2: 'two', 3: 'three'})
    //
    //         container.add(Text("Another Group: "), select1)
    //
    //         select1.focus()
    //         syn.key(option1A.domNode, "[down]").then(function() {
    //             t.eq(document.activeElement, option1B)
    //             t.eq(select1.val, "2")
    //
    //             return syn.key(option1A.domNode, "[down]")
    //         })//.then(function() {
    //         //     t.eq(document.activeElement, option1C)
    //         //     t.eq(select1.val, "3")
    //         //
    //         //     return key(option1A.domNode, "[left]")
    //         // }).then(function() {
    //         //     t.eq(document.activeElement, option1B)
    //         //     t.eq(select1.val, "2")
    //         //
    //         //     return key(option1A.domNode, "[up]")
    //         // }).then(function() {
    //         //     t.eq(document.activeElement, option1A)
    //         //     t.eq(select1.val, "1")
    //         //
    //         //     // test looping
    //         //     return key(option1A.domNode, "[up]")
    //         // }).then(function() {
    //         //     t.eq(document.activeElement, option1C)
    //         //     t.eq(select1.val, "3")
    //         //
    //         //     // test looping
    //         //     return key(option1A.domNode, "[down]")
    //         // }).then(function() {
    //         //     t.eq(document.activeElement, option1A)
    //         //     t.eq(select1.val, "1")
    //         // }).done()
    //     })
    //
    // })


    this.test("labels", function(t) {
        var s1 = Select("myLabel")
        this.eq(s1.label, "myLabel")
        this.eq(Object.keys(s1.options).length, 0)

        var s2 = Select("myLabel2", {1: "one"})
        this.eq(s2.label, "myLabel2")
        this.eq(Object.keys(s2.options).length, 1)

        var option = s1.option("myLabel3", "value", "text")
        this.eq(option.label, "myLabel3")
        this.eq(option.val, "value")
        this.eq(option.text, "text")
    })


    this.test("remove", function(t) {
        this.count(14)

        var select = Select()
        var option0 = select.option("option0", "zero"), option1 = select.option("option1", "one")
        var option2 = select.option("option2", "two"), option3 = select.option("option3", 'three')
        var option4 = select.option("option4", 'four'), option5 = select.option("option5", 'five')

        option0.selected = true

        select.on('change', function() {
            event(select.val)
        })

        var event = testUtils.seq(function(value) {
            t.eq(value, 'option2')
        },function(value) {
            t.eq(value, 'option3')
        })


        this.eq(option1.parent, select)

        select.remove(1)
        this.eq(select.val, 'option0')
        this.eq(option1.parent, undefined)
        this.eq(Object.keys(select.options).length, 5)

        try {
            select.val = "option1"
        } catch(e) {
            this.eq(e.message, "There is no Option in the Select with the value: 'option1'")
        }

        select.remove(option0)          // a change event should be generated, since a selected value has been removed (and thus is no longer selected)
        this.eq(select.val, 'option2')
        this.eq(option0.group, undefined)
        this.eq(Object.keys(select.options).length, 4)

        try {
            select.val = "option0"
        } catch(e) {
            this.eq(e.message, "There is no Option in the Select with the value: 'option0'")
        }

        select.remove([2, 3]) // these are option4 and option5


        try {
            select.val = "option4"
        } catch(e) {
            this.eq(e.message, "There is no Option in the Select with the value: 'option4'")
        }

        this.eq(Object.keys(select.options).length, 2)

        select.remove([option2]) // should generate another change event

        this.eq(Object.keys(select.options).length, 1)
    })

    // todo:
    // this.test("addAt", function() { // adding options that have been removed from this or other Selects should still work (even tho thats kinda weird)
    //     // note that testing addAt means add and addBefore should work too, because those methods use addAt under the hood
    // })     
    
    this.test("quiet", function(t) {
        var obj = Select({4: 'Option 4', 5: "Option 5"})
        obj.on('change', function() {
            t.ok(false)
        })
        obj.options[4].on('change', function() {
            t.ok(false)
        })
        obj.options[5].on('change', function() {
            t.ok(false)
        })
        
        obj.quiet.val = '5'
        this.eq(obj.val, '5')
        
        obj.options[4].quiet.selected = true        
        this.eq(obj.val, '4')
    })

    this.test("errors", function() {
        this.count(5)

        var select = Select({1: "text"})

        try {
            select.option("1", 'text')
        } catch(e) {
            this.eq(e.message, "Can't give an Option the same value as another in the Select (value: '1')")
        }

        var optionB = select.option("2", 'text')
        try {
            optionB.val = "1"
        } catch(e) {
            this.eq(e.message, "Can't give an Option the same value as another in the Select or MultiSelect (value: \"1\")")
        }

        try {
            select.val = "nonexistent"
        } catch(e) {
            this.eq(e.message, "There is no Option in the Select with the value: 'nonexistent'")
        }

        try {
            select.remove(300)
        } catch(e) {
            this.eq(e.message, "There is no child at index 300")
        }

        var select2 = Select()
        try {
            select2.remove(optionB)
        } catch(e) {
            this.eq(e.message, "The Gem passed at argument index 0 is not a child of this Gem.")
        }
    })

    this.test("former bugs", function() {
        this.test("If you change the value of the selected Option via `option.val`, no change event was emitted", function() {
            this.count(1)

            var select = Select()
            var option0 = select.option("option0", "zero"), option1 = select.option("option1", "one")
            select.val = 'option0'

            select.on("change", function() {
                this.eq(select.val, 'optionNew')
            }.bind(this))

            option0.val = 'optionNew'
        })
    })
    
    //*/
};
