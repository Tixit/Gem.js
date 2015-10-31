var testUtils = require('testUtils')
var Block = require("Components/Block")

var Image = require('Components/Image');

module.exports = function() {

    var container = Block()
    testUtils.demo("Image", container)

	this.test('basic usage',function(t) {
		var obj = new Image("https://avatars1.githubusercontent.com/u/149531")
        container.add(obj)

        t.eq(obj.domNode.nodeName, "IMG")

        t.eq(obj.src, "https://avatars1.githubusercontent.com/u/149531")
        t.eq(obj.domNode.src, "https://avatars1.githubusercontent.com/u/149531")

        obj.src = "http://i2.kym-cdn.com/entries/icons/original/000/000/213/robocop-unicorn.jpg"
        t.eq(obj.src, "http://i2.kym-cdn.com/entries/icons/original/000/000/213/robocop-unicorn.jpg")
        t.eq(obj.domNode.src, "http://i2.kym-cdn.com/entries/icons/original/000/000/213/robocop-unicorn.jpg")
	});

    this.test("label argument", function() {
        var img = Image("label", "https://avatars1.githubusercontent.com/u/149531")

        this.eq(img.label, "label")
        this.eq(img.src, "https://avatars1.githubusercontent.com/u/149531")
        this.eq(img.domNode.src, "https://avatars1.githubusercontent.com/u/149531")
    })
};
