var Radio = require('../../src/Components/Radio');

module.exports = function(t) {
	this.count(1);

	this.test('testButtons',function(t) {
		this.count(5);
		var obj = new Radio("group",["button1","button2"]);
		obj.on("change",function(data) {
			t.ok(true);
		});
		obj.on("click",function(data) {
			t.ok(true);
		});
		this.ok($(obj.domNode).children().length == 6);

		var clickEvent = new Event("click");
		$(obj.domNode).children("input")[0].dispatchEvent(clickEvent);
		$(obj.domNode).children("input")[1].dispatchEvent(clickEvent);
	});
};
