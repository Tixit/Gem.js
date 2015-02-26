exports.Block = require('Block')
exports.Style = require('Style')

exports.Canvas = require('Components/Canvas')
exports.Container = require("Components/Container")
exports.Button = require("Components/Button")
exports.CheckBox = require("Components/CheckBox")
exports.Image = require('Components/Image')
exports.List = require('Components/List')
//exports.MultiSelect = require("Components/MultiSelect") // not ready yet
exports.Radio = require("Components/Radio")
exports.Select = require("Components/Select")
exports.Table = require("Components/Table")
exports.TextArea = require("Components/TextArea")
exports.TextField = require("Components/TextField")
exports.Text = require("Components/Text")



Object.defineProperty(exports, 'dev', {
    get: function() {
        return exports.Block.dev
    }, set: function(v) {
        exports.Block.dev = v
    }
})

exports.attach = function(/*component,component,.. or components*/) {
    exports.Block.attach.apply(this,arguments)
}
exports.detach = function(/*component,component,.. or components*/) {
    exports.Block.detach.apply(this,arguments)
}

exports.createBody = function(callback) {
    exports.Block.detach.apply(this,arguments)
}