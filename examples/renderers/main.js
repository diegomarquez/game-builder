//Here we will be taking a look mainly at a renderer to draw images.
//Something a bit more interesting than the squares thus far.

gjs.setModulePath('rendering_bundle', '../examples/resources/bundles/rendering_bundle');

define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			gjs.game.on("init", this, function() {
				require('rendering_bundle').create();

				gjs.layers.get('Middle').add(gjs.assembler.get('Base_1')).start();
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();		
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_3')).start();		
			});
		}

		return new main()
	}
);