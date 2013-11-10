define(function(require) {
	var Bundle = require('bundle');
	//This is a basic pool setup bundle. There is nothing special about this
	//I just thought it would be a nice thing to have a way of bundling this code
	//so it is easy to reuse it across examples.

	var BasicBundle = Bundle.extend({
		create: function() {
			//This dependencies are realive to the src folder
			basic_game_object = require('../examples/resources/basic_game_object'); 
			box_renderer      = require('../examples/resources/box_renderer');

			//Create the renderer components pool.
			//An Id, Class and amount are specified
			gjs.go_pool.createPool("Base", basic_game_object, 1);
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
			
			//Create a configuration for the game_objects in the pool
			//When a game_object with with ID 'Base_1' is created, it will take this arguments
			//NOTICE: The ID being sent in through setRenderer(), it mates the one just above.
			gjs.go_pool.createConfiguration("Base_1", "Base")
				.args({x: gjs.game.canvas.width/2, y:gjs.game.canvas.height/2, rotation_speed: 3})
				.setRenderer('Red_Renderer');
		}
	});

	return new BasicBundle();
});