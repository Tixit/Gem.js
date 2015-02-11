var emitter = require('events').EventEmitter
var proto = require("proto");
var trimArguments = require("trimArguments")
var utils = require('./utils')
var domUtils = require('./domUtils')
var observe = require('observe')

var Style = require("./Style")
Style.isDev = function() {return module.exports.dev}

var components = {};

// events:
    // newParent - emits this when a component gets a new parent
    // parentRemoved - emits this when a component is detached from its parent
var Block = module.exports = proto(emitter,function(superclass) {

    // static properties

	// this should not be static, but breaks if it's made into an instance variable
    this.emits = [];

	
    Object.defineProperty(this, 'label', {
        get: function() {
            return this._label
        }, set: function(v) {
            if(this._label === undefined) {
                this._label = v

                if(module.exports.dev) {
                    this.attr('label', this.label)
                }
            } else {
                throw new Error("A Block's label can only be set once (was already set to: "+this._label+")")
            }
        }
    })
	

	// instance properties

	
	this.domNode;


    // constructor
	this.init = function() {
        if(this.name === undefined) {
            throw new Error("The 'name' property is required for Blocks")
        }

        this.children = []
		this.unbubbledEvents = []
		this.bubbles = []
        this.state = observe({})

        if(module.exports.dev) {
            this.attr('name', this.name)
        }

        this.parent = undefined;
		
		if (this.id !== undefined) {
			components[this.id] = this;
		}

        if(this.domNode === undefined) {
            this.domNode = domUtils.div()
        }

        this.create.apply(this, arguments)

        this.domNode.className = Style.defaultClassName
	}

    // sub-constructor - called by the constructor
    // parameters:
        // label - (Optional) A label that can be used to style a component differently.
                   // Intended to be some string describing what the component is being used for.
                   // Note, tho, that labels are not dynamic - changing the label won't affect styling until a new style is applied to the component)
        // domNode - (Optional) A domNode to be used as the container domNode instead of the default (a div)
    this.create = function(/*[label,] domNode*/) {
        if(arguments.length === 1) {
            this.domNode = arguments[0]
        } else if(arguments.length >= 2) {
            this.label = arguments[0]
            this.domNode = arguments[1]
        }
    }

    // sets or gets an attribute on the components domNode
    // parameter sets:
    // if one argument is passed, the attribute's value is returned
    // if there are two arguments passed, the attribute is set
        // if 'value' is undefined, the attribute is removed
    this.attr = function(attribute, value) {
        if(arguments.length === 1) {
            return this.domNode.getAttribute(attribute)
        } else {
            if(value !== undefined) {
                domUtils.setAttribute(this.domNode, attribute, value)
            } else {
                this.domNode.removeAttribute(attribute)
            }
        }
    }

    this.focus = function() {
        this.domNode.focus()
    }
    this.blur = function() {
        this.domNode.blur()
    }


    Object.defineProperty(this, 'style', {
        get: function() {
            return this._style

        // sets the style, replacing one if one already exists
        }, set: function(styleObject) {
            if(styleObject === undefined) {
                var styleMap = this.getParentStyleMap()
                if(styleMap !== undefined) {
                    setCurrentStyle(this, styleMap[this.name])
                } else {
                    setCurrentStyle(this, undefined)
                }

                this.computedStyleMap = styleMap

            } else {
                setCurrentStyle(this, styleObject)
                var specificStyle = styleObject.get(this)
                if(this.getParentStyleMap() !== undefined) {
                    this.computedStyleMap = styleMapConjunction(this.getParentStyleMap(), specificStyle.componentStyleMap)
                } else {
                    this.computedStyleMap = specificStyle.componentStyleMap
                }
            }

            this._style = styleObject
            propogateStyleSet(this.children, this.computedStyleMap) // propogate styles to children
        }
    })

	this.bubble = function(component) {
		if (!isBlock(component)) {
			console.log("Cannot bubble events from an object that is not a Block");
			return;
		}
		for (var i=0;i<component.emits.length;i++) {
			this.emits.push(component.emits[i]);
		}
		this.bubbles.push(component);
		
		// now run through all our unbubbled events and see if any of them handle this
		var newUnbubbled = [];
		for (var i=0;i<this.unbubbledEvents.length;i++) {
			var success = this.attachBubbleEvent(this.unbubbledEvents[i].event,this.unbubbledEvents[i].callback);
			if (success !== true) {
				newUnbubbled.push(this.unbubbledEvents[i]);
			}
		}
		this.unbubbledEvents = newUnbubbled;
	}

    this.bubbleEvents = function(component, events) {
        var that = this
        events.forEach(function(event) {
            component.on(event, function(eventObject) {
                that.emit(event, eventObject)
            })
        })
    }

	this.attachBubbleEvent = function(event,callback) {
		var foundBubble = false;
		for (var i=0;i<this.bubbles.length;i++) {
			if (this.bubbles[i].handlesEvent(event)) {
				// if the bubbled component does handle this event, then attach the callback handler
				// note this could mean the callback is attached to multiple components
				this.bubbles[i].on(event,callback);
				foundBubble = true;
			}
		}
		return foundBubble;
	}

	this.handlesEvent = function(event) {
		for (var i=0;i<this.emits.length;i++) {
			if (this.emits[i] === event) {
				return true;
			}
		}
		return false;
	}

	this.on = function(event,callback) {
		var foundBubble = this.attachBubbleEvent(event,callback);
		if (!foundBubble) {
			superclass.prototype.on.call(this,event,callback);
			this.unbubbledEvents.push({event:event,callback:callback});
		}
	}

    // adds elements to the components main domNode
    // arguments can be one of the following:
        // component, component, component, ...
        // listOfBlocks
    this.add = function() {
        this.addAt.apply(this, [this.domNode.children.length].concat(trimArguments(arguments)))
	}

    // adds nodes at a particular index
    // arguments can be one of the following:
        // component, component, component, ...
        // listOfBlocks
    this.addAt = function(index/*, nodes...*/) {
        if(arguments.length === 2) {
            if(arguments[1] instanceof Array) {
                var nodes = arguments[1]
            } else {
                var nodes = [arguments[1]]
            }
        } else { // > 2
            var nodes = trimArguments(arguments).slice(1)
        }

        for (var i=0;i<nodes.length;i++) {
			var node = nodes[i];
            this.children.splice(index+i, 0, node)

            if(!isBlock(node)) {
                throw new Error("node is not a Block")
            }

            node.parent = undefined
            node.emit('parentRemoved')

            var beforeChild = this.children[1+i+index]
            if(beforeChild === undefined) {
                this.domNode.appendChild(node.domNode)
            } else {
                this.domNode.insertBefore(node.domNode, beforeChild.domNode)
            }

            node.parent = this;
            node.emit('newParent')

            // apply styles
            //if(itsaBlock) { // its always a component now
                var that = this
                node.getParentStyleMap = function() {return that.computedStyleMap}
                propogateStyleSet([node], this.computedStyleMap)
            //}
		}
    }
	
	// add a list of nodes before a particular node
    // if beforeChild is undefined, this will append the given nodes
    // arguments can be one of the following:
        // component, component, component, ...
        // listOfBlocks
    this.addBefore = this.addBeforeNode = function(beforeChild) {
        var nodes = trimArguments(arguments).slice(1)
        if(beforeChild === undefined) {
            this.add.apply(this, nodes)
        } else {
            var index = this.children.indexOf(beforeChild)
            this.addAt.apply(this, [index].concat(nodes))
        }
    }
	

    // arguments can be one of the following:
        // object, object, object, ...
        // listOfObjects
    // where 'object' is either an:
        // index - the numerical index to remove
        // component - a component to remove
    this.remove = function() {
        if(arguments[0] instanceof Array) {
            var removals = arguments[0]
        } else {
            var removals = arguments
        }

        for(var n=0; n<removals.length; n++) {
            var r = removals[n]
            var itsaBlock = isBlock(r)
            if(itsaBlock) {
                r.parent = undefined
                var index = this.children.indexOf(r)
                this.children.splice(index, 1)
                this.domNode.removeChild(r.domNode)

                r.emit('parentRemoved')

            } else { // index
                var c = this.children[r]
                this.children[r].parent = undefined
                this.children.splice(r, 1)
                this.domNode.removeChild(this.domNode.childNodes[r])

                c.emit('parentRemoved')
            }
        }
    }
	
	this.hide = function() {
		if (this.domNode !== undefined && this.domNode.style.display !== 'none' ) {
            this.displayStyle = this.domNode.style.display
            this.domNode.style.display = 'none'
		}
	}
	
	this.show = function() {
		if (this.domNode !== undefined) {
            this.domNode.style.display = this.displayStyle
		}		
	}

	this.hidden = function() {
		return this.domNode.style.display === 'none';
	}

    this.setSelection = function(start, end) {
        domUtils.setSelection(this.domNode, start, end)
    }
    this.getCaretOffset = function() {
        return domUtils.getCaretOffset(this.domNode)
    }


	// private instance variables/functions


    this.getParentStyleMap = function() {/*default returns undefined*/}  // should be set to a function that returns the computedStyleMap of the component containing this one (so Styles objects can be inherited)
    this.children;     // a list of child components that are a part of a Block object (these are used so Styles can be propogated down to child components)
    this.computedStyleMap;  // a map of style objects computed from the Styles set on a given component and its parent components

	this.style;              // the object's explicit Style object (undefined if it inherits a style)
    this.currentStyle;       // the object's current Style (inherited or explicit)
    this.displayStyle='block';       // stores the display style for use when 'show' is called (default is 'block')
    this._styleSetupStates   // place to put states for setup functions (used for css pseudoclass emulation)
});

module.exports.dev = false // set to true to enable dom element naming (so you can see boundaries of components when inspecting the dom)


// propogates a style-set change to a set of components
    // styleMap should be a *copy* of a Style's componentStyleMap property (because it will be modified)
function propogateStyleSet(components, styleMap) {
    for(var n=0; n<components.length; n++) {
        var c = components[n]
        //if(isBlock(c)) {   //
            // object inherits style if its in the styleSet and if it doesn't have an explicitly set style
            if(c.style === undefined) {
                if(styleMap === undefined) {
                    setCurrentStyle(c, undefined)
                } else if(styleMap[c.name] !== undefined) {
                    setCurrentStyle(c, styleMap[c.name])
                }
            }

            // set the computed style set
            var mainStyle; // the style directly given to a component, either its `style` property, or its inherited style
            if(c.style !== undefined) {
                mainStyle = c.style.get(c)
            } else if(styleMap !== undefined) {
                mainStyle = styleMap[c.name]
                if(mainStyle !== undefined) {
                    mainStyle = mainStyle.get(c) // get the specific style (taking into account any label)
                }
            }

            if(mainStyle !== undefined) {
                if(styleMap !== undefined) {
                    c.computedStyleMap = styleMapConjunction(styleMap, mainStyle.componentStyleMap)
                } else {
                    c.computedStyleMap = mainStyle.componentStyleMap
                }
            } else {
                c.computedStyleMap = styleMap
            }

            propogateStyleSet(c.children, c.computedStyleMap)
        //}
    }
}

// returns the conjunction of two style maps
// gets it from the computedStyles cache if its already in there
function styleMapConjunction(secondaryStyleMap, primaryStyleMap) {
    var cachedStyleMap = Style.computedStyles.get()
    if(cachedStyleMap === undefined) {
        cachedStyleMap = utils.objectConjunction(secondaryStyleMap, primaryStyleMap)
        Style.computedStyles.set([secondaryStyleMap, primaryStyleMap], cachedStyleMap)
    }

    return cachedStyleMap
}

// takes lables into account
function setCurrentStyle(component, style) {
    if(style === component.currentStyle) return; // do nothing

    if(style !== undefined)
        var specificStyle = style.get(component)
    else
        var specificStyle = style

    setStyleClass(component, specificStyle)
    applyStyleKillFunction(component)
    component.currentStyle = specificStyle
    applyStyleSetupFunction(component, specificStyle)
    applyStateHandler(component, specificStyle)
}

// applies kill appropriately
function applyStyleKillFunction(component) {
    var currentStyle = component.currentStyle
    if(currentStyle !== undefined && currentStyle.setup !== undefined) {
        if(currentStyle.kill === undefined)
            throw new Error('style has been unset but does not have a "kill" function to undo its "setup" function')

        currentStyle.kill(component)
    }
}
// applies setup appropriately
function applyStyleSetupFunction(component, style) {
    if(style !== undefined && style.setup !== undefined) {
        style.setup(component) // call setup on the component
    }
}
// initializes and sets up state-change handler
function applyStateHandler(component, style) {
    if(style !== undefined && style.stateHandler !== undefined) {
        style.stateHandler(component.state, component.domNode.style)
        component.state.on('change', function() {
            style.stateHandler(component.state.subject, component.domNode.style)
        })
    }
}

// sets the style, replacing one if one already exists
function setStyleClass(component, style) {
    var currentStyle = component.currentStyle
    if(currentStyle !== undefined) {
        component.domNode.className = component.domNode.className.replace(new RegExp(" ?\\b"+currentStyle.className+"\\b"),'') // remove the previous css class
    }
    if(style !== undefined) {
        component.domNode.className += ' '+style.className
    }
}

function isBlock(c) {
    return c.add !== undefined && c.children instanceof Array && c.domNode !== undefined
}
function isDomNode(node) {
    return node.nodeName !== undefined
}
