define(["QUnit", "../high_scores"], function (QUnit, highScores) {
    "use strict";


    QUnit.test("addHighScore", function (assert) {
		highScores.instance = new highScores.HighScores("tetris");

        var i;
        for (i = 0; i < 20; i += 1) {
			highScores.instance.insertHighScore(i, 1);
            highScores.instance.addHighScore("SAM", i, 1);
        }

        assert.equal(highScores.instance.highScores.length, highScores.MAX_NR_HIGH_SCORES);
    });
});
