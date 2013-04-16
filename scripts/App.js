/*global window, document, klass, requestAnimFrame, $,
	BattleField, Resource
*/

var GWW = klass({
	name: "Gaia's Wild West",
	version: '0.0.0',
	canvas: '',
	context: '',

	screenWidth: 0,
	screenHeight: 0,
	msPerFrame: 16,
	tileSize: 90,           // size of each square
	scaledTileSize: 63.639, // size of tile after the scale operation

	HUD:null,
	progression: null,
	battleField: null,
	resources: null,
	map: null,

	initialize: function (configs) {
		this.canvas = $('canvas');
		this.context = this.canvas.getContext('2d');

		if (configs) {
			Object.extend(this, configs);
		}

		this.setFullScreen();

		this.resources = new Resource({
			path: "assets/nature/savanna/",
			type: "nature",
			context: this.context
		});

		// implementar algum tipo de load bar para esperar que todos os resources seja carregados.

		this.battleField = new BattleField({
			resources: this.resources,
			context: this.context,
			screenWidth: this.screenWidth,
			screenHeight: this.screenHeight,
			scaledTileSize: this.scaledTileSize,
			tileSize: this.tileSize
		});
	},

	setFullScreen: function () {
		this.screenWidth = this.canvas.width = this.canvas.parentNode.clientWidth;
		this.screenHeight = this.canvas.height = this.canvas.parentNode.clientHeight;
	},


	render : function () {
		var context = this.context,
			canvas = this.canvas;

		canvas.width = canvas.width; // clears the canvas

		this.battleField.render();
	}

});

var gww = new GWW();


/**
 * Function to update the scene of the entire game.
 * The render function of gww is called every 16ms thereby updating the game.
 */
(function (gww) {

	var lastUpdateTime = 0;
	var acDelta = 0;
	var msPerFrame = gww.msPerFrame;

	function render () {
		requestAnimFrame(render);

		var delta = Date.now() - lastUpdateTime;
		if (acDelta > msPerFrame) {
			acDelta = 0;
			gww.render();
		} else {
			acDelta += delta;
		}

		lastUpdateTime = Date.now();
	}

	render();
}(gww));