define(["images"], function (images) {
    "use strict";

    function PieceVariant(blockDefs) {
        this.blockDefs = blockDefs;
    }


    PieceVariant.prototype.draw = function (context, x, y, blockIndex) {
        var row, col, drawX, drawY;
        for (row = 0; row < 4; row += 1) {
            for (col = 0; col < 4; col += 1) {
                if (this.blockDefs[row][col]) {
                    drawX = x + col * images.BLOCK_SIZE;
                    drawY = y + row * images.BLOCK_SIZE;
                    context.drawImage(images.blocks, images.BLOCK_SIZE * blockIndex, 0, images.BLOCK_SIZE, images.BLOCK_SIZE, drawX, drawY, images.BLOCK_SIZE, images.BLOCK_SIZE);
                }
            }
        }
    };


    PieceVariant.prototype.hasBlockAt = function (x, y) {
        return this.blockDefs[y][x] !== 0;
    };


    PieceVariant.prototype.getBoundingBox = function () {
        var top = 4,
            left = 4,
            bottom = -1,
            right = -1,
            x,
            y;

        for (y = 0; y < 4; y += 1) {
            for (x = 0; x < 4; x += 1) {
                if (this.hasBlockAt(x, y)) {
                    top = Math.min(top, y);
                    left = Math.min(left, x);
                    bottom = Math.max(bottom, y);
                    right = Math.max(right, x);
                }
            }
        }

        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right
        };
    };


    PieceVariant.prototype.toString = function () {
        var s = "",
            x,
            y;

        for (y = 0; y < 4; y += 1) {
            if (y !== 0) {
                s += ",";
            }
            for (x = 0; x < 4; x += 1) {
                if (this.hasBlockAt(x, y)) {
                    s += "1";
                } else {
                    s += "0";
                }
            }
        }

        return s;
    };


    function Piece(pieceVariants, blockIndex) {
        this.pieceVariants = pieceVariants;
        this.currentVariantIndex = 0;
        this.blockIndex = blockIndex;
    }


    Piece.prototype.toString = function () {
        return this.pieceVariants[this.currentVariantIndex].toString();
    }


    Piece.prototype.clone = function () {
        return new Piece(this.pieceVariants, this.blockIndex);
    };


    Piece.prototype.rotateRight = function () {
        this.currentVariantIndex -= 1;
        if (this.currentVariantIndex < 0) {
            this.currentVariantIndex = this.pieceVariants.length - 1;
        }
    };


    Piece.prototype.rotateLeft = function () {
        this.currentVariantIndex += 1;
        if (this.currentVariantIndex >= this.pieceVariants.length) {
            this.currentVariantIndex = 0;
        }
    };


    Piece.prototype.draw = function (context, x, y) {
        var pieceVariant = this.pieceVariants[this.currentVariantIndex];
        pieceVariant.draw(context, x, y, this.blockIndex);
    };


    Piece.prototype.drawCentered = function (context, x, y) {
        var pieceVariant = this.pieceVariants[this.currentVariantIndex],
            boundingBox = pieceVariant.getBoundingBox();

        x = x - ((boundingBox.right + boundingBox.left + 1) / 2) * images.BLOCK_SIZE;
        y = y - ((boundingBox.bottom + boundingBox.top + 1) / 2) * images.BLOCK_SIZE;
        pieceVariant.draw(context, x, y, this.blockIndex);
    };


    Piece.prototype.hasBlockAt = function (x, y) {
        return this.pieceVariants[this.currentVariantIndex].hasBlockAt(x, y);
    };


    Piece.prototype.reset = function () {
        this.currentVariantIndex = 0;
    };


    var i1 = new PieceVariant([
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]),
        i2 = new PieceVariant([
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]),
        i = new Piece([i1, i2], images.BLOCK_INDEX_WHITE),

        o1 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]),
        o = new Piece([o1], images.BLOCK_INDEX_RED),

        t1 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]),
        t2 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0]
        ]),
        t3 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 1, 0, 0],
        ]),
        t4 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 0],
        ]),
        t = new Piece([t1, t2, t3, t4], images.BLOCK_INDEX_BROWN),

        z1 = new PieceVariant([
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]),
        z2 = new PieceVariant([
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0]
        ]),
        z = new Piece([z1, z2], images.BLOCK_INDEX_GREEN),

        s1 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0]
        ]),
        s2 = new PieceVariant([
            [1, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ]),
        s = new Piece([s1, s2], images.BLOCK_INDEX_YELLOW),

        j1 = new PieceVariant([
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]),
        j2 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 0, 0]
        ]),
        j3 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 1, 0]
        ]),
        j4 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]),
        j = new Piece([j1, j2, j3, j4], images.BLOCK_INDEX_BLUE),

        l1 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]),
        l2 = new PieceVariant([
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]),
        l3 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [1, 0, 0, 0]
        ]),
        l4 = new PieceVariant([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0]
        ]),
        l = new Piece([l1, l2, l3, l4], images.BLOCK_INDEX_PURPLE);

    return {
        i: i,
        o: o,
        t: t,
        z: z,
        s: s,
        j: j,
        l: l,
        all: [i, o, t, z, s, j, l]
    };
});
