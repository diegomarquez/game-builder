define(['require', 'class'], function(require) {
	var Bundle = Class.extend({
		init: function() {},

		create: function() {
			throw new Error('Bundle: This method should be overriden');
		}
	});

	return Bundle;
});