/*global klass*/

var Tile = klass({
	empty: false,		// stores if the tile must be render or not.
	tileSize: 0,
	scaledTileSize: 0,
	x: 0,					// integer that represents x position em battlefield map array.
	y: 0,					// integer that represents y position em battlefield map array.
	type: '',
	cx: '',
	cy: '',
	centerX: '',
	centerY: '',
	width: '',
	height: '',
	elevation: '',		// stores the ground elevation
	texture: '',		// stores index of textures list
	resource: '',		// stores an image that will be render in this tile

	// mouse states
	hover: 0,
	active: 0,

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
	findTileCenter: function (dx, dy) {
		var step = this.scaledTileSize,
			xMedPoint,
			yMedPoint,
			x = this.x,
			y = this.y;

		this.centerX = xMedPoint = dx + ((x - y) * step);
		this.centerY = yMedPoint = dy + (step / 2) + (step * y) + (step / 2 * (x - y));

		return {
			x: xMedPoint,
			y: yMedPoint
		};
	},

	render: function (context, image, dx, dy) {
		this.findTileCenter(dx, dy);
		if (!this.empty) {
			this._renderSubsoil(context);
			this._renderTerrain(context, image);
		}
	},

	_renderTerrain: function (context, image) {
		var elevation = this.elevation * this.scaledTileSize / 4;
		context.drawImage(image,  this.centerX - (image.width / 2),  this.centerY - (image.height) + (this.scaledTileSize / 2) - elevation );
	},

	_renderSubsoil: function (context) {
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			posX = this.centerX,
			posY = this.centerY,
			elevation = this.elevation * this.scaledTileSize / 4;

		context.lineWidth = 1;
		context.fillStyle = '#986532';

		context.beginPath();
		context.moveTo(posX - h1, posY - elevation);
		context.lineTo(posX - h1, posY + h2);
		context.lineTo(posX, posY + h1);
		context.lineTo(posX, posY - elevation);
		context.lineTo(posX, posY + h1);
		context.lineTo(posX + h1, posY + h2);
		context.lineTo(posX + h1, posY - elevation);
		context.closePath();

		context.fill();
		context.stroke();
	}
});