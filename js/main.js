define(["jquery", "images", "high_scores", "main_menu", "play_screen", "high_scores_screen", "radio"], function ($, images, highScores, mainMenu, playScreen, highScoresScreen, radio) {
	"use strict";


	function Main() {
		this.context = $("#myCanvas")[0].getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.playScreen = new playScreen.PlayScreen(this.context);
		this.currentScreen = null;

		console.log("registering assetsLoaded listener");
		images.allAssetsLoadedEvent.listen("assetsLoaded", this.allAssetsLoadedCallback.bind(this));
		images.load();

		$(document).on("keydown", function (event) {
			event.preventDefault();
			console.log(event);
			this.currentScreen.handleKeyDown(event);
		}.bind(this));

		highScores.instance = new highScores.HighScores("tetris");
		// Load high scores after assets are loaded.

		radio(highScores.EVENT_HIGH_SCORES_LOADED).subscribe([this.onHighScoresLoaded, this]);
		radio(mainMenu.EVENT_SELECT_HIGH_SCORES).subscribe([this.onSelectHighScores, this]);
		radio(mainMenu.EVENT_SELECT_PLAY).subscribe([this.onSelectPlay, this]);
		radio(playScreen.EVENT_GAME_OVER).subscribe([this.onGameOver, this]);
		radio(highScoresScreen.EVENT_EXIT).subscribe([this.onHighScoresExit, this]);
	}


	Main.prototype.onSelectHighScores = function () {
		this.currentScreen = new highScoresScreen.HighScoresScreen(this.context, highScoresScreen.Mode.SHOW);
		this.currentScreen.run();
	};


	Main.prototype.switchToMainMenu = function () {
		this.currentScreen = new mainMenu.MainMenu(this.context);
		this.currentScreen.run();
	};


	Main.prototype.enterHighScore = function (score, level) {
		this.currentScreen = new highScoresScreen.HighScoresScreen(this.context, highScoresScreen.Mode.ENTER_HIGH_SCORE, score, level);
		this.currentScreen.run();
	};


	Main.prototype.onGameOver = function (scoreAndLine) {
		if (highScores.instance.highScores.length < highScores.MAX_NR_HIGH_SCORES ||
			scoreAndLine.score > highScores.instance.highScores[highScores.MAX_NR_HIGH_SCORES - 1].score) {
			this.enterHighScore(scoreAndLine.score, scoreAndLine.level);
		} else {
			this.switchToMainMenu();
		}
	};


	Main.prototype.onSelectPlay = function () {
		this.currentScreen = this.playScreen;
		this.currentScreen.run();
	};


	Main.prototype.onHighScoresExit = function () {
		this.switchToMainMenu();
	};


	Main.prototype.allAssetsLoadedCallback = function () {
		console.log("main.allAssetsLoadedCallback");
		this.switchToMainMenu();
	};


	Main.prototype.run = function () {
		// Do nothing here, wait till all assets are loaded.
	};


	$(function () {
		var main = new Main();
		main.run();
	});
});
