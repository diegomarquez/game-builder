define(['require',
		'./concrete_game_objects/basic_game_object',
		'./concrete_components/box_renderer'],

	function(require) {
		var main = function(){};

		main.prototype.start = function(game, assembler, game_object_pool, component_pool, layers) {
			//Using a relative path to let requireJS know where my stuff is
			//According to the documentation there is another way, which avoids the need of having duplicate strings
			//But to the best of my understanding, it only works if you don't have any other dependancies other than 'require'
			//If you have more (other examples will have more), it won't work.
			basic_game_object = require('./concrete_game_objects/basic_game_object'); 
			box_renderer      = require('./concrete_components/box_renderer');

			//When this is called we are good to go!
			game.on("init", this, function() {
				//Create the renderer components pool
				component_pool.createPool("Box_Renderer", box_renderer, 1);
				//Create an instance configuration for the components in the pool
				component_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:'#FF0000'});
				
				//Create game_object pool
				game_object_pool.createPool("Base", basic_game_object, 1);
				//Create an instance configuration for the game_objects in the pool
				game_object_pool.createConfiguration("Base_1", "Base")
					.args({x: game.canvas.width/2, y:game.canvas.height/2, rotation_speed: 3})
					.setRenderer('Red_Renderer');

				//Get a game_object already setup. Notice the ID used to get it. 
				//The assembler module is your friend, and as such you will see it regularly.
				var go = assembler.get('Base_1');

				//Adding the game_object to a layer
				layers.get('Middle').add(go);

				//Until this method is called, the game_object will do nothing.
				go.start();
			});
		}

		//Conveniantly enough, if a requireJS module returns an instance, it's as good as a singleton.
		//In the case of this main.js file and all the others you will find, that is exactly what we need.
		return new main();
	}
);