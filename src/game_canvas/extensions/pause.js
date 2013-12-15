define(["layers", "class"], function(Layers) {
	var Extension = Class.extend({
		type: function() {
			return 'pause';
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