define(function () {
	"use strict";


	function AssetLoader(allAssetsLoadedCallback) {
		this.callback = allAssetsLoadedCallback;
		this.images = {};
		this.nrImagesRegistered = 0;
		this.nrImagesLoaded = 0;

		this.imageLoadedCallback = function () {
			this.nrImagesLoaded += 1;
			if (this.nrImagesLoaded === this.nrImagesRegistered) {
				this.callback();
			}
		};

		this.registerImage = function (name, src) {
			this.images[name] = new Image();
			this.images[name].src = src;
			this.images[name].onload = this.imageLoadedCallback.bind(this);
			this.nrImagesRegistered += 1;
		};

		this.getImage = function (name) {
			return this.images[name];
		};
	}


	return AssetLoader;
});
