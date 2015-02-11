var TextField = require('../../src/Components/TextField')

module.exports = function(t) {
	this.count(1);

	this.test('init',function(t) {
		t.count(3);
		var obj = new TextField();
		obj.on("click",function() {
			t.ok(true);
		});
		obj.on("change",function() {
			t.ok(true);
		});
		this.ok(obj.domNode !== undefined);
		var clickEvent = new Event("click");
		var changeEvent = new Event("change");
		obj.domNode.dispatchEvent(clickEvent);
		obj.domNode.dispatchEvent(changeEvent);
	});
};
