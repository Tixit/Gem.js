

// compares arrays and objects for value equality (all elements and members must match)
exports.equal = function(a,b) {
    if(a instanceof Array) {
        if(!(b instanceof Array))
            return false
        if(a.length !== b.length) {
            return false
        } else {
            return a.reduce(function(previousValue, currentValue, index) {
                return previousValue && exports.equal(currentValue,b[index])
            }, true)
        }
    } else if(a instanceof Object) {
        if(!(b instanceof Object))
            return false

        var aKeys = Object.keys(a)
        var bKeys = Object.keys(b)

        if(aKeys.length !== bKeys.length) {
            return false
        } else {
            for(var n=0; n<aKeys.length; n++) {
                var key = aKeys[n]
                var aVal = a[key]
                var bVal = b[key]

                if(!exports.equal(aVal,bVal)) {
                    return false
                }
            }
            // else
            return true
        }
    } else {
        return a===b
    }
}

// returns a function that should be passed a bunch of functions as its arguments
// each time that function is called, the next function in the list will be called
// example:
/*  var sequenceX = testUtils.sequence()
 var obj = {a:1,b:2,c:3}

 for(var x in obj) {
     sequenceX(function() {
         t.ok(x === 'a')
     },
     function() {
         t.ok(x === 'b')
     },
     function() {
         t.ok(x === 'c')
     })
 }
 */
exports.sequence = function() {
    var n=-1
    return function() {
        var fns = arguments
        n++
        if(n>=fns.length)
            throw new Error("Unexpected call: "+n)
        // else
        fns[n]()
    }
}



var trigger = exports.trigger = function(domNode, event, data) {
    if(data === undefined) data = {}

    var event = new Event(event)
    for(var key in data) {
        event[key] = data[key]
    }
    domNode.dispatchEvent(event)
}

// trigger a simulated keyboard press (should actually get typed into a field)
// note: if a lowercase ASCII code is passed for keyCode, it is automatically shifted to an uppercase code for the keyup and keydown events
    // but does *not* shift everything appropriately (e.g. '7' vs '&' isn't done correctly)
    // refer here for more information: http://unixpapa.com/js/key.html, or just kill yourself (toss up)
var triggerKey = exports.triggerKey = function(domNode, keyCode, options) {
    if(options === undefined) options = {}
    ;['layerX', 'layerY', 'pageX', 'pageY'].forEach(function(k) {
        if(options[k] === undefined)
            options[k] = 0
    })
    ;['ctrlKey', 'altKey', 'metaKey', 'shiftKey'].forEach(function(k) {
        if(options[k] === undefined)
            options[k] = false
    })

    var asciiValue = keyCode
    if(97 <= asciiValue && asciiValue <= 122) {
        var keyCode = asciiValue - (97-65)
    }

    createKeyboardEvent('keydown')
    if(domNode.value !== undefined) {
        domNode.value += String.fromCharCode(asciiValue)
    }
    createKeyboardEvent('keypress')
    createKeyboardEvent('keyup')

    function createKeyboardEvent(type) {
        trigger(domNode, type, {
            altGraphKey: options.altGraphKey,
            altKey: options.altKey,
            bubbles: true,
            button: 0,
            cancelable: true,
            charCode: 0,
            ctrlKey: options.ctrlKey,
            detail: 0,
            keyCode: keyCode,
            keyIdentifier: "U+00"+(keyCode.toString(16)), // this is a guess, but who uses keyIdentifier anyway?
            keyLocation: 0,
            layerX: options.layerX,
            layerY: options.layerY,
            location: 0,
            metaKey: options.metaKey,
            pageX: options.pageX,
            pageY: options.pageY,
            repeat: false,
            shiftKey: options.shiftKey,
            view: window,
            which: keyCode
        })
    }
}

// trigger a simulated mouse click
exports.triggerClick = function(domNode, options) {
    if(options === undefined) options = {}

    ;['clientX', 'clientY', 'layerX', 'layerY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'x', 'y'].forEach(function(k) {
        if(options[k] === undefined)
            options[k] = 0
    })
    ;['ctrlKey', 'altKey', 'metaKey', 'shiftKey'].forEach(function(k) {
        if(options[k] === undefined)
            options[k] = false
    })

    createMouseEvent('mousedown')
    createMouseEvent('mouseup')
    createMouseEvent('click')

    function createMouseEvent(type) {
        trigger(domNode, type, {
            altKey: options.altKey,
            bubbles: true,
            button: 0,
            cancelable: true,
            charCode: 0,
            clientX: options.clientX,
            clientY: options.clientY,
            ctrlKey: options.ctrlKey,
            dataTransfer: null,
            detail: 1,
            fromElement: null,
            keyCode: 0,
            layerX: options.layerX,
            layerY: options.layerY,
            metaKey: options.metaKey,
            offsetX: 22,
            offsetY: 11,
            pageX: options.pageX,
            pageY: options.pageY,
            relatedTarget: null,
            screenX: options.screenX,
            screenY: options.screenY,
            shiftKey: options.shiftKey,
            toElement: domNode,
            view: window,
            which: 1,
            x: options.x,
            y: options.y
        })
    }
}

// simulates typing some text into a dom node (usually an input or text field)
exports.type = function(domNode, text) {
    for(var n in text) {
        triggerKey(domNode, text[n].charCodeAt(0))
    }
}

// returns true if the domNode is the node in focus
// note: a domNode can only be in focus if it attached to the page
exports.inFocus = function(domNode) {
    return domNode === document.activeElement
}


exports.demo = function(name, component) {
    var header = document.createElement("h1")
        header.textContent = name

    $("#demos").append([header, component.domNode]);
}

