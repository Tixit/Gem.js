var Table = require('../../src/Components/Table')
var Label = require("../../src/Components/Label");

module.exports = function(t) {
	this.count(1);

	this.test('init',function(t) {
		t.count(10);
		var obj = new Table();
		this.ok(obj.domNode !== undefined);

		var row1 = obj.addRow();
		this.eq($(obj.domNode).children().length,1);

		this.eq(obj.rowCount(),1);
		var cell1_1 = row1.addCell(new Label("Test text"));
		this.eq($(row1.domNode).children().length,1);

		var row2 = row1.addBefore();
		this.eq($(obj.domNode).children().length,2);
		this.eq(obj.rowCount(),2);
		this.eq($(obj.domNode).children("tr:nth-child(2)").children().length,1);
		this.eq($(obj.domNode).children("tr:nth-child(1)").children().length,0);

		cell1_1.removeSelf();
		this.eq($(row1.domNode).children().length,0);

		row1.removeSelf();
		this.eq(obj.rowCount(),1);
		
    });
};
