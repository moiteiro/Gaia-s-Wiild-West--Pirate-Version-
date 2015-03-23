/*globals window, document, klass, utils*/

var Controls = klass({

	that: this,

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

	_manager: {
		moveLeft: false,
		moveUp: false,
		moveRight: false,
		moveDown: false,
	},

	_command: {
		moveLeft: false,
		moveUp: false,
		moveRight: false,
		moveDown: false,
	},

	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		// utils.addListener(document, 'click', this.handleClick.bind(this));
		// utils.addListener(document, 'mousedown', this.handleMouseDown.bind(this));
		// utils.addListener(document, 'mouseup', this.handleMouseUp.bind(this));
		utils.addListener(document, 'keydown', this.handleKeydown.bind(this));
		utils.addListener(document, 'keyup', this.handleKeyup.bind(this));
	},

	capture: function () {
		var left, up, right, down;

		if (this._command.moveLeft)
			console.log('left +')
		if (this._command.moveUp)
			console.log('up +')
		if (this._command.moveRight)
			console.log('right +')
		if (this._command.moveDown)
			console.log('down +')
		return {
			left: this._command.moveLeft,
			up: this._command.moveUp,
			right: this._command.moveRight,
			down: this._command.moveDown
		}
	},

	handleKeydown: function (e) {
		var key = (e || window.e).keyCode;
		if ((key == 65)) {
			this._command.moveLeft = true
		}
		if ((key == 87)) {
			this._command.moveUp = true
		}
		if ((key == 68)) {
			this._command.moveRight = true
		}
		if ((key == 83)) {
			this._command.moveDown = true
		}
	},

	handleKeyup: function (e) {
		var key = (e || window.e).keyCode;
		if ((key == 65))
			this._command.moveLeft = false
		if ((key == 87))
			this._command.moveUp = false
		if ((key == 68))
			this._command.moveRight = false
		if ((key == 83))
			this._command.moveDown = false
	},

	setBattleFieldAttributes: function (obj) {
		Object.extend(this.battleField, obj);
	},


	handleClick: function (e) {
		this._cursorOnTheMap(e.clientX, e.clientY);
	},

	handleMouseDown: function(e) {
		console.log('mousedown')
		this._startScrollMap(e.clientX, e.clientY);
	},
	
	handleMouseUp: function (e) {
		console.log('mouseup')
		this._stopScrollMap(e.clientX, e.clientY);
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

	// TODO: precisa ser alterado para o novo formato do tiles
	// _cursorOnTheMap: function (clientX, clientY) {
	// 	var col = (clientY - this.battleField.offsetY) * 2;
	// 	col = ((this.battleField.offsetX + col) - clientX) / 2;

	// 	var row = ((clientX + col) - this.scaledTileSize) - this.battleField.offsetX + 63;

	// 	row = Math.floor(row / this.scaledTileSize);
	// 	col = Math.floor(col / this.scaledTileSize);

	// 	if (row >= 0 && col >= 0 && row <= (this.battleField.width - 1) && col <= (this.battleField.height - 1)) {
	// 		return {
	// 			x: row,
	// 			y: col
	// 		};
	// 	}
	// 	return;	
	// },
	
	_startScrollMap: function (x, y) {
		console.log('mouse move start')
		var startDragX = x,
			startDragY = y,
			endDragX = 0,
			endDragY = 0;
			
		utils.addListener(document, "mousemove", this._scrollingMap.bind(this));
	},
	
	_scrollingMap: function (e) {
		console.log("scrolling map");
	},
	
	_stopScrollMap: function () {
		console.log('mouse move stoped')
		utils.removeListener(document, "mousemove", this._scrollingMap.bind(this));
	}
});


Controls.prototype.temp = function () {
	console.log(this.tileSize)
}