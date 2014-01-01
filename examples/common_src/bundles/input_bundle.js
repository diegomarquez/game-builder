define(function(require) {
	var basic_game_object = require('basic_game_object'); 
	var box_renderer = require('box_renderer');

	var CollidersBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("Box_Renderer", box_renderer);
			
			this.componentPool.createConfiguration("Small_box", 'Box_Renderer')
				.args({
						offsetX: -10, 
						offsetY: -10, 
						width: 20, 
						height: 20
					});

			this.gameObjectPool.createPool("Base", basic_game_object, 20);
			
			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: 200, y: 200, rotation_speed: 2})
				.setRenderer('Small_box');
		}
	});

	return new CollidersBundle();
});

		

				