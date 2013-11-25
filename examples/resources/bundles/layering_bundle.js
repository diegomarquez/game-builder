gjs.setModulePath('basic_game_object');
gjs.setModulePath('box_renderer');

define(function(require) {
	var Bundle = require('bundle');
	
	var basic_game_object = require('basic_game_object'); 
	var box_renderer = require('box_renderer');

	var LayeringBundle = Bundle.extend({
		create: function() {
			gjs.co_pool.createPool("Box_Renderer", box_renderer, 3);

			gjs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({
				color: '#FF0000',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});
			gjs.co_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({
				color: '#00FF00',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});
			gjs.co_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({
				color: '#0000FF',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			gjs.go_pool.createPool("Base", basic_game_object, 3);

			gjs.go_pool.createConfiguration("Base_1", "Base")
				.args({
					x: gjs.game.canvas.width / 2,
					y: gjs.game.canvas.height / 2,
					rotation_speed: 2
				})
				.setRenderer('Red_Renderer');

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({
					x: gjs.game.canvas.width / 2,
					y: gjs.game.canvas.height / 2,
					rotation_speed: 1
				})
				.setRenderer('Green_Renderer');

			gjs.go_pool.createConfiguration("Base_3", "Base")
				.args({
					x: gjs.game.canvas.width / 2,
					y: gjs.game.canvas.height / 2,
					rotation_speed: -0.5
				})
				.setRenderer('Blue_Renderer');
		}
	});

	return new LayeringBundle();
});

		

				