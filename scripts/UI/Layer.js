/*globals canvas, document, window, klass, stage, $ */

// for a entiry layer composition.

var Layer = klass({

	zIndex: 1000,
	fixed: false,
	isometric: false,
	translateX: 0,
	translateY: 0,

	canvas: "",
	context: "",

	name: "",


	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		var viewport = $('viewport'),
			canvas = document.createElement("canvas"),
			context = canvas.getContext('2d'),
			style = canvas.style;

		viewport.appendChild(canvas);
		canvas.width = viewport.clientWidth;
		canvas.height = viewport.clientHeight;
		style.zIndex = this.zIndex;
		this.canvas = canvas;
		this.context = context;

		if (this.name) {
			this.canvas.id = this.name;
		}

		this.setAutoResize();
	},

	getContext: function () {
		return this.context;
	},

	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	save: function () {
		this.context.save();
	},

	restore: function () {
		this.context.restore();
	},

	isometricMode: function () {
		this.context.scale(1, 0.5);
		this.context.rotate(45 * Math.PI / 180);
	},

	translate: function (x, y) {
		this.context.translate(x, y);
		this.translateX = x;
		this.translateY = y;
	},

	resize: function (width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	},

	forceResize: function (width, height) {
		this.canvas.width = width;
		this.canvas.height = height;

		if (this.isometric) {
			this.context.translate(this.translateX, this.translateY);
			this.isometricMode();
		}
	},

	setAutoResize: function () {
		utils.addListener(window, "resize", this._setFullScreen.bind(this));
	},

	_setFullScreen: function () {
		this.screenWidth = this.canvas.width = this.canvas.parentNode.clientWidth;
		this.screenHeight = this.canvas.height = this.canvas.parentNode.clientHeight;
	},
});
