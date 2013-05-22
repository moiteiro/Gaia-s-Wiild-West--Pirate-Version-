/*globals define*/

require.config({
	baseUrl: 'scripts/',

	paths: {
		// remover o jquery proque so iremos utilizar json request
		jQuery : 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',

		Core: 'libs/core',
		Events: 'libs/events',
		Legacy: 'libs/legacy',

		BattleField: 'models/BattleField',
		Resource: 'models/Resource',
		Tile: 'models/Tile',

		Screen: 'UI/Screen'
	},

	shim: {
		'Screen': ['Core', 'Events', 'Legacy'],

		'Tile': ['Core', 'Events', 'Legacy'],
		'Resource': ['Core', 'Events', 'Legacy'],
		'BattleField': ['Resource'],
		'App': ['BattleField']
	}

});

define(['App', 'Core', 'Events', 'Legacy', 'BattleField', 'Tile', 'Resource', 'Screen', 'jQuery'], function () {

});