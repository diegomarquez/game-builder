define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			gamejs.game.on("init", this, function() {
				
				//This example demonstrates the use of layers. 
				//In reality it is just a fancy name for the containers of the previous example.
				//The difference being that these are dedicated to help in organizing what gets drawn and when.
				
				basic_game_object = require('./concrete_game_objects/basic_game_object'); 
				box_renderer = require('./concrete_components/box_renderer');		

				//Nothing new in this part of the setup
				gamejs.co_pool.createPool("Box_Renderer", box_renderer, 3);

				gamejs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:'#FF0000'});
				gamejs.co_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({color:'#00FF00'});
				gamejs.co_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({color:'#0000FF'});

				gamejs.go_pool.createPool("Base", basic_game_object, 3);

				gamejs.go_pool.createConfiguration("Base_1", "Base")
					.args({x: gamejs.game.canvas.width/2, y: gamejs.game.canvas.height/2, rotation_speed: 2})
					.setRenderer('Red_Renderer');

				gamejs.go_pool.createConfiguration("Base_2", "Base")
					.args({x: gamejs.game.canvas.width/2, y: gamejs.game.canvas.height/2, rotation_speed: 1})
					.setRenderer('Green_Renderer');

				gamejs.go_pool.createConfiguration("Base_3", "Base")
					.args({x: gamejs.game.canvas.width/2, y: gamejs.game.canvas.height/2, rotation_speed: -0.5})
					.setRenderer('Blue_Renderer');

				//Here each game_object is added to a different layer
				//There are 6 layers by default.
				//Back, Middle, Front, Text, Hud, Popup.
				//For the kind of projects this framework is scoped for, that should be more than enough.
				gamejs.layers.get('Front').add(gamejs.assembler.get('Base_3')).start();
				gamejs.layers.get('Middle').add(gamejs.assembler.get('Base_2')).start();
				gamejs.layers.get('Back').add(gamejs.assembler.get('Base_1')).start();	

				//Since layers are containers which in turn are game_objects, 
				//theoretically you should be able to do fancy things with them to achieve
				//some cool effects.		

				//Maybe in another example.
			});
		}

		return new main()
	}
);