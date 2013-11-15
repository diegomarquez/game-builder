gjs.setModulePath('basic_game_object');
gjs.setModulePath('box_renderer');
gjs.setModulePath('basic_container');

define(function(require) {
	var Bundle = require('bundle');

	var container = require('basic_container');
	var basic_game_object = require('basic_game_object'); 
	var box_renderer = require('box_renderer');

	var NestingBundle = Bundle.extend({
		create: function() {
			gjs.co_pool.createPool("Box_Renderer", box_renderer, 4);

			gjs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:  '#FF0000', offsetX: -10, offsetY: -10, width: 20, height: 20});
			gjs.co_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({color:'#00FF00', offsetX: -10, offsetY: -10, width: 20, height: 20});
			gjs.co_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({color: '#0000FF', offsetX: -10, offsetY: -10, width: 20, height: 20});
			gjs.co_pool.createConfiguration("White_Renderer", 'Box_Renderer').args({color:'#FFFFFF', offsetX: -10, offsetY: -10, width: 20, height: 20});

			gjs.go_pool.createPool("Base", basic_game_object, 3);
			gjs.go_pool.createPool("Container", container, 1);

			//Here we can see that the x and y properties of a game_object are relative to 
			//the respective parent. In the previous example since the parent was the root,
			//the position seemed like canvas coordinates
			gjs.go_pool.createConfiguration("Base_1", "Base")
				.args({x: 0, y: -50, rotation_speed: 2})
				.setRenderer('Red_Renderer');

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({x: 35, y: 35, rotation_speed: 1})
				.setRenderer('Green_Renderer');

			gjs.go_pool.createConfiguration("Base_3", "Base")
				.args({x: -35, y: 35, rotation_speed: 0.5})
				.setRenderer('Blue_Renderer');

			//Here a configuration for a Container is created, it has 3 childs,
			//among other things
			gjs.go_pool.createConfiguration("Container_1", "Container")
				.args({x: gjs.game.canvas.width/2, y: gjs.game.canvas.height/2})
				.addChild("Base_1")
				.addChild("Base_2")
				.addChild("Base_3")
				.setRenderer('White_Renderer');
		}
	});

	return new NestingBundle();
});

		

				