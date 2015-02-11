var Text = require('../../src/Components/Text');

module.exports = function(t) {

	this.test('init',function(t) {
		t.count(2);
		var obj = new Text();
		t.eq(obj.text,"");
		obj.text = "   "
		$("body").append(obj.domNode);
		t.ok(obj.domNode.offsetWidth > 0);
	});
};
