//This example demonstrates the use of components.
//These are reusable modules that can be attached to different kinds of game_objects. 

//A game object can has as many components as you like.
//The order of execution will be in the order they were added.

//This example will be using a rather useless component.
//It will make the associated game_object twitch like crazy, according to
//a number we pass in when configuring it.

gjs.setModulePath('logic_bundle');

define(function(require) {
		var main = function(){
			gjs.game.on("init", this, function() {
				//This pool setup bundle creates all the things this example will be using
				require('logic_bundle').create();

				gjs.layers.get('Middle').add(gjs.assembler.get('Base_1')).start();
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();	
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_3')).start();	
			});
		};

		return new main()
	}
);