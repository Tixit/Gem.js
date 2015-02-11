exports.BlockBase = require('./src/BlockBase')
exports.Style = require('./src/Style')

exports.Block = require("./src/Components/Block")
exports.Button = require("./src/Components/Button")
exports.CheckBox = require("./src/Components/CheckBox")
exports.Label = require("./src/Components/Label")
exports.Radio = require("./src/Components/Radio")
exports.Select = require("./src/Components/Select")
exports.Table = require("./src/Components/Table")
exports.TableCell = require("./src/Components/TableCell")
exports.TableHeader = require("./src/Components/TableHeader")
exports.TableRow = require("./src/Components/TableRow")
exports.TextArea = require("./src/Components/TextArea")
exports.TextField = require("./src/Components/TextField")
exports.Text = require("./src/Components/Text")

var domUtils = require('./src/domUtils')

// todo:
//exports.List = require('./src/Components/List')
//exports.Image = require('./src/Components/Image')
//exports.Canvas = require('./src/Components/Canvas')


// appends components to the body
exports.attach = function(components) {
    if(!(components instanceof Array)) {
        components = [components]
    }
    if(document.body === null) throw new Error("Your document does not have a body.")

    for(var n=0; n<components.length; n++) {
        document.body.appendChild(components[n].domNode)
    }
}
// removes components from the body
exports.detach = function(components) {
    if(!(components instanceof Array)) {
        components = [components]
    }

    for(var n=0; n<components.length; n++) {
        document.body.removeChild(components[n].domNode)
    }
}

// creates a body tag (only call this if document.body is null)
exports.createBody = function(callback) {
    var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    var body = dom.createElement("body")
    dom.firstChild.appendChild(body)
    setTimeout(function() {  // set timeout is needed because the body tag is only added after javascript goes back to the scheduler
        callback()
    },0)
}
