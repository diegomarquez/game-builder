define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			gjs.game.on("init", this, function() {
				
				//Here we will be taking a look mainly at a renderer to draw images.
				//Something a bit more interesting than the squares thus far.

				var basic_game_object = require('../resources/basic_game_object');
				//This renderer is part of the framework, so there is no need to set relative paths 
				var bitmap_renderer = require('bitmap_renderer');		

				//Nothing new in this part of the setup
				gjs.co_pool.createPool("Bitmap_Renderer", bitmap_renderer, 3);

				gjs.co_pool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: '../resources/80343865.jpg'});
				gjs.co_pool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path:'../resources/80343865.jpg'});

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

				gjs.layers.get('Middle').add(gjs.assembler.get('Base_1')).start();
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();		
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_3')).start();		
			});
		}

		return new main()
	}
);