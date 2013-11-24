//Here we will be taking a look mainly at a renderer to draw images.
//Something a bit more interesting than the squares thus far.

gjs.setModulePath('rendering_bundle');

define(function(require) {
		var main = function(){
			gjs.game.on("init", this, function() {
				//This pool setup bundle creates all the things this example will be using
				require('rendering_bundle').create();

				gjs.layers.get('Middle').add(gjs.assembler.get('Base_1')).start();
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();		
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_3')).start();		
			});
		};

		return new main()
	}
);