gjs.setModulePath('basic_bundle');

define(function(require) {
		var main = function(){
			gjs.game.on("init", this, function() {
				//The code in this file takes care of creating all the things this example will use
				//If you decide to give this framework a try, you will be creating files such as this one.
				require('basic_bundle').create();

				//The assembler module takes care of building a game_object as specified previously.
				//It will take a pooled game_object add to it all the components that are configured for it to use
				//and finally it will setup the initial values of all those things.

				//The ID "Base_1" is defined in basic_bundle.js
				var go = gjs.assembler.get('Base_1');
				//Adding the game_object to a layer. 
				gjs.layers.get('Middle').add(go);
				//Until this method is called, the game_object will do nothing.
				go.start();
			});
		};

		return new main();
	}
);