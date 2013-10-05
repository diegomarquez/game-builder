define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			//Loading dependacies through a relative path
			basic_game_object = require('./concrete_game_objects/basic_game_object'); 
			box_renderer      = require('./concrete_components/box_renderer');

			//When this is called we are good to go!
			gamejs.game.on("init", this, function() {
				//Create the renderer components pool
				gamejs.co_pool.createPool("Box_Renderer", box_renderer, 1);
				//Create a configuration for the components in the pool
				//When a component with with ID 'Red_Renderer' is created, it will take this arguments
				gamejs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:'#FF0000'});
				
				//Create game_object pool
				gamejs.go_pool.createPool("Base", basic_game_object, 1);
				//Create a configuration for the game_objects in the pool
				//When a game_object with with ID 'Base_1' is created, it will take this arguments
				//NOTICE: The ID being sent in through setRenderer()
				gamejs.go_pool.createConfiguration("Base_1", "Base")
					.args({x: gamejs.game.canvas.width/2, y:gamejs.game.canvas.height/2, rotation_speed: 3})
					.setRenderer('Red_Renderer');

				//Get a game_object already setup. NOTICE: the ID used to get it. 
				//The assembler module is your friend, and as such you will see it regularly.
				var go = gamejs.assembler.get('Base_1');

				//Adding the game_object to a layer
				gamejs.layers.get('Middle').add(go);

				//Until this method is called, the game_object will do nothing.
				go.start();
			});
		}

		//Conveniantly enough, if a requireJS module returns an instance, it's as good as a singleton.
		//In the case of this main.js file and all the others you will find across different eamples, that is exactly what we need.
		return new main();
	}
);