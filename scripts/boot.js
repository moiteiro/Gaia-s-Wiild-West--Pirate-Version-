/*globals define*/

require.config({
	baseUrl: 'scripts/',

	paths: {
		// remover o jquery proque so iremos utilizar json request
		// jQuery : 'http://code.jquery.com/jquery.min.js',

		Core: 'libs/core',
		Events: 'libs/events',
		Legacy: 'libs/legacy',
		Request: 'libs/request',

		BattleField: 'models/BattleField',
		GameController: 'models/GameController',
		Tile: 'models/Tile',
		TilePool: 'models/TilePool',
		Resource: 'models/Resource',
		Entity: 'models/Entity',
		EntityPool: 'models/EntityPool',

		Controls: 'UI/Controls',
		Screen: 'UI/Screen',
		Layer: 'UI/Layer',
	},

	shim: {
		'Request': ['Core', 'Legacy'],
		'Controls': ['Core', 'Events', 'Legacy'],
		'Entity': ['Core', 'Events', 'Legacy'],
		'EntityPool': ['Entity'],
		'GameController': ['Core', 'Events', 'Legacy'],
		'Layer': ['Core', 'Events', 'Legacy'],
		'Screen': ['Core', 'Events', 'Legacy'],

		'Tile': ['Core', 'Events', 'Legacy'],
		'TilePool': ['Tile'],
		'Resource': ['Core', 'Events', 'Legacy'],
		'BattleField': ['Resource'],
		'App': ['BattleField']
	}

});

define(['App', 'BattleField', 'Core', 'Controls', 'Entity', 'EntityPool', 'Events', 'GameController', 'Legacy', 'Layer', 'Tile', 'TilePool', 'Request', 'Resource', 'Screen' /*'jQuery'*/], function () {

});