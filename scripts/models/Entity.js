/*globals canvas, document, window, klass, stage, $ */

// for a entiry layer composition.

var Entity = klass({

	src: "",
	index: 0,
	zIndex: -1,
	static: true,
	coordX: null,
	coordY: null,
	posX: null,				// pos x in pixels
	posY: null,				// pos y in pixels
	elevationOffset: 10,  // the tile elevation

	_width: "",
	_height: "",
	_canvas: "",
	_context: "",
	_image: "",
	_staticIndex: 2,


	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		this._canvas = document.createElement("canvas");
		this._context = this._canvas.getContext('2d');
		$('viewport').appendChild(this._canvas);
	},

	setImage: function (img) {
		this._image = img;
		this._canvas.width = this._width = img.width;
		this._canvas.height = this._height = img.height;

	},

	setCoordinates: function (x, y) {
		this.coordX = x;
		this.coordY = y;
	},

	setElevationOffset: function (elevation) {
		this.elevationOffset = elevation;
	},

	calculate: function (dx, dy, step) {
		this.calculateZIndex();
		this.findTileCenter(dx, dy, step);
	},

	calculateZIndex: function () {
		this._canvas.style.zIndex = this.zIndex = (this.coordX * 10) + this.coordY + this._staticIndex;
	},

	render: function (forceRender) {
		if (!this.static || forceRender !== undefined) {
			this._context.clearRect(
				0,
				0,
				this._width,
				this._height
			);

			this._canvas.style.top = this.posY - (this._height) + 32 - this.elevationOffset;
			this._canvas.style.left = this.posX - (this._width / 2);
			this._context.drawImage(this._image, 0,  0);
		}
	},

	forceRender: function () {
		this.render(true);
	},

	/**
	 * Returns the center of a Tile to given x and y position
	 * @param  {integer} x x-axis position
	 * @param  {integer} y y-axis position
	 * @return {object}
	 */
	findTileCenter: function (dx, dy, step) {
		var xMedPoint,
			yMedPoint,
			x = this.coordX,
			y = this.coordY;

		xMedPoint = dx + ((x - y) * step);
		yMedPoint = dy + (step / 2) + (step * y) + (step / 2 * (x - y));

		this.posX = xMedPoint;
		this.posY = yMedPoint;
	}
});