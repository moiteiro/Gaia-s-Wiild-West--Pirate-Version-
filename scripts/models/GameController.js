/*global klass */

var GameController = klass({
	state: {
		_current: 0,
		LOADING: 1,
		LOADED: 2,
		CRASHED: 10
	},

	progression: {
		chapter: 0,
		quest: 0,
		event: 0,
		completedChapters: 0,
		completedQuests: 0,
		completedEvents: 0,
	}
});