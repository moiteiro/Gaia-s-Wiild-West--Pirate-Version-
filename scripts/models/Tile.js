/*global klass*/

var Tile = klass({
	tileSize: 0,
	scaledTileSize: 0,
	x: 0,					// integer that represents x position em battlefield map array.
	y: 0,					// integer that represents y position em battlefield map array.
	type: null,
	cx: null,
	cy: null,
	centerX: null,
	centerY: null,
	width: null,
	height: null,

	resource: null,		// stores an image that will be render in this tile

	initialize: function (configs) {
		var pos;

		if (configs) {
			Object.extend(this, configs);
		}

	},

	/**
	 * Returns the center of a Tile to given x and y position
	 * @param  {integer} x x-axis position
	 * @param  {integer} y y-axis position
	 * @return {object}
	 */
	findTileCenter: function(dx, dy) {	
		var step = this.scaledTileSize,
			xMedPoint,
			yMedPoint,
			x = this.x,
			y = this.y;

		xMedPoint = dx + ((x - y) * step);
		yMedPoint = dy + (step / 2) + (step * y) + (step / 2 * (x - y));

		return {
			x: xMedPoint,
			y: yMedPoint
		};
	}
});