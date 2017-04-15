var testUtils = require('testUtils')
var syn = require("fsyn")

var Block = require("Components/Block")
var Text = require("Components/Text")

var Radio = require('Components/Radio')


module.exports = function(t) {

    var container = Block()
    testUtils.demo("Radio", container)

    this.test('required',function(t) {
        this.test("basic usage", function(t) {
            this.count(23)

            var radio = Radio() // default is required
            var button1 = radio.button("1"), button2 = radio.button("2")
            container.add(Text("Required: "),button1, button2)

            radio.on('change', function() {
                event('change','radio')
            })

            button1.on('click', function() {
                event('click', 'button1')
            })
            button1.on('change', function() {
                event('change', 'button1')
            })
            button2.on('click', function() {
                event('click', 'button2')
            })
            button2.on('change', function() {
                event('change', 'button2')
            })

            var event = testUtils.seq(function(type, element) {
                t.eq(type, 'click')
                t.eq(element, 'button1')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'button1')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'button2')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'radio')

                t.eq(radio.val, '2')
                t.eq(radio.selectedOption, button2)
            },function(type, element) {
                t.eq(type, 'click')
                t.eq(element, 'button2')
            })

            // for a required one, the first button created will be selected by default
            t.eq(button1.domNode.checked, true)
            t.eq(button2.domNode.checked, false)
            t.eq(radio.selectedOption, button1)
            t.eq(radio.val, "1")

            // nothing should happen if you click the selected one (for required)
            syn.click(button1.domNode).then(function() {
                t.eq(button1.domNode.checked, true)
                t.eq(button2.domNode.checked, false)
                t.eq(radio.selectedOption, button1)
                t.eq(radio.val, "1")

                // select the other one
                return syn.click(button2.domNode)
            }).then(function() {
                t.eq(button1.domNode.checked, false)
                t.eq(button2.domNode.checked, true)
                t.eq(radio.val, "2")
            }).done()
        })

        this.test("remove", function(t) {
            this.count(14)

            var radio = Radio()
            var button0 = radio.button("0"), button1 = radio.button("1"), button2 = radio.button("2"), button3 = radio.button("3")
            var button4 = radio.button("4"), button5 = radio.button("5")

            radio.on('change', function() {
                event(radio.val)
            })

            var event = testUtils.seq(function(value) {
                t.eq(value, '2')
            },function(value) {
                t.eq(value, '4')
            },function(value) {
                t.eq(value, '5')
            })


            this.eq(button1.group, radio)

            radio.remove(button1)
            this.eq(radio.val, "0")
            this.eq(button1.group, undefined)
            this.eq(Object.keys(radio.buttons).length, 5)

            try {
                radio.val = "1"
            } catch(e) {
                this.eq(e.message, "There is no RadioButton in the group with the value: '1'")
            }

            radio.remove(button0)
            this.eq(radio.val, "2")  // for required, another RadioButton is selected
            this.eq(button0.group, undefined)
            this.eq(Object.keys(radio.buttons).length, 4)

            try {
                radio.val = "0"
            } catch(e) {
                this.eq(e.message, "There is no RadioButton in the group with the value: '0'")
            }

            radio.remove([button2, button3])

            this.eq(Object.keys(radio.buttons).length, 2)

            radio.remove([button4])

            this.eq(Object.keys(radio.buttons).length, 1)
        })

        // todo: when syn support keyboard events on radio buttons
        /*
        this.test("changing selected radio buttons with the keyboard", function(t) {
            var radio1 = Radio(true)
            var button1A = radio1.button("1"), button1B = radio1.button("2"), button1C = radio1.button("3")

            container.add(button1A, button1B, button1C)

            // todo: add events testing to this too

            button1A.focus()
            key(button1A.domNode, "[right]").then(function() {
                t.eq(document.activeElement, button1B)
                t.eq(radio1.val, "2")

                return key(button1A.domNode, "[down]")
            }).then(function() {
                t.eq(document.activeElement, button1C)
                t.eq(radio1.val, "3")

                return key(button1A.domNode, "[left]")
            }).then(function() {
                t.eq(document.activeElement, button1B)
                t.eq(radio1.val, "2")

                return key(button1A.domNode, "[up]")
            }).then(function() {
                t.eq(document.activeElement, button1A)
                t.eq(radio1.val, "1")

                // test looping
                return key(button1A.domNode, "[up]")
            }).then(function() {
                t.eq(document.activeElement, button1C)
                t.eq(radio1.val, "3")

                // test looping
                return key(button1A.domNode, "[down]")
            }).then(function() {
                t.eq(document.activeElement, button1A)
                t.eq(radio1.val, "1")
            }).done()
        })

        this.test("tabbing", function() {
            var radio1 = Radio(true)
            var button1A = radio1.button("1"), button1B = radio1.button("2")
            var radio2 = Radio(true)
            var button2A = radio2.button("1"), button2B = radio2.button("2")

            container.add(button1A, button1B, button2A, button2B)
        })*/

	})

    this.test("notRequired", function(t) {
        var radio = Radio(false)
        var button1 = radio.button("1"), button2 = radio.button("2")
        container.add(Text("Not required: "), button1, button2)

        // for a non-required Radio group, the group starts out without
        t.eq(button1.domNode.checked, false)
        t.eq(button2.domNode.checked, false)
        t.eq(radio.selectedOption, undefined)
        t.eq(radio.val, undefined)

        radio.val = "1"
        t.eq(radio.val, "1")

        syn.click(button1.domNode).then(function() {
            t.eq(radio.val, undefined)
        }).done()
    })

    this.test("labels", function(t) {
        var radio = Radio()
        var button1 = radio.button("myLabel", "1")

        t.eq(button1.val, "1")
        t.eq(button1.label, "myLabel")
    })

    this.test("edge cases", function() {
        this.test("changing a button's value", function() {
            var radio = Radio()
            var button1 = radio.button("1")
            var button2 = radio.button("2")

            button2.val = "3"
            this.eq(button2.val, "3")

            radio.val = "3"
            this.eq(radio.selectedOption, button2)
            this.eq(radio.val, "3")

            var button3 = radio.button("2")
            radio.val = "2"
            this.eq(radio.selectedOption, button3)
            this.eq(radio.val, "2")

        })
    })           
    
    this.test("quiet", function(t) {
        var radio = Radio()        
        var button1 = radio.button("1")
        var button2 = radio.button("2")
        
        radio.on('change', function() {
            t.ok(false)
        })
        button1.on('change', function() {
            t.ok(false)
        })
        button2.on('change', function() {
            t.ok(false)
        })
        
        radio.quiet.val = "2"
        this.eq(radio.val, "2")
        
        button1.quiet.selected = true
        this.eq(radio.val, "1")        
    })

    this.test("errors", function() {
        this.count(5)

        var radio = Radio()
        radio.button("1")

        try {
            radio.button("1")
        } catch(e) {
            this.eq(e.message, "Can't give a RadioButton the same value as another in the group (value: '"+1+"')")
        }

        var buttonB = radio.button("2")
        try {
            buttonB.val = "1"
        } catch(e) {
            this.eq(e.message, "Can't give a RadioButton the same value as another in the group (value: '"+1+"')")
        }

        try {
            radio.val = "nonexistent"
        } catch(e) {
            this.eq(e.message, "There is no RadioButton in the group with the value: 'nonexistent'")
        }

        try {
            radio.val = undefined
        } catch(e) {
            this.eq(e.message, "Can't unset this Radio set, a value is required.")
        }

        var radio2 = Radio()
        try {
            radio2.remove(buttonB)
        } catch(e) {
            this.eq(e.message, "The button passed at index 0 is not part of the group.")
        }
    })
};

