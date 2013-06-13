/*globals canvas, document, window, klass, stage */

// for a entiry layer composition.

var Layer = klass({

	zIndex: 1000,
	fixed: false,
	isometric: false,
	translateX: 0,
	translateY: 0,
	
	canvas: "",
	context: "",


	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		var viewport = $('viewport');
			canvas = document.createElement("canvas");
			context = canvas.getContext('2d');
			style = canvas.style;

		viewport.appendChild(canvas);
		canvas.width = viewport.clientWidth;
		canvas.height = viewport.clientHeight;
		style.zIndex = this.zIndex;
		this.canvas = canvas;
		this.context = context;
	},

	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	isometricMode: function () {
		this.context.scale(1, 0.5);
		this.context.rotate(45 * Math.PI / 180);
	},

	translate: function (x, y) {
		this.context.translate(x, y);
	}
})