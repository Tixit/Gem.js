var buildModule = require("build-modules")
var colors = require("colors/safe")

//var copyright = '/* Copyright (c) 2015 Billy Tetrud - Free to use for any purpose: MIT License*/'

build("blocks")
build("test/blocks.tests", 'blocksTests')


function build(relativeModulePath, name) {
    var emitter = buildModule(__dirname+'/'+relativeModulePath, {watch: true/*, header: copyright*/, name: name, minify: false})
    emitter.on('done', function() {
       console.log((new Date())+" - Done building "+relativeModulePath+"!")
    })
    emitter.on('error', function(e) {
       console.log(e)
    })
    emitter.on('warning', function(w) {
       console.log(colors.grey(w))
    })
}
