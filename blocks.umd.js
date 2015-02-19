(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["blocks"] = factory();
	else
		root["blocks"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	exports.Block = __webpack_require__(1)
	exports.Style = __webpack_require__(2)
	
	exports.Container = __webpack_require__(3)
	exports.Button = __webpack_require__(4)
	exports.CheckBox = __webpack_require__(5)
	exports.Radio = __webpack_require__(6)
	//exports.Select = require("Components/Select")
	exports.MultiSelect = __webpack_require__(7)
	exports.Table = __webpack_require__(8)
	exports.TextArea = __webpack_require__(9)
	exports.TextField = __webpack_require__(10)
	exports.Text = __webpack_require__(11)
	
	
	// todo:
	//exports.List = require('Components/List')
	//exports.Image = require('Components/Image')
	//exports.Canvas = require('Components/Canvas')
	
	// todo in separate module (a Blocks utility kit or something):
	// RadioSet (a set of labeled radio buttons)
	// TextEditor
	
	
	Object.defineProperty(this, 'dev', {
	    get: function() {
	        return exports.Block.dev
	    }, set: function(v) {
	        exports.Block.dev = v
	    }
	})
	
	// appends components to the body
	exports.attach = function(/*component,component,.. or components*/) {
	    if(arguments[0] instanceof Array) {
	        var components = arguments[0]
	    } else {
	        var components = arguments
	    }
	
	    if(document.body === null) throw new Error("Your document does not have a body.")
	
	    for(var n=0; n<components.length; n++) {
	        document.body.appendChild(components[n].domNode)
	    }
	}
	// removes components from the body
	exports.detach = function(/*component,component,.. or components*/) {
	    if(arguments[0] instanceof Array) {
	        var components = arguments[0]
	    } else {
	        var components = arguments
	    }
	
	    for(var n=0; n<components.length; n++) {
	        document.body.removeChild(components[n].domNode)
	    }
	}
	
	// creates a body tag (only call this if document.body is null)
	
	exports.createBody = function(callback) {
	    var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
	    var body = dom.createElement("body")
	    dom.documentElement.appendChild(body)
	    setTimeout(function() {  // set timeout is needed because the body tag is only added after javascript goes back to the scheduler
	        callback()
	    },0)
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter = __webpack_require__(19).EventEmitter
	var proto = __webpack_require__(20);
	var trimArguments = __webpack_require__(22)
	var utils = __webpack_require__(13)
	var domUtils = __webpack_require__(14)
	var observe = __webpack_require__(23)
	
	var Style = __webpack_require__(2)
	Style.isDev = function() {return module.exports.dev}
	
	var components = {};
	
	// events:
	    // newParent - emits this when a component gets a new parent
	    // parentRemoved - emits this when a component is detached from its parent
	var Block = module.exports = proto(EventEmitter,function(superclass) {
	
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
	
	
	    // constructor
		this.init = function() {
	        if(this.name === undefined) {
	            throw new Error("The 'name' property is required for Blocks")
	        }
	
	        this.children = []
			this.unbubbledEvents = []
			this.bubbles = []
	        this.state = observe({})
	
	        this.parent = undefined;
	
			if (this.id !== undefined) {
				components[this.id] = this;
			}
	
	        if(this.domNode === undefined) {
	            this.domNode = domUtils.div()
	        }
	
	        this.create.apply(this, arguments)
	
	        if(module.exports.dev) {
	            this.attr('blockName', this.name)
	        }
	
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
		
	
		// instance properties
	
		
		this.domNode;
	    this.label;
	
	    // adds elements to the components main domNode
	    // arguments can be one of the following:
	        // component, component, component, ...
	        // listOfBlocks
	    this.add = function() {
	        this.addAt.apply(this, [this.domNode.children.length].concat(trimArguments(arguments)))
		}
	
	    // adds nodes at a particular index
	    // nodes can be one of the following:
	        // component, component, component, ...
	        // listOfBlocks
	    this.addAt = function(index/*, nodes...*/) {
	        var nodes = normalizeAddAtArguments.apply(this, arguments)
	
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
	        // component, component, component, ...
	        // index, index, index, ... - each index is the numerical index to remove
	        // arrayOfComponents
	        // arrayOfIndexes
	    this.remove = function() {
	        var removals = normalizeRemoveArguments.apply(this, arguments)
	        removals = removals.sort(function(a,b) {
	            return b-a // reverse sort (so that removing multiple indexes doesn't mess up)
	        })
	
	        for(var n=0; n<removals.length; n++) {
	            var r = removals[n]
	            var c = this.children[r]
	
	            if(c === undefined) {
	                throw new Error("There is no child at index "+r)
	            }
	
	            c.parent = undefined
	            this.children.splice(r, 1)
	            this.domNode.removeChild(this.domNode.childNodes[r])
	
	            c.emit('parentRemoved')
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
	
	    // sets or gets an attribute on the components domNode
	    // parameter sets:
	    // if one argument is passed, the attribute's value is returned
	    // if there are two arguments passed, the attribute is set
	        // if 'value' is undefined, the attribute is removed
	    this.attr = function(/*attribute, value OR attributeObject*/) {
	        if(arguments.length === 1) {
	            if(arguments[0] instanceof Object) {
	                var attributes = arguments[0]
	                for(var attribute in attributes) {
	                    domUtils.setAttribute(this.domNode, attribute, arguments[0][attribute])
	                }
	            } else {
	                return this.domNode.getAttribute(arguments[0])
	            }
	        } else {
	            var attribute = arguments[0]
	            if(arguments[1] !== undefined) {
	                var value = arguments[1]
	                domUtils.setAttribute(this.domNode, arguments[0], value)
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
	
		this.on = function(event,callback) {
			var foundBubble = this.attachBubbleEvent(event,callback);
			if (!foundBubble) {
				superclass.prototype.on.call(this,event,callback);
				this.unbubbledEvents.push({event:event,callback:callback});
			}
		}
	
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
	
	// returns a list of indexes to remove from Block.remove's arguments
	var normalizeRemoveArguments = module.exports.normalizeRemoveArguments = function() {
	    var that = this
	
	    if(arguments[0] instanceof Array) {
	        var removals = arguments[0]
	    } else {
	        var removals = Array.prototype.slice.call(arguments)
	    }
	
	    return removals.map(function(removal, parameterIndex) {
	        if(isBlock(removal)) {
	            var index = that.children.indexOf(removal)
	            if(index === -1) {
	                throw new Error("The Block passed at index "+parameterIndex+" is not a child of this Block.")
	            }
	            return index
	        } else {
	            return removal
	        }
	
	    })
	}
	
	// returns a list of nodes to add
	var normalizeAddAtArguments = module.exports.normalizeAddAtArguments = function() {
	    if(arguments.length === 2) {
	        if(arguments[1] instanceof Array) {
	            return arguments[1]
	        } else {
	            return [arguments[1]]
	        }
	    } else { // > 2
	        return trimArguments(arguments).slice(1)
	    }
	}
	
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var jss = __webpack_require__(12)
	var proto = __webpack_require__(20)
	var HashMap = __webpack_require__(21) // .HashMap // weirdly, it looks like this is being treated like an AMD module
	
	var utils = __webpack_require__(13)
	
	var baseClassName = '_ComponentStyle_' // the base name for generated class names
	var nextClassNumber = 0
	
	// creates a style object
	
	var Style = module.exports = proto(function() {
	
	    this.defaultClassName = '_default_'     // the name of the default class (used to prevent style inheritance)
	
	    // styleDefinition is an object where key-value pairs can be any of the following:
	    // <ComponentName>: the value can either be a Style object or a nested styleDefinition object
	    // $setup: the value is a function to be run on a component when the style is applied to it
	    // $kill: the value is a function to be run on a component when a style is removed from it
	    // '$': the value describes css styles inside the component - it should be an object with the following form:
	        // cssStyle: the value should be a valid css value for that style attribute
	        // classname: the value should be an object containing an object of the same form as the '$' value
	    this.init = function(styleDefinition, privateOptions) {
	        if(privateOptions === undefined) privateOptions = {}
	        if(privateOptions.inLabel===undefined) inLabel = false
	
	        this.className = baseClassName+nextClassNumber
	        nextClassNumber++
	
	        this.componentStyleMap = {}
	        this.labelStyleMap = {}
	
	        var labelStyles = {}
	        var pseudoClassStyles = {}
	        var cssProperties = {}
	        for(var key in styleDefinition) {
	            var value = styleDefinition[key]
	
	            if(key === '$setup') {
	                if(!(value instanceof Function)) throw new Error("$setup key must be a function ('setup' can't be used as a label)")
	                this.setup = value
	
	            } else if(key === '$kill') {
	                if(!(value instanceof Function)) throw new Error("$kill key must be a function ('kill' can't be used as a label)")
	                this.kill = value
	
	            } else if(key === '$state') {
	                if(!(value instanceof Function)) throw new Error("$state key must be a function ('$state' can't be used as a label)")
	                this.stateHandler = value
	
	            } else if(key.indexOf('$$') === 0) { // pseudo-class style
	                var pseudoClass = mapCamelCase(key.substr(2))
	                if(pseudoClass === '') {
	                    throw new Error("Empty pseudo-class name not valid (style key '$$')")
	                }
	
	                utils.merge(pseudoClassStyles, flattenPseudoClassStyles(pseudoClass, value))
	
	            } else if(key.indexOf('$') === 0) {   // label style
	                if(privateOptions.inLabel)
	                    throw new Error("Can't create nested label style "+key+" because components can only have one label")
	
	                var label = key.substr(1)
	                if(label === '') {
	                    throw new Error("Empty label name not valid (style key '$')")
	                }
	
	                labelStyles[label] = value
	
	            } else if(isStyleObject(value)) {
	                this.componentStyleMap[key] = value
	
	            } else if(value instanceof Object) {
	                this.componentStyleMap[key] = Style(value)  // turn the object description into a full fledged style object
	            } else {
	                var cssStyle = key
	                var cssStyleName = mapCamelCase(cssStyle)
	                cssProperties[cssStyleName] = cssValue(cssStyleName, value)
	            }
	        }
	
	        jss.set('.'+this.className, cssProperties) // create the css class
	
	        if(module.exports.isDev) {
	            this.styleDefinitions = {}
	            this.styleDefinitions['.'+this.className] = cssProperties
	        }
	
	        // create label styles
	        if(Object.keys(labelStyles).length > 0) {
	            var baseStyle = utils.merge({}, cssProperties, this.componentStyleMap)
	
	            for(var label in labelStyles) {
	                if(isStyleObject(labelStyles[label])) {
	                    this.labelStyleMap[label] = labelStyles[label]
	                } else {
	                    var mergedStyle = utils.merge({}, baseStyle, labelStyles[label])
	                    this.labelStyleMap[label] = Style(mergedStyle, {inLabel:true})
	                }
	            }
	        }
	
	        // create pseudoclass styles
	        if(Object.keys(pseudoClassStyles).length > 0) {
	
	            // create a two-level map where the top-level keys are emulatable psuedo classes, and non-emulatable pseudo classes are at the second level
	            // the classes will also be sorted and deduped
	            var tieredPseudoClasses = {} // the two-level map
	            for(var key in pseudoClassStyles) {
	                var value = pseudoClassStyles[key]
	
	                // split key into pseudoclass list
	                var pseudoClassList = key.split(":")
	                var emulatablePseudoClasses = []
	                var nonEmulatablePseudoClasses = []
	                for(var n in pseudoClassList) {
	                    var pseudoClass = pseudoClassList[n]
	                    var pseudoClassParts = getPseudoClassParts(pseudoClass)
	                    if(pseudoClassParts.class in emulatedPseudoClasses) {
	                        emulatablePseudoClasses.push(pseudoClass)
	                    } else {
	                        nonEmulatablePseudoClasses.push(pseudoClass)
	                    }
	                }
	
	                if(emulatablePseudoClasses.length === 0) { // if none of the pseudoclasses can be emulated using javascript
	                    validatePurePseudoClassStyles(key, value)                        // then validate the value and
	                    createPseudoClassRules(this, key, '.'+this.className+":"+key, value)   // create pseudoClassRules
	
	                } else { // if some of the pseudoclasses can be emulated using javascript
	
	                    emulatablePseudoClasses.sort()
	                    var emulatablePseudoClassKey = emulatablePseudoClasses.join(':')
	                    if(tieredPseudoClasses[emulatablePseudoClassKey] === undefined)
	                        tieredPseudoClasses[emulatablePseudoClassKey] = {}
	
	                    if(nonEmulatablePseudoClasses.length === 0) {
	                        utils.merge(tieredPseudoClasses[emulatablePseudoClassKey], value)
	                    } else {
	                        nonEmulatablePseudoClasses.sort()
	                        var nonEmulatablePsuedoClassKey = nonEmulatablePseudoClasses.join(':')
	
	                        var secondTier = {}
	                        secondTier['$$'+nonEmulatablePsuedoClassKey] = value
	
	                        utils.merge(tieredPseudoClasses[emulatablePseudoClassKey], secondTier)
	                    }
	                }
	            }
	
	            // make combinations of the emulatable pseudoclasses, so that they combine like the non-emulated ones do
	            // info about mathematical combination: https://en.wikipedia.org/wiki/Combination
	
	            var tieredPseudoClassesKeys = Object.keys(tieredPseudoClasses).reverse().map(function(v) {    // reverse first so that more specific pseudoclasses go first
	                return {key: v, parts: v.split(':')} // so it doesn't have to split every time
	            })
	
	            for(var n=0; n<tieredPseudoClassesKeys.length; n++) {
	                var keyA = tieredPseudoClassesKeys[n]
	                for(var k=2; k <= tieredPseudoClassesKeys.length; k++) { // k is the number of psuedoclasses to combine
	                    for(var j=n+1; j<tieredPseudoClassesKeys.length-(k-2); j++) {
	                        var result = combinePseudoclasses(tieredPseudoClasses, [keyA].concat(tieredPseudoClassesKeys.slice(j, k)))
	                        if(result.key in tieredPseudoClasses) {
	                            utils.merge(tieredPseudoClasses[result.key], result.value)
	                        } else { // new key
	                            tieredPseudoClasses[result.key] = result.value
	                        }
	                    }
	                }
	            }
	
	            // turn the emulatable pseudo classes into Style objects
	            // also build up the set of psuedoclasses that will be emulated
	            // also build up a map of pseudoclasses-to-emulate to the emulation functions for those pseudoclasses
	            var pseudoClasesToEmulate = []
	            var preSplitPseudoClasses = [] // a list where each element looks like: [pseudoClassList, styleObject]  (this is primarily for performance - so we don't have to split the key every time we check for state changes)
	            var pseudoClassesToEmulationInfo = {}
	            for(var key in tieredPseudoClasses) {
	                if(isStyleObject(tieredPseudoClasses[key])) {
	                    tieredPseudoClasses[key] = tieredPseudoClasses[key]
	                } else {
	                    var newStyle = Style(utils.merge({}, cssProperties, tieredPseudoClasses[key])) // pseudoClassStyles merged with parent css styles
	
	                    // merge in componentStyleMap and labelStyleMap
	                    for(var k in this.componentStyleMap) {
	                        if(newStyle.componentStyleMap[k] === undefined)
	                            newStyle.componentStyleMap[k] = this.componentStyleMap[k]
	                    }
	                    for(var k in this.labelStyleMap) {
	                        if(newStyle.labelStyleMap[k] === undefined)
	                            newStyle.labelStyleMap[k] = this.labelStyleMap[k]
	                    }
	
	                    tieredPseudoClasses[key] = newStyle
	                }
	
	
	                var pseudoClassList = key.split(":")
	                for(var n=0; n<pseudoClassList.length; n++) {
	                    var pseudoClass = pseudoClassList[n]
	                    if(pseudoClasesToEmulate.indexOf(pseudoClass) === -1) {
	                        pseudoClasesToEmulate.push(pseudoClass)
	
	                        var pseudoClassParts = getPseudoClassParts(pseudoClass)
	                        var fns = emulatedPseudoClasses[pseudoClassParts.class]
	                        var info = {fns: fns}
	                        if(fns.processParameter !== undefined) {
	                            info.parameter = fns.processParameter(pseudoClassParts.parameter)
	                        }
	                        pseudoClassesToEmulationInfo[pseudoClass] = info
	                    }
	                }
	
	                preSplitPseudoClasses.push([pseudoClassList, tieredPseudoClasses[key]])
	            }
	
	            // create functions that initialize and keep track of state
	            var initializeState = function(component) {
	                var state = {}
	                for(var n=0; n<pseudoClasesToEmulate.length; n++) {
	                    var pseudoClass = pseudoClasesToEmulate[n]
	                    var pseudoClassEmulationInfo = pseudoClassesToEmulationInfo[pseudoClass]
	                    state[pseudoClass] = pseudoClassEmulationInfo.fns.check(component, pseudoClassEmulationInfo.parameter)
	                }
	
	                return state
	            }
	
	            var that = this
	            var changeStyleIfNecessary = function(currentStyle, component, state) {
	                var longestMatchingLength = 0;
	                var mostSpecificMatchingStyle = that; // if nothing else matches, change back to the base style object
	                for(var n=0; n<preSplitPseudoClasses.length; n++) {
	                    var pseudoClassList = preSplitPseudoClasses[n][0]
	                    for(var j=0; j<pseudoClassList.length; j++) {
	                        if(!state[pseudoClassList[j]]) {
	                            break;
	                        }
	                    }
	
	                    if(j === pseudoClassList.length && j > longestMatchingLength) {
	                        longestMatchingLength = j
	                        mostSpecificMatchingStyle = preSplitPseudoClasses[n][1]
	                    }
	                }
	
	                if(mostSpecificMatchingStyle !== currentStyle) {
	                    component.style = mostSpecificMatchingStyle
	                }
	            }
	
	            // setup pseudoclass emulation with $setup and $kill handlers
	
	            var wrapSetupAndKill = function(style) {
	                var originalSetup = style.setup
	                style.setup = function(component) {
	                    var that = this
	
	                    this._styleSetupStates = {} // maps pseudoClass to setupState
	                    var state = initializeState(component)
	                    for(var pseudoClass in pseudoClassesToEmulationInfo) {
	                        ;(function(pseudoClass, emulationInfo){   // close over those variables (so they keep the value they had when the function was setup)
	                            that._styleSetupStates[pseudoClass] = emulationInfo.fns.setup(component, function() { // start
	                                state[pseudoClass] = true
	                                changeStyleIfNecessary(that, component, state)
	                            }, function() { // end
	                                state[pseudoClass] = false
	                                changeStyleIfNecessary(that, component, state)
	                            }, emulationInfo.parameter)
	
	                        })(pseudoClass, pseudoClassesToEmulationInfo[pseudoClass])
	                    }
	
	                    changeStyleIfNecessary(that, component, state)
	
	                    if(originalSetup !== undefined) {
	                        originalSetup.apply(this, arguments)
	                    }
	                }
	
	                var originalKill = style.kill
	                style.kill = function(component) {
	                    for(var pseudoClass in pseudoClassesToEmulationInfo) {
	                        var emulationInfo = pseudoClassesToEmulationInfo[pseudoClass]
	                        emulationInfo.fns.kill(component, this._styleSetupStates[pseudoClass])
	                    }
	
	                    if(originalKill !== undefined) {
	                        originalKill.apply(this, arguments)
	                    }
	                }
	            }
	
	            // wrap all the setup and kill functions
	
	            for(var key in tieredPseudoClasses) {
	                var style = tieredPseudoClasses[key]
	                wrapSetupAndKill(style)
	            }
	
	            wrapSetupAndKill(this)
	        }
	    }
	
	    // instance properties
	
	    this.className          // the css classname for this style
	    this.componentStyleMap; // maps a Component name to a Style object for that component
	    this.labelStyleMap;     // maps a label name to a Style object for that label
	    this.setup;             // run some javascript on any element this class is applied to
	    this.kill;              // a function to run on removal of the style (should reverse setup)
	
	    // gets the style object for a component (takes into account whether the component has a label
	    this.get = function(component) {
	        if(component.label !== undefined) {
	            var labelStyle = this.labelStyleMap[component.label]
	            if(labelStyle !==  undefined) {
	                return labelStyle
	            }
	        }
	        // else
	        return this
	    }
	})
	
	
	// private
	
	
	// keys is a list of objects where each object has the members:
	    // key - the original string key
	    // parts - the key split by ":"
	// returns an object with the following members:
	    // key - the new combined key
	    // value - the new merged value
	var combinePseudoclasses = function(pseudoclasses, keys) {
	    var resultKeyParts = keys[0].parts
	    var resultValue = utils.merge({}, pseudoclasses[keys[0].key]) // make a copy
	    for(var n=1; n<keys.length; n++) {
	        var key = keys[n]
	        // merge all psuedoclasses that don't already exist into the resultKey
	        for(var j=0; j<key.parts.length; j++) {
	            var part = key.parts[j]
	            if(resultKeyParts.indexOf(part) === -1) {
	                resultKeyParts.push(part)
	            }
	        }
	
	        // merge the value into resultValue
	        utils.merge(resultValue, pseudoclasses[key.key])
	    }
	
	    return {key: resultKeyParts.join(':'), value: resultValue}
	}
	
	// a map of pseudoclass names and how they are emulated with javascript
	// each pseudoclass sets up the following functions:
	    // check - a function that checks if that pseudoclass currently applies to the component when its called
	    // setup - calls a callback when the pseudoClass starts and stops applying
	        // should return an object that will be passed to the kill function (as its 'state' parameter)
	    // kill - cleans up anything set up in the 'setup' function
	    // processParameter - takes the pseudoclass parameter and returns some object representing it that will be used by the setup and check functions
	var emulatedPseudoClasses = {
	    hover: {
	        check: function(component) {
	            var nodes = document.querySelectorAll( ":hover" )
	            for(var n=0; n<nodes.length; n++) {
	                if(nodes[n] === component.domNode) {
	                    return true
	                }
	            }
	            return false
	        },
	        setup: function(component, startCallback, endCallback) {
	            component.domNode.addEventListener("mouseover", startCallback)
	            component.domNode.addEventListener("mouseout", endCallback)
	
	            return {start: startCallback, end: endCallback}
	        },
	        kill: function(component, state) {
	            component.domNode.removeEventListener("mouseover", state.start)
	            component.domNode.removeEventListener("mouseout", state.end)
	        }
	    },
	    checked: {
	        check: function(component) {
	            return component.selected
	        },
	        setup: function(component, startCallback, endCallback) {
	            var setupState = {}
	            component.on("change", setupState.listener = function() {
	                if(component.selected) {
	                    startCallback()
	                } else {
	                    endCallback()
	                }
	            })
	
	            return setupState
	        },
	        kill: function(component, state) {
	            component.removeListener("change", state.listener)
	        }
	    },
	    required: {
	        check: function(component) {
	            return component.attr('required') !== null
	        },
	        setup: function(component, startCallback, endCallback) {
	            var observer = new MutationObserver(function() {
	                if(component.attr('required') !== null) {
	                    startCallback()
	                } else {
	                    endCallback()
	                }
	            })
	
	            observer.observe(component.domNode, {attributes: true})
	
	            return {observer: observer}
	        },
	        kill: function(component, state) {
	            state.observer.disconnect()
	        }
	    },
	    'last-child': {
	        check: function(component) {
	            return nthLastChildCheck(component, '1')
	        },
	        setup: function(component, startCallback, endCallback) {
	            var observer = new MutationObserver(function() {
	                if(nthLastChildCheck(component, '1')) {
	                    startCallback()
	                } else {
	                    endCallback()
	                }
	            })
	
	            var setupObserver = function() {
	                // note that since this uses the component parent rather than domNode.parentNode, this won't work for components added to non-component nodes (and there's no good way to do it, because you would have to poll for parent changes)
	                observer.observe(component.parent.domNode, {childList: true})
	            }
	
	            if(component.parent !== undefined) {
	                setupObserver()
	            }
	
	            component.on('newParent', function() {
	                setupObserver()
	            })
	            component.on('parentRemoved', function() {
	                observer.disconnect()
	            })
	
	            return {observer: observer}
	        },
	        kill: function(component, state) {
	            state.observer.disconnect()
	        }
	    },
	    'nth-child': {
	        // todo: support full an+b parameters for nth-child https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child
	        check: function(component, parameterCheck) {
	            return nthChildCheck(component, parameterCheck)
	        },
	        setup: function(component, startCallback, endCallback, parameterCheck) {
	
	            var checkAndCallCallbacks = function() {
	                if(nthChildCheck(component, parameterCheck)) {
	                    startCallback()
	                } else {
	                    endCallback()
	                }
	            }
	
	            var observer = new MutationObserver(function() {
	                checkAndCallCallbacks()
	            })
	
	            var setupObserver = function() {
	                // note that since this uses the component parent rather than domNode.parentNode, this won't work for components added to non-component nodes (and there's no good way to do it, because you would have to poll for parent changes)
	                observer.observe(component.parent.domNode, {childList: true})
	            }
	
	            if(component.parent !== undefined) {
	                setupObserver()
	            }
	
	            component.on('newParent', function() {
	                setupObserver()
	                checkAndCallCallbacks()
	            })
	            component.on('parentRemoved', function() {
	                observer.disconnect()
	                checkAndCallCallbacks()
	            })
	
	            return {observer: observer}
	        },
	        kill: function(component, state) {
	            state.observer.disconnect()
	        },
	        processParameter: function(parameter) {
	            return nthChildParameterFn(parameter)
	        }
	    },
	
	    // not's parameter is a statement consisting of pseudoclasses separated either by & or ,
	    // $$not(pseudoclass1&pseudoclass2,psuedoclass3) translates to the css :not(:pseudoclass1:pseudoclass2,:psuedoclass3)
	    /*not: {
	        check: function() {
	
	        },
	    }*/
	}
	
	// name is the name of the new pseudoclass
	// fns is an object with the members:
	    // check(component) - returns true if the pseudoclass applies to the component
	    // setup(component, startCallback, endCallback, parameter) - a function that should call startCallback when the pseudoclass starts applying, and endCallback when it stops applying
	        // parameter - the parameter passed to the pseudoclass (e.g. in :not(:first-child), ":first-child" is the parameter)
	    // kill - a function that cleans up any event listeners or anything else set up in the 'setup' function
	module.exports.addPseudoClass = function(name, fns) {
	    if(emulatedPseudoClasses[name] !== undefined) throw new Error("The pseudoclass '"+name+"' is already defined.")
	    // else
	    emulatedPseudoClasses[name] = fns
	}
	
	
	function nthChildCheck(component, testFn) {
	    if(component.domNode.parentNode === null)
	        return false
	
	    var children = component.domNode.parentNode.children                    // must be domNode.parentNode, because child nodes may not be Components
	    var index = Array.prototype.indexOf.call(children, component.domNode)
	    return testFn(index)
	}
	
	function nthLastChildCheck(component, parameter) {
	    if(component.domNode.parentNode === null)
	        return false
	
	    var children = component.domNode.parentNode.children                    // must be domNode.parentNode, because child nodes may not be Components
	    var index = children.length - parseInt(parameter)
	    return children[index] === component.domNode
	}
	
	// returns a function that takes an index and tell you if that index applies to the nthChildParameter
	var nthChildParameter = /^(((-?\d*)(([+-]\d*)n?)?)|((-?\d)*n?([+-]\d*)?))$/
	function nthChildParameterFn(parameter) {
	    var parts = parameter.match(nthChildParameter)
	    if(parts === null)
	        throw new Error("nth-child parameter '"+parameter+"' isn't valid")
	
	    if(parts[2] !== undefined) {
	        var constant = parts[3]
	        var variable = parts[5]
	    } else {
	        var constant = parts[8]
	        var variable = parts[7]
	    }
	
	    if(constant === undefined) constant = 0
	    else                       constant = parseInt(constant)
	    if(variable === undefined) variable = 0
	    else                       variable = parseInt(variable)
	
	    if(variable === 0) {
	        return function(index) {
	            return index+1 === constant
	        }
	    } else {
	        return function(index) {
	            return ((index+1-constant)/variable) % 1 === 0
	        }
	    }
	
	}
	
	// maps a style value to a css value
	// style values that are numbers are mapped to strings, usually with px postfix
	function cssValue(cssStyleName, value) {
	    // If a number was passed in, add 'px' to the (except for certain CSS properties) [also taken from jquery's code]
	    if(typeof(value) === "number" && cssNumber[cssStyleName] === undefined) {
	        return value+"px"
	    } else {
	        return value.toString()
	    }
	}
	
	function createPseudoClassRules(that, pseudoClass, selector, pseudoClassStyle) {
	
	    var pseudoClassCss = {}
	    for(var key in pseudoClassStyle) {
	        var value = pseudoClassStyle[key]
	
	        if(!(value instanceof Object)) {
	            var cssStyle = key
	            var cssStyleName = mapCamelCase(cssStyle)
	            pseudoClassCss[cssStyleName] = cssValue(cssStyleName, value)
	        } else {
	            throw new Error("All properties within the pseudoclasses '"+pseudoClass+"' must be css styles")
	        }
	    }
	
	    // create immediate pseudo class style
	    jss.set(selector, pseudoClassCss) // create the css class with the pseudoClass
	
	    if(module.exports.isDev) {
	        that.styleDefinitions = {}
	        that.styleDefinitions[selector] = pseudoClassCss
	    }
	}
	
	// throws exceptions for various style configurations that are unsupported by pure pseudo classes (ones that can't be emulated usuing javascript)
	function validatePurePseudoClassStyles(pseudoClass, pseudoClassStyles) {
	    for(var key in pseudoClassStyles) {
	        var value = pseudoClassStyles[key]
	
	        if(isStyleObject(value)) {
	            throw new Error("Can't set the pseudoclasses '"+pseudoClass+"' to a Style object")
	        } else if(key === '$setup') {
	            throw new Error("$setup can't be used within the pseudoclasses '"+pseudoClass+"'")
	        } else if(key === '$kill') {
	            throw new Error("$kill can't be used within the pseudoclasses '"+pseudoClass+"'")
	        } else if(key.indexOf('$') === 0) {   // label style
	            throw new Error("Component labels can't be used within the pseudoclasses '"+pseudoClass+"'")
	        }
	    }
	}
	
	// e.g. pulls out 'nth-child' and '2+3n' from 'nth-child(2+3n)'
	var pseudoClassRegex = /^([^(]*)(\((.*)\))?$/
	function getPseudoClassParts(fullPsuedoClass) {
	    var x = fullPsuedoClass.match(pseudoClassRegex)
	    if(x === null) throw new Error("Pseudoclass '"+fullPsuedoClass+"' is invalid")
	    return {class: x[1], parameter: x[3]}
	}
	
	
	// takes in a list of pseudoClassRules and changes any nesting like {hover: {focus: {}}} into something like {hover: {}, "hover:focus": {}}
	// also does some validation
	function flattenPseudoClassStyles(pseudoClass, pseudoClassStyle) {
	    var nonPseudoClassStyles = {}
	    var subpseudoClasses = {}
	    for(var key in pseudoClassStyle) {
	        var value = pseudoClassStyle[key]
	
	        if(key.indexOf('$$') === 0) { // pseudo-class style
	            var subPseudoClass = key.substr(2)
	            if(subPseudoClass === '') {
	                throw new Error("Empty pseudo-class name not valid (style key '$$')")
	            }
	
	            subpseudoClasses[subPseudoClass] = value
	        } else {
	            nonPseudoClassStyles[key] = value
	        }
	    }
	
	    // create flattened styles (with merged in styles from its parent pseudoclass
	    var flattenedStyles = {}
	    for(var subPseudoClass in subpseudoClasses) {
	        var value = subpseudoClasses[subPseudoClass]
	
	        if(isStyleObject(value)) {
	            flattenedStyles[pseudoClass+":"+subPseudoClass] =  value
	        } else {
	            utils.merge(flattenedStyles, flattenPseudoClassStyles(pseudoClass+":"+subPseudoClass, utils.merge({}, nonPseudoClassStyles, value)))
	        }
	    }
	
	    // write the top-level pseudoClass
	    flattenedStyles[pseudoClass] = nonPseudoClassStyles
	
	    return flattenedStyles
	}
	
	
	// taken from jquery's code
	var cssNumber = {
	    "column-count": 1,
	    "fill-opacity": 1,
	    "flex-grow": 1,
	    "flex-shrink": 1,
	    "font-weight": 1,
	    "line-height": 1,
	    "opacity": 1,
	    "order": 1,
	    "orphans": 1,
	    "widows": 1,
	    "z-index": 1,
	    "zoom": 1
	}
	
	function isStyleObject(o) {
	    return o.componentStyleMap !== undefined && o.componentStyleMap !== undefined
	}
	
	
	var asciiA = 'A'.charCodeAt(0), asciiZ = 'Z'.charCodeAt(0), difference = 'a'.charCodeAt(0) - asciiA
	function mapCamelCase(cssStyleName) {
	    for(var n=0; n<cssStyleName.length; n++) {
	        var ascii = cssStyleName.charCodeAt(n)
	        if(asciiA <= ascii && ascii <= asciiZ) { // found capital letter
	            cssStyleName = cssStyleName.slice(0, n) + '-'+String.fromCharCode(ascii+difference) + cssStyleName.slice(n+1)
	            n++ // increment a second time for the dash
	        }
	    }
	
	    return cssStyleName
	}
	
	// maps all the styles that are inherited by descendant nodes to their default values
	// source: http://stackoverflow.com/questions/5612302/which-css-styles-are-inherited
	var defaultStyleValues = {
	    'azimuth': 'center',
	    'border-collapse': 'separate',
	    'border-spacing': '0',
	    'caption-side': 'top',
	    //'color': 'black',         // let this inherit
	    //'cursor': 'auto',         // let this one inherit - its weird otherwise
	    'direction': 'ltr',
	     display: 'inline-block', // changes the default display to inline-block
	    'elevation': '',
	    'empty-cells': 'show',
	    // 'font-family': '',       // let this inherit
	    // 'font-size': 'medium',   // let this inherit
	    //'font-style': 'normal',   // let this inherit
	    //'font-variant': 'normal', // let this inherit
	    //'font-weight': 'normal',  // let this inherit
	    'letter-spacing': 'normal',
	    'line-height': 'normal',
	    'list-style-image': 'none',
	    'list-style-position': 'outside',
	    'list-style-type': 'disc',
	    'orphans': '2',
	    'pitch-range': '',
	    'pitch': '',
	     position: 'relative', // changes the default positioning so that absolute is relative to its parent by default
	    'quotes': '',
	    'richness': '',
	    'speak-header': '',
	    'speak-numeral': '',
	    'speak-punctuation': '',
	    'speak': '',
	    'speak-rate': '',
	    'stress': '',
	    'text-align': 'left',
	    'text-indent': '0',
	    'text-transform': 'none',
	    'visibility': 'visible',
	    'voice-family': '',
	    'volume': '',
	    'white-space': 'normal',
	    'widows': '2',
	    'word-spacing': 'normal'
	}
	
	jss.set('.'+Style.defaultClassName, defaultStyleValues) // creates default css class in order to prevent inheritance
	
	jss.set('input', { // chrome and firefox user agent stylesheets mess with this otherwise
	    cursor: 'inherit'
	})
	
	/*private*/ module.exports.isDev; // should be set by Component
	
	var computedStyles = module.exports.computedStyles = new HashMap() // stores a map from styleMap components, to the combined style map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	module.exports = proto(Block, function(superclass) {
	
		// static properties
	
	    this.name = 'Container'
	
	
		// instance properties
	
		this.init = function (/*[label,] content*/) {
	        if(arguments.length === 1) {
	            var contentArgs = [arguments[0]]
	        } else if(arguments.length > 1) {
	            if(typeof(arguments[0]) === 'string') {
	                var label = arguments[0]
	                var contentArgs = Array.prototype.slice.call(arguments, 1)
	            } else {
	                var contentArgs = arguments
	            }
	        }
	
			var that = this
	        superclass.init.call(this) // superclass constructor
	
	        this.label = label
	
			if(contentArgs !== undefined)
	            this.add.apply(this,contentArgs)
	
			this.domNode.addEventListener("click",function(data) {
				that.emit("click",data);
			})
		}
	})


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	module.exports = proto(Block, function(superclass) {
	
	    // static variables
	
	    this.name = 'Button'
		this.emits = ["click"]
	
	
	    // instance properties
	
		this.init = function(/*[label,] text*/) {
	        if(arguments.length >= 2) {
	            var label = arguments[0]
	            var text = arguments[1]
	        } else {
	            var text = arguments[0]
	        }
	
	        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
	
	        this.label = label
			this.attr('type','button');
			this.text = text
	
	        var that = this
	        this.domNode.addEventListener("click",function(data) {
				that.emit("click",data);
			})
		}
	
	    Object.defineProperty(this, 'text', {
	        get: function() {
	            return this.attr('value')
	        },
	        set: function(text) {
	            this.attr('value', text)
	        }
	    })
	
	})


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	module.exports = proto(Block, function(superclass) {
		// static variables
	    this.name = 'CheckBox'
	
		// instance methods
		this.init = function(label) {
	        var that = this
	
	        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
	
	        this.label = label
			this.attr('type','checkbox')
	
			this.domNode.addEventListener("click",function(e) {
	            //this.val = !this.val // toggle dat shit
				that.emit("click",e)
	            that.emit('change')
			})
		}
	
	    Object.defineProperty(this, 'selected', {
	        // returns whether or not the checkbox is checked
	        get: function() {
	            return this.domNode.checked
	        },
	        // sets the value of the checkbox to the passed value (true for checked)
	        set: function(checked) {
	            var newValue = checked === true
	            var curValue = this.domNode.checked
	            if(curValue === newValue) return;  // do nothing if nothing's changing
	
	            this.domNode.checked = newValue
	            this.emit('change') // the browser has no listenable event that is triggered on change of the 'checked' property
	        }
	    })
	})


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var proto = __webpack_require__(20)
	var EventEmitter = __webpack_require__(19).EventEmitter
	
	var Block = __webpack_require__(1)
	
	var randomStart = getRandomInt(0,999999) // a random number used to start off the numbers given to radio button names (using a random number in case there are somehow two different instances of blocks.js on the page)
	
	// A group of radio buttons
	module.exports = proto(EventEmitter, function(superclass) {
	
		// static properties
	
	    this.name = 'Radio'
	
		// instance properties
	
	
	    // required - If true, a radio button must always be selected. Otherwise, radio buttons can be deselected by clicking on them.
		this.init = function(required) {
	        //this.selected
	        this.required = required === true || required === undefined
	        this.buttons = {} // maps values to the buttons that have each value
	        this.randomStart = randomStart++
		}
	
	    // returns a new radio button
	    this.button = function(/*[label,] value*/) {
	        if(arguments.length >= 2) {
	            var label = arguments[0]
	            var value = arguments[1]
	        } else {
	            var value = arguments[0]
	        }
	
	        if(this.buttons[value] !== undefined) {
	            throw new Error("Can't give a RadioButton the same value as another in the group (value: '"+value+"')")
	        }
	
	        var button = RadioButton(this, label, value, "_radioblock"+this.randomStart)
	        this.buttons[value] = button
	
	        if(this.required && this._selected === undefined) {
	            button.selected = true
	        }
	
	        return button
	    }
	
	    // returns the RadioButton in the group that's selected (or undefined if none are selected)
	    Object.defineProperty(this, 'selected', {
	        get: function() {
	            return this._selected
	        },
	        set: function() {
	            throw new Error("Can't set selected on a Radio object")
	        }
	    })
	
	    Object.defineProperty(this, 'val', {
	        // returns the value of the selected radio button in the group (undefined if none are selected)
	        get: function() {
	            var selected = this._selected
	            if(selected === undefined) return undefined
	            // else
	            return selected.attr('value')
	        },
	
	        // sets the value of the checkbox to the passed value (true for checked)
	        // throws an exception if none of the radio buttons have that value
	        // throws an exception if an unset is attempted for a required Radio set
	        set: function(value) {
	            if(value === undefined) {
	                var selected = this._selected
	                if(selected !== undefined) {
	                    selected.selected = false
	                }
	            } else {
	                var button = this.buttons[value]
	                if(button === undefined) throw new Error("There is no RadioButton in the group with the value: '"+value+"'")
	
	                button.selected = true
	            }
	        }
	    })
	
	
	    // arguments can be one of the following:
	        // RadioButton, RadioButton, RadioButton, ...
	        // value, value, value, ... - each value is the value of the RadioButton to remove
	        // arrayOfRadioButtons
	        // arrayOfValues
	    this.remove = function() {
	        if(arguments[0] instanceof Array) {
	            var removals = arguments[0]
	        } else {
	            var removals = arguments
	        }
	
	        for(var n=0; n<removals.length; n++) {
	            var r = removals[n]
	
	            if(r instanceof RadioButton) {
	                var button = r
	                var value = r.val
	
	                if(this.buttons[value] !== r) {
	                    throw new Error("The button passed at index "+n+" is not part of the group.")
	                }
	            } else {
	                var button = this.buttons[r]
	                var value = r
	
	                if(button === undefined) {
	                    throw new Error("There is no RadioButton in the group with the value: '"+value+"'")
	                }
	            }
	
	            var originalSelected = this.selected
	            if(this.selected === button) {
	                this._selected = undefined
	            }
	
	            this.buttons[value].group = undefined // fully remove it from the group
	            delete this.buttons[value]
	        }
	
	        if(this.required && this.selected === undefined) {
	            for(var v in this.buttons) {
	                this.buttons[v].selected = true // just select the first one
	                break; // yes this doesn't loop
	            }
	        } else if(originalSelected !== this.selected) {
	            this.emit('change')
	        }
	    }
	
	})
	
	var RadioButton = proto(Block, function(superclass) {
	    this.name = 'RadioButton'
	
	    this.init = function(radioGroup, label, value, name) {
	        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
	
	        this.label = label
	        this.group = radioGroup
	
	        this.attr('type', 'radio')
	        this.attr('name', name) // the name is needed so that using tab to move through page elements can tab between different radio groups
	        this.val = value
	
	        var that = this
			this.domNode.addEventListener("mousedown",function(event) {
	            event.preventDefault()           // this needs to be here otherwise the radio button can't be changed
	
				if(that.group.required) {
	                if(that.selected === false) {
	                    that.selected = true
	                }
	            } else {
	                that.selected = !that.selected // toggle
	            }
			})
	        this.domNode.addEventListener("click",function(event) {
	            event.preventDefault()         // this needs to be here otherwise the radio button can't be *unset*
	            that.emit('click', event)
	        })
	        this.domNode.addEventListener("keydown",function(event) {
	            if(event.keyCode === 40 || event.keyCode === 39) { // down or right
	                event.preventDefault()         // this needs to be here otherwise the radio button strangely calls the click handler which causes things to mess up
	                that.selectNext()
	            } else if(event.keyCode === 38 || event.keyCode === 37) { // up or left
	                event.preventDefault()         // this needs to be here otherwise the radio button strangely calls the click handler which causes things to mess up
	                that.selectPrevious()
	            }
	        })
	    }
	
	    Object.defineProperty(this, 'val', {
	        // returns the value attribute of the checkbox
	        get: function() {
	            return this.attr('value')
	        },
	
	        // sets the value attribute of the checkbox
	        set: function(value) {
	            if(this.group.buttons[value] !== undefined) {
	                throw new Error("Can't give a RadioButton the same value as another in the group (value: '"+value+"')")
	            }
	
	            var oldValue = this.val
	            this.attr('value', value)
	            if(oldValue !== undefined) delete this.group.buttons[oldValue]
	            this.group.buttons[value] = this
	        }
	    })
	
	
	    Object.defineProperty(this, 'selected', {
	        // returns whether or not the checkbox is checked
	        get: function() {
	            return this.domNode.checked
	        },
	
	        // sets the selected state of the checkbox to the passed value (true for checked)
	        set: function(value) {
	            var booleanValue = value === true
	            if(this.selected === value) return; // ignore if there's no change
	
	            if(booleanValue) {
	                var previouslySelected = this.group.selected
	                setButtonInGroup(this.group, this)
	                if(previouslySelected !== undefined)
	                    previouslySelected.emit('change')
	            } else {
	                if(this.group.required) throw new Error("Can't unset this Radio set, a value is required.")
	                this.domNode.checked = false
	                this.group._selected = undefined
	            }
	            this.emit('change') // the browser has no listenable event that is triggered on change of the 'checked' property
	            this.group.emit('change')
	        }
	    })
	
	    this.selectNext = function() {
	        selectSibling(this,1)
	    }
	    this.selectPrevious = function() {
	        selectSibling(this,-1)
	    }
	
	})
	
	// direction can be +1 or -1
	function selectSibling(button, direction) {
	    var buttons = button.group.buttons
	    var values = Object.keys(buttons)
	    var index = values.indexOf(button.attr('value'))
	    if(direction === 1 && index === values.length-1) {
	        var buttonToSelect = buttons[values[0]]
	    } else if(direction === -1 && index === 0) {
	        var buttonToSelect = buttons[values[values.length-1]]
	
	    } else {
	        var buttonToSelect = buttons[values[index+direction]]
	    }
	
	    buttonToSelect.selected = true
	    buttonToSelect.focus()
	}
	
	function setButtonInGroup(group, button) {
	    var selected = group._selected
	    if(selected !== undefined) selected.domNode.checked = false
	    button.domNode.checked = true
	    group._selected = button
	}
	
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	var Option = __webpack_require__(15)
	
	// emits a 'change' event when its 'val' changes
	module.exports = proto(Block, function(superclass) {
	
		// static variables
	
	    this.name = 'MultiSelect'
	
	    this.Option = Option
	
		this.init = function(/*[label,] options*/) {
	        if(arguments[0] instanceof Object) {
	            var options = arguments[0]
	        } else {
	            var label = arguments[0]
	            var options = arguments[1]
	        }
	
	        this.domNode = document.createElement("select") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
			this.attr('multiple','multiple')
	        this.label = label
	
	        this.options = {}
	
			for(var value in options) {
				this.option(value, options[value])
			}
	
	        /*
			var that = this
	        that.domNode.addEventListener('mousedown', function() {
	            console.log("parent mousedown")
	            var enterHandler, upHandler;
	            that.children.forEach(function(child) {
	                child.domNode.addEventListener('mouseover', enterHandler = function() {
	                    console.log("child mouseover")
	                    child.selected = true
	                })
	            })
	
	            that.domNode.addEventListener('mouseup', upHandler = function() {
	                console.log("parent mouseup")
	                that.children.forEach(function(child) {
	                    child.domNode.removeEventListener('mouseover', enterHandler)
	                })
	
	                that.domNode.removeEventListener('mouseup', upHandler)
	            })
	        })*/
		}
	
	
		// instance methods
	
	    Object.defineProperty(this, 'val', {
	        // returns a list of the values that are selected
	        get: function() {
	            var result = []
	            for(var value in this.options) {
	                if(this.options[value].selected) {
	                    result.push(value)
	                }
	            }
	
	            return result
	        },
	
	        // values can either be an array, or a single value to select
	        set: function(values) {
	            if(!(values instanceof Array))
	                values = [values]
	
	            var that = this
	            values.forEach(function(value) {
	                if(that.options[value] === undefined) {
	                    throw new Error("There is no Option in the MultiSelect with the value: '"+value+"'")
	                }
	            })
	
	            var stringifiedValues = values.map(function(v){return v.toString()})
	
	            var somethingChanged = false
	            for(var value in this.options) {
	                var selected = stringifiedValues.indexOf(value) !== -1
	                var option = this.options[value]
	
	                if(option.selected !== selected) {  // selected state change
	                    somethingChanged = true
	                    option.setSelectedQuiet(selected)
	                }
	            }
	
	            if(somethingChanged) {
	                this.emit('change')
	            }
	        }
	    })
		
		this.option = function(/*[label,] value,text*/) {
	        if(arguments.length === 2) {
	            var value = arguments[0]
	            var text = arguments[1]
	        } else if(arguments.length === 3) {
	            var label = arguments[0]
	            var value = arguments[1]
	            var text = arguments[2]
	        } else {
	            throw new Error("Invalid number of arguments")
	        }
	
	        var newOption = Option(label, value,text)
	        this.add(newOption)
	
	        return newOption
	
		}
	
	    // same interface as Block.addAt
	    /*override*/ this.addAt = function(index/*, nodes...*/) {
	        var that = this
	
	        var nodesToAdd = Block.normalizeAddAtArguments.apply(this, arguments)
	
	        // validation first
	        nodesToAdd.forEach(function(option) {
	            if(that.options[option.val] !== undefined) {
	                throw new Error("Can't give an Option the same value as another in the MultiSelect (value: '"+option.val+"')")
	            }
	        })
	
	        superclass.addAt.call(this, index, nodesToAdd)
	
	        // MultiSelect specific state modifications - this must be done after the superclass call in case an error is thrown from it
	        var anyWereSelected = false
	        nodesToAdd.forEach(function(option) {
	            if(option.selected) anyWereSelected = true
	            that.options[option.val] = option
	
	
	            // set up multi-select events
	            // todo: remove events when the Option is removed
	
	            option.domNode.addEventListener("mousedown",function(event) {
	                event.preventDefault()           // this needs to be here otherwise the options can't be deselected
	
	                option.parent.focus() // without this, the parent doesn't gain focus
	                option.focus()
	                if(event.shiftKey || event.ctrlKey) {
	                    option.selected = !option.selected // toggle
	                } else {
	                    var parentVal = option.parent.val
	                    var onlyThisIsSelected = parentVal.length === 1 && parentVal[0] === option.val
	                    if(onlyThisIsSelected) {
	                        option.selected = false
	                    } else {
	                        option.parent.val = [option.val] // select only this one
	                    }
	                }
	            })
	            option.domNode.addEventListener("click",function(event) {
	                //event.preventDefault()         // this needs to be here otherwise the radio button can't be *unset*
	                option.emit('click', event)
	            })
	            option.domNode.addEventListener("mousemove",function(event) {
	                event.preventDefault()         // this needs to be here otherwise the radio button is unset as soon as you move the mouse (when the mouse is down)
	            })
	            /*this.domNode.addEventListener("keydown",function(event) {
	                if(event.keyCode === 40 || event.keyCode === 39) { // down or right
	                    event.preventDefault()         // this needs to be here otherwise the radio button strangely calls the click handler which causes things to mess up
	                    option.selectNext()
	                } else if(event.keyCode === 38 || event.keyCode === 37) { // up or left
	                    event.preventDefault()         // this needs to be here otherwise the radio button strangely calls the click handler which causes things to mess up
	                    option.selectPrevious()
	                }
	            })*/
	
	            /*;['click', 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop', 'cancel',
	                'mousedown', 'mouseenter', 'mousemove', 'mouseleave', 'mouseout', 'mouseover', 'mouseup'
	            ].forEach(function(eventType) {
	                option.domNode.addEventListener(eventType, function( event ) {
	                    //event.preventDefault()
	                    console.log(eventType)
	                });
	            })*/
	
	        })
	
	        if(anyWereSelected) {
	            this.emit('change')
	        }
	    }
	
	    // same interface as Block.remove
	    /*override*/ this.remove = function() {
	        var that = this
	
	        var removalIndexes = Block.normalizeRemoveArguments.apply(this, arguments)
	        var removals = removalIndexes.map(function(index) {
	            return that.children[index]
	        })
	
	        superclass.remove.call(this, removalIndexes)
	
	        // MultiSelect specific state modifications - this must be done after the superclass call in case an error is thrown from it
	        var anyWereSelected = false
	        removals.forEach(function(option) {
	            if(option.selected) anyWereSelected = true
	            delete that.options[option.val]
	        })
	
	        if(anyWereSelected) {
	            this.emit('change')
	        }
	    }
	
	
	    // private
	
	    this.prepareForValueChange = function() {} // no-op
	})
	


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	var Header = __webpack_require__(16);
	var Row = __webpack_require__(17);
	var Cell = __webpack_require__(18);
	
	module.exports = proto(Block, function(superclass) {
	
		// static properties
	
		this.name = 'Table'
	
	    this.Row = Row
		this.Header = Header
	    this.Cell = Cell
	
	
		// instance properties
	
		this.init = function(/*[label,] tableInit*/) {
			if(arguments[0] instanceof Array) {
	            var tableInit = arguments[0]
	        } else {
	            var label = arguments[0]
	            var tableInit = arguments[1]
	        }
	
	        this.domNode = document.createElement("table") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
			this.attr("cellspacing",0);   // todo: move this to a default style when that's supported
	        this.label = label
	
	        if(tableInit !== undefined) {
	            for(var n=0; n<tableInit.length; n++) {
	                this.row(tableInit[n])
	            }
	        }
		}
		
		this.header = function(/*[]label,] listOfBlocksOrText*/) {
	        return headerOrRegularRow(this, Header, arguments)
		}
	
		this.row = function() {
			return headerOrRegularRow(this, Row, arguments)
		}
	});
	
	function headerOrRegularRow(that, Prototype, args) {
	    var row = Prototype.apply(undefined, args)
	    that.add(row)
	    return row
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	module.exports = proto(Block, function(superclass) {
	
		// static variables
	
	    this.name = 'TextArea'
	
		this.init = function(label) {
	        this.domNode = document.createElement("textarea") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
			this.label = label
	
	        var that = this
			this.domNode.addEventListener("click",function(e) {
				that.emit("click",e);
			});	
			this.domNode.addEventListener("change",function(e) {
				that.emit("change",e);
			});
		}
	
	
		// instance properties
	
	
	    Object.defineProperty(this, 'val', {
	        // returns the value of the Option
	        get: function() {
	            return this.domNode.value
	        },
	
	        // sets the value of the Option
	        set: function(value) {
	            if(this.val === value) return; // do nothing if there's no change
	
	            this.domNode.value = value
	            this.emit('change')
	        }
	    })
	});


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	var domUtils = __webpack_require__(14)
	
	module.exports = proto(Block, function(superclass) {
	
		// static properties
	
	    this.name = 'TextField'
	
		this.init = function(/*[label,] password*/) {
	        if(arguments.length === 1) {
	            var password = arguments[0]
	        } else if(arguments.length > 1) {
	            var label = arguments[0]
	            var password = arguments[1]
	        }
	
	        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
	
			this.label = label
	        this.domNode.className = 'field'
			domUtils.setAttribute(this.domNode,'type','text');
	        if(password)
	            domUtils.setAttribute(this.domNode, 'type', 'password')
	
	
	        var that = this
			this.domNode.addEventListener("click",function(e) {
				that.emit("click",e);
			});
			this.domNode.addEventListener("change",function(e) {
				that.emit("change",e);
			});
	        this.domNode.addEventListener("keypress",function(e) {
				that.emit("keypress",e);
			})
	        this.domNode.addEventListener("keyup",function(e) {
				that.emit("keyup",e);
			})
		}
	
	
		// instance properties
	
	    Object.defineProperty(this, 'val', {
	        // returns the value of the Option
	        get: function() {
	            return this.domNode.value
	        },
	
	        // sets the value of the Option
	        set: function(value) {
	            if(this.val === value) return; // do nothing if there's no change
	
	            this.domNode.value = value
	            this.emit('change')
	        }
	    })
	
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	module.exports = proto(Block, function(superclass) {
	
	    //static properties
	
	    this.name = 'Text'
	
	    this.init = function(/*[label,] text*/) {
	        if(arguments.length === 1) {
	            var text = arguments[0]
	        } else {
	            var label = arguments[0]
	            var text = arguments[1]
	        }
	
	        if (text === undefined) text = '';
	
	        superclass.init.call(this) // superclass constructor
	
	        var that = this
	
	        this.label = label
	        this.text = text
	        this.domNode.style["white-space"] = "pre";      // todo: move this to a default style when that's supproted
	        this.domNode.addEventListener("click",function(e) {
	                that.emit("click",e);
	        });
	
	        this.domNode.addEventListener("input",function(data) {
	            var eventData = {newText:data.srcElement.textContent,oldText:that.oldText};
	            that.oldText = eventData.newText;
	            that.emit("input",eventData);
	        });
	
	        this.domNode.addEventListener("blur",function(data) {
	            var eventData = {newText:data.srcElement.textContent,oldText:that.lastFocus};
	            that.lastFocus = eventData.newText;
	            that.emit("blur",eventData);
	        });
	    }
	
	    // instance properties
	
	    Object.defineProperty(this, 'text', {
	        get: function() {
	            return this.domNode.textContent
	        }, set: function(v) {
	            this.domNode.innerText = v   // apparently textContent can't be set or something
	        }
	    })
	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * JSS v0.6 - JavaScript Stylesheets
	 * https://github.com/Box9/jss
	 *
	 * Copyright (c) 2011, David Tang
	 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
	 */
	var jss = (function() {
	    var adjSelAttrRegex = /((?:\.|#)[^\.\s#]+)((?:\.|#)[^\.\s#]+)/g;
	    var doubleColonPseudoElRegex = /(::)(before|after|first-line|first-letter|selection)/;
	    var singleColonPseudoElRegex = /([^:])(:)(before|after|first-line|first-letter|selection)/;
	    var singleColonForPseudoElements; // flag for older browsers
	
	    function getSelectorsAndRules(sheet) {
	        var rules = sheet.cssRules || sheet.rules || [];
	        var results = {};
	        for (var i = 0; i < rules.length; i++) {
	            // Older browsers and FF report pseudo element selectors in an outdated format
	            var selectorText = toDoubleColonPseudoElements(rules[i].selectorText);
	            if (!results[selectorText]) {
	                results[selectorText] = [];
	            }
	            results[selectorText].push({
	                sheet: sheet,
	                index: i,
	                style: rules[i].style
	            });
	        }
	        return results;
	    }
	
	    function getRules(sheet, selector) {
	        var rules = sheet.cssRules || sheet.rules || [];
	        var results = [];
	        // Browsers report selectors in lowercase
	        selector = selector.toLowerCase();
	        for (var i = 0; i < rules.length; i++) {
	            var selectorText = rules[i].selectorText;
	            // Note - certain rules (e.g. @rules) don't have selectorText
	            if (selectorText && (selectorText == selector || selectorText == swapAdjSelAttr(selector) || selectorText == swapPseudoElSyntax(selector))) {
	                results.push({
	                    sheet: sheet,
	                    index: i,
	                    style: rules[i].style
	                });
	            }
	        }
	        return results;
	    }
	
	    function addRule(sheet, selector) {
	        var rules = sheet.cssRules || sheet.rules || [];
	        var index = rules.length;
	        var pseudoElementRule = addPseudoElementRule(sheet, selector, rules, index);
	
	        if (!pseudoElementRule) {
	            addRuleToSheet(sheet, selector, index);
	        }
	
	        return {
	            sheet: sheet,
	            index: index,
	            style: rules[index].style
	        };
	    };
	
	    function addRuleToSheet(sheet, selector, index) {
	        if (sheet.insertRule) {
	            sheet.insertRule(selector + ' { }', index);
	        } else {
	            sheet.addRule(selector, null, index);
	        }
	    }
	
	    // Handles single colon syntax for older browsers and bugzilla.mozilla.org/show_bug.cgi?id=949651
	    function addPseudoElementRule(sheet, selector, rules, index) {
	        var doubleColonSelector;
	        var singleColonSelector;
	
	        if (doubleColonPseudoElRegex.exec(selector)) {
	            doubleColonSelector = selector;
	            singleColonSelector = toSingleColonPseudoElements(selector);
	        } else if (singleColonPseudoElRegex.exec(selector)) {
	            doubleColonSelector = toDoubleColonPseudoElements(selector);
	            singleColonSelector = selector;
	        } else {
	            return false; // Not dealing with a pseudo element
	        }
	
	        if (!singleColonForPseudoElements) {
	            // Assume modern browser and then check if successful
	            addRuleToSheet(sheet, doubleColonSelector, index);
	            if (rules.length <= index) {
	                singleColonForPseudoElements = true;
	            }
	        }
	        if (singleColonForPseudoElements) {
	            addRuleToSheet(sheet, singleColonSelector, index);
	        }
	
	        return true;
	    }
	
	    function toDoubleColonPseudoElements(selector) {
	        return selector.replace(singleColonPseudoElRegex, function (match, submatch1, submatch2, submatch3) {
	            return submatch1 + '::' + submatch3;
	        });
	    }
	
	    function toSingleColonPseudoElements(selector) {
	        return selector.replace(doubleColonPseudoElRegex, function(match, submatch1, submatch2) {
	            return ':' + submatch2;
	        })
	    }
	
	    function removeRule(rule) {
	        var sheet = rule.sheet;
	        if (sheet.deleteRule) {
	            sheet.deleteRule(rule.index);
	        } else if (sheet.removeRule) {
	            sheet.removeRule(rule.index);
	        }
	    }
	
	    function extend(dest, src) {
	        for (var key in src) {
	            if (!src.hasOwnProperty(key))
	                continue;
	            dest[key] = src[key];
	        }
	        return dest;
	    }
	
	    function aggregateStyles(rules) {
	        var aggregate = {};
	        for (var i = 0; i < rules.length; i++) {
	            extend(aggregate, declaredProperties(rules[i].style));
	        }
	        return aggregate;
	    }
	
	    function declaredProperties(style) {
	        var declared = {};
	        for (var i = 0; i < style.length; i++) {
	            declared[style[i]] = style[toCamelCase(style[i])];
	        }
	        return declared;
	    }
	
	    // IE9 stores rules with attributes (classes or ID's) adjacent in the opposite order as defined
	    // causing them to not be found, so this method swaps [#|.]sel1[#|.]sel2 to become [#|.]sel2[#|.]sel1
	    function swapAdjSelAttr(selector) {
	        var swap = '';
	        var lastIndex = 0;
	
	        while ((match = adjSelAttrRegex.exec(selector)) != null) {
	            if (match[0] === '')
	                break;
	            swap += selector.substring(lastIndex, match.index);
	            swap += selector.substr(match.index + match[1].length, match[2].length);
	            swap += selector.substr(match.index, match[1].length);
	            lastIndex = match.index + match[0].length;
	        }
	        swap += selector.substr(lastIndex);
	
	        return swap;
	    };
	
	    // FF and older browsers store rules with pseudo elements using single-colon syntax
	    function swapPseudoElSyntax(selector) {
	        if (doubleColonPseudoElRegex.exec(selector)) {
	            return toSingleColonPseudoElements(selector);
	        }
	        return selector;
	    }
	
	    function setStyleProperties(rule, properties) {
	        for (var key in properties) {
	            var value = properties[key];
	            var importantIndex = value.indexOf(' !important');
	
	            // Modern browsers seem to handle overrides fine, but IE9 doesn't
	            rule.style.removeProperty(key);
	            if (importantIndex > 0) {
	                rule.style.setProperty(key, value.substr(0, importantIndex), 'important');
	            } else {
	                rule.style.setProperty(key, value);
	            }
	        }
	    }
	
	    function toCamelCase(str) {
	        return str.replace(/-([a-z])/g, function (match, submatch) {
	            return submatch.toUpperCase();
	        });
	    }
	
	    function transformCamelCasedPropertyNames(oldProps) {
	        var newProps = {};
	        for (var key in oldProps) {
	            newProps[unCamelCase(key)] = oldProps[key];
	        }
	        return newProps;
	    }
	
	    function unCamelCase(str) {
	        return str.replace(/([A-Z])/g, function(match, submatch) {
	            return '-' + submatch.toLowerCase();
	        });
	    }
	
	    var Jss = function(doc) {
	        this.doc = doc;
	        this.head = this.doc.head || this.doc.getElementsByTagName('head')[0];
	        this.sheets = this.doc.styleSheets || [];
	    };
	
	    Jss.prototype = {
	        // Returns JSS rules (selector is optional)
	        get: function(selector) {
	            if (!this.defaultSheet) {
	                return {};
	            }
	            if (selector) {
	                return aggregateStyles(getRules(this.defaultSheet, selector));
	            }
	            var rules = getSelectorsAndRules(this.defaultSheet);
	            for (selector in rules) {
	                rules[selector] = aggregateStyles(rules[selector]);
	            }
	            return rules;
	        },
	        // Returns all rules (selector is required)
	        getAll: function(selector) {
	            var properties = {};
	            for (var i = 0; i < this.sheets.length; i++) {
	                extend(properties, aggregateStyles(getRules(this.sheets[i], selector)));
	            }
	            return properties;
	        },
	        // Adds JSS rules for the selector based on the given properties
	        set: function(selector, properties) {
	            if (!this.defaultSheet) {
	                this.defaultSheet = this._createSheet();
	            }
	            properties = transformCamelCasedPropertyNames(properties);
	            var rules = getRules(this.defaultSheet, selector);
	            if (!rules.length) {
	                rules = [addRule(this.defaultSheet, selector)];
	            }
	            for (var i = 0; i < rules.length; i++) {
	                setStyleProperties(rules[i], properties);
	            }
	        },
	        // Removes JSS rules (selector is optional)
	        remove: function(selector) {
	            if (!this.defaultSheet)
	                return;
	            if (!selector) {
	                this._removeSheet(this.defaultSheet);
	                delete this.defaultSheet;
	                return;
	            }
	            var rules = getRules(this.defaultSheet, selector);
	            for (var i = 0; i < rules.length; i++) {
	                removeRule(rules[i]);
	            }
	            return rules.length;
	        },
	        _createSheet: function() {
	            var styleNode = this.doc.createElement('style');
	            styleNode.type = 'text/css';
	            styleNode.rel = 'stylesheet';
	            this.head.appendChild(styleNode);
	            return styleNode.sheet;
	        },
	        _removeSheet: function(sheet) {
	            var node = sheet.ownerNode;
	            node.parentNode.removeChild(node);
	        }
	    };
	
	    var exports = new Jss(document);
	    exports.forDocument = function(doc) {
	        return new Jss(doc);
	    };
	    return exports;
	})();
	
	typeof module !== 'undefined' && module.exports && (module.exports = jss); // CommonJS support

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)
	
	var path = __webpack_require__(25)
	
	
	// Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	// any number of objects can be passed into the function and will be merged into the first argument in order
	// returns obj1 (now mutated)
	var merge = exports.merge = function(obj1, obj2/*, moreObjects...*/){
	    return mergeInternal(arrayify(arguments), false)
	}
	
	// like merge, but traverses the whole object tree
	// the result is undefined for objects with circular references
	var deepMerge = exports.deepMerge = function(obj1, obj2/*, moreObjects...*/) {
	    return mergeInternal(arrayify(arguments), true)
	}
	
	// returns a new object where properties of b are merged onto a (a's properties may be overwritten)
	exports.objectConjunction = function(a, b) {
	    var objectCopy = {}
	    merge(objectCopy, a)
	    merge(objectCopy, b)
	    return objectCopy
	}
	
	function mergeInternal(objects, deep) {
	    var obj1 = objects[0]
	    var obj2 = objects[1]
	
	    for(var key in obj2){
	       if(Object.hasOwnProperty.call(obj2, key)) {
	            if(deep && obj1[key] instanceof Object && obj2[key] instanceof Object) {
	                mergeInternal([obj1[key], obj2[key]], true)
	            } else {
	                obj1[key] = obj2[key]
	            }
	       }
	    }
	
	    if(objects.length > 2) {
	        var newObjects = [obj1].concat(objects.slice(2))
	        return mergeInternal(newObjects, deep)
	    } else {
	        return obj1
	    }
	}
	
	function arrayify(a) {
	    return Array.prototype.slice.call(a, 0)
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	
	// creates a dom element optionally with a class and attributes
	 var node = module.exports.node = function(type, className, options) {
	    var elem = document.createElement(type)
	
	    if(options !== undefined) {
	        if(options.attr !== undefined) {
	            for(var attribute in options.attr) {
	                createAttribute(elem, attribute, options.attr[attribute])
	            }
	        }
	        if(options.textContent !== undefined) {
	            elem.textContent = options.textContent
	        }
	    }
	
	    if(className !== undefined)
	        elem.className = className
	
	    return elem
	}
	
	// convenience function for creating a div
	module.exports.div = function(className, options) {
	    return node('div', className, options)
	}
	
	// adds an attribute to a domNode
	var setAttribute = module.exports.setAttribute = function(/*[domNode,] type, value*/) {
	    if (arguments.length === 2) {
	        var domNode = this.domNode;
	        var type = arguments[0];
	        var value = arguments[1];
	    } else if (arguments.length === 3) {
	        var domNode = arguments[0];
	        var type = arguments[1];
	        var value = arguments[2];
	    } else {
	        throw new Error("This function expects arguments to be: [domNode,] type, value");
	    }
	    var attr = document.createAttribute(type)
	    attr.value = value
	    domNode.setAttributeNode(attr)
	}
	
	
	// sets the selection
	//
	// works for contenteditable elements
	exports.setSelection = function(node, start, end) {
	    // memoize
	    if (window.getSelection && document.createRange) {
	        exports.setSelection = function(containerEl, start, end) {
	            var charIndex = 0, range = document.createRange();
	            range.setStart(containerEl, 0);
	            range.collapse(true);
	            var nodeStack = [containerEl], node, foundStart = false, stop = false;
	
	            while (!stop && (node = nodeStack.pop())) {
	                if (node.nodeType == 3) {
	                    var hiddenCharacters = findHiddenCharacters(node, node.length)
	                    var nextCharIndex = charIndex + node.length - hiddenCharacters;
	
	                    if (!foundStart && start >= charIndex && start <= nextCharIndex) {
	                        var nodeIndex = start-charIndex
	                        var hiddenCharactersBeforeStart = findHiddenCharacters(node, nodeIndex)
	                        range.setStart(node, nodeIndex + hiddenCharactersBeforeStart);
	                        foundStart = true;
	                    }
	                    if (foundStart && end >= charIndex && end <= nextCharIndex) {
	                        var nodeIndex = end-charIndex
	                        var hiddenCharactersBeforeEnd = findHiddenCharacters(node, nodeIndex)
	                        range.setEnd(node, nodeIndex + hiddenCharactersBeforeEnd);
	                        stop = true;
	                    }
	                    charIndex = nextCharIndex;
	                } else {
	                    var i = node.childNodes.length;
	                    while (i--) {
	                        nodeStack.push(node.childNodes[i]);
	                    }
	                }
	            }
	
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        }
	    } else if (document.selection) {
	        exports.setSelection = function(containerEl, start, end) {
	            var textRange = document.body.createTextRange();
	            textRange.moveToElementText(containerEl);
	            textRange.collapse(true);
	            textRange.moveEnd("character", end);
	            textRange.moveStart("character", start);
	            textRange.select();
	        };
	    }
	
	    var findHiddenCharacters = function(node, beforeCaretIndex) {
	        var hiddenCharacters = 0
	        var lastCharWasWhiteSpace=true
	        for(var n=0; n-hiddenCharacters<beforeCaretIndex &&n<node.length; n++) {
	            if([' ','\n','\t','\r'].indexOf(node.textContent[n]) !== -1) {
	                if(lastCharWasWhiteSpace)
	                    hiddenCharacters++
	                else
	                    lastCharWasWhiteSpace = true
	            } else {
	                lastCharWasWhiteSpace = false
	            }
	        }
	
	        return hiddenCharacters
	    }
	
	    exports.setSelection(node, start, end)
	}
	
	// gets the character offsets of a selection within a particular dom node
	exports.getCaretOffset = function (node) {
	    // memoize
	    if(typeof window.getSelection != "undefined") {
	        exports.getCaretOffset = function (element) {
	            if (window.getSelection().type === "None" || window.getSelection().rangeCount === 0)
	                return 0;
	
	            var range = window.getSelection().getRangeAt(0);
	            var preCaretRange = range.cloneRange();
	            preCaretRange.selectNodeContents(element);
	            preCaretRange.setEnd(range.endContainer, range.endOffset);
	            return preCaretRange.toString().length;
	        }
	    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
	        exports.getCaretOffset = function (element) {
	            var textRange = document.selection.createRange();
	            var preCaretTextRange = document.body.createTextRange();
	            preCaretTextRange.moveToElementText(element);
	            preCaretTextRange.setEndPoint("EndToEnd", textRange);
	            return preCaretTextRange.text.length;
	        }
	    }
	
	    return exports.getCaretOffset(node);
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// note: this is  not intended to be used directly - only through Select and MultiSelect
	
	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	//var htmlEntities = require('he')
	
	// emits a 'change' event when its 'selected' value changes
	module.exports = proto(Block, function(superclass) {
	
	    // staic members
	
	    this.name = 'Option'
	
	
	    // instance members
	
	    this.init = function(label, value, text) {
	        this.domNode = document.createElement("option") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	        superclass.init.call(this) // superclass constructor
	
	        this.label = label
	
	        this.text = text
	        this.val = value
	    }
	
	    this.select = function(selected) {
	        this.domNode.selected = selected
	    }
	
	    Object.defineProperty(this, 'val', {
	        // returns the value of the Option
	        get: function() {
	            return this.attr('value')
	        },
	
	        // sets the value of the Option
	        set: function(value) {
	            if(this.parent !== undefined) {
	                if(this.parent.options[value] !== undefined) {
	                    throw new Error("Can't give an Option the same value as another in the Select or MultiSelect (value: '"+value+"')")
	                }
	
	                if(this.val !== null) {
	                    delete this.parent.options[this.val]
	                }
	
	                this.parent.options[value] = this
	            }
	
	            this.attr('value', value)
	
	        }
	    })
	
	
	    Object.defineProperty(this, 'selected', {
	        // returns whether or not the option is selected
	        get: function() {
	            return this.domNode.selected
	        },
	
	        // sets the selected state of the checkbox to the passed value (true for checked)
	        set: function(value) {
	            var booleanValue = value === true
	            if(this.selected === booleanValue) return false; // ignore if there's no change
	
	            if(this.parent !== undefined)
	                this.parent.prepareForValueChange([this.val])
	
	            this.setSelectedQuiet(booleanValue)
	
	            if(this.parent !== undefined)
	                this.parent.emit('change')
	        }
	    })
	
	    Object.defineProperty(this, 'text', {
	        get: function() {
	            return this.domNode.textContent
	        },
	
	        set: function(text) {
	            this.domNode.innerText = text // apparently textContent can't be set or something? unclear
	        }
	    })
	
	
	    // private
	
	    // does everything for setting the selected state except emit the parent's change event
	    this.setSelectedQuiet = function setOptionSelected(booleanValue) {
	        if(this.selected === booleanValue) return; // ignore if there's no change
	
	        this.domNode.selected = booleanValue
	        this.emit('change') // the browser has no listenable event that is triggered on change of the 'checked' property
	    }
	})

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	
	var RowlikeGenerator = __webpack_require__(24);
	
	module.exports = RowlikeGenerator('th', "Header")

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var RowlikeGenerator = __webpack_require__(24);
	
	module.exports = RowlikeGenerator('tr', "Row")

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	
	module.exports = proto(Block, function(superclass) {
	
		// static properties
	
		this.name = 'TableCell'
		
	
		// instance properties
	
		this.init = function(/*[label,] contents*/) {
	        if(arguments.length <= 1) {
	            var contents = arguments[0]
	        } else {
	            var label = arguments[0]
	            var contents = arguments[1]
	        }
	
	        this.domNode = document.createElement("td") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
			superclass.init.call(this) // superclass constructor
			this.label = label
	
	        if(contents instanceof Block) {
				this.add(contents)
			} else if(contents !== undefined) {
	            this.domNode.textContent = contents
	        }
		}
	
		this.colspan = function(cols) {
			this.attr('colspan',cols);
		}
	});


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];
	
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/
	
	var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
	function proto() {
	    var args = arguments // minifiable variables
	
	    if(args.length == 1) {
	        var parent = {}
	        var prototypeBuilder = args[0]
	
	    } else { // length == 2
	        var parent = args[0]
	        var prototypeBuilder = args[1]
	    }
	
	    // special handling for Error objects
	    var namePointer = {}
	    if([Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].indexOf(parent) !== -1) {
	        parent = normalizeErrorObject(parent, namePointer)
	    }
	
	    // set up the parent into the prototype chain if a parent is passed
	    var parentIsFunction = typeof(parent) === "function"
	    if(parentIsFunction) {
	        prototypeBuilder[prototypeName] = parent[prototypeName]
	    } else {
	        prototypeBuilder[prototypeName] = parent
	    }
	
	    // the prototype that will be used to make instances
	    var prototype = new prototypeBuilder(parent)
	    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype
	    namePointer.name = prototype.name
	
	    // if there's no init, assume its inheriting a non-proto class, so default to applying the superclass's constructor.
	    if(!prototype[init] && parentIsFunction) {
	        prototype[init] = function() {
	            parent.apply(this, arguments)
	        }
	    }
	
	    // constructor for empty object which will be populated via the constructor
	    var F = function() {}
	        F[prototypeName] = prototype    // set the prototype for created instances
	
	    function ProtoObjectFactory() {     // result object factory
	        var x = new F()                 // empty object
	
	        if(prototype[init]) {
	            var result = prototype[init].apply(x, arguments)    // populate object via the constructor
	            if(result === proto[protoUndefined])
	                return undefined
	            else if(result !== undefined)
	                return result
	            else
	                return x
	        } else {
	            return x
	        }
	    }
	
	    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
	    for(var n in prototype) {
	        addProperty(ProtoObjectFactory, prototype, n)
	    }
	
	    // add properties from parent that don't exist in the static class object yet (to get thing in like
	    for(var n in parent) {
	        if(Object.hasOwnProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
	            addProperty(ProtoObjectFactory, parent, n)
	        }
	    }
	
	    ProtoObjectFactory[prototypeName] = prototype  // set the prototype on the object factory
	
	    return ProtoObjectFactory;
	}
	
	proto[protoUndefined] = {} // a special marker for when you want to return undefined from a constructor
	
	module.exports = proto
	
	function normalizeErrorObject(ErrorObject, namePointer) {
	    function NormalizedError() {
	        var tmp = new ErrorObject(arguments[0])
	        tmp.name = namePointer.name
	
	        this.message = tmp.message
	        if(Object.defineProperty) {
	            /*this.stack = */Object.defineProperty(this, 'stack', { // getter for more optimizy goodness
	                get: function() {
	                    return tmp.stack
	                }
	            })
	        } else {
	            this.stack = tmp.stack
	        }
	
	        return this
	    }
	        var IntermediateInheritor = function() {}
	            IntermediateInheritor.prototype = ErrorObject.prototype
	        NormalizedError.prototype = new IntermediateInheritor()
	    return NormalizedError
	}
	
	function addProperty(factoryObject, prototype, property) {
	    try {
	        var info = Object.getOwnPropertyDescriptor(prototype, property)
	        if(info.get !== undefined || info.get !== undefined && Object.defineProperty !== undefined) {
	            Object.defineProperty(factoryObject, property, info)
	        } else {
	            factoryObject[property] = prototype[property]
	        }
	    } catch(e) {
	        // do nothing, if a property (like `name`) can't be set, just ignore it
	    }
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * HashMap - HashMap Class for JavaScript
	 * @author Ariel Flesler <aflesler@gmail.com>
	 * @version 2.0.0
	 * Homepage: https://github.com/flesler/hashmap
	 */
	
	(function (factory) {
		if (true) {
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			// Node js environment
			exports.HashMap = factory();
		} else {
			// Browser globals (this is window)
			this.HashMap = factory();
		}
	}(function () {
		
		function HashMap(other) {
			this.clear();
			switch (arguments.length) {
				case 0: break;
				case 1: this.copy(other); break;
				default: multi(this, arguments); break;
			}
		}
	
		var proto = HashMap.prototype = {
			constructor:HashMap,
	
			get:function(key) {
				var data = this._data[this.hash(key)];
				return data && data[1];
			},
			
			set:function(key, value) {
				// Store original key as well (for iteration)
				this._data[this.hash(key)] = [key, value];
			},
	
			multi:function() {
				multi(this, arguments);
			},
	
			copy:function(other) {
				for (var key in other._data) {
					this._data[key] = other._data[key];
				}
			},
			
			has:function(key) {
				return this.hash(key) in this._data;
			},
			
			search:function(value) {
				for (var key in this._data) {
					if (this._data[key][1] === value) {
						return this._data[key][0];
					}
				}
	
				return null;
			},
			
			remove:function(key) {
				delete this._data[this.hash(key)];
			},
	
			type:function(key) {
				var str = Object.prototype.toString.call(key);
				var type = str.slice(8, -1).toLowerCase();
				// Some browsers yield DOMWindow for null and undefined, works fine on Node
				if (type === 'domwindow' && !key) {
					return key + '';
				}
				return type;
			},
	
			keys:function() {
				var keys = [];
				this.forEach(function(value, key) { keys.push(key); });
				return keys;
			},
	
			values:function() {
				var values = [];
				this.forEach(function(value) { values.push(value); });
				return values;
			},
	
			count:function() {
				return this.keys().length;
			},
	
			clear:function() {
				// TODO: Would Object.create(null) make any difference
				this._data = {};
			},
	
			clone:function() {
				return new HashMap(this);
			},
	
			hash:function(key) {
				switch (this.type(key)) {
					case 'undefined':
					case 'null':
					case 'boolean':
					case 'number':
					case 'regexp':
						return key + '';
	
					case 'date':
						return ':' + key.getTime();
	
					case 'string':
						return '"' + key;
	
					case 'array':
						var hashes = [];
						for (var i = 0; i < key.length; i++)
							hashes[i] = this.hash(key[i]);
						return '[' + hashes.join('|');
	
					case 'object':
					default:
						// TODO: Don't use expandos when Object.defineProperty is not available?
						if (!key._hmuid_) {
							key._hmuid_ = ++HashMap.uid;
							hide(key, '_hmuid_');
						}
	
						return '{' + key._hmuid_;
				}
			},
	
			forEach:function(func) {
				for (var key in this._data) {
					var data = this._data[key];
					func.call(this, data[1], data[0]);
				}
			}
		};
	
		HashMap.uid = 0;
	
		//- Automatically add chaining to some methods
	
		for (var method in proto) {
			// Skip constructor, valueOf, toString and any other built-in method
			if (method === 'constructor' || !proto.hasOwnProperty(method)) {
				continue;
			}
			var fn = proto[method];
			if (fn.toString().indexOf('return ') === -1) {
				proto[method] = chain(fn);
			}
		}
	
		//- Utils
	
		function multi(map, args) {
			for (var i = 0; i < args.length; i += 2) {
				map.set(args[i], args[i+1])
			}
		}
	
		function chain(fn) {
			return function() {
				fn.apply(this, arguments);
				return this;
			};
		}
	
		function hide(obj, prop) {
			// Make non iterable if supported
			if (Object.defineProperty) {
				Object.defineProperty(obj, prop, {enumerable:false});
			}
		};
	
		return HashMap;
	
	}));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// resolves varargs variable into more usable form
	// args - should be a function arguments variable
	// returns a javascript Array object of arguments that doesn't count trailing undefined values in the length
	module.exports = function(theArguments) {
	    var args = Array.prototype.slice.call(theArguments, 0)
	
	    var count = 0;
	    for(var n=args.length-1; n>=0; n--) {
	        if(args[n] === undefined)
	            count++
	        else
	            break
	    }
	    args.splice(args.length-count, count)
	    return args
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var proto = __webpack_require__(20)
	var EventEmitter = __webpack_require__(19).EventEmitter
	var utils = __webpack_require__(26)
	
	
	// emits the event:
	    // change - the event data is an object of one of the following forms:
	        // {id:_, type: 'set', property: propertyList}
	        // {id:_, type: 'added', property: propertyList, index:_, count: numberOfElementsAdded}
	        // {id:_, type: 'removed', property: propertyList, index:_, values: removedValues}
	var Observe = module.exports = proto(EventEmitter, function() {
	
	    // static members
	
	    this.init = function(obj) {
	        this.subject = obj
	
	        this.setMaxListeners(1000)
	    }
	
	    // instance members
	
	    // gets an element or member of the subject and returns another Observee
	    // changes to the returned Observee will be emitted by its parent as well
	    this.get = function(property) {
	        return ObserveeChild(this, parsePropertyList(property))
	    }
	
	    // sets a value on the subject
	    // property - either an array of members to select, or a string where properties to select are separated by dots
	    // value - the value to set
	    this.set = function(property, value) {
	        setInternal(this, parsePropertyList(property), value, {})
	    }
	
	    // pushes a value onto a list
	    this.push = function(/*value...*/) {
	        pushInternal(this, [], arguments, {})
	    }
	
	
	    // index is the index to remove/insert at
	    // countToRemove is the number to remove
	    // elementsToAdd is a list of elements to add
	    this.splice = function(/*index, countToRemove[, elementsToAdd]*/) {
	        return spliceInternal(this, [], arguments, {})
	    }
	
	    // use this instead of concat for mutation behavior
	    this.append = function(arrayToAppend) {
	        appendInternal(this, [], arguments, {})
	    }
	
	    this.id = function(id) {
	        return ObserveeChild(this, [], {id: id})
	        //return idFunction(this, [], id)
	    }
	
	    // For the returned object, any property added via set, push, splice, or append joins an internal observee together with this observee, so that
	    //      the internal observee and the containing observee will both send 'change' events appropriately
	    // collapse - (default: false) if true, any property added will be set to the subject of the value added (so that value won't be an observee anymore
	        // note: only use collapse:true if the observees you're unioning isn't actually an object that inherits from an observee - any instance methods on the observee that come from child classes won't be accessible anymore
	        // e.g. var x = observe({a:5})
	        //      var b = observe({})
	        //      x.subject.a === 5    ;; true
	        //      b.union(true).set('x', x)
	        //      b.subject.x.a === 5            ;; true
	        //      b.subject.x.subject.a === 5    ;; false
	    this.union = function(collapse) {
	        if(collapse === undefined) collapse = false
	        return ObserveeChild(this, [], {union: collapse})
	    }
	
	
	    /* pause and unpause may cause weird affects in certain cases (e.g. if you remove an element at index 4 and *then* add an element at index 2)
	    // pause sending events (for when you want to do a lot of things to an object)
	    this.pause = function() {
	        this.paused = true
	    }
	    this.unpause = function() {
	        this.paused = undefined
	        sendEvent(this)
	    }*/
	})
	
	
	function parsePropertyList(property) {
	    if(!(property instanceof Array)) {
	        property = property.toString().split('.')
	    }
	
	    return property
	}
	
	function getPropertyPointer(subject, propertyList) {
	    var current = subject
	    for(var n=0; n<propertyList.length-1; n++) {
	        current = current[propertyList[n]]
	    }
	
	    return {obj: current, key:propertyList[n]}
	}
	
	var getPropertyValue = module.exports.getPropertyValue = function(subject, property) {
	    var pointer = getPropertyPointer(subject, property)
	    if(pointer.key !== undefined) {
	        return pointer.obj[pointer.key]
	    } else {
	        return pointer.obj
	    }
	}
	
	// private
	
	// options can have the properties:
	    // union - if true, any value set, pushed, appended, or spliced onto the observee is unioned
	var ObserveeChild = proto(EventEmitter, function() {
	
	    this.init = function(parent, propertyList, options) {
	        if(options === undefined) this.options = {}
	        else                      this.options = options
	
	        if(parent._observeeParent !== undefined)
	            this._observeeParent = parent._observeeParent
	        else
	            this._observeeParent = parent
	
	        this.property = propertyList
	        this.subject = getPropertyValue(parent.subject, propertyList)
	
	        var that = this
	        parent.on('change', function(change) {
	            var answers = changeQuestions(that.property, change)
	
	            if(answers.isWithin ) {
	                that.emit('change', {type:change.type, property: change.property.slice(that.property.length), index:change.index, count:change.count, removed: change.removed})
	            } else if(answers.couldRelocate) {
	                if(change.type === 'removed') {
	                    var relevantIndex = that.property[change.property.length]
	                    var removedIndexesAreBeforeIndexOfObserveeChild = change.index + change.removed.length - 1 < relevantIndex
	
	                    if(removedIndexesAreBeforeIndexOfObserveeChild) {
	                        that.property[change.property.length] = relevantIndex - change.removed.length // change the propertyList to match the new index
	                    }
	                } else if(change.type === 'added') {
	                    var relevantIndex = that.property[change.property.length]
	                    if(change.index < relevantIndex) {
	                        that.property[change.property.length] = relevantIndex + change.count // change the propertyList to match the new index
	                    }
	                }
	            }
	        })
	    }
	
	    this.get = function(property) {
	        return this._observeeParent.get(this.property.concat(parsePropertyList(property)))
	    }
	
	    this.set = function(property, value) {
	        setInternal(this._observeeParent, this.property.concat(parsePropertyList(property)), value, this.options)
	    }
	
	    this.push = function(/*values...*/) {
	        pushInternal(this._observeeParent, this.property, arguments, this.options)
	    }
	
	    this.splice = function(index, countToRemove/*[, elementsToAdd....]*/) {
	        spliceInternal(this._observeeParent, this.property, arguments, this.options)
	    }
	
	    this.append = function(/*[property,] arrayToAppend*/) {
	        appendInternal(this._observeeParent, this.property, arguments, this.options)
	    }
	
	    this.id = function(id) {
	        return ObserveeChild(this, this.property, utils.merge({}, this.options, {id: id}))
	        //return idFunction(this._observeeParent, this.property, id)
	    }
	
	    this.union = function(collapse) {
	        if(collapse === undefined) collapse = false
	        return ObserveeChild(this, [], utils.merge({}, this.options, {union: collapse}))
	    }
	
	})
	
	     /*
	function idFunction(that, propertyList, id) {
	    var result = {
	        set: function(property, value) {
	            var fullPropertyList = propertyList.concat(parsePropertyList(property))
	            setInternal(that, fullPropertyList, value, id)
	        },
	        push: function() {
	            pushInternal(that, propertyList, arguments, id)
	        },
	        splice: function() {
	            spliceInternal(that, propertyList, arguments, id)
	        },
	        append: function() {
	            appendInternal(that, propertyList, arguments, id)
	        },
	        get: function() {
	
	        }
	    }
	}
	*/
	
	// that - the Observee object
	function setInternal(that, propertyList, value, options) {
	    var pointer = getPropertyPointer(that.subject, propertyList)
	
	    var internalObservee = value
	    if(options.union === true) {
	        value = value.subject
	    }
	
	    pointer.obj[pointer.key] = value
	
	    var event = {type: 'set', property: propertyList}
	    if(options.id !== undefined) event.id = options.id
	    that.emit('change',event)
	
	    if(options.union !== undefined)
	        unionizeEvents(that, internalObservee, propertyList, options.union)
	}
	
	function pushInternal(that, propertyList, args, options) {
	    var array = getPropertyValue(that.subject, propertyList)
	    var originalLength = array.length
	    array.push.apply(array, args)
	
	    var internalObservees = unionizeList(array, originalLength, args.length, options.union)
	
	    var event = {type: 'added', property: propertyList, index: originalLength, count: 1}
	    if(options.id !== undefined) event.id = options.id
	    that.emit('change', event)
	
	    unionizeListEvents(that, internalObservees, propertyList, options.union)
	}
	
	function spliceInternal(that, propertyList, args, options) {
	    var index = args[0]
	    var countToRemove = args[1]
	
	    var array = getPropertyValue(that.subject, propertyList)
	    var result = array.splice.apply(array, args)
	
	    if(countToRemove > 0) {
	        var event = {type: 'removed', property: propertyList, index: index, removed: result}
	        if(options.id !== undefined) event.id = options.id
	        that.emit('change', event)
	    }
	    if(args.length > 2) {
	        var event = {type: 'added', property: propertyList, index: index, count: args.length-2}
	
	        var internalObservees = unionizeList(array, index, event.count, options.union)
	
	        if(options.id !== undefined) event.id = options.id
	        that.emit('change', event)
	
	        unionizeListEvents(that, internalObservees, propertyList, options.union)
	    }
	
	    return result
	}
	
	// note: I'm not using splice to do this as an optimization (because otherwise the property list would have to be parsed twice and the value gotten twice) - maybe this optimization wasn't worth it but its already done
	function appendInternal(that, propertyList, args, options) {
	    var arrayToAppend = args[0]
	    if(arrayToAppend.length === 0) return; //nothing to do
	
	    var array = getPropertyValue(that.subject, propertyList)
	    var originalLength = array.length
	
	    var spliceArgs = [originalLength, 0]
	    spliceArgs = spliceArgs.concat(arrayToAppend)
	    var oldLength = array.length
	    array.splice.apply(array, spliceArgs)
	
	    var internalObservees = unionizeList(array, oldLength, array.length, options.union)
	
	    var event = {type: 'added', property: propertyList, index: originalLength, count: arrayToAppend.length}
	    if(options.id !== undefined) event.id = options.id
	    that.emit('change', event)
	
	    unionizeListEvents(that, internalObservees, propertyList, options.union)
	}
	
	// sets a slice of elements to their subjects and
	// returns the original observee objects along with their indexes
	function unionizeList(array, start, count, union) {
	    var internalObservees = [] // list of observees and their property path
	    if(union !== undefined) {
	        var afterEnd = start+count
	        for(var n=start; n<afterEnd; n++) {
	            internalObservees.push({obj: array[n], index: n})
	            if(union === true)
	                array[n] = array[n].subject
	        }
	    }
	
	    return internalObservees
	}
	
	// runs unionizeEvents for elements in a list
	// internalObservees should be the result from `unionizeList`
	function unionizeListEvents(that, internalObservees, propertyList, collapse) {
	    for(var n=0; n<internalObservees.length; n++) {
	        unionizeEvents(that, internalObservees[n].obj, propertyList.concat(internalObservees[n].index), collapse)
	    }
	}
	
	
	// sets up the union change events for an observee with one of its inner properties
	// parameters:
	    // that - the container observee
	    // innerObservee - the contained observee
	    // propertyList - the propertyList to unionize
	    // collapse - the union option (true for collapse)
	function unionizeEvents(that, innerObservee, propertyList, collapse) {
	    var propertyListDepth = propertyList.length
	
	    if(innerObservee.on === undefined || innerObservee.emit === undefined || innerObservee.removeListener === undefined || innerObservee.set === undefined) {
	        throw new Error("Attempting to union a value that isn't an observee")
	    }
	
	    var innerChangeHandler, containerChangeHandler
	    var ignorableContainerEvents = [], ignorableInnerEvents = []
	    innerObservee.on('change', innerChangeHandler = function(change) {
	        if(ignorableInnerEvents.indexOf(change) === -1) {        // don't run this for events generated by the union event handlers
	            if(collapse) {
	                var property = propertyList.concat(change.property)
	            } else {
	                var property = propertyList.concat(['subject']).concat(change.property)
	            }
	
	            var containerChange = utils.merge({}, change, {property: property})
	            ignorableContainerEvents.push(containerChange)
	            that.emit('change', containerChange)
	        }
	    })
	    that.on('change', containerChangeHandler = function(change) {
	        var changedPropertyDepth = change.property.length
	
	        var answers = changeQuestions(propertyList, change)
	        var changeIsWithinInnerProperty = answers.isWithin
	        var changeCouldRelocateInnerProperty = answers.couldRelocate
	
	        if(changeIsWithinInnerProperty && ignorableContainerEvents.indexOf(change) === -1) {   // don't run this for events generated by the union event handlers
	            if(collapse) {
	                var property = change.property.slice(propertyListDepth)
	            } else {
	                var property = change.property.slice(propertyListDepth+1) // +1 for the 'subject'
	            }
	
	            var innerObserveeEvent = utils.merge({}, change, {property: property})
	            ignorableInnerEvents.push(innerObserveeEvent)
	            innerObservee.emit('change', innerObserveeEvent)
	        } else if(changeCouldRelocateInnerProperty) {
	            if(change.type === 'set' /*&& changedPropertyDepth <= propertyListDepth  - this part already done above*/) {
	                removeUnion()
	            } else if(change.type === 'removed') {
	                var relevantIndex = propertyList[change.property.length]
	                var removedIndexesContainsIndexOfInnerObservee = change.index <= relevantIndex && relevantIndex <= change.index + change.removed.length - 1
	                var removedIndexesAreBeforeIndexOfInnerObservee = change.index + change.removed.length - 1 < relevantIndex && relevantIndex
	
	                if(removedIndexesContainsIndexOfInnerObservee && changedPropertyDepth <= propertyListDepth+1) {
	                    removeUnion()
	                } else if(removedIndexesAreBeforeIndexOfInnerObservee) {
	                    propertyList[change.property.length] = relevantIndex - change.removed.length // change the propertyList to match the new index
	                }
	            } else if(change.type === 'added') {
	                var relevantIndex = propertyList[change.property.length]
	                if(change.index < relevantIndex) {
	                    propertyList[change.property.length] = relevantIndex + change.count // change the propertyList to match the new index
	                }
	            }
	        }
	    })
	
	    var removeUnion = function() {
	        innerObservee.removeListener('change', innerChangeHandler)
	        that.removeListener('change', containerChangeHandler)
	    }
	}
	
	
	// answers certain questions about a change compared to a property list
	// returns an object like: {
	    // isWithin: _,           // true if changeIsWithinInnerProperty
	    // couldRelocate: _       // true if changeCouldRelocateInnerProperty or if innerProperty might be removed
	// }
	function changeQuestions(propertyList, change) {
	    var propertyListDepth = propertyList.length
	
	    var changeIsWithinInnerProperty = true // assume true until proven otherwise
	    var changeCouldRelocateInnerProperty = true // assume true until prove otherwise
	    for(var n=0; n<propertyListDepth; n++) {
	        if(change.property[n] !== propertyList[n]) {
	            changeIsWithinInnerProperty = false
	            if(n<change.property.length) {
	                changeCouldRelocateInnerProperty = false
	            }
	        }
	    }
	
	    if(change.property.length <= propertyListDepth) {
	        changeIsWithinInnerProperty = false
	    } else {
	        changeCouldRelocateInnerProperty = false
	    }
	
	    return {couldRelocate: changeCouldRelocateInnerProperty, isWithin: changeIsWithinInnerProperty}
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(1)
	var proto = __webpack_require__(20)
	var Cell = __webpack_require__(18);
	
	// generates either a Header or a Row, depending on what you pass in
	// elementType should either be "tr" or "th
	// name should either be "Header" or "Row
	module.exports = function(elementType, name) {
	    return proto(Block, function(superclass) {
	
	        // static properties
	
	        this.name = name
	
	        // todo: add default styling of display: table-row
	
	
	        // instance properties
	
	        this.init = function(/*[label,] rowInit*/) {
	            if(arguments[0] instanceof Array) {
	                var rowInit = arguments[0]
	            } else {
	                var label = arguments[0]
	                var rowInit = arguments[1]
	            }
	
	            this.domNode = document.createElement(elementType) // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
	            superclass.init.call(this) // superclass constructor
	            this.label = label
	
	            if(rowInit !== undefined) {
	                for(var n=0; n<rowInit.length; n++) {
	                    this.cell(rowInit[n])
	                }
	            }
	        }
	
	        this.cell = function(/*[label,] contents*/) {
	            var cell = Cell.apply(undefined, arguments);
	            this.add(cell);
	            return cell;
	        }
	    })
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)
	
	var path = __webpack_require__(25)
	
	
	// Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	// any number of objects can be passed into the function and will be merged into the first argument in order
	// returns obj1 (now mutated)
	var merge = exports.merge = function(obj1, obj2/*, moreObjects...*/){
	    return mergeInternal(arrayify(arguments), false)
	}
	
	// like merge, but traverses the whole object tree
	// the result is undefined for objects with circular references
	var deepMerge = exports.deepMerge = function(obj1, obj2/*, moreObjects...*/) {
	    return mergeInternal(arrayify(arguments), true)
	}
	
	function mergeInternal(objects, deep) {
	    var obj1 = objects[0]
	    var obj2 = objects[1]
	
	    for(var key in obj2){
	       if(Object.hasOwnProperty.call(obj2, key)) {
	            if(deep && obj1[key] instanceof Object && obj2[key] instanceof Object) {
	                mergeInternal([obj1[key], obj2[key]], true)
	            } else {
	                obj1[key] = obj2[key]
	            }
	       }
	    }
	
	    if(objects.length > 2) {
	        var newObjects = [obj1].concat(objects.slice(2))
	        return mergeInternal(newObjects, deep)
	    } else {
	        return obj1
	    }
	}
	
	function arrayify(a) {
	    return Array.prototype.slice.call(a, 0)
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canMutationObserver = typeof window !== 'undefined'
	    && window.MutationObserver;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;
	
	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }
	
	    var queue = [];
	
	    if (canMutationObserver) {
	        var hiddenDiv = document.createElement("div");
	        var observer = new MutationObserver(function () {
	            var queueList = queue.slice();
	            queue.length = 0;
	            queueList.forEach(function (fn) {
	                fn();
	            });
	        });
	
	        observer.observe(hiddenDiv, { attributes: true });
	
	        return function nextTick(fn) {
	            if (!queue.length) {
	                hiddenDiv.setAttribute('yes', 'no');
	            }
	            queue.push(fn);
	        };
	    }
	
	    if (canPost) {
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);
	
	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }
	
	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();
	
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ }
/******/ ])
});

//# sourceMappingURL=blocks.umd.js.map