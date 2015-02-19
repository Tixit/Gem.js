var proto = require('proto')
var Future = require("async-future")

var testUtils = require('./testUtils')
var blocks = require("../blocks")
var Block = blocks.Block

var Text = blocks.Text
var Button = blocks.Button



module.exports = function(t) {


    //*
    //this.count(3);

	this.test('testEvent',function(t) {
        this.count(2);
		var obj = new Button("some text");
		obj.on("click",function(data) {
			t.ok(true);
			t.ok(data.obj === "blah");
		});
		obj.emit("click",{obj:"blah"});
	});

    this.test('add, addAt, addBefore', function() {
		this.count(5);
        var C = proto(Block, function(superclass) {
            this.name = 'addTest'
            this.init = function() {
                superclass.init.call(this) // set style with constructor
            }
        })

        this.test('add', function() {
            var x = C()

            x.add(Text('a'))
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            x.add(Text('x', 'b'))
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.add([Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            this.eq(x.domNode.children[2].textContent , 'c')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'd')
            this.eq(x.children[3].domNode , x.domNode.children[3])

        })

        this.test('addAt', function() {
            var x = C()

            x.addAt(0, Text('a'))
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            x.addAt(0, Text('x', 'b'))
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'a')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.addAt(1, [Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'c')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'a')
            this.eq(x.children[3].domNode , x.domNode.children[3])
        })

        this.test('addBefore', function() {
            var x = C()

            var one = Text('a')
            x.addBefore(undefined, one)
            this.eq(x.domNode.children.length, 1)
            this.eq(x.children.length, 1)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode.textContent , 'a')

            var two = Text('x', 'b')
            x.addBefore(one, two)
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'a')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            x.addBefore(one, [Text('c'), Text('x', 'd')])
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'b')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'c')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'a')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            x.addBefore(undefined, Text('e'))
            this.eq(x.domNode.children.length, 5)
            this.eq(x.children.length, 5)
            this.eq(x.domNode.children[4].textContent , 'e')
            this.eq(x.children[4].domNode , x.domNode.children[4])
        })

        this.test('remove', function() {
            var C = proto(Block, function(superclass) {
                this.name = 'removeTest'

                this.init = function() {
                    superclass.init.call(this) // set style with constructor
                }
            })

            var x = C()

            var zero = Text('a')
            var one = Text('b')
            var two = Text('c')
            var three = Text('d')
            var four = Text('e')
            x.add(zero,one,two,three,four)

            this.eq(zero.parent, x)
            this.eq(one.parent, x)
            this.eq(two.parent, x)
            this.eq(three.parent, x)
            this.eq(four.parent, x)

            x.remove(2)
            this.eq(two.parent, undefined)
            this.eq(x.domNode.children.length, 4)
            this.eq(x.children.length, 4)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'b')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'd')
            this.eq(x.children[2].domNode , x.domNode.children[2])
            this.eq(x.domNode.children[3].textContent , 'e')
            this.eq(x.children[3].domNode , x.domNode.children[3])

            x.remove(one)
            this.eq(one.parent, undefined)
            this.eq(x.domNode.children.length, 3)
            this.eq(x.children.length, 3)
            this.eq(x.domNode.children[0].textContent , 'a')
            this.eq(x.children[0].domNode, x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'd')
            this.eq(x.children[1].domNode , x.domNode.children[1])
            this.eq(x.domNode.children[2].textContent , 'e')
            this.eq(x.children[2].domNode , x.domNode.children[2])

            x.remove(zero)
            this.eq(zero.parent, undefined)
            this.eq(x.domNode.children.length, 2)
            this.eq(x.children.length, 2)
            this.eq(x.domNode.children[0].textContent , 'd')
            this.eq(x.children[0].domNode , x.domNode.children[0])
            this.eq(x.domNode.children[1].textContent , 'e')
            this.eq(x.children[1].domNode , x.domNode.children[1])

            // what's left is three and four
            x.remove([0, four])
            this.eq(three.parent, undefined)
            this.eq(four.parent, undefined)
            this.eq(x.domNode.children.length, 0)
            this.eq(x.children.length, 0)
        })

		this.test('setting parent',function() {
			this.count(2);
			var C = proto(Block, function(superclass) {
                this.name = 'parent'

                this.init = function() {
                    superclass.init.call(this)
                }
            })

			var C2 = proto(Block, function(superclass) {
                this.name = 'child'

                this.init = function() {
                    superclass.init.call(this)
                }
            })

			var parent = C();
			var child = C2();
			this.eq(child.parent,undefined);
			parent.add(child);
			this.eq(child.parent,parent);
			
		})
    })
	
	this.test('testBubbledEvent',function(t) {
		this.count(2);

        var Button = require('Components/Button');

        var BubbleTester = proto(Block,function(superclass) {
            this.name = 'BubbleTester'

            this.init = function() {
                superclass.init.call(this) // superclass constructor
                var that = this

                var button = new Button("Test button");
                this.button = button;
                this.add(button);
            }
			
			this.setBubble = function() {
                this.bubble(this.button);
			}
        })

		var obj = new BubbleTester();
		obj.setBubble();
		obj.on("click",function(data) {
			t.ok(true);
		});
		var clickEvent = new Event("click");
		$(obj.button.domNode)[0].dispatchEvent(clickEvent);
		
		obj = new BubbleTester();
		obj.on("click",function(data) {
			t.ok(true);
		});
		obj.setBubble();
		var clickEvent = new Event("click");
		$(obj.button.domNode)[0].dispatchEvent(clickEvent);
	});


    //*/
}

