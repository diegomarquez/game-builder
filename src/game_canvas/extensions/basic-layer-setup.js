define(["layers", "gb", "class"], function(Layers, Gb) {
	var Extension = Class.extend({
		type: function() {
			return Gb.game.CREATE;
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