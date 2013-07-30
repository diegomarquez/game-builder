define(["class"], function() {

	var Component = Class.extend({
		init: function() {
			this.poolId = null;
			this.parent = null;
		},

		onAdded: function(parent) {
			this.parent = parent;
		},

		update: function() {},
		destroy: function() {}
	});

	return Component;
});