var Label = require('../../src/Components/Label')

module.exports = function(t) {
	this.count(1);

	this.test('init',function(t) {
		var obj = new Label("Label");
		obj.on("click",function() {
			t.ok(true);
		});
		obj.on("change",function() {
			t.ok(true);
		});
		var clickEvent = new Event("click");
		var changeEvent = new Event("change");
		this.ok(obj.domNode !== undefined);
		$(obj.domNode)[0].dispatchEvent(clickEvent);
	});
};
