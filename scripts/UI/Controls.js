/*globals window, document, klass, utils*/

var Controls = klass({

	canvas: "",

	battleField: {
		offsetX: 0,
		offsetY: 0,
		width: 0,
		height: 0,
		dx: 0,
		dy: 0,
		x: null,
		y: null
	},

	tileSize: 0,
	scaledTileSize: 0,

	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		utils.addListener(document.body, 'click', this.handleClick.bind(this));
		utils.addListener(document.body, 'mousemove', this.handleMouseMove.bind(this));
	},

	setBattleFieldAttributes: function (obj) {
		Object.extend(this.battleField, obj);
	},


	handleClick: function (e) {
		this._cursorOnTheMap(e.clientX, e.clientY);
	},

	handleMouseMove: function (e) {
		var pos = this._cursorOnTheMap(e.clientX, e.clientY);
		this.battleField.x = pos !== undefined ? pos.x : null;
		this.battleField.y = pos !== undefined ? pos.y : null;
	},

	/**
	 * Returns Map Coord where the mouse is hovering
	 * @return {[type]} [description]
	 */
	getMapMouseCoord: function () {
		return {
			x: this.battleField.x,
			y: this.battleField.y
		};
	},

	_cursorOnTheMap: function (clientX, clientY) {
		var col = (clientY - this.battleField.offsetY) * 2;
		col = ((this.battleField.offsetX + col) - clientX) / 2;

		var row = ((clientX + col) - this.scaledTileSize) - this.battleField.offsetX + 63;

		row = Math.floor(row / this.scaledTileSize);
		col = Math.floor(col / this.scaledTileSize);

		if (row >= 0 && col >= 0 && row <= (this.battleField.width - 1) && col <= (this.battleField.height - 1)) {
			return {
				x: row,
				y: col
			};
		}
		return;	
	}

});