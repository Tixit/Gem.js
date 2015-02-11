`blocks.js`
============

A library for building and styling web components in pure-javascript.

The power of functions and variables is unparalleled, and yet languages like HTML and CSS, which don't have any ability to compose structures together, are still the primary ways people build web applications. Blocks.js is here to change that.

Examples
=======

```javascript

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
    color: 'rgb(128, 0, 0)', // .. that use familiar css values
    marginRight: 34          // .. and camelCase css properties and integers interpreted as "px" values
})

// custom blocks (use your favorite javascript class library - here proto is being used)
var NameInput = proto(blocks.BlockBase, function() {    // inherit from BlockBase
    this.create = function(LabelText) {                 // a create method initializes the custom Block
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
var blocks = require('blocks-js')  // node-js and webpack

define(['blocks.umd.js'], function(blocks) { ... } // amd

&lt;script src="blocks.umd.js">&lt;/script>
&lt;script>
  blocks; // global 'blocks' module object
&lt;/script>

```

MORE USAGE DOCS COMING SOON

Custom Blocks
=========

Blocks.js is all about custom blocks. That's part of the point. Your application should be built as a composition of custom blocks on top of custom blocks, so instead of a million divs, you have semantically appropriate javascript web components.

Changelog
========

* 0.1.0 - Initial commit - code transferred from private project.

How to Contribute!
============

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes
* Updating the documentation: ie this readme file. Be bold! Help create amazing documentation!
* Submitting pull requests.

How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
5. edit!
6. If it's a code change, please add to the unit tests (at test/observer.tests.js) to verify that your change
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
