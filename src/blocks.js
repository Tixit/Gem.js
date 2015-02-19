exports.Block = require('Block')
exports.Style = require('Style')

exports.Container = require("Components/Container")
exports.Button = require("Components/Button")
exports.CheckBox = require("Components/CheckBox")
exports.Radio = require("Components/Radio")
//exports.Select = require("Components/Select")
exports.MultiSelect = require("Components/MultiSelect")
exports.Table = require("Components/Table")
exports.TextArea = require("Components/TextArea")
exports.TextField = require("Components/TextField")
exports.Text = require("Components/Text")


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
