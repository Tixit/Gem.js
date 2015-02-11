"use strict";

var Unit = require('deadunit/deadunit.browser')

var testUtils = require('./testUtils')
var equal = testUtils.equal

//var blocks = require("../blocks.js") // this is loaded as a script in the browser

module.exports = function() {
    var tests = Unit.test("Testing Blocks.js", function() {
        this.test('Component',require('./BlockBase.test'))

        this.test('checkbox',require('./ComponentTests/CheckBox.test'));
        this.test('textarea',require('./ComponentTests/TextArea.test'));
        this.test('textfield',require('./ComponentTests/TextField.test'));
        this.test('button',require('./ComponentTests/Button.test'));
        this.test('label',require('./ComponentTests/Label.test'));
        this.test('radio',require('./ComponentTests/Radio.test'));
        this.test('container',require('./ComponentTests/Block.test'));
        this.test('select',require('./ComponentTests/Select.test'));
        this.test('table',require('./ComponentTests/Table.test'));
        this.test('text',require('./ComponentTests/Text.test'));

    })

    tests.writeHtml($("#results")[0])

    tests.events({end: function() {
        setTimeout(function() { // it takes a little time for the test results to show up
            $("#demos").show()
        }, 0)
    }})

}