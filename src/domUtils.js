

// creates a dom element optionally with a class and attributes
 var node = module.exports.node = function(type, className, options) {
    var elem = document.createElement(type)

    if(options !== undefined) {
        if(options.attr !== undefined) {
            for(var attribute in options.attr) {
                createAttribute(elem, attribute, options.attr[attribute])
            }
        }
        if(options.textContent !== undefined) {
            elem.textContent = options.textContent
        }
    }

    if(className !== undefined)
        elem.className = className

    return elem
}

// convenience function for creating a div
module.exports.div = function(className, options) {
    return node('div', className, options)
}

// adds an attribute to a domNode
var setAttribute = module.exports.setAttribute = function(/*[domNode,] type, value*/) {
    if (arguments.length === 2) {
        var domNode = this.domNode;
        var type = arguments[0];
        var value = arguments[1];
    } else if (arguments.length === 3) {
        var domNode = arguments[0];
        var type = arguments[1];
        var value = arguments[2];
    } else {
        throw new Error("This function expects arguments to be: [domNode,] type, value");
    }
    var attr = document.createAttribute(type)
    attr.value = value
    domNode.setAttributeNode(attr)
}


// sets the selection
//
// works for contenteditable elements
exports.setSelection = function(node, start, end) {
    // memoize
    if (window.getSelection && document.createRange) {
        exports.setSelection = function(containerEl, start, end) {
            var charIndex = 0, range = document.createRange();
            range.setStart(containerEl, 0);
            range.collapse(true);
            var nodeStack = [containerEl], node, foundStart = false, stop = false;

            while (!stop && (node = nodeStack.pop())) {
                if (node.nodeType == 3) {
                    var hiddenCharacters = findHiddenCharacters(node, node.length)
                    var nextCharIndex = charIndex + node.length - hiddenCharacters;

                    if (!foundStart && start >= charIndex && start <= nextCharIndex) {
                        var nodeIndex = start-charIndex
                        var hiddenCharactersBeforeStart = findHiddenCharacters(node, nodeIndex)
                        range.setStart(node, nodeIndex + hiddenCharactersBeforeStart);
                        foundStart = true;
                    }
                    if (foundStart && end >= charIndex && end <= nextCharIndex) {
                        var nodeIndex = end-charIndex
                        var hiddenCharactersBeforeEnd = findHiddenCharacters(node, nodeIndex)
                        range.setEnd(node, nodeIndex + hiddenCharactersBeforeEnd);
                        stop = true;
                    }
                    charIndex = nextCharIndex;
                } else {
                    var i = node.childNodes.length;
                    while (i--) {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }

            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection) {
        exports.setSelection = function(containerEl, start, end) {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(containerEl);
            textRange.collapse(true);
            textRange.moveEnd("character", end);
            textRange.moveStart("character", start);
            textRange.select();
        };
    }

    var findHiddenCharacters = function(node, beforeCaretIndex) {
        var hiddenCharacters = 0
        var lastCharWasWhiteSpace=true
        for(var n=0; n-hiddenCharacters<beforeCaretIndex &&n<node.length; n++) {
            if([' ','\n','\t','\r'].indexOf(node.textContent[n]) !== -1) {
                if(lastCharWasWhiteSpace)
                    hiddenCharacters++
                else
                    lastCharWasWhiteSpace = true
            } else {
                lastCharWasWhiteSpace = false
            }
        }

        return hiddenCharacters
    }

    exports.setSelection(node, start, end)
}

// gets the character offsets of a selection within a particular dom node
exports.getCaretOffset = function (node) {
    // memoize
    if(typeof window.getSelection != "undefined") {
        exports.getCaretOffset = function (element) {
            if (window.getSelection().type === "None" || window.getSelection().rangeCount === 0)
                return 0;

            var range = window.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            return preCaretRange.toString().length;
        }
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        exports.getCaretOffset = function (element) {
            var textRange = document.selection.createRange();
            var preCaretTextRange = document.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            return preCaretTextRange.text.length;
        }
    }

    return exports.getCaretOffset(node);
}