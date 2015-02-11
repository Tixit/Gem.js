var Button = require('../../src/Components/Button')

module.exports = function(t) {
	this.count(1);

	this.test('init',function(t) {
		t.count(2);
		var obj = new Button("Label");
		obj.on("click",function() {
			t.ok(true);
		});

		this.ok(obj.domNode !== undefined);

        var clickEvent = new Event("click");
		obj.domNode.dispatchEvent(clickEvent);
	});
};
