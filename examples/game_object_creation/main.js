define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			//Loading dependacies through a relative path
			basic_game_object = require('../resources/basic_game_object'); 
			box_renderer      = require('../resources/box_renderer');

			//When this is called we are good to go!
			gjs.game.on("init", this, function() {

				var bundle = require('../resources/basic_bundle.js');

				bundle.create();

				//Create the renderer components pool.
				//An Id, Class and amount are specified
				gjs.co_pool.createPool("Box_Renderer", box_renderer, 1);
				
				//Create a configuration for the components in the pool
				//When a component with with ID 'Red_Renderer' is created, it will take this arguments
				//This particular render will draw a box with the specified parameters
				gjs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer')
					.args({	
							color:'#FF0000',
							offsetX: -50,
							offsetY: -50,
							width: 100,
							height: 100,
						  });

				//Create game_object pool
				//An Id, Class and amount are specified
				
				gjs.go_pool.createPool("Base", basic_game_object, 1);
				//Create a configuration for the game_objects in the pool
				//When a game_object with with ID 'Base_1' is created, it will take this arguments
				//NOTICE: The ID being sent in through setRenderer()
				gjs.go_pool.createConfiguration("Base_1", "Base")
					.args({x: gjs.game.canvas.width/2, y:gjs.game.canvas.height/2, rotation_speed: 3})
					.setRenderer('Red_Renderer');

				//Get a game_object already setup. NOTICE: the ID used to get it. 
				var go = gjs.assembler.get('Base_1');
				//The assembler module takes care of building a game_object as specified previously.
				//It will take a pooled game_object add to it all the components that are configured for it to use
				//and finally it will setup the initial values of all those things.

				//Adding the game_object to a layer
				gjs.layers.get('Middle').add(go);

				//Until this method is called, the game_object will do nothing.
				go.start();
			});
		}

		//Conveniantly enough, if a requireJS module returns an instance, it's as good as a singleton.
		//In the case of this main.js file and all the others you will find across different eamples, that is exactly what we need.
		return new main();
	}
);