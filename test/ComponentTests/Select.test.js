var Select = require('../../src/Components/Select')

module.exports = function(t) {
	this.count(1);

	this.test('init',function(t) {
		var obj = new Select([{value:1,text:"Opt1"},{value:2,text:"Opt2"}],false);
		obj.on("change",function(data) {
			t.ok(data.value == "2");
		});
		this.ok(obj.domNode !== undefined);

		this.eq(obj.value() , "1");
		obj.setValue(2);
		this.eq(obj.value() , "2");
		
		var changeEvent = new Event("change");
		var clickEvent = new Event("click");
	    obj.domNode.dispatchEvent(changeEvent);
	});
};
