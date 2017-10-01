(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Gem"] = factory();
	else
		root["Gem"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**************************************!*\
  !*** ../node_modules/proto/proto.js ***!
  \**************************************/
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
/*!*****************************!*\
  !*** ./node_modules/Gem.js ***!
  \*****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitterB = __webpack_require__(/*! emitter-b */ 12)
var proto = __webpack_require__(/*! proto */ 0);
var trimArguments = __webpack_require__(/*! trimArguments */ 13)
var observe = __webpack_require__(/*! observe */ 14)

var utils = __webpack_require__(/*! ./utils */ 5)
var domUtils = __webpack_require__(/*! ./domUtils */ 3)
var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 7)

var devFlag = __webpack_require__(/*! devFlag */ 18)

var Style = __webpack_require__(/*! ./Style */ 2)
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
/*!*******************************!*\
  !*** ./node_modules/Style.js ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var jssModule = __webpack_require__(/*! ../external/jss */ 17)
var proto = __webpack_require__(/*! proto */ 0)
var HashMap = __webpack_require__(/*! hashmap */ 8)

var utils = __webpack_require__(/*! ./utils */ 5)

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

        var blockStyleUtils = __webpack_require__(/*! ./blockStyleUtils */ 7)
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
/* 3 */
/*!**********************************!*\
  !*** ./node_modules/domUtils.js ***!
  \**********************************/
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
/*!****************************************!*\
  !*** ../node_modules/events/events.js ***!
  \****************************************/
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
/* 5 */
/*!*******************************!*\
  !*** ./node_modules/utils.js ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)

//require('hashmap') // here to mark hashmapMerge's dependency on this module
var path = __webpack_require__(/*! path */ 6)


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
/* 6 */
/*!************************************************!*\
  !*** ../node_modules/path-browserify/index.js ***!
  \************************************************/
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 16)))

/***/ }),
/* 7 */
/*!*****************************************!*\
  !*** ./node_modules/blockStyleUtils.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// some functionality that is needed by Gem.js but is related to styling (some things are also needed by Style.js)

var HashMap = __webpack_require__(/*! hashmap */ 8)

var Style = __webpack_require__(/*! ./Style */ 2)
var utils = __webpack_require__(/*! ./utils */ 5)

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
/* 8 */
/*!******************************************!*\
  !*** ../node_modules/hashmap/hashmap.js ***!
  \******************************************/
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
/* 9 */
/*!*****************************************************!*\
  !*** ./node_modules/Components/RowlikeGenerator.js ***!
  \*****************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 2)
var Cell = __webpack_require__(/*! ./Cell */ 10);

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
/* 10 */
/*!*****************************************!*\
  !*** ./node_modules/Components/Cell.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 2)

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
/* 11 */
/*!************************!*\
  !*** ./Gem.browser.js ***!
  \************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var exports = module.exports = __webpack_require__(/*! Gem */ 1)
exports.Style = __webpack_require__(/*! Style */ 2)

exports.Canvas = __webpack_require__(/*! Components/Canvas */ 19)
exports.Block = __webpack_require__(/*! Components/Block */ 20)
exports.Button = __webpack_require__(/*! Components/Button */ 21)
exports.CheckBox = __webpack_require__(/*! Components/CheckBox */ 22)
exports.Image = __webpack_require__(/*! Components/Image */ 23)
exports.List = __webpack_require__(/*! Components/List */ 24)
//exports.MultiSelect = require("Components/MultiSelect") // not ready yet
exports.Radio = __webpack_require__(/*! Components/Radio */ 26)
exports.Select = __webpack_require__(/*! Components/Select */ 27)
exports.Svg = __webpack_require__(/*! Components/Svg */ 29)
exports.Table = __webpack_require__(/*! Components/Table */ 30)
exports.TextArea = __webpack_require__(/*! Components/TextArea */ 33)
exports.TextField = __webpack_require__(/*! Components/TextField */ 34)
exports.Text = __webpack_require__(/*! Components/Text */ 35)

/***/ }),
/* 12 */
/*!*************************************************!*\
  !*** ../node_modules/emitter-b/src/EmitterB.js ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ 4).EventEmitter
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
/* 13 */
/*!******************************************************!*\
  !*** ../node_modules/trimArguments/trimArguments.js ***!
  \******************************************************/
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
/* 14 */
/*!******************************************!*\
  !*** ../node_modules/observe/observe.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)
var EventEmitter = __webpack_require__(/*! events */ 4).EventEmitter
var utils = __webpack_require__(/*! ./utils */ 15)


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
/* 15 */
/*!****************************************!*\
  !*** ../node_modules/observe/utils.js ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// utilities needed by the configuration (excludes dependencies the configs don't need so the webpack bundle is lean)

var path = __webpack_require__(/*! path */ 6)


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
/* 16 */
/*!******************************************!*\
  !*** ../node_modules/process/browser.js ***!
  \******************************************/
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
/* 17 */
/*!*************************!*\
  !*** ./external/jss.js ***!
  \*************************/
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
/* 18 */
/*!*********************************!*\
  !*** ./node_modules/devFlag.js ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

exports.dev = false  // set to true to enable dom element naming (so you can see boundaries of components when inspecting the dom)

/***/ }),
/* 19 */
/*!*******************************************!*\
  !*** ./node_modules/Components/Canvas.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 2)

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
/* 20 */
/*!******************************************!*\
  !*** ./node_modules/Components/Block.js ***!
  \******************************************/
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
/* 21 */
/*!*******************************************!*\
  !*** ./node_modules/Components/Button.js ***!
  \*******************************************/
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
/* 22 */
/*!*********************************************!*\
  !*** ./node_modules/Components/CheckBox.js ***!
  \*********************************************/
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
/* 23 */
/*!******************************************!*\
  !*** ./node_modules/Components/Image.js ***!
  \******************************************/
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
/* 24 */
/*!*****************************************!*\
  !*** ./node_modules/Components/List.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 2)

var Item = __webpack_require__(/*! ./Item */ 25);

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
/* 25 */
/*!*****************************************!*\
  !*** ./node_modules/Components/Item.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)
var Style = __webpack_require__(/*! Style */ 2)

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
/* 26 */
/*!******************************************!*\
  !*** ./node_modules/Components/Radio.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)
var EventEmitter = __webpack_require__(/*! events */ 4).EventEmitter

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
/* 27 */
/*!*******************************************!*\
  !*** ./node_modules/Components/Select.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var Gem = __webpack_require__(/*! ../Gem */ 1)
var proto = __webpack_require__(/*! proto */ 0)

var domUtils= __webpack_require__(/*! domUtils */ 3)
var Option = __webpack_require__(/*! Components/Option */ 28)

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
/* 28 */
/*!*******************************************!*\
  !*** ./node_modules/Components/Option.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// note: this is  not intended to be used directly - only through Select and MultiSelect

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 2)
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
/* 29 */
/*!****************************************!*\
  !*** ./node_modules/Components/Svg.js ***!
  \****************************************/
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
/* 30 */
/*!******************************************!*\
  !*** ./node_modules/Components/Table.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! ../Gem */ 1)
var Style = __webpack_require__(/*! Style */ 2)

var Header = __webpack_require__(/*! ./Header */ 31);
var Row = __webpack_require__(/*! ./Row */ 32);
var Cell = __webpack_require__(/*! ./Cell */ 10);

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
/* 31 */
/*!*******************************************!*\
  !*** ./node_modules/Components/Header.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {



var RowlikeGenerator = __webpack_require__(/*! ./RowlikeGenerator */ 9);

module.exports = RowlikeGenerator('th', "TableHeader")

/***/ }),
/* 32 */
/*!****************************************!*\
  !*** ./node_modules/Components/Row.js ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var RowlikeGenerator = __webpack_require__(/*! ./RowlikeGenerator */ 9);

module.exports = RowlikeGenerator('tr', "TableRow")


/***/ }),
/* 33 */
/*!*********************************************!*\
  !*** ./node_modules/Components/TextArea.js ***!
  \*********************************************/
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
/* 34 */
/*!**********************************************!*\
  !*** ./node_modules/Components/TextField.js ***!
  \**********************************************/
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
/* 35 */
/*!*****************************************!*\
  !*** ./node_modules/Components/Text.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var proto = __webpack_require__(/*! proto */ 0)

var Gem = __webpack_require__(/*! Gem */ 1)
var Style = __webpack_require__(/*! Style */ 2)

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




/***/ })
/******/ ]);
});
//# sourceMappingURL=Gem.dev.umd.js.map