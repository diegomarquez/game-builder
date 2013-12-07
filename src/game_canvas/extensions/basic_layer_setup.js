define(["layers", "class"], function(Layers) {
	var GameInitExtension = Class.extend({
		execute: function() {
			Layers.add("Back");
			Layers.add("Middle");
			Layers.add("Front");
			Layers.add("Text");
		}
	});

	return GameInitExtension;
});