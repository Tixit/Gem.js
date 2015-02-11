var TextArea = require('../../src/Components/TextArea')

module.exports = function(t) {

	this.test('init',function(t) {
		t.count(3);
		var obj = new TextArea();
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
