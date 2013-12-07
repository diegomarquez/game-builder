define(["layers", "class"], function(Layers) {
	var GameResumeExtension = Class.extend({
		execute: function() {
			Layers.all('resume', 'update');

			for (var k in Layers.layers) { 
				if (Layers.layers[k].drawAlreadyStopped) {
					Layers.stop_draw(k);			
				} 
				if (Layers.layers[k].updateAlreadyStopped) {
					Layers.stop_update(k);
				}

				Layers.layers[k].drawAlreadyStopped = false;
				Layers.layers[k].updateAlreadyStopped = false;
			}
		}
	});

	return GameResumeExtension;
});