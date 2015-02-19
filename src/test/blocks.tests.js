"use strict";

var Unit = require('deadunit/deadunit.browser')

var blocks = require("../blocks")
blocks.dev = true

module.exports = function() {


    var tests = Unit.test("Testing Blocks.js", function(t) {


        //*
        this.test('Block',require('./Block.test'))
        this.test('Style',require('./Style.test'))

        this.test("standard components", function(t) {
            this.count(10)

            this.test('Button',require('./ComponentTests/Button.test'));
            this.test('CheckBox',require('./ComponentTests/CheckBox.test'));
            this.test('Container',require('./ComponentTests/Container.test'));
            this.test('MultiSelect',require('./ComponentTests/MultiSelect.test'));
            this.test('Radio',require('./ComponentTests/Radio.test'));
            this.test('Select',require('./ComponentTests/Select.test'));
            this.test('table',require('./ComponentTests/Table.test'));
            this.test('text',require('./ComponentTests/Text.test'));
            this.test('textarea',require('./ComponentTests/TextArea.test')).complete.then(function() {
                return t.test('textfield',require('./ComponentTests/TextField.test')).complete
            }).done()
        })

        //*/
    })

    tests.writeHtml($("#results")[0])

    return tests
}