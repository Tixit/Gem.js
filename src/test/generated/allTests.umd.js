(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["allTests"] = factory();
	else
		root["allTests"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 49);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/proto/proto.js ***!
  \********************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var noop = function() {}

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {init: noop}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    var namePointer = {}    // name used only for Error Objects
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

    var constructorName = prototype.name?prototype.name:''
    if(prototype[init] === undefined || prototype[init] === noop) {
        var ProtoObjectFactory = new Function('F',
            "return function " + constructorName + "(){" +
                "return new F()" +
            "}"
        )(F)
    } else {
        // dynamically creating this function cause there's no other way to dynamically name a function
        var ProtoObjectFactory = new Function('F','i','u','n', // shitty variables cause minifiers aren't gonna minify my function string here
            "return function " + constructorName + "(){ " +
                "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
                "if(r===n)\n" +
                    "return x\n" +
                "else if(r===u)\n" +
                    "return n\n" +
                "else\n" +
                    "return r\n" +
            "}"
        )(F, prototype[init], proto[protoUndefined]) // note that n is undefined
    }

    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        addProperty(ProtoObjectFactory, prototype, n)
    }

    // add properties from parent that don't exist in the static class object yet
    for(var n in parent) {
        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
            addProperty(ProtoObjectFactory, parent, n)
        }
    }

    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
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
                },
                configurable: true // so you can change it if you want
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

/***/ }),
/* 1 */
/*!******************************!*\
  !*** ../node_modules/Gem.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitterB = __webpack_require__(/*! emitter-b */ 97)
var proto = __webpack_require__(/*! proto */ 0);
var trimArguments = __webpack_require__(/*! trimArguments */ 24)
var observe = __webpack_require__(/*! observe */ 25)

var utils = __webpack_require__(/*! ./utils */ 19)
var domUtils = __webpack_require__(/*! ./domUtils */ 3)
var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 34)

var devFlag = __webpack_require__(/*! devFlag */ 99)

var Style = __webpack_require__(/*! ./Style */ 5)
Style.isDev = function() {return devFlag.dev}

var components = {};

var setOfBrowserEvents = utils.arrayToMap([
    'abort','afterprint','animationend','animationiteration','animationstart','audioprocess','beforeprint','beforeunload',
    'beginEvent','blocked','blur','cached','canplay','canplaythrough','change','chargingchange','chargingtimechange',
    'checking','click','close','compassneedscalibration','complete','compositionend','compositionstart','compositionupdate','contextmenu',
    'copy','cut','dblclick','decivelight','devicemotion','deviceorientation','deviceproximity','dischargingtimechange','DOMContentLoaded',
    'downloading','drag','dragend','dragenter','dragleave','dragover','dragstart','drop','durationchange','emptied','ended','endEvent',
    'error','focus','focusin','focusout','fullscreenchange','fullscreenerror','gamepadconnected','gamepaddisconnected','hashchange',
    'input','invalid','keydown','keypress','keyup','languagechange','levelchange','load','loadeddata','loadedmetadata','loadend',
    'loadstart','message','mousedown','mouseenter','mouseleave','mousemove','mouseout','mouseover','mouseup','noupdate','obsolete',
    'offline','online','open','orientationchange','pagehide','pageshow','paste','pause','pointerlockchange','pointerlockerror','play',
    'playing','popstate','progress','ratechange','readystatechange','repeatEvent','reset','resize','scroll','seeked','seeking','select',
    'show','stalled','storage','submit','success','suspend','SVGAbort','SVGError','SVGLoad','SVGResize','SVGScroll','SVGUnload','SVGZoom',
    'timeout','timeupdate','touchcancel','touchend','touchenter','touchleave','touchmove','touchstart','transitionend','unload',
    'updateready','upgradeneeded','userproximity','versionchange','visibilitychange','volumechange','waiting','wheel'
])

// events:
    // newParent - emits this when a component gets a new parent
    // parentRemoved - emits this when a component is detached from its parent
var Gem = module.exports = proto(EventEmitterB,function(superclass) {

    // static properties

    this.name = 'Gem'

    // constructor
	this.init = function() {
        var that = this

        if(this.name === 'Gem') {
            throw new Error("The 'name' property is required for Gem (it must be set to something that isn't 'Gem')")
        }

        superclass.init.call(this)

        this.attached = false
        if(this.children === undefined) this.children = [] // allow inheriting objects to create their own children array before calling this constructor
        this.state = observe({})
        this.parent = undefined;
        this._styleSetupInfo = []
        this._nativePseudoclassMap = {}

		if (this.id !== undefined) {
			components[this.id] = this;
		}

        if(this.domNode === undefined) {
            this.domNode = domUtils.div()
        }
                
        // quiet.focus property
        this.quiet = {}
        setupFocusProperty(this, true)

        this.build.apply(this, arguments)

        //if(devFlag.dev) {
            this.attr('gem', this.name)
        //}


        this.domNode.className += ' '+Style.defaultClassName // add the default class
        /*if(this._style === undefined) { // if a style wasn't set by this.build
            this.style = undefined // initialize style to its gem or inherited default
        }*/

        // set up dom event handlers
        var ifonHandlers={}
        that.ifon(function(event) {
            ifOnBrowserEvent(that, that, event, ifonHandlers)
        })
        that.ifoff(function(event) {
            ifOffBrowserEvent(that, event, ifonHandlers)
        })

        this.ifonCaptureHandlers={}, this.ifonCaptureHandlerCounts={}
        this.captureEmitter = new EventEmitterB()
	}

    // sub-constructor - called by the constructor
    // can be overridden as a constructor that requires less boilerplate
    this.build = function() {}


	// instance properties


	this.domNode;
    this.label;        // a static label that can be used for styling
    this.excludeDomEvents;
    this.children;     // a list of child components that are a part of a Gem object (these are used so Styles can be propogated down to child components)


    Object.defineProperty(this, 'label', {
        get: function() {
            return this._label
        }, set: function(v) {
            if(this._label === undefined) {
                this._label = v

                //if(devFlag.dev) {
                    this.attr('label', this._label)
                //}
            } else {
                throw new Error("A Gem's label can only be set once (was already set to: "+this._label+")")
            }
        }
    })

    // adds elements to the components main domNode
    // arguments can be one of the following:
        // component, component, component, ...
        // listOfGems
    this.add = function() {
        this.addAt.apply(this, [this.domNode.children.length].concat(trimArguments(arguments)))
	}

    // adds nodes at a particular index
    // nodes can be one of the following:
        // component, component, component, ...
        // listOfGems
    // todo: look into using document fragments to speed this up when multiple nodes are being added
    this.addAt = function(index/*, nodes...*/) {
        var nodes = normalizeAddAtArguments.apply(this, arguments)

        for (var i=0;i<nodes.length;i++) {
			var node = nodes[i];

            // remove the node from its current parent if necessary
            if(node.parent !== undefined) {
                throw new Error('Node at index '+i+' already has a parent. Remove the node from its parent before adding it somewhere else.')
            }
            if(!isGem(node)) {
                throw new Error("node is not a Gem")
            }
                                     
            this.children.splice(index+i, 0, node)
            
            var beforeChild = this.children[1+i+index]
            if(beforeChild === undefined) {
                this.domNode.appendChild(node.domNode)
            } else {
                this.domNode.insertBefore(node.domNode, beforeChild.domNode)
            }
            

            node.parent = this;
            node.emit('newParent')
		}

        if(this.attached) {
            for (var i=0;i<nodes.length;i++) {
                var node = nodes[i]
                blockStyleUtils.setAttachStatus(node,true) // must be done before setting the style (unsure why at the moment)
                node.style = node._style // rerender its style
            }
        }
    }

	// add a list of nodes before a particular node
    // if beforeChild is undefined, this will append the given nodes
    // arguments can be one of the following:
        // component, component, component, ...
        // listOfGems
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
            if(this.attached) {
                c.emit("detach")
            }
        }
    }

    // sets or gets an attribute on the components domNode
    // parameter sets:
    // if one argument is passed, the attribute's value is returned (if there is no attribute, undefined is returned)
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
                var attribute = this.domNode.getAttribute(arguments[0])
                if(attribute === null) {
                    return undefined // screw null
                } else {
                    return attribute
                }
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

    Object.defineProperty(this, 'visible', {
        // returns true if the element is visible
        get: function() {
            return this.domNode.style.display !== 'none';

        // sets whether or not the element is visible
        }, set: function(setToVisible) {
            if(setToVisible) {
                if (this._displayStyle !== undefined) {
                    this.domNode.style.display = this._displayStyle // set back to its previous inline style
                    this._displayStyle = undefined
                } else {
                    this.domNode.style.display = ''
                }
            } else {
                if(this.domNode.style.display !== '' && this.domNode.style.display !== 'none') { // domNode has inline style
                    this._displayStyle = this.domNode.style.display
                }

                this.domNode.style.display = 'none'
            }
        }
    })

    // focus property
    setupFocusProperty(this, false)

    Object.defineProperty(this, 'style', {
        get: function() {
            return this._style

        // sets the style, replacing one if one already exists
        }, set: function(style) {
            // get active style
                // mix the gem-default style with ..
                // .. the current style
                // .. style returned by the $state of current style
                // .. $$pseudoclasses of current + $state styles

            if(style === undefined || blockStyleUtils.isStyleObject(style)) {
                this._style = style
            } else {
                this._style = Style(style)
            }

            if(this.attached) {
                var newStyle = getStyle(this)  // must be called after setting _style
                var defaultStyle = this.getDefaultStyle()

                var newCurrentStyle = blockStyleUtils.mixStyles(defaultStyle, newStyle)
                blockStyleUtils.setCurrentStyle(this, newCurrentStyle, defaultStyle)
            }
        }
    })

    Object.defineProperty(this, 'selectionRange', {
        // returns the visible character selection range inside the element
        // returns an array like [offsetStart, offsetEnd]
        get: function() {
            return domUtils.getSelectionRange(this.domNode)

        // sets the visible character selection range
        }, set: function(selection) {
            domUtils.setSelectionRange(this.domNode, selection[0], selection[1])
        }
    })

    this.attach = function(domNode) {
        if(domNode !== undefined)
            attach(domNode, this)
        else
            attach(this)
    }
    this.attachBefore = function(domNode) {
        if(domNode !== undefined)
            attachInternal([domNode,this], true)
        else
            attachInternal([this], true)
    }
    this.detach = function(domNode) {
        if(domNode !== undefined)
            detach(domNode, this)
        else
            detach(this)
    }

    this.onCapture = function(event, handler) {
        if(!(event in this.ifonCaptureHandlers)) {
            ifOnBrowserEvent(this, this.captureEmitter, event, this.ifonCaptureHandlers, true)
        }

        this.ifonCaptureHandlerCounts[event]++
        this.captureEmitter.on(event, handler)
    }
    this.offCapture = function(event, handler) {
        this.ifonCaptureHandlerCounts[event]--
        this.captureEmitter.off(event, handler)
        if(this.ifonCaptureHandlerCounts[event] === 0) {
            ifoffBrowserEvent(this, event, this.ifonCaptureHandlers, true)
        }
    }

    this.proxy = function(emitter, options) {
        if(options === undefined) options = {except:[]}
        if(options.except !== undefined) {
            options.except = options.except.concat(['newParent','parentRemoved'])
        }

        return superclass.proxy.apply(this,[emitter,options])
    }


	// private instance variables/functions

    this.computedStyleMap;  // a map of style objects computed from the Styles set on a given component and its parent components
    this._nativePseudoclassMap; // a map of Gem names to a set of native pseudoclass styles and their css selector base (eg: {GemA: {'.style1:required .style2': styleObject}}

	this._style;             // the object's explicit Style object (undefined if it inherits a style)
    this._currentStyle;      // the object's current Style that will only change if its parent's activeStyle changes, or if a style is explicitly reset on the gem
    this._activeStyle;       // the active style depending on pseudoclasses, $state, and defaultStyle

    this._displayStyle;      // temporarily stores an inline display style while the element is hidden (for use when 'show' is called)
    this._styleSetupInfo   // place to put states for setup functions (used for css pseudoclass emulation)
    this._stateChangeHandler // the handler being used for $state style changes

    this.attached           // set to true if the gem has been attached to the document (or if one of its ancestors has been)


    // returns the default style of the current Gem based on the 'defaultStyle' property set on its constructor (this.constructor)
    // if there is more than one default style, they are merged in order
    // if there is no default style, undefined is returned
    this.getDefaultStyle = function() {
        return blockStyleUtils.getDefaultStyle(this)
    }

    // gets the high-level style of the gem, either from the gem's explicit style, or inherits from its parent's style map
    function getStyle(gem) {
        if(gem._style !== undefined) {            // use the gem's explicit style if possible
            if(gem._style.inherit) {
                var styleToInerit = blockStyleUtils.getInheritingStyle(gem)
                if(styleToInerit !== undefined)
                    return styleToInerit.mix(gem._style, false)
            }
            // else
            return gem._style

        } else {     // otherwise use the parent's computedStyleMap
            return blockStyleUtils.getInheritingStyle(gem)
        }
    }

    function setupFocusProperty(that, quiet) {
         // returns true if the element is in focus
        var getFn = function() {
            return document.activeElement === this.domNode
        }

        // sets whether or not the element is in focus (setting it to true gives it focus, setting it to false blurs it)
        var setFn = function(setToInFocus) {
            if(quiet)
                this.quietFocus = true

            if(setToInFocus) {
                this.domNode.focus()
            } else {
                this.domNode.blur()
            }
        }

        if(quiet) {
            var container = that.quiet
            getFn = getFn.bind(that)
            setFn = setFn.bind(that)
        } else {
            var container = that
        }

        Object.defineProperty(container, 'focus', {get: getFn, set: setFn})
    }

    // should only be called on the first 'on' for each event
    function ifOnBrowserEvent(that, emitter, event, handlerCache, capture) {
        if(event in setOfBrowserEvents && (that.excludeDomEvents === undefined || !(event in that.excludeDomEvents))) {
            that.domNode.addEventListener(event, handlerCache[event]=function() {
                if(event === 'focus' && that.quietFocus) return // shhh
                emitter.emit.apply(emitter, [event].concat(Array.prototype.slice.call(arguments)))
            },capture)
        }
    }
    // should only be called on the last 'off' for each event
    function ifOffBrowserEvent(that, event, handlerCache,capture) {
        if(event in setOfBrowserEvents && (that.excludeDomEvents === undefined || !(event in that.excludeDomEvents))) {
            that.domNode.removeEventListener(event,handlerCache[event],capture)
        }
    }
});


Object.defineProperty(module.exports, 'dev', {
    get: function() {
        return devFlag.dev
    }, set: function(v) {
        devFlag.dev = v
    }
})

// appends components to the passed domNode (default: body)
var attach = module.exports.attach = function(/*[domNode,] component or components*/) {
    attachInternal(arguments, false)
}

// appends components immediately before the passed domNode
module.exports.attachBefore = function(/*[domNode,] component or components*/) {
    attachInternal(arguments, true)
}

// removes components from their parents
var detach = module.exports.detach = function(components) {
    if(!(components instanceof Array)) {
        components = [components]
    }

    for(var n=0; n<components.length; n++) {
        var gem = components[n]
        gem.domNode.parentNode.removeChild(gem.domNode)

        blockStyleUtils.setAttachStatus(gem, false)
    }
}

// creates a body tag (only call this if document.body is null)

module.exports.createBody = function(callback) {
    var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    var body = dom.createElement("body")
    dom.documentElement.appendChild(body)
    setTimeout(function() {  // set timeout is needed because the body tag is only added after javascript goes back to the scheduler
        callback()
    },0)
}


function attachInternal(args, before) {
    if(args.length > 1) {
        var domNode = args[0]
        var components = args[1]
    } else {
        if(document.body === null) throw new Error("Your document does not have a body.")
        var domNode = document.body
        var components = args[0]
    }

    if(!(components instanceof Array)) {
        var components = [components]
    }

    for(var n=0; n<components.length; n++) {
        if(before) {
            domNode.parentNode.insertBefore(components[n].domNode, domNode)
        } else {
            domNode.appendChild(components[n].domNode)
        }

        blockStyleUtils.setAttachStatus(components[n], true) // must be done before setting the style (unsure why at the moment)
        components[n].style = components[n]._style   // force style rendering
    }
}

// returns a list of indexes to remove from Gem.remove's arguments
/*private*/ var normalizeRemoveArguments = module.exports.normalizeRemoveArguments = function() {
    var that = this

    if(arguments[0] instanceof Array) {
        var removals = arguments[0]
    } else {
        var removals = Array.prototype.slice.call(arguments)
    }

    return removals.map(function(removal, parameterIndex) {
        if(isGem(removal)) {
            var index = that.children.indexOf(removal)
            if(index === -1) {
                throw new Error("The Gem passed at argument index "+parameterIndex+" is not a child of this Gem.")
            }
            return index
        } else {
            return removal
        }

    })
}

// returns a list of nodes to add
/*private*/ var normalizeAddAtArguments = module.exports.normalizeAddAtArguments = function() {
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

function isGem(c) {
    return c.add !== undefined && c.children instanceof Array && c.domNode !== undefined
}

/***/ }),
/* 2 */
/*!***********************************!*\
  !*** ./node_modules/testUtils.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Future = __webpack_require__(/*! async-future */ 10)
var Style = __webpack_require__(/*! Style */ 5)
var Block = __webpack_require__(/*! Components/Block */ 4)

// compares arrays and objects for value equality (all elements and members must match)
exports.equal = function(a,b) {
    if(a instanceof Array) {
        if(!(b instanceof Array))
            return false
        if(a.length !== b.length) {
            return false
        } else {
            return a.reduce(function(previousValue, currentValue, index) {
                return previousValue && exports.equal(currentValue,b[index])
            }, true)
        }
    } else if(a instanceof Object) {
        if(!(b instanceof Object))
            return false

        var aKeys = Object.keys(a)
        var bKeys = Object.keys(b)

        if(aKeys.length !== bKeys.length) {
            return false
        } else {
            for(var n=0; n<aKeys.length; n++) {
                var key = aKeys[n]
                var aVal = a[key]
                var bVal = b[key]

                if(!exports.equal(aVal,bVal)) {
                    return false
                }
            }
            // else
            return true
        }
    } else {
        return a===b
    }
}


// slightly better than sequence, you define the functions up front, and when you call the return value, it passes the arguments you call it with to the functions in sequence
// returns a function that, each time its called, calls the next function in the list with the passed argument
// example:
/*
var sequenceX = testUtils.seq(
 function(x) {
     t.ok(x === 'a')
 },
 function(x) {
     t.ok(x === 'b')
 },
 function(x) {
     t.ok(x === 'c')
})

 var obj = {a:1,b:2,c:3}
 for(var x in obj) {
     sequenceX(x)
 }
 */
exports.seq = function (/*functions*/) {
    var n=-1
    var fns = arguments
    return function() {
        n++
        if(n>=fns.length)
            throw new Error("Unexpected call "+n+". Arguments: "+Array.prototype.slice.call(arguments))
        // else
        fns[n].apply(this,arguments)
    }
}


exports.demo = function(name, component) {
    var header = document.createElement("h2")
        header.textContent = name

    $("#demos").append(header);
    component.attach($("#demos")[0])

    return [header, component]
}
exports.cleanupDemo = function(nodes) {
    $(nodes[0]).remove()
    nodes[1].detach()
}
exports.manualDemo = function(name, component) {
    var header = document.createElement("h2")
        header.textContent = name

    $("#manualDemos").append(header);
    component.attach($("#manualDemos")[0])
}
exports.textOutput = function(name, textContent) {
    var header = document.createElement("h2")
        header.textContent = name

    var text = document.createElement("div")
        text.textContent = textContent

    $("#results").append([header, text]);
}

// future wraps a function like: function(result) {}
exports.wrapSingleParameter = function() {
    if(arguments.length === 1) {
        var fn = arguments[0]
    } else {
        var object = arguments[0]
        var method = arguments[1]
        var fn = object[method]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
		var future = new Future
		args.push(function(result) {
		    future.return(result)
		})
		var me = this
        if(object) me = object
        fn.apply(me, args)
		return future
    }
}

exports.performanceTest = function(name, testDefinition) {
    setTimeout(function() {
        var times = []
        var totalTime = 0
        while(totalTime < 2000) {
            var time = oneIteration()
            times.push(time)
            totalTime += time
        }

        var averageTime = totalTime/times.length
        var stdDeviationPercentage = standardDeviation(times)/averageTime

        //console.log(mean(times)+ ' vs '+averageTime) // these should be equal and looks like they are
        exports.textOutput(name, Math.round(averageTime)+'ms (averaged over '+times.length+" iterations) - standard deviation: "+Math.round(stdDeviationPercentage*100)/100+'%')


        function oneIteration() {
            var time;
            testDefinition.call({
                time: function(testFn) {
                    var start = performance.now()
                    testFn()
                    time = performance.now() - start // ms
                }
            })

            return time
        }
    },0)
}

function standardDeviation(numberSet) {
    return Math.sqrt(variance(numberSet))
}

function variance(numberSet) {
    var theMean = mean(numberSet)
    var sumOfDifferenceSquares = numberSet.reduce(function(acc,x) {
        var difference = x-theMean
        return acc + difference*difference
    },0)

    return sumOfDifferenceSquares / (numberSet.length-1)
}

function mean(numberSet) {
    var sum = numberSet.reduce(function(acc,x) {
        return acc+x
    },0)

    return sum/numberSet.length
}


exports.buildNestedStructure = function (nestings) {
    var innerMost = Block()
    var cur = innerMost
    for(var n=0; n<nestings; n++) {
        cur = Block('moose', [cur])
    }
    return {innerMost:innerMost, top: cur}
}

exports.buildNestedStyle = function(nestings) {
    var styleObject = {};
    for(var n=0; n<nestings; n++) {
        styleObject = {color: 'red', Block: styleObject}
    }

    return Style(styleObject)
}

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** ../node_modules/domUtils.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {


// the property that should be used to get and set text (this is different on chrome vs firefox for some dumb reason)
exports.textProperty = 'textContent' //document.createElement("div").textContent != undefined ? 'textContent' : 'innerText'

// creates a dom element optionally with a class and attributes
 var node = exports.node = function(type, className, options) {
    var elem = document.createElement(type)

    if(options !== undefined) {
        if(options.attr !== undefined) {
            for(var attribute in options.attr) {
                setAttribute(elem, attribute, options.attr[attribute])
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
exports.div = function(className, options) {
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
exports.setSelectionRange = function(containerEl, start, end) {

    if(containerEl.nodeName === 'INPUT' || containerEl.nodeName === 'TEXTAREA') {
        containerEl.focus()
        containerEl.setSelectionRange(start, end)
    } else {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var foundStart = false;

        iterateThroughLeafNodes(containerEl, function(node) {
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
                return true; // stop the iteration - we're done here
            }

            charIndex = nextCharIndex
        })

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// gets the character offsets of a selection within a particular dom node
// returns undefined if there is no selection in the element
// note: yes this code doesn't work in older versions of IE (or possibly any versions) - if you want it to work in IE, please use http://modernizr.com/ or a polyfill for ranges
exports.getSelectionRange = function (element) {

    var selection = window.getSelection()
    var isInputOrArea = element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA'

    for(var n=0; n<selection.rangeCount; n++) {
        var range = selection.getRangeAt(0)
        if(isInputOrArea) {
            console.dir(range.startContainer.children)
            if(range.startOffset === range.endOffset && range.startContainer.children[range.startOffset] === element /*|| range.startContainer === element || */) { // I don't think the input or textarea itself will ever be the startContainer
                return [element.selectionStart, element.selectionEnd]
            }
        } else {
            var startsInElement = element.contains(range.startContainer)
            if(startsInElement) {
                var elementToIterateThrough = element
                var startFound = true
            } else {
                var elementToIterateThrough = range.commonAncestorContainer
                var startFound = false
                var startContainerFound = false
            }

            var visibleCharacterOffset = 0, start, end;
            iterateThroughLeafNodes(elementToIterateThrough, function(leaf) {
                if(!startFound) {
                    if(leaf === range.startContainer) {
                        startContainerFound = true
                    }

                    if(!element.contains(leaf) || !startContainerFound)
                        return; // continue
                    else if(startContainerFound)
                       startFound = true
                } else if(!startsInElement && !element.contains(leaf)) {
                    return true // done!
                }

                if(leaf === range.startContainer) {
                    start = visibleCharacterOffset + range.startOffset - findHiddenCharacters(leaf, range.startOffset)
                }
                if(leaf === range.endContainer) {
                    end = visibleCharacterOffset + range.endOffset - findHiddenCharacters(leaf, range.endOffset)
                    return true // done!
                }

                visibleCharacterOffset += leaf.length - findHiddenCharacters(leaf, leaf.length)
            })

            if(start === undefined && !startFound) {
                return undefined
            } else {
                if(start === undefined) {
                    start = 0 // start is at the beginning
                }
                if(end === undefined) {
                    end = visibleCharacterOffset // end is all the way at the end (the selection may continue in other elements)
                }

                return [start, end]
            }
        }
    }
}

// sets a getter/setter property on a container object that uses 'instance' as the this-context 
exports.setupBoundProperty = function(instance, container, name, fns) {
    Object.defineProperty(container, name, {get: fns.getFn.bind(instance), set: fns.setFn.bind(instance)}) 
}


// iterate through the leaf nodes inside element
// callback(node) - a function called for each leaf node
    // returning true from this ends the iteration
function iterateThroughLeafNodes(element, callback) {
    var nodeStack = [element], node;

    while (node = nodeStack.pop()) {
        if (node.nodeType == 3) {
            if(callback(node) === true)
                break;
        } else {
            var i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }
}

function findHiddenCharacters(node, beforeCaretIndex) {
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

/***/ }),
/* 4 */
/*!*******************************************!*\
  !*** ../node_modules/Components/Block.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

var domUtils = __webpack_require__(/*! domUtils */ 3)

module.exports = proto(Gem, function(superclass) {

	// static properties

    this.name = 'Block'


	// instance properties

    // NOTE: all the basic Gems override `init` instead of `build` so users don't have to call the build superclass constructor in their `build` constructors
	this.init = function (/*[label,] content*/) {
        if(typeof(arguments[0]) !== 'string' && arguments[0] !== undefined) {
            var contentArgs = arguments
        } else {
            var label = arguments[0]
            var contentArgs = Array.prototype.slice.call(arguments, 1)
        }

        this.children = [] // need children before calling add
        this.domNode = domUtils.div() // need the domNode before setting the label

        this.label = label
		if(contentArgs !== undefined)
            this.add.apply(this,contentArgs)

        superclass.init.apply(this, arguments) // superclass constructor
	}
})


/***/ }),
/* 5 */
/*!********************************!*\
  !*** ../node_modules/Style.js ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var jssModule = __webpack_require__(/*! ../external/jss */ 98)
var proto = __webpack_require__(/*! proto */ 0)
var HashMap = __webpack_require__(/*! hashmap */ 35)

var utils = __webpack_require__(/*! ./utils */ 19)

var baseClassName = '_ComponentStyle_' // the base name for generated class names
var nextClassNumber = 0


var mixedStyles = new HashMap() // maps from a pair of Style objects to the resulting mixed style

// creates a style object
var Style = module.exports = proto(function() {

    // static properties

    // transforms the output of Style.toString() back into a Style object
    this.fromString = function(styleString, context) {
        if(context === undefined) context = {}
        var obj = JSON.parse(styleString)

        var transformFunctionStringsToFunctions = function(obj) {
            for(var p in obj) {
                var x = obj[p]
                if(x instanceof Object) {
                    transformFunctionStringsToFunctions(x)
                } else if(typeof(x) === 'string' && x.substr(0,8) === 'function') {
                    if(context.Style === undefined) {
                        context.Style = Style
                    }

                    var keys=[], values=[]
                    for(var key in context) {
                        keys.push(key)
                        values.push(context[key])
                    }

                    obj[p] = Function(keys, 'return '+x).apply(undefined, values)
                }
            }
        }

        transformFunctionStringsToFunctions(obj)

        return Style(obj)
    }

    // instance properties

    this.defaultClassName = '_default_'     // the name of the default class (used to prevent style inheritance)

    // styleDefinition is an object where key-value pairs can be any of the following:
    // <cssPropertyName>: the value should be a valid css value for that style attribute
    // <ComponentName>: the value can either be a Style object or a nested styleDefinition object
    // $setup: the value is a function to be run on a component when the style is applied to it
    // $kill: the value is a function to be run on a component when a style is removed from it
    // $state: the value should be a state handler function
    // $<label>: the value should be a nested styleDefinition object that does not contain any label styles.
    // $inherit: this style should inherit from whatever style would otherwise have been in its placed if it was undefined
    this.init = function(styleDefinition, privateOptions) {
        if(isStyleObject(styleDefinition))
            return styleDefinition
        // else

        if(privateOptions === undefined) privateOptions = {}

        this.className = baseClassName+nextClassNumber
        nextClassNumber++

        this.componentStyleMap = {}
        this.nativeCssInfoCache = new HashMap
//        this.pureStyleInteractionCache = new HashMap
        this.nativePseudoclassesWritten = {}
        this.basicProperties = {}
        if(Style.isDev()) this.nativePseudoclassStyles = {}

        var flatPseudoClassStyles = new HashMap
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

            } else if(key === '$inherit') {
                this.inherit = true

            } else if(key.indexOf('$$') === 0) { // pseudo-class style
                var parts = getPseudoClassParts(key.substr(2))
                var pseudoClass = mapCamelCase(parts.class)
                if(parts.parameter !== undefined) {
                    pseudoClass+='('+parts.parameter+")"
                }

                if(pseudoClass === '') {
                    throw new Error("Empty pseudo-class name not valid (style key '$$')")
                }

                var flattenedPseudoclassObject = flattenPseudoClassStyles([pseudoClass], Style(value))

                // mix in the resulting compound pseudoclass styles with what has already been found
                flattenedPseudoclassObject.forEach(function(style, key) {
                    styleHashmapMerge(flatPseudoClassStyles, key, style)
                })

            } else if(key === '$') {
                throw new Error("Empty label name not valid (style key '$')")
            } else if(value instanceof Object || isStyleObject(value)) {  // $label or Gem style
                this.componentStyleMap[key] = Style(value)  // turn the object description into a full fledged style object (or pass back the object if its already a Style)
            } else if(value === undefined) {
                // ignore
            } else {
                var cssStyle = key
                var cssStyleName = mapCamelCase(cssStyle)
                this.basicProperties[cssStyleName] = cssValue(cssStyleName, value)
            }
        }

        this.pseudoclasses = processFlattenedPseudoclasses(flatPseudoClassStyles, this.componentStyleMap)
        this.pureNative = isPureNative(this)


        // takes in a list of pseudoClassRules and changes any nesting like {$$hover: {$$focus: {}}} into something like {hover: {}, ['hover','focus']: {}}
        // returns a new HashMap where
            // each key is the list of pseudoclasses that need to apply for that style to take effect, and
            // each value is a Style object
        // also does some validation
        // pseudoClasses - an array of pseudoclasses
        // pseudoClassStyle - a Style object representing the style inside the pseudoclass
        function flattenPseudoClassStyles(pseudoClasses, pseudoClassStyle) {

            if(pseudoClassStyle.stateHandler !== undefined) {
                throw new Error('$state style functions are not valid directly inside psuedoclasses')
            }

            var flattenedStyles = new HashMap
            var pseudoClassStyleCopy = pseudoClassStyle.copy() // copy so you're not clobbering a style something else relies on

            var pseudoclasses = pseudoClassStyleCopy.pseudoclasses

            // remove the pseudoclasses
            pseudoClassStyleCopy.pseudoclasses = {classes:new HashMap,emulatedInfo:{}}//{native:new HashMap,emulated:new HashMap,emulatedInfo:{}, emulatedOrder:[]}

            // write the top-level pseudoClass
            flattenedStyles.set(pseudoClasses, pseudoClassStyleCopy)

            // create flattened styles (with merged in styles from its parent pseudoclass

            pseudoclasses.classes.forEach(function(substyle, subPseudoClass){
                var newCompoundSelector = canonicalizeCompoundPseudoclass(pseudoClasses.concat(subPseudoClass))
                var mixedStyle = pseudoClassStyleCopy.mix(substyle, false)
                flattenedStyles.set(newCompoundSelector, mixedStyle)
            })

            return flattenedStyles
        }

        // pseudoclassList - the list of pseudoclasses that make up the key
        // mutates pseudoclassList into a canonicalized list
        function canonicalizeCompoundPseudoclass(pseudoclassList) {
            pseudoclassList.sort()  // some string sort to canonicalize the list of pseudoclasses (not really important how it sorts exactly, just that its consistent)

            // remove duplicates
            var lastKey = pseudoclassList[0]
            for(var n=1; n<pseudoclassList.length;) {
                if(pseudoclassList[n] === lastKey) {
                    pseudoclassList.splice(n,1)
                } else {
                    n++
                }
            }

            return pseudoclassList
        }


        // merges two hashmaps together, where if the same key is set in both hashmaps, the values (being Style objects) are mixed together (styles in b overriding)
        // mutates map
        function styleHashmapMerge(map, newKey, newStyle) {
            if(map.has(newKey)) {
                var valueToSet = map.get(newKey).mix(newStyle, false)
            } else {
                var valueToSet = newStyle
            }

            map.set(newKey, valueToSet)
        }

        // returns an object containing the following properties
            // classes - a hashmap object
                // each key is a canonicalized array of pseudoclasses for only emulatable pseudoclasses, and
                // each value is a Style object
            // emulatedInfo - an object where
                // each key is an individual psuedoclass selector (like the elements in a canonicalized pseudoclass list), and
                // each value is an object containing the properties:
                    // fns - the emulated psuedoclass functions `check`, `setup`, and `kill`
                    // parameter - the psuedoclass parameter to pass into `check` and `setup`
        // compoundPseudoClassStyles - a hashmap where
            // each key is a canonicalized array of pseudoclasses, and
            // each value is a Style object
        function processFlattenedPseudoclasses(compoundPseudoClassStyles, componentStyleMap) {

            var pseudoclasses = new HashMap
            compoundPseudoClassStyles.forEach(function(pseudoclassStyle, key) {
                if(pseudoclassStyle.pureNative) {
                    // make sure the pseudoclasses are all natively renderable (any js-rendered pseudoclass that isn't marked 'emulated' is not natively emulatable)
                    var allEmulated = true
                    for(var n=0; n<key.length; n++) {
                        var parts = getPseudoClassParts(key[n])
                        var psuedoclassInfo = jsRenderedPseduoclasses[parts.class]
                        if(psuedoclassInfo !== undefined && !psuedoclassInfo.emulated) {
                            allEmulated = false
                            break
                        }
                    }

                    var componentStyleMapConflicts = false
                    if(allEmulated) {
                        componentStyleMapConflicts = styleMapConflicts(componentStyleMap, pseudoclassStyle.componentStyleMap)
                    }

                    pseudoclassStyle.pureNative = allEmulated && !componentStyleMapConflicts
                }

                for(var n=0; n<key.length; n++) {
                    var parts = getPseudoClassParts(key[n])
                    var psuedoclassInfo = jsRenderedPseduoclasses[parts.class]
                    if(psuedoclassInfo !== undefined && psuedoclassInfo.parameterTransform !== undefined) {
                        var transformedParameter = psuedoclassInfo.parameterTransform(parts.parameter)
                        key[n] = parts.class+"("+transformedParameter+")"
                    }
                }

                pseudoclasses.set(key, pseudoclassStyle)
            })

            var emulatedInfo={}
            pseudoclasses.forEach(function(pseudoclassStyle,individualPseudoclasses) {
                if(!pseudoclassStyle.pureNative) {
                    individualPseudoclasses.forEach(function(pseudoclass) {
                        if(!(pseudoclass in emulatedInfo)) {
                            emulatedInfo[pseudoclass] = getEmulatedInfo(pseudoclass)
                        }
                    })
                }
            })

            return {classes: pseudoclasses, emulatedInfo:emulatedInfo}
        }
    }

    // returns true if there are any styleMap conflicts, which is when any inner style of pseudoclassStyleMap collides with a non-pure style in mainStyleMap
    function styleMapConflicts(mainStyleMap, pseudoclassStyleMap) {
        for(var blockSelector in mainStyleMap) {
            if(blockSelector in pseudoclassStyleMap) {
                if(!mainStyleMap[blockSelector].pureNative) {
                    return true
                } else {
                    var pseudoclassInnerStyle = pseudoclassStyleMap[blockSelector]
                    if(styleMapConflicts(mainStyleMap, pseudoclassInnerStyle.componentStyleMap)) {
                        return true
                    }

                    var pseudoclassStyles = pseudoclassInnerStyle.pseudoclasses.classes.values()
                    for(var n=0; n<pseudoclassStyles.length; n++) {
                        var pseudoclassStyle = pseudoclassStyles[n]
                        if(styleMapConflicts(mainStyleMap, pseudoclassStyle.componentStyleMap)) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }


    // returns true if there are any styleMap conflicts, which is when any inner style of pseudoclassStyleMap collides with a non-pure style in mainStyleMap
    function styleMapConflicts(mainStyleMap, pseudoclassStyleMap) {
        for(var blockSelector in pseudoclassStyleMap) {
            if(blockSelector in mainStyleMap) {
                if(!mainStyleMap[blockSelector].pureNative) {
                    return true
                }
            }

            var pseudoclassInnerStyle = pseudoclassStyleMap[blockSelector]
            if(styleMapConflicts(mainStyleMap, pseudoclassInnerStyle.componentStyleMap)) {
                return true
            }

            var pseudoclassStyles = pseudoclassInnerStyle.pseudoclasses.classes.values()
            for(var n=0; n<pseudoclassStyles.length; n++) {
                var pseudoclassStyle = pseudoclassStyles[n]
                if(styleMapConflicts(mainStyleMap, pseudoclassStyle.componentStyleMap)) {
                    return true
                }
            }
        }

        return false
    }

    // returns either
        // this style if styleB is undefined, or
        // a new Style object that merges styleB's properties into the current one such that styleB's properties override the current Style's properties
    // mixInherit - (default: true) if false, doesn't mix in the 'inherit' property
    this.mix = function(styleB, mixInherit) {
        if(mixInherit === undefined) mixInherit = true
        if(styleB === undefined || styleB === this)
            return this
        if(!isStyleObject(styleB)) styleB = Style(styleB)

        var cacheKey = [this,styleB,mixInherit]
        var mixedStyle = mixedStyles.get(cacheKey)
        if(mixedStyle === undefined) {     // note: mixedStyle can only be undefined if the two style have never been mixed before
            var mixedStyle = mixWithoutCreatingNativePseudoclasses(this, styleB, mixInherit)
            mixedStyles.set(cacheKey, mixedStyle)
        }

        return mixedStyle
    }

    // returns a copy of the style with a new className
    this.copy = function () {
        return mixWithoutCreatingNativePseudoclasses(this, Style(), true)
    }

    // returns an object with the members
        // fns - the functions for the given pseudoclass
        // parameter - the processed parameter to pass into fns.setup
    // pseudoclass - a pseudoclass selector (eg "not(:required)")
    function getEmulatedInfo(pseudoclass) {
        var parts = getPseudoClassParts(pseudoclass)
        var fns = jsRenderedPseduoclasses[parts.class]

        if(fns ===  undefined) {
            throw new Error("Pseudoclass "+parts.class+" isn't emulated, but has a style that can't be rendered in pure css")
        }

        var info = {fns: fns}
        if(parts.parameter !== undefined) {
            if(fns.processParameter !== undefined) {
                info.parameter = fns.processParameter(parts.parameter)
            } else {
                info.parameter = parts.parameter
            }
        }

        return info
    }

    // returns an object
        // either with the properties:
            // style - style that has native css properties (basic and pseudoclass) set for it and its block's computedStyleMap
                // this return value *can* be this style itself if there are no interactions with the passed styleMap
            // styleMap - a potentially new styleMap that has copied or inserted styles needed for native psuedoclass rendering
            // nativePsuedoclassMap - a new pseudoclassMap to set on the block
        // OR with the proeprties:
            // cancel:true - exists if a pure native psuedoclass style can't be rendered native because of a collision with a computedStyleMap style that isn't pure native
            // style - the new style to get the pseudoclass style from (and then set with setPreStyleMapStyle)
    // styleMap - a map of style selectors (Gem names or labels) to Styles who's classNames will be used to create the native css
        // intended to be a style map that comes from a block's computedStyleMap property
        // the computedStyleMap can affect how sub-pseudoclass selectors are written
    // nativePseudoclassSelectorMap - an object where each key is a base css-selector, and each value is a Style object
    // jsRenderedPseudoclassIndex - if this style is a js-redered/emulated psueodclass, this is its index inside its parent style's pseudoclasses.classes map, otherwise the value will be 0
    this.createNativeCssInfo = function(gem, styleMap, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle) {
        if(this.inherit) {
            var parentCacheKey = gem.parent
        }
        var cacheKey = [parentCacheKey, styleMap, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle]
        var cacheHasStyleMap = this.nativeCssInfoCache.has(cacheKey)
        if(cacheHasStyleMap) {
            return this.nativeCssInfoCache.get(cacheKey)
        }
        // else
        var styleToReturn = this // can change below if there is an interaction with the styleMap
        if(this.pureNative && this.pseudoclasses.classes.keys().length !== 0) { // only care about pseudoclass interactions if it has pseudoclasses
            var styleSelectors = containedStyleSelectors(this)
            var info = stylesInfo(styleSelectors, styleMap)
            var interacts = info.impure.length > 0
            if(!interacts) {
//                var pureStyleInteractionCacheItem = this.pureStyleInteractionCache.get(info.undef)
//                if(pureStyleInteractionCacheItem === undefined) {
                    var evenNewerComputedStyleMap = utils.merge({},styleMap) // copy
                    for(var key in evenNewerComputedStyleMap) {
                        if(key in styleSelectors) {
                            evenNewerComputedStyleMap[key] = evenNewerComputedStyleMap[key].copy() // copy to ensure that a unique className is created (so that native pseudoclasses don't have the possibility of merging weirdly)
                        }
                    }
                    for(var n=0; n<info.undef.length; n++) {
                        evenNewerComputedStyleMap[info.undef[n]] = Style()  // empty style who's className will be used to create native pseudoclass styles
                    }

                    styleToReturn = this.copy()    // a new style className is needed to avoid potential incorrect css overlap
                    styleMap = evenNewerComputedStyleMap
//                    this.pureStyleInteractionCache.set(info.undef, {style:styleToReturn, map: styleMap})
//                } else {
//                    styleToReturn = pureStyleInteractionCacheItem.style
//                    styleMap = pureStyleInteractionCacheItem.map
//                }
            } else {
                var retryStyle = this.copy()
                changeStyleToNonNative(retryStyle)

                var result = {cancel: true, retryStyle: retryStyle}
                setNativeCssInfoCache(this.nativeCssInfoCache, result)
                return result
            }
        }

        if(!styleToReturn.basicNativeCssRendered) {
            setCss('.'+styleToReturn.className, styleToReturn.basicProperties)
            styleToReturn.basicNativeCssRendered = true
        }

        var newNativePseudoclassMap = createNativePseudoclasses(gem, styleToReturn, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle)

        var result = {style: styleToReturn, styleMap: styleMap, nativePseudoclassMap: newNativePseudoclassMap}
        setNativeCssInfoCache(this.nativeCssInfoCache, result)
        return result


        // mutates the passed style so that its not native
        function changeStyleToNonNative(style) {
            style.pureNative = false
            var newClasses = new HashMap
            style.pseudoclasses.classes.forEach(function(pseudoclassStyle, individualPseudoclasses) {
                //if(style.pureNative) { // all of these will be pureNative, or style wouldn't be
                    var copy = pseudoclassStyle.copy()
                    copy.pureNative = false
                    newClasses.set(individualPseudoclasses, copy)

                    individualPseudoclasses.forEach(function(pseudoclass) {
                        if(!(pseudoclass in pseudoclassStyle.pseudoclasses.emulatedInfo)) {
                            style.pseudoclasses.emulatedInfo[pseudoclass] = getEmulatedInfo(pseudoclass)
                        }
                    })

                /*} else {
                    newClasses.set(individualPseudoclasses, style)
                }*/
            })

            style.pseudoclasses.classes = newClasses

            return style
        }

        function setNativeCssInfoCache(nativeCssInfoCache, value) {
            nativeCssInfoCache.set(cacheKey, value)
        }

        // returns the label and block selectors within the style (recursive)
        // the grabs from both componentStyleMap and psuedoclasses.native[x].componentStyleMap
        function containedStyleSelectors(style) {
            var result = {}
            for(var key in style.componentStyleMap) {
                var innerStyle = style.componentStyleMap[key]
                mergeInSelectors(key, innerStyle)
            }

            style.pseudoclasses.classes.forEach(function(pseudoclassStyle) {
                if(pseudoclassStyle.pureNative) {
                    for(var key in pseudoclassStyle.componentStyleMap) {
                        var innerStyle = pseudoclassStyle.componentStyleMap[key]
                        mergeInSelectors(key, innerStyle)
                    }
                }
            })

            return result


            function mergeInSelectors(key, innerStyle) {
                result[key] = true

                var selectors = containedStyleSelectors(innerStyle)
                utils.merge(result, selectors)
            }
        }

        // returns info about what styles in styleSelectors and in newComputedStyleMap are:
            // impure in newComputedStyleMap
            // not defined in newComputedStyleMap
        function stylesInfo(styleSelectors, newComputedStyleMap) {
            var impure = []
            var undef = []
            for(var key in styleSelectors) {
                var style = newComputedStyleMap[key]
                if(style === undefined) {
                    undef.push(key)
                } else if(!style.pureNative) {
                    impure.push(key)
                }
            }
            return {impure:impure,undef:undef}
        }
    }

    this.toObject = function() {
        var object = {}
        for(var property in this.basicProperties) {
            object[property] = this.basicProperties[property]
        }

        if(this.inherit)
            object.$inherit = true

        for(var selector in this.componentStyleMap) {
            object[selector] = this.componentStyleMap[selector].toObject()
        }

        var addPseudoclass = function(pseudoclassList, style) {
            var curObject = object, lastObject, lastPseudoclass
            pseudoclassList.forEach(function(pseudoclass) {
                var curPseudoclass = '$$'+pseudoclass
                if(curObject[curPseudoclass] === undefined) {
                    curObject[curPseudoclass] = {}
                }

                lastPseudoclass = curPseudoclass
                lastObject = curObject
                curObject = curObject[lastPseudoclass]
            })

            var newProperties = style.toObject()
            for(var key in newProperties) {
                lastObject[lastPseudoclass][key] = newProperties[key] // merge
            }

        }

        if(this.pseudoclasses.classes !== undefined) {
            this.pseudoclasses.classes.forEach(function(style, pseudoclassList) {
                addPseudoclass(pseudoclassList, style)
            })
        }

        if(this.stateHandler !== undefined) {
            object.$state = this.stateHandler
        }
        if(this.setup !== undefined) {
            object.$setup = this.setup
        }
        if(this.kill !== undefined) {
            object.$kill = this.kill
        }

        return object
    }

    // converts the style into a JSON string
    // note that $state, $setup, and $kill functions are also stored as strings
    this.toString = function() {
        var obj = this.toObject()

        var transformFunctionsToStrings = function(obj) {
            for(var p in obj) {
                var x = obj[p]
                if(x instanceof Function) {
                    obj[p] = x.toString()
                } else if(x instanceof Object) {
                    transformFunctionsToStrings(x)
                }
            }
        }

        transformFunctionsToStrings(obj)

        return JSON.stringify(obj)
    }

    // instance properties

    this.className          // the css classname for this style
    this.componentStyleMap; // maps a Component name to a Style object for that component
    this.setup;             // run some javascript on any element this class is applied to
    this.kill;              // a function to run on removal of the style (should reverse setup)


    // private properties

    this.nativeCssInfoCache; // instance property that stores a map between a styleMap and a potentially modified pair: {style:<Style object>, styleMap: <computedStyleMap>}
    this.basicNativeCssRendered; // contains true if the css class has been written to a stylesheet


    // creates a new style with styleB mixed into styleA (styleB overrides)
    // does not create native pseudoclass styles
    // mixInherit - if true, mixes in the 'inherit' property, if false, 'inherit' will get undefined (same as inherit===false)
    function mixWithoutCreatingNativePseudoclasses(styleA, styleB, mixInherit) {
        // mix css properties and non-emulated pseudoclass properties
        var mainStylesMerged = utils.merge({}, styleA.basicProperties, styleB.basicProperties)
        var newStyle = Style(mainStylesMerged)

        // mix block and label properties
        newStyle.componentStyleMap = mergeComponentStyleMaps(styleA, styleB)

        // mix pseudoclass properties
        newStyle.pseudoclasses = mergePseudoclasses(styleA, styleB)

        // mix $state
        if(styleB.stateHandler !== undefined) {
            newStyle.stateHandler = styleB.stateHandler
        } else {
            newStyle.stateHandler = styleA.stateHandler
        }

        // mix $setup and $kill                                                                                                                                                                                                                                                                 waaahhh hah hah haaaaaaa
        if(styleB.setup !== undefined) {
            newStyle.setup = styleB.setup
        } else {
            newStyle.setup = styleA.setup
        }
        if(styleB.kill !== undefined) {
            newStyle.kill = styleB.kill
        } else {
            newStyle.kill = styleA.kill
        }

        if(mixInherit) {
            newStyle.inherit = styleA.inherit || styleB.inherit
        }

        newStyle.pureNative = isPureNative(newStyle)

        return newStyle
    }

    // returns a new component style map where styleB overrides styleA
    // handles the 'inherit' option on styles
    function mergeComponentStyleMaps(styleA, styleB) {
        var mergedStyleMap = utils.merge({}, styleA.componentStyleMap)
        for(var key in styleB.componentStyleMap) {
            var styleMapping = styleB.componentStyleMap[key] // a Style object

            mergedStyleMap[key] = conditionalMix(mergedStyleMap[key], styleMapping)
        }

        return mergedStyleMap
    }

    // conditionally mixes two styles
    // returns b mixed into a if b inherits
    // otherwise returns b
    function conditionalMix(a,b) {
        if(b === undefined)
            return a

        if(b.inherit) {
            if(a === undefined)
                return b
            else
                return a.mix(b, false)
        } else {
            return b
        }
    }

    // returns true if the style can be rendered with pure css (no javascript needed)
    function isPureNative(style) {
        if(style.setup === undefined && style.kill === undefined && style.stateHandler === undefined
        ) {
            var allPseudoclassesNative = true
            style.pseudoclasses.classes.forEach(function(style) {
                if(!style.pureNative) allPseudoclassesNative = false
            })
            if(!allPseudoclassesNative) {
                return false
            }

            var allPureNative = true
            for(var key in style.componentStyleMap) {
                if(style.componentStyleMap[key].pureNative !== true) {
                    allPureNative = false
                    break
                }
            }
            if(!allPureNative) {
                return false
            }

            return true
        }
    }

    // mixes together the pseudoclass properties of two styles
    // handles changing native pseudoclass handling to emulated (and vice versa)
    function mergePseudoclasses(styleA, styleB) {
        var merged = mergeStyleMaps(styleA.pseudoclasses.classes, styleB.pseudoclasses.classes)
        var emulatedInfo = utils.merge({}, styleA.pseudoclasses.emulatedInfo, styleB.pseudoclasses.emulatedInfo)

        return {classes: merged, emulatedInfo:emulatedInfo}


        // returns a new map with mapA and mapB merged, where mapB's styles override
        function mergeStyleMaps(styleMapA, styleMapB) {
            var result = utils.hashmapMerge(new HashMap, styleMapA)
            styleMapB.forEach(function(v, key) {
                if(result.has(key)) {
                    var resultValue = result.get(key).mix(styleMapB.get(key), true)
                } else {
                    var resultValue = styleMapB.get(key)
                }

                result.set(key, resultValue)
            })

            return result
        }
    }

    var singleColonForPseudoElements = false; // may be changed if its detected that the browser does this
    var doubleColonPseudoElRegex =      /(::)(before|after|first-line|first-letter|selection)/;
    var singleColonPseudoElRegex = /([^:])(:)(before|after|first-line|first-letter|selection)/;

    // creates a css selector with the passed properties
    function setCss(selector, properties) {
        var unCamelCasedProperties = {}
        for (key in properties) {
            unCamelCasedProperties[mapCamelCase(key)] = properties[key]
        }

        var rule = addRule(jss.defaultSheet, selector)
        setStyleProperties(rule, properties);



        function addRule(sheet, selector) {
	        var rules = sheet.cssRules || sheet.rules || [];
	        var index = rules.length;

            var pseudoElementRule = addPseudoElementRule(sheet, selector, rules, index);
            if (!pseudoElementRule) {
                addRuleToSheet(sheet, selector, index);
            }

	        return rules[index].style
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
                try {
                    addRuleToSheet(sheet, doubleColonSelector, index);
                } catch(e) {
                    // if there's an error, assume its because the selector was deemed invalid (firefox), so try -moz- extension
                    addRuleToSheet(sheet, toMozDoubleColonPseudoElements(selector), index);
                }
                if (rules.length <= index) {
                    singleColonForPseudoElements = true;
                }
            }
            if (singleColonForPseudoElements) {
                addRuleToSheet(sheet, singleColonSelector, index);
            }

            return true;
        }

        function addRuleToSheet(sheet, selector, index) {
	        if (sheet.insertRule) {
	            sheet.insertRule(selector + ' { }', index);
	        } else {
	            sheet.addRule(selector, null, index);
	        }
	    }

        function setStyleProperties(ruleStyle, properties) {
	        for (var key in properties) {
                ruleStyle.setProperty(key, properties[key])
	        }
	    }

        function toDoubleColonPseudoElements(selector) {
            return selector.replace(singleColonPseudoElRegex, function (match, submatch1, submatch2, submatch3) {
                return submatch1 + '::' + submatch3;
            });
        }
        function toMozDoubleColonPseudoElements(selector) {
            return selector.replace(singleColonPseudoElRegex, function (match, submatch1, submatch2, submatch3) {
                return submatch1 + '::-moz-' + submatch3;
            });
        }
        function toSingleColonPseudoElements(selector) {
            return selector.replace(doubleColonPseudoElRegex, function(match, submatch1, submatch2) {
                return ':' + submatch2;
            })
        }
    }


    // creates the css styles necessary to render the native pseudoclass styles of this style (and contained styles that can be rendered native)
    // intended to be called only once per style
    // styleMap - A block's new computedStyleMap. Selectors that also exist in native pseudoclasses of the style have already been created or copied (so you can be sure creating css class styles for them won't conflict with anything)
    // jsRenderedPseudoclassIndex - the index of the active pseudoclass style - needed for deciding what native css needs to be overridden by `style`
        // if this is 0, no overriding needs to happen (so 0 is also set when there's no active js-rendered/emulated pseudoclass)
    function createNativePseudoclasses(gem, style, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle) {
        if(nativePseudoclassSelectorMap === undefined) nativePseudoclassSelectorMap = {}

        var nativePseudoclassSelectors = []
        //var nativePseudoclassPropertiesToOverride = {}   // stores what style properties for what pseudoclasses needs to be overridden by an emulated style
        var newNativePseudoclassMap = {} // a mapping from a Gem name to a nativePseudoclassSelectorMap
        var index = 0
        style.pseudoclasses.classes.forEach(function(pseudoclassStyle, pseudoclassKey) {
            var fullSelector = '.'+style.className+':'+pseudoclassKey.join(':')
            if(pseudoclassStyle.pureNative) {
                // create css styles for top-level css properties of the native psuedoclass
                createPseudoClassRules(fullSelector, pseudoclassStyle.basicProperties, style, false)
                nativePseudoclassSelectors.push(pseudoclassKey.join(':'))

                for(var blockSelector in pseudoclassStyle.componentStyleMap) {
                    addNativePseudoclassMapItem(blockSelector, fullSelector, pseudoclassStyle.componentStyleMap[blockSelector])
                }
            } else if(index === jsRenderedPseudoclassIndex) {
                // create overriding css styles for top-level css properties of the emulated psuedoclass (so that emulated and native pseudoclasses mix properly)
                for(var n=0; n<nativePseudoclassSelectors.length; n++) {
                    var selector = nativePseudoclassSelectors[n]
                    createPseudoClassRules(fullSelector+":"+selector, style.basicProperties, style, true)
                }
            }

            index++
        })

        var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 34)
        for(var selector in nativePseudoclassSelectorMap) {
            var pseudoclassStyle = nativePseudoclassSelectorMap[selector]
            if(pseudoclassStyle.inherit) {
                pseudoclassStyle = blockStyleUtils.getInheritingStyle(gem).mix(pseudoclassStyle, false)
            }

            var fullSelector = selector+' '+'.'+style.className

            // create css styles for the top-level style when inside a pure native pseudoclass style of its parent
            createPseudoClassRules(fullSelector, pseudoclassStyle.basicProperties, style, true)

            for(var blockSelector in pseudoclassStyle.componentStyleMap) {
                addNativePseudoclassMapItem(blockSelector, fullSelector, pseudoclassStyle.componentStyleMap[blockSelector])
            }

            // create css styles for pseudoclass styles when inside a pure native pseudoclass style of its parent
            pseudoclassStyle.pseudoclasses.classes.forEach(function(pseudoclassStyle, pseudoclassKey) {
                if(pseudoclassStyle.pureNative) {
                    createPseudoClassRules(fullSelector+':'+pseudoclassKey.join(':'), pseudoclassStyle.basicProperties, style, true)
                }
            })
        }

        return newNativePseudoclassMap


        function addNativePseudoclassMapItem(blockSelector, cssSelector, styleValue) {
            if(newNativePseudoclassMap[blockSelector] === undefined)
                newNativePseudoclassMap[blockSelector] = {}
            newNativePseudoclassMap[blockSelector][cssSelector] = styleValue
        }

        // cssProperties - The css rules to apply (should only contain native css properties). CamelCase and certain integer values will be converted.
        // overwriteBloodyStyles - if true, styles from styleMapStyle are overridden with the default (either a block's default or the base default)
        function createPseudoClassRules(selector, cssProperties,  /*temporary*/ styleMapStyle, overwriteBloodyStyles) {
            if(!style.nativePseudoclassesWritten[selector]) {
                var pseudoClassCss = {}

                if(overwriteBloodyStyles) {
                    // overwrite styles that would bleed over from the styleMapStyle

                    var propertiesToOverride = Object.keys(styleMapStyle.basicProperties)
                    styleMapStyle.pseudoclasses.classes.forEach(function(style) {
                        propertiesToOverride = propertiesToOverride.concat(Object.keys(style.basicProperties))
                    })

                    for(var n=0; n<propertiesToOverride.length; n++) {
                        var key = propertiesToOverride[n]
                        if(defaultStyle) {
                            var defaultStyleProperty = defaultStyle.basicProperties[key]
                        }

                        var initialStyle = defaultStyleProperty || defaultStyleValues[key]
                                           || (key in stylesThatInheritByDefault ? 'inherit' : 'initial') // todo: write a function to calculate the inital value, since 'initial' isn't supported in IE (of course) - tho it will be eventually since its becoming apart of css3
                        pseudoClassCss[key] = initialStyle
                    }
                }

                for(var key in cssProperties) {
                    var value = cssProperties[key]

                    var cssStyle = key
                    var cssStyleName = mapCamelCase(cssStyle)
                    pseudoClassCss[cssStyleName] = cssValue(cssStyleName, value)
                }

                // create immediate pseudo class style
                setCss(selector, pseudoClassCss) // create the css class with the pseudoClass
                if(this.nativePseudoclassStyles !== undefined) {
                    styleMapStyle.nativePseudoclassStyles[selector] = pseudoClassCss
                }

                style.nativePseudoclassesWritten[selector] = true
            }
        }
    }
})


// private


// a map of pseudoclass names and how they are emulated with javascript
// each pseudoclass sets up the following functions:
    // check - a function that checks if that pseudoclass currently applies to the component when its called
    // setup - calls a callback when the pseudoClass starts and stops applying
        // should return an object that will be passed to the kill function (as its 'state' parameter)
    // kill - cleans up anything set up in the 'setup' function
    // processParameter - takes the pseudoclass parameter and returns some object representing it that will be used by the setup and check functions
var jsRenderedPseduoclasses = {
    hover: {
        emulated: true,
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
            component.on("mouseover", function() {
                startCallback()
            })
            component.on("mouseout", endCallback)

            return {start: startCallback, end: endCallback}
        },
        kill: function(component, state) {
            component.off("mouseover", state.start)
            component.off("mouseout", state.end)
        }
    },
    checked: {
        emulated: true,
        check: function(component) {
            if(component.domNode.nodeName !== 'INPUT' && component.domNode.nodeName !== 'OPTION') {
                console.warn("The pseudoclass 'checked' can only apply to 'input' nodes (Button, CheckBox, RadioButton, or TextField) or 'option' nodes (Option)")
                return false
            }
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
        emulated: true,
        check: function(component) {
            if(component.domNode.nodeName !== 'INPUT') {
                console.warn("The pseudoclass 'required' can only apply to 'input' nodes (Button, CheckBox, RadioButton, or TextField)")
                return false
            }
            return component.attr('required') !== undefined
        },
        setup: function(component, startCallback, endCallback) {
            var observer = new MutationObserver(function() {
                if(component.attr('required') !== undefined) {
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
        emulated: true,
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
        emulated: true,
        parameterTransform: function(parameter) {
            var parts = parseNthChildParameter(parameter)
            if(parts.variable === 0) {
                return parts.constant+''
            } else if(parts.constant === 0) {
                return parts.variable+'n'
            } else {
                return parts.variable+'n+'+parts.constant
            }
        },

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

        // returns a function that takes an index and tell you if that index applies to the nthChildParameter
        processParameter: function(parameter) {
            var parts = parseNthChildParameter(parameter)
            if(parts.variable === 0) {
                return function(index) {
                    return index+1 === parts.constant
                }
            } else {
                return function(index) {
                    return ((index+1-parts.constant)/parts.variable) % 1 === 0
                }
            }
        }
    },

    // not's parameter is a statement consisting of pseudoclasses separated either by : or ,
    // $$not(pseudoclass1&pseudoclass2,psuedoclass3) translates to the css :not(:pseudoclass1:pseudoclass2,:psuedoclass3)
    not: {
        emulated: true,
        parameterTransform: function(parameter) {
            var orParts = parameter.split(',')
            return orParts.map(function(part) {
                var andParts = part.split(':')
                return andParts.map(function(part) {
                    var parts = getPseudoClassParts(part)
                    var mappedName = mapCamelCase(parts.class)
                    if(parts.parameter !== undefined) {
                        return mappedName+'('+parts.parameter+')'
                    } else {
                        return mappedName
                    }
                }).join(':')
            }).join(',')
        },

        check: function(component, parameterCheck) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        },
        setup: function(component, startCallback, endCallback, parameterCheck) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        },
        kill: function(component, state) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        },

        // returns a function that takes an index and tell you if that index applies to the nthChildParameter
        processParameter: function(parameter) {
            throw new Error("The 'not' psuedoclass can only be used in Style objects that can be rendered in native css as of yet")
        }
    }
}

// name is the name of the new pseudoclass
// options is an object with the members:
    // check(component) - returns true if the pseudoclass applies to the component
    // setup(component, startCallback, endCallback, parameter) - a function that should call startCallback when the pseudoclass starts applying, and endCallback when it stops applying
        // parameter - the parameter passed to the pseudoclass (e.g. in :not(:first-child), ":first-child" is the parameter)
    // kill - a function that cleans up any event listeners or anything else set up in the 'setup' function
    // processParameter - a function that processes the pseudoclass parameter and returns some object the 'setup' function will get as its 4th argument
        // if this is undefined, the pseudoclass will throw an exception for styles that have a parameter for it
    // emulated - if true, it means that there is a corresponding native pseudoclass that can be used if the style can be rendered with pure css
module.exports.addPseudoClass = function(name, options) {
    var mappedName = mapCamelCase(name)
    if(jsRenderedPseduoclasses[mappedName] !== undefined) {
        var nameForError = '"'+mappedName+'"'
        if(mappedName !== name) {
            nameForError+= " (mapped from '"+name+"')"
        }
        throw new Error("The pseudoclass "+nameForError+" is already defined.")
    }
    // else
    jsRenderedPseduoclasses[mappedName] = options
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

var nthChildParameter = new RegExp(
    '^' // begin
        +'('
            +'('
                +'(-?\\d*)'        // constant
                +'(([+-]\\d*)n?)?' // first-order term
            +')|'
            +'('
                +'(-?\\d)*(n)?' // first-order term first
                +'([+-]\\d*)?' // then constant
            +')'
        +')'
    +'$' // the EYND
)

// returns the variable and constnat parts of the parameter
function parseNthChildParameter(parameter) {
    var parts = parameter.replace(/\s/g, '').match(nthChildParameter)
    if(parts === null)
        throw new Error("nth-child parameter '"+parameter+"' isn't valid")

    if(parts[2] !== undefined) {
        var constant = parts[3]
        var variable = parts[5]
    } else {
        var constant = parts[9]
        var variable = parts[7]
        if(variable === undefined && parts[8] === 'n')
            variable = 1
    }

    if(constant === undefined) constant = 0
    else                       constant = parseInt(constant)
    if(variable === undefined) variable = 0
    else if(variable === '+')  variable = 1
    else if(variable === '-')  variable = -1
    else                       variable = parseInt(variable)

    return {variable: variable, constant: constant}
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

var pseudoClassRegex = new RegExp( // /^([^(]*)(\((.*)\))?$/
    "([^(]*)"        // anything that's not an open paren
    +"(\\((.*)\\))?" // optionally some arbitrary string inside parens
    +"$"             // THE EYND!
)

// pulls apart the pseudoclass name from its (optional) parameter
// e.g. pulls out 'nth-child' and '2+3n' from 'nth-child(2+3n)'
function getPseudoClassParts(fullPsuedoClass) {
    var x = fullPsuedoClass.match(pseudoClassRegex)
    if(x === null) throw new Error("Pseudoclass '"+fullPsuedoClass+"' is invalid")
    return {class: x[1], parameter: x[3]}
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
    return o !== undefined && o.componentStyleMap !== undefined
}


//var asciiA = 'A'.charCodeAt(0), asciiZ = 'Z'.charCodeAt(0), difference = 'a'.charCodeAt(0) - asciiA
function mapCamelCase(cssStyleName) {
    return cssStyleName.replace(/([A-Z])/g, function(match, submatch) {          // this is from jss
        return '-' + submatch.toLowerCase();
    })

    /*for(var n=0; n<cssStyleName.length; n++) {
        var ascii = cssStyleName.charCodeAt(n)
        if(asciiA <= ascii && ascii <= asciiZ) { // found capital letter
            cssStyleName = cssStyleName.slice(0, n) + '-'+String.fromCharCode(ascii+difference) + cssStyleName.slice(n+1)
            n++ // increment a second time for the dash
        }
    }

    return cssStyleName*/
}

// maps all the styles that are inherited by descendant nodes to their default values
// source: http://stackoverflow.com/questions/5612302/which-css-styles-are-inherited
var defaultStyleValues = {
    'azimuth': 'center',
    'border-collapse': 'separate',
    'border-spacing': '0',
    'box-sizing': 'border-box',
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
    //'visibility': 'visible',    // let this inherit - otherwise you just hide the container and not the contents
    'voice-family': '',
    'volume': '',
    'white-space': 'normal',
    'widows': '2',
    'word-spacing': 'normal'
}

var stylesThatInheritByDefault = {
    'font-family':1, 'font-size':1, 'font-style':1, 'font-variant':1, 'font-weight':1, 'visibility':1, 'color':1, 'cursor':1
}




// returns index of the passed css classname, or undefined if sheet containing that class isn't found
function cssClassSheetIndex(classname) {
    var result = undefined

    var styleNodes = document.querySelectorAll("style")
    for(var n=0; n<styleNodes.length; n++) {
        var sheet = styleNodes[n].sheet
        jssModule.defaultSheet = sheet

        var defaultStyleMaybe = jssModule.get(classname)
        if(Object.keys(defaultStyleMaybe).length > 0) {
            result = n
            break
        }
    }

    jssModule.defaultSheet = undefined
    return result
}


var defaultJss = jssModule.forDocument(document) // must be created before the jss object (so that the styles there override the styles in the default sheet)
var jss = jssModule.forDocument(document)

var defaultClassSheetIndex = cssClassSheetIndex('.'+Style.defaultClassName)
if(defaultClassSheetIndex === undefined) {
    defaultJss.defaultSheet = defaultJss._createSheet() // create its sheet first (before the regular jss sheet)

    jss.defaultSheet = jss._createSheet()
} else {
    // if the default styleclass *already* exists, it probably means that blocks.js is being loaded twice
    console.log("Warning: the default-styles class name for blocks.js looks like its already in use. This probably means you have two versions of blocks.js loaded. If so, Gem.js will continue to work, but your app will be a bit bloated. If something other than block.js created that class, blocks.js may break that style.")

    var styleNodes = document.querySelectorAll("style")
    defaultJss.defaultSheet = styleNodes[defaultClassSheetIndex].sheet
    jss.defaultSheet = styleNodes[defaultClassSheetIndex+1].sheet

    // make sure the baseClassName isn't already taken
    var dedupNumber = 0
    while(true) {
        var testBaseClassName = baseClassName+dedupNumber
        if(cssClassSheetIndex('.'+testBaseClassName+dedupNumber+0) !== undefined) {
            dedupNumber++
        } else {
            break;
        }
    }

    baseClassName = testBaseClassName+dedupNumber
}

defaultJss.set('.'+Style.defaultClassName, defaultStyleValues) // creates default css class in order to prevent inheritance

defaultJss.set('input', { // chrome and firefox user agent stylesheets mess with this otherwise
    cursor: 'inherit'
})
defaultJss.set('img', { // images should retain content-box sizing, since pixel perfect width on images is important so you avoid resizing the image
    'box-sizing': 'content-box'
})


/*private*/
module.exports.isDev; // should be set by Gem

// externalized for testing
module.exports.jsRenderedPseduoclasses = jsRenderedPseduoclasses
module.exports.parseNthChildParameter = parseNthChildParameter

/***/ }),
/* 6 */
/*!******************************!*\
  !*** ./node_modules/fsyn.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// requires: syn (loaded as a global variable from an html script tag)

var Future = __webpack_require__(/*! async-future */ 10)

exports.click = wrap(syn.click)
exports.rightClick = wrap(syn.rightClick)
exports.dblClick = wrap(syn.dblClick)
exports.move = wrap(syn.move)
exports.type = wrap(syn.type)
exports.key = wrap(syn.key)



function wrap(fn) {
    return function() {
        var resultFuture = Future.wrapSingleParameter(fn).apply(this,arguments)

        // for chaining
        var target = arguments[0]
        resultFuture.click = function() {
            exports.click.apply(this, [target].concat(arguments))
        }
        resultFuture.rightClick = function() {
            exports.rightClick.apply(this, [target].concat(arguments))
        }
        resultFuture.dblClick = function() {
            exports.dblClick.apply(this, [target].concat(arguments))
        }
        resultFuture.move = function() {
            exports.move.apply(this, [target].concat(arguments))
        }
        resultFuture.type = function() {
            exports.type.apply(this, [target].concat(arguments))
        }
        resultFuture.key = function() {
            exports.key.apply(this, [target].concat(arguments))
        }

        return resultFuture
    }
}



/***/ }),
/* 7 */
/*!******************************************!*\
  !*** ../node_modules/Components/Text.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 5)

var domUtils = __webpack_require__(/*! domUtils */ 3)



module.exports = proto(Gem, function(superclass) {

    //static properties

    this.name = 'Text'

    this.defaultStyle = Style({
        whiteSpace: 'pre-wrap' // so whitespace is displayed (e.g. multiple spaces don't collapse)
    })

    this.init = function(/*[label,] text*/) {
        if(arguments.length === 1) {
            var text = arguments[0]
        } else {
            var label = arguments[0]
            var text = arguments[1]
        }

        if (text === undefined) text = ''

        this.domNode = domUtils.div() // need the domNode before setting the label

        this.label = label
        this.text = text

        superclass.init.apply(this, arguments) // superclass constructor
    }

    // instance properties

    Object.defineProperty(this, 'text', {
        get: function() {
            return this.domNode[domUtils.textProperty]
        }, set: function(v) {
             this.domNode[domUtils.textProperty] = v
        }
    })
});




/***/ }),
/* 8 */
/*!******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/path-browserify/index.js ***!
  \******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 12)))

/***/ }),
/* 9 */
/*!**********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/events/events.js ***!
  \**********************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

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
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
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
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
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
  } else if (listeners) {
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

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
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


/***/ }),
/* 10 */
/*!*********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/async-future/asyncFuture.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var trimArgs = __webpack_require__(/*! trimArguments */ 75)


module.exports = Future

Future.debug = false // switch this to true if you want ids and long stack traces

var curId = 0         // for ids\
function Future(value) {
	if(arguments.length > 0) {
		var f = new Future()
        f.return(value)
        return f
	} else {
        this.isResolved = false
        this.queue = []
        this.n = 1 // future depth (for preventing "too much recursion" RangeErrors)
        if(Future.debug) {
            curId++
            this.id = curId
        }
    }
}

// static methods

// has one parameter: either a bunch of futures, or a single array of futures
// returns a promise that resolves when one of them errors, or when all of them succeeds
Future.all = function() {
    if(arguments[0] instanceof Array) {
        var futures = arguments[0]
    } else {
        var futures = trimArgs(arguments)
    }

    var f = new Future()
    var results = []

    if(futures.length > 0) {
        var current = futures[0]
        futures.forEach(function(future, index) {
            current = current.then(function(v) {
                results[index] = v
                return futures[index+1]
            })
        })

        //if
        current.catch(function(e) {
            f.throw(e)
        })
        // else
        current.then(function() {
            f.return(results)
        })


    } else {
        f.return(results)
    }

    return f
}

// either used like futureWrap(function(){ ... })(arg1,arg2,etc) or
//  futureWrap(object, 'methodName')(arg1,arg2,etc)
Future.wrap = function() {
    // function
    if(arguments.length === 1) {
        var fn = arguments[0]
        var object = undefined


    // object, function
    } else {
        var object = arguments[0]
        var fn = object[arguments[1]]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
        var future = new Future
        args.push(future.resolver())
        var me = this
        if(object) me = object
        fn.apply(me, args)
        return future
    }
}

// future wraps a function who's callback only takes one parameter - the return value (no error is available)
// eg: function(result) {}
Future.wrapSingleParameter = function() {
    if(arguments.length === 1) {
        var fn = arguments[0]
    } else {
        var object = arguments[0]
        var method = arguments[1]
        var fn = object[method]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
		var future = new Future
		args.push(function(result) {
		    future.return(result)
		})
		var me = this
        if(object) me = object
        fn.apply(me, args)
		return future
    }
}


// default
var unhandledErrorHandler = function(e) {
    setTimeout(function() {
        throw e
    },0)
}

// setup unhandled error handler
// unhandled errors happen when done is called, and  then an exception is thrown from the future
Future.error = function(handler) {
    unhandledErrorHandler = handler
}

// instance methods

// returns a value for the future (can only be executed once)
// if there are callbacks waiting on this value, they are run in the next tick
    // (ie they aren't run immediately, allowing the current thread of execution to complete)
Future.prototype.return = function(v) {
    resolve(this, 'return', v)
}
Future.prototype.throw = function(e) {
    if(this.location !== undefined) {
        e.stack += '\n    ---------------------------\n'+this.location.stack.split('\n').slice(4).join('\n')
    }
    resolve(this, 'error', e)
    return this
}

function setNext(that, future) {
    resolve(that, 'next', future)
}

function wait(that, cb) {
    if(that.isResolved) {
        executeCallbacks(that, [cb])
    } else {
        that.queue.push(cb)
    }
}

// duck typing to determine if something is or isn't a future
var isLikeAFuture = Future.isLikeAFuture = function(x) {
    return x.isResolved !== undefined && x.queue !== undefined && x.then !== undefined
}

function waitOnResult(f, result, cb) {
    wait(result, function() {
        if(this.hasError) {
            f.throw(this.error)
        } else if(this.hasNext) {
            waitOnResult(f, this.next, cb)
        } else {
            try {
                setNext(f, executeCallback(cb,this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
}


// cb takes one parameter - the value returned
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.then = function(cb) {
    var f = createChainFuture(this)
    wait(this, function() {
        if(this.hasError)
            f.throw(this.error)
        else if(this.hasNext)
            waitOnResult(f, this.next, cb)
        else {
            try {
                setNext(f, executeCallback(cb,this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
    return f
}
// cb takes one parameter - the error caught
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.catch = function(cb) {
    var f = createChainFuture(this)
    wait(this, function() {
        if(this.hasError) {
            try {
                setNext(f, executeCallback(cb,this.error))
            } catch(e) {
                f.throw(e)
            }
        } else if(this.hasNext) {
            this.next.then(function(v) {
                f.return(v)
            }).catch(function(e) {
                try {
                    setNext(f, executeCallback(cb,e))
                } catch(e) {
                    f.throw(e)
                }
            })
        } else {
            f.return(this.result)
        }
    })
    return f
}
// cb takes no parameters
// callback's return value is ignored, but thrown exceptions propogate normally
Future.prototype.finally = function(cb) {
    var f = createChainFuture(this)
    wait(this, function() {
        try {
            var that = this
            if(this.hasNext) {
                this.next.then(function(v) {
                    var x = executeCallback(cb)
                    f.return(v)
                    return x
                }).catch(function(e) {
                    var x = executeCallback(cb)
                    f.throw(e)
                    return x
                }).done()
            } else if(this.hasError) {
                Future(true).then(function() {
                    return executeCallback(cb)
                }).then(function() {
                    f.throw(that.error)
                }).catch(function(e) {
                    f.throw(e)
                }).done()

            } else  {
                Future(true).then(function() {
                    return executeCallback(cb)
                }).then(function() {
                    f.return(that.result)
                }).catch(function(e) {
                    f.throw(e)
                }).done()
            }
        } catch(e) {
            f.throw(e)
        }
    })
    return f
}

// a future created for the chain functions (then, catch, and finally)
function createChainFuture(that) {
    var f = new Future
    f.n = that.n + 1
    if(Future.debug) {
        f.location = createException()  // used for long traces
    }
    return f
}

// all unused futures should end with this (e.g. most then-chains)
// detatches the future so any propogated exception is thrown (so the exception isn't silently lost)
Future.prototype.done = function() {
    wait(this, function() {
        if(this.hasError) {
            unhandledErrorHandler(this.error)
        } else if(this.hasNext) {
            this.next.catch(function(e) {
                unhandledErrorHandler(e)
            })
        }
    })
}



Future.prototype.resolver = function() {
    var me = this

    return function(e,v) {
        if(e) { // error argument
            me.throw(e)
        } else {
            me.return(v)
        }
    }
}

Future.prototype.resolved = function() {
    return this.isResolved
}


function resolve(that, type, value) {
    if(that.isResolved)
        throw Error("Future resolved more than once! Resolution: "+value)

    that.isResolved = true
    that.hasError = type === 'error'
    that.hasNext = type === 'next' && value !== undefined

    if(that.hasError)
        that.error = value
    else if(that.hasNext)
        that.next = value
    else
        that.result = value

    // 100 is a pretty arbitrary number - it should be set significantly lower than common maximum stack depths, and high enough to make sure performance isn't significantly affected
    // in using this for deadunit, firefox was getting a recursion error at 150, but not at 100. This doesn't mean that it can't happen at 100 too, but it'll certainly make it less likely
    // if you're getting recursion errors even with this mechanism, you probably need to figure that out in your own code
    if(that.n % 100 !== 0) {
        executeCallbacks(that, that.queue)
    } else {
        setTimeout(function() { // this prevents too much recursion errors
            executeCallbacks(that, that.queue)
        }, 0)
    }
}

function executeCallbacks(that, callbacks) {
    if(callbacks.length > 0) {
        try {
            callbacks.forEach(function(cb) {
                cb.apply(that)
            })
        } catch(e) {
            unhandledErrorHandler(e)
        }
    }
}

// executes a callback and ensures that it returns a future
function executeCallback(cb, arg) {
    var r = cb(arg)
    if(r !== undefined && !isLikeAFuture(r) )
        throw Error("Value returned from then or catch ("+r+") is *not* a Future. Callback: "+cb.toString())

    return r
}

function createException() {
    try {
        throw new Error()
    } catch(e) {
        return e
    }
}

/***/ }),
/* 11 */
/*!*******************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/util.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;


/***/ }),
/* 12 */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/process/browser.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 13 */
/*!*****************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/utils.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)

var path = __webpack_require__(/*! path */ 8)


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

// turns an array of values into a an object where those values are all keys that point to 'true'
exports.arrayToMap = function(array) {
    var result = {}
    array.forEach(function(v) {
        result[v] = true
    })
    return result
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


/***/ }),
/* 14 */
/*!*****************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/Style.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var jssModule = __webpack_require__(/*! ../external/jss */ 61)
var proto = __webpack_require__(/*! proto */ 0)
var HashMap = __webpack_require__(/*! hashmap */ 27)

var utils = __webpack_require__(/*! ./utils */ 13)
var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 26)

var baseClassName = '_ComponentStyle_' // the base name for generated class names
var nextClassNumber = 0

// creates a style object
var Style = module.exports = proto(function() {

    this.defaultClassName = '_default_'     // the name of the default class (used to prevent style inheritance)

    // styleDefinition is an object where key-value pairs can be any of the following:
    // <cssPropertyName>: the value should be a valid css value for that style attribute
    // <ComponentName>: the value can either be a Style object or a nested styleDefinition object
    // $setup: the value is a function to be run on a component when the style is applied to it
    // $kill: the value is a function to be run on a component when a style is removed from it
    // $state: the value should be a state handler function
    // $<label>: the value should be a nested styleDefinition object that does not contain any label styles.
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

        // create the css class
        if(privateOptions.default) {
            var jssSheet = defaultJss
        } else {
            var jssSheet = jss
        }

        jssSheet.set('.'+this.className, cssProperties)

        //if(module.exports.isDev) {
            this.styleDefinitions = {}
            this.styleDefinitions['.'+this.className] = cssProperties
        //}

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

            var tieredPseudoClasses = createTieredPseudoClasses(this, pseudoClassStyles)
            pseudoclassCombinations(tieredPseudoClasses) // mutates tieredPseudoClasses

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

                    //blockStyleUtils.setCurrentStyle(component, mostSpecificMatchingStyle)
                    //blockStyleUtils.propogateStyleSet(component.children, component.computedStyleMap) // propogate styles to children
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

    // gets the style object for a component based on the current style object (takes into account whether the component has a label
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


// returns a two-level map where the top-level keys are emulatable psuedo classes, and non-emulatable pseudo classes are at the second level
// the classes will also be sorted and deduped
// Example return value: {"hover:lastChild": {color:'red', "$$visited:disabled": {fontWeight: 'bold'}}, }
// parameters:
    // style - the style object being created
    // pseudoClassStyles - a flat object where each key is a list of pseudoclasses separated by colons (e.g. "hover" or "hover:focus") and the value is an object of styles that don't contain pseudoclasses
function createTieredPseudoClasses(style, pseudoClassStyles) {
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

        // todo: add a third branch as an optimization: if the Style can be rendered without emulation - do that
        if(emulatablePseudoClasses.length === 0) { // if none of the pseudoclasses can be emulated using javascript
            validatePurePseudoClassStyles(key, value)                        // then validate the value and
            createPseudoClassRules(style, key, '.'+style.className+":"+key, value)   // create pseudoClassRules

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

    return tieredPseudoClasses
}



// make combinations of the emulatable pseudoclasses, so that they combine like the non-emulated ones do
// info about mathematical combination: https://en.wikipedia.org/wiki/Combination
// mutates tieredPseudoClasses
function pseudoclassCombinations(tieredPseudoClasses) {
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
}



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
            component.on("mouseover", function() {
                startCallback()
            })
            component.on("mouseout", endCallback)

            return {start: startCallback, end: endCallback}
        },
        kill: function(component, state) {
            component.off("mouseover", state.start)
            component.off("mouseout", state.end)
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
            return component.attr('required') !== undefined
        },
        setup: function(component, startCallback, endCallback) {
            var observer = new MutationObserver(function() {
                if(component.attr('required') !== undefined) {
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
    defaultJss.set(selector, pseudoClassCss) // create the css class with the pseudoClass

    //if(module.exports.isDev) {
        that.styleDefinitions = {}
        that.styleDefinitions[selector] = pseudoClassCss
    //}
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
            throw new Error("Block labels can't be used within the pseudoclasses '"+pseudoClass+"'")
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
    return o.componentStyleMap !== undefined
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
    //'visibility': 'visible',    // let this inherit - otherwise you just hide the container and not the contents
    'voice-family': '',
    'volume': '',
    'white-space': 'normal',
    'widows': '2',
    'word-spacing': 'normal'
}



// returns index of the passed css classname, or undefined if sheet containing that class isn't found
function cssClassSheetIndex(classname) {
    var result = undefined

    var styleNodes = document.querySelectorAll("style")
    for(var n=0; n<styleNodes.length; n++) {
        var sheet = styleNodes[n].sheet
        jssModule.defaultSheet = sheet

        var defaultStyleMaybe = jssModule.get(classname)
        if(Object.keys(defaultStyleMaybe).length > 0) {
            result = n
            break
        }
    }

    jssModule.defaultSheet = undefined
    return result
}


var defaultJss = jssModule.forDocument(document) // must be created before the jss object (so that the styles there override the styles in the default sheet)
var jss = jssModule.forDocument(document)

var defaultClassSheetIndex = cssClassSheetIndex('.'+Style.defaultClassName)
if(defaultClassSheetIndex === undefined) {
    defaultJss.defaultSheet = defaultJss._createSheet() // create its sheet first (before the regular jss sheet)

    jss.defaultSheet = jss._createSheet()

    defaultJss.set('.'+Style.defaultClassName, defaultStyleValues) // creates default css class in order to prevent inheritance

    defaultJss.set('input', { // chrome and firefox user agent stylesheets mess with this otherwise
        cursor: 'inherit'
    })
} else {
    // if the default styleclass *already* exists, it probably means that blocks.js is being loaded twice
    console.log("Warning: the default-styles class name for blocks.js looks like its already in use. This probably means you have two versions of blocks.js loaded. If so, Blocks.js will continue to work, but your app will be a bit bloated. If something other than block.js created that class, blocks.js may break that style.")

    var styleNodes = document.querySelectorAll("style")
    defaultJss.defaultSheet = styleNodes[defaultClassSheetIndex].sheet
    jss.defaultSheet = styleNodes[defaultClassSheetIndex+1].sheet

    // make sure the baseClassName isn't already taken
    var dedupNumber = 0
    while(true) {
        var testBaseClassName = baseClassName+dedupNumber
        if(cssClassSheetIndex('.'+testBaseClassName+dedupNumber+0) !== undefined) {
            dedupNumber++
        } else {
            break;
        }
    }

    baseClassName = testBaseClassName+dedupNumber
}


/*private*/ module.exports.isDev; // should be set by Block

var computedStyles = module.exports.computedStyles = new HashMap() // stores a map from styleMap components, to the combined style map



/***/ }),
/* 15 */
/*!*******************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/node_modules/async-future/asyncFuture.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var trimArgs = __webpack_require__(/*! trimArguments */ 51)


module.exports = Future

Future.debug = false // switch this to true if you want ids and long stack traces

var curId = 0         // for ids\
function Future(value) {
	if(arguments.length > 0) {
		var f = new Future()
        f.return(value)
        return f
	} else {
        this.isResolved = false
        this.queue = []
        if(Future.debug) {
            curId++
            this.id = curId
        }
    }
}

// static methods

// has one parameter: either a bunch of futures, or a single array of futures
// returns a promise that resolves when one of them errors, or when all of them succeeds
Future.all = function() {
    if(arguments[0] instanceof Array) {
        var futures = arguments[0]
    } else {
        var futures = trimArgs(arguments)
    }

    var f = new Future()
    var results = []

    if(futures.length > 0) {
        var current = futures[0]
        futures.forEach(function(future, index) {
            current = current.then(function(v) {
                results[index] = v
                return futures[index+1]
            })
        })

        //if
        current.catch(function(e) {
            f.throw(e)
        })
        // else
        current.then(function() {
            f.return(results)
        })


    } else {
        f.return(results)
    }

    return f
}

// either used like futureWrap(function(){ ... })(arg1,arg2,etc) or
//  futureWrap(object, 'methodName')(arg1,arg2,etc)
Future.wrap = function() {
    // function
    if(arguments.length === 1) {
        var fn = arguments[0]
        var object = undefined


    // object, function
    } else {
        var object = arguments[0]
        var fn = object[arguments[1]]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
        var future = new Future
        args.push(future.resolver())
        var me = this
        if(object) me = object
        fn.apply(me, args)
        return future
    }
}


// default
var unhandledErrorHandler = function(e) {
    setTimeout(function() {
        throw e
    },0)
}

// setup unhandled error handler
// unhandled errors happen when done is called, and  then an exception is thrown from the future
Future.error = function(handler) {
    unhandledErrorHandler = handler
}

// instance methods

// returns a value for the future (can only be executed once)
// if there are callbacks waiting on this value, they are run in the next tick
    // (ie they aren't run immediately, allowing the current thread of execution to complete)
Future.prototype.return = function(v) {
    resolve(this, 'return', v)
}
Future.prototype.throw = function(e) {
    resolve(this, 'error', e)
}

function setNext(that, future) {
    if(future !== undefined && !isLikeAFuture(future) )
        throw Error("Value returned from then or catch *not* a Future: "+future)

    resolve(that, 'next', future)
}

function wait(that, cb) {
    if(that.isResolved) {
        executeCallbacks(that, [cb])
    } else {
        that.queue.push(cb)
    }
}

// duck typing to determine if something is or isn't a future
function isLikeAFuture(x) {
    return x.isResolved !== undefined && x.queue !== undefined && x.then !== undefined
}

function waitOnResult(f, result, cb) {
    wait(result, function() {
        if(this.hasError) {
            f.throw(this.error)
        } else if(this.hasNext) {
            waitOnResult(f, this.next, cb)
        } else {
            try {
                setNext(f, cb(this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
}


// cb takes one parameter - the value returned
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.then = function(cb) {
    var f = new Future
    wait(this, function() {
        if(this.hasError)
            f.throw(this.error)
        else if(this.hasNext)
            waitOnResult(f, this.next, cb)
        else {
            try {
                setNext(f, cb(this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
    return f
}
// cb takes one parameter - the error caught
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.catch = function(cb) {
    var f = new Future
    wait(this, function() {
        if(this.hasError) {
            try {
                setNext(f, cb(this.error))
            } catch(e) {
                f.throw(e)
            }
        } else if(this.hasNext) {
            this.next.then(function(v) {
                f.return(v)
            }).catch(function(e) {
                setNext(f, cb(e))
            })
        } else {
            f.return(this.result)
        }
    })
    return f
}
// cb takes no parameters
// callback's return value is ignored, but thrown exceptions propogate normally
Future.prototype.finally = function(cb) {
    var f = new Future
    wait(this, function() {
        try {
            var that = this
            if(this.hasNext) {
                this.next.then(function(v) {
                    var x = cb()
                    f.return(v)
                    return x
                }).catch(function(e) {
                    var x = cb()
                    f.throw(e)
                    return x
                }).done()
            } else if(this.hasError) {
                Future(true).then(function() {
                    return cb()
                }).then(function() {
                    f.throw(that.error)
                }).catch(function(e) {
                    f.throw(e)
                }).done()

            } else  {
                Future(true).then(function() {
                    return cb()
                }).then(function() {
                    f.return(that.result)
                }).catch(function(e) {
                    f.throw(e)
                }).done()
            }
        } catch(e) {
            f.throw(e)
        }
    })
    return f
}

// all unused futures should end with this (e.g. most then-chains)
// detatches the future so any propogated exception is thrown (so the exception isn't silently lost)
Future.prototype.done = function() {
    wait(this, function() {
        if(this.hasError) {
            unhandledErrorHandler(this.error)
        } else if(this.hasNext) {
            this.next.catch(function(e) {
                unhandledErrorHandler(e)
            })
        }
    })
}



Future.prototype.resolver = function() {
    var me = this

    return function(e,v) {
        if(e) { // error argument
            me.throw(e)
        } else {
            me.return(v)
        }
    }
}

Future.prototype.resolved = function() {
    return this.isResolved
}


function resolve(that, type, value) {
    if(that.isResolved)
        throw Error("Future resolved more than once! Resolution: "+value)

    that.isResolved = true
    that.hasError = type === 'error'
    that.hasNext = type === 'next' && value !== undefined

    if(that.hasError)
        that.error = value
    else if(that.hasNext)
        that.next = value
    else
        that.result = value

    executeCallbacks(that, that.queue)
}

function executeCallbacks(that, callbacks) {
    if(callbacks.length > 0) {
        setTimeout(function() {
            callbacks.forEach(function(cb) {
                cb.apply(that)
            })
        },0)
    }
}


/***/ }),
/* 16 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 17 */
/*!*****************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/Block.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitterB = __webpack_require__(/*! EventEmitterB */ 58)
var proto = __webpack_require__(/*! proto */ 0);
var trimArguments = __webpack_require__(/*! trimArguments */ 24)
var observe = __webpack_require__(/*! observe */ 25)

var utils = __webpack_require__(/*! ./utils */ 13)
var domUtils = __webpack_require__(/*! ./domUtils */ 60)
var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 26)

var Style = __webpack_require__(/*! ./Style */ 14)
Style.isDev = function() {return module.exports.dev}

var components = {};

var setOfBrowserEvents = utils.arrayToMap([
    'abort','afterprint','animationend','animationiteration','animationstart','audioprocess','beforeprint','beforeunload',
    'beginEvent','blocked','blur','cached','canplay','canplaythrough','change','chargingchange','chargingtimechange',
    'checking','click','close','compassneedscalibration','complete','compositionend','compositionstart','compositionupdate','contextmenu',
    'copy','cut','dblclick','decivelight','devicemotion','deviceorientation','deviceproximity','dischargingtimechange','DOMContentLoaded',
    'downloading','drag','dragend','dragenter','dragleave','dragover','dragstart','drop','durationchange','emptied','ended','endEvent',
    'error','focus','focusin','focusout','fullscreenchange','fullscreenerror','gamepadconnected','gamepaddisconnected','hashchange',
    'input','invalid','keydown','keypress','keyup','languagechange','levelchange','load','loadeddata','loadedmetadata','loadend',
    'loadstart','message','mousedown','mouseenter','mouseleave','mousemove','mouseout','mouseover','mouseup','noupdate','obsolete',
    'offline','online','open','orientationchange','pagehide','pageshow','paste','pause','pointerlockchange','pointerlockerror','play',
    'playing','popstate','progress','ratechange','readystatechange','repeatEvent','reset','resize','scroll','seeked','seeking','select',
    'show','stalled','storage','submit','success','suspend','SVGAbort','SVGError','SVGLoad','SVGResize','SVGScroll','SVGUnload','SVGZoom',
    'timeout','timeupdate','touchcancel','touchend','touchenter','touchleave','touchmove','touchstart','transitionend','unload',
    'updateready','upgradeneeded','userproximity','versionchange','visibilitychange','volumechange','waiting','wheel'
])

// events:
    // newParent - emits this when a component gets a new parent
    // parentRemoved - emits this when a component is detached from its parent
var Block = module.exports = proto(EventEmitterB,function(superclass) {

    // static properties

    // constructor
	this.init = function() {
        var that = this

        if(this.name === undefined) {
            throw new Error("The 'name' property is required for Blocks")
        }

        var defaultBlockStyle = blockStyleUtils.defaultStyleMap.get(this.constructor)
        if(defaultBlockStyle === undefined) {
            defaultBlockStyle = blockStyleUtils.createDefaultBlockStyle(this)
        }

        superclass.init.call(this)

        this.children = []
        this.state = observe({})
        this.parent = undefined;

		if (this.id !== undefined) {
			components[this.id] = this;
		}

        if(this.domNode === undefined) {
            this.domNode = domUtils.div()
        }

        this.build.apply(this, arguments)

        //if(module.exports.dev) {
            this.attr('blkName', this.name)
        //}

        var classList = [this.domNode.className]
        if(defaultBlockStyle !== false) classList.push(defaultBlockStyle.className)
        classList.push(Style.defaultClassName)
        this.domNode.className = classList.join(' ') // note that the order of classes doesn't matter

        // set up dom event handlers
        var ifonHandlers={}
        that.ifon(function(event) {
            if(event in setOfBrowserEvents && (that.excludeDomEvents === undefined || !(event in that.excludeDomEvents))) {
                that.domNode.addEventListener(event, ifonHandlers[event]=function() {
                    that.emit.apply(that, [event].concat(Array.prototype.slice.call(arguments)))
                })
            }
        })
        that.ifoff(function(event) {
            if(event in setOfBrowserEvents && (that.excludeDomEvents === undefined || !(event in that.excludeDomEvents))) {
                that.domNode.removeEventListener(event,ifonHandlers[event])
            }
        })
	}

    // sub-constructor - called by the constructor
    // parameters:
        // label - (Optional) A label that can be used to style a component differently.
                   // Intended to be some string describing what the component is being used for.
                   // Note, tho, that labels are not dynamic - changing the label won't affect styling until a new style is applied to the component)
        // domNode - (Optional) A domNode to be used as the container domNode instead of the default (a div)
    this.build = function(/*[label,] domNode*/) {
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
    this.excludeDomEvents;
    this.children;     // a list of child components that are a part of a Block object (these are used so Styles can be propogated down to child components)


    Object.defineProperty(this, 'label', {
        get: function() {
            return this._label
        }, set: function(v) {
            if(this._label === undefined) {
                this._label = v

                if(module.exports.dev) {
                    this.attr('label', this._label)
                }
            } else {
                throw new Error("A Block's label can only be set once (was already set to: "+this._label+")")
            }
        }
    })

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
                blockStyleUtils.propogateStyleSet([node], this.computedStyleMap)
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

    // sets or gets an attribute on the components domNode
    // parameter sets:
    // if one argument is passed, the attribute's value is returned (if there is no attribute, undefined is returned)
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
                var attribute = this.domNode.getAttribute(arguments[0])
                if(attribute === null) {
                    return undefined // screw null
                } else {
                    return attribute
                }
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

    Object.defineProperty(this, 'visible', {
        // returns true if the element is visible
        get: function() {
            return this.domNode.style.display !== 'none';

        // sets whether or not the element is visible
        }, set: function(setToVisible) {
            if(setToVisible) {
                if (this._displayStyle !== undefined) {
                    this.domNode.style.display = this._displayStyle // set back to its previous inline style
                    this._displayStyle = undefined
                } else {
                    this.domNode.style.display = ''
                }
            } else {
                if(this.domNode.style.display !== '' && this.domNode.style.display !== 'none') { // domNode has inline style
                    this._displayStyle = this.domNode.style.display
                }

                this.domNode.style.display = 'none'
            }
        }
    })


    Object.defineProperty(this, 'focus', {
        // returns true if the element is in focus
        get: function() {
            return document.activeElement === this.domNode

        // sets whether or not the element is in focus (setting it to true gives it focus, setting it to false blurs it)
        }, set: function(setToInFocus) {
            if(setToInFocus) {
                this.domNode.focus()
            } else {
                this.domNode.blur()
            }
        }
    })

    Object.defineProperty(this, 'style', {
        get: function() {
            return this._style

        // sets the style, replacing one if one already exists
        }, set: function(styleObject) {
            if(styleObject === undefined) {
                var styleMap = this.getParentStyleMap()
                if(styleMap !== undefined) {
                    blockStyleUtils.setCurrentStyle(this, blockStyleUtils.getStyleForComponent(styleMap, this))
                } else {
                    blockStyleUtils.setCurrentStyle(this, undefined)
                }

                this.computedStyleMap = styleMap

            } else {
                blockStyleUtils.setCurrentStyle(this, styleObject)
                var specificStyle = styleObject.get(this)
                if(this.getParentStyleMap() !== undefined) {
                    this.computedStyleMap = blockStyleUtils.styleMapConjunction(this.getParentStyleMap(), specificStyle.componentStyleMap)
                } else {
                    this.computedStyleMap = specificStyle.componentStyleMap
                }
            }

            this._style = styleObject
            blockStyleUtils.propogateStyleSet(this.children, this.computedStyleMap) // propogate styles to children
        }
    })

    Object.defineProperty(this, 'selectionRange', {
        // returns the visible character selection range inside the element
        // returns an array like [offsetStart, offsetEnd]
        get: function() {
            return domUtils.getSelectionRange(this.domNode)

        // sets the visible character selection range
        }, set: function(selection) {
            domUtils.setSelectionRange(this.domNode, selection[0], selection[1])
        }
    })

    this.attach = function() {
        attach(this)
    }
    this.detach = function() {
        detach(this)
    }


	// private instance variables/functions

    this.getParentStyleMap = function() {/*default returns undefined*/}  // should be set to a function that returns the computedStyleMap of the component containing this one (so Styles objects can be inherited)
    this.computedStyleMap;  // a map of style objects computed from the Styles set on a given component and its parent components

	this._style;              // the object's explicit Style object (undefined if it inherits a style)
    this.currentStyle;       // the object's current Style (inherited or explicit)
    this._displayStyle;      // temporariliy stores an inline display style while the element is hidden (for use when 'show' is called)
    this._styleSetupStates   // place to put states for setup functions (used for css pseudoclass emulation)
});


module.exports.dev = false // set to true to enable dom element naming (so you can see boundaries of components when inspecting the dom)


// appends components to the body
var attach = module.exports.attach = function(/*component,component,.. or components*/) {
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
var detach = module.exports.detach = function(/*component,component,.. or components*/) {
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

module.exports.createBody = function(callback) {
    var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    var body = dom.createElement("body")
    dom.documentElement.appendChild(body)
    setTimeout(function() {  // set timeout is needed because the body tag is only added after javascript goes back to the scheduler
        callback()
    },0)
}




// returns a list of indexes to remove from Block.remove's arguments
/*private*/ var normalizeRemoveArguments = module.exports.normalizeRemoveArguments = function() {
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
/*private*/ var normalizeAddAtArguments = module.exports.normalizeAddAtArguments = function() {
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

function isBlock(c) {
    return c.add !== undefined && c.children instanceof Array && c.domNode !== undefined
}
function isDomNode(node) {
    return node.nodeName !== undefined
}

/***/ }),
/* 18 */
/*!*************************!*\
  !*** ../Gem.browser.js ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var exports = module.exports = __webpack_require__(/*! Gem */ 1)
exports.Style = __webpack_require__(/*! Style */ 5)

exports.Canvas = __webpack_require__(/*! Components/Canvas */ 36)
exports.Block = __webpack_require__(/*! Components/Block */ 4)
exports.Button = __webpack_require__(/*! Components/Button */ 37)
exports.CheckBox = __webpack_require__(/*! Components/CheckBox */ 38)
exports.Image = __webpack_require__(/*! Components/Image */ 39)
exports.List = __webpack_require__(/*! Components/List */ 40)
//exports.MultiSelect = require("Components/MultiSelect") // not ready yet
exports.Radio = __webpack_require__(/*! Components/Radio */ 41)
exports.Select = __webpack_require__(/*! Components/Select */ 42)
exports.Svg = __webpack_require__(/*! Components/Svg */ 101)
exports.Table = __webpack_require__(/*! Components/Table */ 44)
exports.TextArea = __webpack_require__(/*! Components/TextArea */ 47)
exports.TextField = __webpack_require__(/*! Components/TextField */ 48)
exports.Text = __webpack_require__(/*! Components/Text */ 7)

/***/ }),
/* 19 */
/*!********************************!*\
  !*** ../node_modules/utils.js ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)

//require('hashmap') // here to mark hashmapMerge's dependency on this module
var path = __webpack_require__(/*! path */ 8)


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

// merges two hashmaps together just like merge does for regular objects
// non-deep merge
exports.hashmapMerge = function(obj1, obj2/*, moreObjects...*/) {
    obj2.forEach(function(value, key) {
        obj1.set(key, obj2.get(key))
    })

    if(arguments.length > 2) {
        var newObjects = [obj1].concat(Array.prototype.slice.call(arguments, 2))
        return exports.hashmapMerge.apply(this, newObjects)
    } else {
        return obj1
    }
}

// returns a new object where properties of b are merged onto a (a's properties may be overwritten)
exports.objectConjunction = function(a, b) {
    var objectCopy = {}
    merge(objectCopy, a)
    merge(objectCopy, b)
    return objectCopy
}

// turns an array of values into a an object where those values are all keys that point to 'true'
exports.arrayToMap = function(array) {
    var result = {}
    array.forEach(function(v) {
        result[v] = true
    })
    return result
}

function mergeInternal(objects, deep) {
    var obj1 = objects[0]
    var obj2 = objects[1]

    for(var key in obj2){
       //if(Object.hasOwnProperty.call(obj2, key)) {
            if(deep && obj1[key] instanceof Object && obj2[key] instanceof Object) {
                mergeInternal([obj1[key], obj2[key]], true)
            } else {
                obj1[key] = obj2[key]
            }
       //}
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


/***/ }),
/* 20 */
/*!******************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/node_modules/proto/proto.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var noop = function() {}

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {init: noop}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    var namePointer = {}    // name used only for Error Objects
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

    var constructorName = prototype.name?prototype.name:''
    if(prototype[init] === undefined || prototype[init] === noop) {
        var ProtoObjectFactory = new Function('F',
            "return function " + constructorName + "(){" +
                "return new F()" +
            "}"
        )(F)
    } else {
        // dynamically creating this function cause there's no other way to dynamically name a function
        var ProtoObjectFactory = new Function('F','i','u','n', // shitty variables cause minifiers aren't gonna minify my function string here
            "return function " + constructorName + "(){ " +
                "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
                "if(r===n)\n" +
                    "return x\n" +
                "else if(r===u)\n" +
                    "return n\n" +
                "else\n" +
                    "return r\n" +
            "}"
        )(F, prototype[init], proto[protoUndefined]) // note that n is undefined
    }

    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        addProperty(ProtoObjectFactory, prototype, n)
    }

    // add properties from parent that don't exist in the static class object yet
    for(var n in parent) {
        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
            addProperty(ProtoObjectFactory, parent, n)
        }
    }

    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
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

/***/ }),
/* 21 */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/defaultFormats.js ***!
  \********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Future = __webpack_require__(/*! async-future */ 15)

var formatBasic = __webpack_require__(/*! ./basicFormatter */ 22)
var indent = __webpack_require__(/*! ./indent */ 52)
var utils = __webpack_require__(/*! ./utils */ 23)

// unitTest is a deadunit-core UnitTest object
// if consoleColoring is true, the string will contain console color annotations
// if printOnTheFly is true, test results will be printed to the screen in addition to being returned
// returns a future containing a string with the final results
exports.text = function textOutput(unitTest, consoleColors, printOnTheFly, printLateEvents) {
    if(printLateEvents === undefined) printLateEvents = true

    function color(theColor, theString) {
        if(consoleColors !== undefined)
            return consoleColors[theColor](theString.toString())
        else
            return theString.toString()
    }

    var warningHasBeenPrinted = false
    function lateEventsWarning() {
        if(ended && !warningHasBeenPrinted && printLateEvents) {
            warningHasBeenPrinted = true

            return color('red',
                'Test results were accessed before asynchronous parts of tests were fully complete'
                +" If you have tests with asynchronous parts, make sure to use `this.count` to declare how many assertions you're waiting for."
            )+'\n\n'
        } else {
            return ''
        }
    }


    var ended = false
    return formatBasic(unitTest, printOnTheFly, consoleColors, {
        group: function(name, totalDuration, testSuccesses, testFailures,
                              assertSuccesses, assertFailures, exceptions,
                              testResults, exceptionResults, nestingLevel, timedOut, onTheFly) {

            var total = testSuccesses+testFailures

            var addResults = function() {
                var result = ''
                if(testResults.length > 0)
                    result += '\n'+indent('   ', testResults.join('\n'))
                if(exceptionResults.length > 0)
                    result += '\n'+indent('   ', exceptionResults.join('\n'))
                return result
            }


            var testColor, exceptionColor, failColor, finalColor
            testColor = exceptionColor = failColor = finalColor = 'green'
            if(testFailures > 0) {
                testColor = failColor = finalColor = 'red'
            }
            if(exceptions > 0) {
                finalColor = 'red'
                exceptionColor = 'magenta'
            }

            var durationText = utils.timeText(totalDuration)

            if(nestingLevel === 0) {
                var resultsLine = ''

                if(name) resultsLine += color('cyan', name+' - ')



                resultsLine += color(finalColor, testSuccesses+'/'+(testSuccesses+testFailures)+' successful tests. ')+
                        color('green', assertSuccesses+' pass'+utils.plural(assertSuccesses,"es",""))+
                        ', '+color(failColor, assertFailures+' fail'+utils.plural(assertFailures))+
                        ', and '+color(exceptionColor, exceptions+' exception'+utils.plural(exceptions))+"."
                        +color('grey', " Took "+durationText+".")

                var result = ''
                if(name) result += color('cyan', name)+'\n'
                result += addResults()
                result += '\n\n'+resultsLine

                if(timedOut) {
                    result += color('red', '\n    The test timed out')
                }
            } else {
                if(!name) name = "<unnamed test>"
                var result = color(finalColor, name)+':           '
                                +color(testColor, testSuccesses+'/'+total)
                                +" and "+color(exceptionColor, exceptionResults.length+" exception"+utils.plural(exceptionResults.length))
                                +color('grey', " took "+durationText)
                result += addResults()
            }

            return lateEventsWarning()+result
        },
        assert: function(result, test, onTheFly) {
            if(result.success) {
                var word = "Ok!  ";
                var c = 'green'
            } else {
                var word = "Fail:";
                var c = 'red'
            }

            var linesDisplay = result.sourceLines
            if(result.sourceLines.indexOf("\n") !== -1) {
                linesDisplay = "\n"+linesDisplay;
            }

            var expectations = ""
            if(!result.success && (result.actual !== undefined || result.expected !== undefined)) {
                var things = []
                if(result.expected !== undefined)
                    things.push("Expected "+utils.valueToMessage(result.expected))
                if(result.actual !== undefined)
                    things.push("Got "+utils.valueToMessage(result.actual))

                expectations = " - "+things.join(', ')
            }

            var column = ''
            if(result.column !== undefined) {
                column = color('grey', ":"+result.column)
            }

            return lateEventsWarning()+color(c, word)+" ["+color('grey', result.file)+" "+result.line+column+"] "
                        +color(c, linesDisplay)
                        +expectations
        },
        exception: function(e, onTheFly) {
            return lateEventsWarning()+color('red', 'Exception: ')
                        +color('magenta', utils.errorToString(e))
        },
        log: function(values, onTheFly) {
            return lateEventsWarning()+values.map(function(v) {
                return utils.valueToString(v)
            }).join(', ')
        },
        end: function() {
            ended = true
        }
    })
}


var htmlColors = exports.htmlColors = {
    red: 'rgb(200,30,30)',
    darkRed: 'rgb(90,0,0)',
    lightRed: 'rgb(255,210,230)',

    black: 'rgb(20,20,20)',
    white: 'rgb(240,220,220)',
    gray: 'rgb(185, 180, 180)',

    green: 'rgb(0,100,20)',
    brightGreen: 'rgb(0,200,50)',

    purple: 'rgb(190,0,160)',
    brightPurple: 'rgb(255,126,255)',

    blue: 'rgb(0, 158, 173)',
    brightBlue: 'rgb(0, 233, 255)',

    yellow: 'rgb(210,182,0)',
    darkYellow: 'rgb(106,93,0)'
}

var red = htmlColors.red
var darkRed = htmlColors.darkRed
var lightRed = htmlColors.lightRed
var black = htmlColors.black
var white = htmlColors.white
var green = htmlColors.green
var brightGreen = htmlColors.brightGreen
var purple = htmlColors.purple
var brightPurple = htmlColors.brightPurple
var blue = htmlColors.blue
var brightBlue = htmlColors.brightBlue
var gray = htmlColors.gray


exports.html = function(unitTest, printLateEvents) {
    if(printLateEvents === undefined) printLateEvents = true

    var getTestDisplayer = function() {
        return {
            onToggle: function(displayNone, $bgcolor, innerSelector, outerSelector) {
                if(displayNone == true) {
                    $(innerSelector).css({"display":""});
                    if(outerSelector != undefined) {
                        $(outerSelector).css({"border":"1px solid "+$bgcolor});
                    }
                } else {
                    $(innerSelector).css({"display":"none"});
                    if(outerSelector != undefined) {
                        $(outerSelector).css({"border":""});
                    }
                }
            }
        }
    }


    var formattedTestHtml = formatBasic(unitTest, false, {
        group: function(name, totalDuration, testSuccesses, testFailures,
                          assertSuccesses, assertFailures, exceptions,
                          testResults, exceptionResults, nestingLevel, timedOut) {

            var total = testSuccesses+testFailures
            var mainId = getMainId(name)

            if(testFailures > 0 || exceptions > 0) {
                var bgcolor=red;
                var show = "true";
                var foregroundColor = lightRed
            } else {
                var bgcolor=green;
                var show = "false";
                var foregroundColor = brightGreen
            }

            var durationText = utils.timeText(totalDuration)

            if(nestingLevel === 0) {

                var initTestGroup = function(mainId, bgcolor, show) {
                    $(function()
                    {	$('#'+mainId).css({"border-color":"'+bgcolor+'"});
                        TestDisplayer.onToggle(show, bgcolor, '#'+mainId);

                        $('#'+mainId+'_final').click(function()
                        {	TestDisplayer.onToggle($('#'+mainId).css("display") == "none", bgcolor, '#'+mainId);
                        });
                    });
                }

                var nameLine = "", titleLine = ''
                if(name) {
                    titleLine = '<h1 class="primaryTitle">'+name+'</h1>'
                    nameLine = name+' - '
                }

                var timeoutNote = ""
                if(timedOut) {
                    timeoutNote = 'The test timed out'
                }

                return titleLine+
                       '<div class="testResultsArea" id="'+mainId+'">'+
                            testResults.join('\n')+
                            exceptionResults.join('\n')+"\n"+
                            '<div style="color:'+red+'">'+timeoutNote+'</div>'+
                       '</div>'+
                       '<div class="testResultsBar link" style="border:2px solid '+bgcolor+';" id="'+mainId+'_final">'+
                            '<div class="testResultsBarInner" style="background-color:'+bgcolor+';">'+
                                '<div style="float:right;"><i>click on this bar</i></div>'+
                                '<div><span class="testResultsName">'+nameLine+'</span>' + testSuccesses+'/'+total+' successful tests. '+
                                '<span style="color:'+brightGreen+'">'+assertSuccesses+' pass'+utils.plural(assertSuccesses,"es","")+'</span>'+
                                ', <span style="color:'+darkRed+'">'+assertFailures+' fail'+utils.plural(assertFailures)+'</span>'+
                                ', and <span style="color:'+brightPurple+'">'+exceptions+' exception'+utils.plural(exceptions)+'</span>'+
                                '. <span style="color: '+white+'">Took '+durationText+".</span>"+
                            '</div>'+
                       '</div>'+

                       '<script>;('+initTestGroup+')("'+mainId+'", "'+bgcolor+'", '+show+')</script>'+
                       '</div>'

            } else {
                var n = getNewNumber()

                var testId = mainId+n

                var initTest = function(mainId, bgcolor, show, n) {
                    $(function()
                    {	$('#'+mainId).css({borderColor:bgcolor});
                        TestDisplayer.onToggle(show, bgcolor, '#'+mainId+n+'_inner', '#'+mainId+n);

                        $('.'+mainId+n+'_status').click(function()
                        {	TestDisplayer.onToggle
                            (	$('#'+mainId+n+'_inner').css("display") == "none",
                                bgcolor,
                                '#'+mainId+n+'_inner',
                                '#'+mainId+n+''
                            );
                        });
                    });
                }

                if(!name) name = "<unnamed test>"

                return '<div class="resultsArea" id="'+mainId+n+'">'+
                            '<div class="resultsBar link '+mainId+n+'_status" style="background-color:'+bgcolor+';color:'+foregroundColor+'">'+
                                name+': &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                                testSuccesses+'/'+total+" and "+exceptions+" exception"+utils.plural(exceptions)
                                +' <span style="color: white">took '+durationText+'</span>'+
                            '</div>'+
                            '<div class="resultsAreaInner" id="'+testId+'_inner">'+
                                '<h2 class="'+testId+'_status link" style="color:'+bgcolor+';">'+name+'</h2>'+
                                testResults.join('\n')+"\n"+
                                exceptionResults.join('\n')+"\n"+
                            '</div>'+
                            '<script>;('+initTest+')("'+mainId+'", "'+bgcolor+'", '+show+', '+n+')</script>'+
                      '</div>';
            }
        },
        assert: function(result) {
            if(false === result.success) {
                var color = red;
                var word = "Fail:";
            } else {
                var color = green;
                var word = "Ok!";
            }

            var linesDisplay = "<i>"+utils.textToHtml(result.sourceLines)+"</i>";
            if(result.sourceLines.indexOf("\n") !== -1) {
                linesDisplay = "<br>\n"+linesDisplay;
            }

            var expectations = ""
            if(!result.success && (result.actual !== undefined || result.expected !== undefined)) {
                var things = []
                if(result.expected !== undefined)
                    things.push("Expected "+utils.textToHtml(utils.valueToMessage(result.expected)))
                if(result.actual !== undefined)
                    things.push("Got "+utils.textToHtml(utils.valueToMessage(result.actual)))

                expectations = " - "+things.join(', ')
            }

            var column = ''
            if(result.column !== undefined) {
                column = ":"+result.column
            }

            return '<div style="color:'+color+';"><span >'+word+'</span>'+
                        " <span class='locationOuter'>[<span class='locationInner'>"
                                +result.file+" line <span class='lineNumber'>"+result.line+"</span>"+column+"</span>]"
                        +"</span> "
                    +linesDisplay
                    +' <span class="expectations">'+expectations+'</span>'
            +"</div>"
        },
        exception: function(exception) {
            var formattedException = utils.textToHtml(utils.errorToString(exception))
            return '<div style="color:'+purple+';">Exception: '+formattedException+'</div>'
        },
        log: function(values) {
            return '<div>'
                +values.map(function(v) {
                    return utils.textToHtml(utils.valueToString(v))
                }).join(', ')
            +'</div>'

        }
    })

    return formattedTestHtml.then(function(formattedHtml) {
        return Future('<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>'+
        '<style>\
            body{\
                background-color: '+black+';\
                color: '+white+';\
            }\
            h2{\
                margin-bottom: 5px;\
                margin-top: 10px;\
            }\
            .green\
            {   color: '+green+';\
            }\
            .link\
            {   cursor:pointer;\
            }\
            .primaryTitle {\
                color: '+blue+';\
            }\
            .testResultsName {\
                color: '+brightBlue+';\
            }\
            .asyncTime {\
                color: '+gray+';\
            }\
            .resultsArea{\
                margin:1px;\
                margin-bottom: 5px;\
            }\
                .resultsAreaInner{\
                    padding:0 8px;\
                }\
                .resultsBar{\
                    color:white;\
                    margin-bottom:4px;\
                    padding: 1px 3px;\
                }\
            .testResultsArea{\
                padding:0 8px;\
            }\
            .testResultsBar{\
                background-color:'+black+';color:white;margin:4px 0;\
            }\
                .testResultsBarInner{\
                    color:white;margin:1px;padding: 1px 3px;\
                }\
                \
            .locationOuter{\
                color:'+white+';\
            }\
            .locationInner, .expectations {\
                color:'+gray+';\
            }\
            .lineNumber{\
                color:'+white+';\
            }\
         </style>'+
        '<script type="text/javascript">                      \
             var TestDisplayer = ('+getTestDisplayer+')() \
          </script>'
        +formattedHtml)
    })
}

var nextId = 0
var getMainId = function(name) {
    nextId++
    return 'unitTest_'+nextId//+name.replace(/[^a-zA-Z]/g, "") // get rid of all characters except letters
}
var getNewNumber = function() {
    getNewNumber.n++
    return getNewNumber.n
}
getNewNumber.n = 0



/***/ }),
/* 22 */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/basicFormatter.js ***!
  \********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var Future = __webpack_require__(/*! async-future */ 15)

// built in test formatting helper
module.exports = function(unitTest, printOnTheFly/*, [consoleColors,] format*/) {
    if(arguments.length === 3) {
        var format = arguments[2]
    } else /* if(arguments.length > 3) */{
        var color = arguments[2]
        var format = arguments[3]
    }

    var dotText = '.'
    if(color !== undefined) {
        dotText = color.green('.')
    }

    var result = new Future

    var lastPrintWasDot = false
    var printDot = function(dot) {
        if(dot) {
            process.stdout.write(dotText)
        } else if(lastPrintWasDot) {
            process.stdout.write('\n')
        }

        lastPrintWasDot = dot
    }

    var ended = false
    var events = {
        end: function(e) {
            ended = true
            if(printOnTheFly) printDot(false)

            var results = unitTest.results()
            result.return(formatGroup(results, format, 0).result)

            if(format.end !== undefined)
                format.end()
        }
    }

    if(printOnTheFly) {
        var groups = {}
        events.assert = function(e) {
            printDot(e.success && !ended)
            if(e.success) {
                groups[e.parent].testSuccesses++
                groups[e.parent].assertSuccesses++
            } else {
                groups[e.parent].testFailures++
                groups[e.parent].assertFailures++
            }

            if(!e.success || ended) {
                console.log(format.assert(e, undefined, true))
            }
        }
        events.exception = function(e) {
            printDot(false)
            groups[e.parent].exceptions++

            console.log(format.exception(e.error, true))
        }
        events.log = function(e) {
            printDot(false)
            console.log(format.log(e.values, true))
        }
        events.group = function(g) {
            groups[g.id] = {parent: g.parent, name: g.name, testSuccesses: 0, testFailures: 0, assertSuccesses: 0, assertFailures: 0, exceptions: 0}
        }
        events.groupEnd = function(g) {
            var parent = groups[g.id].parent
            if(parent !== undefined) {
                printDot(false)
                if(groups[g.id].testFailures === 0 && groups[g.id].assertFailures === 0 && groups[g.id].exceptions === 0) {
                    groups[parent].testSuccesses++
                } else {
                    groups[parent].testFailures++
                }

                console.log(format.group(groups[g.id].name, undefined, groups[g.id].testSuccesses,groups[g.id].testFailures,groups[g.id].assertSuccesses,groups[g.id].assertFailures,
                                        groups[g.id].exceptions, [], [], 1, false, true))
            }
        }
    }

    unitTest.events(events)

    return result
}

function formatGroup(testResults, format, nestingLevel) {
    var assertSuccesses = 0
    var assertFailures = 0
    var exceptions = 0

    var testCaseSuccesses= 0, testCaseFailures=0;

    var results = []
    testResults.results.forEach(function(result) {
        if(result.type === 'assert') {
            if(result.success) {
                testCaseSuccesses++
                assertSuccesses ++
            } else {
                testCaseFailures++
                assertFailures++
            }

            results.push(format.assert(result, testResults.name, false))

        } else if(result.type === 'group') {
            var group = formatGroup(result, format, nestingLevel+1)
            exceptions+= group.exceptions

            if(group.failures === 0 && group.exceptions === 0)
                testCaseSuccesses++
            else
                testCaseFailures++

            results.push(group.result)
            assertSuccesses+= group.assertSuccesses
            assertFailures+= group.assertFailures

        } else if(result.type === 'log') {
            results.push(format.log(result.values, false))
        } else {
            throw new Error("Unknown result type: "+result.type)
        }
    })

    var exceptionResults = []
    testResults.exceptions.forEach(function(e) {
        exceptionResults.push(format.exception(e, false))
    })

    exceptions+= testResults.exceptions.length

    var formattedGroup = format.group(testResults.name, testResults.duration,
                                      testCaseSuccesses, testCaseFailures,
                                      assertSuccesses, assertFailures, exceptions,
                                      results, exceptionResults, nestingLevel, testResults.timeout, false)
    return {result: formattedGroup,
            successes: testCaseSuccesses,
            failures: testCaseFailures,
            assertSuccesses: assertSuccesses,
            assertFailures: assertFailures,
            exceptions: exceptions
    }
}


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 12)))

/***/ }),
/* 23 */
/*!***********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/utils.js ***!
  \***********************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var util = __webpack_require__(/*! util */ 53)

exports.plural = function (num, plural, singular) {
	var plur = num!==1;

    if(singular === undefined) {
    	if(plur)	return "s"
        else        return ""
    } else {
    	if(plur)	return plural
        else		return singular
    }
}


exports.textToHtml = function(text) {
    return htmlEscape(text)
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, "<br>\n")
            .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
}

exports.timeText = function (ms) {
    if(ms < 2000)
        return ms+"ms"
    else
        return Number(ms/1000).toPrecision(3)+'s'
}


exports.valueToMessage = function(value) {
    if(value instanceof Error) {
        return exports.errorToString(value)
    } else {
        return prettyPrint(value)
    }
}

exports.errorToString = function(err) {
    if(err instanceof Error) {
        var otherProperties = []
        for(var n in err) {
            if(Object.hasOwnProperty.call(err, n) && n !== 'message' && n !== 'stack') {
                otherProperties.push(exports.valueToString(err[n]))
            }
        }

        var properties = ''
        if(otherProperties.length > 0)
            properties = '\n'+otherProperties.join("\n")


        if(err.stack !== undefined) {
            if(err.stack.indexOf(err.message) !== -1) { // chrome
                return err.stack+properties
            } else { // firefox (others?)
                return err.message+'\n'+err.stack+properties
            }
        } else {
            return err.toString()+properties
        }
    } else {
        return err
    }
}

exports.valueToString = function(v) {
    if(v instanceof Error) {
        return exports.errorToString(v)

    } else if(typeof(v) === 'string') {
        return v
    } else {
        return prettyPrint(v)
    }
}

function prettyPrint(value) {
    try {
        return util.inspect(value)       // I've seen this throw an error if the value contains a radio button dom object
    } catch(e) {
        console.log(e)
        return "<error printing value>"
    }
}


function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
}

/***/ }),
/* 24 */
/*!************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/trimArguments/trimArguments.js ***!
  \************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

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

/***/ }),
/* 25 */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/observe/observe.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)
var EventEmitter = __webpack_require__(/*! events */ 9).EventEmitter
var utils = __webpack_require__(/*! ./utils */ 59)


// emits the event:
    // change - the event data is an object of one of the following forms:
        // {data:_, type: 'set', property: propertyList}
        // {data:_, type: 'added', property: propertyList, index:_, count: numberOfElementsAdded}
        // {data:_, type: 'removed', property: propertyList, index:_, removed: removedValues}
var Observe = module.exports = proto(EventEmitter, function(superclass) {

    // static members

    this.init = function(obj) {
        this.subject = obj
        this.internalChangeListeners = []

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

    this.pop = function() {
        var elements = spliceInternal(this, [], [this.subject.length-1,1], {})
        return elements[0]
    }

    this.unshift = function(/*value...*/) {
        spliceInternal(this, [], [0,0].concat(Array.prototype.slice.call(arguments, 0)), {})
    }
    this.shift = function() {
        var elements = spliceInternal(this, [], [0,1], {})
        return elements[0]
    }

    this.reverse = function() {
        this.subject.reverse()
        this.emit('change', {
            type:'set', property: []
        })
    }

    this.sort = function() {
        this.subject.sort.apply(this.subject, arguments)
        this.emit('change', {
            type:'set', property: []
        })
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

    this.data = this.id = function(data) {
        return ObserveeChild(this, [], {data: data})
    }

    /*override*/ this.emit = function(type) {
        if(type === 'change') {
            var args = Array.prototype.slice.call(arguments, 1)
            this.internalChangeListeners.forEach(function(handler) {
                handler.apply(this, args)
            }.bind(this))
        }
        superclass.prototype.emit.apply(this, arguments)
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

    // private

    this.onChangeInternal = function(handler) {
        this.internalChangeListeners.push(handler)
    }
    this.offChangeInternal = function(handler) {
        var index = this.internalChangeListeners.indexOf(handler)
        this.internalChangeListeners.splice(index,1)
    }
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

        var that = this, changeHandler
        parent.onChangeInternal(changeHandler=function(change) {
            var answers = changeQuestions(that.property, change, that.options.union)

            if(answers.isWithin) {
                if(change.type === 'set' && change.property.length <= that.property.length && that.options.union === undefined) { // if the subject may have been replaced with a new subject
                    var pointer = getPropertyPointer(parent.subject, propertyList)
                    if(pointer.obj !== undefined) {
                        if(pointer.key !== undefined) {
                            that.subject =pointer.obj[pointer.key]
                        } else {
                            that.subject =pointer.obj
                        }
                    }
                }

                that.emit('change', {
                    type:change.type, property: change.property.slice(that.property.length),
                    index:change.index, count:change.count, removed: change.removed, data: change.data
                })
            } else if(answers.couldRelocate) {
                if(change.type === 'removed') {
                    var relevantIndex = that.property[change.property.length]
                    var lastRemovedIndex = change.index + change.removed.length - 1
                    if(lastRemovedIndex < relevantIndex) {
                        that.property[change.property.length] = relevantIndex - change.removed.length // change the propertyList to match the new index
                    } else if(lastRemovedIndex === relevantIndex) {
                        parent.offChangeInternal(changeHandler)
                    }
                } else if(change.type === 'added') {
                    var relevantIndex = parseInt(that.property[change.property.length])
                    if(change.index <= relevantIndex) {
                        that.property[change.property.length] = relevantIndex + change.count // change the propertyList to match the new index
                    }
                } else if(change.type === 'set') {
                    parent.offChangeInternal(changeHandler)
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
    this.pop = function() {
        var elements = spliceInternal(this._observeeParent, this.property, [this.subject.length-1,1], this.options)
        return elements[0]
    }

    this.unshift = function(/*value...*/) {
        spliceInternal(this._observeeParent, this.property, [0,0].concat(Array.prototype.slice.call(arguments,0)), this.options)
    }
    this.shift = function() {
        var elements = spliceInternal(this._observeeParent, this.property, [0,1], this.options)
        return elements[0]
    }

    this.splice = function(index, countToRemove/*[, elementsToAdd....]*/) {
        return spliceInternal(this._observeeParent, this.property, arguments, this.options)
    }

    this.reverse = function() {
        this.subject.reverse()
        this.emit('change', {
            type:'set', property: []
        })
    }

    this.sort = function() {
        this.subject.sort.apply(this.subject, arguments)
        this.emit('change', {
            type:'set', property: []
        })
    }

    this.append = function(/*[property,] arrayToAppend*/) {
        appendInternal(this._observeeParent, this.property, arguments, this.options)
    }

    this.data = this.id = function(data) {
        return ObserveeChild(this._observeeParent, this.property, utils.merge({}, this.options, {data: data}))
    }

    this.union = function(collapse) {
        if(collapse === undefined) collapse = false
        return ObserveeChild(this, [], utils.merge({}, this.options, {union: collapse}))
    }

})



// that - the Observee object
function setInternal(that, propertyList, value, options) {
    if(propertyList.length === 0) throw new Error("You can't set at the top-level, setting like that only works for ObserveeChild (sub-observees created with 'get')")

    var pointer = getPropertyPointer(that.subject, propertyList)

    var internalObservee = value
    if(options.union === true) {
        value = value.subject
    }

    pointer.obj[pointer.key] = value

    var event = {type: 'set', property: propertyList}
    if(options.data !== undefined) event.data = event.id = options.data
    that.emit('change',event)

    if(options.union !== undefined)
        unionizeEvents(that, internalObservee, propertyList, options.union)
}

function pushInternal(that, propertyList, args, options) {
    var array = getPropertyValue(that.subject, propertyList)
    var originalLength = array.length
    array.push.apply(array, args)

    var internalObservees = unionizeList(array, originalLength, args.length, options.union)

    var event = {type: 'added', property: propertyList, index: originalLength, count: args.length}
    if(options.data !== undefined) event.data = event.id = options.data
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
        if(options.data !== undefined) event.data = event.id = options.data
        that.emit('change', event)
    }
    if(args.length > 2) {
        var event = {type: 'added', property: propertyList, index: index, count: args.length-2}

        var internalObservees = unionizeList(array, index, event.count, options.union)

        if(options.data !== undefined) event.data = event.id = options.data
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
    if(options.data !== undefined) event.data = event.id = options.data
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
        unionizeEvents(that, internalObservees[n].obj, propertyList.concat(internalObservees[n].index+''), collapse)
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
    that.onChangeInternal(containerChangeHandler = function(change) {
        var changedPropertyDepth = change.property.length

        if(collapse) {
            var propertyListToAskFor = propertyList
        } else {
            var propertyListToAskFor = propertyList.concat(['subject'])
        }

        var answers = changeQuestions(propertyListToAskFor, change, true)
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
        that.offChangeInternal(containerChangeHandler)
    }
}


// answers certain questions about a change compared to a property list
// returns an object like: {
    // isWithin: _,           // true if changeIsWithinInnerProperty
    // couldRelocate: _       // true if changeCouldRelocateInnerProperty or if innerProperty might be removed
// }
function changeQuestions(propertyList, change, union) {
    var propertyListDepth = propertyList.length
    var unioned = union!==undefined

    var changeIsWithinInnerProperty = true // assume true until proven otherwise
    var changeCouldRelocateInnerProperty = true // assume true until prove otherwise
    for(var n=0; n<propertyListDepth; n++) {
        // stringifying the property parts so that indexes can either be strings or integers, but must ensure we don't stringify undefined (possible todo: when/if you get rid of dot notation, this might not be necessary anymore? not entirely sure)
        if(change.property[n] === undefined || change.property[n]+'' !== propertyList[n]+'') {
            changeIsWithinInnerProperty = false
            if(n<change.property.length) {
                changeCouldRelocateInnerProperty = false
            }
        }
    }

    if(!unioned && change.property.length < propertyListDepth
       || unioned && (change.type === 'set' && change.property.length <= propertyListDepth   // if this is a unioned observee, replacing it actually removes it
                   || change.type !== 'set' && change.property.length < propertyListDepth)
    ) {
        changeIsWithinInnerProperty = false
    } else {
        changeCouldRelocateInnerProperty = false
    }

    return {couldRelocate: changeCouldRelocateInnerProperty, isWithin: changeIsWithinInnerProperty}
}

/***/ }),
/* 26 */
/*!***************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/blockStyleUtils.js ***!
  \***************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// some functionality that is needed by Block.js but is related to styling (some things are also needed by Style.js)

var HashMap = __webpack_require__(/*! hashmap */ 27)

var Style = __webpack_require__(/*! ./Style */ 14)
var utils = __webpack_require__(/*! ./utils */ 13)

exports.defaultStyleMap = new HashMap() // maps from a proto class to its computed default style

// propogates a style-set change to a set of components
    // styleMap should be a *copy* of a Style's componentStyleMap property (because it will be modified)
var propogateStyleSet = exports.propogateStyleSet = function (components, styleMap) {
    for(var n=0; n<components.length; n++) {
        var c = components[n]

        // object inherits style if its in the styleSet and if it doesn't have an explicitly set style
        if(c._style === undefined) {
            if(styleMap === undefined) {
                setCurrentStyle(c, undefined)
            } else {
                var styleFromMap = getStyleForComponent(styleMap, c)
                if(styleFromMap !== undefined) {
                    setCurrentStyle(c, styleFromMap)
                }
            }
        }

        // set the computed style set
        var mainStyle; // the style directly given to a component, either its `style` property, or its inherited style
        if(c._style !== undefined) {
            mainStyle = c._style.get(c)
        } else if(styleMap !== undefined) {
            mainStyle = getStyleForComponent(styleMap, c)
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
    }
}

// gets the right style from the styleMap
// takes the component's inheritance tree into account (relies on the block.constructor.parent property)
var getStyleForComponent = exports.getStyleForComponent = function (styleMap, block) {
    var constructor = block.constructor
    while(constructor !== undefined) {
        var style = styleMap[constructor.name]
        if(style !== undefined) {
            return style
        } else {
            constructor = constructor.parent
        }
    }
}

// returns the conjunction of two style maps
// gets it from the computedStyles cache if its already in there
var styleMapConjunction = exports.styleMapConjunction = function (secondaryStyleMap, primaryStyleMap) {
    var cachedStyleMap = Style.computedStyles.get([secondaryStyleMap, primaryStyleMap])
    if(cachedStyleMap === undefined) {
        cachedStyleMap = utils.objectConjunction(secondaryStyleMap, primaryStyleMap)
        Style.computedStyles.set([secondaryStyleMap, primaryStyleMap], cachedStyleMap)
    }

    return cachedStyleMap
}

// takes labels into account
var setCurrentStyle = exports.setCurrentStyle = function (component, style) {
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


exports.createDefaultBlockStyle = function (that) {
    if(that.defaultStyle !== undefined) {
        validateDefaultStyle(that.defaultStyle)
    }

    // get list of default styles
    var defaultStyles = []
    var nextConstructor = that.constructor
    while(nextConstructor !== undefined) {
        if(nextConstructor.defaultStyle !== undefined) {
            defaultStyles.push(nextConstructor.defaultStyle)
        }
        nextConstructor = nextConstructor.parent
    }

    // generate merged default style
    var defaultStyleSet = {}
    defaultStyles.reverse().forEach(function(style) {
        for(var k in style.styleDefinitions) {
            utils.merge(defaultStyleSet, style.styleDefinitions[k])
            break; // just do first key (shouldn't be more than one key, because only simple stylings are allowed for default styles)
        }

    })

    if(Object.keys(defaultStyleSet).length > 0)
        var defaultBlockStyle = Style(defaultStyleSet, {default:true})
    else
        var defaultBlockStyle = false // no special default

    exports.defaultStyleMap.set(that.constructor, defaultBlockStyle)
    return defaultBlockStyle
}


// applies setup appropriately
function applyStyleSetupFunction(component, style) {
    if(style !== undefined && style.setup !== undefined) {
        component._styleSetupObject = style.setup(component) // call setup on the component
    } else {
        component._styleSetupObject = undefined
    }
}
// applies kill appropriately
function applyStyleKillFunction(component) {
    var currentStyle = component.currentStyle
    if(currentStyle !== undefined && currentStyle.setup !== undefined) {
        if(currentStyle.kill === undefined)
            throw new Error('style has been unset but does not have a "kill" function to undo its "setup" function')

        currentStyle.kill(component, component._styleSetupObject)
    }
}

// initializes and sets up state-change handler
function applyStateHandler(component, style) {
    if(style !== undefined && style.stateHandler !== undefined) {
        // todo: using setCurrentStyle is a stopgap until I can implement better style application for $state and pseudoclasses (which probably will require a rewrite of much of the style logic)
        setCurrentStyle(component, style.stateHandler(component.state.subject))
        component.state.on('change', function() {
            setCurrentStyle(component, style.stateHandler(component.state.subject))
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
        component.domNode.className = style.className+' '+component.domNode.className.trim() // note that the order of classes doesn't matter
    }
}

function validateDefaultStyle(defaultStyle) {
    if(!(defaultStyle instanceof Style)) {
        throw new Error("defaultStyle property must be a Style object")
    } else if(
        defaultStyle.setup !== undefined || defaultStyle.kill !== undefined || defaultStyle.stateHandler !== undefined ||
        Object.keys(defaultStyle.componentStyleMap).length > 0 || Object.keys(defaultStyle.labelStyleMap).length > 0 /*||
        Object.keys(defaultStyle.pseudoClassStyles).length > 0*/
    ) {
        throw new Error("A Block's defaultStyle can only contain basic css stylings, no Block, label, or pseudoclass stylings, nor run/kill javascript")
    }
}

/***/ }),
/* 27 */
/*!***********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/node_modules/hashmap/hashmap.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * HashMap - HashMap Class for JavaScript
 * @author Ariel Flesler <aflesler@gmail.com>
 * @version 2.0.6
 * Homepage: https://github.com/flesler/hashmap
 */

(function(factory) {
	/* global define */
	if (true) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module === 'object') {
		// Node js environment
		var HashMap = module.exports = factory();
		// Keep it backwards compatible
		HashMap.HashMap = HashMap;
	} else {
		// Browser globals (this is window)
		this.HashMap = factory();
	}
}(function() {

	function HashMap(other) {
		this.clear();
		switch (arguments.length) {
			case 0: break;
			case 1: {
				if ('length' in other) {
					// Flatten 2D array to alternating key-value array
					multi(this, Array.prototype.concat.apply([], other));
				} else { // Assumed to be a HashMap instance
					this.copy(other);
				}
				break;
			}
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
			var hash = this.hash(key);
			if ( !(hash in this._data) ) {
				this.size++;
			}
			this._data[hash] = [key, value];
		},

		multi:function() {
			multi(this, arguments);
		},

		copy:function(other) {
			for (var hash in other._data) {
				if ( !(hash in this._data) ) {
					this.size++;
				}
				this._data[hash] = other._data[hash];
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

		delete:function(key) {
			var hash = this.hash(key);
			if ( hash in this._data ) {
				this.size--;
				delete this._data[hash];
			}
		},

		type:function(key) {
			var str = Object.prototype.toString.call(key);
			var type = str.slice(8, -1).toLowerCase();
			// Some browsers yield DOMWindow or Window for null and undefined, works fine on Node
			if (!key && (type === 'domwindow' || type === 'window')) {
				return key + '';
			}
			return type;
		},

		keys:function() {
			var keys = [];
			this.forEach(function(_, key) { keys.push(key); });
			return keys;
		},

		values:function() {
			var values = [];
			this.forEach(function(value) { values.push(value); });
			return values;
		},

		entries:function() {
			var entries = [];
			this.forEach(function(value, key) { entries.push([key, value]); });
			return entries;
		},

		// TODO: This is deprecated and will be deleted in a future version
		count:function() {
			return this.size;
		},

		clear:function() {
			// TODO: Would Object.create(null) make any difference
			this._data = {};
			this.size = 0;
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
					return '♣' + key.getTime();

				case 'string':
					return '♠' + key;

				case 'array':
					var hashes = [];
					for (var i = 0; i < key.length; i++) {
						hashes[i] = this.hash(key[i]);
					}
					return '♥' + hashes.join('⁞');

				default:
					// TODO: Don't use expandos when Object.defineProperty is not available?
					if (!key.hasOwnProperty('_hmuid_')) {
						key._hmuid_ = ++HashMap.uid;
						hide(key, '_hmuid_');
					}

					return '♦' + key._hmuid_;
			}
		},

		forEach:function(func, ctx) {
			for (var key in this._data) {
				var data = this._data[key];
				func.call(ctx || this, data[1], data[0]);
			}
		}
	};

	HashMap.uid = 0;

	//- Add chaining to all methods that don't return something

	['set','multi','copy','delete','clear','forEach'].forEach(function(method) {
		var fn = proto[method];
		proto[method] = function() {
			fn.apply(this, arguments);
			return this;
		};
	});

	//- Backwards compatibility

	// TODO: remove() is deprecated and will be deleted in a future version
	HashMap.prototype.remove = HashMap.prototype.delete;

	//- Utils

	function multi(map, args) {
		for (var i = 0; i < args.length; i += 2) {
			map.set(args[i], args[i+1]);
		}
	}

	function hide(obj, prop) {
		// Make non iterable if supported
		if (Object.defineProperty) {
			Object.defineProperty(obj, prop, {enumerable:false});
		}
	}

	return HashMap;
}));


/***/ }),
/* 28 */
/*!***************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/src/deadunitCore.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var path = __webpack_require__(/*! path */ 8)
var Url = __webpack_require__(/*! url */ 68)

var proto = __webpack_require__(/*! proto */ 29)
var Future = __webpack_require__(/*! async-future */ 10)
var SourceMapConsumer = __webpack_require__(/*! source-map */ 76).SourceMapConsumer

var processResults = __webpack_require__(/*! ./processResults */ 83)
var isRelative = __webpack_require__(/*! ./isRelative */ 33)

// returns a module intended for a specific environment (that environment being described by the options)
// options can contain:
    // initialization - a function run once that can setup things (like a global error handler).
        // Gets a single parameter 'state' which has the following form:
            // unhandledErrorHandler(error,warn)
    // initializeMainTest - a function run once that can setup things (like a test-specific handler).
        // Gets a single parameter 'mainTestState' which has the following form:
            // unhandledErrorHandler(error,warn) - the error handler for that test
    // getDomain - a function that returns the current domain, or undefined if the environment (*cough* browsers) doesn't have domains
    // getSourceMapObject - a function that returns a future of the pre-parsed source map object for a file, or future undefined
        // gets the parameter:
            // url - the url of the file to find a sourcemap for
            // warningHandler - a warningHandler function that expects an error to be passed to it
    // runTestGroup - a function run that allows you to wrap the actual test run in some way (intended for node.js domains)
        // gets parameters:
            // state - the same state object sent into `initialization`
            // tester - a UnitTester object for the test
            // runTest - the function that you should call to run the test group. Already has a synchronous try catch inside it (so you don't need to worry about that)
            // handleError - a function that handles an error if one comes up. Takes the error as its only parameter. Returns a future.
    // mainTestDone - a function run once a test is done
        // gets the 'mainTestState' parameter
    // defaultUnhandledErrorHandler - a function that handles an error unhandled by any other handler
        // gets the 'error' as its only parameter
    // defaultTestErrorHandler - is passed the current test, and should return a function that handles an error
module.exports = function(options) {

    // a variable that holds changeable state
    var state = {
        unhandledErrorHandler: options.defaultUnhandledErrorHandler
    }

    options.initialize(state)

    // the prototype of objects used to manage accessing and displaying results of a unit test
    var UnitTest = proto(function() {
        this.init = function(/*mainName=undefined, groups*/) {
            var that = this
            var args = arguments
            this.manager = EventManager(this)

            setTimeout(function() {
                runTest.call(that, args)
            },0)
        }

        this.events = function(handlers) {
            this.manager.add(handlers, options.getDomain())
            return this
        }

        this.results = function() {
            return processResults(this)
        }

        // private

        function runTest(args) {
            var fakeTest = new UnitTester()
                fakeTest.id = undefined // fake test doesn't get an id
                fakeTest.manager = this.manager
                fakeTest.timeouts = []
                fakeTest.onDoneCallbacks = []

                var getUnhandledErrorHandler = function() {
                    var unhandledErrorHandler = createUnhandledErrorHandler(fakeTest.mainSubTest)
                    getUnhandledErrorHandler = function() { // memoize this junk
                        return unhandledErrorHandler
                    }
                    return unhandledErrorHandler
                }
                fakeTest.mainTestState = {get unhandledErrorHandler(){return getUnhandledErrorHandler() || options.defaultTestErrorHandler(fakeTest)}}

                var warningInfoMessageHasBeenOutput = false
                this.manager.testObject.warningHandler = fakeTest.warningHandler = function(w) {
                    var errorHandler = getUnhandledErrorHandler()
                    if(warningInfoMessageHasBeenOutput === false) {
                        var warning = newError("You've received at least one warning. If you don't want to treat warnings as errors, use the `warning` method to redefine how to handle them.")
                        errorHandler(warning, false)
                        warningInfoMessageHasBeenOutput = true
                    }

                    errorHandler(w, false)
                }

                options.initializeMainTest(fakeTest.mainTestState)

                timeout(fakeTest, 3000, true) // initial (default) timeout
                fakeTest.onDone = function() { // will execute when this test is done
                    fakeTest.manager.lastEmitFuture.then(function() { // wait for all the already-registered emits to emit before finalizing the test
                        done(fakeTest)
                        options.mainTestDone(fakeTest.mainTestState)
                    }).done()
                }
                fakeTest.callOnDone = function(cb) {
                    fakeTest.onDoneCallbacks.push(cb)
                }

            UnitTester.prototype.test.apply(fakeTest, args) // set so the error handler can access the real test
            this.mainTester = fakeTest
            this.parentTester = fakeTest

            fakeTest.groupEnded = true
            checkGroupDone(fakeTest)
        }
    })

    var EventManager = proto(function() {

        this.init = function(testObject) {
            this.handlers = {
                group: [],
                assert: [],
                count: [],
                exception: [],
                log: [],
                end: [],
                groupEnd: [],
                before: [],
                after: [],
                beforeEnd: [],
                afterEnd: []
            }

            this.history = []
            this.emitDepth = 0 // records how many futures are waiting on eachother, so we can make sure maximum stack depth isn't exceeded
            this.lastEmitFuture = Future(undefined)
            this.testObject = testObject
        }

        this.testObject; // used to get the right warningHandler

        // emits an event
        // eventDataFuture resolves to either an eventData object, or undefined if nothing should be emitted
        this.emit = function(type, eventDataFuture) {
            var that = this
            var lastEmitFuture = that.lastEmitFuture // capture it for the possible setTimeout threadlet
            var doStuff = function(f) {
                var resultFuture = lastEmitFuture.then(function() {
                    return eventDataFuture
                }).then(function(eventData){
                    if(eventData !== undefined)
                        recordAndTriggerHandlers.call(that, type, eventData)
                }).catch(function(e) {
                    that.testObject.warningHandler(e)
                })

                if(f !== undefined) {
                    resultFuture.finally(function() {
                        setTimeout(function(){f.return()},0) // make sure we don't get a "too much recursion error" // todo: test not doing this once browsers all support proper tail calls
                    })
                    return f
                } else {
                    return resultFuture
                }
            }

            this.emitDepth++
            if(this.emitDepth % 40 === 0) { // 40 seems to be the magic number here for firefox - such a finicky browser
                that.lastEmitFuture = doStuff(new Future)
            } else {
                that.lastEmitFuture = doStuff()
            }

            return this.lastEmitFuture
        }

        // adds a set of listening handlers to the event stream, and runs those handlers on the stream's history
        // domain is optional, but if defined will be the node.js domain that unhandled errors will be routed to
        this.add = function(handlers, domain) {
            // run the history of events on the the handlers
            this.history.forEach(function(e) {
                if(handlers[e.type] !== undefined) {
                    handlers[e.type].call(undefined, e.data)
                }
            })

            // then have those handlers listen on future events
            for(var type in handlers) {
                var typeHandlers = this.handlers[type]
                if(typeHandlers === undefined) {
                    throw new Error("event type '"+type+"' invalid")
                }

                typeHandlers.push({handler: handlers[type], domain: domain})
            }
        }

        // the synchronous part of emitting
        function recordAndTriggerHandlers(type, eventData) {
            this.history.push({type:type, data: eventData})
            this.handlers[type].forEach(function(handlerInfo) {
                try {
                    handlerInfo.handler.call(undefined, eventData)
                } catch(e) {

                    // throw error asynchronously because these error should be separate from the test exceptions
                    var throwErrorFn = options.throwAsyncException

                    if(handlerInfo.domain) {
                        throwErrorFn = handlerInfo.domain.bind(throwErrorFn)    // this domain bind is needed because emit is done inside deadunit's test domain, which isn't where we want to put errors caused by the event handlers
                    }

                    throwErrorFn(e)
                }
            })
        }
    })

    function testGroup(tester, test) {

        // handles any error (synchronous or asynchronous errors)
        var handleError = createUnhandledErrorHandler(tester)

        var runTest = function() {
            try {
                test.call(tester, tester) // tester is both 'this' and the first parameter (for flexibility)
            } catch(e) {
                handleError(e, true).done()
            }
         }

        options.runTestGroup(state, tester, runTest, handleError)
    }

    function createUnhandledErrorHandler(tester) {

        var handleErrorInErrorHandler = function(warn, newError) {
            var textForOriginalError = newError.stack?newError.stack:newError

            if(warn !== false) {
                try {
                    tester.warningHandler(newError)
                } catch(warningHandlerError) {
                    var warningHandlerErrorText = warningHandlerError.stack?warningHandlerError.stack:warningHandlerErro

                    var errorception = new Error("An error happened in the error handler: "+warningHandlerErrorText+"\n"+textForOriginalError)
                    tester.manager.emit('exception', Future(errorception)).done() // if shit gets this bad, that sucks
                }
            } else {
                console.error(textForOriginalError)
            }
        }

        // warn should be set to false if the handler is being called to report a warning
        return function(e, warn) {
            if(tester.unhandledErrorHandler !== undefined) {
                try {
                    tester.unhandledErrorHandler(e)
                    return Future(undefined)

                } catch(newError) {     // error handler had an error...
                    handleErrorInErrorHandler(warn, newError)
                }
            }
            // else

            var errorToEmit = mapException(e, tester.warningHandler).catch(function(newError) {
                if(newError.message !== "Accessing the 'caller' property of a function or arguments object is not allowed in strict mode") { // stacktrace.js doesn't support IE for certain things
                    handleErrorInErrorHandler(warn, newError)
                }
                return Future(e) // use the original unmapped exception

            }).then(function(exception){
                return Future(exceptionEmitData(tester,exception))
            })

            var emitFuture = tester.manager.emit('exception', errorToEmit)
            return afterWaitingEmitIsComplete(tester, emitFuture)

        }
    }

    function exceptionEmitData(tester, e) {
        return {
            parent: tester.id,
            time: now(),
            error: e
        }
    }


    // the prototype of objects used to write tests and contain the results of tests
    var UnitTester = function(name, mainTester, parentTester) {
        if(!mainTester) mainTester = this

        this.id = groupid()
        this.mainTester = mainTester // the mainTester is used to easily figure out if the test results have been accessed (so early accesses can be detected)
        this.parentTester = parentTester // used to reset timeouts
        this.name = name

        this.doneTests = 0
        this.doneAsserts = 0
        this.runningTests = 0 // the number of subtests created synchronously
        this.doneCalled = false
        this.doSourcemappery = true // whether to do source mapping, if possible, within this test

        this.complete = new Future // resolved when done
    }

        UnitTester.prototype = {
            test: function() {
                if(arguments.length === 1) {
                    var test = arguments[0]

                // named test
                } else {
                    var name = arguments[0]
                    var test = arguments[1]
                }

                var that = this
                this.runningTests++

                var tester = new UnitTester(name, this.mainTester, this)
                tester.manager = this.manager
                tester.doSourcemappery = this.doSourcemappery // inherit from parent test
                tester.warningHandler = this.warningHandler

                if(this.id === undefined) { // ie its the top-level fake test
                    this.mainSubTest = tester
                }

                tester.onDone = function() { // will execute when this test is done
                    that.doneTests += 1

                    that.manager.emit('groupEnd', Future({
                        id: tester.id,
                        time: now()
                    }))

                    try {
                        tester.complete.return()
                    } catch(e) {
                        createUnhandledErrorHandler(tester)(e)
                    }

                    checkGroupDone(that)
                }

                tester.mainTester.callOnDone(function() {
                    if(!tester.doneCalled) { // a timeout happened - end the test
                        tester.doneCalled = true
                        that.manager.emit('groupEnd', Future({
                            id: tester.id,
                            time: now()
                        }))
                    }
                })

                this.manager.emit('group', Future({
                    id: tester.id,
                    parent: this.id,
                    name: name,
                    time: now()
                }))

                if(this.beforeFn) {
                    this.manager.emit('before', Future({
                        parent: tester.id,
                        time: now()
                    }))

                    this.beforeFn.call(this, this)

                    this.manager.emit('beforeEnd', Future({
                        parent: tester.id,
                        time: now()
                    }))
                }

                testGroup(tester, test)

                if(this.afterFn) {
                    this.manager.emit('after', Future({
                        parent: tester.id,
                        time: now()
                    }))

                    this.afterFn.call(this, this)

                    this.manager.emit('afterEnd', Future({
                        parent: tester.id,
                        time: now()
                    }))
                }

                tester.groupEnded = true
                checkGroupDone(tester)

                return tester
            },

            ok: function(success, actualValue, expectedValue) {
                this.doneAsserts += 1
                afterWaitingEmitIsComplete(this, assert(this, success, actualValue, expectedValue, 'assert', "ok")).done()
            },
            eq: function(actualValue, expectedValue) {
                this.doneAsserts += 1
                afterWaitingEmitIsComplete(this, assert(this, expectedValue === actualValue, actualValue, expectedValue, 'assert', "eq")).done()
            },
            count: function(number) {
                if(this.countExpected !== undefined)
                    throw Error("count called multiple times for this test")
                this.countExpected = number

                afterWaitingEmitIsComplete(this,assert(this, undefined, undefined, number, 'count', "count")).done()
            },

            before: function(fn) {
                if(this.beforeFn !== undefined)
                    throw Error("before called multiple times for this test")

                this.beforeFn = fn
            },
            after: function(fn) {
                if(this.afterFn !== undefined)
                    throw Error("after called multiple times for this test")

                this.afterFn = fn
            },

            log: function(/*arguments*/) {
                this.manager.emit('log', Future({
                    parent: this.id,
                    time: now(),
                    values: Array.prototype.slice.call(arguments, 0)
                }))
            },

            timeout: function(t) {
                timeout(this, t, false)
            },

            error: function(handler) {
                this.unhandledErrorHandler = handler
            },
            warning: function(handler) {
                this.warningHandler = handler
            },

            sourcemap: function(doSourcemappery) {
                this.doSourcemappery = doSourcemappery
            }
        }

    function afterWaitingEmitIsComplete(that, assertFuture) {
        return assertFuture.finally(function() {
            checkGroupDone(that)
        })
    }

    function checkGroupDone(group) {
        if(!group.doneCalled && group.groupEnded === true
            && ((group.countExpected === undefined || group.countExpected <= group.doneAsserts+group.doneTests)
                && group.runningTests === group.doneTests)
        ) {
            group.doneCalled = true // don't call twice
            group.onDone()
        }

    }

    function done(unitTester) {
        if(unitTester.mainTester.ended) {
            unitTester.mainTester.manager.emit('exception', Future({
                parent: unitTester.mainTester.mainSubTest.id,
                time: now(),
                error: newError("done called more than once (probably because the test timed out before it finished)")
            }))
        } else {
            unitTester.mainTester.timeouts.forEach(function(to) {
                clearTimeout(to)
            })
            unitTester.mainTester.timeouts = []

            endTest(unitTester, 'normal')
        }
    }

    function timeout(unitTester, t, theDefault) {
        var timeouts = unitTester.mainTester.timeouts

        unitTester.timeoutTime = t

        if(theDefault) {
            timeouts.defaultTimeout = true
        } else if(unitTester === unitTester.mainTester && timeouts.defaultTimeout) { // if a timeout is the default, it can be overridden
            clearTimeout(unitTester.timeoutHandle)
            remove(timeouts, unitTester.timeoutHandle)
            timeouts.defaultTimeout = undefined
            delete unitTester.timeoutHandle
        }

        setTesterTimeout(unitTester)
    }

    // sets or resets a timeout for a unitTester
    function setTesterTimeout(unitTester) {
        var timeouts = unitTester.mainTester.timeouts
        if(unitTester.timeoutHandle !== undefined) {
            clearTimeout(unitTester.timeoutHandle)
            remove(timeouts, unitTester.timeoutHandle)
        }

        unitTester.timeoutHandle = setTimeout(function() {
            remove(timeouts, unitTester.timeoutHandle)
            delete unitTester.timeoutHandle

            if(timeouts.length === 0 && !unitTester.mainTester.ended) {
                endTest(unitTester.mainTester, 'timeout')
            }
        }, unitTester.timeoutTime)

        timeouts.push(unitTester.timeoutHandle)
    }

    // removes an item from an array
    function remove(array, item) {
        var index = array.indexOf(item)
        if(index !== -1)
            array.splice(index, 1) // no longer throwing Error("Item doesn't exist to remove") if there's nothing to remove - in the case that mainTester.timeouts gets set back to [] (when done), it won't be there

    }

    function endTest(that, type) {
        that.mainTester.ended = true

        if(that.mainTester === that) { // if its the main tester
            that.onDoneCallbacks.forEach(function(cb) {
                cb()
            })
        }

        setTimeout(function() { // setTimeout here is to make it so the currently running threadlet that caused the test to end can finish before the end event is sent
            that.manager.emit('end', Future({
                type: type,
                time: now()
            }))
        },0)
    }

    // type - either "count" or "assert"
    function assert(that, success, actualValue, expectedValue, type, functionName/*="ok"*/, lineInfo/*=dynamic*/, stackIncrease/*=0*/) {
        if(!stackIncrease) stackIncrease = 1
        if(!functionName) functionName = "ok"
        if(!lineInfo)
            var lineInfoFuture = getLineInformation(functionName, stackIncrease, that.doSourcemappery, that.warningHandler)
        else
            var lineInfoFuture = Future(lineInfo)

        // reste timeouts up the chain
        var cur = that
        while(cur !== undefined) {
            setTesterTimeout(cur)
            cur = cur.parentTester
        }

        var emitData = lineInfoFuture.then(function(lineInfo) {
            var result = lineInfo
            result.type = 'assert'
            if(type !=='count') result.success = success === true

            if(actualValue !== undefined)     result.actual = actualValue
            if(expectedValue !== undefined)   result.expected = expectedValue

            result.parent = that.id
            result.time = now()

           return Future(result)
        })

        return that.manager.emit(type, emitData)
    }


    function getLineInformation(functionName, stackIncrease, doSourcemappery, warningHandler) {

        var file, line, column, lineinfo;
        return options.getLineInfo(stackIncrease).then(function(info){
            lineinfo = info
            return getSourceMapConsumer(info.file, warningHandler)
        }).catch(function(e){
            warningHandler(e)
            return Future(undefined)

        }).then(function(sourceMapConsumer) {
            if(sourceMapConsumer !== undefined && doSourcemappery) {

                var mappedInfo = getMappedSourceInfo(sourceMapConsumer, lineinfo.file, lineinfo.line, lineinfo.column)
                file = mappedInfo.file
                line = mappedInfo.line
                column = mappedInfo.column
                var sourceLines = mappedInfo.sourceLines

                var multiLineSearch = !mappedInfo.usingOriginalFile // don't to a multi-line search if the source has been mapped (the file might not be javascript)
            } else {
                file = lineinfo.file
                line = lineinfo.line
                column = lineinfo.column
                var sourceLines = undefined
                var multiLineSearch = true
            }

            return getFunctionCallLines(sourceLines, file, functionName, line, multiLineSearch, warningHandler)

        }).catch(function(e) {
            warningHandler(e)
            return Future("<source not available>")
        }).then(function(sourceLines) {
            return Future({
                sourceLines: sourceLines,
                file: path.basename(file),
                line: line,
                column: column
            })
        })
    }

    // returns the line, column, and filename mapped from a source map
    // appropriately handles cases where some information is missing
    function getMappedSourceInfo(sourceMapConsumer, originalFilePath, originalLine, originalColumn, originalFunctionName) {
        var sourceMapInfo = sourceMapConsumer.originalPositionFor({line:originalLine, column:originalColumn||0})       // the 0 is for browsers (like firefox) that don't output column numbers
        var line = sourceMapInfo.line
        var column = sourceMapInfo.column
        var fn = sourceMapInfo.name

        if(sourceMapInfo.source !== null) {
            var relative = isRelative(sourceMapInfo.source)

            /* I don't think this is needed any longer, and probably isn't correct - this was working around an issue in webpack: See https://github.com/webpack/webpack/issues/559 and https://github.com/webpack/webpack/issues/238
            if(sourceMapConsumer.sourceRoot !== null) {
                sourceMapInfo.source = sourceMapInfo.source.replace(sourceMapConsumer.sourceRoot, '') // remove sourceRoot
            }*/

            if(relative) {
                var file = Url.resolve(originalFilePath, path.basename(sourceMapInfo.source))
            } else {
                var file = sourceMapInfo.source
            }


            var originalFile = true
        } else {
            var file = originalFilePath
            var originalFile = false
        }

        if(fn === null || !originalFile) {
            fn = originalFunctionName
        }
        if(line === null || !originalFile) {
            line = originalLine
            column = originalColumn
        }
        if(column === null) {
            column = undefined
        }

        if(file != undefined && sourceMapConsumer.sourcesContent != undefined) { // intentional single !=
            var index = sourceMapConsumer.sources.indexOf(file)
            var sourceLines = sourceMapConsumer.sourcesContent[index]
            if(sourceLines !== undefined) sourceLines = sourceLines.split('\n')
        }

        return {
            file: file,
            function: fn,
            line: line,
            column: column,
            usingOriginalFile: originalFile,
            sourceLines: sourceLines
        }
    }

    // gets the actual lines of the call
    // if multiLineSearch is true, it finds
    function getFunctionCallLines(sourcesContent, filePath, functionName, lineNumber, multiLineSearch, warningHandler) {
        if(sourcesContent !==  undefined) {
            var source = Future(sourcesContent)
        } else {
            var source = options.getScriptSourceLines(filePath)
        }
        return source.catch(function(e) {
            warningHandler(e)
            return Future(undefined)

        }).then(function(fileLines) {
            if(fileLines !== undefined) {

                var startLine = findStartLine(fileLines, functionName, lineNumber)
                if(startLine === 'lineOfCodeNotFound') {
                    return Future("<line of code not found (possibly an error?)> ")

                } else if(startLine !== 'sourceNotAvailable') {
                    if(multiLineSearch) {
                        return Future(findFullSourceLine(fileLines, startLine))
                    } else {
                        return Future(fileLines[startLine].trim())
                    }
                }
            }
            // else
            return Future("<source not available>")

        })
    }

    var sourceMapConsumerCache = {} // a map from a script url to a future of its SourceMapConsumer object (null means no sourcemap exists)
    function getSourceMapConsumer(url, warningHandler) {
        if(sourceMapConsumerCache[url] === undefined) {
            try {
                sourceMapConsumerCache[url] = options.getSourceMapObject(url, warningHandler).then(function(sourceMapObject) {
                    if(sourceMapObject !== undefined) {
                        if(sourceMapObject.version === undefined) {
                            warningHandler(new Error("Sourcemap for "+url+" doesn't contain the required 'version' property. Assuming version 2."))
                            sourceMapObject.version = 2 // assume version 2 to make browserify's broken sourcemap format that omits the version
                        }
                        return Future(new SourceMapConsumer(sourceMapObject))
                    } else {
                        return Future(undefined)
                    }
                })
            } catch(e) {
                sourceMapConsumerCache[url] = Future(undefined)
                warningHandler(e)
            }
        }

        return sourceMapConsumerCache[url]
    }

    // takes an exception and returns a future exception that has a stacktrace with sourcemapped tracelines
    function mapException(exception, warningHandler) {
        try {
            if(exception instanceof Error) {
                var stacktrace;
                return options.getExceptionInfo(exception).then(function(trace){
                    stacktrace = trace

                    var smcFutures = []
                    for(var n=0; n<trace.length; n++) {
                        if(trace[n].file !== undefined) {
                            smcFutures.push(getSourceMapConsumer(trace[n].file, warningHandler))
                        } else {
                            smcFutures.push(Future(undefined))
                        }
                    }

                    return Future.all(smcFutures)
                }).then(function(sourceMapConsumers) {
                    var CustomMappedException = proto(MappedException, function() {
                        // set the name so it looks like the original exception when printed
                        // this subclasses MappedException so that name won't be an own-property
                        this.name = exception.name
                    })

                    try {
                        throw CustomMappedException(exception, stacktrace, sourceMapConsumers)  // IE doesn't give exceptions stack traces unless they're actually thrown
                    } catch(mappedExcetion) {
                        return Future(mappedExcetion)
                    }
                })
            } else {
                return Future(exception)
            }
        } catch(e) {
            var errorFuture = new Future
            errorFuture.throw(e)
            return errorFuture
        }
    }

    // an exception where the stacktrace's files and lines are mapped to the original file (when applicable)
    var MappedException = proto(Error, function(superclass) {

        // constructor. Takes the parameters:
            // originalError
            // traceInfo - an array where each element is an object containing information about that stacktrace line
            // sourceMapConsumers - an array of the same length as traceInfo where each element is the sourcemap consumer for the corresponding info in traceInfo
        this.init = function(originalError, traceInfo, sourceMapConsumers) {
            superclass.call(this, originalError.message)

            for(var p in originalError) {
                if(Object.hasOwnProperty.call(originalError, p)) {
                    try {
                        this[p] = originalError[p]
                    } catch(e) {
                        console.log("Error setting property "+p+' with value '+originalError[p])
                    }
                }
            }

            var newTraceLines = []
            for(var n=0; n<traceInfo.length; n++) {
                var info = traceInfo[n]
                if(sourceMapConsumers[n] !== undefined) {
                    info = getMappedSourceInfo(sourceMapConsumers[n], info.file, info.line, info.column, info.function)
                }

                var fileLineColumn = info.line
                if(info.column !== undefined) {
                    fileLineColumn += ':'+info.column
                }
                if(info.file !== undefined) {
                    fileLineColumn = info.file+':'+fileLineColumn
                }

                var traceLine = "    at "
                if(info.function !== undefined) {
                    traceLine += info.function+' ('+fileLineColumn+')'
                } else {
                    traceLine += fileLineColumn
                }

                newTraceLines.push(traceLine)
            }

            Object.defineProperty(this, 'stack', {
                get: function() {
                    return this.name+': '+this.message+'\n'+newTraceLines.join('\n')
                }
            })
        }
    })

    // attempts to find the full function call expression (over multiple lines) given the sources lines and a starting point
    function findFullSourceLine(fileLines, startLine) {
        var lines = []
        var parenCount = 0
        var mode = 0 // mode 0 for paren searching, mode 1 for double-quote searching, mode 2 for single-quote searching
        var lastWasBackslash = false // used for quote searching
        for(var n=startLine; n<fileLines.length; n++) {
            var line = fileLines[n]
            lines.push(line.trim())

            for(var i=0; i<line.length; i++) {
                var c = line[i]

                if(mode === 0) {
                    if(c === '(') {
                        parenCount++
                        //if(parenCount === 0) {
                          //  return lines.join('\n') // done
                        //}
                    } else if(c === ')' && parenCount > 0) {
                        parenCount--
                        if(parenCount === 0) {
                            return lines.join('\n') // done
                        }
                    } else if(c === '"') {
                        mode = 1
                    } else if(c === "'") {
                        mode = 2
                    }
                } else if(mode === 1) {
                    if(c === '"' && !lastWasBackslash) {
                        mode = 0
                    }

                    lastWasBackslash = c==='\\'
                } else { // mode === 2
                    if(c === "'" && !lastWasBackslash) {
                        mode = 0
                    }

                    lastWasBackslash = c==='\\'
                }
            }
        }

        return lines.join('\n') // if it gets here, something minor went wrong
    }

    // finds the line a function started on given the file's lines, and the stack trace line number (and function name)
    // returns undefined if something went wrong finding the startline
    function findStartLine(fileLines, functionName, lineNumber) {
        var startLine = lineNumber - 1
        while(true) {
            if(startLine < 0) {
                return 'lineOfCodeNotFound' // something went wrong if this is being returned (the functionName wasn't found above - means you didn't get the function name right)
            }

            var line = fileLines[startLine]
            if(line === undefined) {
                return 'sourceNotAvailable'
            }

            //lines.push(line.trim())
            var containsFunction = line.indexOf(functionName) !== -1
            if(containsFunction) {
                return startLine
            }

            startLine--
        }
    }

    function groupid() {
        groupid.next++
        return groupid.next
    }
    groupid.next = -1

    // returns a Unix Timestamp for now
    function now() {
        return (new Date()).getTime()
    }

    return {
        test: UnitTest
    }
}

function newError(message, ErrorPrototype) {
    try {
        throw new Error(message) // IE needs an exception to be actually thrown to get a stack trace property
    } catch(e) {
        return e
    }
}


/***/ }),
/* 29 */
/*!***********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/proto/proto.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var noop = function() {}

var prototypeName='prototype', undefined, protoUndefined='undefined', init='init', ownProperty=({}).hasOwnProperty; // minifiable variables
function proto() {
    var args = arguments // minifiable variables

    if(args.length == 1) {
        var parent = {init: noop}
        var prototypeBuilder = args[0]

    } else { // length == 2
        var parent = args[0]
        var prototypeBuilder = args[1]
    }

    // special handling for Error objects
    var namePointer = {}    // name used only for Error Objects
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

    var constructorName = prototype.name?prototype.name:''
    if(prototype[init] === undefined || prototype[init] === noop) {
        var ProtoObjectFactory = new Function('F',
            "return function " + constructorName + "(){" +
                "return new F()" +
            "}"
        )(F)
    } else {
        // dynamically creating this function cause there's no other way to dynamically name a function
        var ProtoObjectFactory = new Function('F','i','u','n', // shitty variables cause minifiers aren't gonna minify my function string here
            "return function " + constructorName + "(){ " +
                "var x=new F(),r=i.apply(x,arguments)\n" +    // populate object via the constructor
                "if(r===n)\n" +
                    "return x\n" +
                "else if(r===u)\n" +
                    "return n\n" +
                "else\n" +
                    "return r\n" +
            "}"
        )(F, prototype[init], proto[protoUndefined]) // note that n is undefined
    }

    prototype.constructor = ProtoObjectFactory;    // set the constructor property on the prototype

    // add all the prototype properties onto the static class as well (so you can access that class when you want to reference superclass properties)
    for(var n in prototype) {
        addProperty(ProtoObjectFactory, prototype, n)
    }

    // add properties from parent that don't exist in the static class object yet
    for(var n in parent) {
        if(ownProperty.call(parent, n) && ProtoObjectFactory[n] === undefined) {
            addProperty(ProtoObjectFactory, parent, n)
        }
    }

    ProtoObjectFactory.parent = parent;            // special parent property only available on the returned proto class
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
                },
                configurable: true // so you can change it if you want
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

/***/ }),
/* 30 */
/*!***********************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/source-map-generator.js ***!
  \***********************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(/*! ./base64-vlq */ 31);
var util = __webpack_require__(/*! ./util */ 11);
var ArraySet = __webpack_require__(/*! ./array-set */ 32).ArraySet;
var MappingList = __webpack_require__(/*! ./mapping-list */ 78).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 31 */
/*!*************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/base64-vlq.js ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(/*! ./base64 */ 77);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),
/* 32 */
/*!************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/array-set.js ***!
  \************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ 11);
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;


/***/ }),
/* 33 */
/*!*************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/src/isRelative.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ 8)

module.exports = function isRelative(p) {
    var normal = path.normalize(p)
    var absolute = path.resolve(p)
    return normal != absolute && p.indexOf('://') === -1// second part for urls
}

/***/ }),
/* 34 */
/*!******************************************!*\
  !*** ../node_modules/blockStyleUtils.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// some functionality that is needed by Gem.js but is related to styling (some things are also needed by Style.js)

var HashMap = __webpack_require__(/*! hashmap */ 35)

var Style = __webpack_require__(/*! ./Style */ 5)
var utils = __webpack_require__(/*! ./utils */ 19)

var defaultStyleMap = new HashMap() // maps from a proto class to its computed default style
var computedStyles = new HashMap() // stores a map from styleMap components, to the combined style map


// gets the right style from the styleMap, depending on the gem's `name` and `label` (`label` styles take precedence)
// takes the component's inheritance tree into account (relies on the gem.constructor.parent property)
var getStyleMapEntryForGem = exports.getStyleForComponent = function (styleMap, gem) {
    if(styleMap === undefined)
        return undefined

    return getStyleForLabel(styleMap, gem) || getStyleForGemName(styleMap, gem)
}

var getStyleForLabel = exports.getStyleForLabel = function(styleMap, gem) {
    if(gem.label !== undefined && '$'+gem.label in styleMap) {
        return styleMap['$'+gem.label]
    }
}
var getStyleForGemName = exports.getStyleForBlockName = function(styleMap, gem) {
    var constructor = gem.constructor
    while(constructor !== undefined) {
        var style = styleMap[constructor.name]
        if(style !== undefined) {
            return style
        } else {
            constructor = constructor.parent
        }
    }
}

// gets the possibly inheriting style from the styleMap for `gem`
// gem - the gem to get the style for
// ancestor - the gem to get the computedStyleMap from
var getInheritingStyle = exports.getInheritingStyle = function(gem) {
    var ancestor = gem.parent
    if(ancestor === undefined || ancestor.computedStyleMap === undefined) return undefined

    if(gem.label !== undefined) {
        var styleMapKey = '$'+gem.label
        var nextContructor = gem.constructor
    } else {
        var styleMapKey = gem.constructor.name
        var nextContructor = gem.constructor.parent
    }

    var nextAncestorToSearchFrom = ancestor
    var styles = [], inherit = true
    while(nextAncestorToSearchFrom !== undefined) {    // find styles from the most specific name to the least specific
        var stylesForKey = findStylesForStyleMapKey(nextAncestorToSearchFrom, styleMapKey)
        styles = styles.concat(stylesForKey.styles)
        nextAncestorToSearchFrom = stylesForKey.nextAncestorToSearchFrom
        inherit = stylesForKey.inherit

        if(nextContructor === undefined || !inherit) {
            break
        } else {
            if(styleMapKey === 'Gem') {
                break // we're done - no need to check anything higher in the prototype chain than Gem
            }

            styleMapKey = nextContructor.name
            nextContructor = nextContructor.parent
        }
    }

    var reversedStyles = styles.reverse() // reverse so later styles override earlier styles
    var styleToReturn = reversedStyles[0]
    for(var n=1; n<reversedStyles.length; n++) {
        styleToReturn = styleToReturn.mix(reversedStyles[n], false)
    }

    return styleToReturn


    function findStylesForStyleMapKey(startAncestor, key) {
        var styles = [], inherit = true
        var curAncestor = startAncestor, nextAncestorToSearchFrom = startAncestor
        while(curAncestor !== undefined) {                                // find styles from the closest parent to the farthest
            if(curAncestor.computedStyleMap !== undefined) {
                var style = curAncestor.computedStyleMap[key]
            }
            if(style !== undefined) {
                if(styles.indexOf(style) === -1) {
                    styles.push(style)
                }
                nextAncestorToSearchFrom = curAncestor

                inherit = style.inherit
                if(!inherit) {
                    break
                }
            }

            curAncestor = curAncestor.parent
        }

        return {styles:styles, nextAncestorToSearchFrom: nextAncestorToSearchFrom, inherit:inherit}
    }
}

// returns the conjunction of two style maps
// gets it from the computedStyles cache if its already in there
var styleMapConjunction = exports.styleMapConjunction = function (secondaryStyleMap, primaryStyleMap) {
    if(secondaryStyleMap === undefined) return primaryStyleMap
    if(primaryStyleMap === undefined) return secondaryStyleMap

    var cachedStyleMap = computedStyles.get([secondaryStyleMap, primaryStyleMap])
    if(cachedStyleMap === undefined) {
        if(secondaryStyleMap  === undefined) {
            cachedStyleMap = primaryStyleMap
        } else if(primaryStyleMap === undefined) {
            cachedStyleMap = secondaryStyleMap
        } else {
            var overridingProperties = {}, atLeastOne = false
            for(var key in primaryStyleMap) {
                if(secondaryStyleMap[key] !== primaryStyleMap[key]) {
                    overridingProperties[key] = primaryStyleMap[key]
                    atLeastOne = true
                }
            }

            if(atLeastOne) {
                cachedStyleMap = utils.objectConjunction(secondaryStyleMap, overridingProperties)
            } else { // the styleMaps are different objects, but contain the same thing
                cachedStyleMap = secondaryStyleMap
            }
        }

        if(cachedStyleMap === undefined) cachedStyleMap = false // switch it out with false so it can be recognized
        computedStyles.set([secondaryStyleMap, primaryStyleMap], cachedStyleMap)
    }

    if(cachedStyleMap === false) {
        return undefined
    }
    return cachedStyleMap
}



exports.getDefaultStyle = function(gem)  {
    // attempt to get from the cache
    var defaultGemStyle = defaultStyleMap.get(gem.constructor)
    if(defaultGemStyle === undefined) {
        defaultGemStyle = createDefaultGemStyle(gem)
        if(defaultGemStyle === undefined) defaultGemStyle = false
        defaultStyleMap.set(gem.constructor, defaultGemStyle)
    }

    if(defaultGemStyle === false) {
        return undefined
    }
    return defaultGemStyle
}

// returns a new style with style b mixed into style a (works even if they're both undefined)
var mixStyles = exports.mixStyles = function(a,b) {
    if(a === undefined)
        return b
    else
        return a.mix(b, false)
}





// sets the currentStyle of a gem and makes all the appropriate changes to render a new active style for the gem and its children
exports.setCurrentStyle = function(gem, newCurrentStyle, defaultStyle) {

    var current$state = gem._currentStyle === undefined? undefined: gem._currentStyle.stateHandler
    var newCurrentStyle$state = newCurrentStyle === undefined? undefined: newCurrentStyle.stateHandler
    if(current$state !== newCurrentStyle$state) {     // if the $state function remains the same, we don't gotta do nothin (about switching state functions at least)
        if(gem._stateChangeHandler !== undefined) {  // remove the old handler if necessary
            gem.state.removeListener('change', gem._stateChangeHandler)
            gem._stateChangeHandler = undefined
        }

        if(newCurrentStyle$state !== undefined) {     // add a new handler if necessary
            gem.state.on('change', gem._stateChangeHandler = function() {
                var rawStateStyle = getStateStyle(gem._currentStyle, gem.state.subject)
                setMixedStateStyle(gem, mixStyles(gem._currentStyle, rawStateStyle))
            })
        }
    }

    gem._currentStyle = newCurrentStyle
    var rawStateStyle = getStateStyle(newCurrentStyle, gem.state.subject)

    var newMixedStateStyle = mixStyles(newCurrentStyle, rawStateStyle)
    setMixedStateStyle(gem, newMixedStateStyle, defaultStyle)
}


// handles reseting a gem's active style when its state style changes
// renders the pseudoclass style
function setMixedStateStyle(gem, mixedStateStyle, defaultStyle) {
    var psuedoclassState = {}

    // if a pseudoclass can no longer apply, undo its setup
    for(var pseudoClass in gem._styleSetupInfo) {
        if(mixedStateStyle === undefined || !(pseudoClass in mixedStateStyle.pseudoclasses.emulatedInfo)) {
            var setupInfo = gem._styleSetupInfo[pseudoClass]
            setupInfo.kill(gem, setupInfo.state)
            delete gem._styleSetupInfo[pseudoClass]
        }
    }

    // setup new pseudoclasses
    if(mixedStateStyle !== undefined) {
        for(var pseudoClass in mixedStateStyle.pseudoclasses.emulatedInfo) {
            if(!(pseudoClass in gem._styleSetupInfo)) {                     // if this exact pseudoclass is already setup, no need to do anything
                ;(function(pseudoClass, emulationInfo){   // close over those variables (so they keep the value they had when the function was setup)
                    var setupState = emulationInfo.fns.setup(gem, function() { // start
                        var changed = psuedoclassState[pseudoClass] !== true
                        if(changed) {
                            psuedoclassState[pseudoClass] = true
                            changeStyleIfNecessary()
                        }
                    }, function() { // end
                        var changed = psuedoclassState[pseudoClass] !== false
                        if(changed) {
                            psuedoclassState[pseudoClass] = false
                            changeStyleIfNecessary()
                        }
                    }, emulationInfo.parameter)

                    gem._styleSetupInfo[pseudoClass] = {state: setupState, kill: emulationInfo.fns.kill}

                })(pseudoClass, mixedStateStyle.pseudoclasses.emulatedInfo[pseudoClass])
            }
        }
    }

    // build up the pseudoclass state - depending on what pseudoclasses might become applicable
    if(mixedStateStyle !== undefined) {
        for(var pseudoclassKey in mixedStateStyle.pseudoclasses.emulatedInfo) {
            var info = mixedStateStyle.pseudoclasses.emulatedInfo[pseudoclassKey]
            psuedoclassState[pseudoclassKey] = info.fns.check(gem, info.parameter)
        }
    }

    // set current pseudoclass style
    changeStyleIfNecessary()


    function changeStyleIfNecessary() {
        var pseudoclassStyleInfo = getPseudoclassStyleFor(mixedStateStyle, psuedoclassState)
//        if(pseudoclassStyleInfo.style !== undefined && pseudoclassStyleInfo.style.inherit) {
//            pseudoclassStyleInfo.style = getInheritingStyle(gem).mix(pseudoclassStyleInfo.style, false)
//        }

        var newPreStyleMapStyle = mixStyles(mixedStateStyle, pseudoclassStyleInfo.style)
        setPreStyleMapStyle(gem, newPreStyleMapStyle, pseudoclassStyleInfo.index, defaultStyle)
    }
}

// sets the style before being modified by the gem's parent's computedStyleMap
// handles removing the state listener and calling $kill on the old activeStyle
function setPreStyleMapStyle(gem, newPreStyleMapStyle, jsRenderedPseudoclassIndex, defaultStyle) {
    if(gem.parent !== undefined && newPreStyleMapStyle !== undefined)
        var newComputedStyleMap = styleMapConjunction(gem.parent.computedStyleMap, newPreStyleMapStyle.componentStyleMap)
    else if(gem.parent !== undefined)
        var newComputedStyleMap = gem.parent.computedStyleMap
    else if(newPreStyleMapStyle !== undefined)
        var newComputedStyleMap = newPreStyleMapStyle.componentStyleMap
    else
        var newComputedStyleMap = undefined

    var newActiveStyle = undefined // can be changed below
    var cancel = false
    if(newPreStyleMapStyle !== undefined) {
        if(gem.parent !== undefined) var nativePseudoclassMap = gem.parent._nativePseudoclassMap
        else                           var nativePseudoclassMap = {}

        var nativePseudoclassSelectorMap = getStyleMapEntryForGem(nativePseudoclassMap, gem)
        var nativeCssInfo = newPreStyleMapStyle.createNativeCssInfo(gem, newComputedStyleMap, nativePseudoclassSelectorMap, jsRenderedPseudoclassIndex, defaultStyle)

        if(nativeCssInfo.cancel) {
            cancel = true
            setMixedStateStyle(gem, nativeCssInfo.retryStyle)

        } else {
            newActiveStyle = nativeCssInfo.style
            newComputedStyleMap = nativeCssInfo.styleMap // even newer!
            gem._nativePseudoclassMap = nativeCssInfo.nativePseudoclassMap
        }
    }

    if(!cancel) {
        setActiveStyle(gem, newActiveStyle, newComputedStyleMap)
    }
}

// sets the active style on the gem and on the gem's children
// also sets the gem's new computedStyleMap
function setActiveStyle(gem, newActiveStyle, newComputedStyleMap) {
    var activeStyleChanged = newActiveStyle !== gem._activeStyle
    var computedStyleMapChanged = gem.computedStyleMap !== newComputedStyleMap

    if(activeStyleChanged) {
        setStyleClass(gem, newActiveStyle)

        var curActiveStyle$setup = gem._activeStyle === undefined? undefined: gem._activeStyle.setup
        var newActiveStyle$setup = newActiveStyle === undefined? undefined: newActiveStyle.setup
        if(curActiveStyle$setup !== newActiveStyle$setup) {
            applyStyleKillFunction(gem)
            applyStyleSetupFunction(gem, newActiveStyle)
        }

        gem._activeStyle = newActiveStyle
    }


    gem.computedStyleMap = newComputedStyleMap

    // propogate styles to children
    gem.children.forEach(function(child) {
        if(computedStyleMapChanged || !child.attached) {
            setAttachStatus(child, true)
            child.style = child.style  // force a re-render on each child
        }
    })
}

var setAttachStatus = exports.setAttachStatus = function(node, attached) {
    node.attached = attached
    if(attached) {
        node.emit('attach')
    } else {
        node.emit('detach')
        node.children.forEach(function(child) {
            setAttachStatus(child, false)
        })
    }
}


// given a style and an object representing some state, returns the state given by the style's $state function
// returns undefined if it doesn't have a state function
// handles caching state styles (an optimization)
function getStateStyle(currentStyle, stateParameter) {
    if(currentStyle === undefined || currentStyle.stateHandler === undefined) return undefined

    var returnedStyle = currentStyle.stateHandler(stateParameter)

    // todo: figure out if this style has been returned before, and if so, use the already-generated style (mostly so that that style can take advantage of other cached combinations)

    return returnedStyle
}

// returns an object with the properties:
    // style - the jsRendered pseudoclass style for the gem's relevant pseudoclass state
    // index - the index of the pseudoclass (jsRenderedPseudoclassIndex)
// returns undefined if no emulated pseudoclass style applies or if only native pseudoclass stylings apply
// state - an object that will be mutated with the current state for each pseudoclass
function getPseudoclassStyleFor(style, state) {
    if(style === undefined) return {index:0}

    var index = 0, result={index:0}
    style.pseudoclasses.classes.forEach(function(psuedoclassStyle, compoundKey) {
        if(!psuedoclassStyle.pureNative) {
            for(var j=0; j<compoundKey.length; j++) {
                var pseudoclass = compoundKey[j]
                if(!state[pseudoclass]) {
                    break;
                }
            }

            if(j === compoundKey.length) {
                result = {index: index, style: psuedoclassStyle}
            }
        }

        index++
    })

    return result
}



// finds the default style for a gem, mixes it with the appropriate ancestor styles, and returns the result
function createDefaultGemStyle(that) {
    if(that.defaultStyle !== undefined) {
        var defaultStyle = getStyleObject(that.defaultStyle)
    }

    // get list of default styles
    var defaultStyles = []
    var nextConstructor = that.constructor
    while(nextConstructor !== undefined) {
        if(nextConstructor.defaultStyle !== undefined) {
            defaultStyles.push(nextConstructor.defaultStyle)
        }
        nextConstructor = nextConstructor.parent
    }

    // generate merged default style
    var reversedDefaults = defaultStyles.reverse()
    var mergedDefaultStyle = reversedDefaults[0]
    for(var n=1; n<reversedDefaults.length; n++) {
        mergedDefaultStyle = mergedDefaultStyle.mix(reversedDefaults[n], false)
    }

    return mergedDefaultStyle
}


// applies setup appropriately
function applyStyleSetupFunction(component, style) {
    if(style !== undefined && style.setup !== undefined) {
        component._styleSetupObject = style.setup(component, style) // call setup on the component
    } else {
        component._styleSetupObject = undefined
    }
}
// applies kill appropriately
function applyStyleKillFunction(component) {
    var activeStyle = component._activeStyle
    if(activeStyle !== undefined && activeStyle.setup !== undefined) {
        if(activeStyle.kill === undefined)
            throw new Error('style has been unset but does not have a "kill" function to undo its "setup" function')

        activeStyle.kill(component, component._styleSetupObject)
    }
}


// sets the style, replacing one if one already exists
function setStyleClass(component, style) {
    var activeStyle = component._activeStyle

    //var newStyle = component.domNode.className
    if(activeStyle !== undefined) {
        component.domNode.classList.remove(activeStyle.className)
        // newStyle = newStyle.replace(new RegExp(" ?\\b"+activeStyle.className+"\\b"),'') // remove the previous css class
    }
    if(style !== undefined) {
        component.domNode.classList.add(style.className)
        //newStyle = style.className+' '+newStyle.trim() // note that the order of classes doesn't matter
    }

    //component.domNode.className = newStyle
}

var styleObjectMap = new HashMap // maps javascript object styles to Style objects
var getStyleObject = exports.getStyleObject = function(style) {
    if(isStyleObject(style)) {
        return style
    } else {
        var styleObject = styleObjectMap.get(style)
        if(styleObject) {
            return styleObject
        } else {
            var styleObject = Style(style)
            styleObjectMap.set(style,styleObject)
            return styleObject
        }
    }
}

// if you load two different instances of gems, its necessary to do a bit of duck typing
var isStyleObject = exports.isStyleObject = function (x) {
    return x.className !== undefined && x.componentStyleMap !== undefined && x.mix !== undefined
}

/***/ }),
/* 35 */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/hashmap/hashmap.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * HashMap - HashMap Class for JavaScript
 * @author Ariel Flesler <aflesler@gmail.com>
 * @version 2.0.5
 * Homepage: https://github.com/flesler/hashmap
 */

(function(factory) {
	if (true) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module === 'object') {
		// Node js environment
		var HashMap = module.exports = factory();
		// Keep it backwards compatible
		HashMap.HashMap = HashMap;
	} else {
		// Browser globals (this is window)
		this.HashMap = factory();
	}
}(function() {

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
			var hash = this.hash(key);
			if ( !(hash in this._data) ) {
				this._count++;
			}
			this._data[hash] = [key, value];
		},

		multi:function() {
			multi(this, arguments);
		},

		copy:function(other) {
			for (var hash in other._data) {
				if ( !(hash in this._data) ) {
					this._count++;
				}
				this._data[hash] = other._data[hash];
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
			var hash = this.hash(key);
			if ( hash in this._data ) {
				this._count--;
				delete this._data[hash];
			}
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
			this.forEach(function(_, key) { keys.push(key); });
			return keys;
		},

		values:function() {
			var values = [];
			this.forEach(function(value) { values.push(value); });
			return values;
		},

		count:function() {
			return this._count;
		},

		clear:function() {
			// TODO: Would Object.create(null) make any difference
			this._data = {};
			this._count = 0;
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
					return '♣' + key.getTime();

				case 'string':
					return '♠' + key;

				case 'array':
					var hashes = [];
					for (var i = 0; i < key.length; i++) {
						hashes[i] = this.hash(key[i]);
					}
					return '♥' + hashes.join('⁞');

				default:
					// TODO: Don't use expandos when Object.defineProperty is not available?
					if (!key.hasOwnProperty('_hmuid_')) {
						key._hmuid_ = ++HashMap.uid;
						hide(key, '_hmuid_');
					}

					return '♦' + key._hmuid_;
			}
		},

		forEach:function(func, ctx) {
			for (var key in this._data) {
				var data = this._data[key];
				func.call(ctx || this, data[1], data[0]);
			}
		}
	};

	HashMap.uid = 0;

	//- Add chaining to some methods
    var chainMethod = {set:1,multi:1,copy:1,remove:1,clear:1,forEach:1}
	for (var method in chainMethod) {
		proto[method] = chain(proto[method])
	}

	//- Utils

	function multi(map, args) {
		for (var i = 0; i < args.length; i += 2) {
			map.set(args[i], args[i+1]);
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
	}

	return HashMap;
}));


/***/ }),
/* 36 */
/*!********************************************!*\
  !*** ../node_modules/Components/Canvas.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 5)

module.exports = proto(Gem, function(superclass) {

    //static properties

    this.name = 'Canvas'

    this.init = function(/*[label,] height, width*/) {
        if(arguments.length === 2) {
            var height = arguments[0]
            var width = arguments[1]
        } else {
            var label = arguments[0]
            var height = arguments[1]
            var width = arguments[2]
        }

        this.domNode = document.createElement('canvas') // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it

        this.label = label
        this.height = height
        this.width = width

        superclass.init.apply(this, arguments) // superclass constructor
    }

    // instance properties

    Object.defineProperty(this, 'width', {
        get: function() {
            return this.domNode.width
        }, set: function(v) {
            this.domNode.width = v
        }
    })
    Object.defineProperty(this, 'height', {
        get: function() {
            return this.domNode.height
        }, set: function(v) {
            this.domNode.height = v
        }
    })

    this.context = function() {
        return this.domNode.getContext.apply(this.domNode, arguments)
    }

    this.toImg = this.toDataURL = function() {
        return this.domNode.toDataURL()
    }
});


/***/ }),
/* 37 */
/*!********************************************!*\
  !*** ../node_modules/Components/Button.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

module.exports = proto(Gem, function(superclass) {

    // static variables

    this.name = 'Button'


    // instance properties

	this.init = function(/*[label,] text*/) {
        if(arguments.length >= 2) {
            var label = arguments[0]
            var text = arguments[1]
        } else {
            var text = arguments[0]
        }

        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it

        this.label = label
		this.attr('type','button')
		this.text = text

        superclass.init.apply(this, arguments) // superclass constructor
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

/***/ }),
/* 38 */
/*!**********************************************!*\
  !*** ../node_modules/Components/CheckBox.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var domUtils = __webpack_require__(/*! domUtils */ 3)

module.exports = proto(Gem, function(superclass) {
	// static variables
    this.name = 'CheckBox'

	// instance methods
	this.init = function(label) {
        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        this.label = label
		this.attr('type','checkbox')
        
        superclass.init.apply(this, arguments) // superclass constructor
        
        domUtils.setupBoundProperty(this,this.quiet,'selected', {
            getFn: getSelected, 
            setFn: function(x) {
                setSelected.bind(this)(x, true)   
            }
        })
	}

    Object.defineProperty(this, 'selected', {
        get: getSelected,set: setSelected
    })    
})

// returns whether or not the checkbox is checked
function getSelected() {
    return this.domNode.checked   
}

// sets the value of the checkbox to the passed value (true for checked)
function setSelected(checked, quiet) {
    var newValue = checked === true
    var curValue = this.domNode.checked
    if(curValue === newValue) return;  // do nothing if nothing's changing

    this.domNode.checked = newValue
    if(!quiet) this.emit('change') // the browser has no listenable event that is triggered on change of the 'checked' property
}


/***/ }),
/* 39 */
/*!*******************************************!*\
  !*** ../node_modules/Components/Image.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

module.exports = proto(Gem, function(superclass) {

    //static properties

    this.name = 'Image'

    this.init = function(/*[label,] imageSource*/) {
        if(arguments.length === 1) {
            var imageSource = arguments[0]
        } else {
            var label = arguments[0]
            var imageSource = arguments[1]
        }

        this.domNode = document.createElement('img') // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        this.label = label
        if(imageSource !==  undefined) this.src = imageSource

        superclass.init.apply(this, arguments) // superclass constructor
    }

    // instance properties

    Object.defineProperty(this, 'src', {
        get: function() {
            return this.domNode.src
        }, set: function(v) {
            this.domNode.src = v
        }
    })
});


/***/ }),
/* 40 */
/*!******************************************!*\
  !*** ../node_modules/Components/List.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 5)

var Item = __webpack_require__(/*! ./Item */ 100);

module.exports = proto(Gem, function(superclass) {

	// static properties

	this.Item = Item

    this.name = 'List'

	// instance properties

	this.init = function(/*[label,] [ordered,] listInit*/) {
		if(arguments[0] instanceof Array) {
            var listInit = arguments[0]
        } else {
            if(arguments[1] instanceof Array) {
                var listInit = arguments[1]
            } else if(arguments[2] instanceof Array) {
                var listInit = arguments[2]
            }

            if(typeof(arguments[0]) === 'boolean') {
                var ordered = arguments[0]
            } else {
                if(typeof(arguments[1]) === 'boolean') {
                    var ordered = arguments[1]
                } else {
                    var ordered = false // default
                }

                if(typeof(arguments[0]) === 'string') {
                    var label = arguments[0]
                }
            }
        }

        if(ordered) {
            var type = 'ol'
        } else {
            var type = 'ul'
            this.defaultStyle = Style({
                listStyleType: 'decimal'
            })
        }


        this.domNode = document.createElement(type) // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        this.label = label

        this.children = [] // need children before calling add
        if(listInit !== undefined) {
            for(var n=0; n<listInit.length; n++) {
                this.item(listInit[n])
            }
        }

        superclass.init.apply(this, arguments) // superclass constructor
	}

	this.item = function() {
		var item = Item.apply(this, arguments)
        this.add(item)
        return item
	}
});

/***/ }),
/* 41 */
/*!*******************************************!*\
  !*** ../node_modules/Components/Radio.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)
var EventEmitter = __webpack_require__(/*! events */ 9).EventEmitter

var Gem = __webpack_require__(/*! ../Gem */ 1)
var domUtils = __webpack_require__(/*! domUtils */ 3)

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
        
        this.quiet = {}        
        domUtils.setupBoundProperty(this,this.quiet,'val', {
            getFn: getVal, 
            setFn: function(x) {
                setVal.bind(this)(x, true)   
            }
        })
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
    Object.defineProperty(this, 'selectedOption', {
        get: getSelectedOption, set: setSelectedOption
    })
    Object.defineProperty(this, 'selected', { // deprecated
        get: getSelectedOption, set: setSelectedOption
    })

    function getSelectedOption() {
        return this._selected
    }    
    function setSelectedOption() {
        throw new Error("Can't set selected on a Radio object")
    }

    Object.defineProperty(this, 'val', {        
        get: getVal, set: setVal
    })

    // returns the value of the selected radio button in the group (undefined if none are selected)
    function getVal() {
        var selected = this._selected
        if(selected === undefined) return undefined
        // else
        return selected.attr('value')
    }    
    // sets the value of the checkbox to the passed value (true for checked)
    // throws an exception if none of the radio buttons have that value
    // throws an exception if an unset is attempted for a required Radio set
    function setVal(value, quiet) {
        if(value === undefined) {
            var selected = this._selected
            if(selected !== undefined) {
                if(quiet) selected = selected.quiet
                selected.selected = false
            }
        } else {
            var button = this.buttons[value]
            if(button === undefined) throw new Error("There is no RadioButton in the group with the value: '"+value+"'")

            if(quiet) button = button.quiet
            button.selected = true
        }
    }
    

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

var RadioButton = proto(Gem, function(superclass) {
    this.name = 'RadioButton'

    this.init = function(radioGroup, label, value, name) {
        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        superclass.init.call(this) // superclass constructor

        this.label = label
        this.group = radioGroup

        this.attr('type', 'radio')
        this.attr('name', name) // the name is needed so that using tab to move through page elements can tab between different radio groups
        this.val = value
                        
        domUtils.setupBoundProperty(this,this.quiet,'selected', {
            getFn: getSelected, 
            setFn: function(x) {
                setSelected.bind(this)(x, true)   
            }
        })    
        domUtils.setupBoundProperty(this,this.quiet,'val', { // this is here just for consistency, it isn't different than button.val because button.val doesn't emit a change event
            getFn: getSelected, setFn: setSelected
        })

        var that = this
		this.on("mousedown",function(event) {
            event.preventDefault()           // this needs to be here otherwise the radio button can't be changed

			if(that.group.required) {
                if(that.selected === false) {
                    that.selected = true
                }
            } else {
                that.selected = !that.selected // toggle
            }
		})
        this.on("click",function(event) {
            event.preventDefault()         // this needs to be here otherwise the radio button can't be *unset*
        })
        this.on("keydown",function(event) {
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
        get: getSelected, set: setSelected
    })

    this.selectNext = function() {
        selectSibling(this,1)
    }
    this.selectPrevious = function() {
        selectSibling(this,-1)
    }
    
    // returns whether or not the checkbox is checked
    function getSelected() {
        return this.domNode.checked
    }
    // sets the selected state of the checkbox to the passed value (true for checked)
    function setSelected(value, quiet) {
        var booleanValue = value === true
        if(this.selected === value) return; // ignore if there's no change

        if(booleanValue) {
            var previouslySelected = this.group.selected
            setButtonInGroup(this.group, this)
            if(previouslySelected !== undefined && !quiet)
                previouslySelected.emit('change')
        } else {
            if(this.group.required) throw new Error("Can't unset this Radio set, a value is required.")
            this.domNode.checked = false
            this.group._selected = undefined
        }
        
        if(!quiet) {
            this.emit('change') // the browser has no listenable event that is triggered on change of the 'checked' property
            this.group.emit('change')                        
        }
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

/***/ }),
/* 42 */
/*!********************************************!*\
  !*** ../node_modules/Components/Select.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

var domUtils= __webpack_require__(/*! domUtils */ 3)
var Option = __webpack_require__(/*! Components/Option */ 43)

// emits a 'change' event when its 'val' changes
module.exports = proto(Gem, function(superclass) {

	// static variables

    this.name = 'Select'

    this.Option = Option

	this.init = function(/*[label,] options*/) {
        if(arguments[0] instanceof Object) {
            var options = arguments[0]
        } else {
            var label = arguments[0]
            var options = arguments[1]
        }

        this.domNode = document.createElement("select") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        this.label = label

        this.children = [] // need children before calling add
        this.options = {}
		for(var value in options) {
			this.option(value, options[value])
		}

        superclass.init.apply(this, arguments) // superclass constructor       
           
        domUtils.setupBoundProperty(this,this.quiet,'val', {
            getFn: getVal, 
            setFn: function(x) {
                setVal.bind(this)(x, true)   
            }
        })
	}


	// instance methods

    Object.defineProperty(this, 'val', {
        get: getVal, set: setVal
    })
    // returns the value that is selected
    function getVal() {
        for(var value in this.options) {
            if(this.options[value].selected) {
                return this.options[value].val
            }
        }
    }
    function setVal(value, quiet) {
        var option = this.options[value]
        if(option === undefined || option.val !== value) throw new Error("There is no Option in the Select with the value: '"+value+"'")
        if(quiet) option = option.quiet
        option.selected = true
    }
	
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

    // same interface as Gem.addAt
    /*override*/ this.addAt = function(index/*, nodes...*/) {
        var that = this

        var nodesToAdd = Gem.normalizeAddAtArguments.apply(this, arguments)

        // validation first
        nodesToAdd.forEach(function(option) {
            if(that.options[option.val] !== undefined) {
                throw new Error("Can't give an Option the same value as another in the Select (value: '"+option.val+"')")
            }
        })

        superclass.addAt.call(this, index, nodesToAdd)

        // Select specific state modifications - this must be done after the superclass call in case an error is thrown from it
        var anyWereSelected = false
        nodesToAdd.forEach(function(option) {
            if(option.selected) anyWereSelected = true
            that.options[option.val] = option

            // set up Select events
            // todo: remove events when the Option is removed

            option.on("mousedown",function(event) {
                option.parent.val = option.val      // select this one
            })
        })

        if(anyWereSelected) {
            this.emit('change')
        }
    }

    // same interface as Gem.remove
    /*override*/ this.remove = function() {
        var that = this

        var removalIndexes = Gem.normalizeRemoveArguments.apply(this, arguments)
        var removals = removalIndexes.map(function(index) {
            return that.children[index]
        })

        superclass.remove.call(this, removalIndexes)

        // Select specific state modifications - this must be done after the superclass call in case an error is thrown from it
        var theSelectedWasRemoved = false
        removals.forEach(function(option) {
            if(option.selected) theSelectedWasRemoved = true
            delete that.options[option.val]
        })

        if(theSelectedWasRemoved) {
            //this.children[0].selected = true // I think the browser does this automatically??
            this.emit('change')
        }
    }


    // private

    this.prepareForValueChange = function(values, quiet) {
        var value = values[0]

        for(var optionValue in this.options) {
            if(optionValue !== value) {
                var option = this.options[optionValue]
                if(option.selected === true) {
                    option.domNode.selected = false
                    if(!quiet) option.emit('change')
                }
            }
        }
    }
})



/***/ }),
/* 43 */
/*!********************************************!*\
  !*** ../node_modules/Components/Option.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// note: this is  not intended to be used directly - only through Select and MultiSelect

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 5)
var domUtils = __webpack_require__(/*! domUtils */ 3)

// emits a 'change' event when its 'selected' value changes
module.exports = proto(Gem, function(superclass) {

    // staic members

    this.name = 'Option'

    this.defaultStyle = Style({
        display: 'block'
    })


    // instance members

    this.init = function(/*[label,] value, text*/) {
        this.domNode = document.createElement("option") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it

        if(arguments.length===2) {
            this.val = arguments[0]
            this.text = arguments[1]
        } else { // 3
            this.label = arguments[0]
            this.val = arguments[1]
            this.text = arguments[2]
        }

        superclass.init.apply(this, arguments) // superclass constructor   
           
        domUtils.setupBoundProperty(this,this.quiet,'selected', {
            getFn: getSelected, 
            setFn: function(x) {
                setSelected.bind(this)(x, true)   
            }
        })
        domUtils.setupBoundProperty(this,this.quiet,'val', {
            getFn: getVal, 
            setFn: function(x) {
                setVal.bind(this)(x, true)   
            }
        })
    }

    Object.defineProperty(this, 'val', {
        get:getVal, set:setVal
    })
    // returns the value of the Option
    function getVal() {
        return this._value
    }
    // sets the value of the Option
    function setVal(value, quiet) {
        if(this.parent !== undefined) {
            if(this.parent.options[value] !== undefined) {
                throw new Error("Can't give an Option the same value as another in the Select or MultiSelect (value: "+JSON.stringify(value)+")")
            }

            if(this.val !== null) {
                delete this.parent.options[this.val]
            }

            this.parent.options[value] = this
        }

        this._value = value

        if(this.selected && this.parent !== undefined && !quiet) {
            this.parent.emit('change')
        }
    }


    Object.defineProperty(this, 'selected', {
        get: getSelected, set: setSelected  
    })
    // returns whether or not the option is selected
    function getSelected() {
        return this.domNode.selected
    }
    // sets the selected state of the option to the passed value (true for selected)
    function setSelected(value, quiet) {
        var booleanValue = value === true
        if(this.selected === booleanValue) return false; // ignore if there's no change

        if(this.parent !== undefined)
            this.parent.prepareForValueChange([this.val], quiet)

        if(this.selected === booleanValue) return; // ignore if there's no change

        this.domNode.selected = booleanValue
        
        if(!quiet) {
            this.emit('change') // the browser has no listenable event that is triggered on change of the 'checked' property    
            if(this.parent !== undefined)
                this.parent.emit('change')
        }
    }

    Object.defineProperty(this, 'text', {
        get: function() {
            return this.domNode[domUtils.textProperty]
        },

        set: function(text) {
            this.domNode[domUtils.textProperty] = text
        }
    })


    // private

    // deprecated
    // does everything for setting the selected state except emit the parent's change event
    this.setSelectedQuiet = function setOptionSelected(booleanValue) {
        this.quiet.selected = booleanValue  
    }
})

/***/ }),
/* 44 */
/*!*******************************************!*\
  !*** ../node_modules/Components/Table.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! ../Gem */ 1)
var Style = __webpack_require__(/*! Style */ 5)

var Header = __webpack_require__(/*! ./Header */ 102);
var Row = __webpack_require__(/*! ./Row */ 103);
var Cell = __webpack_require__(/*! ./Cell */ 46);

module.exports = proto(Gem, function(superclass) {

	// static properties

    this.name = 'Table'

    this.defaultStyle = Style({
        borderSpacing: 0
    })

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
        this.label = label

        this.children = [] // need children before calling add
        if(tableInit !== undefined) {
            for(var n=0; n<tableInit.length; n++) {
                this.row(tableInit[n])
            }
        }

        superclass.init.apply(this, arguments) // superclass constructor
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

/***/ }),
/* 45 */
/*!******************************************************!*\
  !*** ../node_modules/Components/RowlikeGenerator.js ***!
  \******************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 5)
var Cell = __webpack_require__(/*! ./Cell */ 46);

// generates either a Header or a Row, depending on what you pass in
// elementType should either be "tr" or "th
// name should either be "Header" or "Row
module.exports = function(elementType, name) {
    return proto(Gem, function(superclass) {

        // static properties

        this.name = name

        this.defaultStyle = Style({
            display: 'table-row'
        })


        // instance properties

        this.init = function(/*[label,] rowInit*/) {
            if(arguments[0] instanceof Array) {
                var rowInit = arguments[0]
            } else {
                var label = arguments[0]
                var rowInit = arguments[1]
            }

            this.domNode = document.createElement(elementType) // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
            this.label = label
            this.children = [] // need children before calling add

            if(rowInit !== undefined) {
                for(var n=0; n<rowInit.length; n++) {
                    this.cell(rowInit[n])
                }
            }

            superclass.init.apply(this, arguments) // superclass constructor
        }

        this.cell = function(/*[label,] contents*/) {
            var cell = Cell.apply(undefined, arguments);
            this.add(cell);
            return cell;
        }
    })
}

/***/ }),
/* 46 */
/*!******************************************!*\
  !*** ../node_modules/Components/Cell.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 5)

module.exports = proto(Gem, function(superclass) {

	// static properties

	this.name = 'TableCell'

    this.defaultStyle = Style({
        display: 'table-cell'
    })
	

	// instance properties

	this.init = function(/*[label,] contents*/) {
        if(arguments.length <= 1) {
            var contents = arguments[0]
        } else {
            var label = arguments[0]
            var contents = arguments[1]
        }

        this.domNode = document.createElement("td") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
		this.label = label

        this.children = [] // need children before calling add
        if(contents instanceof Gem || typeof(contents) !== 'string') {
            this.add(contents)
        } else if(contents !== undefined) {
            this.domNode.textContent = contents
        }

        superclass.init.apply(this, arguments) // superclass constructor
	}

	this.colspan = function(cols) {
		this.attr('colspan',cols);
	}
});


/***/ }),
/* 47 */
/*!**********************************************!*\
  !*** ../node_modules/Components/TextArea.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! ../Gem */ 1)
var domUtils = __webpack_require__(/*! domUtils */ 3)

module.exports = proto(Gem, function(superclass) {

	// static variables

    this.name = 'TextArea'

	this.init = function(label) {
        this.domNode = document.createElement("textarea") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
        this.label = label

        superclass.init.apply(this, arguments) // superclass constructor
           
        domUtils.setupBoundProperty(this,this.quiet,'val', {
            getFn: getVal, 
            setFn: function(x) {
                setVal.bind(this)(x, true)   
            }
        })
	}


	// instance properties

    Object.defineProperty(this, 'val', {        
        get: getVal, set: setVal
    })
    
    
    // returns the TextArea's value
    function getVal() {
        return this.domNode.value
    }
    // sets the value of the TextArea
    function setVal(value, quiet) {
        if(this.val === value) return; // do nothing if there's no change

        this.domNode.value = value
        if(!quiet) this.emit('change')
    }
})

/***/ }),
/* 48 */
/*!***********************************************!*\
  !*** ../node_modules/Components/TextField.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

var domUtils = __webpack_require__(/*! ../domUtils */ 3)

module.exports = proto(Gem, function(superclass) {

	// static properties

    this.name = 'TextField'

	this.init = function(/*[label,] password*/) {
        if(arguments.length === 1) {
            if(typeof(arguments[0]) === 'string')
                var label = arguments[0]
            else
                var password = arguments[0]
        } else if(arguments.length > 1) {
            var label = arguments[0]
            var password = arguments[1]
        }

        this.domNode = document.createElement("input") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it

		this.label = label
		//domUtils.setAttribute(this.domNode,'type','text');  // NOTE: IE fucks this up, and since 'text' is the default type for an input node, lets just forget abat it
        if(password)
		    this.attr('type','password')

        superclass.init.apply(this, arguments) // superclass constructor      
           
        domUtils.setupBoundProperty(this,this.quiet,'val', {
            getFn: getVal, 
            setFn: function(x) {
                setVal.bind(this)(x, true)   
            }
        })
	}


	// instance properties

    Object.defineProperty(this, 'val', {       
        get: getVal, set: setVal
    })
    
    
    // returns the value of the field
    function getVal() {
        return this.domNode.value
    }
    // sets the value of the field
    function setVal(value, quiet) {
        if(this.val === value) return; // do nothing if there's no change

        this.domNode.value = value
        if(!quiet) this.emit('change')
    }

});


/***/ }),
/* 49 */
/*!**********************!*\
  !*** ./all.tests.js ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
    

var Unit = __webpack_require__(/*! deadunit/deadunit.browser */ 50)

var Gem = __webpack_require__(/*! ../Gem.browser */ 18)
Gem.dev = true

module.exports = function() {


    var tests = Unit.test("Testing Gem.js", function(t) {
        this.count(1)
        this.timeout(700*1000) // for some reason this isn't working properly - the test is timing out when this is set to 20 seconds without 20 seconds between asserts
          
                                                        
        //*
        this.test("all", function(t) {
            this.count(4)

            t.test('Gem',__webpack_require__(/*! ./Gem.test */ 104)).complete.then(function(){
                return t.test('Style',__webpack_require__(/*! ./Style.test */ 105)).complete
            }).then(function() {
                return t.test("standard components", function(t) {
                    t.count(13)

                    // it seems a bit faster when the tests are run sequentially
                    t.test('Button',__webpack_require__(/*! ./ComponentTests/Button.test */ 106)).complete.then(function() {
                        return t.test('Canvas',__webpack_require__(/*! ./ComponentTests/Canvas.test */ 107)).complete
                    }).then(function() {
                        return t.test('CheckBox',__webpack_require__(/*! ./ComponentTests/CheckBox.test */ 108)).complete
                    }).then(function() {
                        return t.test('Block',__webpack_require__(/*! ./ComponentTests/Block.test */ 109)).complete
                    }).then(function() {
                        return t.test('Image',__webpack_require__(/*! ./ComponentTests/Image.test */ 110)).complete
                    }).then(function() {
                        return t.test('List',__webpack_require__(/*! ./ComponentTests/List.test */ 111)).complete
                    }).then(function() {
                        return t.test('MultiSelect',__webpack_require__(/*! ./ComponentTests/MultiSelect.test */ 112)).complete
                    }).then(function() {
                        return t.test('Radio',__webpack_require__(/*! ./ComponentTests/Radio.test */ 114)).complete
                    }).then(function() {
                        return t.test('Select',__webpack_require__(/*! ./ComponentTests/Select.test */ 115)).complete
                    }).then(function() {
                        return t.test('table',__webpack_require__(/*! ./ComponentTests/Table.test */ 116)).complete
                    }).then(function() {
                        return t.test('text',__webpack_require__(/*! ./ComponentTests/Text.test */ 117)).complete
                    }).then(function() {
                        return t.test('textarea',__webpack_require__(/*! ./ComponentTests/TextArea.test */ 118)).complete
                    }).then(function() {
                        return t.test('textfield',__webpack_require__(/*! ./ComponentTests/TextField.test */ 119)).complete
                    })
                }).complete
            }).done()
        })
        //*/
    })

    tests.writeHtml($("#results")[0])

    return tests
}



/***/ }),
/* 50 */
/*!**********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/deadunit.browser.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2014 Billy Tetrud - Free to use for any purpose: MIT License*/

var Future = __webpack_require__(/*! async-future */ 15)
var proto = __webpack_require__(/*! proto */ 20)
var defaultFormats = __webpack_require__(/*! ./defaultFormats */ 21)

var Container = __webpack_require__(/*! blocks.js/Container */ 56)
var OriginalText = __webpack_require__(/*! blocks.js/Text */ 62)
var Block = __webpack_require__(/*! blocks.js/Block */ 64)
Block.dev = true
var Style = __webpack_require__(/*! blocks.js/Style */ 65)

var deadunitInternal = __webpack_require__(/*! ./deadunit.internal */ 66)
var utils = __webpack_require__(/*! ./utils */ 23)


module.exports = deadunitInternal({
    deadunitCore: __webpack_require__(/*! deadunit-core/src/deadunitCore.browser */ 67),

    environmentSpecificMethods: function() {
        var red = 'rgb(200,30,30)'

        var warningWritten = false
        function warnAboutLateEvents(domNode) {
            if(!warningWritten) {
                append(domNode, "Test results were accessed before asynchronous parts of tests were fully complete.", {style: "color: red;"})
                warningWritten = true
            }
        }

        function writeLateEvent(written, ended, domNode, event, manager) {
            if(ended) {
                written.then(function() {
                    warnAboutLateEvents(domNode)
                    append(domNode, JSON.stringify(event), {style: "color: red;"})
                })
            }
        }

        // writes html on the current (browser) page
        this.writeHtml = function(domNode) {
            if(domNode === undefined) domNode = document.body

            var f = new Future, groups = {}, ended = false, mainGroup, lateEventsWarningPrinted=false;
            this.events({
                group: function(groupStartEvent) {
                    if(groupStartEvent.parent === undefined) {
                        var group = mainGroup = MainGroup(groupStartEvent.name, groupStartEvent.time)
                        domNode.appendChild(mainGroup.domNode)

                    } else {
                        var group = Group(mainGroup, groupStartEvent.name, groupStartEvent.time, groups[groupStartEvent.parent])
                        group.parentGroup.addSubGroup(group)
                    }

                    groups[groupStartEvent.id] = group
                    lateEventCheck()
                },
                count: function(e) {
                    groups[e.parent].addExpectedCount(e.expected, Count(e.sourceLines, e.file, e.line, e.column, ended, e.expected))
                    lateEventCheck()
                },
                assert: function(e) {
                    groups[e.parent].addAssert(Assert(e.sourceLines, e.file, e.line, e.column, ended, e.expected, e.actual, e.success))
                    lateEventCheck()
                },
                exception: function(exceptionEvent) {
                    groups[exceptionEvent.parent].addException(Exception(exceptionEvent.error, ended))
                    lateEventCheck()
                },
                log: function(logEvent) {
                    groups[logEvent.parent].results.add(Log(logEvent.values, ended))
                    lateEventCheck()
                },
                groupEnd: function(groupEvent) {
                    var group = groups[groupEvent.id]
                    group.end(groupEvent.time, ended)

                    if(group.parentGroup !== undefined && group.state.subject.success) {
                        group.parentGroup.title.passed++
                        group.parentGroup.updateTitle()
                    }

                    lateEventCheck()
                },
                end: function(endEvent) {
                    mainGroup.endTest(endEvent.type, endEvent.time)
                    ended = true
                    f.return()
                }
            })
            return f

            // if late is true, prints out the late event warning, unless it's already been printed
            function lateEventCheck() {
                if(ended && !lateEventsWarningPrinted) {
                    mainGroup.add(Text('lateEventsWarning', "Warning: some events happened after the test ended."))
                    lateEventsWarningPrinted = true
                }
            }
        }

    }
})

function append(domNode, content, attributes) {
    if(domNode.setAttributeNode === undefined || domNode.appendChild === undefined)
        console.log("Object that is not a dom node passed to 'append' (jquery objects aren't supported anymore): "+domNode)
    if(attributes ===  undefined) attributes = {}

    /*var div = document.createElement('div')
        div.innerHTML = content
    for(var attribute in attributes) {
        var a = document.createAttribute(attribute)
            a.nodeValue = attributes[attribute]
        domNode.setAttributeNode(a);
    }

    domNode.appendChild(div)
    */
    $(domNode).append(content)
}

var color = defaultFormats.htmlColors

document.body.style.backgroundColor = color.black
var mainGroupStyle = Style({
    color: color.white,
    marginTop: 10,

    Text: {
        $mainTitle:{
            cursor: 'pointer',
            color: color.brightBlue,
            fontSize: 28,
            fontWeight: 'bold',
            margin: '9px 0'
        },
        $timeout: {
            color: color.red
        },
        $lateEventsWarning: {
            color: color.yellow
        }
    },

    Container:{$results:{
        $state: function(state) {
            if(state.success) {
                if(state.late) {
                    var borderColor = color.darkYellow
                } else {
                    var borderColor = color.green
                }
            } else {
                var borderColor = color.red
            }

            return Style({
                border: '1px solid '+borderColor,
                display: 'block',
                padding: 5
            })
        }
    }},

    MainBar: {
        $state: function(state) {
            if(state.success) {
                if(state.late) {
                    var borderColor = color.darkYellow
                } else {
                    var borderColor = color.green
                }
            } else {
                var borderColor = color.red
            }

            return Style({
                cursor: 'pointer',
                border: "2px solid "+borderColor,
                display: 'block',
                padding: 1,
            })
        },


        Container: {
            $inner: {
                $state: function(state) {
                    if(state.success) {
                        if(state.late) {
                            var backgroundColor = color.darkYellow
                        } else {
                            var backgroundColor = color.green
                        }
                    } else {
                        var backgroundColor = color.red
                    }

                    return Style({
                        backgroundColor: backgroundColor,
                        display: "block",
                        padding: "1px 3px",
                    })
                },

                Text: {
                    color: color.white,
                    $title: {
                        color: color.brightBlue
                    }
                }
            },
            $passes: {
                Text: {color: color.brightGreen}
            },
            $failures: {
                Text: {color: color.darkRed}
            },
            $exceptions: {
                Text: {color: color.brightPurple}
            },
            $clickText: {
                float: 'right',
                Text: {fontStyle: 'italic'}
            }
        },
    },

    Group: {
        padding: 1,
        margin: '8px 0',

        GroupTitle: {
            $state: function(state) {
                if(state.success) {
                    var textColor = color.brightGreen
                    if(state.late) {
                        var backgroundColor = color.darkYellow
                    } else {
                        var backgroundColor = color.green
                    }
                } else {
                    var textColor = color.white
                    var backgroundColor = color.red
                }

                return Style({
                    backgroundColor: backgroundColor,
                    color: textColor,
                    paddingLeft: 3,
                    cursor: 'pointer'
                })
            },

            Text: {
                $timeElapsed: {
                    color: color.gray
                }
            }
        },
    },

    ResultLine: {
        $state: function(state) {
            if(!state.success) {
                var textColor = color.red
            } else if(state.late) {
                var textColor = color.yellow
            } else {
                var textColor = color.green
            }

            return Style({color: textColor})
        },

        Container: {
            $location: {
                Text: {
                    color: color.gray,
                    $line: {
                        color: color.white
                    }
                }
            },
            $expectedAndActual: {
                Text: {
                    color: color.gray,
                    $actual: {
                        color: color.white
                    },
                    $expected: {
                        color: color.white
                    }
                }
            }
        }
    },

    Exception: {
        color: color.purple
    },
    Log: {
        Text: {
            display: 'block'
        }
    }
})



// a Block on its own line
var Line = proto(Block, function() {
    this.name = "Line"
    this.defaultStyle = Style({
        display: 'block'
    })
})

var Group = proto(Line, function() {
    this.name = "Group"

    this.build = function(mainGroup, groupTitle, time, parentGroup) {
        this.mainGroup = mainGroup
        this.results = Container('results')
        this.parentGroup = parentGroup

        this.add(this.results)
        this.createTitleBar(groupTitle)
        this.startTime = time
        this.count = 0

        this.title.on('click', function() {
            this.results.visible = !this.results.visible
        }.bind(this))
    }

    this.createTitleBar = function(groupTitle) {
        this.title = GroupTitle(groupTitle)
        this.addAt(0, this.title)
    }

    this.addExpectedCount = function(expected, countBlock) {
        this.expected = expected
        this.countBlock = countBlock
        this.countBlock.count = this.count
        this.results.addAt(0, countBlock)
        this.title.total++

        updateCountSuccess(this)   // must be run before updateTitle (because it modifies info updateTitle relies on)
        this.updateTitle()
    }

    this.addAssert = function(assertBlock) {
        this.results.add(assertBlock)
        this.count++
        if(this.countBlock !== undefined)
            this.countBlock.count = this.count

        this.title.total++
        if(assertBlock.state.subject.success) {
            this.title.passed++
            this.mainGroup.title.testTotalPasses++
        } else {
            this.mainGroup.title.testTotalFailures++
        }

        updateCountSuccess(this)   // must be run before updateTitle (because it modifies info updateTitle relies on)
        this.updateTitle()
    }

    this.addException = function(exceptionBlock) {
        this.results.add(exceptionBlock)
        this.title.exceptions++
        this.mainGroup.title.testTotalExceptions++

        this.updateTitle()
    }

    this.addSubGroup = function(groupBlock) {
        this.results.add(groupBlock)
        this.count++
        if(this.countBlock !== undefined)
            this.countBlock.count = this.count

        this.title.total++

        updateCountSuccess(this)   // must be run before updateTitle (because it modifies info updateTitle relies on)
        this.updateTitle()
    }

    this.end = function(time) {
        //updateCountSuccess(this, true) // must be run before groupEnded is set (because it relies on groupEnded being false at this point)
        if(this.expected !== undefined && !(this.count === this.expected)) this.mainGroup.title.testTotalFailures++

        this.groupEnded = true
        this.updateTitle()
        if(!(this instanceof MainGroup)) {
            this.title.add(Text('timeElapsed', ' took '+(time - this.startTime)+'ms'))
        }
    }

    this.updateTitle = function() {
        var success = this.title.passed === this.title.total && this.title.exceptions === 0
                      && (this !== this.mainGroup || this.title.testTotalFailures === 0 && this.title.testTotalExceptions === 0)

        this.results.visible = !success
        var parts = [this,this.results,this.title]// things to set success on (since $state styling is currently so limited, you have to set it on everything that needs a style)
        if(this instanceof MainGroup) {
            parts.push(this.title.inner)
        }

        var ended = this.mainGroup.ended
        parts.forEach(function(block) {
            block.state.set("success", success)
            block.state.set("late", ended)
        })

        if(this.parentGroup !== undefined) this.parentGroup.updateTitle()
    }
})

// figure out if count succeeded and update the main group and the countblock state
function updateCountSuccess(that) {
    if(that.expected !== undefined) {
        var countSuccess = that.count === that.expected
        that.countBlock.state.set("success", countSuccess)
        if(that.groupEnded) that.countBlock.results.state.set("late", true)

        if(countSuccess) {
            that.mainGroup.title.testTotalPasses++
            that.title.passed++
            if(that.groupEnded) {
                that.mainGroup.title.testTotalFailures--
                that.groupEndCountSubtracted = true // marks that failures were subtracted after the test finished (so successes can be later subtracted correctly if need be)
            }
        } else if(that.groupEndCountSubtracted || that.count - 1 === that.expected) {
            that.title.passed--
            that.mainGroup.title.testTotalPasses--
            if(that.groupEnded) {
                that.mainGroup.title.testTotalFailures++
            }
        }
    }
}

var MainGroup = proto(Group, function(superclass) {
    this.name = "MainGroup"

    this.createTitleBar = function(groupTitle) {
        this.title = MainBar(groupTitle)
        this.add(this.title)
    }

    this.build = function(groupTitle, time) {
        superclass.build.call(this, this,groupTitle,time)
        this.style = mainGroupStyle

        var mainTitle = Text('mainTitle', groupTitle)
        this.addAt(0, mainTitle)
        this.add(this.pendingText=Text("Pending..."))

        mainTitle.on('click', function() {
            this.results.visible = !this.results.visible
        }.bind(this))
    }

    this.endTest = function(type, time) {
        if(type === 'timeout')
            this.add(Text('timeout', "The test timed out!"))

        this.pendingText.visible = false
        this.updateTitle()
        this.testTotalTime = getTimeDisplay(time - this.startTime)
        this.title.takenText.text = "Took "
        this.ended = true
    }
})



var Text = proto(OriginalText, function() { // doing this cause i'm to lazy to update blocks.js right now
    this.defaultStyle = Style({
        whiteSpace: 'pre-wrap'
    })
})


var GroupTitle = proto(Line, function() {
    this.name = "GroupTitle"

    this.build = function(title) {
        this.totalNode = Text('0')
        this.passedNode = Text('0')
        this.exceptionsNode = Text('0')


        if(title !== undefined) {
            this.add(Text(title+":       "))
        }

        this.add(this.passedNode, Text('/'), this.totalNode, Text(' and '), this.exceptionsNode, Text(" exceptions "))
    }

    ;['total','passed','exceptions'].forEach(function(property) {
        Object.defineProperty(this, property, {
            get: function() {  return parseInt(this[property+"Node"].text)},
            set: function(v) {
                this[property+"Node"].text = v
                if(property === 'total' && this.totalPlural) {
                    if(v == 1) this.totalPlural.visible = false
                    else       this.totalPlural.visible = true
                }
            }
        })
    }.bind(this))
})

var MainBar = proto(GroupTitle, function() {
    this.name = "MainBar"

    /*override*/ this.build = function(title) {
        this.totalNode = Text('0'); this.totalPlural = Text('s')
        this.passedNode = Text('0')
        this.exceptionsNode = Text('0')  // unused, but needed to match the interface of GroupTitle

        this.testTotalPassesNode = Text('0'); this.testTotalPassesPlural = Text('es')
        this.testTotalFailuresNode = Text('0'); this.testTotalFailuresPlural = Text('s')
        this.testTotalExceptionsNode = Text('0'); this.testTotalExceptionsPlural = Text('s')
        this.testTotalTimeNode = Text('0')

        // used temporarily to approximate the time when counting up on-the-fly
        // will be replaced by the time coming from deadunitCore's events at the end
        this.temporaryStartTime = Date.now()

        this.inner = Container('inner', []) // outer used for styling)
        this.add(this.inner)

        if(title !== undefined) {
            this.inner.add(Text('title', title), Text(' - '))
        }

        this.inner.add(
            this.passedNode, Text('/'), this.totalNode, Text(' successful test'),this.totalPlural,Text('. '),
            Container('passes', this.testTotalPassesNode, Text(" pass"), this.testTotalPassesPlural), Text(", "),
            Container('failures', this.testTotalFailuresNode, Text(" failure"),this.testTotalFailuresPlural), Text(", and "),
            Container('exceptions', this.testTotalExceptionsNode, Text(" exception"), this.testTotalExceptionsPlural), Text(". "),
            Container('time', this.takenText=Text("Has taken "), this.testTotalTimeNode, Text(".")),
            Container('clickText', Text("click on this bar"))
        )
    }

    ;['testTotalPasses','testTotalFailures','testTotalExceptions','testTotalTime'].forEach(function(property) {
        Object.defineProperty(this, property, {
            get: function() {  return parseInt(this[property+"Node"].text)},
            set: function(v) {
                this[property+"Node"].text = v

                if(property!=='testTotalTime') {
                    this.testTotalTime = getTimeDisplay(Date.now() - this.temporaryStartTime)

                    if(v == 1) this[property+'Plural'].visible = false
                    else        this[property+'Plural'].visible = true
                }
            }
        })
    }.bind(this))
})


// a line of result text
var ResultLine = proto(Line, function() {
    this.name = "ResultLine"

    this.build = function(resultText, sourceLines, file, line, column, expected, actual) {
        this.resultTextNode = Text(resultText)
        var location = Container('location',[Text("["+file+' '), Text('line',line), Text(":"+column+'] ')])
        this.add(this.resultTextNode, location, Text(sourceLines))

        this.expectedAndActual = Container('expectedAndActual')
        this.add(this.expectedAndActual)

        if(expected !== undefined) {
            this.expectedAndActual.add(Text(" Expected "), Text('expected', utils.valueToMessage(expected)))
        }
        if(actual !== undefined) {
            if(expected !== undefined)
                this.expectedAndActual.add(Text(","))

            this.got = Text("actual", utils.valueToMessage(actual))
            this.expectedAndActual.add(Text(" Got "), this.got)
        }
    }
})


var Assert = proto(Line, function() {
    this.name = "Assert"

    this.successText = "Ok! "
    this.failText = "Fail: "

    this.build = function(sourceLines, file, line, column, late, expected, actual, success) {
        var text = success?this.successText:this.failText

        this.results = ResultLine(text, sourceLines, file, line, column, expected, actual)
        this.add(this.results)

        var that = this
        this.state.on('change', function() {
            that.results.expectedAndActual.visible = !that.state.subject.success
        })

        this.state.set("success", success)
        this.results.state.set("success", success)
        if(late) this.results.state.set("late", true)
    }
})

var Exception = proto(Line, function() {
    this.name = "Exception"

    this.build = function(error, late) {
        if(late) this.state.set("late", true)

        var exceptionText = Text(utils.errorToString(error))
        this.add(exceptionText)
    }
})

var Count = proto(Assert, function(superclass) {
    this.name = "Count"

    this.build = function(sourceLines, file, line, column, late, expected) {
        superclass.build.call(this, sourceLines, file, line, column, late, expected, 0, false)
        this.expected = expected
    }

    Object.defineProperty(this, 'count', {
        get: function() {
            return this.results.got.text
        }, set: function(count) {
            this.results.got.text = count
            if(count === this.expected) {
                this.results.resultTextNode.text = this.successText
            } else {
                this.results.resultTextNode.text = this.failText
            }

            this.results.state.set("success", count === this.expected)
        }
    })
})

var Log = proto(Line, function() {
    this.name = "Log"

    this.build = function(values, late) {
        if(late) this.state.set("late", true)

        values.forEach(function(v) {
            this.add(Text(utils.valueToString(v)))
        }.bind(this))

    }
})

function getTimeDisplay(milliseconds) {
    if(milliseconds > 1000) {
        return Math.floor(milliseconds/1000)+'s'
    } else {
        return milliseconds+'ms'
    }
}


/***/ }),
/* 51 */
/*!**********************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/node_modules/trimArguments/trimArguments.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

// resolves varargs variable into more usable form
// args - should be a function arguments variable
// returns a javascript Array object of arguments that doesn't count trailing undefined values in the length
module.exports = function(theArguments) {
    var args = Array.prototype.slice.call(theArguments, 0)

    var count = 0;
    for(var n=args.length-1; n>=0; n--) {
        if(args[n] === undefined)
            count++
    }
    args.splice(-0, count)
    return args
}

/***/ }),
/* 52 */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/indent.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {


module.exports = function(i, str) {
    return i+str.split("\n")       // get all lines
              .join("\n"+i)      // join all lines with an indent
}

/***/ }),
/* 53 */
/*!******************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/util/util.js ***!
  \******************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ 54);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ 55);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16), __webpack_require__(/*! ./../process/browser.js */ 12)))

/***/ }),
/* 54 */
/*!*************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/util/support/isBufferBrowser.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 55 */
/*!****************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/util/node_modules/inherits/inherits_browser.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 56 */
/*!****************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/Container.js ***!
  \****************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// This file just contains a proxies to the actual source file, so that you can access standard blocks via require('blocks/Container')
module.exports = __webpack_require__(/*! ./src/node_modules/Components/Container */ 57)

/***/ }),
/* 57 */
/*!********************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/Components/Container.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Block = __webpack_require__(/*! ../Block */ 17)
var proto = __webpack_require__(/*! proto */ 0)

module.exports = proto(Block, function(superclass) {

	// static properties

    this.name = 'Container'


	// instance properties

	this.init = function (/*[label,] content*/) {
        if(typeof(arguments[0]) !== 'string') {
            var contentArgs = arguments
        } else {
            var label = arguments[0]
            var contentArgs = Array.prototype.slice.call(arguments, 1)
        }

        superclass.init.call(this) // superclass constructor

        this.label = label

		if(contentArgs !== undefined)
            this.add.apply(this,contentArgs)
	}
})


/***/ }),
/* 58 */
/*!*************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/EventEmitterB.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ 9).EventEmitter
var proto = __webpack_require__(/*! proto */ 0)
var utils = __webpack_require__(/*! utils */ 13)

module.exports = proto(EventEmitter, function(superclass) {

    this.init = function() {
        superclass.apply(this, arguments)

        this.ifonHandlers = {}
        this.ifoffHandlers = {}
        this.ifonAllHandlers = []
        this.ifoffAllHandlers = []
    }

    // callback will be triggered immediately if there is already a listener attached, or
    // callback will be triggered when the first listener for the event is added
    // (regardless of whether its done through on or once)
    // parameters can be:
        // event, callback - attach an ifon handler for the passed event
        // callback - attach an ifon handler for all events
    this.ifon = function(event, callback) {
        if(event instanceof Function) {     // event not passed, only a callback
            callback = event // fix the argument
            for(var eventName in this._events) {
                if(this.listeners(eventName).length > 0) {
                    callback(eventName)
                }
            }
        } else if(this.listeners(event).length > 0) {
            callback(event)
        }

        addHandlerToList(this, 'ifonHandlers', event, callback)
    }

    // removes either:
        // removeIfon() - all ifon handlers (if no arguments are passed), or
        // removeIfon(event) - all ifon handlers for the passed event, or
        // removeIfon(callback) - the passed ifon-all handler (if the first parameter is the callback)
        // removeIfon(event, callback) - the specific passed callback for the passed event
    this.removeIfon = function(event, callback) {
        removeFromHandlerList(this, 'ifonHandlers', event, callback)
    }

    // callback will be triggered when the last listener for the 'click' event is removed (will not trigger immediately if there is no event listeners on call of ifoff)
    // (regardless of whether this is done through removeListener or as a result of 'once' being fulfilled)
    // parameters can be:
        // event, callback - attach an ifoff handler for the passed event
        // callback - attach an ifoff handler for all events
    this.ifoff = function(event, callback) {
        addHandlerToList(this, 'ifoffHandlers', event, callback)
    }

    // removes either:
        // removeIfoff() - all ifoff handlers (if no arguments are passed), or
        // removeIfoff(event) - all ifoff handlers for the passed event, or
        // removeIfoff(callback) - the passed ifoff-all handler (if the first parameter is the callback)
        // removeIfoff(event, callback) - the specific passed callback for the passed event
    this.removeIfoff = function(event, callback) {
        removeFromHandlerList(this, 'ifoffHandlers', event, callback)
    }

    // emitter is the emitter to proxy handler binding to
    // options can have one of the following properties:
        // only - an array of events to proxy
        // except - an array of events to *not* proxy
    this.proxy = function(emitter, options) {
        if(options === undefined) options = {}
        if(options.except !== undefined) {
            var except = utils.arrayToMap(options.except)
            var handleIt = function(event){return !(event in except)}
        } else if(options.only !== undefined) {
            var only = utils.arrayToMap(options.only)
            var handleIt = function(event){return event in only}
        } else {
            var handleIt = function(){return true}
        }

        var that = this, handler;
        this.ifon(function(event) {
            if(handleIt(event)) {
                emitter.on(event, handler = function() {
                    that.emit.apply(that, [event].concat(Array.prototype.slice.call(arguments)))
                })
            }
        })
        this.ifoff(function(event) {
            if(handleIt(event))
                emitter.off(event, handler)
        })
    }

    /*override*/ this.on = this.addListener = function(event, callback) {
        var triggerIfOn = this.listeners(event).length === 0
        superclass.prototype.on.apply(this,arguments)
        if(triggerIfOn) triggerIfHandlers(this, 'ifonHandlers', event)
    }

    /*override*/ this.off = this.removeListener = function(event, callback) {
        var triggerIfOff = this.listeners(event).length === 1
        superclass.prototype.removeListener.apply(this,arguments)
        if(triggerIfOff) triggerIfHandlers(this, 'ifoffHandlers', event)
    }
    /*override*/ this.removeAllListeners = function(event) {
        var triggerIfOffForEvents = []
        if(event !== undefined) {
            if(this.listeners(event).length > 0) {
                triggerIfOffForEvents.push(event)
            }
        } else {
            for(var event in this._events) {
                if(this.listeners(event).length > 0) {
                    triggerIfOffForEvents.push(event)
                }
            }
        }

        superclass.prototype.removeAllListeners.apply(this,arguments)

        for(var n=0; n<triggerIfOffForEvents.length; n++) {
            triggerIfHandlers(this, 'ifoffHandlers', triggerIfOffForEvents[n])
        }
    }

})


// triggers the if handlers from the normal list and the "all" list
function triggerIfHandlers(that, handlerListName, event) {
    triggerIfHandlerList(that[handlerListName][event], event)
    triggerIfHandlerList(that[normalHandlerToAllHandlerProperty(handlerListName)], event)
}


// triggers the if handlers from a specific list
// ya these names are confusing, sorry : (
function triggerIfHandlerList(handlerList, event) {
    if(handlerList !== undefined) {
        for(var n=0; n<handlerList.length; n++) {
            handlerList[n](event)
        }
    }
}

function addHandlerToList(that, handlerListName, event, callback) {
    if(event instanceof Function) {
        // correct arguments
        callback = event
        event = undefined
    }

    if(event !== undefined && callback !== undefined) {
        var handlerList = that[handlerListName][event]
        if(handlerList === undefined) {
            handlerList = that[handlerListName][event] = []
        }

        handlerList.push(callback)
    } else {
        that[normalHandlerToAllHandlerProperty(handlerListName)].push(callback)
    }
}

function removeFromHandlerList(that, handlerListName, event, callback) {
    if(event instanceof Function) {
        // correct arguments
        callback = event
        event = undefined
    }

    if(event !== undefined && callback !== undefined) {
        removeCallbackFromList(that[handlerListName][event], callback)
    } else if(event !== undefined) {
        delete that[handlerListName][event]
    } else if(callback !== undefined) {
        var allHandlerListName = normalHandlerToAllHandlerProperty(handlerListName)
        removeCallbackFromList(that[allHandlerListName], callback)
    } else {
        var allHandlerListName = normalHandlerToAllHandlerProperty(handlerListName)
        that[handlerListName] = {}
        that[allHandlerListName] = []
    }
}

function normalHandlerToAllHandlerProperty(handlerListName) {
    if(handlerListName === 'ifonHandlers')
        return 'ifonAllHandlers'
    if(handlerListName === 'ifoffHandlers')
        return 'ifoffAllHandlers'
}

function removeCallbackFromList(list, callback) {
    var index = list.indexOf(callback)
    list.splice(index,1)
}

/***/ }),
/* 59 */
/*!**********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/observe/utils.js ***!
  \**********************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)

var path = __webpack_require__(/*! path */ 8)


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


/***/ }),
/* 60 */
/*!********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/domUtils.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {


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
exports.setSelectionRange = function(containerEl, start, end) {

    if(containerEl.nodeName === 'INPUT' || containerEl.nodeName === 'TEXTAREA') {
        containerEl.setSelectionRange(start, end)
    } else {
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var foundStart = false;

        iterateThroughLeafNodes(containerEl, function(node) {
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
                return true; // stop the iteration - we're done here
            }

            charIndex = nextCharIndex
        })

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

// gets the character offsets of a selection within a particular dom node
// returns undefined if there is no selection in the element
// note: yes this code doesn't work in older versions of IE (or possibly any versions) - if you want it to work in IE, please use http://modernizr.com/ or a polyfill for ranges
exports.getSelectionRange = function (element) {

    var selection = window.getSelection()
    var isInputOrArea = element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA'

    for(var n=0; n<selection.rangeCount; n++) {
        var range = selection.getRangeAt(0)
        if(isInputOrArea) {
            if(range.startOffset === range.endOffset && range.startContainer.children[range.startOffset] === element /*|| range.startContainer === element || */) { // I don't think the input or textarea itself will ever be the startContainer
                return [element.selectionStart, element.selectionEnd]
            }
        } else {
            var startsInElement = element.contains(range.startContainer)
            if(startsInElement) {
                var elementToIterateThrough = element
                var startFound = true
            } else {
                var elementToIterateThrough = range.commonAncestorContainer
                var startFound = false
                var startContainerFound = false
            }

            var visibleCharacterOffset = 0, start, end;
            iterateThroughLeafNodes(elementToIterateThrough, function(leaf) {
                if(!startFound) {
                    if(leaf === range.startContainer) {
                        startContainerFound = true
                    }

                    if(!element.contains(leaf) || !startContainerFound)
                        return; // continue
                    else if(startContainerFound)
                       startFound = true
                } else if(!startsInElement && !element.contains(leaf)) {
                    return true // done!
                }

                if(leaf === range.startContainer) {
                    start = visibleCharacterOffset + range.startOffset - findHiddenCharacters(leaf, range.startOffset)
                }
                if(leaf === range.endContainer) {
                    end = visibleCharacterOffset + range.endOffset - findHiddenCharacters(leaf, range.endOffset)
                    return true // done!
                }

                visibleCharacterOffset += leaf.length - findHiddenCharacters(leaf, leaf.length)
            })

            if(start === undefined && !startFound) {
                return undefined
            } else {
                if(start === undefined) {
                    start = 0 // start is at the beginning
                }
                if(end === undefined) {
                    end = visibleCharacterOffset // end is all the way at the end (the selection may continue in other elements)
                }

                return [start, end]
            }
        }
    }
}


// iterate through the leaf nodes inside element
// callback(node) - a function called for each leaf node
    // returning true from this ends the iteration
function iterateThroughLeafNodes(element, callback) {
    var nodeStack = [element], node;

    while (node = nodeStack.pop()) {
        if (node.nodeType == 3) {
            if(callback(node) === true)
                break;
        } else {
            var i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }
}

function findHiddenCharacters(node, beforeCaretIndex) {
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

/***/ }),
/* 61 */
/*!***********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/external/jss.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

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

/***/ }),
/* 62 */
/*!***********************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/Text.js ***!
  \***********************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// This file just contains a proxies to the actual source file, so that you can access standard blocks via require('blocks/Text')
module.exports = __webpack_require__(/*! ./src/node_modules/Components/Text */ 63)

/***/ }),
/* 63 */
/*!***************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/src/node_modules/Components/Text.js ***!
  \***************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Block = __webpack_require__(/*! ../Block */ 17)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 14)

module.exports = proto(Block, function(superclass) {

    //static properties

    this.name = 'Text'

    this.defaultStyle = Style({
        whiteSpace: 'pre-wrap' // so whitespace is displayed (e.g. multiple spaces don't collapse)
    })

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

        this.on("input",function(data) {
            var eventData = {newText:data.srcElement.textContent,oldText:that.oldText};
            that.oldText = eventData.newText;
            //that.emit("input",eventData);
        });

        this.on("blur",function(data) {
            var eventData = {newText:data.srcElement.textContent,oldText:that.lastFocus};
            that.lastFocus = eventData.newText;
            //that.emit("blur",eventData);
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


/***/ }),
/* 64 */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/Block.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// This file just contains a proxies to the actual source file, so that you can access standard blocks via require('blocks/Select')
module.exports = __webpack_require__(/*! ./src/node_modules/Block */ 17)

/***/ }),
/* 65 */
/*!************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/blocks.js/Style.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// This file just contains a proxies to the actual source file, so that you can access standard blocks via require('blocks/Select')
module.exports = __webpack_require__(/*! ./src/node_modules/Style */ 14)

/***/ }),
/* 66 */
/*!***********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit/deadunit.internal.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

module.exports = function(options) {
    var exports = {}

    var deadunitCore = options.deadunitCore
    var proto = __webpack_require__(/*! proto */ 20)

    var defaultFormats = __webpack_require__(/*! ./defaultFormats */ 21)
    exports.format = __webpack_require__(/*! ./basicFormatter */ 22)

    exports.error = deadunitCore.error

    exports.test = proto(deadunitCore.test, function() {
        this.string = function() {
            return defaultFormats.text(this, undefined, /*printOnTheFly=*/false, /*printLateEvents=*/false)
        }

        this.html = function() {
            return defaultFormats.html(this, false)
        }

        this.results = function() {
            arguments[0] = false
            return deadunitCore.test.results.apply(this, arguments)
        }

        options.environmentSpecificMethods.call(this)
    })

    return exports
}



/***/ }),
/* 67 */
/*!***********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/src/deadunitCore.browser.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2014 Billy Tetrud - Free to use for any purpose: MIT License*/

var deadunitCore = __webpack_require__(/*! ./deadunitCore */ 28)
var browserConfig = __webpack_require__(/*! ./deadunitCore.browserConfig */ 84)

module.exports = deadunitCore(browserConfig())

/***/ }),
/* 68 */
/*!****************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/url/url.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var punycode = __webpack_require__(/*! punycode */ 69);
var util = __webpack_require__(/*! ./util */ 71);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(/*! querystring */ 72);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 69 */
/*!**************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/punycode/punycode.js ***!
  \**************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/module.js */ 70)(module), __webpack_require__(/*! ./../webpack/buildin/global.js */ 16)))

/***/ }),
/* 70 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 71 */
/*!*****************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/url/util.js ***!
  \*****************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 72 */
/*!******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/querystring-es3/index.js ***!
  \******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 73);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 74);


/***/ }),
/* 73 */
/*!*******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/querystring-es3/decode.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 74 */
/*!*******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/querystring-es3/encode.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 75 */
/*!**************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/async-future/node_modules/trimArguments/trimArguments.js ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

// resolves varargs variable into more usable form
// args - should be a function arguments variable
// returns a javascript Array object of arguments that doesn't count trailing undefined values in the length
module.exports = function(theArguments) {
    var args = Array.prototype.slice.call(theArguments, 0)

    var count = 0;
    for(var n=args.length-1; n>=0; n--) {
        if(args[n] === undefined)
            count++
    }
    args.splice(-0, count)
    return args
}

/***/ }),
/* 76 */
/*!*********************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/source-map.js ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(/*! ./lib/source-map-generator */ 30).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(/*! ./lib/source-map-consumer */ 79).SourceMapConsumer;
exports.SourceNode = __webpack_require__(/*! ./lib/source-node */ 82).SourceNode;


/***/ }),
/* 77 */
/*!*********************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/base64.js ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),
/* 78 */
/*!***************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/mapping-list.js ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ 11);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;


/***/ }),
/* 79 */
/*!**********************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/source-map-consumer.js ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(/*! ./util */ 11);
var binarySearch = __webpack_require__(/*! ./binary-search */ 80);
var ArraySet = __webpack_require__(/*! ./array-set */ 32).ArraySet;
var base64VLQ = __webpack_require__(/*! ./base64-vlq */ 31);
var quickSort = __webpack_require__(/*! ./quick-sort */ 81).quickSort;

function SourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 80 */
/*!****************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/binary-search.js ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),
/* 81 */
/*!*************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/quick-sort.js ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),
/* 82 */
/*!**************************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/node_modules/source-map/lib/source-node.js ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(/*! ./source-map-generator */ 30).SourceMapGenerator;
var util = __webpack_require__(/*! ./util */ 11);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),
/* 83 */
/*!*****************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/src/processResults.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function returnResults(unitTestObject) {

    var results;
    var groups = {}
    var groupMetadata = {}

    var primaryGroup;
    var ended = false

    unitTestObject.events({
        group: function(e) {
            var g = {
               parent: e.parent,
               id: e.id,              // a unique id for the test group
               type: 'group',         // indicates a test group (either a `Unit.test` call or `this.test`)
               name: e.name,          // the name of the test
               results: [],           // An array of test results, which can be of an `UnitTest` Result Types
               exceptions: [],        // An array of uncaught exceptions thrown in the test,
               time: e.time,
               duration: 0            // the duration of the test from its start til the last test action (assert, log, etc)
               //                       including asynchronous parts and including subtests
               //syncDuration: _,      // the synchronous duration of the test (not including any asynchronous parts)
               //totalSyncDuration: _  // syncDuration plus the before and after (if applicable)
            }

            if(primaryGroup === undefined) primaryGroup = g

            groups[e.id] = g
            groupMetadata[e.id] = {}
            if(e.parent === undefined) {
                results = g
            } else {
                groups[e.parent].results.push(g)
            }
        },
        assert: function(e) {
            e.type = 'assert'
            groups[e.parent].results.push(e)
            setGroupDuration(e.parent, e.time)
        },
        count: function(e) {
            e.type = 'assert'
            setGroupDuration(e.parent, e.time)

            groupMetadata[e.parent].countInfo = e
        },
        exception: function(e) {
            groups[e.parent].exceptions.push(e.error)
            setGroupDuration(e.parent, e.time)
        },
        log: function(e) {
            e.type = 'log'
            groups[e.parent].results.push(e)
            setGroupDuration(e.parent, e.time)
        },
        before: function(e) {
            groups[e.parent].beforeStart = e.time
        },
        after: function(e) {
            groups[e.parent].afterStart = e.time
        },
        beforeEnd: function(e) {
            groups[e.parent].beforeDuration = e.time - groups[e.parent].beforeStart
        },
        afterEnd: function(e) {
            groups[e.parent].afterDuration = e.time - groups[e.parent].afterStart
        },
        groupEnd: function(e) {
            setGroupDuration(e.id, e.time)
        },
        end: function(e) {
            primaryGroup.timeout = e.type === 'timeout'
            setGroupDuration(primaryGroup.id, e.time)

            // make the count assertions
            eachTest(primaryGroup, function(subtest, parenttest) {
                var countInfo = groupMetadata[subtest.id].countInfo
                if(countInfo !== undefined) {
                    var info = countInfo
                    var actualCount = 0
                    subtest.results.forEach(function(a) {
                        if(a.type === 'assert' || a.type === 'group')
                            actualCount++
                    })

                    subtest.results.splice(0,0,{
                        parent: subtest.id,
                        type: 'assert',
                        success: actualCount === info.expected,
                        time: info.time,
                        sourceLines: info.sourceLines,
                        file: info.file,
                        line: info.line,
                        column: info.column,
                        expected: info.expected,
                        actual: actualCount
                    })
                }
            })

            ended = true
        }
    })

    function setGroupDuration(groupid, time) {
        var newDuration = time - groups[groupid].time
        if(newDuration > groups[groupid].duration) {
            groups[groupid].duration = newDuration
        }

        if(groups[groupid].parent) {
            setGroupDuration(groups[groupid].parent, time)
        }
    }

    return results
}


// iterates through the tests and subtests leaves first (depth first)
function eachTest(test, callback, parent) {
    test.results.forEach(function(result) {
        if(result.type === 'group') {
            eachTest(result, callback, test)
        }
    })

    callback(test, parent)
}

/***/ }),
/* 84 */
/*!*****************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/deadunit-core/src/deadunitCore.browserConfig.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2014 Billy Tetrud - Free to use for any purpose: MIT License*/

var path = __webpack_require__(/*! path */ 8);

var Future = __webpack_require__(/*! async-future */ 10)
var proto = __webpack_require__(/*! proto */ 29)
var stackinfo = __webpack_require__(/*! stackinfo */ 85)
var ajax = __webpack_require__(/*! ajax */ 89)
var resolveSourceMap = Future.wrap(__webpack_require__(/*! source-map-resolve */ 92).resolveSourceMap)

var deadunitCore = __webpack_require__(/*! ./deadunitCore */ 28)
var isRelative = __webpack_require__(/*! ./isRelative */ 33)

ajax.setSynchronous(true) // todo: REMOVE THIS once this chrome bug is fixed in a public release: https://code.google.com/p/chromium/issues/detail?id=368444

// add sourceFile contents into stacktrace.js's cache
var sourceCache = {}
var cacheGet = function(url) {
    return sourceCache[url]
}
var cacheSet = function(url, responseFuture) {
    sourceCache[url] = responseFuture
    if(stackinfo.sourceCache[url] === undefined) {
        responseFuture.then(function(response) {
            stackinfo.sourceCache[url] = response.text.split('\n')
        }).done()
    }
}

// source-map-resolve assumed the availability of setImmediate
if(window.setImmediate === undefined) {
    window.setImmediate = function(fn, params) {
        setTimeout(function() {
            fn.apply(this,params)
        },0)
    }
}

ajax.cacheGet(cacheGet)
ajax.cacheSet(cacheSet)


var config = module.exports = proto(function() {
    this.init = function() {
        var that = this
        // node.js errback style readFile
        /*private*/ this.readFile = function(url, callback) {
            that.ajax(url).then(function(response) { // need to use 'that' because readFile will not be called with this config object as the context
                callback(undefined, response.text)
            }).catch(callback).done()
        }
    }

    this.ajax = ajax

    this.initialize = function() {}

    this.initializeMainTest = function(testState) {
        //testState.active = true // make sure

        testState.oldOnerror = window.onerror
        testState.newOnerror = window.onerror = function(errorMessage, filename, line, column) {
            if(column === undefined) var columnText = ''
            else                     var columnText = "/"+column

            try {
                throw new Error("Uncaught error in "+filename+" line "+line+columnText+": "+errorMessage) // IE needs the exception to actually be thrown before it will have a stack trace
            } catch(e) {
                testState.unhandledErrorHandler(e, true)
                if(testState.oldOnerror)
                    testState.oldOnerror.apply(this, arguments)
            }
        }
    }
    this.mainTestDone= function(testState) {
        //testState.active = false // make sure the test-specific onerror code is no longer run
        /*if(testState.newOnerror === window.onerror) {
            window.onerror = testState.oldOnerror // otherwise something else has overwritten onerror, so don't mess with it
        }*/
    }

    this.getDomain= function() {
        return undefined // domains don't exist in-browser
    }

    this.runTestGroup= function(deadunitState, tester, runTest, handleError, handleUnhandledError) {
        runTest()
    }
    this.getScriptSourceLines= function(path) {
        if(stackinfo.sourceCache[path] !== undefined) {
            return Future(stackinfo.sourceCache[path])
        } else {
            return this.ajax(path).then(function(response) {
                return Future(response.text.split('\n'))
            })
        }

    }
    this.getSourceMapObject = function(url, warningHandler) {
        var that = this
        return this.ajax(url).then(function(response) {
            var headers = response.headers
            if(headers['SourceMap'] !== undefined) {
                var headerSourceMap = headers['SourceMap']
            } else if(headers['X-SourceMap']) {
                var headerSourceMap = headers['X-SourceMap']
            }

            if(headerSourceMap !== undefined) {
                if(isRelative(headerSourceMap)) {
                    headerSourceMap = path.join(path.dirname(url),headerSourceMap)
                }

                return that.ajax(headerSourceMap).then(function(response) {
                    return Future(JSON.parse(response.text))
                })

            } else {
                return resolveSourceMap(response.text, url, that.readFile).catch(function(e){
                    warningHandler(e)
                    return Future(null)

                }).then(function(sourceMapObject) {
                    if(sourceMapObject !== null) {
                        return Future(sourceMapObject.map)
                    } else {
                        return Future(undefined)
                    }
                })
            }
        })
    }

    this.defaultUnhandledErrorHandler= function(e) {
        //if(e !== undefined)
            setTimeout(function() {
                if(e.stack)
                    console.log(e.stack)
                else
                    console.log(e)
            },0)
    }
    this.defaultTestErrorHandler= function(tester) {
        return function(e) {
            tester.manager.emit('exception', {
                parent: tester.mainSubTest.id,
                time: (new Date()).getTime(),
                error: e
            })
        }
    }

    this.getLineInfo= function(stackIncrease) {
        return Future(stackinfo()[3+stackIncrease])
    }

    this.getExceptionInfo= function(e) {
        return Future(stackinfo(e))
    }

    this.throwAsyncException = function(e) {
        setTimeout(function() {
            if(e.stack !== undefined) throw e.stack
            else                      throw e
        },0)
    }
})


/***/ }),
/* 85 */
/*!****************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/stackinfo/stackinfo.js ***!
  \****************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var printStackTrace = __webpack_require__(/*! stacktrace-js */ 86)
var parsers = __webpack_require__(/*! ./tracelineParser */ 87)
var mode = __webpack_require__(/*! ./exceptionMode */ 88)

module.exports = function(ex) {
    if(parsers[mode] === undefined)
        throw new Error("browser "+mode+" not supported")

    var options = undefined
    if(ex !== undefined) {
        if(mode === 'ie' && ex.number === undefined)
            ex.number = 1    // work around for this: https://github.com/stacktracejs/stacktrace.js/issues/80
        options = {e:ex, guess: true}
    }
    var trace = printStackTrace(options)

    if(ex === undefined) {
        trace.splice(0,4) // strip stacktrace-js internals
    }

    return parseStacktrace(trace)
}

function TraceInfo(traceline) {
    this.traceline = traceline
}
TraceInfo.prototype = {
    get file() {
        return getInfo(this).file
    },
    get function() {
        return getInfo(this).function
    },
    get line() {
        return getInfo(this).line
    },
    get column() {
        return getInfo(this).column
    },
    get info() {
        return getInfo(this)
    }
}

function getInfo(traceInfo) {
    if(traceInfo.cache === undefined) {
        var info = parsers[mode](traceInfo.traceline)
        if(info.line !== undefined)
            info.line = parseInt(info.line, 10)
        if(info.column !== undefined)
            info.column = parseInt(info.column, 10)

        traceInfo.cache = info
    }

    return traceInfo.cache
}

function parseStacktrace(trace) {
    var results = []
    for(var n = 0; n<trace.length; n++) {
        results.push(new TraceInfo(trace[n]))
    }
    return results
}

// here because i'm lazy, they're here for testing only
module.exports.parsers = parsers
module.exports.mode = mode
module.exports.sourceCache = printStackTrace.implementation.prototype.sourceCache // expose this so you can consolidate caches together from different libraries


/***/ }),
/* 86 */
/*!*********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/stacktrace-js/stacktrace.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)
(function(global, factory) {
  // Node
  if (true) {
    module.exports = factory();

  // AMD
  } else if (typeof define === 'function' && define.amd) {
    define(factory);

  // Browser globals
  } else {
    global.printStackTrace = factory();
  }
}(this, function() {
	/**
	 * Main function giving a function stack trace with a forced or passed in Error
	 *
	 * @cfg {Error} e The error to create a stacktrace from (optional)
	 * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
	 * @return {Array} of Strings with functions, lines, files, and arguments where possible
	 */
	function printStackTrace(options) {
	    options = options || {guess: true};
	    var ex = options.e || null, guess = !!options.guess;
	    var p = new printStackTrace.implementation(), result = p.run(ex);
	    return (guess) ? p.guessAnonymousFunctions(result) : result;
	}

	printStackTrace.implementation = function() {
	};

	printStackTrace.implementation.prototype = {
	    /**
	     * @param {Error} ex The error to create a stacktrace from (optional)
	     * @param {String} mode Forced mode (optional, mostly for unit tests)
	     */
	    run: function(ex, mode) {
	        ex = ex || this.createException();
	        // examine exception properties w/o debugger
	        //for (var prop in ex) {alert("Ex['" + prop + "']=" + ex[prop]);}
	        mode = mode || this.mode(ex);
	        if (mode === 'other') {
	            return this.other(arguments.callee);
	        } else {
	            return this[mode](ex);
	        }
	    },

	    createException: function() {
	        try {
	            this.undef();
	        } catch (e) {
	            return e;
	        }
	    },

	    /**
	     * Mode could differ for different exception, e.g.
	     * exceptions in Chrome may or may not have arguments or stack.
	     *
	     * @return {String} mode of operation for the exception
	     */
	    mode: function(e) {
	        if (e['arguments'] && e.stack) {
	            return 'chrome';
	        } else if (e.stack && e.sourceURL) {
	            return 'safari';
	        } else if (e.stack && e.number) {
	            return 'ie';
	        } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
	            // e.message.indexOf("Backtrace:") > -1 -> opera
	            // !e.stacktrace -> opera
	            if (!e.stacktrace) {
	                return 'opera9'; // use e.message
	            }
	            // 'opera#sourceloc' in e -> opera9, opera10a
	            if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
	                return 'opera9'; // use e.message
	            }
	            // e.stacktrace && !e.stack -> opera10a
	            if (!e.stack) {
	                return 'opera10a'; // use e.stacktrace
	            }
	            // e.stacktrace && e.stack -> opera10b
	            if (e.stacktrace.indexOf("called from line") < 0) {
	                return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
	            }
	            // e.stacktrace && e.stack -> opera11
	            return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
	        } else if (e.stack && !e.fileName) {
	            // Chrome 27 does not have e.arguments as earlier versions,
	            // but still does not have e.fileName as Firefox
	            return 'chrome';
	        } else if (e.stack) {
	            return 'firefox';
	        }
	        return 'other';
	    },

	    /**
	     * Given a context, function name, and callback function, overwrite it so that it calls
	     * printStackTrace() first with a callback and then runs the rest of the body.
	     *
	     * @param {Object} context of execution (e.g. window)
	     * @param {String} functionName to instrument
	     * @param {Function} callback function to call with a stack trace on invocation
	     */
	    instrumentFunction: function(context, functionName, callback) {
	        context = context || window;
	        var original = context[functionName];
	        context[functionName] = function instrumented() {
	            callback.call(this, printStackTrace().slice(4));
	            return context[functionName]._instrumented.apply(this, arguments);
	        };
	        context[functionName]._instrumented = original;
	    },

	    /**
	     * Given a context and function name of a function that has been
	     * instrumented, revert the function to it's original (non-instrumented)
	     * state.
	     *
	     * @param {Object} context of execution (e.g. window)
	     * @param {String} functionName to de-instrument
	     */
	    deinstrumentFunction: function(context, functionName) {
	        if (context[functionName].constructor === Function &&
	                context[functionName]._instrumented &&
	                context[functionName]._instrumented.constructor === Function) {
	            context[functionName] = context[functionName]._instrumented;
	        }
	    },

	    /**
	     * Given an Error object, return a formatted Array based on Chrome's stack string.
	     *
	     * @param e - Error object to inspect
	     * @return Array<String> of function calls, files and line numbers
	     */
	    chrome: function(e) {
	        var stack = (e.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
	          replace(/^\s+(at eval )?at\s+/gm, '').
	          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
	          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
	        stack.pop();
	        return stack;
	    },

	    /**
	     * Given an Error object, return a formatted Array based on Safari's stack string.
	     *
	     * @param e - Error object to inspect
	     * @return Array<String> of function calls, files and line numbers
	     */
	    safari: function(e) {
	        return e.stack.replace(/\[native code\]\n/m, '')
	            .replace(/^(?=\w+Error\:).*$\n/m, '')
	            .replace(/^@/gm, '{anonymous}()@')
	            .split('\n');
	    },

	    /**
	     * Given an Error object, return a formatted Array based on IE's stack string.
	     *
	     * @param e - Error object to inspect
	     * @return Array<String> of function calls, files and line numbers
	     */
	    ie: function(e) {
	        var lineRE = /^.*at (\w+) \(([^\)]+)\)$/gm;
	        return e.stack.replace(/at Anonymous function /gm, '{anonymous}()@')
	            .replace(/^(?=\w+Error\:).*$\n/m, '')
	            .replace(lineRE, '$1@$2')
	            .split('\n');
	    },

	    /**
	     * Given an Error object, return a formatted Array based on Firefox's stack string.
	     *
	     * @param e - Error object to inspect
	     * @return Array<String> of function calls, files and line numbers
	     */
	    firefox: function(e) {
	        return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^[\(@]/gm, '{anonymous}()@').split('\n');
	    },

	    opera11: function(e) {
	        var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
	        var lines = e.stacktrace.split('\n'), result = [];

	        for (var i = 0, len = lines.length; i < len; i += 2) {
	            var match = lineRE.exec(lines[i]);
	            if (match) {
	                var location = match[4] + ':' + match[1] + ':' + match[2];
	                var fnName = match[3] || "global code";
	                fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
	                result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
	            }
	        }

	        return result;
	    },

	    opera10b: function(e) {
	        // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
	        // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
	        // "@file://localhost/G:/js/test/functional/testcase1.html:15"
	        var lineRE = /^(.*)@(.+):(\d+)$/;
	        var lines = e.stacktrace.split('\n'), result = [];

	        for (var i = 0, len = lines.length; i < len; i++) {
	            var match = lineRE.exec(lines[i]);
	            if (match) {
	                var fnName = match[1]? (match[1] + '()') : "global code";
	                result.push(fnName + '@' + match[2] + ':' + match[3]);
	            }
	        }

	        return result;
	    },

	    /**
	     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
	     *
	     * @param e - Error object to inspect
	     * @return Array<String> of function calls, files and line numbers
	     */
	    opera10a: function(e) {
	        // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
	        // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
	        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	        var lines = e.stacktrace.split('\n'), result = [];

	        for (var i = 0, len = lines.length; i < len; i += 2) {
	            var match = lineRE.exec(lines[i]);
	            if (match) {
	                var fnName = match[3] || ANON;
	                result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
	            }
	        }

	        return result;
	    },

	    // Opera 7.x-9.2x only!
	    opera9: function(e) {
	        // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
	        // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
	        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	        var lines = e.message.split('\n'), result = [];

	        for (var i = 2, len = lines.length; i < len; i += 2) {
	            var match = lineRE.exec(lines[i]);
	            if (match) {
	                result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
	            }
	        }

	        return result;
	    },

	    // Safari 5-, IE 9-, and others
	    other: function(curr) {
	        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], fn, args, maxStackSize = 10;
	        while (curr && curr['arguments'] && stack.length < maxStackSize) {
	            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
	            args = Array.prototype.slice.call(curr['arguments'] || []);
	            stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
	            curr = curr.caller;
	        }
	        return stack;
	    },

	    /**
	     * Given arguments array as a String, substituting type names for non-string types.
	     *
	     * @param {Arguments,Array} args
	     * @return {String} stringified arguments
	     */
	    stringifyArguments: function(args) {
	        var result = [];
	        var slice = Array.prototype.slice;
	        for (var i = 0; i < args.length; ++i) {
	            var arg = args[i];
	            if (arg === undefined) {
	                result[i] = 'undefined';
	            } else if (arg === null) {
	                result[i] = 'null';
	            } else if (arg.constructor) {
	                if (arg.constructor === Array) {
	                    if (arg.length < 3) {
	                        result[i] = '[' + this.stringifyArguments(arg) + ']';
	                    } else {
	                        result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
	                    }
	                } else if (arg.constructor === Object) {
	                    result[i] = '#object';
	                } else if (arg.constructor === Function) {
	                    result[i] = '#function';
	                } else if (arg.constructor === String) {
	                    result[i] = '"' + arg + '"';
	                } else if (arg.constructor === Number) {
	                    result[i] = arg;
	                }
	            }
	        }
	        return result.join(',');
	    },

	    sourceCache: {},

	    /**
	     * @return the text from a given URL
	     */
	    ajax: function(url) {
	        var req = this.createXMLHTTPObject();
	        if (req) {
	            try {
	                req.open('GET', url, false);
	                //req.overrideMimeType('text/plain');
	                //req.overrideMimeType('text/javascript');
	                req.send(null);
	                //return req.status == 200 ? req.responseText : '';
	                return req.responseText;
	            } catch (e) {
	            }
	        }
	        return '';
	    },

	    /**
	     * Try XHR methods in order and store XHR factory.
	     *
	     * @return <Function> XHR function or equivalent
	     */
	    createXMLHTTPObject: function() {
	        var xmlhttp, XMLHttpFactories = [
	            function() {
	                return new XMLHttpRequest();
	            }, function() {
	                return new ActiveXObject('Msxml2.XMLHTTP');
	            }, function() {
	                return new ActiveXObject('Msxml3.XMLHTTP');
	            }, function() {
	                return new ActiveXObject('Microsoft.XMLHTTP');
	            }
	        ];
	        for (var i = 0; i < XMLHttpFactories.length; i++) {
	            try {
	                xmlhttp = XMLHttpFactories[i]();
	                // Use memoization to cache the factory
	                this.createXMLHTTPObject = XMLHttpFactories[i];
	                return xmlhttp;
	            } catch (e) {
	            }
	        }
	    },

	    /**
	     * Given a URL, check if it is in the same domain (so we can get the source
	     * via Ajax).
	     *
	     * @param url <String> source url
	     * @return <Boolean> False if we need a cross-domain request
	     */
	    isSameDomain: function(url) {
	        return typeof location !== "undefined" && url.indexOf(location.hostname) !== -1; // location may not be defined, e.g. when running from nodejs.
	    },

	    /**
	     * Get source code from given URL if in the same domain.
	     *
	     * @param url <String> JS source URL
	     * @return <Array> Array of source code lines
	     */
	    getSource: function(url) {
	        // TODO reuse source from script tags?
	        if (!(url in this.sourceCache)) {
	            this.sourceCache[url] = this.ajax(url).split('\n');
	        }
	        return this.sourceCache[url];
	    },

	    guessAnonymousFunctions: function(stack) {
	        for (var i = 0; i < stack.length; ++i) {
	            var reStack = /\{anonymous\}\(.*\)@(.*)/,
	                reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
	                frame = stack[i], ref = reStack.exec(frame);

	            if (ref) {
	                var m = reRef.exec(ref[1]);
	                if (m) { // If falsey, we did not get any file/line information
	                    var file = m[1], lineno = m[2], charno = m[3] || 0;
	                    if (file && this.isSameDomain(file) && lineno) {
	                        var functionName = this.guessAnonymousFunction(file, lineno, charno);
	                        stack[i] = frame.replace('{anonymous}', functionName);
	                    }
	                }
	            }
	        }
	        return stack;
	    },

	    guessAnonymousFunction: function(url, lineNo, charNo) {
	        var ret;
	        try {
	            ret = this.findFunctionName(this.getSource(url), lineNo);
	        } catch (e) {
	            ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
	        }
	        return ret;
	    },

	    findFunctionName: function(source, lineNo) {
	        // FIXME findFunctionName fails for compressed source
	        // (more than one function on the same line)
	        // function {name}({args}) m[1]=name m[2]=args
	        var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
	        // {name} = function ({args}) TODO args capture
	        // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
	        var reFunctionExpression = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;
	        // {name} = eval()
	        var reFunctionEvaluation = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
	        // Walk backwards in the source lines until we find
	        // the line which matches one of the patterns above
	        var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
	        for (var i = 0; i < maxLines; ++i) {
	            // lineNo is 1-based, source[] is 0-based
	            line = source[lineNo - i - 1];
	            commentPos = line.indexOf('//');
	            if (commentPos >= 0) {
	                line = line.substr(0, commentPos);
	            }
	            // TODO check other types of comments? Commented code may lead to false positive
	            if (line) {
	                code = line + code;
	                m = reFunctionExpression.exec(code);
	                if (m && m[1]) {
	                    return m[1];
	                }
	                m = reFunctionDeclaration.exec(code);
	                if (m && m[1]) {
	                    //return m[1] + "(" + (m[2] || "") + ")";
	                    return m[1];
	                }
	                m = reFunctionEvaluation.exec(code);
	                if (m && m[1]) {
	                    return m[1];
	                }
	            }
	        }
	        return '(?)';
	    }
	};

	return printStackTrace;
}));

/***/ }),
/* 87 */
/*!**********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/stackinfo/tracelineParser.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {


module.exports = {
    chrome: function(line) {
        var m = line.match(CHROME_STACK_LINE);
        if (m) {
            var file = m[9] || m[18] || m[26]
            var fn = m[4] || m[7] || m[14] || m[23]
            var lineNumber = m[11] || m[20]
            var column = m[13] || m[22]
        } else {
            //throw new Error("Couldn't parse exception line: "+line)
        }
        
        return {
            file: file,
            function: fn,
            line: lineNumber,
            column: column
        }
    },
    
    firefox: function(line) {
        var m = line.match(FIREFOX_STACK_LINE);
        if (m) {
            var file = m[8]
            var fn = m[1]
            var lineNumber = m[10]
            var column = m[12]
        }
        
        return {
            file: file,
            function: fn,
            line: lineNumber,
            column: column
        }
    },
    
    ie: function(line) {
        var m = line.match(IE_STACK_LINE);
        if (m) {
            var file = m[3] || m[10]
            var fn = m[2] || m[9]
            var lineNumber = m[5] || m[12]
            var column = m[7] || m[14]
        }
        
        return {
            file: file,
            function: fn,
            line: lineNumber,
            column: column
        }
    }
}

// The following 2 regex patterns were originally taken from google closure library: https://code.google.com/p/closure-library/source/browse/closure/goog/testing/stacktrace.js
// RegExp pattern for JavaScript identifiers. We don't support Unicode identifiers defined in ECMAScript v3.
var IDENTIFIER_PATTERN_ = '[\\w$]*';
// RegExp pattern for an URL + position inside the file.
var URL_PATTERN_ = '((?:http|https|file)://[^\\s)]+?|javascript:.*)';
var FILE_AND_LINE = URL_PATTERN_+'(:(\\d*)(:(\\d*))?)'

var STACKTRACE_JS_GETSOURCE_FAILURE = 'getSource failed with url'

var CHROME_STACKTRACE_JS_GETSOURCE_FAILURE = STACKTRACE_JS_GETSOURCE_FAILURE+'((?!'+'\\(\\)@'+').)*'

var CHROME_FILE_AND_LINE = FILE_AND_LINE//URL_PATTERN_+'(:(\\d*):(\\d*))'
var CHROME_IDENTIFIER_PATTERN = '\\<?'+IDENTIFIER_PATTERN_+'\\>?'
var CHROME_COMPOUND_IDENTIFIER = "((new )?"+CHROME_IDENTIFIER_PATTERN+'(\\.'+CHROME_IDENTIFIER_PATTERN+')*)( \\[as '+IDENTIFIER_PATTERN_+'])?'
var CHROME_UNKNOWN_IDENTIFIER = "(\\(\\?\\))"

// output from stacktrace.js is: "name()@..." instead of "name (...)"
var CHROME_ANONYMOUS_FUNCTION = '('+CHROME_STACKTRACE_JS_GETSOURCE_FAILURE+'|'+CHROME_COMPOUND_IDENTIFIER+'|'+CHROME_UNKNOWN_IDENTIFIER+')'
                                    +'\\(\\)'+'@'+CHROME_FILE_AND_LINE
var CHROME_NORMAL_FUNCTION = CHROME_COMPOUND_IDENTIFIER+' \\('+CHROME_FILE_AND_LINE+'\\)'
var CHROME_NATIVE_FUNCTION = CHROME_COMPOUND_IDENTIFIER+' (\\(native\\))'

var CHROME_FUNCTION_CALL = '('+CHROME_ANONYMOUS_FUNCTION+"|"+CHROME_NORMAL_FUNCTION+"|"+CHROME_NATIVE_FUNCTION+')'

var CHROME_STACK_LINE = new RegExp('^'+CHROME_FUNCTION_CALL+'$')  // precompile them so its faster


var FIREFOX_STACKTRACE_JS_GETSOURCE_FAILURE = STACKTRACE_JS_GETSOURCE_FAILURE+'((?!'+'\\(\\)@'+').)*'+'\\(\\)'
var FIREFOX_FILE_AND_LINE = FILE_AND_LINE//URL_PATTERN_+'((:(\\d*):(\\d*))|(:(\\d*)))'
var FIREFOX_ARRAY_PART = '\\[\\d*\\]'
var FIREFOX_WEIRD_PART = '\\(\\?\\)'
var FIREFOX_COMPOUND_IDENTIFIER = '(('+IDENTIFIER_PATTERN_+'|'+FIREFOX_ARRAY_PART+'|'+FIREFOX_WEIRD_PART+')((\\(\\))?|(\\.|\\<|/)*))*'
var FIREFOX_FUNCTION_CALL = '('+FIREFOX_COMPOUND_IDENTIFIER+'|'+FIREFOX_STACKTRACE_JS_GETSOURCE_FAILURE+')@'+FIREFOX_FILE_AND_LINE
var FIREFOX_STACK_LINE = new RegExp('^'+FIREFOX_FUNCTION_CALL+'$')

var IE_WHITESPACE = '[\\w \\t]'
var IE_FILE_AND_LINE = FILE_AND_LINE
var IE_ANONYMOUS = '('+IE_WHITESPACE+'*({anonymous}\\(\\)))@\\('+IE_FILE_AND_LINE+'\\)'
var IE_NORMAL_FUNCTION = '('+IDENTIFIER_PATTERN_+')@'+IE_FILE_AND_LINE
var IE_FUNCTION_CALL = '('+IE_NORMAL_FUNCTION+'|'+IE_ANONYMOUS+')'+IE_WHITESPACE+'*'
var IE_STACK_LINE = new RegExp('^'+IE_FUNCTION_CALL+'$')

/***/ }),
/* 88 */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/stackinfo/exceptionMode.js ***!
  \********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {



module.exports = exceptionMode(createException()) // basically what browser this is

// verbatim from `mode` in stacktrace.js as of 2014-01-23
function exceptionMode(e) {
    if (e['arguments'] && e.stack) {
        return 'chrome';
    } else if (e.stack && e.sourceURL) {
        return 'safari';
    } else if (e.stack && e.number) {
        return 'ie';
    } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
        // e.message.indexOf("Backtrace:") > -1 -> opera
        // !e.stacktrace -> opera
        if (!e.stacktrace) {
            return 'opera9'; // use e.message
        }
        // 'opera#sourceloc' in e -> opera9, opera10a
        if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
            return 'opera9'; // use e.message
        }
        // e.stacktrace && !e.stack -> opera10a
        if (!e.stack) {
            return 'opera10a'; // use e.stacktrace
        }
        // e.stacktrace && e.stack -> opera10b
        if (e.stacktrace.indexOf("called from line") < 0) {
            return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
        }
        // e.stacktrace && e.stack -> opera11
        return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
    } else if (e.stack && !e.fileName) {
        // Chrome 27 does not have e.arguments as earlier versions,
        // but still does not have e.fileName as Firefox
        return 'chrome';
    } else if (e.stack) {
        return 'firefox';
    }
    return 'other';
}

function createException() {
    try {
        this.undef();
    } catch (e) {
        return e;
    }
}


/***/ }),
/* 89 */
/*!******************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/ajax/ajax.js ***!
  \******************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Future = __webpack_require__(/*! async-future */ 90)

// returns the XHR function or equivalent for use with ajax
// memoizes the function for faster repeated use
var createXMLHTTPObject = function() {
    var versions = ["Msxml2.XMLHTTP",
                    "Msxml3.XMLHTTP",
                    "Microsoft.XMLHTTP",
                    "MSXML2.XmlHttp.6.0",
                    "MSXML2.XmlHttp.5.0",
                    "MSXML2.XmlHttp.4.0",
                    "MSXML2.XmlHttp.3.0",
                    "MSXML2.XmlHttp.2.0"
    ]

    if(XMLHttpRequest !== undefined) {  // For non-IE browsers
        createXMLHTTPObject = function() {  // Use memoization to cache the factory
            return new XMLHttpRequest()
        }
        return createXMLHTTPObject()

    } else { // IE
        for(var i=0, n=versions.length; i<n; i++) {
            try {
                var version = versions[i]
                var fn = function() {
                    return new ActiveXObject(version)
                }
                createXMLHTTPObject = fn   // Use memoization to cache the factory
                return createXMLHTTPObject()

            } catch(e) {   }
        }
    }

    throw new Error('Cant get XmlHttpRequest object')
}



var HEADER = "([^\\s]+): (.*)"

// returns the contents and headers from a given URL
exports = module.exports = function(url) {
    if(getFromCache(url))
        return getFromCache(url)

    var futureResult = new Future
    setOnCache(url, futureResult)

    var req = createXMLHTTPObject()
    req.onreadystatechange = function() {
        if( req.readyState === 4 ) {
            if( req.status === 200 ) {
                var headers = {}
                req.getAllResponseHeaders().split('\n').forEach(function(line) {
                    var match = line.match(HEADER)
                    if(match !== null) {
                        var name = match[1]
                        var value = match[2]

                        headers[name] = value
                    }
                })

                futureResult.return({text: req.responseText, headers: headers})

            } else {
                var error = new Error('Error in request: Status '+req.status)
                error.status = req.status
                futureResult.throw(error)
            }
        }
    }

    req.onerror = function(e) {
        futureResult.throw(e)
    }


    req.open('GET', url, asynchronous)
    try {
        req.send()
    } catch(e) {
        futureResult.throw(e)
    }

    return futureResult
}

var cache = {}
var getFromCache = function(url) {
    return cache[url]
}
var setOnCache = function(url, futureResponse) {
    cache[url] = futureResponse
}

var asynchronous = true
exports.setSynchronous = function(synchronous) { // this is here so I can work around this bug in chrome: https://code.google.com/p/chromium/issues/detail?id=368444
    asynchronous = !synchronous
}

exports.cacheGet = function(fn) {
    getFromCache = fn
}
exports.cacheSet = function(fn) {
    setOnCache = fn
}

/***/ }),
/* 90 */
/*!***************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/ajax/node_modules/async-future/asyncFuture.js ***!
  \***************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/

var trimArgs = __webpack_require__(/*! trimArguments */ 91)


module.exports = Future

Future.debug = false // switch this to true if you want ids and long stack traces

var curId = 0         // for ids\
function Future(value) {
	if(arguments.length > 0) {
		var f = new Future()
        f.return(value)
        return f
	} else {
        this.isResolved = false
        this.queue = []
        if(Future.debug) {
            curId++
            this.id = curId
        }
    }
}

// static methods

// has one parameter: either a bunch of futures, or a single array of futures
// returns a promise that resolves when one of them errors, or when all of them succeeds
Future.all = function() {
    if(arguments[0] instanceof Array) {
        var futures = arguments[0]
    } else {
        var futures = trimArgs(arguments)
    }

    var f = new Future()
    var results = []

    if(futures.length > 0) {
        var current = futures[0]
        futures.forEach(function(future, index) {
            current = current.then(function(v) {
                results[index] = v
                return futures[index+1]
            })
        })

        //if
        current.catch(function(e) {
            f.throw(e)
        })
        // else
        current.then(function() {
            f.return(results)
        })


    } else {
        f.return(results)
    }

    return f
}

// either used like futureWrap(function(){ ... })(arg1,arg2,etc) or
//  futureWrap(object, 'methodName')(arg1,arg2,etc)
Future.wrap = function() {
    // function
    if(arguments.length === 1) {
        var fn = arguments[0]
        var object = undefined


    // object, function
    } else {
        var object = arguments[0]
        var fn = object[arguments[1]]
    }

    return function() {
        var args = Array.prototype.slice.call(arguments)
        var future = new Future
        args.push(future.resolver())
        var me = this
        if(object) me = object
        fn.apply(me, args)
        return future
    }
}


// default
var unhandledErrorHandler = function(e) {
    setTimeout(function() {
        throw e
    },0)
}

// setup unhandled error handler
// unhandled errors happen when done is called, and  then an exception is thrown from the future
Future.error = function(handler) {
    unhandledErrorHandler = handler
}

// instance methods

// returns a value for the future (can only be executed once)
// if there are callbacks waiting on this value, they are run in the next tick
    // (ie they aren't run immediately, allowing the current thread of execution to complete)
Future.prototype.return = function(v) {
    resolve(this, 'return', v)
}
Future.prototype.throw = function(e) {
    resolve(this, 'error', e)
}

function setNext(that, future) {
    if(future !== undefined && !isLikeAFuture(future) )
        throw Error("Value returned from then or catch *not* a Future: "+future)

    resolve(that, 'next', future)
}

function wait(that, cb) {
    if(that.isResolved) {
        executeCallbacks(that, [cb])
    } else {
        that.queue.push(cb)
    }
}

// duck typing to determine if something is or isn't a future
function isLikeAFuture(x) {
    return x.isResolved !== undefined && x.queue !== undefined && x.then !== undefined
}

function waitOnResult(f, result, cb) {
    wait(result, function() {
        if(this.hasError) {
            f.throw(this.error)
        } else if(this.hasNext) {
            waitOnResult(f, this.next, cb)
        } else {
            try {
                setNext(f, cb(this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
}


// cb takes one parameter - the value returned
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.then = function(cb) {
    var f = new Future
    wait(this, function() {
        if(this.hasError)
            f.throw(this.error)
        else if(this.hasNext)
            waitOnResult(f, this.next, cb)
        else {
            try {
                setNext(f, cb(this.result))
            } catch(e) {
                f.throw(e)
            }
        }
    })
    return f
}
// cb takes one parameter - the error caught
// cb can return a Future, in which case the result of that Future is passed to next-in-chain
Future.prototype.catch = function(cb) {
    var f = new Future
    wait(this, function() {
        if(this.hasError) {
            try {
                setNext(f, cb(this.error))
            } catch(e) {
                f.throw(e)
            }
        } else if(this.hasNext) {
            this.next.then(function(v) {
                f.return(v)
            }).catch(function(e) {
                setNext(f, cb(e))
            })
        } else {
            f.return(this.result)
        }
    })
    return f
}
// cb takes no parameters
// callback's return value is ignored, but thrown exceptions propogate normally
Future.prototype.finally = function(cb) {
    var f = new Future
    wait(this, function() {
        try {
            var that = this
            if(this.hasNext) {
                this.next.then(function(v) {
                    var x = cb()
                    f.return(v)
                    return x
                }).catch(function(e) {
                    var x = cb()
                    f.throw(e)
                    return x
                }).done()
            } else if(this.hasError) {
                Future(true).then(function() {
                    return cb()
                }).then(function() {
                    f.throw(that.error)
                }).catch(function(e) {
                    f.throw(e)
                }).done()

            } else  {
                Future(true).then(function() {
                    return cb()
                }).then(function() {
                    f.return(that.result)
                }).catch(function(e) {
                    f.throw(e)
                }).done()
            }
        } catch(e) {
            f.throw(e)
        }
    })
    return f
}

// all unused futures should end with this (e.g. most then-chains)
// detatches the future so any propogated exception is thrown (so the exception isn't silently lost)
Future.prototype.done = function() {
    wait(this, function() {
        if(this.hasError) {
            unhandledErrorHandler(this.error)
        } else if(this.hasNext) {
            this.next.catch(function(e) {
                unhandledErrorHandler(e)
            })
        }
    })
}



Future.prototype.resolver = function() {
    var me = this

    return function(e,v) {
        if(e) { // error argument
            me.throw(e)
        } else {
            me.return(v)
        }
    }
}

Future.prototype.resolved = function() {
    return this.isResolved
}


function resolve(that, type, value) {
    if(that.isResolved)
        throw Error("Future resolved more than once! Resolution: "+value)

    that.isResolved = true
    that.hasError = type === 'error'
    that.hasNext = type === 'next' && value !== undefined

    if(that.hasError)
        that.error = value
    else if(that.hasNext)
        that.next = value
    else
        that.result = value

    executeCallbacks(that, that.queue)
}

function executeCallbacks(that, callbacks) {
    if(callbacks.length > 0) {
        setTimeout(function() {
            callbacks.forEach(function(cb) {
                cb.apply(that)
            })
        },0)
    }
}


/***/ }),
/* 91 */
/*!******************************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/ajax/node_modules/trimArguments/trimArguments.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

// resolves varargs variable into more usable form
// args - should be a function arguments variable
// returns a javascript Array object of arguments that doesn't count trailing undefined values in the length
module.exports = function(theArguments) {
    var args = Array.prototype.slice.call(theArguments, 0)

    var count = 0;
    for(var n=args.length-1; n>=0; n--) {
        if(args[n] === undefined)
            count++
    }
    args.splice(-0, count)
    return args
}

/***/ }),
/* 92 */
/*!**********************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/source-map-resolve/source-map-resolve.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

// Note: source-map-resolve.js is generated from source-map-resolve-node.js and
// source-map-resolve-template.js. Only edit the two latter files, _not_
// source-map-resolve.js!

void (function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! source-map-url */ 95), __webpack_require__(/*! resolve-url */ 96)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === "object") {
    var sourceMappingURL = require("source-map-url")
    var resolveUrl = require("resolve-url")
    module.exports = factory(sourceMappingURL, resolveUrl)
  } else {
    root.sourceMapResolve = factory(root.sourceMappingURL, root.resolveUrl)
  }
}(this, function(sourceMappingURL, resolveUrl) {

  function callbackAsync(callback, error, result) {
    setImmediate(function() { callback(error, result) })
  }

  function sig(name, codeOrMap, url, read, callback) {
    var type = (name.indexOf("Sources") >= 0 ? "map" : "code")

    var throwError = function(num, what, got) {
      throw new Error(
        name + " requires argument " + num + " to be " + what + ". Got:\n" + got
      )
    }

    if (type === "map") {
      if (typeof codeOrMap !== "object" || codeOrMap === null) {
        throwError(1, "a source map", codeOrMap)
      }
    } else {
      if (typeof codeOrMap !== "string") {
        throwError(1, "some code", codeOrMap)
      }
    }
    if (typeof url !== "string") {
      throwError(2, "the " + type + " url", url)
    }
    if (typeof read !== "function") {
      throwError(3, "a reading function", read)
    }
    if (arguments.length === 1 + 4 && typeof callback !== "function") {
      throwError(4, "a callback function", callback)
    }
  }

  function parseMapToJSON(string) {
    return JSON.parse(string.replace(/^\)\]\}'/, ""))
  }



  function resolveSourceMap(code, codeUrl, read, callback) {
    sig("resolveSourceMap", code, codeUrl, read, callback)
    var mapData
    try {
      mapData = resolveSourceMapHelper(code, codeUrl)
    } catch (error) {
      return callbackAsync(callback, error)
    }
    if (!mapData || mapData.map) {
      return callbackAsync(callback, null, mapData)
    }
    read(mapData.url, function(error, result) {
      if (error) {
        return callback(error)
      }
      try {
        mapData.map = parseMapToJSON(String(result))
      } catch (error) {
        return callback(error)
      }
      callback(null, mapData)
    })
  }

  function resolveSourceMapSync(code, codeUrl, read) {
    sig("resolveSourceMapSync", code, codeUrl, read)
    var mapData = resolveSourceMapHelper(code, codeUrl)
    if (!mapData || mapData.map) {
      return mapData
    }
    mapData.map = parseMapToJSON(String(read(mapData.url)))
    return mapData
  }

  var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/
  var jsonMimeTypeRegex = /^(?:application|text)\/json$/

  function resolveSourceMapHelper(code, codeUrl) {
    var url = sourceMappingURL.get(code)
    if (!url) {
      return null
    }

    var dataUri = url.match(dataUriRegex)
    if (dataUri) {
      var mimeType = dataUri[1]
      var lastParameter = dataUri[2]
      var encoded = dataUri[3]
      if (!jsonMimeTypeRegex.test(mimeType)) {
        throw new Error("Unuseful data uri mime type: " + (mimeType || "text/plain"))
      }
      return {
        sourceMappingURL: url,
        url: null,
        sourcesRelativeTo: codeUrl,
        map: parseMapToJSON(lastParameter === ";base64" ? atob(encoded) : decodeURIComponent(encoded))
      }
    }

    var mapUrl = resolveUrl(codeUrl, url)
    return {
      sourceMappingURL: url,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    }
  }



  function resolveSources(map, mapUrl, read, callback) {
    sig("resolveSources", map, mapUrl, read, callback)
    var pending = map.sources.length
    var errored = false
    var sources = []

    var done = function(error) {
      if (errored) {
        return
      }
      if (error) {
        errored = true
        return callback(error)
      }
      pending--
      if (pending === 0) {
        callback(null, sources)
      }
    }

    resolveSourcesHelper(map, mapUrl, function(fullUrl, sourceContent, index) {
      if (typeof sourceContent === "string") {
        sources[index] = sourceContent
        callbackAsync(done, null)
      } else {
        read(fullUrl, function(error, result) {
          sources[index] = String(result)
          done(error)
        })
      }
    })
  }

  function resolveSourcesSync(map, mapUrl, read) {
    sig("resolveSourcesSync", map, mapUrl, read)
    var sources = []
    resolveSourcesHelper(map, mapUrl, function(fullUrl, sourceContent, index) {
      if (typeof sourceContent === "string") {
        sources[index] = sourceContent
      } else {
        sources[index] = String(read(fullUrl))
      }
    })
    return sources
  }

  var endingSlash = /\/?$/

  function resolveSourcesHelper(map, mapUrl, fn) {
    var fullUrl
    var sourceContent
    for (var index = 0, len = map.sources.length; index < len; index++) {
      if (map.sourceRoot) {
        // Make sure that the sourceRoot ends with a slash, so that `/scripts/subdir` becomes
        // `/scripts/subdir/<source>`, not `/scripts/<source>`. Pointing to a file as source root
        // does not make sense.
        fullUrl = resolveUrl(mapUrl, map.sourceRoot.replace(endingSlash, "/"), map.sources[index])
      } else {
        fullUrl = resolveUrl(mapUrl, map.sources[index])
      }
      sourceContent = (map.sourceContents || [])[index]
      fn(fullUrl, sourceContent, index)
    }
  }



  function resolve(code, codeUrl, read, callback) {
    sig("resolve", code, codeUrl, read, callback)
    resolveSourceMap(code, codeUrl, read, function(error, mapData) {
      if (error) {
        return callback(error)
      }
      if (!mapData) {
        return callback(null, null)
      }
      resolveSources(mapData.map, mapData.sourcesRelativeTo, read, function(error, sources) {
        if (error) {
          return callback(error)
        }
        mapData.sources = sources
        callback(null, mapData)
      })
    })
  }

  function resolveSync(code, codeUrl, read) {
    sig("resolveSync", code, codeUrl, read)
    var mapData = resolveSourceMapSync(code, codeUrl, read)
    if (!mapData) {
      return null
    }
    mapData.sources = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read)
    return mapData
  }



  return {
    resolveSourceMap:     resolveSourceMap,
    resolveSourceMapSync: resolveSourceMapSync,
    resolveSources:       resolveSources,
    resolveSourcesSync:   resolveSourcesSync,
    resolve:              resolve,
    resolveSync:          resolveSync
  }

}));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../timers-browserify/main.js */ 93).setImmediate))

/***/ }),
/* 93 */
/*!*******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/timers-browserify/main.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ 94);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 94 */
/*!**********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/setimmediate/setImmediate.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 16), __webpack_require__(/*! ./../process/browser.js */ 12)))

/***/ }),
/* 95 */
/*!**************************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/source-map-url/source-map-url.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2014 Simon Lydell

void (function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.sourceMappingURL = factory()
  }
}(this, function(undefined) {

  var innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/
  var newlineRegex = /\r\n?|\n/

  var regex = RegExp(
    "(^|(?:" + newlineRegex.source + "))" +
    "(?:" +
      "/\\*" +
      "(?:\\s*(?:" + newlineRegex.source + ")(?://)?)?" +
      "(?:" + innerRegex.source + ")" +
      "\\s*" +
      "\\*/" +
      "|" +
      "//(?:" + innerRegex.source + ")" +
    ")" +
    "\\s*$"
  )

  function SourceMappingURL(commentSyntax) {
    this._commentSyntax = commentSyntax
  }

  SourceMappingURL.prototype.regex = regex
  SourceMappingURL.prototype._innerRegex = innerRegex
  SourceMappingURL.prototype._newlineRegex = newlineRegex

  SourceMappingURL.prototype.get = function(code) {
    var match = code.match(this.regex)
    if (!match) {
      return null
    }
    return match[2] || match[3] || ""
  }

  SourceMappingURL.prototype.set = function(code, url, commentSyntax) {
    if (!commentSyntax) {
      commentSyntax = this._commentSyntax
    }
    // Use a newline present in the code, or fall back to '\n'.
    var newline = String(code.match(this._newlineRegex) || "\n")
    var open = commentSyntax[0], close = commentSyntax[1] || ""
    code = this.remove(code)
    return code + newline + open + "# sourceMappingURL=" + url + close
  }

  SourceMappingURL.prototype.remove = function(code) {
    return code.replace(this.regex, "")
  }

  SourceMappingURL.prototype.insertBefore = function(code, string) {
    var match = code.match(this.regex)
    if (match) {
      var hasNewline = Boolean(match[1])
      return code.slice(0, match.index) +
        string +
        (hasNewline ? "" : "\n") +
        code.slice(match.index)
    } else {
      return code + string
    }
  }

  SourceMappingURL.prototype.SourceMappingURL = SourceMappingURL

  return new SourceMappingURL(["/*", " */"])

}));


/***/ }),
/* 96 */
/*!********************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/resolve-url/resolve-url.js ***!
  \********************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

void (function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof exports === "object") {
    module.exports = factory()
  } else {
    root.resolveUrl = factory()
  }
}(this, function() {

  function resolveUrl(/* ...urls */) {
    var numUrls = arguments.length

    if (numUrls === 0) {
      throw new Error("resolveUrl requires at least one argument; got none.")
    }

    var base = document.createElement("base")
    base.href = arguments[0]

    if (numUrls === 1) {
      return base.href
    }

    var head = document.getElementsByTagName("head")[0]
    head.insertBefore(base, head.firstChild)

    var a = document.createElement("a")
    var resolved

    for (var index = 1; index < numUrls; index++) {
      a.href = arguments[index]
      resolved = a.href
      base.href = resolved
    }

    head.removeChild(base)

    return resolved
  }

  return resolveUrl

}));


/***/ }),
/* 97 */
/*!*******************************************************************************************!*\
  !*** D:/billysFile/code/javascript/modules/Gem.js/node_modules/emitter-b/src/EmitterB.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ 9).EventEmitter
var proto = __webpack_require__(/*! proto */ 0)

module.exports = proto(EventEmitter, function(superclass) {

    this.init = function() {
        superclass.apply(this, arguments)

        this.ifonHandlers = {}
        this.ifoffHandlers = {}
        this.ifonAllHandlers = []
        this.ifoffAllHandlers = []
    }

    // callback will be triggered immediately if there is already a listener attached, or
    // callback will be triggered when the first listener for the event is added
    // (regardless of whether its done through on or once)
    // parameters can be:
        // event, callback - attach an ifon handler for the passed event
        // callback - attach an ifon handler for all events
    this.ifon = function(event, callback) {
        if(event instanceof Function) {     // event not passed, only a callback
            callback = event // fix the argument
            for(var eventName in this._events) {
                if(this.listeners(eventName).length > 0) {
                    callback(eventName)
                }
            }
        } else if(this.listeners(event).length > 0) {
            callback(event)
        }

        addHandlerToList(this, 'ifonHandlers', event, callback)
    }

    // removes either:
        // removeIfon() - all ifon handlers (if no arguments are passed), or
        // removeIfon(event) - all ifon handlers for the passed event, or
        // removeIfon(callback) - the passed ifon-all handler (if the first parameter is the callback)
        // removeIfon(event, callback) - the specific passed callback for the passed event
    this.removeIfon = function(event, callback) {
        removeFromHandlerList(this, 'ifonHandlers', event, callback)
    }

    // callback will be triggered when the last listener for the 'click' event is removed (will not trigger immediately if there is no event listeners on call of ifoff)
    // (regardless of whether this is done through removeListener or as a result of 'once' being fulfilled)
    // parameters can be:
        // event, callback - attach an ifoff handler for the passed event
        // callback - attach an ifoff handler for all events
    this.ifoff = function(event, callback) {
        addHandlerToList(this, 'ifoffHandlers', event, callback)
    }

    // removes either:
        // removeIfoff() - all ifoff handlers (if no arguments are passed), or
        // removeIfoff(event) - all ifoff handlers for the passed event, or
        // removeIfoff(callback) - the passed ifoff-all handler (if the first parameter is the callback)
        // removeIfoff(event, callback) - the specific passed callback for the passed event
    this.removeIfoff = function(event, callback) {
        removeFromHandlerList(this, 'ifoffHandlers', event, callback)
    }

    // emitter is the emitter to proxy handler binding to
    // options can have one of the following properties:
        // only - an array of events to proxy
        // except - an array of events to *not* proxy
    this.proxy = function(emitter, options) {
        if(options === undefined) options = {}
        if(options.except !== undefined) {
            var except = arrayToMap(options.except)
            var handleIt = function(event){return !(event in except)}
        } else if(options.only !== undefined) {
            var only = arrayToMap(options.only)
            var handleIt = function(event){return event in only}
        } else {
            var handleIt = function(){return true}
        }

        var that = this, handler;
        this.ifon(function(event) {
            if(handleIt(event)) {
                emitter.on(event, handler = function() {
                    that.emit.apply(that, [event].concat(Array.prototype.slice.call(arguments)))
                })
            }
        })
        this.ifoff(function(event) {
            if(handleIt(event))
                emitter.off(event, handler)
        })
    }

    /*override*/ this.on = this.addListener = function(event, callback) {
        var triggerIfOn = this.listeners(event).length === 0
        superclass.prototype.on.apply(this,arguments)
        if(triggerIfOn) triggerIfHandlers(this, 'ifonHandlers', event)
    }

    /*override*/ this.off = this.removeListener = function(event, callback) {
        var triggerIfOff = this.listeners(event).length === 1
        superclass.prototype.removeListener.apply(this,arguments)
        if(triggerIfOff) triggerIfHandlers(this, 'ifoffHandlers', event)
    }
    /*override*/ this.removeAllListeners = function(event) {
        var triggerIfOffForEvents = []
        if(event !== undefined) {
            if(this.listeners(event).length > 0) {
                triggerIfOffForEvents.push(event)
            }
        } else {
            for(var event in this._events) {
                if(this.listeners(event).length > 0) {
                    triggerIfOffForEvents.push(event)
                }
            }
        }

        superclass.prototype.removeAllListeners.apply(this,arguments)

        for(var n=0; n<triggerIfOffForEvents.length; n++) {
            triggerIfHandlers(this, 'ifoffHandlers', triggerIfOffForEvents[n])
        }
    }

})


// triggers the if handlers from the normal list and the "all" list
function triggerIfHandlers(that, handlerListName, event) {
    triggerIfHandlerList(that[handlerListName][event], event)
    triggerIfHandlerList(that[normalHandlerToAllHandlerProperty(handlerListName)], event)
}


// triggers the if handlers from a specific list
// ya these names are confusing, sorry : (
function triggerIfHandlerList(handlerList, event) {
    if(handlerList !== undefined) {
        for(var n=0; n<handlerList.length; n++) {
            handlerList[n](event)
        }
    }
}

function addHandlerToList(that, handlerListName, event, callback) {
    if(event instanceof Function) {
        // correct arguments
        callback = event
        event = undefined
    }

    if(event !== undefined && callback !== undefined) {
        var handlerList = that[handlerListName][event]
        if(handlerList === undefined) {
            handlerList = that[handlerListName][event] = []
        }

        handlerList.push(callback)
    } else {
        that[normalHandlerToAllHandlerProperty(handlerListName)].push(callback)
    }
}

function removeFromHandlerList(that, handlerListName, event, callback) {
    if(event instanceof Function) {
        // correct arguments
        callback = event
        event = undefined
    }

    if(event !== undefined && callback !== undefined) {
        removeCallbackFromList(that[handlerListName][event], callback)
    } else if(event !== undefined) {
        delete that[handlerListName][event]
    } else if(callback !== undefined) {
        var allHandlerListName = normalHandlerToAllHandlerProperty(handlerListName)
        removeCallbackFromList(that[allHandlerListName], callback)
    } else {
        var allHandlerListName = normalHandlerToAllHandlerProperty(handlerListName)
        that[handlerListName] = {}
        that[allHandlerListName] = []
    }
}

function normalHandlerToAllHandlerProperty(handlerListName) {
    if(handlerListName === 'ifonHandlers')
        return 'ifonAllHandlers'
    if(handlerListName === 'ifoffHandlers')
        return 'ifoffAllHandlers'
}

function removeCallbackFromList(list, callback) {
    var index = list.indexOf(callback)
    list.splice(index,1)
}

function getTrace() {
    try {
        throw new Error()
    } catch(e) {
        return e
    }
}

// turns an array of values into a an object where those values are all keys that point to 'true'
function arrayToMap(array) {
    var result = {}
    array.forEach(function(v) {
        result[v] = true
    })
    return result
}


/***/ }),
/* 98 */
/*!**************************!*\
  !*** ../external/jss.js ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

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

/***/ }),
/* 99 */
/*!**********************************!*\
  !*** ../node_modules/devFlag.js ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

exports.dev = false  // set to true to enable dom element naming (so you can see boundaries of components when inspecting the dom)

/***/ }),
/* 100 */
/*!******************************************!*\
  !*** ../node_modules/Components/Item.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 5)

module.exports = proto(Gem, function(superclass) {

	// static properties

	this.name = 'ListItem'

    this.defaultStyle = Style({
        display: 'list-item'
    })

	// instance properties

	this.init = function(/*[label,] contents*/) {
        if(arguments.length <= 1) {
            var contents = arguments[0]
        } else {
            var label = arguments[0]
            var contents = arguments[1]
        }

        this.domNode = document.createElement("li") // do this before calling the superclass constructor so that an extra useless domNode isn't created inside it
		this.label = label

        this.children = [] // need children before calling add
        if(contents instanceof Gem) {
			this.add(contents)
		} else if(contents !== undefined) {
            this.domNode.textContent = contents
        }

        superclass.init.apply(this, arguments) // superclass constructor
	}
});


/***/ }),
/* 101 */
/*!*****************************************!*\
  !*** ../node_modules/Components/Svg.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)
var Gem = __webpack_require__(/*! ../Gem */ 1)

module.exports = proto(Gem, function(superclass) {
	// static variables
    this.name = 'Svg'

	// instance methods
	this.init = function(/*[label,] svgXml*/) {
        if(arguments.length === 1) {
            var svgXml = arguments[0]
        } else {
            var label = arguments[0]
            var svgXml = arguments[1]
        }

        var div = document.createElement('div')
        div.innerHTML = svgXml
        this.domNode = div.firstChild

        this.label = label

        superclass.init.call(this)
	}
})

/***/ }),
/* 102 */
/*!********************************************!*\
  !*** ../node_modules/Components/Header.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {



var RowlikeGenerator = __webpack_require__(/*! ./RowlikeGenerator */ 45);

module.exports = RowlikeGenerator('th', "TableHeader")

/***/ }),
/* 103 */
/*!*****************************************!*\
  !*** ../node_modules/Components/Row.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var RowlikeGenerator = __webpack_require__(/*! ./RowlikeGenerator */ 45);

module.exports = RowlikeGenerator('tr', "TableRow")


/***/ }),
/* 104 */
/*!*********************!*\
  !*** ./Gem.test.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)
var Future = __webpack_require__(/*! async-future */ 10)

var syn = __webpack_require__(/*! fsyn */ 6)
var testUtils = __webpack_require__(/*! testUtils */ 2)
var Gem = __webpack_require__(/*! ../Gem.browser */ 18)

var Text = Gem.Text
var Button = Gem.Button



module.exports = function(t) {

    // basic test block
    var TestThinger = proto(Gem,function(superclass) {
        this.name = 'TestThinger'
    })






    //*

	this.test('testEvent',function(t) {
        this.count(2);

		var obj = new Button("some text");
		obj.on("flick",function(data) {
			t.ok(true);
			t.ok(data.obj === "blah");
		});

		obj.emit("flick",{obj:"blah"});
	});

    this.test('add, addAt, addBefore', function() {
		this.count(5);
        var C = proto(Gem, function(superclass) {
            this.name = 'addTest'
            this.init = function() {
                superclass.init.call(this) // set style with constructor
            }
        })

        this.test('add', function() {
            var x = C()

            x.add(Text('a'))
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            x.add(Text('x', 'b'))
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.add([Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            this.eq(x.domNode.children[2].textContent , 'c')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'd')
            this.eq(x.children[3].domNode , x.domNode.children[3])

        })

        this.test('addAt', function() {
            var x = C()

            x.addAt(0, Text('a'))
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            x.addAt(0, Text('x', 'b'))
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'a')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.addAt(1, [Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'c')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'a')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            this.test('errors', function() {
                this.count(1)

                var x = C()
                x.addAt(0, Text("moose"))

                try {
                    x.addAt(0, x.children[0])
                } catch(e) {
                    this.eq(e.message, 'Node at index 0 already has a parent. Remove the node from its parent before adding it somewhere else.')
                }
            })
        })

        this.test('addBefore', function() {
            var x = C()

            var one = Text('a')
            x.addBefore(undefined, one)
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            var two = Text('x', 'b')
            x.addBefore(one, two)
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'a')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.addBefore(one, [Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'c')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'a')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            x.addBefore(undefined, Text('e'))
            this.eq(x.domNode.children.length, 5)
            this.eq(x.children.length, 5)
            this.eq(x.domNode.children[4].textContent , 'e')
            this.eq(x.children[4].domNode , x.domNode.children[4])
        })

        this.test('remove', function() {
            var C = proto(Gem, function(superclass) {
                this.name = 'removeTest'

                this.init = function() {
                    superclass.init.call(this) // set style with constructor
                }
            })

            var x = C()

            var zero = Text('a')
            var one = Text('b')
            var two = Text('c')
            var three = Text('d')
            var four = Text('e')
            x.add(zero,one,two,three,four)

            this.eq(zero.parent, x)
            this.eq(one.parent, x)
            this.eq(two.parent, x)
            this.eq(three.parent, x)
            this.eq(four.parent, x)

            x.remove(2)
            this.eq(two.parent, undefined)
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'e')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            x.remove(one)
            this.eq(one.parent, undefined)
            this.eq(x.domNode.children.length, 3)
            this.eq(x.children.length, 3)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'd')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'e')
            this.eq(x.children[2].domNode , x.domNode.children[2])

            x.remove(zero)
            this.eq(zero.parent, undefined)
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'd')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'e')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            // what's left is three and four
            x.remove([0, four])
            this.eq(three.parent, undefined)
            this.eq(four.parent, undefined)
            this.eq(x.domNode.children.length, 0)
            this.eq(x.children.length, 0)
        })

		this.test('setting parent',function() {
			this.count(2);
			var C = proto(Gem, function(superclass) {
                this.name = 'parent'

                this.init = function() {
                    superclass.init.call(this)
                }
            })

			var C2 = proto(Gem, function(superclass) {
                this.name = 'child'

                this.init = function() {
                    superclass.init.call(this)
                }
            })

			var parent = C();
			var child = C2();
			this.eq(child.parent,undefined);
			parent.add(child);
			this.eq(child.parent,parent);
			
		})
    })

    this.test('attr', function() {
        var thinger = TestThinger()
        thinger.attr("moose", '5')
        this.eq(thinger.domNode.getAttribute("moose"), '5')
        this.eq(thinger.attr('moose'), '5')

        thinger.attr("moose", 'ha ha ha \'\"haaaaaaa <moose></moose>')
        this.eq(thinger.domNode.getAttribute("moose"), 'ha ha ha \'\"haaaaaaa <moose></moose>')
        this.eq(thinger.attr('moose'), 'ha ha ha \'\"haaaaaaa <moose></moose>')

        thinger.attr('moose', undefined)
        this.eq(thinger.domNode.getAttribute("moose"), null)
        this.eq(thinger.attr('moose'), undefined)

        thinger.attr({arg:1, blah:2})
        this.eq(thinger.attr('arg'), '1')
        this.eq(thinger.attr('blah'), '2')
    })

    this.test('label property', function() {
        Gem.dev = false // turn off dev for a second

        var thinger = TestThinger()
        this.eq(thinger.label, undefined)
        this.eq(thinger.attr('label'), undefined)

        thinger.label = "moose"
        this.eq(thinger.label, 'moose')
        //this.eq(thinger.attr('label'), undefined) why not just do it for everything // only set in dev mode

        var thinger2 = TestThinger()
        Gem.dev = true // turn back on
        thinger2.label = "moose2"
        this.eq(thinger2.label, "moose2")
        this.eq(thinger2.attr('label'), "moose2")

        try {
            thinger.label = 'setagainfails'
        } catch(e) {
            this.eq(e.message, "A Gem's label can only be set once (was already set to: moose)")
        }
    })

    this.test('visible', function() {
        var container = Gem.Block()
        testUtils.demo("visible test", container)

        var thinger = TestThinger()
        container.add(thinger)
        this.eq(thinger.visible, true)
        this.eq($(thinger.domNode).css('display'), "inline-block")

        thinger.visible = true                       // does nothing if its already showing
        this.eq(thinger.visible, true)
        this.eq($(thinger.domNode).css('display'), "inline-block")

        thinger.visible = false
        this.eq(thinger.visible, false)
//        this.eq(thinger.domNode.style.display, "none")
        this.eq($(thinger.domNode).css('display'), "none")

        thinger.visible = false                      // does nothing if its already hiding
        this.eq(thinger.visible, false)
        this.eq($(thinger.domNode).css('display'), "none")

        thinger.visible = true
        this.eq(thinger.visible, true)
        this.eq($(thinger.domNode).css('display'), "inline-block")

        this.test("with styled css display", function() {
            var thinger = TestThinger()
            container.add(thinger)
            thinger.attached = true // pretend its attached so it'll render the style
            thinger.style = Gem.Style({display: 'inline'})

            this.eq($(thinger.domNode).css('display'), "inline")

            thinger.visible = false
            this.eq($(thinger.domNode).css('display'), "none")
            this.eq(thinger.visible, false)

            thinger.visible = true
            this.eq(thinger.visible, true)
            this.eq($(thinger.domNode).css('display'), "inline")
        })

        this.test("with inline css", function() {
            var thinger = TestThinger()
            container.add(thinger)
            thinger.domNode.style.display = 'block'

            this.eq($(thinger.domNode).css('display'), "block")

            thinger.visible = false
            this.eq($(thinger.domNode).css('display'), "none")
            this.eq(thinger.visible, false)

            thinger.visible = true
            this.eq(thinger.visible, true)
            this.eq($(thinger.domNode).css('display'), "block")
        })
    })

    this.test("focus", function() {
        var input = Gem.TextField()
        testUtils.demo("focus test", input)

        this.ok(input.domNode !== document.activeElement)

        input.focus = true
        this.ok(input.domNode === document.activeElement)

        input.focus = false
        this.ok(input.domNode !== document.activeElement)

        this.test("quiet focus", function(t) {
            var input = Gem.TextField()
            testUtils.demo("quiet focus test", input)

            input.on('focus', function() {
                t.ok(false)
            })
            input.onCapture('focus', function() {
                t.ok(false)
            })

            input.quiet.focus = true
            this.ok(input.domNode === document.activeElement)

            input.quiet.focus = false
            this.ok(input.domNode !== document.activeElement)
        })
    })

    this.test("setSelection and getCaratOffset", function() {
        var container = Gem.Block()
        testUtils.demo("setSelection and getCaratOffset", container)

        this.test('input textfield', function() {
            var input = Gem.TextField()
            container.add(input)
            input.val = "whatever yo"

            this.eq(input.selectionRange, undefined)

            input.selectionRange = [1,1]
            this.eq(input.selectionRange[0], 1)
            this.eq(input.selectionRange[1], 1)

            input.selectionRange = [2,5]
            this.eq(input.selectionRange[0], 2)
            this.eq(input.selectionRange[1], 5)

            this.test("input textfields that are next to eachother", function() {
                var c = Gem.Block()
                container.add(c)
                var input = Gem.TextField(), input2 = Gem.TextField()
                c.add(input, input2)
                input.val = "whatever yo"
                input2.val = 'more whatever'

                this.eq(input.selectionRange, undefined)
                this.eq(input2.selectionRange, undefined)

                input.focus = true

                // when its focused on after being set programatically, it should have the active caret (note that this is different from gaining focus by being tabbed to)
                // seems to start its caret at the end of the input
                this.eq(input.selectionRange[0], input.val.length)
                this.eq(input.selectionRange[1], input.val.length)
                this.eq(input2.selectionRange, undefined)

                input.selectionRange = [2,4]
                this.eq(input.selectionRange[0], 2)
                this.eq(input.selectionRange[1], 4)
                this.eq(input2.selectionRange, undefined)

                input2.selectionRange = [3,5]
                this.eq(input.selectionRange, undefined)
                this.eq(input2.selectionRange[0], 3)
                this.eq(input2.selectionRange[1], 5)

            })
        })

        this.test('textarea', function() {
            var input = Gem.TextArea()
            container.add(input)
            input.val = "whatever yo"

            this.eq(input.selectionRange, undefined)

            input.selectionRange = [1,1]
            this.eq(input.selectionRange[0], 1)
            this.eq(input.selectionRange[1], 1)

            input.selectionRange = [2,5]
            this.eq(input.selectionRange[0], 2)
            this.eq(input.selectionRange[1], 5)
        })

        this.test("regular div", function() {
            var div = Gem.Text("Whatever")
            div.attr("contenteditable", true)
            container.add(div)

            this.eq(div.selectionRange, undefined)

            div.selectionRange = [1,1]
            this.eq(div.selectionRange[0], 1)
            this.eq(div.selectionRange[1], 1)

            div.selectionRange = [2,5]
            this.eq(div.selectionRange[0], 2)
            this.eq(div.selectionRange[1], 5)
        })

        this.test("contenteditable div", function() {
            var input = Gem.Text("Whatever")
            input.attr("contenteditable", true)
            container.add(input)

            this.eq(input.selectionRange, undefined)

            input.selectionRange = [1,1]
            this.eq(input.selectionRange[0], 1)
            this.eq(input.selectionRange[1], 1)

            input.selectionRange = [2,5]
            this.eq(input.selectionRange[0], 2)
            this.eq(input.selectionRange[1], 5)

            input.domNode.innerHTML = "<span>hi</span><span>lo</span><span>mo<br>scrow</span>"
            this.eq(input.selectionRange[0], 0)
            this.eq(input.selectionRange[1], 11)           // is this right?

            input.selectionRange = [4,11]
            this.eq(input.selectionRange[0], 4)
            this.eq(input.selectionRange[1], 11)

        })

        this.test("selectionRange across nodes", function() {
            var one = Text('one'), two = Text("two"), three = Text("three")
            var c = Gem.Block(one, two, three)
            container.add(c)

            c.selectionRange = [2,8]
            this.eq(c.selectionRange[0], 2)
            this.eq(c.selectionRange[1], 8)
            this.eq(one.selectionRange[0], 2)
            this.eq(one.selectionRange[1], 3)
            this.eq(two.selectionRange[0], 0)
            this.eq(two.selectionRange[1], 3)
            this.eq(three.selectionRange[0], 0)
            this.eq(three.selectionRange[1], 2)
        })
    })

    this.test("on, addListener, once, removeListener, removeAllListeners", function(t) {
        this.count(10)

        var EventWhore = proto(Gem,function(superclass) {
            this.name = 'EventWhore'
        })

        var e = EventWhore()

        var event = testUtils.seq(
          function(eventName, data) {
            t.eq(eventName, 'a')
            t.eq(data, 1)
        },function(eventName, data) {
            t.eq(eventName, 'a')
            t.eq(data, 2)

        },function(eventName, data) {
            t.eq(eventName, 'b')
            t.eq(data, 3)
        },function(eventName, data) {
            t.eq(eventName, 'b')
            t.eq(data, 4)

        },function(eventName, data) {
            t.eq(eventName, 'c')
            t.eq(data, 5)
        })

        var acb, bcb, ccb;
        e.on('a', acb = function(data) {
            event('a', data)
        })
        e.addListener('b', bcb = function bcb(data) {
            event('b', data)
        })
        e.once('c', cbc = function(data) {
            event('c', data)
        })

        e.emit('a', 1)
        e.emit('a', 2)

        e.emit('b', 3)
        e.emit('b', 4)

        e.emit('c', 5)
        e.emit('c', 6)

        e.removeListener('a', acb)
        e.emit('a', 7)

        e.removeAllListeners('b')
        e.emit('b', 8)

        e.on('d', acb = function(data) {
            event('a', data)
        })
        e.removeAllListeners()
        e.emit('d', 9)
    })


    this.test('listening on standard browser events', function(t) {
        var container = Gem.Block()
        testUtils.demo('listening on standard browser events', container)
        this.test("basic browser events", function (t) {
            this.count(1)

            var EventEmitter = __webpack_require__(/*! events */ 9).EventEmitter

            var EventWhore = proto(Gem,function(superclass) {
                this.name = 'EventWhore'
            })

            var e = EventWhore()
            container.add(e)

            var testEvent = testUtils.seq(function(eventName) {
                t.eq(eventName, 'click')
            })

            // events shouldn't be emitted unless bound with the EventEmitterB/Gem `on` method (the EventEmitter `on` method bypasses the critical dom event handling setup)
            var eventEmitterPrototypeHandler;
            EventEmitter.prototype.on.call(e, "click", eventEmitterPrototypeHandler=function() {
                testEvent('EventEmitter click')
            })

            var handler;
            syn.click(e.domNode).then(function() {
                EventEmitter.prototype.removeListener.call(e, "click", eventEmitterPrototypeHandler) // get rid of the EventEmitter listener, cause otherwise it'll mess out stuff up

                e.on('click', handler = function() {
                    testEvent('click')
                })

                return syn.click(e.domNode)
            }).then(function() {
                e.removeListener('click', handler)

                return syn.click(e.domNode)
            }).then(function() {
                e.on('click', handler = function() {
                    event('click')
                })

                e.removeAllListeners('click')

                return syn.click(e.domNode)
            }).then(function() {
                e.on('click', handler = function() {
                    event('click')
                })

                e.removeAllListeners()

                return syn.click(e.domNode)
            }).done()
        })

        this.test("browser events with excludeDomEvents", function(t) {
            this.count(1)

            var EventWhore = proto(Gem,function(superclass) {
                this.name = 'EventWhore'

                this.excludeDomEvents = {click: 1}
            })

            var e = EventWhore()
            container.add(e)

            var testEvent = testUtils.seq(function(eventName) {
                t.eq(eventName, 'mousedown')
            })

            e.on('click', function() {
                testEvent('click')
            })
            e.on('mousedown', function() {
                testEvent('mousedown')
            })

            syn.click(e.domNode).done()
        })

        this.test("browser events onCapture", function(t) {
            this.count(8)

            var a = Gem.Text("test")
            var b = Gem.Block(a)
            var c = Gem.Block(b)

            var bCaptureHandler, bhandler2, chandler, cCaptureHandler;
            var testEvent = testUtils.seq(function(eventName) {
                t.eq(eventName, 'c capture')
            },function(eventName) {
                t.eq(eventName, 'b capture')
            },function(eventName) {
                t.eq(eventName, 'a')
            },function(eventName) {
                t.eq(eventName, 'b regular 1')
            },function(eventName) {
                t.eq(eventName, 'b regular 2')
            },function(eventName) {
                t.eq(eventName, 'c regular')

                b.offCapture('click', bCaptureHandler)
                b.off('click',bhandler2)
                c.off('click',chandler)
                c.offCapture('click', cCaptureHandler)
            },function(eventName) {
                t.eq(eventName, 'a')
            },function(eventName) {
                t.eq(eventName, 'b regular 1')
            })

            a.on('click', function() {
                testEvent('a')
            })
            b.on('click', function() {
                testEvent('b regular 1')
            })
            b.onCapture('click', bCaptureHandler=function() {
                testEvent('b capture')
            })
            b.on('click', bhandler2=function() {
                testEvent('b regular 2')
            })
            c.on('click', chandler=function() {
                testEvent('c regular')
            })
            c.onCapture('click', cCaptureHandler=function() {
                testEvent('c capture')
            })

            syn.click(a.domNode).then(function() {
                return syn.click(a.domNode)
            }).done()
        })
    })

    this.test("attach, attachBefore, and detach", function() {
        var a = Gem.Text("tach")
        a.attach()
        this.eq(a.domNode.parentNode, document.body)

        var b = Gem.Text("tach2")
        b.attach(a.domNode)
        this.eq(b.domNode.parentNode, a.domNode)


        var c = Gem.Text("tach3")
        Gem.attach(c)
        this.eq(c.domNode.parentNode, document.body)

        var d = Gem.Text("tach4")
        Gem.attach(c.domNode, d)
        this.eq(d.domNode.parentNode, c.domNode)


        var e = Gem.Text("tach5")
        Gem.attach([e])
        this.eq(e.domNode.parentNode, document.body)

        var f = Gem.Text("tach6")
        Gem.attach(e.domNode, [f])
        this.eq(f.domNode.parentNode, e.domNode)

        var g = Gem.Text("tach7")
        Gem.attachBefore(e.domNode, g)
        this.eq(g.domNode.parentNode, e.domNode.parentNode)
        var childNodes = Array.prototype.slice.call(g.domNode.parentNode.childNodes,0)
        var eIndex = childNodes.indexOf(e.domNode)
        var gIndex = childNodes.indexOf(g.domNode)
        this.eq(gIndex+1, eIndex)

        var h = Gem.Text("tach7")
        h.attachBefore(e.domNode)
        this.eq(h.domNode.parentNode, e.domNode.parentNode)
        var childNodes = Array.prototype.slice.call(h.domNode.parentNode.childNodes,0)
        var eIndex = childNodes.indexOf(e.domNode)
        var hIndex = childNodes.indexOf(h.domNode)
        this.eq(hIndex+1, eIndex)


        Gem.detach(f)
        this.eq(f.domNode.parentNode, null)
        Gem.detach([e,d])
        this.eq(e.domNode.parentNode, null)
        this.eq(d.domNode.parentNode, null)
        c.detach()
        b.detach()
        this.eq(c.domNode.parentNode, null)
        this.eq(b.domNode.parentNode, null)

        this.test("attach and detach events", function(t) {
            this.count(8)

            var a = Gem.Block()
            var b = Gem.Text("tach")

            var count=0
            a.on('attach', function() {
                t.ok(true)
                count++
            })
            a.on('detach', function() {
                t.ok(true)
                count++
            })
            b.on('attach', function() {
                t.ok(true)
                count++
            })
            b.on('detach', function() {
                t.ok(true)
                count++
            })

            a.add(b)
            a.attach()

            a.remove(b)
            a.add(b)

            t.eq(count, 4)

            a.detach()
            t.eq(count, 6)
        })
    })

    this.test("overridden proxy", function() {
        var a = Gem.Text("Whatever")
        var b = Gem.Text("Whatever2")

        a.proxy(b)

        b.on('newParent', function() {
            this.ok(false)
        })
        b.on('parentRemoved', function() {
            this.ok(false)
        })

        a.attach()
    })

    this.test("former bugs", function() {
        // note, i thought this would have been a bug.. but apparently not? I'm unclear how to manifest the incorrect code i see.. but what the hell, i'll just fix the code without a test
        this.test("dom events handlers not being unbound correctly when more than one type of event is bound", function(t) {
            this.count(1)

            var EventWhore = proto(Gem,function(superclass) {
                this.name = 'EventWhore'
            })

            var e = EventWhore()

            var clickHandler
            e.on('click', clickHandler=function() {
                t.ok(false)
            })
            e.on('mousedown', function() {
                t.ok(true)
            })

            e.off('click', clickHandler)

            syn.click(e.domNode)
        })
                    
        this.test("ifoff for dom events wasn't being handled properly", function(t) {
            this.count(1)

            var EventWhore = proto(Gem,function(superclass) {
                this.name = 'EventWhore'
            })

            var e = EventWhore()

            var clickHandler, happendTimes = 0
            e.on('click', clickHandler=function() {
                happendTimes++
                t.eq(happendTimes, 1)
            })

            e.off('click', clickHandler)
            e.on('click', clickHandler)

            syn.click(e.domNode)    
        })
    })

    //*/
}



/***/ }),
/* 105 */
/*!***********************!*\
  !*** ./Style.test.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Gem = __webpack_require__(/*! ../Gem.browser */ 18)
var domUtils = __webpack_require__(/*! domUtils */ 3)
var syn = __webpack_require__(/*! fsyn */ 6)

var Style = Gem.Style
var Text = Gem.Text
var Button = Gem.Button
var CheckBox = Gem.CheckBox
var Block = Gem.Block
var Svg = Gem.Svg

var defaultBackgroundColor = 'rgba(0, 0, 0, 0)'; var defaultBgColor = defaultBackgroundColor

module.exports = function(t) {
//    this.timeout(60*1000) ugh it looks like this isn't working properly


     // todo:
        // test mix and copy








    //*
    this.test('simple styling',function(t) {
        this.count(2)

        var S = Style({
            color: 'rgb(0, 128, 0)'
        })

        var C = proto(Gem, function(superclass) {
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

        var C = proto(Gem, function(superclass) {
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

        var C = proto(Gem, function(superclass) {
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

        var C = proto(Gem, function(superclass) {
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

    this.test('default Gem styles',function(t) {
        this.test('simple default styles', function(t) {
            this.count(10)

            var S = Style({
                color: 'rgb(0, 0, 128)'
            })

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
            var container = Block(node, node2)
            testUtils.demo('default Gem styles', container) // node has to be apart of the page before css class styles are applied to it

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
        })

        this.test("complex default Gem styles", function(t) {
            var C = proto(Text, function(superclass) {
                this.defaultStyle = Style({
                    color: 'rgb(0, 128, 0)',
                    Text: {
                        color: 'rgb(2, 20, 200)',
                        $setup: function(block) {
                            block.yes = true
                        }
                    }
                })
            })

            var c = C()
            c.add(Text("moooose"))
            testUtils.demo("complex default Gem styles", c)

            var node = $(c.domNode)
            var child = c.children[0]
            var childNode = $(child.domNode)

            t.eq(node.css('color'), 'rgb(0, 128, 0)')
            t.eq(childNode.css('color'), 'rgb(2, 20, 200)')
            t.eq(child.yes, true)
        })
    })

    this.test("inheritance of component styles", function() {
        //  (e.g. gramparent sets Label style, parent doesn't but has a Label component in it)


        var S = Style({
            Text: Style({
                color: 'rgb(0, 128, 0)'
            })
        })

        var Parent = proto(Gem, function(superclass) {
            this.name = 'Parent'

            this.build = function() {
                this.add(Text('inParent'))
            }
        })

        var Grandparent = proto(Gem, function(superclass) {
            this.name = 'Grandparent'

            this.build = function() {
                this.style = S    // setting the style before adding components should also work
                this.add(Parent())
                this.add(Text('inGrandparent'))
            }
        })

        var node = Grandparent()
        testUtils.demo("inheritance of component styles", node)

        var grandparentText = $(node.children[1].domNode)
        var parentText = $(node.children[0].children[0].domNode)

        this.eq(grandparentText.css('color'), 'rgb(0, 128, 0)')
        this.eq(parentText.css('color'), 'rgb(0, 128, 0)')

        node.style = undefined // unset style
        this.eq(grandparentText.css('color'), 'rgb(0, 0, 0)')
        this.eq(parentText.css('color'), 'rgb(0, 0, 0)')
    })

    this.test("the 'setup' javascript initialization", function(t) {
        this.count(4)

        var S = Style({
            $setup: function(component, style) {
                t.eq(style, S)

                component.mahdiv = domUtils.div()
                    component.mahdiv.textContent = "It is set up"

                component.domNode.appendChild(component.mahdiv)

                return "some value to pass to kill"
            },
            $kill: function(component, state) {
                component.mahdiv.textContent = 'It has been killed'
                t.eq(state, "some value to pass to kill")
            }
        })
        var S2 = Style({}) // empty style

        var C = proto(Gem, function(superclass) {
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

    this.test("changing style objects on the fly", function() {

        var C = proto(Gem, function(superclass) {
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

        var Parent = proto(Gem, function(superclass) {
            this.name = 'Parent'

            this.build = function() {
                this.style = S2

                this.text = Text('inParent')
                this.text.style = textStyle3
                this.add(this.text)
            }
        })

        var Grandparent = proto(Gem, function(superclass) {
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

        var C = proto(Gem, function(superclass) {
            this.name = 'C'

            this.build = function() {
                this.style = style
                this.add(
                    Text('one'),
                    Text('inner', 'two'),
                    Block([Text('three')]),
                    Block('inner2', [Text('four')]),
                    Block('inner2', [Text('inner', 'five')])
                )
            }
        })

        var style = Style({
            color: 'rgb(128, 0, 0)',

            Text: {
                color: 'rgb(0, 128, 0)',
                backgroundColor: 'rgb(1, 2, 3)'
            },
            $inner: {
                color: 'rgb(128, 128, 128)'
            },
            $inner2: {
                Text: {
                    color: 'rgb(0, 128, 128)'
                }
            },

            Block: {
                backgroundColor: 'rgb(0, 120, 130)',

                Text: {
                    color: 'rgb(0, 0, 128)'
                }
            }
        })

        var component = C()
        testUtils.demo('component label styling', component)

        var children = $(component.domNode).children()
        this.eq($(children[0]).css('color'), 'rgb(0, 128, 0)')
        this.eq($(children[0]).css('backgroundColor'), 'rgb(1, 2, 3)')

        this.eq($(children[1]).css('color'), 'rgb(128, 128, 128)')
        this.eq($(children[1]).css('backgroundColor'), 'rgba(0, 0, 0, 0)')   // the $inner style doesn't have a backgroundColor set and doesn't inherit from the Gem style

        this.eq($(children[2]).css('backgroundColor'), 'rgb(0, 120, 130)')
        this.eq($(children[2].children[0]).css('color'), 'rgb(0, 0, 128)')

        this.eq($(children[3]).css('backgroundColor'), 'rgba(0, 0, 0, 0)')  // uses the label style, not the Gem style
        this.eq($(children[3].children[0]).css('color'), 'rgb(0, 128, 128)')

        this.eq($(children[4]).css('backgroundColor'), 'rgba(0, 0, 0, 0)')  // uses the label style, not the Gem style
        this.eq($(children[4].children[0]).css('color'), 'rgb(128, 128, 128)')         // comes from the $inner style rather than the component style (this behavior is a little weird, but is how it works for now)
        this.eq($(children[4].children[0]).css('backgroundColor'), 'rgba(0, 0, 0, 0)') // nothing should be inherited from the non-label style

        // just here to make sure there's no error:
        Style({
            Anything: {
                $someLabel: {
                    $someInnerLabel: {} // nested labels used to not be legal - now they mean something different and so are valid
                }
            }
        })
    })

    this.test('pseudoclass styling', function() {

        this.test("Style.addPseudoClass", function(t) {
            var applies = false, changeState;

            this.test("events", function(t) {
                this.count(40)

                var event = testUtils.seq(function(type, element) {
                    t.eq(type, 'setup')
                    t.eq(element, 'x')
                },function(type, element, applies) {
                    t.eq(type, 'check')
                    t.eq(element, 'x')
                    t.eq(applies, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'x')
                    t.eq(startArg, false)
                },function(type, element, state) {
                    t.eq(type, 'kill')
                    t.eq(element, 'x')
                    t.eq(state, 'whoHA')

                },function(type, element) {
                    t.eq(type, 'setup')
                    t.eq(element, 'y')
                },function(type, element, applies) {
                    t.eq(type, 'check')
                    t.eq(element, 'y')
                    t.eq(applies, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, true)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, false)
                },function(type, element, startArg) {
                    t.eq(type, 'changeState')
                    t.eq(element, 'y')
                    t.eq(startArg, true)
                },function(type, element, state) {
                    t.eq(type, 'kill')
                    t.eq(element, 'y')
                    t.eq(state, 'whoHA')
                })

                Style.addPseudoClass("test-pseudoclass", {
                    check: function(block) {
                        event('check', block.domNode.textContent, applies)
                        return applies
                    },
                    setup: function(block, start, end) {
                        event('setup', block.domNode.textContent)
                        changeState = function(startArg) {
                            event('changeState', block.domNode.textContent, startArg)
                            if(startArg === true) {
                                start()
                            } else {
                                end()
                            }
                        }

                        return "whoHA"
                    },
                    kill: function(block, state) {
                        event('kill', block.domNode.textContent, state)
                        changeState = undefined
                    }
                })
            })

            var style = Style({
                $$testPseudoclass: {
                    color: 'rgb(10, 30, 50)'
                }
            })

            var x = Text('x')
            x.attached = true // pretend its attached so it'll render the style
            x.style = style

            t.eq($(x.domNode).css('rgb(0, 0, 0)')) // starts out not applying
            changeState(false) // no change
            t.eq($(x.domNode).css('rgb(0, 0, 0)'))
            changeState(true)
            t.eq($(x.domNode).css('rgb(10, 30, 50)'))
            changeState(true)  // no change
            t.eq($(x.domNode).css('rgb(10, 30, 50)'))
            changeState(false)
            t.eq($(x.domNode).css('rgb(0, 0, 0)'))

            x.style = undefined

            applies = true
            var y = Text('y')
            y.attached = true // pretend its attached so it'll render the style
            y.style = style // note that changeState should now be a different function that won't affect x

            t.eq($(x.domNode).css('rgb(10, 30, 50)')) // starts out applying thing time
            changeState(true) // no change
            t.eq($(y.domNode).css('rgb(10, 30, 50)'))
            changeState(false)
            t.eq($(y.domNode).css('rgb(0, 0, 0)'))
            changeState(false) // no change
            t.eq($(y.domNode).css('rgb(0, 0, 0)'))
            changeState(true)
            t.eq($(y.domNode).css('rgb(10, 30, 50)'))

            y.style = Style({
                color: 'blue'
            })

        })


        //*
        this.test("native-only psuedoclass styling", function() {
            this.count(30)

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
                            backgroundColor: 'rgb(1, 2, 3)'
                        }
                    }
                },

                Block: {
                    CheckBox: {
                        color: 'rgb(0, 128, 0)',
                        width: 100 // make sure this doesn't bleed through to the readWrite CheckBox style
                    },
                    $$readWrite: {
                        CheckBox: {
                            color: 'rgb(128, 128, 128)',

                            $$checked: {
                                color: 'rgb(12, 19, 50)'
                            }
                        }
                    }
                }
            })

            var block = Block([
                CheckBox(),
                Block([CheckBox()])
            ])
            block.style = style

            testUtils.demo("native-only psuedoclass styling", block)

            var children = block.children

            var firstCheckBoxComponent = children[0]
            var firstCheckBox = $(firstCheckBoxComponent.domNode)
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log('just disabled')
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {    // need to use a timeout every time an attribute changes because the MutationObserver that listens for attribute changes is asynchornous and won't fire until the scheduler is reached
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            firstCheckBoxComponent.attr('disabled', undefined)
            setTimeout(function() {

            this.log("just checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.ok(firstCheckBox.css('outlineColor') !== 'rgb(0, 0, 0)', firstCheckBox.css('outlineColor'))
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            firstCheckBoxComponent.selected = false

            this.log("just required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)') // the required pseudoclass doesn't apply because its within the checked psudeoclass (and the box isn't checked)
            this.ok(firstCheckBox.css('outlineColor') !== 'rgb(60, 60, 200)', firstCheckBox.css('outlineColor'))
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)

            this.log("required and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(123, 130, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(60, 60, 200)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            firstCheckBoxComponent.attr('required', undefined)
            setTimeout(function() {

            this.log("disabled and checked")
            firstCheckBoxComponent.selected = true
            this.eq(firstCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            firstCheckBoxComponent.attr('disabled', undefined)

            this.log("checked and required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')
            this.eq(firstCheckBox.css('outlineWidth'), '4px')

            this.log("all 3: checked, required, and disabled")
            firstCheckBoxComponent.attr('disabled', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(130, 0, 130)')
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), 'rgb(1, 2, 3)')

            this.log("just required (again)")
            firstCheckBoxComponent.attr('disabled', false)
            firstCheckBoxComponent.selected = false
            setTimeout(function() {

            var secondCheckBoxComponent = children[1].children[0]
            var secondCheckBox = $(secondCheckBoxComponent.domNode)
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log("just readWrite (2nd)")
            children[1].attr('contenteditable', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(128, 128, 128)')
            this.eq(secondCheckBox.css('width'), '13px')   // completely separate styles from outside the pseudoclass style shouldn't bleed through (unless the style explicitly inherits)
            children[1].attr('contenteditable', undefined)
            setTimeout(function() {

            this.log("just checked (2nd)")
            secondCheckBoxComponent.selected = true
            this.eq(secondCheckBox.css('color'), 'rgb(0, 128, 0)')

            this.log("checked and readWrite (2nd)")
            children[1].attr('contenteditable', true)
            setTimeout(function() {
            this.eq(secondCheckBox.css('color'), 'rgb(12, 19, 50)')
            this.eq(secondCheckBox.css('width'), '13px') // i guess 13px is the default for checkboxes? whatever..
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


        this.test("native pseudoclass styling broken by a sibling pseudoclass", function() {
            this.count(12)

            var setupCalled= 0, killCalled=0
            var style = Style({
                CheckBox: {
                    $setup: function() { // this makes CheckBox unable to be rendered with pure css
                       setupCalled++
                    },
                    $kill: function() {
                       killCalled++
                    }
                },
                '$$nthChild(2)': {
                    backgroundColor: 'rgb(1, 9, 56)',
                    CheckBox: {
                        color: 'rgb(128, 129, 230)'
                    }
                }
            })

            var checkbox = CheckBox()
            var inner = Block([checkbox])
            var block = Block([inner])
            inner.style = style

            testUtils.demo("native psuedoclass styling broken by a block's computedStyleMap", block)

            this.log("not second child")
            setTimeout(function() {

            var checkboxNode = $(checkbox.domNode)
            var innerNode = $(inner.domNode)
            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 1)
            this.eq(killCalled, 0)

            this.log("second child")
            block.addAt(0, Text("nope"))
            setTimeout(function() {
            this.eq(checkboxNode.css('color'), 'rgb(128, 129, 230)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(1, 9, 56)')
            this.eq(setupCalled, 1)
            this.eq(killCalled, 1)

            this.log("not second child (again)")
            block.remove(0)
            setTimeout(function() {

            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 2)
            this.eq(killCalled, 1)

            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })


        this.test("native pseudoclass styling broken by a block's computedStyleMap", function() {
            this.count(12)

            var setupCalled= 0, killCalled=0
            var style = Style({
                CheckBox: {
                    $setup: function() { // this makes CheckBox unable to be rendered with pure css
                       setupCalled++
                    },
                    $kill: function() {
                       killCalled++
                    }
                },
                '$$nthChild(2)': {
                    Block:{
                        backgroundColor: 'rgb(1, 10, 57)',
                        CheckBox: {
                            color: 'rgb(128, 129, 230)'
                        }
                    },
                }
            })

            var checkbox, inner, evenInner
            var block = Block([
                inner = Block([
                     evenInner = Block([
                         checkbox = CheckBox()
                     ])
                ])
            ])
            inner.style = style

            testUtils.demo("native psuedoclass styling broken by a block's computedStyleMap", block)

            this.log("not second child")
            setTimeout(function() {

            var checkboxNode = $(checkbox.domNode)
            var innerNode = $(evenInner.domNode)
            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 1)
            this.eq(killCalled, 0)

            this.log("second child")
            block.addAt(0, Text("nope"))
            setTimeout(function() {
            this.eq(checkboxNode.css('color'), 'rgb(128, 129, 230)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(1, 10, 57)')
            this.eq(setupCalled, 1)
            this.eq(killCalled, 1)

            this.log("not second child (again)")
            block.remove(0)
            setTimeout(function() {

            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 2)
            this.eq(killCalled, 1)

            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })

        this.test("native pseudoclass styling broken by a block's computedStyleMap (2)", function() {
            this.count(12)

            var setupCalled= 0, killCalled=0
            var style = Style({
                CheckBox: {
                    $setup: function() { // this makes CheckBox unable to be rendered with pure css
                       setupCalled++
                    },
                    $kill: function() {
                       killCalled++
                    }
                }
            })

            var checkbox = CheckBox()
            var inner = Block([checkbox])
            var block = Block([inner])
            block.style = style
            inner.style = Style({
                '$$nthChild(2)': {
                    backgroundColor: 'rgb(1, 11, 57)',
                    CheckBox: {
                        color: 'rgb(128, 129, 230)'
                    }
                }
            })

            testUtils.demo("native psuedoclass styling broken by a block's computedStyleMap", block)

            this.log("not second child")
            setTimeout(function() {

            var checkboxNode = $(checkbox.domNode)
            var innerNode = $(inner.domNode)
            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 1)
            this.eq(killCalled, 0)

            this.log("second child")
            block.addAt(0, Text("nope"))
            setTimeout(function() {
            this.eq(checkboxNode.css('color'), 'rgb(128, 129, 230)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(1, 11, 57)')
            this.eq(setupCalled, 1)
            this.eq(killCalled, 1)

            this.log("not second child (again)")
            block.remove(0)
            setTimeout(function() {

            this.eq(checkboxNode.css('color'), 'rgb(0, 0, 0)')
            this.eq(innerNode.css('backgroundColor'), defaultBgColor)
            this.eq(setupCalled, 2)
            this.eq(killCalled, 1)

            }.bind(this),0)
            }.bind(this),0)
            }.bind(this),0)
        })

        this.test("basic psuedoclass styling (some emulated some not)", function() {
            this.count(40)

            var C = proto(Gem, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.style = style

                    var container = Block([CheckBox()])

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

                Block: {
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
            this.eq(firstCheckBox.css('outlineColor') , 'rgb(80, 90, 100)')
            this.eq(firstCheckBox.css('backgroundColor'), defaultBackgroundColor)
            this.eq(firstCheckBox.css('outlineWidth'), '4px')
            this.eq(firstCheckBoxComponent.someProperty, undefined)
            firstCheckBoxComponent.selected = false

            this.log("just required")
            firstCheckBoxComponent.attr('required', true)
            setTimeout(function() {
            this.eq(firstCheckBox.css('color'), 'rgb(0, 128, 0)') // the required pseudoclass doesn't apply because its within the checked psudeoclass (and the box isn't checked)
            this.eq(firstCheckBox.css('outlineColor'), 'rgb(0, 128, 0)') // default outline color is whatever the 'color' property is
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

                '$$nthChild(2n+1)': {
                    color: red
                }
            })

            var x,y;
            var c = Block([
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

        this.test('validate manually', function() {
            this.test("pseudo elements (native)", function() {
                var red = 'rgb(128, 0, 0)'
                var style = Style({
                    $$selection: {
                        color: red
                    }
                })

                var c = Text('When you select this, it should turn red')
                testUtils.manualDemo("pseudo elements (native)", c)
                c.style = style
            })
            this.test('visited', function() {
                var C = proto(Gem, function(superclass) {
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

                var component1 = C("This should be green when not in focus, and blue when you click on it (if its not, visit google then try again)", "https://www.google.com/")
                    component1.attr('tabindex', 1) // to make it focusable
                var component3 = C("This should be red (even when clicked on)", "http://www.thisdoesntexistatall.com/notatall")
                    component3.attr('tabindex', 1) // to make it focusable

                // these need to be manually verified because the 'visited' pseudClass styles can't be verified via javascript for "security" reasons (privacy really)
                testUtils.manualDemo('component :visited pseudo-class styling', Block([component1, component3]))

                component1.focus = true

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
                        this.eq(e.message, "Pseudoclass visited isn\'t emulated, but has a style that can\'t be rendered in pure css")
                    }
                })
            })
        })

        this.test('not', function(t) {
            var red = 'rgb(128, 0, 0)'
            var teal = 'rgb(0, 128, 128)'
            var style = Style({
                Text: {
                    '$$not(:nthChild(1))': {
                        color: red
                    }
                },
                Block:{
                    '$$not(:nthChild(3))': {
                        Text: {
                            color: teal
                        }
                    }
                }
            })

            var c = Block([
                Text('a'),
                Text('b'),
                Block([Text('c')]),
                Block([Text('d')])
            ])
            testUtils.demo('not', c)
            c.style = style

            t.eq($(c.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
            t.eq($(c.children[1].domNode).css('color'), red)
            t.eq($(c.children[2].children[0].domNode).css('color'), 'rgb(0, 0, 0)')
            t.eq($(c.children[3].children[0].domNode).css('color'), teal)

        })

        this.test('js-rendered pseudoclasses', function() {

            this.test('last-child', function(t) {
                this.count(7)

                var C = proto(Gem, function(superclass) {
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
                            color: 'rgb(128, 0, 0)',
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
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
                this.eq(classes.length, 2)  // one is the main default, and the other is the set active styling

                // dynamically adding elements

                component1.add(Text('e'))

                setTimeout(function() {  // the styles won't actually be applied until the thread runs back to the scheduler
                    t.eq($(children[3]).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(children[4]).css('color'), 'rgb(128, 0, 0)')
                },0)
            })

            this.test('nth-child', function() {
                var parameterParseTestCases = {
                    '2': {constant:2, variable:0},
                    'n': {constant:0, variable:1},
                    '2n': {constant:0, variable:2},
                    '2+n': {constant:2, variable:1},
                    'n+2': {constant:2, variable:1},
                    '2n+2': {constant:2, variable:2},
                    '2+2n': {constant:2, variable:2},
                    '2-n': {constant:2, variable:-1},
                    'n-2': {constant:-2, variable:1},
                    '2n-2': {constant:-2, variable:2},
                    '2-2n': {constant:2, variable:-2}
                }

                for(var param in parameterParseTestCases) {
                    this.log(param)
                    this.ok(testUtils.equal(Style.parseNthChildParameter(param), parameterParseTestCases[param]), Style.parseNthChildParameter(param), parameterParseTestCases[param])
                }

                var C = proto(Gem, function(superclass) {
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
                            color: 'rgb(128, 0, 0)',
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
                        },
                        '$$nthChild(2n)': {
                            color: 'rgb(0, 128, 128)',
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
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

                this.test('more nth-child?', function(t) {
                    this.count(5)

                    var red = 'rgb(128, 0, 0)'
                    var teal = 'rgb(0, 128, 128)'

                    var style = Style({
                        Block:{
                            '$$nthChild(2)': {
                                Text: {
                                    color: red,
                                    $setup: function() {}, // forces it to render in javascript
                                    $kill: function() {}
                                }
                            },
                            '$$nthChild(2n+1)': {
                                Text: {
                                    color: teal,
                                    $setup: function() {}, // forces it to render in javascript
                                    $kill: function() {}
                                }
                            }
                        }
                    })

                    var c = Block([])
                    testUtils.demo('nth-child emulation', c)
                    c.style = style

                    c.add(Block([Text('a')]))
                    c.add(Block([Text('b')]))
                    c.add(Block([Text('c')]))
                    c.add(Block([Text('d')]))
                    c.add(Block([Text('e')]))

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
                        '$$nthChild( 1 + 1 n )': {
                            color: red,
                            $setup: function() {}, // forces it to render in javascript
                            $kill: function() {}
                        }
                    })

                    var box = Block([])
                    var c = Block([])
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

//            todo: do this when you can figure out how syn.move works
//            this.test("hover", function(t) {
//                this.count(3)
//
//                var style = Style({
//                    $$hover: {
//                        color: 'rgb(200, 0, 0)'
//                    }
//                })
//
//                var text = Text("a")
//                text.style = style
//
//                testUtils.demo('hover', text)
//
//                this.eq($(text.domNode).css('color'), 'rgb(0, 0, 0)')
//
//                syn.move({pageX: 100, pageY:100}, text.domNode).then(function() {
//                    t.eq($(text.domNode).css('color'), 'rgb(200, 0, 0)')
//
//                    return syn.move(text.domNode, {pageX: 100, pageY:100})
//                }).then(function() {
//                    t.eq($(text.domNode).css('color'), 'rgb(0, 0, 0)')
//                }).done()
//            })
        })

    })

    this.test("test styling objects that inherit from a component", function() {

        var S = Style({
            Text: Style({
                color: 'rgb(128, 0, 0)'
            })
        })

        var inheritsFromText = proto(Text, function() {})

        var C = proto(Gem, function(superclass) {
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
        var setupCalled = 0
        var S = Style({
            color: 'rgb(0, 100, 0)',
            backgroundColor: 'rgb(23, 45, 99)',
            $state: function(state) {
                if(state.boggled) {
                    var color = 'rgb(100, 0, 0)'
                } else {
                    var color = 'rgb(0, 0, 100)'
                }

                // note: do not create styles like this within the $state function if at all possible
                // a new Style object is created every run, and probably won't get garbage collected, also obviously creating a new style is much slower than just referencing an already-created one
                return Style({
                    color: color,
                    $setup: function() {
                        setupCalled++
                    },
                    $kill: function() {
                        // requisite
                    }
                })
            }
        })

        var c = Text("hi")
        c.style = S

        testUtils.demo("component state", c)

        var text = $(c.domNode)
        this.eq(text.css('color'), 'rgb(0, 0, 100)')
        this.eq(text.css('backgroundColor'), 'rgb(23, 45, 99)')
        this.eq(setupCalled, 1)

        c.state.set('boggled', true)
        this.eq(text.css('color'), 'rgb(100, 0, 0)')
        this.eq(text.css('backgroundColor'), 'rgb(23, 45, 99)')
        this.eq(setupCalled, 2)

        c.style = undefined
        this.eq(text.css('color'), 'rgb(0, 0, 0)')
        this.eq(text.css('backgroundColor'), defaultBackgroundColor)
        this.eq(setupCalled, 2)
    })

    this.test("$inherit", function() {
        this.test("$inherit from component style map", function() {
            var style = Style({
                Block: {
                    backgroundColor: 'rgb(12, 14, 19)',
                    Block: {
                        $inherit: true,
                        color: 'rgb(15, 25, 35)'
                    }
                }
            })

            var inner;
            var thing = Block([Block([inner = Block([Text("hi")])])])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
        })

        this.test("label style inheriting from from sibling", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                $textLabel: {
                    $inherit: true,
                    color: 'rgb(15, 25, 35)'
                }
            })

            var text;
            var thing = Block([text=Text('textLabel', "hi")])
            thing.style = style
            testUtils.demo("label style inheriting from from sibling", thing)

            var textNode = $(text.domNode)
            this.eq(textNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(textNode.css('backgroundColor'), 'rgb(12, 14, 19)')
        })
        this.test("explicit styling inheriting from component style map", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                }
            })

            var text;
            var thing = Block([text=Text('textLabel', "hi")])
            thing.style = style
            text.style = Style({
                $inherit: true,
                color: 'rgb(15, 25, 35)'
            })
            testUtils.demo("label style inheriting from from sibling", thing)

            var textNode = $(text.domNode)
            this.eq(textNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(textNode.css('backgroundColor'), 'rgb(12, 14, 19)')
        })

        this.test("inheriting from multiple levels of componentStyleMap", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                Block: {
                    Text: {
                        $inherit: true,
                        color: 'rgb(15, 25, 35)'
                    },
                    Block: {
                        Text: {
                            $inherit: true,
                            width: 30
                        }
                    }
                }
            })

            var inner;
            var thing = Block([Block([Block([inner = Text("hi")])])])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('width'), '30px')
        })

        this.test("inheriting from multiple names of the same component", function() {
            var Text2 = proto(Text, function(superclass) {
                this.name = 'Text2'
            })
            var Text3 = proto(Text2, function(superclass) {
                this.name = 'Text3'
            })

            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                Text2: {
                    $inherit: true,
                    color: 'rgb(15, 25, 35)'
                },
                Text3: {
                    $inherit: true,
                    width: 30
                },
                $label: {
                    $inherit: true,
                    height: 30
                }
            })

            var inner;
            var thing = Block([
                inner=Text3('label', "hi")
            ])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('width'), '30px')
            this.eq(innerNode.css('height'), '30px')
        })

        this.test("inheriting from a label style", function() {

            var inner = Gem.Text('something', "der")

            var x = Gem.Block('a',[
                Gem.Text('something', 'hi'),
                Gem.Block('b', inner)
            ])

            x.style = Gem.Style({
                $something: {
                    color: 'rgb(150, 250, 255)'
                },
                $b: {
                    $something: {
                        $inherit: true
                    }
                }
            })

            testUtils.demo("inheriting from a label style", x)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('color'), 'rgb(150, 250, 255)')
        })

        this.test("inheriting from multiple levels of componentStyleMap with a label", function() {
            var style = Style({
                Text: {
                    backgroundColor: 'rgb(12, 14, 19)'
                },
                Block: {
                    $textLabel: {
                        $inherit: true,
                        color: 'rgb(15, 25, 35)'
                    },
                    Block: {
                        Text: {
                            $inherit: true,
                            width: 30
                        }
                    }
                }
            })

            var inner;
            var thing = Block([
                Block([
                    Block([
                        inner = Text('textLabel',"hi")
                    ])
                ])
            ])
            thing.style = style
            testUtils.demo("$inherit from component style map", thing)

            var innerNode = $(inner.domNode)
            this.eq(innerNode.css('backgroundColor'), 'rgb(12, 14, 19)')
            this.eq(innerNode.css('color'), 'rgb(15, 25, 35)')
            this.eq(innerNode.css('width'), '12px')   // default (isn't affected)
        })

        this.test("inheriting from inside a pseudoclass", function() {

            var inner1, inner2, outer
            var x = Block('a',[
                Block('b', inner1=Text('something', "hi ")),
                Block('b', inner2=Text('something', "der ")),
                outer=Text('something', 'yo'),
            ])

            x.style = Gem.Style({
                $b: {
                    $$firstChild: {
                        $something: {
                            $inherit: true,
                            backgroundColor: 'rgb(123, 150, 190)'
                        }
                    }
                },
                $something: {
                    color: 'rgb(12, 15, 19)'
                }
            })

            window.moose = inner1

            testUtils.demo("inheriting from inside a pseudoclass", x)

            var innerNode1 = $(inner1.domNode)
            var innerNode2 = $(inner2.domNode)
            var outerNode = $(outer.domNode)

            this.eq(innerNode1.css('color'), 'rgb(12, 15, 19)')
            this.eq(innerNode1.css('backgroundColor'), 'rgb(123, 150, 190)')

            this.eq(innerNode2.css('color'), 'rgb(12, 15, 19)')
            this.eq(innerNode2.css('backgroundColor'), 'rgba(0, 0, 0, 0)')      // the default

            this.eq(outerNode.css('color'), 'rgb(12, 15, 19)')
            this.eq(outerNode.css('backgroundColor'), 'rgba(0, 0, 0, 0)')       // the default
        })

        this.test("inheriting from inside an emulated pseudoclass", function() {

            var inner1, inner2, outer
            var x = Block('a',[
                outer=Text('something', 'hi'),
                Block('b', inner1=Text('something', "der ")),
                Block('b', inner2=Text('something', "yo ")),
            ])

            x.style = Gem.Style({
                $b: {
                    $$lastChild: {
                        $setup: function(){}, // requires emulation

                        $something: {
                            $inherit: true,
                            backgroundColor: 'rgb(123, 150, 190)'
                        }
                    }
                },
                $something: {
                    color: 'rgb(12, 15, 19)'
                }
            })

            window.moose = inner1

            testUtils.demo("inheriting from inside a pseudoclass", x)

            var innerNode1 = $(inner1.domNode)
            var innerNode2 = $(inner2.domNode)
            var outerNode = $(outer.domNode)

            this.eq(outerNode.css('color'), 'rgb(12, 15, 19)')
            this.eq(outerNode.css('backgroundColor'), 'rgba(0, 0, 0, 0)')       // the default

            this.eq(innerNode1.css('color'), 'rgb(12, 15, 19)')
            this.eq(innerNode1.css('backgroundColor'), 'rgba(0, 0, 0, 0)')

            this.eq(innerNode2.css('color'), 'rgb(12, 15, 19)')
            this.eq(innerNode2.css('backgroundColor'), 'rgb(123, 150, 190)')      // the default
        })
    })

    this.test('Style toObject and toString',function(t) {
        this.test("basic", function() {
            var styleObj = {
                color: 'rgb(0, 128, 0)',
                backgroundColor: "blue",
                $inherit: true,

                $$hover: {
                    color: 'orange'
                },

                A: {
                    color: "green",
                    AA: {
                        color: "yellow"
                    }
                },
                $B: {
                    color: 'red'
                }
            }

            var S = Style(styleObj)

            // hyphenate test object values
            var testObj = {}
            for(var p in styleObj) {
                testObj[p] = styleObj[p]
            }
            testObj['background-color'] = testObj.backgroundColor
            delete testObj.backgroundColor


            this.ok(testUtils.equal(S.toObject(), testObj), S.toObject())
            this.ok(testUtils.equal(S.fromString(S+'').toObject(), testObj), S+"")
        })

        this.test('functions', function() {
            var styleObj = {
                $state: function() {
                    return Style({
                        color: 'red'
                    })
                },

                $setup: function() {
                    return blippityBlue
                },
                $kill: function() {
                    return Style({
                        color: 'green'
                    })
                },
            }

            var S = Style(styleObj)

            this.ok(testUtils.equal(S.toObject(), styleObj), S.toObject())

            var resultObj = S.fromString(S+'', {blippityBlue:'blue'}).toObject()
            this.eq(resultObj.$state+'', styleObj.$state+'')
            this.eq(resultObj.$setup+'', styleObj.$setup+'')
            this.eq(resultObj.$kill+'', styleObj.$kill+'')

            // Style should be a defined object
            this.ok(testUtils.equal(resultObj.$state().toObject().color, 'red'), resultObj.$state().toObject())
            this.ok(testUtils.equal(resultObj.$setup(), 'blue'), resultObj.$setup())
        })

        this.test("nested pseudoclasses", function() {
            var styleObj = {
                $$firstChild: {
                    color: 'green',
                    $$visited: {
                        backgroundColor: 'red',
                    }
                }
            }

            var S = Style(styleObj)

            var expectedResult = {
                '$$first-child': {
                    color: 'green',
                    $$visited: {
                        color: 'green',
                        'background-color': 'red',
                    }
                }
            }

            this.ok(testUtils.equal(S.toObject(), expectedResult), S.toObject())

            var resultObj = S.fromString(S+'').toObject()
            this.ok(testUtils.equal(resultObj, expectedResult), resultObj)
        })
    })

    this.test('former bugs', function() {
        this.test('propogating inner style wasnt working', function() {
            var S = Style({
                    Block: {
                        Button: {
                            color: 'rgb(1,2,3)'
                        }
                    }
                })

            var C = Text('X')
                C.style = S
                var A = Block()
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

            var c = Block([
                Block('label', [Text('hi')])
            ])
            c.style = S

            testUtils.demo('inner styles inside labels werent working right', c)

            this.eq($(c.children[0].children[0].domNode).css('color'), 'rgb(1, 2, 3)')
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

            var c = Block([
                Block('label', [Text('hi')])
            ])
            c.style = S

            var superBlock = Block([c]) // the component has to be added to a parent for the bug to manifest

            testUtils.demo('inner styles inside labels werent working right when there was a style outside the label', superBlock)

            this.eq($(c.children[0].children[0].domNode).css('color'), 'rgb(1, 2, 3)')
        })

        this.test('removing the last child component failed', function() {
            var c = Block([Text('a')])
            c.remove(0)
        })

        this.test("loading Gem.js twice caused weird behavior - defaulting overriding main styling", function(t) {
            this.count(6)

            var container = Block()
            testUtils.demo("loading Gem.js twice caused weird behavior - defaulting overriding main styling", container)

            var c = Text('a')
            c.defaultStyle =  Style({
                display: 'block'
            })
            c.style = Style({
                position: 'absolute'
            })

            container.add(c)

            t.eq($(c.domNode).css('position'), 'absolute')
            t.eq($(c.domNode).css('display'), 'block')

            // because of webpack's shaddowing (i'm guessing) this will cause window.Gem to get populated instead of being passed back to require.js (thus the "undefinedResult")
            requirejs(["/dist/Gem.umd.js"], function(undefinedResult) {
                t.eq($(c.domNode).css('position'), 'absolute')
                t.eq($(c.domNode).css('display'), 'block')

                var d = window.Gem.Text("d")
                d.defaultStyle =  Style({
                    display: 'block'
                })
                d.style = Style({
                    position: 'absolute'
                })

                container.add(d)
                t.eq($(d.domNode).css('position'), 'absolute')
                t.eq($(d.domNode).css('display'), 'block')
            })
        })

        this.test("exception for Style with undefined value", function() {
            return Style({
                backgroundColor: undefined
            })
        })

        this.test('last-child not working when more children are added asynchronously', function(t) {
            this.count(10)

            var C = proto(Gem, function(superclass) {
                this.name = 'C'

                this.build = function() {
                    this.add(Text("a"))
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

            t.eq($(component1.children[0].domNode).css('color'), 'rgb(128, 0, 0)')

            setTimeout(function() {
                component1.add(Text('b'))
                t.eq($(component1.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                t.eq($(component1.children[1].domNode).css('color'), 'rgb(128, 0, 0)')

                setTimeout(function() {
                    component1.add(Text('c'))
                    t.eq($(component1.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(component1.children[1].domNode).css('color'), 'rgb(0, 0, 0)')
                    t.eq($(component1.children[2].domNode).css('color'), 'rgb(128, 0, 0)')

                    setTimeout(function() {
                        component1.add(Text('d'))
                        t.eq($(component1.children[0].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(component1.children[1].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(component1.children[2].domNode).css('color'), 'rgb(0, 0, 0)')
                        t.eq($(component1.children[3].domNode).css('color'), 'rgb(128, 0, 0)')
                    },0)
                },0)
            },0)
        })

        this.test('native pseudoclass style overriding block default styles when they must override a StyleMap style with "initial"', function(t) {

            var C = proto(Text, function(superclass) {
                this.name = 'blah'

                this.defaultStyle = Style({
                    color: 'rgb(100, 200, 250)'
                })
            })

            var text = C("a'llo")
            var c = Block([
                Block('a', [text])
            ])
            c.style = Style({
                Text: {
                    color: 'rgb(12, 25, 36)',
                    display: "block"
                },
                $a: {
                    '$$nthChild(1)': {
                        Text: {
                            // color left as default (which should override the 'red' above)
                        }
                    }
                }
            })

            testUtils.demo('native pseudoclass style overriding block default styles when they must override a StyleMap style with "initial"', c)

            t.eq($(text.domNode).css('color'), 'rgb(100, 200, 250)')
            t.eq($(text.domNode).css('display'), 'inline-block') // should be the base default value
        })

        this.test('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', function(t) {

            var C = proto(Block, function(superclass) {
                this.name = 'blah'
            })

            var text = C(Text("a'llo"))
            var c = Block([
                Block('a', [text])
            ])
            c.style = Style({
                Block: {
                    display: "block"
                },
                $a: {
                    '$$nthChild(1)': {
                        Block: {
                            // color left as default (which should override the 'red' above)
                        }
                    }
                }
            })

            testUtils.demo('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', c)

            t.eq($(text.domNode).css('display'), 'inline-block') // should be the base default value
        })

        this.test('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', function(t) {

            var C = proto(Block, function(superclass) {
                this.name = 'TicketView'
            })

            var thing = C(Text("a'llo"))
            var c = Block([
                C([thing])
            ])
            c.style = Style({
                TicketView: {
                    display: 'block',

                    TicketView: {
                        display: 'block',
                        minHeight: 22,

                        borderBottom: "1px solid red",

                        $$lastChild: {
                            borderBottom: 'none'
                        },
                        $componentBlock: {
                            display: 'flex',
                            alignItems: 'center',
                        }
                    }
                }
            })

            testUtils.demo('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', c)

            t.eq($(thing.domNode).css('display'), 'block') // should be the set value
            t.eq($(thing.domNode).css('minHeight'), '22px')
            t.eq($(thing.domNode).css('borderBottom'), '0px none rgb(0, 0, 0)')   // this is what you get back for "none"
        })

        this.test('native pseudoclass style not using "inherit" for color, fontSize, etc when overriding a selector', function(t) {

            var text = Text('hi')
            var textContainer = Block(text)
            var parent = Block(textContainer)

            textContainer.style = Style({
                Text: {
                    color: 'rgb(100, 0, 0)',
                    display: 'flex',
                },
                '$$nthChild(1)': {
                    color: 'rgb(0, 100, 0)',
                    display: 'block',          // here to make sure display doesn't get 'inherit'
                    Text: {
                        // color should be set to 'inherit' here
                        // display should be set to 'initial'
                    }
                }
            })

            testUtils.demo('native pseudoclass style not using "inherit" for color, fontSize, etc when overriding a selector', parent)

            t.eq($(text.domNode).css('display'), 'inline-block') // should be the initial value
            t.eq($(text.domNode).css('color'), 'rgb(0, 100, 0)')
        })

        this.test('native pseudoclass style not overriding competing psuedoclass styles', function(t) {

            var C = proto(Block, function(superclass) {
                this.name = 'Whatever'
            })

            var thing = C(Text("a'llo"))
            var c = Block([
                Block([thing])
            ])
            c.style = Style({
                Block: {
                    Whatever: {
                        display: 'table-cell',

                        $$firstChild: {
                            color: 'rgb(45, 46, 49)'
                        }
                    },

                    $$firstChild: {
                        Whatever: {

                        }
                    }
                },
            })

            testUtils.demo('native pseudoclass style not using default styles when they must override a StyleMap style with "initial" when there is no default style', c)

            t.eq($(thing.domNode).css('color'), 'rgb(0, 0, 0)')
            t.eq($(thing.domNode).css('display'), 'inline-block')
        })

        this.test("improper caching caused invalid styles to be returned - case 1", function() {

            var text = Text("text")
            var inner = Block([Block('wrapper', [text])])
            inner.style = Style({
                marginRight: 2,

                Text: {
                    minWidth: 22,
                }
            })

            var component = Block(Block([inner]))
            component.style = Style({
                Block: {
                    display: 'block'
                }
            })

            testUtils.demo('improper caching caused invalid styles to be returned - case 1', component)

            this.eq($(text.domNode).css('minWidth'), '22px')
        })

        this.test("improper caching caused invalid styles to be returned - case 2", function() {

            var text = Text()
            var inner = Block([Block('wrapper', [text])])
            inner.style = Style({
                marginRight: 2,

                Text: {
                    minWidth: 22,
                    padding: '0 2px',
                    textAlign: 'center',
                    border: '1px solid black',
                    minHeight: 18,
                    lineHeight: '15px',
                    cursor: 'pointer'
                },

                UserSelection: {
                    $setup: function(){},
                    Block: {}  /// ????? why does removing this make the style *not* work?
                }
            })

            var component = Block(Block([inner]))
            component.style = Style({
                Block: {
                    display: 'block'
                }
            })

            testUtils.demo("improper caching caused invalid styles to be returned - case 2", component)

            this.eq($(text.domNode).css('borderWidth'), '1px')
        })

        this.test("inherit inside pseudoclass style was causing an exception", function() {
            var style = Style({
                TableRow: {
                    '$$last-child':{
                        TableCell: {
                        },

                        $layoutCell: {
                            $inherit: true,
                            color: 'red'
                        }
                    }
                }
            })

            var Table = Gem.Table
            var component = Table([
                ['a1','b1','c1'],
                ['a2','b2','c2'],
                ['a3','b3','c3']
            ])

            component.style = style

            testUtils.demo("something", component)

            // the point of this test is just to not throw an exception
        })

//        // todo:
//        this.test("inherit inside a mixed in style wasn't inheriting properly", function() {
//            var rightFirst
//            var x = Block([
//                Block('left',
//                    Block('icon', Text('something', "der")),
//                    Block('icon', Text('something', " kamiser"))
//                ),
//                Block('right',
//                    rightFirst = Block('icon', Text('something', "der")),
//                    Block('icon', Text('something', " kamiser"))
//                )
//            ])
//
//            var firstStyle = {
//                color: 'rgb(0,128,0)',
//
//                $icon: {
//                    backgroundColor: 'yellow',
//                },
//
//                $$firstChild: {
//                    $icon: {
//                        $inherit: true,
//                        border: '1px solid rgb(128, 0, 0)'
//                    }
//                },
//            }
//
//            x.style = Style({
//                $left: firstStyle,
//                $right: Style(firstStyle).mix({
//                    $icon: Style(firstStyle.$icon).mix({
//                        backgroundColor: 'rgb(0, 0, 128)'
//                    }),
//                    $$firstChild: firstStyle.$$firstChild
//                })
//            })
//
//            testUtils.demo("inherit inside a mixed in style wasn't inheriting properly", x)
//
//            var rightFirstNode = $(rightFirst.domNode)
//            this.eq(rightFirstNode.css('border'), '1px solid rgb(128, 0, 0)')
//            this.eq(rightFirstNode.css('backgroundColor'), 'rgb(0, 0, 128)')
//        })
//
//        // todo:
//        this.test('Inheriting from an inner style in a defaultStyle wasnt working', function(t) {
//
//            var X = proto(Block, function() {
//               this.name = 'X'
//               this.defaultStyle = Style({
//                 $a: {
//                   color: 'rgb(100, 200, 250)'
//                 }
//               })
//            })
//
//            var x = X()
//            x.style = Style({
//              $a: {
//                 inherit: true
//               }
//            })
//
//            var text = Text('a','hi')
//            x.add(text)
//
//            x.attach()
//
//            testUtils.demo('Inheriting from an inner style in a defaultStyle wasnt working', x)
//
//            t.eq($(text.domNode).css('color'), 'rgb(100, 200, 250)')
//            t.eq($(text.domNode).css('display'), 'inline-block') // should be the base default value
//        })

        this.test('$inherit directly inside a pseudoclass was? working', function(t) {

            var innerText
            var x = Block(
                Text("a", "red"),
                Block('b', innerText=Text('a', 'redAndGreen'))
            )
            x.style = Style({
                $a: {
                  $$firstChild: {
                    color: 'rgb(128, 0, 0)'
                  }
                },
                $b: {
                  $a: {
                    $inherit: true,
                    $$firstChild: {
                      $inherit: true, // doesn't inherit color: red
                      backgroundColor: 'rgb(0, 128, 0)'
                    }
                  }
                }
            })

            testUtils.demo('$inherit directly inside a pseudoclass wasnt working', x)

            t.eq($(innerText.domNode).css('color'), 'rgb(128, 0, 0)')
            t.eq($(innerText.domNode).css('backgroundColor'), 'rgb(0, 128, 0)')
        })

        this.test("Svg styling throws an error because className is used differently for svg", function() {
            var component = Svg("<svg></svg>")

            component.style = Style({
                color: 'green'
            })

            testUtils.demo("svg", component)

            // the point of this test is just to not throw an exception
        })

        this.test("lower selectors were incorrectly propagating up the tree", function() {
            var style = Style({
                Block: {
                    $textLabel: {
                        color: 'blue'
                    }
                },
            })

            var inner1, inner2
            var thing = Block(inner1=Block(

            ))

            thing.style = style
            thing.attach()

            this.eq(Object.keys(thing.computedStyleMap).length, 1)
            this.ok(thing.computedStyleMap.Block !== undefined)
            this.eq(Object.keys(inner1.computedStyleMap).length, 2)
            this.ok(inner1.computedStyleMap.$textLabel !== undefined)
        })

        this.test("pseudoclass parameters with capitals were being transformed into dashes", function(t) {
            this.count(1)

            Style.addPseudoClass("testPseudoclass11", {   // the psuedoclass here should be parsed
                check: function(block, parameter) {
                    t.eq(parameter, 'SomeParameter')
                },
                setup: function() {

                },
                kill: function() {

                }
            })

            var x = Block()
            x.style = Style({
                '$$testPseudoclass11(SomeParameter)': {  // the parameter here should *not* be parsed
                    color: 'red'
                }
            })

            testUtils.demo("pseudoclass parameters with capitals were being transformed into dashes", x)
        })

    })
    //*/
}

/***/ }),
/* 106 */
/*!***************************************!*\
  !*** ./ComponentTests/Button.test.js ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var syn = __webpack_require__(/*! fsyn */ 6)
var testUtils = __webpack_require__(/*! testUtils */ 2)

var Button = __webpack_require__(/*! Components/Button */ 37)

module.exports = function(t) {
    t.count(5)

    var obj = new Button("Text");
    obj.on("click",function() {
        t.ok(true);
    })

    testUtils.demo("Button", obj)

    this.eq(obj.text, "Text")
    this.eq(obj.domNode.value, "Text")
    obj.text = "MOOOO"
    this.eq(obj.text, "MOOOO")
    this.eq(obj.domNode.value, "MOOOO")

    syn.click(obj.domNode)
};


/***/ }),
/* 107 */
/*!***************************************!*\
  !*** ./ComponentTests/Canvas.test.js ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)

var Canvas = __webpack_require__(/*! Components/Canvas */ 36);

module.exports = function() {

    var container = Block()
    testUtils.demo("Canvas", container)

	this.test('basic usage',function(t) {
		var obj = Canvas(20,30)
        container.add(obj)

        this.eq(obj.height, 20)
        this.eq(obj.domNode.height, 20)
        this.eq(obj.attr('height'), '20')
        this.eq(obj.width, 30)
        this.eq(obj.domNode.width, 30)
        this.eq(obj.attr('width'), '30')

        this.eq(obj.toDataURL(), obj.toImg())
        this.ok(obj.toImg() !== undefined)

        this.ok(obj.context('2d') instanceof CanvasRenderingContext2D)
        this.ok(obj.context('webgl') === null || obj.context('webgl') instanceof WebGLRenderingContext)
	});

    this.test("label argument", function() {
        var obj = Canvas("label", 30, 40)
        this.eq(obj.label, "label")
        this.eq(obj.height, 30)
        this.eq(obj.domNode.height, 30)
        this.eq(obj.width, 40)
        this.eq(obj.domNode.width, 40)
    })
};


/***/ }),
/* 108 */
/*!*****************************************!*\
  !*** ./ComponentTests/CheckBox.test.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var syn = __webpack_require__(/*! fsyn */ 6)
var testUtils = __webpack_require__(/*! testUtils */ 2)

var CheckBox = __webpack_require__(/*! Components/CheckBox */ 38)

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


/***/ }),
/* 109 */
/*!**************************************!*\
  !*** ./ComponentTests/Block.test.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var syn = __webpack_require__(/*! fsyn */ 6)
var testUtils = __webpack_require__(/*! testUtils */ 2)

var Block = __webpack_require__(/*! Components/Block */ 4)
var Text = __webpack_require__(/*! Components/Text */ 7)

module.exports = function() {

    this.test('basic usage', function(t) {
        t.count(18)

        var demoContainer = Block()
        testUtils.demo("Block", demoContainer)


        var text1 = Text('a')
        var c1 = Block(text1)
        demoContainer.add(c1)

        this.eq(c1.children.length, 1)
        this.eq(c1.domNode.childNodes.length, 1)
        this.eq(c1.children[0], text1)
        this.eq(c1.domNode.childNodes[0], text1.domNode)

        c1.on("click",function(e) {
            t.ok(e !== undefined)
        })

        syn.click(text1.domNode)  // produces a click event
        syn.click(c1.domNode)     // produces another click event


        var text2 = Text('b'), text3 = Text('c')
        var c2 = Block(text2, text3)
        demoContainer.add(c2)

        this.eq(c2.children.length, 2)
        this.eq(c2.children[0], text2)
        this.eq(c2.children[1], text3)


        var text4 = Text('d'), text5 = Text('e')
        var c3 = Block([text4, text5])
        demoContainer.add(c3)

        this.eq(c3.children.length, 2)
        this.eq(c3.children[0], text4)
        this.eq(c3.children[1], text5)


        // test to make sure label arguments work

        var c4 = Block('aLabel1', Text('e'))
        this.eq(c4.children.length, 1)
        this.eq(c4.attr('label', 'aLabel1'))

        var c5 = Block('aLabel2', Text('f'), Text('g'))
        this.eq(c5.children.length, 2)
        this.eq(c5.attr('label', 'aLabel2'))

        var c6 = Block('aLabel3', [Text('h')])
        this.eq(c6.children.length, 1)
        this.eq(c6.attr('label', 'aLabel3'))

    })

    this.test('label arguments', function() {
        var c1 = Block("label1")
        var c2 = Block("label2", [])
        var c3 = Block("label3", Text("a"), Text("b"))

        this.eq(c1.label, "label1")
        this.eq(c2.label, "label2")
        this.eq(c3.label, "label3")

        this.eq(c1.children.length, 0)
        this.eq(c2.children.length, 0)
        this.eq(c3.children.length, 2)
    })
};


/***/ }),
/* 110 */
/*!**************************************!*\
  !*** ./ComponentTests/Image.test.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)

var Image = __webpack_require__(/*! Components/Image */ 39);

module.exports = function() {

    var container = Block()
    testUtils.demo("Image", container)

	this.test('basic usage',function(t) {
		var obj = new Image("https://avatars1.githubusercontent.com/u/149531")
        container.add(obj)

        t.eq(obj.domNode.nodeName, "IMG")

        t.eq(obj.src, "https://avatars1.githubusercontent.com/u/149531")
        t.eq(obj.domNode.src, "https://avatars1.githubusercontent.com/u/149531")

        obj.src = "http://i2.kym-cdn.com/entries/icons/original/000/000/213/robocop-unicorn.jpg"
        t.eq(obj.src, "http://i2.kym-cdn.com/entries/icons/original/000/000/213/robocop-unicorn.jpg")
        t.eq(obj.domNode.src, "http://i2.kym-cdn.com/entries/icons/original/000/000/213/robocop-unicorn.jpg")
	});

    this.test("label argument", function() {
        var img = Image("label", "https://avatars1.githubusercontent.com/u/149531")

        this.eq(img.label, "label")
        this.eq(img.src, "https://avatars1.githubusercontent.com/u/149531")
        this.eq(img.domNode.src, "https://avatars1.githubusercontent.com/u/149531")
    })
};


/***/ }),
/* 111 */
/*!*************************************!*\
  !*** ./ComponentTests/List.test.js ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)
var domUtils = __webpack_require__(/*! domUtils */ 3)

var Text = __webpack_require__(/*! Components/Text */ 7)
var List = __webpack_require__(/*! Components/List */ 40)

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


/***/ }),
/* 112 */
/*!********************************************!*\
  !*** ./ComponentTests/MultiSelect.test.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var syn = __webpack_require__(/*! fsyn */ 6)

var Block = __webpack_require__(/*! Components/Block */ 4)
var Text = __webpack_require__(/*! Components/Text */ 7)

var MultiSelect = __webpack_require__(/*! Components/MultiSelect */ 113)

module.exports = function() {

    var container = Block()
    testUtils.demo("MultiSelect", container)

    this.test("basic usage", function(t) {
        this.count(49)

        var s1 = MultiSelect({4: 'Option 4', 5: "Option 5"})
        container.add(Text("Group 1: "), s1)

        this.eq(Object.keys(s1.options).length, 2)
        this.eq(s1.options[4].val, "4")
        this.eq(s1.options[5].val, "5")
        this.eq(s1.val.length, 0)

        var option6 = s1.option(6, "Option 6")

        this.eq(Object.keys(s1.options).length, 3)
        this.eq(s1.options[6], option6)


        this.test("events", function(t) {
            this.count(45)

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

            // change 1
              function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option4')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val.length, 1)

            // change 2
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option57')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val.length, 2)

            // change value of selected option

            },function(type,element) {
                t.eq(type, 'change')
                t.eq(element, 's1')

            // change 3
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option4')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val.length, 1)

            // change 4
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option4')
                t.eq(s1.options[4].selected, true)
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option6')
                t.eq(s1.options[6].selected, true)
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option57')
                t.eq(s1.options[7].selected, false)
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val.length, 2)

            // change 5
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option4')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val.length, 1)
            },function(type, element) {
                t.eq(type, 'click')
                t.eq(element, 'option6')

            // change 6
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option6')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 'option57')
            },function(type, element) {
                t.eq(type, 'change')
                t.eq(element, 's1')
                t.eq(s1.val.length, 1)
            },function(type, element) {
                t.eq(type, 'click')
                t.eq(element, 'option57')
            })

        })



        this.ok(s1.val instanceof Array, s1.val)
        this.eq(s1.val.length, 0)

        // change 1
        s1.options[4].selected = true
        this.eq(s1.val.length, 1)
        this.eq(s1.val[0], "4")
        this.eq(s1.options[4].selected, true)
        this.eq(s1.options[5].selected, false)
        this.eq(s1.options[6].selected, false)

        // change 2
        s1.options[5].selected = true
        this.eq(s1.val.length, 2)
        this.eq(s1.val[0], "4")
        this.eq(s1.val[1], "5")
        this.eq(s1.options[4].selected, true)
        this.eq(s1.options[5].selected, true)
        this.eq(s1.options[6].selected, false)

        // change option value

        s1.options[5].val = 7
        this.eq(s1.options[7].val, 7)
        this.eq(s1.val[1], '7')
        this.eq(s1.options[4].selected, true)
        this.eq(s1.options[5], undefined)     // moved to value 7
        this.eq(s1.options[6].selected, false)
        this.eq(s1.options[7].selected, true)

        // change option text
        s1.options[7].text = 'Option 7<select></select>'
        this.eq(s1.options[7].domNode.textContent, 'Option 7<select></select>')
        this.eq(s1.options[7].text, 'Option 7<select></select>')

        // change 3
        s1.options[4].selected = false
        this.eq(s1.val.length, 1)
        this.eq(s1.val[0], "7")
        this.eq(s1.options[4].selected, false)
        this.eq(s1.options[6].selected, false)
        this.eq(s1.options[7].selected, true)

        // change 4
        // change the value of the select object directly
        s1.val = [4,6]
        this.eq(s1.val.length, 2)
        this.eq(s1.val[0], "4")
        this.eq(s1.val[1], "6")
        this.eq(s1.options[4].selected, true)
        this.eq(s1.options[6].selected, true)
        this.eq(s1.options[7].selected, false)


        // select just one of the already selected options with a click
        // change 5
        syn.click(option6.domNode).then(function() {
            t.eq(s1.val.length, 1)
            t.eq(s1.val[0], "6")
            t.eq(s1.options[4].selected, false)
            t.eq(s1.options[6].selected, true)
            t.eq(s1.options[7].selected, false)

            // change 6
            // click one that wasn't already selected
            return syn.click(s1.options[7].domNode)
        }).then(function(){
            t.eq(s1.val.length, 1)
            t.eq(s1.val[0], "7")
            t.eq(s1.options[4].selected, false)
            t.eq(s1.options[6].selected, false)
            t.eq(s1.options[7].selected, true)
        }).done()

        /* todo: test selecting multiple items with shift-clicking once syn supports that
        syn.type(option6.domNode, "[shift]").click(option6.domNode).type(option6.domNode, "[shift-up]").then(function() {
            t.eq(s1.val.length, 2)
            t.eq(s1.val[0], "6")
            t.eq(s1.val[1], "7")
            t.eq(s1.options[4].selected, false)
            t.eq(s1.options[6].selected, true)
            t.eq(s1.options[7].selected, true)

            return syn.click(s1.options[7].domNode)
        }).then(function(){
            t.eq(s1.val.length, 2)
            t.eq(s1.val[0], "6")
            t.eq(s1.val[1], "7")
            t.eq(s1.options[4].selected, false)
            t.eq(s1.options[6].selected, true)
            t.eq(s1.options[7].selected, false)
        }).done()
        */
    })


    // todo:
    /*
    this.test("test keyboard events", function() {

        this.test("basic changing selected options with the keyboard", function(t) {
            var select1 = MultiSelect({1: 'one', 2: 'two', 3: 'three'})

            container.add(Text("Another Group: "), select1)

            select1.focus()
            syn.key(option1A.domNode, "[down]").then(function() {
                t.eq(document.activeElement, option1B)
                t.eq(select1.val, "2")

                return syn.key(option1A.domNode, "[down]")
            })/*.then(function() {
                t.eq(document.activeElement, option1C)
                t.eq(select1.val, "3")

                return key(option1A.domNode, "[left]")
            }).then(function() {
                t.eq(document.activeElement, option1B)
                t.eq(select1.val, "2")

                return key(option1A.domNode, "[up]")
            }).then(function() {
                t.eq(document.activeElement, option1A)
                t.eq(select1.val, "1")

                // test looping
                return key(option1A.domNode, "[up]")
            }).then(function() {
                t.eq(document.activeElement, option1C)
                t.eq(select1.val, "3")

                // test looping
                return key(option1A.domNode, "[down]")
            }).then(function() {
                t.eq(document.activeElement, option1A)
                t.eq(select1.val, "1")
            }).done()
        })

    })
    */


    this.test("labels", function(t) {
        var s1 = MultiSelect("myLabel")
        this.eq(s1.label, "myLabel")
        this.eq(Object.keys(s1.options).length, 0)

        var s2 = MultiSelect("myLabel2", {1: "one"})
        this.eq(s2.label, "myLabel2")
        this.eq(Object.keys(s2.options).length, 1)

        var option = s1.option("myLabel3", "value", "text")
        this.eq(option.label, "myLabel3")
        this.eq(option.val, "value")
        this.eq(option.text, "text")
    })


    this.test("remove", function(t) {
        this.count(13)

        var select = MultiSelect()
        var option0 = select.option("option0", "zero"), option1 = select.option("option1", "one")
        var option2 = select.option("option2", "two"), option3 = select.option("option3", 'three')
        var option4 = select.option("option4", 'four'), option5 = select.option("option5", 'five')

        option0.selected = true

        select.on('change', function() {
            event(select.val)
        })

        var event = testUtils.seq(function(values) {
            t.eq(values.length, 0)
        })


        this.eq(option1.parent, select)

        select.remove(1)
        this.eq(select.val.length, 1)
        this.eq(option1.parent, undefined)
        this.eq(Object.keys(select.options).length, 5)

        try {
            select.val = ["option1"]
        } catch(e) {
            this.eq(e.message, "There is no Option in the MultiSelect with the value: 'option1'")
        }

        select.remove(option0)          // a change event should be generated, since a selected value has been removed (and thus is no longer selected)
        this.eq(select.val.length, 0)
        this.eq(option0.parent, undefined)
        this.eq(Object.keys(select.options).length, 4)

        try {
            select.val = "option0"
        } catch(e) {
            this.eq(e.message, "There is no Option in the MultiSelect with the value: 'option0'")
        }

        select.remove([2, 3]) // these are option4 and option5


        try {
            select.val = "option4"
        } catch(e) {
            this.eq(e.message, "There is no Option in the MultiSelect with the value: 'option4'")
        }

        this.eq(Object.keys(select.options).length, 2)

        select.remove([option2])

        this.eq(Object.keys(select.options).length, 1)
    })

    // todo:
    /*
    this.test("addAt", function() { // adding options that have been removed from this or other Selects should still work (even tho thats kinda weird)
        // note that testing addAt means add and addBefore should work too, because those methods use addAt under the hood
    })
     */

    this.test("errors", function() {
        this.count(9)

        var select = MultiSelect({1: "text", 3: 'moretext', 4: "seriously"})

        try {
            select.option("1", 'text')
        } catch(e) {
            this.eq(e.message, "Can't give an Option the same value as another in the MultiSelect (value: '1')")
        }

        var optionB = select.option("2", 'text')
        try {
            optionB.val = "1"
        } catch(e) {
            this.eq(e.message, "Can't give an Option the same value as another in the Select or MultiSelect (value: \"1\")")
        }

        select.options[1].selected = true

        // verify the values beforehand (these values should remain the same after the error below)
        this.eq(select.val.length, 1)
        this.eq(select.val[0], '1')

        try {
            select.val = "nonexistent"
        } catch(e) {
            this.eq(e.message, "There is no Option in the MultiSelect with the value: 'nonexistent'")
        }

        // make sure this didn't change any values (since an exception was thrown, nothing should have been changed)
        this.eq(select.val.length, 1)
        this.eq(select.val[0], '1')

        try {
            select.remove(300)
        } catch(e) {
            this.eq(e.message, "There is no child at index 300")
        }

        var select2 = MultiSelect({x: 'x', 'y':'y', z:'z'})
        try {
            select2.remove(optionB)
        } catch(e) {
            this.eq(e.message, "The Gem passed at argument index 0 is not a child of this Gem.")
        }
    })
};


/***/ }),
/* 113 */
/*!*************************************************!*\
  !*** ../node_modules/Components/MultiSelect.js ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

var Option = __webpack_require__(/*! Components/Option */ 43)

// emits a 'change' event when its 'val' changes
module.exports = proto(Gem, function(superclass) {

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
        this.attr('multiple','multiple')
        this.label = label

        this.options = {}

        this.children = [] // need children before calling add
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

        superclass.init.apply(this, arguments) // superclass constructor
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
                    option.quiet.selected = selected
                    option.emit('change')
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

    // same interface as Gem.addAt
    /*override*/ this.addAt = function(index/*, nodes...*/) {
        var that = this

        var nodesToAdd = Gem.normalizeAddAtArguments.apply(this, arguments)

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

            option.on("mousedown",function(event) {
                event.preventDefault()           // this needs to be here otherwise the options can't be deselected

                option.parent.focus = true // without this, the parent doesn't gain focus
                option.focus = true
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
            /*option.domNode.addEventListener("click",function(event) {
                //event.preventDefault()         // this needs to be here otherwise the radio button can't be *unset*
                option.emit('click', event)
            })*/
            option.on("mousemove",function(event) {
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

    // same interface as Gem.remove
    /*override*/ this.remove = function() {
        var that = this

        var removalIndexes = Gem.normalizeRemoveArguments.apply(this, arguments)
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



/***/ }),
/* 114 */
/*!**************************************!*\
  !*** ./ComponentTests/Radio.test.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var syn = __webpack_require__(/*! fsyn */ 6)

var Block = __webpack_require__(/*! Components/Block */ 4)
var Text = __webpack_require__(/*! Components/Text */ 7)

var Radio = __webpack_require__(/*! Components/Radio */ 41)


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



/***/ }),
/* 115 */
/*!***************************************!*\
  !*** ./ComponentTests/Select.test.js ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var syn = __webpack_require__(/*! fsyn */ 6)
var domUtils = __webpack_require__(/*! domUtils */ 3)

var Block = __webpack_require__(/*! Components/Block */ 4)
var Text = __webpack_require__(/*! Components/Text */ 7)

var Select = __webpack_require__(/*! Components/Select */ 42)

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


/***/ }),
/* 116 */
/*!**************************************!*\
  !*** ./ComponentTests/Table.test.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)
var domUtils = __webpack_require__(/*! domUtils */ 3)

var Text = __webpack_require__(/*! Components/Text */ 7)
var Table = __webpack_require__(/*! Components/Table */ 44)

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


/***/ }),
/* 117 */
/*!*************************************!*\
  !*** ./ComponentTests/Text.test.js ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)
var domUtils = __webpack_require__(/*! domUtils */ 3)

var Text = __webpack_require__(/*! Components/Text */ 7);

module.exports = function() {

    var container = Block()
    testUtils.demo("Text", container)

	this.test('basic usage',function(t) {
		var obj = new Text();
        container.add(obj)
        t.eq(obj.text,"");

        obj.text = "   "
		t.ok(obj.domNode.offsetWidth > 0); // make sure the spaces aren't collapsed (by default)

        var obj2 = Text("<div>whatever</div>")
        container.add(obj2)
        t.eq(obj2.text,"<div>whatever</div>");
        t.eq(obj2.domNode[domUtils.textProperty], "<div>whatever</div>")

	});

    this.test("label argument", function() {
        var t = Text("label", "text")

        this.eq(t.label, "label")
        this.eq(t.domNode[domUtils.textProperty], "text")
    })
};


/***/ }),
/* 118 */
/*!*****************************************!*\
  !*** ./ComponentTests/TextArea.test.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)
var syn = __webpack_require__(/*! fsyn */ 6)

var TextArea = __webpack_require__(/*! Components/TextArea */ 47)

module.exports = function(t) {

    var container = Block()
    testUtils.demo("TextArea", container)

	this.test('basic usage',function(t) {
        this.count(3)

		var obj = TextArea()
        container.add(obj)

        this.test("events", function(t) {
            this.count(5)

            obj.on("click",function() {
                event('click')
            })
            obj.on("change",function() {
                event('change')
            })

            var event = testUtils.seq(function(name) {
                t.eq(name, 'change')
                t.eq(obj.val, "first!")
            },function(name) {
                t.eq(name, 'click')
            },function(name) {
                t.eq(name, 'change')
                t.eq(obj.val, "first!second")
            })
        })

        obj.val = "first!"
        this.eq(obj.val, "first!")

        syn.click(obj.domNode).then(function() {
            return syn.type(obj.domNode, "second")
        }).then(function() {
            t.eq(obj.val, "first!second")
            obj.domNode.blur()
        }).done()
	});

    this.test("label argument", function() {
        var t = TextArea("label")
        this.eq(t.label, "label")
    })
        
    this.test("quiet", function(t) {
        var obj = TextArea()
        obj.on('change', function() {
            t.ok(false)
        })
        
        obj.quiet.val = 'hi'
        this.eq(obj.val, 'hi')
    })
};


/***/ }),
/* 119 */
/*!******************************************!*\
  !*** ./ComponentTests/TextField.test.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var testUtils = __webpack_require__(/*! testUtils */ 2)
var Block = __webpack_require__(/*! Components/Block */ 4)
var syn = __webpack_require__(/*! fsyn */ 6)

var TextField = __webpack_require__(/*! Components/TextField */ 48)

module.exports = function() {

    var container = Block()
    testUtils.demo("TextArea", container)

	this.test('basic usage',function(t) {
        this.count(3)

		var obj = TextField()
        container.add(obj)

        this.test("events", function(t) {
            this.count(5)

            obj.on("click",function() {
                event('click')
            })
            obj.on("change",function() {
                event('change')
            })

            var event = testUtils.seq(function(name) {
                t.eq(name, 'change')
                t.eq(obj.val, "first!")
            },function(name) {
                t.eq(name, 'click')
            },function(name) {
                t.eq(name, 'change')
                t.eq(obj.val, "first!second")
            })
        })

        obj.val = "first!"
        this.eq(obj.val, "first!")

        syn.click(obj.domNode).then(function() {
            return syn.type(obj.domNode, "second")
        }).then(function() {
            t.eq(obj.val, "first!second")
            obj.domNode.blur()
        }).done()
	});

    this.test("password (manually verify)", function() {
        var field = TextField(true)
        container.add(field)
        field.val = "something, but it should be like, astrisks"
    })

    this.test("label argument", function() {
        var t = TextField("label", false)
        this.eq(t.label, "label")
    })        
        
    this.test("quiet", function(t) {
        var obj = TextField()
        obj.on('change', function() {
            t.ok(false)
        })
        
        obj.quiet.val = 'hi'
        this.eq(obj.val, 'hi')
    })

    this.test("former bugs", function() {
        this.test("TextField was messing directly with the domNode's classname for god knows what reason", function() {
            var field = TextField(true)
            var inner = Block([field])
            container.add(inner)

            this.eq($(field.domNode).css('box-sizing'), 'border-box')
        })
    })
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=allTests.umd.js.map