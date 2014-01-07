define(function(require) {
	var basic_game_object = require('basic-game-object'); 
	var box_renderer = require('box-renderer');

	var CollidersBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("box-renderer", box_renderer);
			
			this.componentPool.createConfiguration("Small_box", 'box-renderer')
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

		

				