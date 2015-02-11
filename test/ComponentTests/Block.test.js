var Container = require('../../src/Components/Block')
var Text = require("../../src/Components/Text")

module.exports = function(t) {
	this.count(1);

	this.test('init',function(t) {
		t.count(4);
		var obj = new Container([
			Text('a')
		]);
		obj.on("click",function() {
			t.ok(true);
		});
		this.ok(obj.domNode !== undefined);
		this.ok($(obj.domNode).children().length === 1);
		var clickEvent = new Event("click");
		$(obj.domNode)[0].dispatchEvent(clickEvent);
		obj.add(Text('b'));
		obj.add([Text('c')]);
		this.eq($(obj.domNode).children().length , 3);
		//this.eq(obj.getChildren().length, 3); todo: revamp this whole test to not use dom element creation - then this will work
	});
};
