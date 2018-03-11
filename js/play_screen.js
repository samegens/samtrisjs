define(["key_codes", "pieces", "well", "constants", "images", "sprintf", "radio"], function (keycodes, pieces, well, constants, images, sprintf, radio) {
    "use strict";

    var WELL_WIDTH = 10,
        WELL_HEIGHT = 20,
        PIT_POS_X = (640 - WELL_WIDTH * images.BLOCK_SIZE) / 2,
        PIT_POS_Y = (400 - WELL_HEIGHT * images.BLOCK_SIZE) / 2,
        State = {
            PLAYING: 0,
            LINE_COMPLETE_BLINK_OFF: 1,
            LINE_COMPLETE_BLINK_ON: 2,
            GAME_OVER: 3
        },
        Event = {
            GAME_OVER: "gameOver"
        },
    // From: http://tetrisconcept.net/wiki/Tetris_(Game_Boy):
        GRAVITY = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3];


    function PlayScreen(canvasContext) {
        this.canvasContext = canvasContext;
        this.reset();
    }


    PlayScreen.prototype.reset = function () {
        this.x = 0;
        this.y = 0;
        this.score = 0;
        this.newScore = 0;
        this.lines = 0;
        this.newLines = 0;
        this.startNewLevel(0);
        this.well = new well.Well(WELL_WIDTH, WELL_HEIGHT);
        this.nextPiece = this.getRandomPiece();
        this.currentPiece = null;
        this.state = State.PLAYING;
        this.autoFallTimerId = null;

        radio(well.EVENT_LINE_COMPLETE).unsubscribe(this.onLineComplete);
        console.log("subscribe to well.EVENT_LINE_COMPLETE");
        radio(well.EVENT_LINE_COMPLETE).subscribe([this.onLineComplete, this]);
    };


    PlayScreen.prototype.startNewLevel = function (level) {
        this.level = level;
        this.gravity = GRAVITY[level];
    };


    PlayScreen.prototype.getRandomPiece = function () {
        var newPiece = pieces.all[Math.floor(Math.random() * pieces.all.length)];
        if (newPiece !== this.nextPiece) {
            return newPiece;
        } else {
            return this.getRandomPiece();
        }
    };


    PlayScreen.prototype.startNewPiece = function () {
        this.currentPiece = this.nextPiece.clone();
        this.nextPiece = this.getRandomPiece();
        console.log("startNewPiece");
        console.log("curr: " + this.currentPiece.toString());
        console.log("next: " + this.nextPiece.toString());

        this.resetAutoFallTimeout();

        this.x = (WELL_WIDTH - 4) / 2;
        this.y = -1;

        if (!this.well.pieceFitsAt(this.currentPiece, this.x, this.y)) {
            this.state = State.GAME_OVER;
            this.unsetAutoFallTimeout();
            this.scheduleRedraw();
        }
    };


    PlayScreen.prototype.setAutoFallTimeout = function () {
        if (this.autoFallTimerId !== null) {
            return;
        }

        this.autoFallTimerId = window.setTimeout(this.onAutoFall.bind(this), 1000 / 60 * this.gravity);
        console.log("setAutoFallTimeout: id = " + this.autoFallTimerId);
    };


    PlayScreen.prototype.unsetAutoFallTimeout = function () {
        if (this.autoFallTimerId !== null) {
            console.log("unsetAutoFallTimeout: id = " + this.autoFallTimerId);
            window.clearTimeout(this.autoFallTimerId);
            this.autoFallTimerId = null;
        }
    };


    PlayScreen.prototype.resetAutoFallTimeout = function () {
        this.unsetAutoFallTimeout();
        this.setAutoFallTimeout();
    };


    PlayScreen.prototype.onAutoFall = function () {
        this.autoFallTimerId = null;

        if (this.well.pieceFitsAt(this.currentPiece, this.x, this.y + 1)) {
            this.y += 1;
        } else {
            this.lockCurrentPiece();
        }

        // Stop auto falling when waiting for something.
        if (this.state === State.PLAYING) {
            this.setAutoFallTimeout();
        }
        this.scheduleRedraw();
    };


    PlayScreen.prototype.lockCurrentPiece = function () {
        if (!this.well.addPiece(this.currentPiece, this.x, this.y)) {
            this.startNewPiece();
            // Otherwise the next piece is started when the animation of blinking the line(s) has finished.
        } else {
            // We have to remove the current piece, because it has been added to the pit and we
            // don't want it to be drawn anymore until we start a new piece.
            this.currentPiece = null;
        }
    };


    PlayScreen.prototype.handleKeyDown = function (event) {
        if (this.state === State.GAME_OVER) {
            radio(Event.GAME_OVER).broadcast({ score: this.score, level: this.level + 1 });
            return;
        }

        if (this.state === State.LINE_COMPLETE_BLINK_ON || this.state === State.LINE_COMPLETE_BLINK_OFF) {
            return;
        }

        if (event.keyCode === keycodes.KEYCODE_LEFT) {
            if (this.well.pieceFitsAt(this.currentPiece, this.x - 1, this.y)) {
                this.x -= 1;
            }
        } else if (event.keyCode === keycodes.KEYCODE_RIGHT) {
            if (this.well.pieceFitsAt(this.currentPiece, this.x + 1, this.y)) {
                this.x += 1;
            }
        } else if (event.keyCode === keycodes.KEYCODE_UP) {
            this.currentPiece.rotateLeft();
            if (!this.well.pieceFitsAt(this.currentPiece, this.x, this.y)) {
                // Kick down?
                if (this.y < 0 && this.well.pieceFitsAt(this.currentPiece, this.x, this.y + 1)) {
                    this.y += 1;
                } else {
                    // Undo rotation.
                    this.currentPiece.rotateRight();
                }
            }
        } else if (event.keyCode === keycodes.KEYCODE_DOWN) {
            if (this.well.pieceFitsAt(this.currentPiece, this.x, this.y + 1)) {
                this.y += 1;
                this.score += 1;
                this.resetAutoFallTimeout();
            }
        } else if (event.keyCode === keycodes.KEYCODE_SPACE) {
            while (this.well.pieceFitsAt(this.currentPiece, this.x, this.y + 1)) {
                this.y += 1;
                this.score += 1;
            }

            this.unsetAutoFallTimeout();

            this.lockCurrentPiece();
        }

        this.scheduleRedraw();
    };


    PlayScreen.prototype.onLineComplete = function (nrLinesComplete) {
        console.log("onLineComplete");
        if (nrLinesComplete === 1) {
            this.newScore = this.score + 40 * (this.level + 1);
        } else if (nrLinesComplete === 2) {
            this.newScore = this.score + 100 * (this.level + 1);
        } else if (nrLinesComplete === 3) {
            this.newScore = this.score + 300 * (this.level + 1);
        } else if (nrLinesComplete === 4) {
            this.newScore = this.score + 1200 * (this.level + 1);
        }

        this.newLines = this.lines + nrLinesComplete;
        this.state = State.LINE_COMPLETE_BLINK_ON;

        // Line complete animation.
        window.setTimeout(this.lineCompleteBlinkOff.bind(this), 250);
        window.setTimeout(this.lineCompleteBlinkOn.bind(this), 500);
        window.setTimeout(this.lineCompleteBlinkOff.bind(this), 750);
        window.setTimeout(this.lineCompleteBlinkDone.bind(this), 1000);
    };


    PlayScreen.prototype.lineCompleteBlinkOff = function () {
        this.state = State.LINE_COMPLETE_BLINK_OFF;
        this.scheduleRedraw();
    };


    PlayScreen.prototype.lineCompleteBlinkOn = function () {
        this.state = State.LINE_COMPLETE_BLINK_ON;
        this.scheduleRedraw();
    };


    PlayScreen.prototype.lineCompleteBlinkDone = function () {
        console.log("lineCompleteBlinkDone");
        this.state = State.PLAYING;
        this.well.removeCompleteLines();
        this.startNewPiece();

        this.score = this.newScore;
        this.lines = this.newLines;

        var newLevel = Math.floor(this.lines / 10);
        if (newLevel > this.level) {
            this.startNewLevel(newLevel);
        }

        this.newScore = 0;
        this.newLines = 0;

        // Resume auto fall.
        this.setAutoFallTimeout();

        this.scheduleRedraw();
    };


    PlayScreen.prototype.run = function () {
        this.reset();
        this.startNewPiece();
        this.setAutoFallTimeout();
        this.scheduleRedraw();
    };


    PlayScreen.prototype.drawNext = function (x, y) {
        var context = this.canvasContext,
            nextSize = context.measureText("NEXT"),
            BOX_WIDTH = 100,
            BOX_HEIGHT = 100,
            topLineLength = (BOX_WIDTH - nextSize.width - 20) / 2;

        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(x + topLineLength + 0.5, y + 0.5);
        context.lineTo(x + 0.5, y + 0.5);
        context.lineTo(x + 0.5, y + BOX_HEIGHT + 0.5);
        context.lineTo(x + BOX_WIDTH + 0.5, y + BOX_HEIGHT + 0.5);
        context.lineTo(x + BOX_WIDTH + 0.5, y + 0.5);
        context.lineTo(x + BOX_WIDTH - topLineLength + 0.5, y + 0.5);
        context.stroke();
        context.fillText("NEXT", x + (BOX_WIDTH - nextSize.width) / 2, y + 8);
        this.nextPiece.drawCentered(context, x + BOX_WIDTH / 2, y + BOX_HEIGHT / 2);
    };


    PlayScreen.prototype.renderCallback = function () {
        console.log("PlayScreen.renderCallback");

        this.renderPlayScreen();
        if (this.state === State.GAME_OVER) {
            this.renderGameOver();
        }
    };


    PlayScreen.prototype.scheduleRedraw = function () {
        window.requestAnimationFrame(this.renderCallback.bind(this));
    };


    PlayScreen.prototype.renderPlayScreen = function () {
        var context = this.canvasContext,
            hideCompleteLines = this.state === State.LINE_COMPLETE_BLINK_OFF;
        context.clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

        context.font = "16px SDSnatcher";
        context.fillStyle = "white";
        context.fillText("SCORE:", 10, 70);
        context.fillText(sprintf.sprintf("%6d", this.score), 100, 70);
        context.fillText("LINES:", 10, 88);
        context.fillText(sprintf.sprintf("%6d", this.lines), 100, 88);
        context.fillText("LEVEL:", 10, 106);
        context.fillText(sprintf.sprintf("%6d", this.level + 1), 100, 106);

        this.drawNext(480, 60);

        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(PIT_POS_X - 0.5, PIT_POS_Y);
        context.lineTo(PIT_POS_X - 0.5, PIT_POS_Y + WELL_HEIGHT * images.BLOCK_SIZE + 0.5);
        context.lineTo(PIT_POS_X + WELL_WIDTH * images.BLOCK_SIZE + 0.5, PIT_POS_Y + WELL_HEIGHT * images.BLOCK_SIZE + 0.5);
        context.lineTo(PIT_POS_X + WELL_WIDTH * images.BLOCK_SIZE + 0.5, PIT_POS_Y);
        context.stroke();
        this.well.draw(context, PIT_POS_X, PIT_POS_Y, hideCompleteLines);

        if (this.currentPiece !== null) {
            this.currentPiece.draw(context, PIT_POS_X + this.x * images.BLOCK_SIZE, PIT_POS_Y + this.y * images.BLOCK_SIZE);
        }
    };


    PlayScreen.prototype.renderGameOver = function () {
        var context = this.canvasContext,
            gameOverSize = context.measureText("GAME OVER"),
            gameOverWidth = gameOverSize.width + 20,
            gameOverHeight = 16 + 20,
            x = (constants.CANVAS_WIDTH - gameOverWidth) / 2,
            y = (constants.CANVAS_HEIGHT - gameOverHeight) / 2;

        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(x, y, gameOverWidth, gameOverHeight);

        context.strokeStyle = "white";
        context.beginPath();
        context.rect(x + 0.5, y + 0.5, gameOverWidth, gameOverHeight);
        context.stroke();
        context.fillStyle = "white";
        context.fillText("GAME OVER", (constants.CANVAS_WIDTH - gameOverWidth) / 2 + 10, (constants.CANVAS_HEIGHT - gameOverHeight) / 2 + 16 + 10);
    };


    return {
        PlayScreen: PlayScreen,
        EVENT_GAME_OVER: Event.GAME_OVER
    };
});
