/*global klass */

var GameController = klass({
	state: {
		_current: 0,
		LOADING: 1,
		LOADED: 2,

		// battle
		BATTLE_NEW: 300,
		BATTLE_LOADING: 301,
		BATTLE_LOADED: 302,
		BATTLE_INTRO: 303,
		BATTLE_CONVERSATION: 304,
		BATTLE_CG: 305,
		BATTLE: 306,
		BATTLE_END: 307,


		EXPLORATION: 400,
		CITY: 500,

		CRASHED: 1000
	},

	progression: {
		chapter: 0,
		quest: 0,
		event: 0,
		completedChapters: 0,
		completedQuests: 0,
		completedEvents: 0,
	},

	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}
	},

	getState: function () {
		return this.state._current;
	},

	getAllStates: function () {
		return this.state;
	},

	/**
	 * Set current state of game
	 * @param  {[type]} state [description]
	 * @return {[type]}       [description]
	 */
	setState: function (STATE) {

		if (Object.prototype.hasOwnProperty.call(this.state, STATE)) {
			this.state._current = this.state[STATE];
		} else {
			this.state._current = this.state.CRASHED;
			throw "GameController: this state doesn't exists (" + STATE + ")";
		}
	}
});