"use strict";

var Unit = require('deadunit/deadunit.browser')

var Gem = require("../Gem.browser")
Gem.dev = true

module.exports = function() {


    var tests = Unit.test("Testing Gem.js", function(t) {
        this.count(4)
        this.timeout(750*1000) // chrissake its taking a long time now


        //*
        t.test('EventEmitterB',require('./EventEmitterB.test')).complete.then(function(){
            return t.test('Gem',require('./Gem.test')).complete
        }).then(function(){
            return t.test('Style',require('./Style.test')).complete
        }).then(function() {
            return t.test("standard components", function(t) {
                t.count(13)

                // it seems a bit faster when the tests are run sequentially
                t.test('Button',require('./ComponentTests/Button.test')).complete.then(function() {
                    return t.test('Canvas',require('./ComponentTests/Canvas.test')).complete
                }).then(function() {
                    return t.test('CheckBox',require('./ComponentTests/CheckBox.test')).complete
                }).then(function() {
                    return t.test('Block',require('./ComponentTests/Block.test')).complete
                }).then(function() {
                    return t.test('Image',require('./ComponentTests/Image.test')).complete
                }).then(function() {
                    return t.test('List',require('./ComponentTests/List.test')).complete
                }).then(function() {
                    return t.test('MultiSelect',require('./ComponentTests/MultiSelect.test')).complete
                }).then(function() {
                    return t.test('Radio',require('./ComponentTests/Radio.test')).complete
                }).then(function() {
                    return t.test('Select',require('./ComponentTests/Select.test')).complete
                }).then(function() {
                    return t.test('table',require('./ComponentTests/Table.test')).complete
                }).then(function() {
                    return t.test('text',require('./ComponentTests/Text.test')).complete
                }).then(function() {
                    return t.test('textarea',require('./ComponentTests/TextArea.test')).complete
                }).then(function() {
                    return t.test('textfield',require('./ComponentTests/TextField.test')).complete
                })
            }).complete
        }).done()

        //*/
    })

    tests.writeHtml($("#results")[0])

    return tests
}

