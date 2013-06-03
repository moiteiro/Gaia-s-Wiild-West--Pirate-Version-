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
		GameController: 'models/GameController',
		Layer: 'models/Layer',
		Tile: 'models/Tile',
		Resource: 'models/Resource',
		Entity: 'models/Entity',
		EntityPool: 'models/EntityPool',

		Screen: 'UI/Screen',
		Controls: 'UI/Controls'
	},

	shim: {
		'Controls': ['Core', 'Events', 'Legacy'],
		'Entity': ['Core', 'Events', 'Legacy'],
		'EntityPool': ['Entity'],
		'GameController': ['Core', 'Events', 'Legacy'],
		'Layer': ['Core', 'Events', 'Legacy'],
		'Screen': ['Core', 'Events', 'Legacy'],

		'Tile': ['Core', 'Events', 'Legacy'],
		'Resource': ['Core', 'Events', 'Legacy'],
		'BattleField': ['Resource'],
		'App': ['BattleField']
	}

});

define(['App', 'BattleField', 'Core', 'Controls', 'Entity', 'EntityPool', 'Events', 'GameController', 'Legacy', 'Layer', 'Tile', 'Resource', 'Screen' /*'jQuery'*/], function () {

});