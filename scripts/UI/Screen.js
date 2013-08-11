/*globals klass */

var Screen = klass({
	offsetX: 0,
	offsetY: 0,
	canvas: '',
	screenWidth: 0,
	screenHeight: 0,

	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		this._setFullScreen();
	},

	intro: function () {},
	fadeToBlack: function () {},
	fadeToWhite: function () {},
	gameOver: function () {},

	doResize: function () {
		// fazer todos os calculos de posicionamento do canvas com relacao ao body
		// ffazer os calulos de offset atraves de todos os parents para descobrir o offset do click do mouse
		//this._calculateOffset();
	},

	_setFullScreen: function () {
		this.screenWidth = this.canvas.width = this.canvas.parentNode.clientWidth;
		this.screenHeight = this.canvas.height = this.canvas.parentNode.clientHeight;
	},

	_calculateOffset: function () {
		var obj = this.canvas;

		while (obj) {
			this.offsetX -= obj.offsetLeft;
			this.offsetY -= obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
});