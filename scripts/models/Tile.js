/*global klass*/

var Tile = klass({

	zIndex: 0,

	// canvas layer
	_canvas: "",
	_context: "",
	_div: "",
	_staticIndex: 1,

	visble: true,			// stores if the tile must be render or not.
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
	undergroud: '',


	// mouse states
	hover: 0,
	active: 0,

	// styles
	lineWidth: 1,
	lineColor: 'black',

	initialize: function (configs) {
		var pos;

		this.extend(configs);

		var viewport = $('viewport'),
			canvas = $('tile_render');
			// canvas = document.createElement("canvas"),
			div = document.createElement("div"),
			context = canvas.getContext('2d'),
			style = canvas.style;

		// viewport.appendChild(canvas);
		viewport.appendChild(div);
		// canvas.setAttribute("data-name", "tile")
		div.setAttribute("data-name", "div-tile")
		div.setAttribute("class", "div-tile");
		style.zIndex = this.zIndex;

		this._canvas = canvas;
		this._div = div;
		this._context = context;
	},

	extend: function (configs) {
		
		if (configs) {
			Object.extend(this, configs);
		}

		this._setDimensions();
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

	render: function (terrainTexture, subsoilTexture, undergroudTexture, dx, dy) {
		this.findTileCenter(dx, dy);
		this.elevationOffset = this.elevation * this.scaledTileSize / 4;

		if (this.visble) {
			this._renderUnderground(undergroudTexture);
			this._renderTerrainElevation(subsoilTexture);
			this._renderTerrain(terrainTexture);
			this._renderBorder();
			this._calculateZIndex();

			this._div.style.top = this._canvas.style.top = this.centerY - (this.scaledTileSize / 2) - this.elevationOffset;
			this._div.style.left = this._canvas.style.left = this.centerX - this.scaledTileSize;

			this._transferImageToDiv();
		}
	},

	_renderTerrain: function (image) {
		var elevation = this.elevationOffset;
		this._context.drawImage(image, 0, 0);
	},

	_renderTerrainElevation: function (image) {
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			context = this._context,
			elevation = this.elevation,
			elevationOffset = this.elevationOffset;

		if (elevation) {
			for (var i = 0; i < elevation; i++) {
				this._context.drawImage(image, 0, h2 + (i * h2 / 2) );
			}
		}
	},

	_renderUnderground: function (image) {

		var h1 = this.scaledTileSize,
			h2 = Math.floor(this.scaledTileSize / 2),
			context = this._context,
			elevation = this.elevation,
			elevationOffset = Math.floor(this.elevationOffset);

		this._context.drawImage(image, 0, h2 + elevationOffset);
	},

	_renderBorder: function () {
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

	_setDimensions: function () {
		this.elevationOffset = this.elevation * this.scaledTileSize / 4;
		this._canvas.width = this.scaledTileSize * 2 + 2;
		this._canvas.height = this.scaledTileSize * 2 + 2 + this.elevationOffset;
	},

	_transferImageToDiv: function () {
		this._div.style.width = this.scaledTileSize * 2 + 1;
		this._div.style.height = this.scaledTileSize * 2 + 1 + this.elevationOffset;

		dataURL = this._canvas.toDataURL("image/png");
		this._div.style.background = "url("+dataURL+")";
		this._context.clearRect(0, 0, 200, 200);
	},

	_calculateZIndex: function () {
		this._canvas.style.zIndex = this.zIndex = (this.x * 10) + this.y + this._staticIndex;
		this._div.style.zIndex = this.zIndex = (this.x * 10) + this.y + this._staticIndex;
	}
});