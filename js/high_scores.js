define(["jquery", "radio"], function ($, radio) {
   "use strict";

    var MAX_NR_HIGH_SCORES = 10;


    function HighScores(gameId) {
        this.gameId = gameId;
        this.highScores = [];
    }


	/**
	 * addHighScore finalizes the unnamed highscore by setting the name.
	 */
    HighScores.prototype.addHighScore = function (name, score, level) {
        var i;
        for (i = 0; i < this.highScores.length; i += 1) {
            if (!this.highScores[i].name) {
                this.highScores[i].name = name;
            }
        }
    };


    /**
	 * insertHighScore inserts an unnamed highscore into this.highScores.
     * @param score Number score to add
     * @param level Number level to add
     * @returns {Number} index in the high score list
     */
    HighScores.prototype.insertHighScore = function (score, level) {
        var enterPos = this.getNewHighScoreIndex(score);
		var toRemove = 0;
		if (this.highScores.length == MAX_NR_HIGH_SCORES) {
			toRemove = 1;
		}
        this.highScores.splice(enterPos, toRemove, { score: score, level: level});
        return enterPos;
    };


    HighScores.prototype.getNewHighScoreIndex = function (score) {
        var i;
        for (i = 0; i < this.highScores.length; i += 1) {
            if (score > this.highScores[i].score) {
                return i;
            }
        }

        return this.highScores.length;
    };


    return {
        HighScores: HighScores,
        instance: null,
        MAX_NR_HIGH_SCORES: MAX_NR_HIGH_SCORES,
        MAX_NAME_LENGTH: 8,
        EVENT_HIGH_SCORES_LOADED: Event.HIGH_SCORES_LOADED
    };
});
