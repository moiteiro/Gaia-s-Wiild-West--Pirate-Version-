/*globals canvas, document, window, klass */

var Stage = klass({

	_layerPool:
	_deadLayerPool:

	initialize: function (configs) {
		if (configs) {
			Object.extend(this, configs);
		}

		this._layerPool = [];
		this._deadLayerPool = [];
	},
})