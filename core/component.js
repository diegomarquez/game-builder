define(["class"], function(Class) {

	var Component = Class.extend({
		init: function() {
			this.parentGameObject = null;
		},

		onAdded: function(parent) {
			this.parentGameObject = parent;
		},

		onRemoved: function() {
			this.parentGameObject = null	
		},

		update: function() {},
		destroy: function() {}
	});

	return Component;
});