/*global window, document, klass, requestAnimFrame, $,
	BattleField, Resource, Controls, GameController
*/

var GWW = klass({
	name: "Gaia's Wild West (pirate version)",
	version: '0.0.0',
	canvas: '',
	context: '',

	screenWidth: 0,
	screenHeight: 0,
	tileSize: 90,           // size of each square
	scaledTileSize: 63.639, // size of tile after the scale operation
	loopFrameCount: 0,
	totalFrames: 0,
	msPerFrame: 16,

	gameController: "",
	controls: "",
	HUD: "",
	debugHUD: "",
	progression: "",
	battleField: "",
	resources: "",
	map: "",


	initialize: function (configs) {
		this.canvas = $('canvas');
		this.context = this.canvas.getContext('2d');

		if (configs) {
			Object.extend(this, configs);
		}

		// mover para dentro de Screen
		// utils.addListener(window, 'resize', Screen.doResize);
		this.setFullScreen();

		this.gameController = new GameController();
		this.gameController.setState('BATTLE_NEW');
		this._states = this.gameController.getAllStates();

		this.controls = new Controls({
			canvas: this.canvas,
			tileSize: this.tileSize,
			scaledTileSize: this.scaledTileSize
		});

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

		this.controls.setBattleFieldAttributes(this.battleField.getAttributes());
	},

	/* move to screen object*/
	setFullScreen: function () {
		this.screenWidth = this.canvas.width = this.canvas.parentNode.clientWidth;
		this.screenHeight = this.canvas.height = this.canvas.parentNode.clientHeight;
	},

	/**
	 * Updates the game's state
	 * @return {[type]} [description]
	 */
	update: function () {
		var curState = this.gameController.getState();
		var states = this._states;

		switch (curState) {

		case states.BATTLE_NEW:
			this.gameController.setState('BATTLE');
			break;

		case states.BATTLE:
			if (this.battleField.over()) {
				this.gameController.set('BATTLE_END');
			}
			break;
		}
	},


	render: function () {
		this.update();

		var context = this.context,
			canvas = this.canvas;

		// canvas.width = canvas.width; // clears the canvas
		// context.clearRect(0,0, canvas.width, canvas.height)

		this.battleField.setTileCursorHover(this.controls.getMapMouseCoord());
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

	function render() {
		requestAnimFrame(render);
		gww.render();
		gww.totalFrames++;
	}
	render();
}(gww));
