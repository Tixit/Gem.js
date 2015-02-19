`blocks.js`
============

A library of extensible web components for building and styling web applications in pure-javascript.

The power of functions and variables is unparalleled, and yet languages like HTML and CSS, which don't have any ability to compose structures together, are still the primary ways people build web applications. Blocks.js is here to change that. Finally, modern application development for the browser!

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
    this.create = function(LabelText) {              // a create method initializes the custom Container
        var nameField = blocks.TextField()
        this.add(blocks.Text(LabelText), nameField)
        nameField.on('change', function() {
            toggleButton.text = hiWords = "Hi "+nameField.val
        })
    }
})

blocks.attach(NameInput("Your Name: "))

```

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

MORE USAGE DOCS COMING SOON

Custom Blocks
=========

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


Conventions
===========

There are some conventions that can help you learn to use standard Blocks, and help make custom Blocks you build more easily understood.
These conventional properties, constructor parameters, and behavior are encouraged to be used in custom Blocks built by you, especially if you're planning on open-sourcing them.

Every standard Block has an optional first parameter `label`.
This makes it easy and non-intrusive to label parts of your custom Blocks for easy styling.

There are a few standard properties that some blocks have:
* `text` - Gets and sets some visual text that a Block has. `Button`, `Text`, and `Select.Option` have this property.
* `selected` - Gets and sets the selected-state of the Block. `CheckBox`, `Select.Option`, and `Radio.Button` have this property.
* `val` - Gets and sets some value that a block has. This will never be the same as either `text` or `selected`. `CheckBox`, `Radio`, `Radio.Button`, `Select`, `TextArea`, and `TextField` all have this property.

There are also a couple standard events that blocks can emit:
* `change` - Emitted when an important value of a block changes. This will always be either the block's `val` property or its `selected` property (but never both). Change events won't have any information passed with them, you can access the object itself if you need data from it.

Some blocks have sub-blocks specifically related to them. For example, `Select` has `Option` blocks, and `Table` has `Row` blocks, and `Row` has `Cell` Blocks respectively.
* There will also be a property with the name of the sub-block, but lower-case and plural, that contains either a map or a list of the sub-objects. For example, `Select` has a `options` map.
* For these types of blocks, there will be a method on the main Block (examples of main Blocks: Select or Table) to create a new sub-block (e.g. Option or Row) and will return that sub-block. The method will be named the same as the sub-block but in lower-case (e.g. selectBlock.option(...) will return an Option block).

Todo
======

* Switch to using EventEmitter2 so you can set up catch-all event handlers
* Override the `on` method so that standard browser events are automatically attached to domNodes
    * provide a way to exclude certain events, so they can be set up in an alternate way
* Create a way to set unobtrusive default styles for custom Blocks (so you can, for example, make Option blocks display: block)
* Change styles to require actual references to blocks its' styling
* Finish MultiSelect (currently may not fire certain events with certain ways of selecting things with the mouse)
* Make all controls usable via the keybaord
  * eg. checkboxes should be toggled if you press enter while they're focused on

Changelog
========

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
