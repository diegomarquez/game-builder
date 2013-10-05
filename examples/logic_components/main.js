define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			gamejs.game.on("init", this, function() {
				
				//This example demonstrates the use of components.
				//These are reusable modules that can be attached to different kinds of game_objects. 

				//A game object can has as many components as you like.
				//The order of execution will be in the order they were added.

				//This example will be using a rather useless component.
				//It will make the associated game_object twitch like crazy, according to
				//a number we pass in when configuring it.
				
				basic_game_object = require('../resources/basic_game_object'); 
				box_renderer = require('../resources/box_renderer');		

				//The cleverly named component we will be using in this example
				component = require('../resources/component_1');

				//Nothing new in this part of the setup
				gamejs.co_pool.createPool("Box_Renderer", box_renderer, 3);
				gamejs.co_pool.createPool("Component", component, 3);

				gamejs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:  '#FF0000', offsetX: -10, offsetY: -10, width: 20, height: 20});
				gamejs.co_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({color:'#00FF00', offsetX: -10, offsetY: -10, width: 20, height: 20});
				gamejs.co_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({color: '#0000FF', offsetX: -10, offsetY: -10, width: 20, height: 20});

				//Creating the different configurations for the same type of component
				gamejs.co_pool.createConfiguration("Component_1", 'Component').args({amount:2});
				gamejs.co_pool.createConfiguration("Component_2", 'Component').args({amount:5});
				gamejs.co_pool.createConfiguration("Component_3", 'Component').args({amount:15});

				gamejs.go_pool.createPool("Base", basic_game_object, 3); 

				gamejs.go_pool.createConfiguration("Base_1", "Base")
					.args({x: gamejs.game.canvas.width*1/3 - 65, y: gamejs.game.canvas.height/2, rotation_speed: 2})
					.addComponent('Component_1')
					.setRenderer('Red_Renderer');

				gamejs.go_pool.createConfiguration("Base_2", "Base")
					.args({x: gamejs.game.canvas.width*2/3 - 65, y: gamejs.game.canvas.height/2, rotation_speed: 1})
					.addComponent('Component_2')
					.setRenderer('Green_Renderer');

				gamejs.go_pool.createConfiguration("Base_3", "Base")
					.args({x: gamejs.game.canvas.width - 65, y: gamejs.game.canvas.height/2, rotation_speed: -0.5})
					.addComponent('Component_3')
					.setRenderer('Blue_Renderer');
				
				gamejs.layers.get('Middle').add(gamejs.assembler.get('Base_1')).start();
				gamejs.layers.get('Middle').add(gamejs.assembler.get('Base_2')).start();	
				gamejs.layers.get('Middle').add(gamejs.assembler.get('Base_3')).start();	
			});
		}

		return new main()
	}
);