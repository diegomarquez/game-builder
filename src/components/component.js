define(["delegate"], function(Delegate) {

	var Component = Delegate.extend({
		init: function() {
			this._super();

			this.poolId = null;
			this.parent = null;
		},

		configure: function(args) {
			if (!args) return;

			for (var ha in args) {
				this[ha] = args[ha];
			}

			this.args = args;
		},

		onAdded: function(parent) {
			this.parent = parent;
		},

		onRemoved: function() {
			this.parent = null;
		},

		start: function() {},
		
		update: function() {},

		destroy: function() {
			this.execute('recycle', this);
		}
	});

	return Component;
});