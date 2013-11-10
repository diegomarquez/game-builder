define(function(require) {
		var main = function(){};

		//This example is about getting soething on the screen.
		//Basic workflow on how to setup pools and create your game objects

		main.prototype.start = function() {
			//When this is called we are good to go!
			gjs.game.on("init", this, function() {
				//The code in this file takes care of creating all the things this example will use
				//If you decide to give this framework a try, you will be creating files such as this one.
				require('../../resources/basic_bundle.js').create();

				//The ID "Base_1" is defined in basic_bundle.js
				var go = gjs.assembler.get('Base_1');
				
				//The assembler module takes care of building a game_object as specified previously.
				//It will take a pooled game_object add to it all the components that are configured for it to use
				//and finally it will setup the initial values of all those things.

				//Adding the game_object to a layer. The names of the 
				gjs.layers.get('Middle').add(go);

				//Until this method is called, the game_object will do nothing.
				go.start();
			});
		}

		//Conveniantly enough, if a requireJS module returns an instance, it's as good as a singleton.
		//In the case of this main.js file,
		//and all the others you will find across different examples, that is exactly what we need.
		return new main();
	}
);