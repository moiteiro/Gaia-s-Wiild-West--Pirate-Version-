/*global klass*/

var Tile = klass({

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
		this.extend(configs);
	},

	extend: function (configs) {
		
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

		this.centerX = xMedPoint = dx + ((x - y) * step) - step;
		this.centerY = yMedPoint = dy + (step / 2) + (step * y) + (step / 2 * (x - y)) - (step / 2);

		return {
			x: xMedPoint,
			y: yMedPoint
		};
	},

	/**
	 * Renders the tile textures
	 * @param  {object} context  the canvas context
	 * @param  {array} textures  contains all textures related with the biome
	 * @return {void}
	 */
	render: function (context, textures) {
		if (this.visble) {
			this._renderUnderground(context, textures[this.underground]);
		// 	this._renderTerrainElevation(subsoilTexture);
			this._renderTerrain(context, textures[this.terrain]);
		}
	},

	_renderTerrain: function (context, texture) {
		context.drawImage(texture, this.centerX, this.centerY);
	},

	// _renderTerrainElevation: function (image) {
	// 	var h1 = this.scaledTileSize,
	// 		h2 = this.scaledTileSize / 2,
	// 		context = this._context,
	// 		elevation = this.elevation,
	// 		elevationOffset = this.elevationOffset;

	// 	if (elevation) {
	// 		for (var i = 0; i < elevation; i++) {
	// 			this._context.drawImage(image, 0, h2 + (i * h2 / 2) );
	// 		}
	// 	}
	// },

	_renderUnderground: function (context, texture) {
		// TODO: optimize
		// only render underground for tiles on the border of the map
		var h1 = this.scaledTileSize,
			h2 = this.scaledTileSize / 2,
			elevation = this.elevation,
			elevationOffset = Math.floor(this.elevationOffset);

		context.drawImage(texture, this.centerX, this.centerY + h2);
	},

	// _renderBorder: function (context) {
	// 	var h1 = this.scaledTileSize,
	// 		h2 = this.scaledTileSize / 2,
	// 		elevation = this.elevation;

	// 	context.lineWidth = this.lineWidth;
	// 	context.strokeStyle = this.lineColor;
	// 	context.globalAlpha = 0.25;


	// 	// top
	// 	context.beginPath();
	// 	context.moveTo(0, h2);
	// 	context.lineTo(h1 + 1, h1 + 1);
	// 	context.lineTo(h1 + h1 + 1, h2 + 1);
	// 	context.lineTo(h1, 0);
	// 	context.lineTo(0, h2);
	// 	context.closePath();
	// 	context.stroke();
	// 	// lateral
	// 	// if elevation
		
	// 	if (elevation) {
	// 		context.beginPath();
	// 		context.moveTo(0, h2);
	// 		context.lineTo(0, h2 + ((h2 / 2) * elevation));
	// 		context.lineTo(h1, h2 + h2 + ((h2 / 2) * elevation));
	// 		context.lineTo(h1, h2 + h2 );
	// 		context.moveTo(h1, h2 + h2 + 1 + ((h2 / 2) * elevation));
	// 		context.lineTo(h1 + h1 + 1, h2 + ((h2 / 2) * elevation));
	// 		context.lineTo(h1 + h1 + 1, h2);
	// 		context.stroke();
	// 	}

	// 	context.globalAlpha = 1;
	// },
});


/*
|---------------------------------------------------------------------
| Static Attributes
|---------------------------------------------------------------------
*/


Tile.type = {
	none: 0,
	walkable: 1,
}

/*
|---------------------------------------------------------------------
| Static Methods
|---------------------------------------------------------------------
*/

/**
 * Render the cartesian coordinates of each tile.
 * @param  {object} context  the layer
 * @param  {float} tileSize the size of a tile in isometric form
 * @param  {integer} height   amount of tile on y-axis
 * @param  {integer} width    amount of ile on x-axis
 * @return {void}
 */
Tile.renderPositions = function (context, tileSize, width, height) {
	var dx = 0, dy = 0, x = 0, y = 0;

	for (y = 0; y < height; y++) {
    	for (x = 0; x < width; x++) {

			context.globalAlpha = 1;
			context.fillStyle = "black";
			context.font = "normal 14px helvetica";
			context.fillText("(" + x + "," + y + ")", (dx + tileSize/2) - 12, dy + tileSize/2);
			
			dx += tileSize;
    	}
    	dx = 0;
    	dy += tileSize;
	}
}

Tile.renderBorders = function(context, tileSize, width, height) {
	var dx = 0,
		dy = 0,
		x = 0,
		y = 0;

	for (y = 0; y < height; y++) {
		for (x = 0; x < width; x++) {
		
			context.globalAlpha = 0.25;
			context.strokeRect(dx, dy, tileSize, tileSize);
			dx += tileSize;
		}
		dx = 0;
		dy += tileSize;
	}
}

Tile.renderColorType = function (context, map, tileSize, width, height) {
	var dx = 0,
		dy = 0,
		x = 0,
		y = 0;

	for (y = 0; y < height; y++) {
    	for (x = 0; x < width; x++) {
        	
			context.globalAlpha = 0.5;

			if (map[y][x].type === 1) {
				context.fillStyle = "rgb(167, 148, 189)";
			} else if (map[y][x].type === 5) {
				context.fillStyle = "rgb(108, 4, 225)";
			} else if (map[y][x].type === 0) {
				context.fillStyle = "rgb(142, 91, 201)";
			}
			context.fillRect(dx,dy,tileSize,tileSize);
			
			dx += tileSize;
    	}
    	dx = 0;
    	dy += tileSize;
	}
}

Tile.render = function (context, map, resources, tileSize, width, height, battlefield_dx, battlefield_dy) {
	var x = 0,
		y = 0,
		tile;

	for (y = 0; y < height; y++) {
    	for (x = 0; x < width; x++) {
			tile = map[y][x];

			tile.findTileCenter(battlefield_dx, battlefield_dy);
			tile.render(context, resources.elems);
    	}
	}
}

Tile.renderSelectedPosition = function (context, tileSize, x, y, dx, dy) {
	var shift = 3;

	position = Tile.findTileCenter(x, y, dx, dy, tileSize);
	context.globalAlpha = 0.6;

	context.fillStyle = "rgb(0, 107, 208)";
	// context.shadowColor = '#43656e';
	// context.shadowBlur = 5;
	// context.shadowOffsetY = 5;

	context.fillRect(x * tileSize - shift, y * tileSize - shift ,tileSize,tileSize);
};

Tile.findTileCenter = function (x, y, dx, dy, tileSize) {
	var step = tileSize,
		xMedPoint,
		yMedPoint;

	this.centerX = xMedPoint = dx + ((x - y) * step) - step;
	this.centerY = yMedPoint = dy + (step / 2) + (step * y) + (step / 2 * (x - y)) - (step / 2);

	return {
		x: xMedPoint,
		y: yMedPoint
	};
}