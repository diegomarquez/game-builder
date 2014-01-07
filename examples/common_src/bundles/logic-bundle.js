define(function(require) {	
	var basic_game_object = require('basic-game-object'); 
	var box_renderer = require('box-renderer');		
	//The cleverly named component we will be using in this example
	var component = require('component-1');

	var LogicBundle = require('bundle').extend({
		create: function() {
			//Nothing new in this part of the setup
			this.componentPool.createPool("Box_Renderer", box_renderer);
			this.componentPool.createPool("Component", component);

			this.componentPool.createConfiguration("Red_Renderer", 'Box_Renderer')
				.args({color:  '#FF0000', offsetX: -10, offsetY: -10, width: 20, height: 20});
			this.componentPool.createConfiguration("Green_Renderer", 'Box_Renderer')
				.args({color:'#00FF00', offsetX: -10, offsetY: -10, width: 20, height: 20});
			this.componentPool.createConfiguration("Blue_Renderer", 'Box_Renderer')
				.args({color: '#0000FF', offsetX: -10, offsetY: -10, width: 20, height: 20});

			//Creating the different configurations for the same type of component
			this.componentPool.createConfiguration("Component_1", 'Component').args({amount:2});
			this.componentPool.createConfiguration("Component_2", 'Component').args({amount:5});
			this.componentPool.createConfiguration("Component_3", 'Component').args({amount:15});

			this.gameObjectPool.createPool("Base", basic_game_object, 3); 

			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({x: this.canvas.width*1/3 - 65, y: this.canvas.height/2, rotation_speed: 2})
				.addComponent('Component_1')
				.setRenderer('Red_Renderer');

			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: this.canvas.width*2/3 - 65, y: this.canvas.height/2, rotation_speed: 1})
				.addComponent('Component_2')
				.setRenderer('Green_Renderer');

			this.gameObjectPool.createConfiguration("Base_3", "Base")
				.args({x: this.canvas.width - 65, y: this.canvas.height/2, rotation_speed: -0.5})
				.addComponent('Component_3')
				.setRenderer('Blue_Renderer');
		}
	});

	return new LogicBundle();
});

		

				