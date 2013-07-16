/*global klass*/

var Tile = klass({

	zIndex: 0,

	// canvas layer
	_canvas: "",
	_context: "",
	_staticIndex: 1,

	empty: false,			// stores if the tile must be render or not.
	tileSize: 0,
	scaledTileSize: 0,
	x: 0,					// integer that represents x position em battlefield map array.
	y: 0,					// integer that represents y position em battlefield map array.
	type: '',
	centerX: '',
	centerY: '',
	elevation: '',			// stores the ground elevation
	elevationOffset: '',	// stores the ground elevation computed

	// textures
	terrain: '',
	subsoil: '',


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
		canvas.height = this.scaledTileSize * 1.5 + 2 + 1000; /// TODO!!! esse calculo de ser feito de acordo com a elevacao.,
		canvas.setAttribute("data-name", "tile")
		style.zIndex = this.zIndex;

		this._canvas = canvas;
		this._context = context;

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

	render: function (context, terrainTexture, subsoilTexture, dx, dy) {
		this.findTileCenter(dx, dy);
		this.elevationOffset = this.elevation * this.scaledTileSize / 4;

		if (!this.empty) {
			this._renderSubsoil(context, subsoilTexture);
			this._renderTerrain(context, terrainTexture);
			this._renderBorder(context);
			this._calculateZIndex();

			this._canvas.style.top = this.centerY - (this.scaledTileSize / 2) - this.elevationOffset;
			this._canvas.style.left = this.centerX - this.scaledTileSize;
		}
	},

	_renderTerrain: function (context, image) {
		var elevation = this.elevationOffset;
		this._context.drawImage(image, 0, 0);
	},

	_renderSubsoil: function (context, image) {
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			context = this._context,
			elevation = this.elevation,
			elevationOffset = this.elevationOffset;

		context.lineWidth = 0.5;
		context.fillStyle = '#986532';

		context.beginPath();
		context.moveTo(0, h2);
		context.lineTo(0, h1 + elevationOffset); // h1 agora deve ser setado de acordo com a elevation.
		context.lineTo(h1, h1 + h2 + elevationOffset);
		context.lineTo(h1, h2);
		context.lineTo(h1, h1 + h2 + elevationOffset);
		context.lineTo(h1 + h1, h1 + elevationOffset);
		context.lineTo(h1 + h1, h2);
		context.closePath();

		context.fill();
		context.stroke();

		if (elevation) {
			for (var i = 0; i < elevation; i++) {
				this._context.drawImage(image, 0, h2 + (i * h2 / 2) );
			}
		}
	},

	_renderBorder: function (context) {
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			context = this._context,
			elevation = this.elevation;

		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.lineColor;
		context.globalAlpha = 0.25;


		// top
		context.beginPath();
		context.moveTo(0, h2);
		context.lineTo(h1 + 1, h1 + 1);
		context.lineTo(h1 + h1 + 1, h2 + 1);
		context.lineTo(h1, 0);
		context.lineTo(0, h2);
		context.closePath();
		context.stroke();
		// lateral
		// if elevation
		
		if (elevation) {
			context.beginPath();
			context.moveTo(0, h2);
			context.lineTo(0, h2 + ((h2 / 2) * elevation));
			context.lineTo(h1, h2 + h2 + ((h2 / 2) * elevation));
			context.lineTo(h1, h2 + h2 );
			context.moveTo(h1, h2 + h2 + 1 + ((h2 / 2) * elevation));
			context.lineTo(h1 + h1 + 1, h2 + ((h2 / 2) * elevation));
			context.lineTo(h1 + h1 + 1, h2);
			context.stroke();
		}

		context.globalAlpha = 1;
	},

	_calculateZIndex: function () {
		this._canvas.style.zIndex = this.zIndex = (this.x * 10) + this.y + this._staticIndex;
	},
});