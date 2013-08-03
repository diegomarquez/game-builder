define(["class"], function() {

	var Component = Class.extend({
		init: function() {
			this.poolId = null;
			this.parent = null;
		},

		configure: function(args) {
			if (!args) return;

			for (var ha in args) {
				this[ha] = args[ha];
			}
		},

		onAdded: function(parent) {
			this.parent = parent;
		},

		onRemoved: function() {
			this.parent = null;
		},

		start: function() {},
		update: function() {},
		destroy: function() {}
	});

	return Component;
});