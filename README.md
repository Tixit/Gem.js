`blocks.js`
============

A library of extensible web components for building and styling web applications in pure-javascript. Modular, composable web components. Modular, composable styles.

The power of functions and variables is unparalleled, and yet languages like HTML and CSS, which don't have any ability to compose structures together, are still the primary ways people build web applications. Framework after framework has come along to try and solve the problem of making web pages dynamic. Angular, Backbone, Ember, jQuery, mooTools, Dojo, YUI, etc have all tried to be everything to everyone. But what they fail at providing is simplicity and modularity. They end up with bloated libraries filled with features you're not using.

Blocks.js is here to change that. Finally, modern application development for the browser!


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Example](#example)
- [Why use `blocks.js`?](#why-use-blocksjs)
- [What `blocks.js` is ***not***](#what-blocksjs-is-not)
- [Install](#install)
- [Usage](#usage)
  - [`Block`](#block)
    - [Loading](#loading)
    - [Static properties and methods](#static-properties-and-methods)
    - [Instance properties and methods](#instance-properties-and-methods)
      - [Instance properties inherited from `EventEmitter`](#instance-properties-inherited-from-eventemitter)
      - [Instance properties inherited from EventEmitterB](#instance-properties-inherited-from-eventemitterb)
        - [`ifon`](#ifon)
        - [`proxy`](#proxy)
    - [Instance events](#instance-events)
      - [Dom Events](#dom-events)
  - [Custom Blocks](#custom-blocks)
    - [Releasing custom blocks as separate modules](#releasing-custom-blocks-as-separate-modules)
    - [Inheriting from Blocks with a class library other than `proto`](#inheriting-from-blocks-with-a-class-library-other-than-proto)
    - [Inheriting from Blocks without a class library](#inheriting-from-blocks-without-a-class-library)
  - [Standard Blocks](#standard-blocks)
    - [Conventions](#conventions)
    - [Button](#button)
    - [Canvas](#canvas)
    - [CheckBox](#checkbox)
    - [Container](#container)
    - [Image](#image)
    - [List](#list)
    - [Radio](#radio---not-a-block)
    - [Select](#select)
    - [Table](#table)
    - [Text](#text)
    - [TextArea](#textarea)
    - [TextField](#textfield)
  - [`Style` objects](#style-objects)
    - [`Style` constructor](#style-constructor)
      - [`<cssPropertyName>`](#csspropertyname)
      - [`<BlockName>`](#blockname)
      - [`$<label>`](#$label)
      - [`$$<pseudoclass>`](#$$pseudoclass)
      - [`$setup` and `$kill`](#$setup-and-$kill)
      - [Combining them together](#combining-them-together)
    - [`Style.addPseudoClass`](#styleaddpseudoclass)
    - [Built-in Pseudoclasses](#built-in-pseudoclasses)
    - [Standard Pseudoclasses](#standard-pseudoclasses)
    - [Default style](#default-style)
- [Decisions](#decisions)
- [Todo](#todo)
- [Changelog](#changelog)
- [How to Contribute!](#how-to-contribute)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Example
=======

```javascript

var Block = require("blocks.js")
var Button = require("blocks.js/Button")
var Style = require("blocks.js/Style")

var toggleButton = Button("Hi") // create a button

// make it do stuff when you click on it
toggleButton.on('click', function() {
    if(toggleButton.text === 'Hi') {
        toggleButton.text = "RAWRR!!!"
    } else {
        toggleButton.text = 'Hi'
    }
})

// append it to the document body (so it shows up)
toggleButton.attach()

// create styles with style objects ..
toggleButton.style = Style({
    color: 'rgb(128, 0, 0)', // .. that use familiar css values,
    marginRight: 34          // .. camelCase css properties, and integers interpreted as "px" values when appropriate
})

// custom blocks (use your favorite javascript class library - here proto is being used)
var proto = require('proto')
var TextField = require("blocks.js/TextField")
var Text = require("blocks.js/Text")
var NameInput = proto(Block, function() { // inherit from Block
    this.build = function(LabelText) {              // the `build` method initializes the custom Block
        var nameField = TextField()
        this.add(Text(LabelText), nameField)
        nameField.on('change', function() {
            toggleButton.text = hiWords = "Hi "+nameField.val
        })
    }
})

NameInput("Your Name: ").attach()

```

If anything in the documentation is unclear, or you want to see more examples, [the unit tests](https://github.com/Tixit/blocks.js/tree/master/src/test) give a comprehensive and exhaustive set of examples to look at.

Why use `blocks.js`?
====================

* Makes your web application **easier to develop** with modular reusable structure objects (`Block` objects) *and* `Style` objects
* **No HTML**. With `blocks.js`, you write in 100% javascript. The only html requirement is a `document` `body`.
* **No CSS**. While blocks.js uses css style properties, it rejects the cascading nature of css, allowing one style to be fully isolated from another. No more wondering which selector in which stylesheet botched your nice clean style.
* **Works with your HTML and CSS**. `Blocks` can be added as a child to any standard dom object and they can be styled with standard css stylesheets if you so choose.
* **Fully separate style from structure**. By using `$setup` javascript in your `Style` objects, you can encode any javascript that is stylistic rather than structural.
* Import `Block` modules with real APIs that anyone can release online. HTML snippets are so 1995.
* Unlike [HTML web components](http://robdodson.me/why-web-components/), `blocks.js` **works in modern browsers without polyfills**.
* Also unlike HTML web components, [element name collision](https://groups.google.com/forum/#!topic/polymer-dev/90Dq_2bk8CU) isn't a problem.
* Has a small footprint: **15.18KB minified and gzipped in umd format**

What `blocks.js` is ***not***
=======================

Blocks.js is not:
* **a compatibility layer**. Blocks.js uses modern browser features and is built to rely on polyfills to add older browser support. If you're looking for a compatibility system, try [modernizr](http://modernizr.com/).
* **a path router**. If you're looking for a path routing module, try [grapetree](https://github.com/fresheneesz/grapetree).
* **a class system**. If you're looking for a system for creating classes and prototypes, try [proto](https://github.com/fresheneesz/proto).
* **a module system, script bundler, or loader**. If you're looking for an excellent module system and bundler, look no further than [webpack](http://webpack.github.io/).
* **a templating system**. In blocks.js, you use functions and objects to compose together a page, rather than templates.
* **an animation library**. If you're looking for animations, try [Émile](https://github.com/madrobby/emile).
* **a framework**. A framework is a system that calls *your* code. A module is a set of functions and classes that your code can call. Blocks.js is the latter.  Blocks.js can work well right alongside traditionally written html and css, and you can choose to wrap dom constructs in a Block only if you want to.
* **super heroic**. It does one thing well: web components. It embraces the [single-responsibility principle ](http://en.wikipedia.org/wiki/Single_responsibility_principle) and is entirely stand-alone.

Install
=======

```
npm install blocks.js
```

or download the built package `blocks.umd.js` from the 'dist' folder in the repository

Usage
=====

```javascript
var blocks = require('blocks.js')  // node.js and webpack

define(['blocks.umd.js'], function(blocks) { ... } // amd

<script src="blocks.umd.js">&lt;/script>
<script>
  blocks; // global 'blocks' module object
</script>

```

`Block`
------

All blocks inherit from `Block` - the basic building-block of the system. Blocks are [EventEmitters](http://nodejs.org/api/events.html), and emitting events is one of the primary ways blocks should communicate.

`Block` is abstract and can't be instantiated on its own. See the section ''Custom Blocks'' for details on how to create objects that inherit from Block.

### Loading

```javascript
var Block = require("blocks.js") // or
var Block = require("blocks.js/Block") // or
blocks.Block // if you're using the umd package
```

### Static properties and methods

**`Block.name`** - The name of the Block. Used both for naming dom elements for view in browser dev tools and for styling.

**`Block.attach(block, block, ...)`** - Appends the passed blocks to `document.body`.  
**`Block.detach(block, block, ...)`** - Removes the passed blocks to `document.body`.  
**`Block.createBody(callback)`** - Dynamically creates the body tag. Calls `callback` when done.  

### Instance properties and methods

**`block.parent`** - The Block's parent (which will also be a Block)  
**`block.children`** - An array of the Block's children (which will all be Blocks themselves).  
**`block.domNode`** - The Block's dom node.  
**`block.label`** - A string used for styling. Should be set once when the object is instantiated, and cannot change. *See the section on `Style` objects for details about how this is used*.  
**`block.excludeDomEvents`** - A set of dom events to exclude from automatic registration. Will have the structure `{eventName1:1, eventName2:1, ...}`. See the documentation for `on` for more details.  
**`block.state`** - An [observer](https://github.com/Tixit/observe) object that can be listened on for changes. Can be used for any purpose, but is intended for being used to create dynamically changing styles. *See the section on `Style` objects for an example*.

**`block.add(block, block, ...)`** - Appends blocks as children to the calling block. This causes the domNodes of the passed blocks to be appended to the calling block's dom node.  
**`block.add(listOfBlocks)`** - *Same as above, but `listOfBlocks` is an array of `Block` objects.*

**`block.addAt(index, block, block, ...)`** - Adds blocks as children to the calling block at a particular index.  
**`block.addAt(index, listOfBlocks)`** - *Same as above, but `listOfBlocks` is an array of `Block` objects.*

**`block.addBefore(beforeChild, block, block, ...)`** - Adds blocks as children to the calling block before a particular child. If `beforeChild` is undefined, this will append the given nodes.  
**`block.addBefore(beforeChild, listOfBlocks)`** - *Same as above, but `listOfBlocks` is an array of `Block` objects.*

**`block.remove(block, block, ...)`** - Removes the passed blocks as children.  
**`block.remove(listOfBlocks)`** - *Same as above, but `listOfBlocks` is an array of `Block` objects.*  
**`block.remove(index, index, ...)`** - Removes, as children, the blocks at the given `index`es in the `children` list.  
**`block.remove(listOfIndexes)`** - *Same as above, but `listOfIndexes` is an array of indexes to remove.*

**`block.attach()`** - Appends this `Block`'s domNode to `document.body`.  
**`block.detach()`** - Removes this `Block`'s domNode from `document.body`.

**`block.attr(attributeName)`** - Return the value of the attribute named `attributeName` on the Block's domNode.  
**`block.attr(attributeName, value)`** - Sets the attribute to the passed `value`.  
**`block.attr(attributeObject)`** - Sets the attributes in the `attributeObject`, where `attributeObject` looks like: `{attribute1: value1, attribute2: value2, ...}`.

**`block.style`** - Holds the object's `Style` object. Starts out `undefined`, and can be set to `undefined` to remove a `Style` that has been set. Changing this property triggers style affects in the Block's children.  
**`block.visible`** - Setting this variable to false hides the block using "display: none;". Setting this variable to true unhides it. Accessing the variable will return its visibility state.  
**`block.focus`** - Setting this variable to true gives the block focus on the page. Setting this variable to false `blur`s it. Accessing the variable returns whether or not the block is the focused element on the page.

**`block.selectionRange`** - Returns an array representing the selection range in terms of visible character offsets. E.g. a value of `[2,4]` means that the current element has 2 visible entities (usually characters) selected within it at offset 2 and 4 from the start. Note that if there are hidden characters like multiple spaces in a row, or newlines, or other non-visible characters (mostly only applies to contenteditable nodes), they are ignored.  
**`block.selectionRange = [offsetStart, offsetEnd]`** - Setting the `selectionRange` property sets the selection inside the Block's domNode based on the given offsets.

Example of `selectionRange`:

```javascript
var x = Text("You're not my buddy, guy")
x.attach()
x.selectionRange = [0,6] // selects "You're"
```

#### Instance properties inherited from [`EventEmitter`](http://nodejs.org/api/events.html)

All methods and properties from [`EventEmitter`](http://nodejs.org/api/events.html) are inherited by `Block`. The important ones:

**`block.emit(event, data, data2, ...)`** - Emits an event that triggers handlers setup via the Block's `on` or `addListener` methods.

**`block.on(event, callback)`** - Registers a `callback` that will be called when the passed `event` is `emit`ted by the Block.  
**`block.addListener(event,callback)`** - *Same as `on`.*  
* `event` - The string event name to listen for. If the passed event is one of the many standard dom events (e.g. 'click', 'mouseover', 'touchstart', etc), the passed handler will be registered as a dom event handler in one of three cases:
    * the block's `excludeDomEvents` object is undefined
    * the event is `in` the block's `excludeDomEvents` property
* `callback(data, data2, ...)` - the callback gets any arguments passed to `emit` after the event name.

**`block.once(event, callback)`** - Like `on` but the `callback` will only be called the first time the event happens.

**`block.off(event, callback)`** - Removes a callback as an event handler (the `callback` won't be called for that event again).  
**`block.removeListener(event,callback)`** - *Same as `off`.*

**`this.removeAllListeners(event)`** - Removes all the callbacks for the passed `event`.  
**`this.removeAllListeners()`** - Removes all callbacks.

#### Instance properties inherited from EventEmitterB

##### `ifon`

The `ifon` and related methods are useful primarily for performance reasons. They allow registering event listeners only when they're needed, so that the browser doesn't get overloaded with event handlers. Its recommended that `ifon` is used whenever possible. An example:

```javascript
var text = Text("CLICK ME")
var parent = Container(text)

var handler;
parent.ifon('someoneClickedTheThing', function() {
    text.on('click', handler = function() {
        parent.emit('someoneClickedTheThing', "I can't believe it")
    })
})
parent.ifoff('someoneClickedTheThing', function() {
    text.off('click', handler)
})
```

**`block.ifon(event, callback)`** - Registers a callback that will be called when a handler is registered for `event` if it had no handler registered previously. If there is already a listener attached to that event, `callback` is called immediately.
* `callback(event)` - The callback gets the newly registered event type as its argument.

**`block.ifoff(event, callback)`** - Registers a callback that will be called when the last handler for `event` is unregistered.  
**`block.ifoff(callback)`** - Registers a callback that will be called when the last handler for any event is unregistered.
* `callback(event)` - The callback gets the unregistered event type as its argument.

**`block.removeIfon()`** - Removes all `ifon` handlers.  
**`block.removeIfon(event)`** - Removes all `ifon` handlers for the passed `event`.  
**`block.removeIfon(callback)`** - Removes `callback` as an "all" `ifon` handler (a callback passed to `ifon` without an event).  
**`block.removeIfon(event, callback)`** - Removes `callback` as an `ifon` handler for the passed `event`.

**`block.removeIfoff()`** - Removes all `ifoff` handlers.  
**`block.removeIfoff(event)`** - Removes all `ifoff` handlers for the passed `event`.  
**`block.removeIfoff(callback)`** - Removes `callback` as an "all" `ifoff` handler (a callback passed to `ifoff` without an event).  
**`block.removeIfoff(event, callback)`** - Removes `callback` as an `ifoff` handler for the passed `event`.

##### `proxy`

The `proxy` method uses `ifon` and `ifoff` to minmize the number of event listeners that need to be attached in the system.

**`block.proxy(emitter, options)`** - Proxies event registration to `emitter`.
* `emitter` - The emitter (usually a `Block`) to proxy handler binding to
* `options` - An object that defines what events are proxied. If `undefined`, all events are proxied. The object can have one of the following properties:
  * `only` - An array of events to proxy.
  * `except` - An array of events to *not* proxy. All other events are proxied.

Example of `proxy`:

```javascript
var A = Text()
var B = Text()

A.proxy(B)
A.on("click", function() {
    console.log("hey hey heyyy! "+3)
})

B.emit("click", "Ughh..") // console prints "hey hey heyyy! Ughh.."
```

### Instance events

**`"newParent"`** - Emitted when a Block gets a new parent. *Note: this event is used by `Style` objects, so don't prevent these events.*  
**`"parentRemoved"`** - Emitted when a Block is detached from its parent. *Note: this event is used by `Style` objects, so don't prevent these events.*

#### Dom Events

`Block` object will emit any standard dom event (`"click"`, `"mousedown"`, `"keypress"`, etc) when listened on. Note that a `Block` doesn't add an event listener to the dom node until someone listens `on` that event on the block. This minimizes the number of event listeners that are registered on the page. To see the list of dom events this applies to (supposed to be all of them), see the top of [src/node_modules/Block.js](https://github.com/Tixit/blocks.js/blob/master/src/node_modules/Block.js)

Custom Blocks
-------------

Blocks.js is all about custom blocks. That's the point: your application should be built as a composition of custom blocks on top of custom blocks so that, instead of a million divs, you have semantically appropriate javascript web components.

In this documentation, we're going to be using the class library [proto](https://github.com/fresheneesz/proto). The descriptions here apply to both inheriting from `Block` and inheriting from any of the standard blocks. There are a couple special properties to create when making a custom `Block`:

* `name` - The name is a required property, should be named whatever your class is named, and should be a somewhat unique name in your system (tho it isn't required to be unique).
* `build()` - The "sub-constructor". The constructor calls this method, passing all arguments, to the `build` method. The return value of `build` is ignored.
* `defaultStyle` - If set to a `Style` object, the style object will be the block's default style. Unlike explicitly set Styles and inherited Styles, css properties in `defaultStyle`  *do* cascade line-by-line. Also, if a block inherits from another `Block` class that also has a `defaultStyle`, the default styles mix together with the child `Block` class style properties overriding the parent `Block` class's default properties. Currently, `defaultStyle` can only be set to `Style` objects that contain basic css properties (labels, sub-block styles, and $setup/$kill can't be used). So in the below example, if `block` is given a style that defines `color: green`, it's fontWeight will still be 'bold'.

For example:

```javascript
var CustomBlock = proto(Block, function() {
	this.name = "CustomBlock"
    this.defaultStyle = Style({
       color: 'red',
       fontWeight: 'bold'
    })

    this.build = function(x) {
    	this.x = x
    }
})

var block = CustomBlock(5) // block.x is 5
```

### Releasing custom blocks as separate modules

If you'd like to release a custom `Block` or set of `Block` objects, there are a couple of important things to remember to do:
* If you're releasing on npm, do *not* add `blocks.js` as a normal "dependency". Instead, it should be added as a ["peerDependency"](http://blog.nodejs.org/2013/02/07/peer-dependencies/) or perhaps a "devDependency". It shouldn't be a normal "dependency" because otherwise bundlers may bundle multiple copies of blocks.js when using your custom block module (even though bundlers like webpack dedupe files, if the versions of webpack being used are slightly different, they would still package together both versions of blocks.js)
* If you're releasing a module distribution intended to be loaded in a `<script>` tag, do *not* bundle blocks.js in your distribution bundle. It should assume the `blocks` global variable (e.g. `blocks.Block`) is available.

### Inheriting from Blocks with a class library other than `proto`

If you're building Blocks with something other than `proto` (*or are using a version of proto older than 1.0.17*), note that blocks.js relies on the following properties:
* **block.constructor** - must point to the Block prototype class (in the proto example, the object returned by the call to proto). This is a standard property that all good class libraries should set.
* **block.constructor.parent** - must point either to the parent of the block's constructor, or undefined if there is no parent. Note that while `proto` sets this automatically, it is not a standard property and if you're using a different library from proto, you must set this manually.
* **block.constructor.name** - the constructors must have the same name property that instances can access. Note that while `proto` sets this appropriately, most class libraries probably don't and it isn't simple to manually set. [See here for details](http://stackoverflow.com/a/28665860/122422).

Also, make sure that `Block`'s constructor is called on new instances that inherit from `Block`.

### Inheriting from Blocks without a class library

Properly subclassing a prototype in javascript isn't the simplest thing to do, but if you want to do it, here's how:

```javascript
var CustomBlock = function() {
    Block.init.call(this) // Block's constructor must be called
}
CustomBlock.parent = Block // needed for correct Style rendering

var Intermediate = function(){}; Intermediate.prototype = Block.prototype
CustomBlock.prototype = new Intermediate()
CustomBlock.prototype.name = 'CustomBlock'       // the name is a required property
CustomBlock.prototype.constructor = CustomBlock  // required for correct Style rendering, and is a standard javascript convention
CustomBlock.prototype.build = function(constructorArgument1, constructorArgument2, ...) {
    // .. custom constructor code
}
CustomBlock.prototype.customMethod = function() {
	// ...
}
```

Standard Blocks
---------------

The built-in standard blocks all inherit from `Block` and so have all the methods and properties in the above documentation. For each build-in block, its `name` property will be the same as the name the documentation uses for it. For example `Button` will have the name `"Button"`.

To use these built in blocks, access them via either `require("blocks.js/<BlockName>")` or ` blocks.<BlockName>`. For example:

```javascript
var Table = require("blocks.js/Table") // webpack or browserify
// or
var Table = blocks.Table // if loading the umd bundle in a <script> tag
```

### Conventions

There are some conventions that can help you learn to use standard Blocks, and help make custom Blocks you build more easily understood.
These conventional properties, constructor parameters, and behavior are encouraged to be used in custom Blocks built by you, especially if you're planning on open-sourcing them.

Every standard Block has an optional first parameter `label`.
This makes it easy and non-intrusive to label parts of your custom Blocks for easy styling.

In as many cases as possible, Blocks will use properties defined with getters and setters rather than using methods. There are a few standard properties that some blocks have:
* **`text`** - Gets and sets some visual text that a Block has. `Button`, `Text`, and `Select.Option` have this property.
* **`selected`** - Gets and sets the selected-state of the Block. `CheckBox`, `Select.Option`, and `Radio.Button` have this property.
* **`val`** - Gets and sets some value that a block has. This will never be the same as either `text` or `selected`. `CheckBox`, `Radio`, `Radio.Button`, `Select`, `TextArea`, and `TextField` all have this property.

This is a standard event that many blocks can emit:
* **`change`** - Emitted when an important value of a block changes. This will always be either the block's `val` property or its `selected` property (but never both). Change events won't have any information passed with them - you can access the object itself if you need data from it.

Some blocks have sub-blocks specifically related to them. For example, `Select` has `Option` blocks, and `Table` has `Row` blocks, and `Row` has `Cell` Blocks respectively.
* There will also be a property with the name of the sub-block, but lower-case and plural, that contains either a map or a list of the sub-objects. For example, `Select` has a `options` map.
* For these types of blocks, there will be a method on the main Block (examples of main Blocks: Select or Table) to create a new sub-block (e.g. Option or Row), append it to the calling block, and returns that sub-block. The method will be named the same as the sub-block but in lower-case (e.g. selectBlock.option(...) will return an Option block).

### Button

Your standard html `<button>`.

**`Button(text)`** - Returns a new button that has the passed text.  
**`Button(label, text)`**

**`button.text`** - Sets or gets the button's text.

### Canvas

Your standard html `<canvas>`.

**`Canvas(height, width)`** - Returns a new Canvas object that has the passed dimensions.  
**`Canvas(label, height, width)`**

**`canvas.height`** - Sets and gets the canvas's height.  
**`canvas.width`** - Sets and gets the canvas's width.

**`canvas.context(type, attributes)`** - Returns a standard canvas context. The `type` and `attribute` parameters and return value are the same as the html-standard [`getContext`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext).

**`canvas.toImg`** - Returns a data-url representing the image currently drawn on the canvas.  
**`canvas.toDataURL`** - Same as `canvas.toImg`.

### CheckBox

Your standard html `<input type="checkbox">`.

**`CheckBox()`** - Returns a new unchecked CheckBox.  
**`CheckBox(label)`**

**`button.text`** - Sets and gets the button's text.

### Container

A `<div>` that contains other blocks.

**`Container(block, block, ...)`** - Returns a new container with all the passed blocks as children (in the passed order).  
**`Container(listOfBlocks)`** - Same as above except `listOfBlocks` is an array of blocks.  
**`Container(label, block, block, ...)`**  
**`Container(label, listOfBlocks)`**

### Image

Your standard html `<img>`.

**`Image()`** - Returns a new empty image.  
**`Image(imageSource)`** - Returns a new image with the passed `imageSource`.  
**`Image(label, imageSource)`**

**`image.src`** - Gets or changes the image's source.

### List

An `<ol>` or `<ul>` element.

**`List()`** - Returns a new empty list.  
**`List(ordered)`** - Returns a new empty list. Is an ordered-list if `ordered` is true, and an unorderd-list otherwise.  
**`List(listInit)`** - Returns a new populated list. `listInit` is an array containing either `Block` objects or strings to add as list items.
**`List(ordered, listInit)`**  
**`List(label)`**  
**`List(label, ordered)`**  
**`List(label, listInit)`**  
**`List(label, ordered, listInit)`**

**`list.item(contents)`** - Creates a new `ListItem` with the passed `contents` and appends it to the list, which can either be a `Block` or a string.  
**`list.item(label, contents)`**

**`List.Item`** - The `ListItem` class.

**`List.Item(contents)`** - same as `list.item` above, except doesn't append the item to any list.  
**`List.Item(label, contents)`**

### Radio - Not a `Block`

A set of radio buttons. `Radio` itself is not a `Block`, but rather contains a set of related `RadioButton`s.

**`Radio()`** - Returns a new `Radio` object where a button is not required to be set (same as `Radio(false)`).  
**`Radio(required)`** - Returns a new `Radio` object. If `required` is true, a radio button will always be selected (and buttons cannot be deselected), otherwise radio-buttons can be deselected, and no radio button is selected by default.

**`radio.button(value)`** - Creates a new `RadioButton` with the passed string `value` that is a member of the `Radio` object.  
**`radio.button(label, value)`**

**`radio.selected`** - Returns the `RadioButton` object that is selected.  
**`radio.val`**  - Gets the value of the `RadioButton` that's selected, or selects the `RadioButton` that has the set value (e.g. `radio.val = 'elvis'` would select the radio button with the value "elvis")

**`radio.remove(radioButton, radioButton, ...)`** - Removes the passed radio buttons from the `Radio` object's set. Note that this will not remove the buttons from the page - that must be done separately for whatever `Block` contains the `RadioButton`s.  
**`radio.remove(arrayOfRadioButtons)`** - Same as above, except the argument is an array of the `RadioButtons` to remove.  
**`radio.remove(value, value, ...)`** - Removes the radio buttons that have the passed values from the `Radio` object's set.  
**`radio.remove(arrayOfValues)`** - Same as above, except the argument is an array of the values who's radio buttons should be removed.

**`Radio.Button`** - The `RadioButton` class.

**`radioButton.val`** - Gets or sets the value of the radio button.  
**`radioButton.selected`** - Gets whether the radio button is selected or not. If set to true, selects the button. If set to false, deselects it.  
**`radioButton.selectNext()`** - Sets the next radio button in the `Radio` object's set.  
**`radioButton.selectPrevious()`** - Sets the previous radio button in the `Radio` object's set.

### Select

Your standard `<select>` element.

**`Select()`** - Returns a new empty selection list.  
**`Select(selections)`** - Returns a new populated selection list.  
**`Select(label, selections)`**
* `selections` - An object with the structure `{optionValue: optionText, ...}`

**`select.option(value, text)`** - Creates a new `Option` with the passed `value` and `text`, and appends it to the list.  
**`select.option(label, value, text)`**

**`select.val`** - Gets the value of the selected `Option`, or selects the `Option` with the set value (e.g. `select.val = 'moo'` selects the `Option` with the value 'moo').

**`Select.Option`** - The `Option` class.

**`Select.Option(contents)`** - same as `select.option` above, except doesn't append the `Option` to any list.  
**`Select.Option(label, contents)`**

**`option.selected`** - Gets or sets the selected state of the `Option`.  
**`option.text`** - Gets or sets the display text of the `Option`.  
**`option.val`** - Gets or sets the string value of the `Option`.

### Table

Your standard `<table>` element.

**`Table()`** - Returns a new empty table.  
**`Table(tableInit)`** - Returns a new populated table.  
**`Table(label,tableInit)`**
* `tableInit` - A list where each element in the list represents a row. Each element itself should be a list where each element is a `Block` or string to put in a table `Cell`. E.g. `Table([['a','b','c'],[Text('x'),Text('y')]])` is a table with two rows and three columns, where there are only two cells in the second row.

**`table.row(rowInit)`** - Creates a new table `TableRow` (`<tr>`), and appends it to the table.  
**`table.row(label, rowInit)`**  
**`table.header(rowInit)`**  - Creates a new table `TableHeader` (`<th>`), and appends it to the table.  
**`table.header(label, rowInit)`**
* `rowInit` - A list where each element is a `Block` or string to put in a table `TableCell`. E.g. `table.row(['a','b','c'])` is a row with three cells.

**`Table.Row`** - The `TableRow` class.  
**`Table.Header`** - The `TableHeader` class.  
**`Table.TableCell`** - The `TableCell` class.

**`Table.Row(rowInit)`** - same as `table.row` above, except doesn't append the `TableRow` to any table.  
**`Table.Row(label, rowInit)`**  
**`Table.Header(rowInit)`** - same as `table.header` above, except doesn't append the `TableHeader` to any table.  
**`Table.Header(label, rowInit)`**

**`row.cell(contents)`** - Creates a new table `TableCell` (`<td>`) and appends it to the `TableRow`.  
**`row.cell(label, contents)`**  
**`header.cell(contents)`** - Creates a new table `TableCell` (`<td>`) and appends it to the `TableHeader`.  
**`header.cell(label, contents)`**

**`Table.Cell(contents)`** - Same as `Table.Row`, but doesn't append the cell to any row.  
**`Table.Cell(label, contents)`**

**`cell.colspan(columns)`** - Sets the column-span (`colspan` attribute) of the cell.

### Text

A `<div>` with text in it.

**`Text()`** - Returns an empty Text object.  
**`Text(text)`** - Returns a Text object populated with the passed string `text`.  
**`Text(label, text)`**

**`text.text`** - Sets or gets the object's text.

### TextArea

A  multi-line text input field. Your standard `<textarea>` element.

**`TextArea()`** - Returns an empty TextArea.
**`TextArea(label)`**

**`textArea.val`** - Gets or sets the testArea's value (the text inside the text box).

### TextField

A one-line text input field. Your standard `<input type='text'>` element.

**`TextField()`** - Returns an empty TextField.  
**`TextField(password)`** - Returns an empty TextField with the `password` attribute, meaning any text inside the box will be displayed so that only the number of characters can be seen, and not the characters themselves.  
**`TextField(label, password)`

**`textField.val`** - Gets or sets the textField's value (the text inside the text box).


`Style` objects
-------

![deLorean](http://www.btetrud.com/files/Delorean-200x150.jpg)

If you're going to build a web application, why not do it with `Style`?

While a `Block` is pretty analogous to its HTML node, `Style`s in blocks.js are quite different from normal CSS.

In blocks.js, individual css style properties do *not* cascade. Instead, whole `Style` objects cascade. This may not seem like much of a difference, but it makes all the difference. For example:

```javascript
var parentContainer = Container([
    Text('a'),
    Container([
        Text('b'),
        Text('c')
    ]),
    List([Text('d')])
])

c.style = Style({
    Text: {           // 1
        color: 'blue',
        fontWeight: 'bold'
    },
    Container: {
        Text: {       // 2
            color: 'red'
        }
    }
})
```

In the above example, "a" will be bold and blue, and "b" and "c" will be red. But "b" and "c" won't be bold - that property does not cascade. The `Text` styling inside `Container` is isolated from all previous stylings of `Text`, which means you don't have to worry about the styles someone used for elements further up the dom tree. I mentioned, tho, that whole `Style` objects *do* cascade, and that is why "d" will also be blue and bold even though it isn't a direct child of `parentContainer`.

Another difference is that blocks.js doesn't have "selectors" that can style any element on the page. Traditional CSS stylesheets are developed by selecting a group of elements from the entire page (via ids, classes, attributes, pseudoclasses representing element state, etc) and appending styles to them. These styles may overwrite styles written earlier, and they themselves may be overwritten. In blocks.js, `Style` objects can only be attached in a strict hierarchical setting, where only a specific section of the dom can be affected. In the above example, the `Text` style marked 2 doesn't affect anything outside that inner Container. For example, even though the text "d" is a `Text` object inside a `Container` object, it is *not* colored red. That's because styles in blocks.js are not selectors as you're used to from css. They are strictly hierarchical - they only affect descendant `Block` objects' (children, grandchildren, etc) from the point in the dom they match.

The combination of the fact that blocks.js `Style`s only cascade as a whole object and that styles are defined hierarchically makes style modular and provide isolation from other styles on the page, so that it becomes much easier to understand and manage styling for a page.

### `Style` constructor

**`Style(styleDefinition)`** - Creates a `Style` object.
* `styleDefinition` is an object where key-value pairs can be any of the following:
    * `<cssPropertyName>`: the value is a valid css value for that style property.
    * `<BlockName>`: the value can either be a `Style` object or a nested `styleDefinition` object
    * `$<label>`: the value should be a a nested styleDefinition object that does not contain any label styles
    * `$$<pseudoclass>`: the value should be a a nested styleDefinition object
    * `$setup`: the value is a function to be run on a block when the style is applied to it
    * `$kill`: the value is a function to be run on a block when a style is removed from it
    * `$state`: the value is a function to be run when `block.state` changes (ie when its `change` event fires).

#### `<cssPropertyName>`

This type of key-value pair is simple - just your basic css style. Example:

```javascript
Style({
    color: 'rgb(100, 200, 50)',
    marginRight: 3
}
```

The above style would give a color and margin-right to whatever `Block` is set with that style (`block.style = styleObject`). Note that camelCase names can be used, and numbers are automatically appended with "px" if appropriate for the property (just like with jquery's `css` method).

#### `<BlockName>`

This sets a style for the `Block` with the given name. Only blocks *within* the block who's style this is are affected, blocks that do not descend from the styled block, and even the styled block themselves are not affected. For example:

```javascript
var stylish = Style({
    Text: {
        color: 'red'
    }
})

var container = Container([Text('a')])
var text = Text("b")

container.style = stylish
text.style = stylish
```

In the above example, only "a" is styled red. The `Text` "b" remains the default, black.

You can also give Blocks a `Style` object, which is the same as the above form, except that the object-immediate is passed into the `Style` constructor:

```javascript
var textStyle = Style({
    color: 'red'
})

var stylish = Style({
    Text: textStyle
})
```

Keep in mind that `Block` styles are inherited by their parent in-full (not line-by-line like in css). So any `Block` that isn't given its own explicit style inherits from its ancestors (if its ancestors have a style for that `Block`). For example,

```javascript
var a,b,c,d,e, dContainer
var tree = Container([
    a = Text('a'),
    Container([
        b = Text('b'),
        c = Text('c'),
        dContainer = Container([
            d = Text('d'),
            Container([
                e = Text('e')
            ])
        ])
    ])
])

tree.style = Style({
    Text: {color: 'green'}
})
c.style = Style({
    fontWeight: 'bold'
})
dContainer.style = Style({
    Text: {textDecoration: 'underline'}
})
```

I hope you don't mind I assigned variables inside the `Block` structure - don't worry, the structure would be the same if the variables weren't assigned, but assigning the variables allows me to manipulate them after the structure is defined.

In any case, in the above example, the `tree` object is given a style where `Text` blocks are green. However, `dContainer` is given an alternate `Text` style.
How does that affect the resulting style? Well, "a" and "b" are colored green, but "d" and "e" are *not* green. Instead, "d" and "e" are the default color, black, and are underlined. This is because "d" and "e" inherit the `Text` style from `dContainer` which overrides the `Text` style given to `tree`.
And what about "c" you ask? Since "c" is given its own *explicit* style, that style also overrides any inheriting style. So "c" is bold and the default black.

#### `$<label>`

`Block` objects can be given a `label` property, which can be used to identify `Block` objects of the same type that have different purposes within their parent.
This is essentially analogous to giving divs class names, and then styling using that class, except that it works in blocks.js's hierarchical way of course. Note, tho, that a `Block` can have only one label.
For example:

```javascript
var container = Container([
    Text("header", "Your Receipt, Sir: "),
    Text("receipt", "1 bagel - $5, 3 buffulo - $45, 3 sticks dynamite - $100, 45 tons of wheat - $200")
    Text("Thank you for using butler-copter!")
])

container.style = Style({
    Text: {
        fontWeight: 'bold',
        color: 'blue',
        $header: {color: 'gray'},
        $receipt: {color: 'green'}
    }
})
```

In the above example, the text `"Your Receipt, Sir: "` will be gray, the receipt text will be green, and the thank-you text will be blue. However, all 3 sets of text will be bold, because the label styles mix with the style of the style-definition containing it.

#### `$$<pseudoclass>`

Like labels, pseudoclasses filter out which `Block` styles are given to. And also like labels, the styles mix with the styles defined in the style-definition containing it. For example:

```javascript
var x = Text("hi")
x.style = Style({
    fontWeight: 'bold',
    $hover: {color: 'red'}
})
```

The above code changes the text from bold-black to bold-red when you hover over it, and back to black again when you move your mouse off the text.

Pseudoclasses also mix with each other when applicable. For example:

```javascript
var container = Container([Text("a"), Text("b")])
container.style = Style({
    Text: {
        $lastChild: 'bold',
        $hover: {color: 'red'}
    }
})
```

In the above code, "a" will start black and change to red when you hover over it. "b" will start black and bold, but will change to red and bold when you hover over it.

To set a style only when multiple pseudoclasses apply, simply nest them. Alternatively as shorthand, pseudoclasses can be combined with a colon to join them ':', in which case, both pseudoclasses must be satisfied by a `Block` to apply their styles. For example:

```javascript
var text = Text("a")
text.style = Style({
    $lastChild: {
        $hover: {color: 'red'}
    },
    '$lastChild:hover': {color: 'red'} // means the same thing as the above
})
```

In the above code, "a" will turn red if it is both the last child of its parent, and if it is hovered over.

Also, pseudoclasses may take parameters, which are passed in with parens like a javascript function. For example:

```javascript
var c = Container([Text("a"),Text("b"),Text("c"),Text("d"),Text("e")])
c.style = Style({
    Text: {
        '$nthChild(1+2n)': {color: 'red'},
    }
})
```

In the above code, "a", "c", and "e" are red, while "b" and "d" are black (the default).

#### `$setup` and `$kill`

`$setup(block)` is a function that is run when the style is applied to a block, and `$kill(block)` is run when the style is removed from a block. Both functions get the block being given the style as their only argument. For example:

```javascript
var S = Style({
    $setup: function(block) {
        block.text = "I got zee style"
    },
    $kill: function(block) {
        block.text = "I'm 20% less cool"
    }
})
var t = Text("x")
t.style = S
t.text === "I got zee style"
t.style = undefined
t.text === "I'm 20% less cool"
```

These functions could be used to set up event handlers, or anything really, that could change the block in any way you want.
One way you could use `$setup` is to define a block.state handler:

```javascript
var S = Style({
    $setup: function(block) {
        block.state.on('change', block.setupHandler=function(change) {
            if(state.boggled) {
                block.domNode.style.color = 'rgb(100, 0, 0)'
            } else {
                block.domNode.style.color = 'rgb(0, 0, 100)'
            }
        })
    },
    $kill: function(block) {
        block.domNode.style.color = '' // remove the inline style
        block.state.removeListener('change', block.setupHandler) // remove the listner on the block's state
        block.setupHandler = undefined
    }
})

var text = Text("hi")
text.style = S
// here text is black
text.state.set('boggled', true)
// here text is red
text.state.set('boggled', false)
// here text is blue
text.style = undefined
// here text is black again
text.state.set('boggled', true) // now doesn't affect the style
// here text is still black
```

#### `$state`

`$state(state)` is a function that is run when the block's `state` observer property emits a `change` event (which happens when its changed with its methods `set`, `push`, `splice`, or `append`

* Idea: bring back teh $state style, but have its interface to be to return a `Style` object that will be then used to style the element
    * Make sure to note that its recommended that you don't *create* styles in $state functions unless you absolutely have to, because you will create a new style every time, taking up space and slowing down your application


#### Combining them together
`Style` objects can be as simple as a few standard css properties, or can take the place of a whole css stylesheet and more. Here's an example of a more complex style:

```javascript

var topBarHeight = 100

Style({
    marginTop: topBarHeight,
	
	Button: {
		$closeButton: {
			position: 'absolute',
			right: 3, top: 3,
			width: 'calc(50% - 2px)'
		},
		$setup: function(block) {
		    var handler;
            block.on('moo', handler=function() {
                console.log("He won't stop mooing!")
            })
            return {handler:handler}
		},
		$kill: function(block, setupState) {
            block.off('moo',setupState.handler)
		}
	},

    Table: {
		TableHeader: {
			TableCell: {
				borderBottom:'1px solid #000'
			}
		},
        TableRow: {
			'$$nthChild(1)':{
				TableCell: {
					borderTop: '1px solid #000'
				}
			},
			TableCell: {
				'$$nthChild(1)': {
	                borderLeft: "1px solid #000"
				},
				$$lastChild: {
	                borderRight: "1px solid #000"
				}
			},
			$$lastChild: {
				TableCell: {
					borderBottom: "1px solid #000",
					'$$nthChild(1)': {
		                borderLeft: "1px solid #000",
					},
					$$lastChild:{
		                borderRight: "1px solid #000",
					}
				}
			}
        }
    },

    TopBar: {
        marginTop: -topBarHeight+2,
        position: 'absolute',
        right: 0,

        Search: {
            position: 'relative',
            top: -3,

            Text: {
                $field:{
                     height: 23
                }
            }
        },

        DropTab: {
            position: 'static',

            $userDropTab: {
                cursor: 'pointer'
            },

            Container: {
                $wrapper: {
                    position: 'static'
                },

                $menu: {
                    position: 'absolute',
                    border: border,
                    marginTop: 1,
                    backgroundColor: 'white',
                    cursor: 'pointer',

                    Text: {
                        color: 'bonkers'
                    }
                },
                $button: {
                    border: border,
                    fontSize: 24,
                    fontWeight: 'bold'
                }
            }
        }
    }
})
```

### `Style.addPseudoClass`

`Style.addPseudoClass(name, fns)` - Creates a new pseudoclass that can be used in `Style` objects. This can be used to create all-new psuedoclasses no one's ever thought of before!
* `name` - The name of the new pseudoclass
* `fns` - An object with the members:
    * `processParameter(parameter)` - (Optional) Takes the pseudoclass parameter and returns some object representing it that will be used by the `setup` and `check` functions.
    * `check(block)` - A function that returns true if the pseudoclass applies to passed `block`
    * `setup(block, startCallback, endCallback, parameter)` - A function that should call `startCallback()` when the pseudoclass starts applying, and `endCallback()` when it stops applying. Can return a `state` object that will be passed to the `kill` function.
        * `parameter` - The parameter passed to the pseudoclass (e.g. in `":not(:first-child)"`, ":first-child" is the parameter). If a `processParameter` function is given, this will be the return value of that function.
    * `kill(block, state)` - A function that cleans up any event listeners or anything else set up in the `setup` function.

### Built-in Pseudoclasses

* `hover` - The usual [:hover](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) pseudoclass
* `checked` - The usual [:checked](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked) pseudoclass
* `required` - The usual [:required](https://developer.mozilla.org/en-US/docs/Web/CSS/:required) pseudoclass
* `lastChild` - The usual [:last-child](https://developer.mozilla.org/en-US/docs/Web/CSS/:last-child) pseudoclass
* `nthChild(a+bn)` - The usual [:nth-child](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child) pseudoclass

### Standard Pseudoclasses

Any pseudoclass that exists in standard css can be used by blocks.js, even if it isn't "build-in". The catch is that their use is limited. Only basic css styles can be defined within a non-build-in pseudoclass. The following things aren't supported for these:
* Styling a pseudoclass with a `Style` object
* Using a `$setup`, `$kill`, or `$state` functions within the pseudoclass style definition
* Using block labels within the pseudoclass style definition
* Using non-standard pseudoclasses within the pseudoclass style definition

Note that, while the list of built-in pseudoclasses is currently short, all standard pseudoclasses can be defined *except* the ":visited" pseudoclass, because the necessary information is not available via javascript (a browser "security" policy).

### Default style

Blocks.js unifies the default styles of dom nodes - all objects that inherit directly from `Block` have the same default styling unless they define their `defaultStyle` property.

The base default is mostly the same as css's base default. The two defaults that are different for `Block` objects:
* `display` - `"inline-block"`
* `position` - `"relative"`

Also, while most css styles are not inherited from a `Block`'s parent, the following are inherited:
* `color`
* `cursor`
* `fontFamily`
* `fontSize`
* `fontStyle`
* `fontVariant`
* `fontWeight`
* `visibility`

And while blocks.js generally rejects css's use of cascading, there is some similar cascading going on, but much more simplified and localized. Defining this behavior in terms of "cascading order", the order is:
# The base default style (described above in this section).
# The `defaultStyle` property of the block instance's furthest ancestor class
# ...
# The  `defaultStyle` property of the Block's parent class
# The `defaultStyle` property of the Block itself
# The Block instance's active style (either an inherited style or its `style` property)

Decisions
=========

* `Block.label` is not dynamic (can't be changed) because it is intended to be used to identify a particular Block when multiple Blocks of the same type are used alongside eachother. If you're looking for a way to change styles dynamically, use `Block.state`.
* Blocks are styled based on their name rather than their object identity (which would be possible with an array style definition like [Text,{backgroundColor:'...'}]) because otherwise all Blocks would have to be exposed at the top level. Not only does this go against modularity, but creators of 3rd party modules would inevitably fail to expose all their Blocks, which would make styling impossible. With names, you don't have to be able to reach the object, you just have to know its name.
* don't use npm shrinkwrap for browser modules like this, because otherwise multiple minor versions of the same package might get into a browser bundle and make page loading slower

Todo
======


* Figure out which style wins when multiple psuedoclasses apply and they're side by side (instead of nested)
    * Do they combine? They shouldn't..
    * But wasn't there a nice magical way we could indicate that they combine?
* Test hover with and without a parent (see nth-child without a parent for what that means)
* Fix a bug in last-child where dynamically adding more children leads to 50% of the children being treated as last-child
* Fix the bug in hover where it fails to style properly after the first hover

* Make it so that psuedoclasses can be styled with `Style` objects as long as their checked to only contain simple styles.
* Finish MultiSelect (currently may not fire certain events with certain ways of selecting things with the mouse)
* Make all controls usable via the keybaord
  * eg. checkboxes should be toggled if you press enter while they're focused on
* Figure out how to make defaultStyle objects able to take into account Block styles etc
    * Make sure everything in styles is overridable (including run/kill javascript), because its important that any default can be changed overridden

* Consider making Style objects dynamically changable, and also inheritable/extendable so that you can extend the style object of a Block instead of having to extend the object passed to a Style prototype

* in separate module (a Blocks utility kit or something):
  * RadioSet (a set of labeled radio buttons)
  * TextEditor


Changelog
========

* 0.9.12
    * bringing back the $state style in a slightly different form
    * fixing a bug in label argument interpretation
    * getting rid of npm-shrinkwrap and fixing up dependency versioning to be generally lenient but strict on major version
* 0.9.11 - updating hashmap version, since it was giving me trouble in another project
* 0.9.10
    * remove the $state style thing - $setup and $kill cover it
    * allow $setup to return a value that's then passed to $kill (so they aren't forced to set properties on the block)
* 0.9.9 adding better require paths for commonjs
* 0.9.8 - writing all this documentation
* 0.9.7 - Added List, Image, and Canvas
* 0.9.6 - Fixed but in EventEmitterB that was causing catch-all ifon handlers to not fire on-call if events were already attached beforehand
* 0.9.5
    * Used default stying to set defaults on some of the built in Blocks
    * Fixed a bug in ifon when its called without an event and there are already events set up
* 0.9.4 - Create a way to set unobtrusive default styles for custom Blocks (so you can, for example, make Option blocks display: block)
* 0.9.3 - Support styling blocks via their inheritance tree (ie if A inherits from B, styling A should style A and B, but a B style should override an A style)
* 0.9.2
    * Using `ifon` and `ifoff` for proxying browser events through Blocks
    * Override the `on` method so that standard browser events are automatically attached to domNodes
        * provide a way to exclude certain events, so they can be set up in an alternate way
* 0.9.1
    * Adding tests for all the public Block properties that didn't already have tests
    * Changing API of focus/blur, show/hide, and selection methods to getter/setter style properties
    * Replacing getCaretPosition to selectionRange that returns the full selection range
    * Made the selection stuff work for inputs and text areas
    * Adding `ifon` and `ifoff` methods
* 0.1.1 - Creating a bunch of conventions that all the standard blocks conform to
* 0.1.0 - Initial commit - code transferred from private project.

How to Contribute!
============

Want to contribute? Start with the [Contributing Guide](CONTRIBUTING.md)!

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes.
* Updating the documentation: ie this readme file. Be bold! Help create great documentation!
* Submitting pull requests.

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
