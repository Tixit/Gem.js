`blocks.js`
============

A library of extensible web components for building and styling web applications in pure-javascript.

The power of functions and variables is unparalleled, and yet languages like HTML and CSS, which don't have any ability to compose structures together, are still the primary ways people build web applications. Blocks.js is here to change that. Finally, modern application development for the browser!

Framework after framework has come along to try and solve the problem of making web pages dynamic. Angular, Backbone, Ember, jQuery, mooTools, Dojo, YUI, etc have all tried to be everything to everyone. But what they fail at providing is simplicity and modularity. They end up with bloated libraries filled with features you're not using. And many of them are oh-so-opinionated.

Blocks.js is

Examples
=======

```javascript

var blocks = require("blocks-js")

var toggleButton = blocks.Button("Hi") // create a button

// make it do stuff when you click on it
toggleButton.on('click', function() {
    if(toggleButton.text === 'Hi') {
        toggleButton.text = "RAWRR!!!"
    } else {
        toggleButton.text = 'Hi'
    }
})

// append it to the document body (so it shows up)
blocks.attach(toggleButton)

// create styles with style objects ..
toggleButton.style = blocks.Style({
    color: 'rgb(128, 0, 0)', // .. that use familiar css values,
    marginRight: 34          // .. camelCase css properties, and integers interpreted as "px" values
})

// custom blocks (use your favorite javascript class library - here proto is being used)
var proto = require('proto')
var NameInput = proto(blocks.Block, function() { // inherit from Block
    this.build = function(LabelText) {              // the `build` method initializes the custom Block
        var nameField = blocks.TextField()
        this.add(blocks.Text(LabelText), nameField)
        nameField.on('change', function() {
            toggleButton.text = hiWords = "Hi "+nameField.val
        })
    }
})

blocks.attach(NameInput("Your Name: "))

```

What `blocks.js` is ***not***
=======================

Blocks.js is not:
* **a compatibility layer**. Blocks.js uses modern browser features and is built to rely on polyfills to add older browser support. If you're looking for a compatibility system, try [modernizr](http://modernizr.com/).
* **a path router**. If you're looking for a path routing module, try [grapetree](https://github.com/fresheneesz/grapetree).
* **a class system**. If you're looking for a system for creating classes and prototypes, try [proto](https://github.com/fresheneesz/proto).
* **a module system, script bundler, or loader**. If you're looking for an excellent module system and bundler, look no further than [webpack](http://webpack.github.io/).
* **a templating system**. In blocks.js, you use functions and objects to compose together a page, rather than templates.
* **an animation library**. If you're looking for animations, try [Émile](https://github.com/madrobby/emile).
* **a framework**. A framework is a system that calls *your* code. A module is a set of functions that your code can call. Blocks.js is the latter.  Blocks.js can work well right alongside traditionally written html and css, and you can choose to wrap dom constructs in a Block only if you want to.
* **super heroic**. It does one thing well: web components. It embraces the [single-responsibility principle ](http://en.wikipedia.org/wiki/Single_responsibility_principle) and is entirely stand-alone.

Install
=======

```
npm install blocks-js
```

or download the built package blocks.umd.js from the repository

Usage
=====

```javascript
var blocks = require('blocks-js')  // node.js and webpack

define(['blocks.umd.js'], function(blocks) { ... } // amd

<script src="blocks.umd.js">&lt;/script>
<script>
  blocks; // global 'blocks' module object
</script>

```




Custom Blocks
-------------

Blocks.js is all about custom blocks. That's part of the point. Your application should be built as a composition of custom blocks on top of custom blocks, so instead of a million divs, you have semantically appropriate javascript web components.



```javascript
var NameInput = function() {
    blocks.Container.init.call(this)
}
var Intermediate = function(){}
Intermediate.prototype = blocks.Container.prototype
NameInput.prototype = new Intermediate()
NameInput.prototype.name = 'NameInput'
NameInput.prototype.create = function() {
    var nameField
    this.add(blocks.Text("Your Name: "), nameField = blocks.TextField())
    nameField.on('change', function() {
        toggleButton.text = hiWords = "Hi "+nameField.val
    })
}
```

If you're building Blocks from scratch (without a class libary), note that blocks.js relies on the following properties:
* block.constructor - must point to the Block prototype class (in the proto example, the object returned by the call to proto). This is a standard property that all good class libraries should set.
* block.constructor.parent - must point either to the parent of the block's constructor, or undefined if there is no parent. Note that while `proto` sets this automatically, it is not a standard property and if you're using a different library from proto, you must set this manually.
* block.constructor.name - the constructors must have the same name property that instances can access. Note that while `proto` sets this appropriately, most class libraries probably don't and it isn't simple to manually set. See here for details: http://stackoverflow.com/a/28665860/122422

Standard Blocks
---------------

The built-in standard blocks

### Conventions

There are some conventions that can help you learn to use standard Blocks, and help make custom Blocks you build more easily understood.
These conventional properties, constructor parameters, and behavior are encouraged to be used in custom Blocks built by you, especially if you're planning on open-sourcing them.

Every standard Block has an optional first parameter `label`.
This makes it easy and non-intrusive to label parts of your custom Blocks for easy styling.

In as many cases as possible, Blocks will use properties defined with getters and setters rather than using methods. Some examples:
* `focus` - gets whether the element has focus, or sets it to in-focus or out-of-focus
* `visible` - gets whether the element is visible (display !== 'none'), and can set its visibility status.
* `selection` - gets the selection on the element, and can set the selection

There are a few standard properties that some blocks have:
* `text` - Gets and sets some visual text that a Block has. `Button`, `Text`, and `Select.Option` have this property.
* `selected` - Gets and sets the selected-state of the Block. `CheckBox`, `Select.Option`, and `Radio.Button` have this property.
* `val` - Gets and sets some value that a block has. This will never be the same as either `text` or `selected`. `CheckBox`, `Radio`, `Radio.Button`, `Select`, `TextArea`, and `TextField` all have this property.

There are also a couple standard events that blocks can emit:
* `change` - Emitted when an important value of a block changes. This will always be either the block's `val` property or its `selected` property (but never both). Change events won't have any information passed with them, you can access the object itself if you need data from it.

Some blocks have sub-blocks specifically related to them. For example, `Select` has `Option` blocks, and `Table` has `Row` blocks, and `Row` has `Cell` Blocks respectively.
* There will also be a property with the name of the sub-block, but lower-case and plural, that contains either a map or a list of the sub-objects. For example, `Select` has a `options` map.
* For these types of blocks, there will be a method on the main Block (examples of main Blocks: Select or Table) to create a new sub-block (e.g. Option or Row) and will return that sub-block. The method will be named the same as the sub-block but in lower-case (e.g. selectBlock.option(...) will return an Option block).


Decisions
=========

* `Block.label` is not dynamic (can't be changed) because it is intended to be used to identify a particular Block when multiple Blocks of the same type are used alongside eachother. If you're looking for a way to change styles dynamically, use Block.state.
* Blocks are styled based on their name rather than their object identity (which would be possible with an array style definition like [Text,{backgroundColor:'...'}]) because otherwise all Blocks would have to be exposed at the top level. Not only does this go against modularity, but creators of 3rd party modules would inevitably fail to expose all their Blocks, which would make styling impossible. With names, you don't have to be able to reach the object, you just have to know its name.

Todo
======


* write documentation

* Finish MultiSelect (currently may not fire certain events with certain ways of selecting things with the mouse)
* Make all controls usable via the keybaord
  * eg. checkboxes should be toggled if you press enter while they're focused on
* Figure out how to make defaultStyle objects able to take into account Block styles etc
    * Make sure everything in styles is overridable (including run/kill javascript) so that
* Consider making Style objects dynamically changable, and also inheritable/extendable so that you can extend the style object of a Block instead of having to extend the object passed to a Style prototype

Changelog
========

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
