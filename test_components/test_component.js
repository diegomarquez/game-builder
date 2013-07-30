define(['component'], function(Component){
	var Component = Component.extend({
		init: function() {
			this._super();
		},

		onAdded: function(parent) {
			this._super(parent);
		},

		onRemoved: function() {
			this._super();
		},

		update: function() {
			this.parent.rotation += this.rotationSpeed;
		}
	});

	return Component;
});