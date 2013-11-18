gjs.setModulePath('basic_game_object');
gjs.setModulePath('box_renderer');

define(function(require) {
	var Bundle = require('bundle');
	
	var basic_game_object = require('basic_game_object'); 
	var box_renderer      = require('box_renderer');

	var BasicBundle = Bundle.extend({
		create: function() {
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