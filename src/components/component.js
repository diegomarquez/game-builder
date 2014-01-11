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
			this.execute('added', this);
			this.added(parent);
		},

		onRemoved: function() {
			this.removed(parent);
			this.execute('removed', this);
			this.parent = null;
		},

		added: function(parent) {},
		
		removed: function(parent) {},

		start: function() {},
		
		update: function(delta) {},

		debug_draw: function(context) {},

		destroy: function() {
			this.execute('recycle', this);
		}
	});

	return Component;
});