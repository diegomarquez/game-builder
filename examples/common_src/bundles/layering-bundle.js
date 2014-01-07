define(function(require) {	
	var basic_game_object = require('basic-game-object'); 
	var box_renderer = require('box-renderer');

	var LayeringBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("box-renderer", box_renderer);

			this.componentPool.createConfiguration("Red_Renderer", 'box-renderer').args({
				color: '#FF0000',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			this.componentPool.createConfiguration("Green_Renderer", 'box-renderer').args({
				color: '#00FF00',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			this.componentPool.createConfiguration("Blue_Renderer", 'box-renderer').args({
				color: '#0000FF',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			this.gameObjectPool.createPool("Base", basic_game_object, 3);

			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({
					x: this.canvas.width / 2,
					y: this.canvas.height / 2,
					rotation_speed: 2
				})
				.setRenderer('Red_Renderer');

			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({
					x: this.canvas.width / 2,
					y: this.canvas.height / 2,
					rotation_speed: 1
				})
				.setRenderer('Green_Renderer');

			this.gameObjectPool.createConfiguration("Base_3", "Base")
				.args({
					x: this.canvas.width / 2,
					y: this.canvas.height / 2,
					rotation_speed: -0.5
				})
				.setRenderer('Blue_Renderer');
		}
	});

	return new LayeringBundle();
});
