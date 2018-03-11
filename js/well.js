define(["images", "radio"], function (images, radio) {
	"use strict";

	var Event = {
		LINE_COMPLETE: 0
	};

	function Well(width, height, contents) {
		this.width = width;
		this.height = height;
		this.NO_BLOCK = -1;
		if (contents) {
			this.contents = contents;		// grid of block indices.
		} else {
			this.contents = [];
			this.clear();
		}
	}


	Well.prototype.clear = function () {
		var x, y;
		for (y = 0; y < this.height; y += 1) {
			this.contents.push([]);
			for (x = 0; x < this.width; x += 1) {
				this.contents[y][x] = this.NO_BLOCK;
			}
		}
	};


	/**
	 * Add a piece to the well. Triggers the event EVENT_LINE_COMPLETE when one or more lines are complete
	 * after adding the piece.
	 * @param {Piece} piece Piece to add to the well.
	 * @param {int} x Left position in blocks of the piece.
	 * @param {int} y Top position in blocks of the piece.
	 * @return {bool} true if adding the piece resulted in one or more complete lines.
	 */
	Well.prototype.addPiece = function (piece, x, y) {
		var pieceY,
			pieceX,
			pitY,
			pitX;
		for (pieceY = 0; pieceY < 4; pieceY += 1) {
			pitY = y + pieceY;
			for (pieceX = 0; pieceX < 4; pieceX += 1) {
				if (piece.hasBlockAt(pieceX, pieceY)) {
					pitX = x + pieceX;
					this.contents[pitY][pitX] = piece.blockIndex;
				}
			}
		}

		return this.checkCompleteLines();
	};


	Well.prototype.checkCompleteLines = function () {
		var pitY,
			nrLinesComplete = 0;

		for (pitY = 0; pitY < this.height; pitY += 1) {
			if (this.isLineComplete(pitY)) {
				nrLinesComplete += 1;
			}
		}

		if (nrLinesComplete > 0) {
			console.log("broadcast Event.LINE_COMPLETE");
			radio(Event.LINE_COMPLETE).broadcast(nrLinesComplete);
		}

		return nrLinesComplete > 0;
	};


	Well.prototype.removeCompleteLines = function () {
		var copyOffset = 0,
			pitY;

		for (pitY = this.height - 1; pitY >= 0; pitY -= 1) {
			if (this.isLineComplete(pitY)) {
				copyOffset += 1;
			} else if (copyOffset !== 0) {
				this.copyLine(pitY, pitY + copyOffset);
			}
		}

		for (pitY = 0; pitY < copyOffset; pitY += 1) {
			this.clearLine(pitY);
		}
	};


	Well.prototype.copyLine = function (srcY, dstY) {
		var pitX;

		for (pitX = 0; pitX < this.width; pitX += 1) {
			this.contents[dstY][pitX] = this.contents[srcY][pitX];
		}
	};


	Well.prototype.clearLine = function (y) {
		var pitX;

		for (pitX = 0; pitX < this.width; pitX += 1) {
			this.contents[y][pitX] = this.NO_BLOCK;
		}
	};


	Well.prototype.isLineComplete = function (y) {
		var pitX;

		for (pitX = 0; pitX < this.width; pitX += 1) {
			if (!this.hasBlockAt(pitX, y)) {
				return false;
			}
		}

		return true;
	};


	Well.prototype.draw = function (context, x, y, hideCompleteLines) {
		var pitX,
			pitY,
			blockIndex,
			blockSize = images.BLOCK_SIZE;
		for (pitY = 0; pitY < this.height; pitY += 1) {
			if (!hideCompleteLines || !this.isLineComplete(pitY)) {
				for (pitX = 0; pitX < this.width; pitX += 1) {
					blockIndex = this.contents[pitY][pitX];
					if (blockIndex !== this.NO_BLOCK) {
						context.drawImage(images.blocks, blockIndex * blockSize, 0, blockSize, blockSize, x + pitX * blockSize, y + pitY * blockSize, blockSize, blockSize);
					}
				}
			}
		}
	};


	Well.prototype.hasBlockAt = function (x, y) {
		return this.contents[y][x] >= 0;
	};


	Well.prototype.pieceFitsAt = function (piece, x, y) {
		var pieceX,
			pieceY,
			pitX,
			pitY;
		for (pieceY = 0; pieceY < 4; pieceY += 1) {
			pitY = y + pieceY;
			for (pieceX = 0; pieceX < 4; pieceX += 1) {
				if (piece.hasBlockAt(pieceX, pieceY)) {
					pitX = x + pieceX;
					if (pitY < 0 || pitY >= this.height || pitX < 0 || pitX >= this.width) {
						return false;
					}
					if (this.hasBlockAt(pitX, pitY)) {
						return false;
					}
				}
			}
		}

		return true;
	};


	return {
		Well: Well,
		EVENT_LINE_COMPLETE: Event.LINE_COMPLETE
	};
});
