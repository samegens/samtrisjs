define(["asset_loader", "lib/observable"], function (AssetLoader, Observable) {
	"use strict";

	var images = { },
		assetLoader = { },
		NAME_BLOCKS = "blocks"


	function allAssetsLoadedCallback() {
		console.log("all assets loaded");
		images.blocks = assetLoader.getImage(NAME_BLOCKS);
		images.allAssetsLoadedEvent.fireEvent("assetsLoaded");
	}


	function load() {
		assetLoader = new AssetLoader(allAssetsLoadedCallback);
		assetLoader.registerImage(NAME_BLOCKS, "img/blocks.png");
	}


	images = {
		load: load,
		allAssetsLoadedEvent: new Observable(),
		blocks: null,
		BLOCK_SIZE: 16,
		BLOCK_INDEX_BLUE: 0,
		BLOCK_INDEX_BROWN: 1,
		BLOCK_INDEX_GREEN: 2,
		BLOCK_INDEX_PURPLE: 3,
		BLOCK_INDEX_RED: 4,
		BLOCK_INDEX_WHITE: 5,
		BLOCK_INDEX_YELLOW: 6
	};

	return images;
});
