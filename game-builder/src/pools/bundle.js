define(function(require) {
	var Bundle = Class.extend({
		init: function() {
			var gb = require('gb');
			
			this.gameObjectPool = gb.goPool;
			this.componentPool 	= gb.coPool;
			this.canvas 		= gb.canvas;
		},

		create: function(args) {
			throw new Error('Bundle: This method must be overriden');
		}
	});

	return Bundle;
});