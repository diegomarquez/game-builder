gjs.setModulePath('basic_game_object');
gjs.setModulePath('box_renderer');
gjs.setModulePath('component_1');

define(function(require) {
	var Bundle = require('bundle');
	
	var basic_game_object = require('basic_game_object'); 
	var box_renderer = require('box_renderer');		
	//The cleverly named component we will be using in this example
	var component = require('component_1');

	var LogicBundle = Bundle.extend({
		create: function() {
			//Nothing new in this part of the setup
			gjs.co_pool.createPool("Box_Renderer", box_renderer, 3);
			gjs.co_pool.createPool("Component", component, 3);

			gjs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:  '#FF0000', offsetX: -10, offsetY: -10, width: 20, height: 20});
			gjs.co_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({color:'#00FF00', offsetX: -10, offsetY: -10, width: 20, height: 20});
			gjs.co_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({color: '#0000FF', offsetX: -10, offsetY: -10, width: 20, height: 20});

			//Creating the different configurations for the same type of component
			gjs.co_pool.createConfiguration("Component_1", 'Component').args({amount:2});
			gjs.co_pool.createConfiguration("Component_2", 'Component').args({amount:5});
			gjs.co_pool.createConfiguration("Component_3", 'Component').args({amount:15});

			gjs.go_pool.createPool("Base", basic_game_object, 3); 

			gjs.go_pool.createConfiguration("Base_1", "Base")
				.args({x: gjs.game.canvas.width*1/3 - 65, y: gjs.game.canvas.height/2, rotation_speed: 2})
				.addComponent('Component_1')
				.setRenderer('Red_Renderer');

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({x: gjs.game.canvas.width*2/3 - 65, y: gjs.game.canvas.height/2, rotation_speed: 1})
				.addComponent('Component_2')
				.setRenderer('Green_Renderer');

			gjs.go_pool.createConfiguration("Base_3", "Base")
				.args({x: gjs.game.canvas.width - 65, y: gjs.game.canvas.height/2, rotation_speed: -0.5})
				.addComponent('Component_3')
				.setRenderer('Blue_Renderer');
		}
	});

	return new LogicBundle();
});

		

				