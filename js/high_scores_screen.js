define(["jquery", "well", "pieces", "images", "high_scores", "constants", "key_codes", "sprintf", "radio"], function ($, well, pieces, images, highScores, constants, keyCodes, sprintf, radio) {
    "use strict";

    var State = {
            RETRIEVING_HIGH_SCORES: 0,
            SHOWING_HIGH_SCORES: 1,
            ENTERING_HIGH_SCORE: 2
        },
        Event = {
            EXIT: "highScores.exit"
        },
        Mode = {
            SHOW: 0,
            ENTER_HIGH_SCORE: 1
        };


    function HighScoresScreen(canvasContext, mode, score, level) {
        this.canvasContext = canvasContext;
        this.mode = mode || Mode.SHOW;
        this.score = score;
        this.level = level;
        this.name = "";
        this.state = State.RETRIEVING_HIGH_SCORES;
    }


    HighScoresScreen.prototype.run = function () {
        console.log("HighScoresScreen.run");
        this.state = State.RETRIEVING_HIGH_SCORES;
        this.scheduleRedraw();

        radio(highScores.EVENT_HIGH_SCORES_LOADED).subscribe([this.onHighScoresLoaded, this]);
		this.onHighScoresLoaded();
    };


    HighScoresScreen.prototype.onHighScoresLoaded = function () {
        console.log("HighScoresScreen.onHighScoresLoaded");
        this.state = State.SHOWING_HIGH_SCORES;
        if (this.mode === Mode.ENTER_HIGH_SCORE) {
            this.enterPos = highScores.instance.insertHighScore(this.score, this.level);
            // If in the mean time more high scores were added which caused the new score to fall off the high
            // score list, set the mode to just show the scores.
            if (this.enterPos >= highScores.MAX_NR_HIGH_SCORES) {
                this.state = State.SHOWING_HIGH_SCORES;
            } else {
                this.state = State.ENTERING_HIGH_SCORE;
            }
        }

        this.scheduleRedraw();
    };


    HighScoresScreen.prototype.renderCallback = function () {
        console.log("HighScoresScreen.renderCallback");
        if (this.state === State.RETRIEVING_HIGH_SCORES) {
            this.renderLoading();
        } else {
            this.renderHighScores();
        }
    };


    HighScoresScreen.prototype.renderLoading = function () {
        var context = this.canvasContext,
            loadingText = "LOADING...",
            loadingTextWidth;

        console.log("HighScoresScreen.renderLoading");

        context.clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
        context.font = "16px SDSnatcher";
        context.fillStyle = "white";
        loadingTextWidth = context.measureText(loadingText).width;
        context.fillText("LOADING...", (constants.CANVAS_WIDTH - loadingTextWidth) / 2, (constants.CANVAS_HEIGHT / 2));
    };


    HighScoresScreen.prototype.renderHighScores = function () {
        var context = this.canvasContext,
            hs = highScores.instance.highScores,
            i,
            line,
            nrHighScores = Math.min(highScores.MAX_NR_HIGH_SCORES, hs.length),
            tableX = 100,
            tableY = 100,
            name,
            enterNameText = "New high score! Enter your name.",
            enterNameWidth = context.measureText(enterNameText).width;

        console.log("HighScoresScreen.renderHighScores");

        context.clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
        context.font = "16px SDSnatcher";
        context.fillStyle = "white";

        this.renderEdge();

        context.fillText("    SCORE   LEVEL  NAME", tableX, tableY);
        for (i = 0; i < nrHighScores; i += 1) {
            line = "";
            if (this.state === State.SHOWING_HIGH_SCORES) {
                line = sprintf.sprintf("%2d  %06d     %2d  %s", i + 1, hs[i].score, hs[i].level, hs[i].name);
            } else if (i === this.enterPos) {
                name = this.name;
                while (name.length < highScores.MAX_NAME_LENGTH) {
                    name += ".";
                }
                line = sprintf.sprintf("%2d  %06d     %2d  %s", i + 1, hs[i].score, hs[i].level, name);

                context.fillText(enterNameText, (constants.CANVAS_WIDTH - enterNameWidth) / 2, tableY + 24 + 19 * i + 30);
            }
            if (line !== "") {
                context.fillText(line, tableX, tableY + 24 + 19 * i);
            }
        }
    };


    HighScoresScreen.prototype.renderEdge = function () {
        var i = pieces.i.blockIndex,
            o = pieces.o.blockIndex,
            t = pieces.t.blockIndex,
            z = pieces.z.blockIndex,
            s = pieces.s.blockIndex,
            l = pieces.l.blockIndex,
            j = pieces.j.blockIndex,
            wellContents = [
                [  i, o, o, t, t, t, s, s, t, j, j, j, i, i, i, i, t, z, z, i, i, i, i, l, j,-1, t, t, t, o, o,-1, t, j, j, j, t,-1, o, o ],
                [  i, o, o,-1, t, s, s, t, t, t,-1, j, t,-1,-1, t, t, t, z, z,-1, l, l, l, j, j, j, t,-1, o, o, t, t, t,-1, j, t, t, o, o ],
                [  i,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, t, t, t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, t,-1, l, l ],
                [  i, z,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, l ],
                [  z, z,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, z, z, l ],
                [  z,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, z, z ],
                [  o, o,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, o, o ],
                [  o, o,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, o, o ],
                [  j, j,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, s,-1 ],
                [  j,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, s, s ],
                [  j,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, t, s ],
                [  t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, t, t, t ],
                [  t, t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, l, l ],
                [  t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, i, l ],
                [  j,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, i, l ],
                [  j, j, j,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, i,-1 ],
                [  l, l, l,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, i, z ],
                [  l,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, z, z ],
                [  o, o,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, z, l ],
                [  o, o,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, l, l, l ],
                [ -1, t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, o, o ],
                [  t, t, t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, j, o, o ],
                [  l, l,-1,-1,-1,-1,-1, t, t, t,-1, j, j,-1, s,-1, l,-1,-1,-1,-1,-1,-1,-1,-1, j, j, z,-1,-1,-1,-1,-1,-1,-1,-1,-1, j, j, j ],
                [ -1, l,-1,-1,-1,-1, o, o, t, o, o, j,-1, t, s, s, l,-1, o, o, t, t, t, s, s, j, z, z, l, l, l,-1, t, t, t, l, l, l, s, s ],
                [ -1, l, i, i, i, i, o, o,-1, o, o, j, t, t, t, s, l, l, o, o,-1, t, s, s,-1, j, z,-1, l, i, i, i, i, t,-1, l,-1, s, s,-1 ]
            ],
            w = new well.Well(40, 25, wellContents);

        w.draw(this.canvasContext, 0, 0, false);
    };


    HighScoresScreen.prototype.scheduleRedraw = function () {
        window.requestAnimationFrame(this.renderCallback.bind(this));
    };


    HighScoresScreen.prototype.handleKeyDown = function (event) {
        if (this.state === State.SHOWING_HIGH_SCORES) {
            radio(highScores.EVENT_HIGH_SCORES_LOADED).unsubscribe(this.onHighScoresLoaded);
            radio(Event.EXIT).broadcast();
        } else if (this.state === State.ENTERING_HIGH_SCORE) {
            if (event.keyCode === keyCodes.KEYCODE_ENTER && this.name.length > 0) {
                this.mode = Mode.SHOW;
                this.state = State.SHOWING_HIGH_SCORES;
                highScores.instance.addHighScore(this.name, this.score, this.level);
            } else if (event.keyCode === keyCodes.KEYCODE_BACKSPACE) {
                if (this.name.length > 0) {
                    this.name = this.name.substring(0, this.name.length - 1);
                }
            } else {
                var c = String.fromCharCode(event.which).toUpperCase();
                if ((c >= "A" && c <= "Z") || (c >= "0" && c <= "9")) {
                    if (this.name.length < highScores.MAX_NAME_LENGTH) {
                        this.name += c;
                    }
                }
            }
            this.scheduleRedraw();
        }
    };

    return {
        HighScoresScreen: HighScoresScreen,
        EVENT_EXIT: Event.EXIT,
        Mode: Mode
    };
});
