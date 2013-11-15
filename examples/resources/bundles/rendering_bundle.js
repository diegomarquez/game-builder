gjs.setModulePath('basic_game_object');

define(function(require) {
	var Bundle = require('bundle');

	var basic_game_object = require('basic_game_object');
	var bitmap_renderer = require('bitmap_renderer');

	var RenderingBundle = Bundle.extend({
		create: function() {
			gjs.co_pool.createPool("Bitmap_Renderer", bitmap_renderer, 3);

			gjs.co_pool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: '../resources/images/80343865.jpg'});
			gjs.co_pool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path:'../resources/images/80343865.jpg'});

			gjs.go_pool.createPool("Base", basic_game_object, 3); 

			gjs.go_pool.createConfiguration("Base_1", "Base")
				.args({x: gjs.canvas.width/2 - 100, y: gjs.canvas.height/2, rotation_speed: -2, scaleX: 2})
				.setRenderer('Pear_1');

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({x: gjs.canvas.width/2 + 100, y: gjs.canvas.height/2, rotation_speed: 2})
				.setRenderer('Pear_2');

			gjs.go_pool.createConfiguration("Base_3", "Base")
				.args({x: gjs.canvas.width/2, y: gjs.canvas.height/2 + 100, rotation_speed: 1})
				//BONUS: you can override the configuration of a component/renderer or just add additional parameters.
				//The object after the ID will be merged with the one set through createConfiguration
				.setRenderer('Pear_1', { width: 20, height: 20 });
		}
	});

	return new RenderingBundle();
});

		

				