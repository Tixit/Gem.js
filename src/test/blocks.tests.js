"use strict";

var Unit = require('deadunit/deadunit.browser')

var blocks = require("../blocks.browser")
blocks.dev = true

module.exports = function() {


    var tests = Unit.test("Testing Blocks.js", function(t) {
        this.count(4)


        //*
        t.test('EventEmitterB',require('./EventEmitterB.test')).complete.then(function(){
            return t.test('Block',require('./Block.test')).complete
        }).then(function(){
            return t.test('Style',require('./Style.test')).complete
        }).then(function() {
            return t.test("standard components", function(t) {
                t.count(13)

                t.test('Button',require('./ComponentTests/Button.test'));
                t.test('Canvas',require('./ComponentTests/Canvas.test'));
                t.test('CheckBox',require('./ComponentTests/CheckBox.test'));
                t.test('Container',require('./ComponentTests/Container.test'));
                t.test('Image',require('./ComponentTests/Image.test'));
                t.test('List',require('./ComponentTests/List.test'));
                t.test('MultiSelect',require('./ComponentTests/MultiSelect.test'));
                t.test('Radio',require('./ComponentTests/Radio.test'));
                t.test('Select',require('./ComponentTests/Select.test'));
                t.test('table',require('./ComponentTests/Table.test'));
                t.test('text',require('./ComponentTests/Text.test'));
                return t.test('textarea',require('./ComponentTests/TextArea.test')).complete.then(function() {
                    return t.test('textfield',require('./ComponentTests/TextField.test')).complete
                })
            }).complete
        }).done()

        //*/
    })

    tests.writeHtml($("#results")[0])

    return tests
}

