/*globals canvas, document, window, klass, Entity */

var EntityPool = klass({
	totalEntities: 20,
	_entityPool: [],
	_entityIndex: 0,

	initialize: function (configs) {
		var i;

		if (configs) {
			Object.extend(this, configs);
		}

		for (i = 0; i < this.totalEntities; ++i) {
			this._entityPool.push(new Entity({index: i}));
		}

		console.log("initialize pool");
	},

	getEntity: function () {
		if (this._isFull()) {
			this._addEntity();
		}

		return this._entityIndex++;
	},

	killEntity: function () {
		this._entityIndex = this._entityIndex === 0 ? 0 : --this._entityIndex;
	},

	/*
	 * Returns whether all the particles in the pool are currently active
	 */
	_isFull: function () {
		return this._entityIndex === this.totalEntities;
	},

	/*
	 * Takes a dormant particle out of the pool and makes it active.
	 * Does nothing if there is no free particle availabe
	 */
	_addEntity: function () {
		this.totalEntities++;
		this._entityPool.push(new Entity({index: this.totalEntities}));
	}
});