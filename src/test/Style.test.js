var proto = require('proto')

var testUtils = require('testUtils')
var blocks = require("../blocks")
var Block = blocks.Block
var domUtils = require('domUtils')

var Style = blocks.Style
var Text = blocks.Text
var Button = blocks.Button
var CheckBox = blocks.CheckBox
var Container = blocks.Container


module.exports = function(t) {





    //*
    this.test('simple styling',function(t) {
        this.count(2)

        var S = Style({
            color: 'rgb(0, 128, 0)'
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S

                this.domNode.textContent = "hi"
            }
        })

        var node = C()
        testUtils.demo("simple styling", node) // node has to be apart of the page before css class styles are applied to it

        var div = $(node.domNode)
        this.eq(div.css('color'), 'rgb(0, 128, 0)')

        node.style = undefined // unset a style (should return to default)
        setTimeout(function() { // looks like when a css classname is changed, it doesn't take effect immediately (is this really true????)
            t.eq(div.css('color'), 'rgb(0, 0, 0)')
        },0)

    })

    this.test('styling a more complex component with inner components', function() {
        var S = Style({
            backgroundColor: 'rgb(0, 128, 0)',
            Text: {backgroundColor: 'rgb(128, 0, 0)'},
            CheckBox: {backgroundColor: 'rgb(0, 0, 128)'}
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S

                this.add(Text('one'), CheckBox())
            }
        })

        var node = C()
        testUtils.demo('styling a more complex component with inner components', node)

        var color = $(node.domNode).css('backgroundColor')
        this.ok(color === 'rgb(0, 128, 0)', color)

        var children = node.domNode.children

        color = $(children[0]).css('backgroundColor')
        this.ok(color === 'rgb(128, 0, 0)', color)

        color = $(children[1]).css('backgroundColor')
        this.ok(color === 'rgb(0, 0, 128)', color)
    })

    this.test('styling a component via its class-parent', function() {
        var S = Style({
            Text: {backgroundColor: 'rgb(128, 0, 0)'}
        })

        var NextText = proto(Text, function(superclass) {
            this.name = 'NextText'
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S

                this.add(NextText('one'))
            }
        })

        var node = C()
        testUtils.demo('styling a component via its class-parent', node)

        var children = node.domNode.children
        var color = $(children[0]).css('backgroundColor')
        this.ok(color === 'rgb(128, 0, 0)', color)
    })

    this.test("styling inner components with the 'components' initialization", function() {

        var textStyle1 = Style({
            color: 'rgb(0, 128, 0)'
        })
        var S = Style({
            textAlign: 'center',
            Text: textStyle1
        })

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.add(Text('test'))
                this.style = S
            }
        })

        var node = C()
        testUtils.demo("styling inner components with the 'components' initialization", node)

        var textNode = $(node.domNode.children[0])

        this.eq(textNode.css('color'), 'rgb(0, 128, 0)')
        this.eq($(node.domNode).css('textAlign'), 'center')
        this.eq(textNode.css('textAlign'), 'left') // certain inheritable properties shouldn't be inherited by inner components

        node.style = undefined // unset style
        this.eq(textNode.css('color'), 'rgb(0, 0, 0)')
        this.eq(textNode.css('textAlign'), 'left')
        this.eq($(node.domNode).css('textAlign'), 'left')

    })

    this.test('default Block styles',function(t) {
        this.count(13)

        var S = Style({
            color: 'rgb(0, 0, 128)'
        })

        debugger; // fukc you
        var C = proto(Text, function(superclass) {
            this.defaultStyle = Style({
                color: 'rgb(0, 128, 0)',
                backgroundColor: 'rgb(0, 100, 100)',
                borderColor: 'rgb(120, 130, 140)'
            })
        })
        var D = proto(C, function(superclass) {
            this.defaultStyle = Style({
                backgroundColor: 'rgb(1, 2, 3)'
            })
        })

        var node = C("yeahhh")
        var node2 = D("NOOOOO")
        var container = Container(node, node2)
        testUtils.demo('default Block styles', container) // node has to be apart of the page before css class styles are applied to it

        var div = $(node.domNode)
        this.eq(div.css('color'), 'rgb(0, 128, 0)')
        this.eq(div.css('backgroundColor'), 'rgb(0, 100, 100)')

        var div2 = $(node2.domNode)
        this.eq(div2.css('color'), 'rgb(0, 128, 0)')
        this.eq(div2.css('backgroundColor'), 'rgb(1, 2, 3)')
        this.eq(div2.css('borderColor'), 'rgb(120, 130, 140)')

        node.style = S
        node2.style = S

        setTimeout(function() { // looks like when a css classname is changed, it doesn't take effect immediately (is this really true????)
            t.eq(div.css('color'), 'rgb(0, 0, 128)')
            t.eq(div.css('backgroundColor'), 'rgb(0, 100, 100)')   // the default backgroundColor bleeds through for default stylings (unlike normal stylings)

            t.eq(div2.css('color'), 'rgb(0, 0, 128)')
            t.eq(div2.css('backgroundColor'), 'rgb(1, 2, 3)')
            t.eq(div2.css('borderColor'), 'rgb(120, 130, 140)')
        },0)

        try {
            proto(Text, function() {
                this.defaultStyle = Style({
                    Text: {}
                })
            })()
        } catch(e) {
            this.eq(e.message, "A Block's defaultStyle can only contain basic css stylings, no Block, label, or pseudoclass stylings, nor run/kill javascript")
        }
        try {
            proto(Text, function() {
                this.defaultStyle = Style({
                    $label: {}
                })
            })()
        } catch(e) {
            this.eq(e.message, "A Block's defaultStyle can only contain basic css stylings, no Block, label, or pseudoclass stylings, nor run/kill javascript")
        }
        try {
            proto(Text, function() {
                this.defaultStyle = Style({
                    $$hover: {}
                })
            })()
        } catch(e) {
            this.eq(e.message, "A Block's defaultStyle can only contain basic css stylings, no Block, label, or pseudoclass stylings, nor run/kill javascript")
        }

    })

    this.test("inheritance of component styles", function() {
        //  (e.g. gramparent sets Label style, parent doesn't but has a Label component in it)


        var textStyle1 = Style({
            color: 'rgb(0, 128, 0)'
        })
        var S = Style({
            Text: textStyle1
        })

        var Parent = proto(Block, function(superclass) {
            this.name = 'Parent'

            this.build = function() {
                this.add(Text('inParent'))
            }
        })

        var Grandparent = proto(Block, function(superclass) {
            this.name = 'Grandparent'

            this.build = function() {
                this.style = S    // setting the style before adding components should also work
                this.add(Parent())
                this.add(Text('inGrandparent'))
            }
        })

        var node = Grandparent()
        testUtils.demo("inheritance of component styles", node)

        var grandparentLabel = $($(node.domNode).children('div')[1])
        var parentLabel = $(node.domNode).find('div > div')

        this.eq(grandparentLabel.css('color'), 'rgb(0, 128, 0)')
        this.eq(parentLabel.css('color'), 'rgb(0, 128, 0)')

        node.style = undefined // unset style
        this.eq(grandparentLabel.css('color'), 'rgb(0, 0, 0)')
        this.eq(parentLabel.css('color'), 'rgb(0, 0, 0)')
    })

    this.test("the 'setup' javascript initialization", function() {
        var S = Style({
            $setup: function(component) {
                component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "It is set up"

                component.domNode.appendChild(component.mahdiv)
            },
            $kill: function(component) {
                component.mahdiv.textContent = 'It has been killed'
            }
        })
        var S2 = Style({}) // empty style

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S
            }
        })

        var node = C()
        testUtils.demo("the 'setup' javascript initialization", node)

        var innerDiv = $($(node.domNode).children('div')[0])
        this.eq(innerDiv.html(), "It is set up")

        node.style = S2
        this.eq(innerDiv.html(), 'It has been killed')
    })

    this.test("changing styles on the fly", function() {

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function(style) {
                this.style = style

                this.add(Text('testLabel'))
            }
        })

        var TextStyle1 = Style({
                color:'rgb(0,128,0)'
            })
        var TextStyle2 = Style({
                color:'rgb(128,0,0)'
            })

        var S1 = Style({
                color: 'rgb(0,0,128)',

                Text: TextStyle1,
                $setup: function(component) {
                    component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "It is set up"

                    component.domNode.appendChild(component.mahdiv)
                },
                $kill: function(component) {
                    component.domNode.removeChild(component.mahdiv)
                }
            })

        var S2 = Style({
                color: 'rgb(0,128,128)',
                Text: TextStyle2,
                $setup: function(component) {
                    component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "Me is set up dood"

                    component.domNode.appendChild(component.mahdiv)
                }
            })

        var node = C(S1)
        testUtils.demo("changing styles on the fly", node)
        node.style = S2 // reset style

        var mainComponent = $(node.domNode)
        var labelDiv = $(mainComponent.children('div')[0])
        var textDiv = $(mainComponent.children('div')[1])

        this.eq(mainComponent.css('color'), 'rgb(0, 128, 128)')
        this.eq(labelDiv.css('color'), 'rgb(128, 0, 0)')
        this.eq(textDiv.html(), "Me is set up dood")


        this.test('errors', function() {
            this.count(1)

            try {
                node.style = S1 // if a style that has a 'setup' but no 'kill' is changed, an exception should be thrown
            } catch(e) {
                this.eq(e.message, 'style has been unset but does not have a "kill" function to undo its "setup" function')
            }
        })
    })

    this.test("reinheritance of parent styles", function() {
        //  (e.g. gramparent sets Text style, parent doesn't but has a Text component in it)


        var textStyle1 = Style({
                color: 'rgb(128, 0, 128)'
            })
        var textStyle2 = Style({
                color: 'rgb(128, 128, 0)'
            })
        var textStyle3 = Style({
                color: 'rgb(0, 128, 0)'
            })
        var S = Style({
                Text: textStyle1
            })
        var S2 = Style({
                Text: textStyle2
            })

        var Parent = proto(Block, function(superclass) {
            this.name = 'Parent'

            this.build = function() {
                this.style = S2

                this.text = Text('inParent')
                this.text.style = textStyle3
                this.add(this.text)
            }
        })

        var Grandparent = proto(Block, function(superclass) {
            this.name = 'Grandparent'

            this.build = function() {
                this.style = S

                this.parentComponent = Parent()
                this.add(this.parentComponent)
            }
        })

        var node = Grandparent()
        testUtils.demo("reinheritance of parent styles", node)

        var parentText = $(node.parentComponent.text.domNode)

        this.eq(parentText.css('color'), 'rgb(0, 128, 0)')

        node.parentComponent.text.style = undefined // reinherit from parent
        this.eq(parentText.css('color'), 'rgb(128, 128, 0)')

        node.parentComponent.style = undefined // reinherit from grandparent
        this.eq(parentText.css('color'), 'rgb(128, 0, 128)')
    })

    this.test('component label styling', function() {

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = style
                this.add(
                    Text('one'),
                    Text('inner', 'two'),
                    Container([Text('three')]),
                    Container('inner', [Text('inner', 'four')]),
                    Container('inner2', [Text('inner2', 'five')])
                )
            }
        })

        var styleObject = Style({
            Text: {color: 'rgb(45, 50, 60)'},
            $inner2: {
                Text: {color: 'rgb(4, 3, 2)'} // shouldn't be used
            }
        })

        var style = Style({
                color: 'rgb(128, 0, 0)',

                Text: {
                    color: 'rgb(0, 128, 0)',
                    backgroundColor: 'rgb(1, 2, 3)',
                    $inner: {
                        color: 'rgb(128, 128, 128)'
                    }
                },

                Container: {
                    backgroundColor: 'rgb(0, 120, 130)',

                    Text: {
                        color: 'rgb(0, 0, 128)'
                    },
                    $inner: {
                        Text: {
                            color: 'rgb(0, 128, 128)'
                        }
                    },
                    $inner2: styleObject
                }
            })

        var component = C()
        testUtils.demo('component label styling', component)

        var children = $(component.domNode).children()
        this.eq($(children[0]).css('color'), 'rgb(0, 128, 0)')
        this.eq($(children[0]).css('backgroundColor'), 'rgb(1, 2, 3)')

        this.eq($(children[1]).css('color'), 'rgb(128, 128, 128)')
        this.eq($(children[1]).css('backgroundColor'), 'rgb(1, 2, 3)')

        this.eq($(children[2].children[0]).css('color'), 'rgb(0, 0, 128)')

        this.eq($(children[3].children[0]).css('color'), 'rgb(0, 128, 128)')

        this.eq($(children[4].children[0]).css('color'), 'rgb(45, 50, 60)')
        this.eq($(children[4].children[0]).css('backgroundColor'), 'rgba(0, 0, 0, 0)') // nothing should be inherited from the non-label style

        this.test('errors', function() {
            this.count(1)

            try {
                Style({
                    Anything: {
                        $someLabel: {
                            $someInnerLabel: {} // not legal - only one label is allowed on a component, so nested label styles wouldn't make sense
                        }
                    }
                })
            } catch(e) {
                this.eq(e.message, "Can't create nested label style $someInnerLabel because components can only have one label")
            }
        })
    })

    this.test('component pseudo-class styling', function() {


        this.test("basic psuedo-class styling", function() {
            this.count(40)

            var C = proto(Block, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.style = style

                    var container = Container([CheckBox()])

                    this.add(
                        CheckBox(),
                        container
                    )
                }
            })

            var style = Style({
                color: 'rgb(128, 0, 0)',

                CheckBox: {
                    color: 'rgb(0, 128, 0)',

                    $$disabled: {
                        color: 'rgb(123, 130, 130)',
                        outline: '1px solid rgb(60, 60, 200)'
                    },

                    $$checked: {
                        color: 'rgb(128, 128, 128)',
                        outline: '4px solid rgb(80, 90, 100)',
                        $$required: {
                            color: 'rgb(130, 0, 130)',
                            backgroundColor: 'rgb(1, 2, 3)',

                            $setup: function(c) {
                                c.someProperty = 'required'
                            },
                            $kill: function(c) {
                                c.someProperty = 'optional'
                            }
                        }
                    }
                },

                Container: {
                    CheckBox: {color: 'rgb(0, 128, 0)'},
                    $$required: {
                        CheckBox: {
                            color: 'rgb(128, 128, 128)',

                            $$checked: {
                                $setup: function(c) {
                                    c.someProperty = 'required'
                                },
                                $kill: function(c) {
                                    c.someProperty = 'optional'
                                }
                            }
                        }
                    }
                }
            })

            var component = C()
            testUtils.demo("basic psuedo-class styling", component)

            var children = component.children

            var defaultBackgroundColor = 'rgba(0, 0, 0, 0)'

            var firstCheckBoxComponent = children[0]
            var firstCheckBox = $(firstCheckBoxComponent.domNode)
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log('just disabled')
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {    // need to use a timeout every time an attribute changes because the MutationObserver that listens for attribute changes is asynchornous and won't fire until the scheduler is reached
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.attr('disabled', undefined)
            setTimeout(function() {

            this.log("just checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.ok(firstCheckBox.css('outlineColor') !== 'rgb(0, 0, 0)', firstCheckBox.css('outlineColor'))
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.selected = false

            this.log("just required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)') // the required pseudoclass doesn't apply because its within the checked psudeoclass (and the box isn't checked)
            this.ok(firstCheckBox.css('outlineColor') !== 'rgb(60, 60, 200)', firstCheckBox.css('outlineColor'))
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)

            this.log("required and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.attr('required', undefined)
            setTimeout(function() {

            this.log("disabled and checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.attr('disabled', undefined)

            this.log("checked and required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            this.eq(firstCheckBoxComponent.someProperty, 'required')

            this.log("all 3: checked, required, and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(firstCheckBoxComponent.someProperty, 'required')

            this.log("just required (again)")
            firstCheckBoxComponent.attr('disabled', false)
            firstCheckBoxComponent.selected = false
            setTimeout(function() {
            this.eq(firstCheckBoxComponent.someProperty, 'optional')

            var secondCheckBoxComponent = children[1].children[0]
            var secondCheckBox = $(secondCheckBoxComponent.domNode)
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')
            this.eq(secondCheckBoxComponent.someProperty, undefined)

            this.log("just required")
            children[1].attr('required', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(secondCheckBoxComponent.someProperty, undefined)
            children[1].attr('required', undefined)
            setTimeout(function() {

            this.log("just checked")
            secondCheckBoxComponent.selected = true
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')
            this.eq(secondCheckBoxComponent.someProperty, undefined)

            this.log("checked and required")
            children[1].attr('required', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(secondCheckBoxComponent.someProperty, 'required')
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })

        this.test('combination of side-by-side emulated psuedoclasses', function(t) {
            var red = 'rgb(128, 0, 0)'
            var style = Style({
                '$$nthChild(1)': {
                    textDecoration: 'underline'
                },

                '$$nthChild(1+2n)': {
                    color: red
                }
            })

            var x,y;
            var c = Container([
                x = Text('a'),
                y = Text('b')
            ])
            testUtils.demo('combination of side-by-side emulated psuedoclasses', c)
            x.style = style
            y.style = style

            t.eq($(x.domNode).css('color'), red)
            t.ok($(x.domNode).css('textDecoration').indexOf('underline') !== -1)
            t.ok($(y.domNode).css('color') !== red)
            t.eq($(y.domNode).css('textDecoration').indexOf('underline'), -1)
        })

        this.test('visited', function() {
            var C = proto(Block, function(superclass) {
                this.name = 'C'

                this.build = function(text, link) {
                    this.domNode = domUtils.node('a')

                    this.attr('href', link)
                    this.attr('style', "display:block;")
                    this.domNode.textContent = text
                    this.on('click', function(e) {
                        e.preventDefault() // prevents you from going to the link location on-click
                    })

                    this.style = style
                }
            })

            var style = Style({
                color: 'rgb(150, 0, 0)',
                $$visited: {
                    color: 'rgb(0, 128, 0)',

                    $$focus: {
                        color: 'rgb(0, 70, 200)'
                    }
                }
            })

            var component1 = C("This should be green", "http://www.google.com/")
            var component2 = C("This should be blue when you click on it (if its not, visit google then try again)", "http://www.google.com/")
                component2.attr('tabindex', 1) // to make it focusable
            var component3 = C("This should be red (even when clicked on)", "http://www.thisdoesntexistatall.com/notatall")
                component3.attr('tabindex', 1) // to make it focusable

            // these need to be manually verified because the 'visited' pseudClass styles can't be verified via javascript for "security" reasons (privacy really)
            testUtils.demo('Manually verify these: component :visited pseudo-class styling', Container([component1, component2, component3]))

            component2.focus = true

            this.test('errors', function() {
                this.count(1)

                try {
                    Style({
                        Anything: {
                            $$visited: {
                                CheckBox: {
                                    $setup: function() {
                                    }
                                }
                            }
                        }
                    })
                } catch(e) {
                    this.eq(e.message, "All properties within the pseudoclasses 'visited' must be css styles")
                }
            })
        })

        this.test('last-child', function(t) {
            this.count(7)

            var C = proto(Block, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.add(Text("a"))
                    this.add(Text("b"))
                    this.add(Text("c"))
                    this.add(Text("d"))

                    this.style = style
                }
            })

            var style = Style({
                Text:{
                    $$lastChild: {
                        color: 'rgb(128, 0, 0)'
                    }
                }
            })

            var component1 = C()
            testUtils.demo('last-child', component1)

            var children = component1.domNode.children
            this.eq($(children[0]).css('color'), 'rgb(0, 0, 0)')
            this.eq($(children[1]).css('color'), 'rgb(0, 0, 0)')
            this.eq($(children[2]).css('color'), 'rgb(0, 0, 0)')
            this.eq($(children[3]).css('color'), 'rgb(128, 0, 0)')
            var classes = children[3].classList
            this.eq(classes.length, 3)  // one is the main default, one is the Text default, and the 3rd is the set styling

            // dynamically adding elements

            component1.add(Text('e'))

            setTimeout(function() {  // the styles won't actually be applied until the thread runs back to the scheduler
                t.eq($(children[3]).css('color'), 'rgb(0, 0, 0)')
                t.eq($(children[4]).css('color'), 'rgb(128, 0, 0)')
            },0)
        })

        this.test('nth-child', function() {
            var C = proto(Block, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.add(Text("a"))
                    this.add(Text("b"))
                    this.add(Text("c"))
                    this.add(Text("d"))

                    this.style = style
                }
            })

            var style = Style({
                Text:{
                    '$$nthChild(1)': {
                        color: 'rgb(128, 0, 0)'
                    },
                    '$$nthChild(2n)': {
                        color: 'rgb(0, 128, 128)'
                    }
                }
            })

            var component1 = C()
            testUtils.demo('nth-child', component1)

            var children = component1.domNode.children
            this.eq($(children[0]).css('color'), 'rgb(128, 0, 0)')
            this.eq($(children[1]).css('color'), 'rgb(0, 128, 128)')
            this.eq($(children[2]).css('color'), 'rgb(0, 0, 0)')
            this.eq($(children[3]).css('color'), 'rgb(0, 128, 128)')

            this.test('nth-child emulation', function(t) {
                this.count(5)

                var red = 'rgb(128, 0, 0)'
                var teal = 'rgb(0, 128, 128)'

                var style = Style({
                    Container:{
                        '$$nthChild(2)': {
                            Text: {
                                color: red
                            }
                        },
                        '$$nthChild(1+2n)': {
                            Text: {
                                color: teal
                            }
                        }
                    }
                })

                var c = Container([])
                testUtils.demo('nth-child emulation', c)
                c.style = style

                c.add(Container([Text('a')]))
                c.add(Container([Text('b')]))
                c.add(Container([Text('c')]))
                c.add(Container([Text('d')]))
                c.add(Container([Text('e')]))

                setTimeout(function() {
                    t.eq($(c.children[0].children[0].domNode).css('color'), teal)
                    t.eq($(c.children[1].children[0].domNode).css('color'), red)
                    t.eq($(c.children[2].children[0].domNode).css('color'), teal)
                    t.eq($(c.children[3].children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(c.children[4].children[0].domNode).css('color'), teal)
                },0)
            })

            this.test("nth-child without parent", function(t) {
                this.count(3)


                var black = 'rgb(0, 0, 0)'
                var red = 'rgb(128, 0, 0)'
                var style = Style({
                    '$$nthChild(1+1n)': {
                        color: red
                    }
                })

                var box = Container([])
                var c = Container([])
                c.style = style

                c.add(Text("moo"))
                c.add(Text("moo2"))

                box.add(c)
                testUtils.demo("nth-child without parent", box)

                setTimeout(function() {                              // allow the changes to propagate
                    t.eq($(c.children[0].domNode).css('color'), red)
                    t.eq($(c.children[1].domNode).css('color'), red)

                    var one = c.children[1]
                    c.remove(one)
                    setTimeout(function() {                          // allow the changes to propagate
                        box.add(one)
                        t.eq($(one.domNode).css('color'), black)
                    },0)
                },0)
            })
        })

//            this.test('not', function(t) {
//                var red = 'rgb(128, 0, 0)'
//                var teal = 'rgb(0, 128, 128)'
//                var style = Style({
//                    Text: {
//                        '$$not(:nthChild(1))': {
//                            color: red
//                        }
//                    },
//                    Container:{
//                        '$$not(:nthChild(3))': {
//                            Text: {
//                                color: teal
//                            }
//                        }
//                    }
//                })
//
//                var c = Container([
//                    Text('a'),
//                    Text('b'),
//                    Container([Text('c')]),
//                    Container([Text('d')])
//                ])
//                testUtils.demo('not', c)
//                c.style = style
//
//                t.eq($(c.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
//                t.eq($(c.children[1].domNode).css('color'), red)
//                t.eq($(c.children[2].children[0].domNode).css('color'), 'rgb(0, 0, 0)')
//                t.eq($(c.children[3].children[0].domNode).css('color'), teal)
//
//            })

    })

    this.test("test styling objects that inherit from a component", function() {

        var S = Style({
            Text: Style({
                color: 'rgb(128, 0, 0)'
            })
        })

        var inheritsFromText = proto(Text, function() {})

        var C = proto(Block, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = S
                this.add(inheritsFromText('inParent'))
            }
        })

        var node = C()
        testUtils.demo("test styling objects that inherit from a component", node)

        var text = $($(node.domNode).children('div')[0])

        this.eq(text.css('color'), 'rgb(128, 0, 0)')
    })

    this.test("component state", function(t) {
        var S = Style({
            color: 'rgb(0, 100, 0)',
            $state: function(state, style) {
                if(state.boggled) {
                    style.color = 'rgb(100, 0, 0)'
                } else {
                    style.color = 'rgb(0, 0, 100)'
                }
            }
        })

        var c = Text("hi")
        c.style = S

        testUtils.demo("component state", c)

        var text = $(c.domNode)
        this.eq(text.css('color'), 'rgb(0, 0, 100)')

        c.state.set('boggled', true)
        this.eq(text.css('color'), 'rgb(100, 0, 0)')
    })

    this.test('former bugs', function() {
        this.test('propogating inner style wasnt working', function() {
            var S = Style({
                    Container: {
                        Button: {
                            color: 'rgb(1,2,3)'
                        }
                    }
                })

            var C = Text('X')
                C.style = S
                var A = Container()
                    var B = Button('b')
                A.add(B)
            C.add(A)

            testUtils.demo('propogating inner style wasnt working', C)

            this.eq($(B.domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('inner styles inside labels werent working right', function() {
            var S = Style({
                $label: {
                    Text: {
                        color: 'rgb(1,2,3)'
                    }
                }
            })

            var c = Container('label', [Text('hi')])
                c.style = S

            testUtils.demo('inner styles inside labels werent working right', c)

            this.eq($(c.children[0].domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('inner styles inside labels werent working right when there was a style outside the label', function() {
            var S = Style({
                $label: {
                    Text: {
                        color: 'rgb(1,2,3)'
                    }
                },
                Text: {
                    color: 'rgb(20,50,90)'
                }
            })

            var c = Container('label', [Text('hi')])
                c.style = S

            var superContainer = Container([c]) // the component has to be added to a parent for the bug to manifest

            testUtils.demo('inner styles inside labels werent working right when there was a style outside the label', superContainer)

            this.eq($(c.children[0].domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('removing the last child component failed', function() {
            var c = Container([Text('a')])
            c.remove(0)
        })
    })
    //*/
}