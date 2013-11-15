gjs.setModulePath('basic_game_object');
gjs.setModulePath('box_renderer');

define(function(require) {
	var Bundle = require('bundle');

	var basic_game_object = require('basic_game_object'); 
	var box_renderer = require('box_renderer');

	var CollidersBundle = Bundle.extend({
		create: function() {
			gjs.go_pool.createPool("Base", basic_game_object, 20);
			gjs.co_pool.createPool("Box_Renderer", box_renderer, 20);

			gjs.co_pool.createConfiguration("Small_box", 'Box_Renderer').args({offsetX: -10, offsetY: -10, width: 20, height: 20});

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({x: 200, y: 200, rotation_speed: 2})
				.setRenderer('Small_box');
		}
	});

	return new CollidersBundle();
});

		

				