//This example is about getting something on the screen.
//Basic workflow on how to setup pools and create your game objects.

//Set up aliases to the modules specific to this application are set
//We do this here so that when you need to require a module elsewhere you
//don't have to type the whole path

//On the insides this method calls requirejs.config()
//Note that this paths are relative to the folder containing bootstrap.js
gjs.setModulePath('basic_bundle', '../examples/resources/basic_bundle');

define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			//When this is called we are good to go!
			gjs.game.on("init", this, function() {
				//The code in this file takes care of creating all the things this example will use
				//If you decide to give this framework a try, you will be creating files such as this one.
				require('basic_bundle').create();

				//The assembler module takes care of building a game_object as specified previously.
				//It will take a pooled game_object add to it all the components that are configured for it to use
				//and finally it will setup the initial values of all those things.

				//The ID "Base_1" is defined in basic_bundle.js
				var go = gjs.assembler.get('Base_1');
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