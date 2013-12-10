define(["layers", "class"], function(Layers) {
	var Extension = Class.extend({
		type: function() {
			return 'create';
		},

		execute: function() {
			Layers.add("Back");
			Layers.add("Middle");
			Layers.add("Front");
			Layers.add("Text");
		}
	});

	return Extension;
});