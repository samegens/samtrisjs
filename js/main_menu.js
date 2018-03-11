define(["key_codes", "radio", "constants", "images", "pieces", "well"], function (keyCodes, radio, constants, images, pieces, well) {
	"use strict";

	var MenuOption = {
			PLAY: 0,
			HIGH_SCORES: 1
		},
		Event = {
			SELECT_HIGH_SCORES: "selectHighScores",
			SELECT_PLAY: "selectPlay"
		},
		OPTIONS_X = constants.CANVAS_WIDTH / 2 - 50,
		OPTIONS_Y = 270,
		OPTIONS_Y_INCR = 30;


	function MainMenu(canvasContext) {
		this.canvasContext = canvasContext;
		this.currentMenuOption = MenuOption.PLAY;
	}

	MainMenu.prototype.renderCallback = function () {
		console.log("MainMenu.renderCallback");
		var ctx = this.canvasContext,
			cursorY = OPTIONS_Y + this.currentMenuOption * OPTIONS_Y_INCR,
			blockSize = images.BLOCK_SIZE,
			i = pieces.i.blockIndex,
			o = pieces.o.blockIndex,
			t = pieces.t.blockIndex,
			z = pieces.z.blockIndex,
			s = pieces.s.blockIndex,
			l = pieces.l.blockIndex,
			j = pieces.j.blockIndex,
			wellContents = [
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, t, t, t,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1, l, l, l,-1, j, j,-1,-1, o, o,-1, l, l,-1,-1, t,-1,-1, j, j, j,-1,-1,-1, i, i, i, i],
				[-1, l,-1,-1,-1, j,-1, i,-1, o, o,-1, z, l,-1,-1, i,-1,-1, i,-1, j,-1, i,-1, j,-1,-1,-1],
				[-1, j, j, j,-1, j, z, i,-1, j, j, z, z, l,-1,-1, i,-1,-1, i, s,-1,-1, i,-1, j, j, j,-1],
				[-1,-1,-1, j,-1, z, z, i,-1, j,-1, z,-1, o, o,-1, i,-1,-1, i, s, s,-1, i,-1,-1,-1, l,-1],
				[ i, i, i, i,-1, z,-1, i,-1, j,-1,-1,-1, o, o,-1, i,-1,-1, i,-1, s,-1, i,-1, l, l, l,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
			],
			w = new well.Well(29, 7, wellContents),
			wellX = (constants.CANVAS_WIDTH - images.BLOCK_SIZE * w.width) / 2,
			wellY = (constants.CANVAS_HEIGHT - images.BLOCK_SIZE * (w.height + 4)) / 2;

		ctx.clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
		w.draw(this.canvasContext, wellX, wellY, false);
		ctx.font = "16px SDSnatcher";
		ctx.fillStyle = "white";
		ctx.fillText("PLAY", OPTIONS_X, OPTIONS_Y + 16);
		ctx.fillText("HIGH SCORES", OPTIONS_X, OPTIONS_Y + 16 + OPTIONS_Y_INCR);

		ctx.drawImage(images.blocks, 0, 0, blockSize, blockSize,
					  OPTIONS_X - images.BLOCK_SIZE - 10, cursorY, blockSize, blockSize);
	};

	MainMenu.prototype.handleKeyDown = function (event) {
		if (event.keyCode === keyCodes.KEYCODE_UP || event.keyCode === keyCodes.KEYCODE_DOWN) {
			if (this.currentMenuOption === MenuOption.HIGH_SCORES) {
				this.currentMenuOption = MenuOption.PLAY;
			} else {
				this.currentMenuOption = MenuOption.HIGH_SCORES;
			}
		} else if (event.keyCode === keyCodes.KEYCODE_SPACE || event.keyCode === keyCodes.KEYCODE_ENTER) {
			switch (this.currentMenuOption) {
			case MenuOption.HIGH_SCORES:
				radio(Event.SELECT_HIGH_SCORES).broadcast();
				return;
			case MenuOption.PLAY:
				radio(Event.SELECT_PLAY).broadcast();
				return;
			default:
				window.alert("unknown menu option " + this.currentMenuOption);
			}
		}

		window.requestAnimationFrame(this.renderCallback.bind(this));
	};

	MainMenu.prototype.run = function () {
		console.log("MainMenu.run");
		window.requestAnimationFrame(this.renderCallback.bind(this));
	};

	return {
		MainMenu: MainMenu,
		EVENT_SELECT_HIGH_SCORES: Event.SELECT_HIGH_SCORES,
		EVENT_SELECT_PLAY: Event.SELECT_PLAY
	};
});
