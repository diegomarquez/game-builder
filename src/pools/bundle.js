define(['require', 'class'], function(require) {
	var Bundle = Class.extend({
		init: function() {
			this.gameObjectPool = require('game_object_pool');
			this.gomponentPool = require('component_pool');		
		},

		create: function() {
			throw new Error('Bundle: This method should be overriden');
		}
	});

	return Bundle;
});