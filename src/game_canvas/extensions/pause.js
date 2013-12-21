define(["layers", "gb", "class"], function(Layers, Gb) {
	var Extension = Class.extend({
		type: function() {
			return Gb.game.BLUR;
		},

		execute: function() {
			for (var k in Layers.layers) { 
				Layers.layers[k].drawAlreadyStopped = !Layers.layers[k].canDraw;
				Layers.layers[k].updateAlreadyStopped = !Layers.layers[k].canUpdate;
			}

			Layers.all('stop', 'update');
		}
	});

	return Extension;
});