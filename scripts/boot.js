/*globals define*/

require.config({
	baseUrl: 'scripts/',

	paths: {
		Core: 'libs/core',
		Events: 'libs/events',
		Legacy: 'libs/legacy',

		BattleField: 'models/BattleField',
		Resource: 'models/Resource',
		Tile: 'models/Tile'
	},

	shim: {
		'Tile': ['Core', 'Events', 'Legacy'],
		'Resource': ['Core', 'Events', 'Legacy'],
		'BattleField': ['Resource'],
		'App': ['BattleField']
	}

});

define(['App','Core', 'Events', 'Legacy','BattleField', 'Tile', 'Resource'], function () {
	
});