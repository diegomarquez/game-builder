define(["class"], function() {

	var Component = Class.extend({
		init: function() {
			this.poolId = null;
			this.parent = null;
			this.returnToFactory = false;
		},

		configure: function(args) {
			if (args) {
				for (var ha in args) {
					component[ha] = args[ha];
				}
			}
		},

		onAdded: function(parent, returnToFactoryOnRemove) {
			this.parent = parent;
			this.returnToFactory = returnToFactoryOnRemove;
		},

		onRemoved: function() {
			this.parent = null;
			this.returnToFactory = false;
		},

		start: function() {},
		update: function() {},
		destroy: function() {}
	});

	return Component;
});