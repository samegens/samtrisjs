define(["QUnit", "../well"], function (QUnit, well) {
	"use strict";


	function toWellContents(text) {
		var contents = [],
			textParts = text.split(","),
			i,
			j;
		for (i = 0; i < textParts.length; i += 1) {
			contents.push([]);
			for (j = 0; j < textParts[i].length; j += 1) {
				contents[i][j] = textParts[i][j] === "1" ? 1 : -1;
			}
		}

		return contents;
	}


	function fromWellContents(well) {
		var pitX,
			pitY,
			text = '';

		for (pitY = 0; pitY < well.height; pitY += 1) {
			if (pitY > 0) {
				text += ",";
			}
			for (pitX = 0; pitX < well.width; pitX += 1) {
				if (well.hasBlockAt(pitX, pitY)) {
					text += "1";
				} else {
					text += "0";
				}
			}
		}

		return text;
	}
	
	
	QUnit.test("testHelpers", function (assert) {
		var w = new well.Well(2, 3, toWellContents("11,11,11"));
		assert.equal(fromWellContents(w), "11,11,11");

		w = new well.Well(2, 3, toWellContents("00,00,00"));
		assert.equal(fromWellContents(w), "00,00,00");
	});


	QUnit.test("isLineComplete", function (assert) {
		var w = new well.Well(2, 3, toWellContents("11,01,10"));
		assert.equal(w.isLineComplete(0), true);
		assert.equal(w.isLineComplete(1), false);
		assert.equal(w.isLineComplete(2), false);
	});
	

	QUnit.test("removeCompleteLines", function (assert) {
		var w = new well.Well(2, 3, toWellContents("11,11,11"));
		w.removeCompleteLines();
		assert.equal(fromWellContents(w), "00,00,00");

		w = new well.Well(2, 3, toWellContents("01,01,01"));
		w.removeCompleteLines();
		assert.equal(fromWellContents(w), "01,01,01");

		w = new well.Well(2, 3, toWellContents("11,01,11"));
		w.removeCompleteLines();
		assert.equal(fromWellContents(w), "00,00,01");

		w = new well.Well(2, 3, toWellContents("01,11,11"));
		w.removeCompleteLines();
		assert.equal(fromWellContents(w), "00,00,01");
	});

});
