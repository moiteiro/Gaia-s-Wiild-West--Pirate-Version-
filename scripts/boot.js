/*globals define*/

require.config({
	baseUrl: 'scripts/',

	paths: {
		// remover o jquery proque so iremos utilizar json request
		// jQuery : 'http://code.jquery.com/jquery.min.js',

		Core: 'libs/core',
		Events: 'libs/events',
		Legacy: 'libs/legacy',

		BattleField: 'models/BattleField',
		Resource: 'models/Resource',
		Tile: 'models/Tile',
		GameController: 'models/GameController',

		Screen: 'UI/Screen',
		Controls: 'UI/Controls'
	},

	shim: {
		'GameController': ['Core', 'Events', 'Legacy'],
		'Controls': ['Core', 'Events', 'Legacy'],
		'Screen': ['Core', 'Events', 'Legacy'],

		'Tile': ['Core', 'Events', 'Legacy'],
		'Resource': ['Core', 'Events', 'Legacy'],
		'BattleField': ['Resource'],
		'App': ['BattleField']
	}

});

define(['App', 'Core', 'Events', 'Legacy', 'BattleField', 'Tile', 'Resource', 'Screen', 'Controls', 'GameController' /*'jQuery'*/], function () {

});