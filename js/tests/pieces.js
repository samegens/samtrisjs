define(["QUnit", "../pieces"], function (QUnit, pieces) {
	"use strict";


	QUnit.test("clone", function (assert) {
		assert.equal(pieces.all[0].hasBlockAt(0, 1), true);
		var p = pieces.all[0].clone();
		p.rotateLeft();
		assert.equal(pieces.all[0].hasBlockAt(0, 1), true);
		assert.equal(p.hasBlockAt(0, 1), false);
	});


});
