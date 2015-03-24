/*global klass, Tile, Entity, EntityPool, Layer, utils, window, document */

var ActionGrid = klass({

	tileSize: 0,
	scaledTileSize: 0,

	dx: 0,
	dy: 0,

	_layer: null,
	_map: null,

	_selectedTile: {
		x: 4,
		y: 4,
	},

	_updateDelayInterval:10,
	_updateDelayCount: 0,
	_updateAccelerationReset: false,
	_updateAcceleration: 0,
	_updateTopAccelartion: 5,


	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		this.tileSize = gww.tileSize;
		this.scaledTileSize = gww.scaledTileSize;
		this.layer = new Layer({zIndex: 2, isometric: false, name: "actionGrid"});
		this.context = this.layer.getContext();

		utils.addListener(window, 'resize', this.forceRender.bind(this))

		this.setStartPosition(4, 4);
		this.forceRender();
	},

	setStartPosition: function (x, y) {
		this._selectedTile.x = x;
		this._selectedTile.y = y;
	},

	render: function (frame) {
		this.frameCount = frame;
		if (this._forceRender) {
			this.renderSelectedTile();
		}
		this._forceRender = false;
	},


	forceRender: function () {
		this._forceRender = true;
	},

	renderSelectedTile: function () {

		this.layer.clear();
		this.layer.save();
		this.layer.translate(this.dx, this.dy);
		this.layer.isometricMode();

		Tile.renderSelectedPosition(this.context, this.tileSize, this._selectedTile.x, this._selectedTile.y, this.dx, this.dy)
		
		this.layer.restore();
	},

	getInput: function (input) {
		

		if (this._updateDelayCount + this._updateAcceleration > this._updateDelayInterval) {
			this.move(input.left, input.up, input.right, input.down);

			// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			// only render if the position change
			this.forceRender();

			this._updateDelayCount = 0;
		}

		this._updateDelayCount++;
	},

	getMapShift: function () {
		return {
			dx: this.dx,
			dy: this.dy
		};
	},


	/*
	|---------------------------------------------------------------------
	| Move
	|---------------------------------------------------------------------
	*/

	moveDown: function () {
		this.dy -= this.scaledTileSize;
		this._selectedTile.y++;
		this._selectedTile.x++;
	},

	moveUp: function () {
		this.dy += this.scaledTileSize;
		this._selectedTile.y--;
		this._selectedTile.x--;
	},

	moveLeft: function () {
		this.dx += this.scaledTileSize * 2;
		this._selectedTile.y++;
		this._selectedTile.x--;
	},

	moveRight: function () {
		this.dx -= this.scaledTileSize * 2;
		this._selectedTile.y--;
		this._selectedTile.x++;
	},

	moveUpRight: function () {
		this.dx -= this.scaledTileSize;
		this.dy += this.scaledTileSize / 2;
		this._selectedTile.y--;
	},

	moveUpLeft: function () {
		this.dy += this.scaledTileSize / 2;
		this.dx += this.scaledTileSize;
		this._selectedTile.x--;
	},

	moveDownRight: function () {
		this.dy -= this.scaledTileSize / 2;
		this.dx -= this.scaledTileSize;
		this._selectedTile.x++;
	},

	moveDownLeft: function () {
		this.dy -= this.scaledTileSize / 2;
		this.dx += this.scaledTileSize;
		this._selectedTile.y++;
	},

	move: function (left, up, right, down) {
		if (!left && !up && !right && !down)
			this._resetMovementAcceleration();
		else
			this._increaseMovementAcceleration();

		if (up && right) { this.moveUpRight(); return; }
		if (up && left) { this.moveUpLeft(); return; }
		if (down && right) { this.moveDownRight(); return; }
		if (down && left) { this.moveDownLeft(); return; }
		if (left) this.moveLeft();
		if (up) this.moveUp();
		if (right) this.moveRight();
		if (down) this.moveDown();
	},

	_increaseMovementAcceleration: function () {
		if (this._updateTopAccelartion > this._updateAcceleration) {
			this._updateAcceleration++;
		}
	},

	_resetMovementAcceleration: function () {
		this._updateAcceleration = 0;
	}

});


