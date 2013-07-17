/*globals canvas, document, window, klass, Tile */

var TilePool = klass({
	totalTiles: 200,
	_tilePool: [],
	_tileIndex: 0,

	initialize: function (configs) {
		var i;

		if (configs) {
			Object.extend(this, configs);
		}

		for (i = 0; i < this.totalTiles; ++i) {
			this._tilePool.push(new Tile({index: i}));
		}
	},

	getTile: function () {
		if (this._isFull()) {
			this._addTile();
		}

		return this._tileIndex++;
	},

	killTile: function () {
		this._tileIndex = this._tileIndex === 0 ? 0 : --this._tileIndex;
	},

	/*
	 * Returns whether all the particles in the pool are currently active
	 */
	_isFull: function () {
		return this._tileIndex === this.totalTiles;
	},

	_addTile: function () {
		this.totalTiles++;
		this._tilePool.push(new Tile({index: this.totalTiles}));
	}
});