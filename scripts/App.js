/*global window, document, klass, requestAnimFrame, $,
	BattleField, Resource, Controls, GameController, Screen
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
	msPerFrame: 33,

	msCaptureInput: 200, // how much seconds the game will capture an user input

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

		this.setFullScreen();

		this.screen = new Screen({
			canvas: this.canvas
		});

		this.gameController = new GameController();
		this.gameController.setState('BATTLE_NEW');
		this._states = this.gameController.getAllStates();

		this.controls = new Controls({
			canvas: this.canvas,
			tileSize: this.tileSize,
			scaledTileSize: this.scaledTileSize
		});
	},


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

		var input = this.controls.capture();

		switch (curState) {

		case states.BATTLE_NEW:
			// 1 - calculate with biome will
			
			// 2 - load the resources needed
			this._setupResources();

			this.gameController.setState('BATTLE_LOADING');

			break;

		case states.BATTLE_LOADING:
			// implementar algum tipo de load bar para esperar que todos os resources seja carregados.
			// this is the time for loading bar!!!
			if (this.resources.isReady()) {
				this._setupBattleField();
				this.controls.setBattleFieldAttributes(this.battleField.getAttributes());
				this.gameController.setState('BATTLE_LOADED')
			}
			break;

		case states.BATTLE_LOADED:
				this.gameController.setState('BATTLE');
			break;

		case states.BATTLE:
			if (this.battleField.over()) {
				this.gameController.set('BATTLE_END');
			} else {
				this.battleField.getInput(input);
				this.battleField.render(this.loopFrameCount);
			}
			break;
		}
	},

	gameLoop: function () {
		this.update();
	},

	_setupBattleField: function () {
		this.battleField = new BattleField({
			resources: this.resources,
			context: this.context,
			screenWidth: this.screenWidth,
			screenHeight: this.screenHeight,
			scaledTileSize: this.scaledTileSize,
			tileSize: this.tileSize
		});
	},

	_setupResources: function () {
		this.resources = new Resource({
			path: "assets/nature/savanna/",
			context: this.context
		});
	}
});

window.gww = new GWW();

/**
 * Function to update the scene of the entire game.
 * The render function of gww is called every 16ms thereby updating the game.
 */
(function (gww) {

	var lastUpdateTime = 0;
	var acDelta = 0;
	var msPerFrame = gww.msPerFrame;

	function gameLoop() {
		requestAnimFrame(gameLoop);
		gww.gameLoop();

		var delta = Date.now() - lastUpdateTime;
		if (acDelta > msPerFrame) {
			gww.totalFrames++;
			gww.loopFrameCount++;

			acDelta = 0;

			if (gww.loopFrameCount >= 60) {
				gww.loopFrameCount = 0;
			}

		} else {
			acDelta += delta;
		}

		lastUpdateTime = Date.now();
	}

	gameLoop();
}(gww));