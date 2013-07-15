/*global klass*/

var Tile = klass({

	zIndex: 0,
	fixed: false,
	isometric: false,

	// TODO: ver como usar porque agora cada tile sera um layer
	translateX: 0,
	translateY: 0,

	// canvas layer
	canvas: "",
	context: "",
	_staticIndex: 1000,

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
	elevation: '',			// stores the ground elevation
	elevationOffset: '',	// stores the ground elevation computed
	texture: '',			// stores index of textures list
	resource: '',			// stores an image that will be render in this tile

	// mouse states
	hover: 0,
	active: 0,

	// styles
	lineWidth: 1,
	lineColor: 'black',

	initialize: function (configs) {
		var pos;

		if (configs) {
			Object.extend(this, configs);
		}

		var viewport = $('viewport'),
			canvas = document.createElement("canvas"),
			context = canvas.getContext('2d'),
			style = canvas.style;

		viewport.appendChild(canvas);
		canvas.width = this.scaledTileSize * 2 + 2;
		canvas.height = this.scaledTileSize * 1.5 + 2;
		canvas.setAttribute("data-name", "tile")
		style.zIndex = this.zIndex;

		this.canvas = canvas;
		this.context = context;

	},

	/**
	 * Returns the center of a Tile to given x and y position
	 * @param  {integer} x x-axis position
	 * @param  {integer} y y-axis position
	 * @return {object}
	 */
	findTileCenter: function (dx, dy) {
		var step = Math.ceil(this.scaledTileSize),
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
		this.elevationOffset = this.elevation * this.scaledTileSize / 4;
		if (!this.empty) {
			this._renderSubsoil(context);
			this._renderTerrain(context, image);
			this._renderBorder(context);
			this._calculateZIndex();

			this.canvas.style.top = this.centerY - (this.scaledTileSize / 2);
			this.canvas.style.left = this.centerX - this.scaledTileSize;
		}
	},

	_renderTerrain: function (context, image) {
		var elevation = this.elevationOffset;
		// context.drawImage(image,  this.centerX - (image.width / 2),  this.centerY - (image.height) + (this.scaledTileSize / 2) - elevation );
		this.context.drawImage(image, 0, 0);
	},

	_renderSubsoil: function (context) {
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			posX = this.centerX,
			posY = this.centerY,
			context = this.context,
			elevation = this.elevationOffset;

		context.lineWidth = 0.5;
		context.fillStyle = '#986532';

		context.beginPath();
		context.moveTo(0, h2);
		context.lineTo(0, h1); // h1 agora deve ser setado de acordo com a elevation.
		context.lineTo(h1, h1 + h2);
		context.lineTo(h1, h2);
		context.lineTo(h1, h1 + h2);
		context.lineTo(h1 + h1, h1);
		context.lineTo(h1 + h1, h2);
		context.closePath();

		context.fill();
		context.stroke();
	},

	_renderBorder: function (context) {
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			posX = this.centerX,
			posY = this.centerY,
			context = this.context,
			elevation = this.elevationOffset;

		posY -= elevation;

		context.fillStyle = "transparent";
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.lineColor;
		context.globalAlpha = 0.25;


		context.beginPath();
		context.moveTo(0, h2);
		context.lineTo(h1 + 1, h1 + 1);
		context.lineTo(h1 + h1 + 1, h2 + 1);
		context.lineTo(h1, 0);
		context.closePath();

		context.fill();
		context.stroke();

		context.globalAlpha = 1;
	},

	_calculateZIndex: function () {
		this.canvas.style.zIndex = this.zIndex = (this.x * 10) + this.y + this._staticIndex;
	},
});