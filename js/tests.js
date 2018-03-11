require.config({
	baseUrl : 'js',
	paths : {
		"jquery" : "lib/jquery.min",
		'QUnit' : 'http://code.jquery.com/qunit/qunit-1.15.0',
		"sprintf" : "lib/sprintf",
		"radio" : "lib/radio.min"
	},
	shim : {
		'QUnit' : {
			exports : 'QUnit',
			init : function () {
				QUnit.config.autoload = false;
				QUnit.config.autostart = false;
			}
		}
	}
});

require(["QUnit", "tests/well", "tests/pieces", "tests/high_scores"], function (QUnit, wellTest, piecesTest, highScoresTest) {
	QUnit.load();
	QUnit.start();
});
