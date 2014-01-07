define(function(require) {
	var container = require('basic-container');
	var basic_game_object = require('basic-game-object'); 
	var box_renderer = require('box-renderer');

	var NestingBundle = require('bundle').extend({
		create: function() {
			//Create a 'basic-game-object' components pool and give it the id 'Base'
			// Note: In this particular example this pool only uses objects which will be childs of a container.
			// For that reason it is not needed to specify an amount. The amount needed will be infered from
			// from the amount of parent game objects using those children.
			this.gameObjectPool.createPool("Base", basic_game_object);

			//Create a 'container' components pool and give it the id 'Container'
			// For this example we will be using 1 container.
			this.gameObjectPool.createPool("Container", container, 2);

			//Here we can see that the x and y properties of a game-object are relative to 
			//the respective parent. In the previous example since the parent was the root,
			//the position seemed like canvas coordinates
			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({x: 0, y: -50, rotation_speed: 2})
				.setRenderer('Red_Renderer');

			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: 35, y: 35, rotation_speed: 1})
				.setRenderer('Green_Renderer');

			this.gameObjectPool.createConfiguration("Base_3", "Base")
				.args({x: -35, y: 35, rotation_speed: 0.5})
				.setRenderer('Blue_Renderer');

			//Here a configuration for a Container is created, it has 3 childs,
			//among other things
			this.gameObjectPool.createConfiguration("Container_1", "Container")
				.args({x: this.canvas.width/2, y: this.canvas.height/2})
				.addChild("Base_1")
				.addChild("Base_2")
				.addChild("Base_3")
				.setRenderer('White_Renderer');

			//Create a 'box-renderer' components pool and give it the id 'box-renderer'
			this.componentPool.createPool("Box_Renderer", box_renderer);

			//Create a few configurations for the components in the pool 'Box_Renderer'
			this.componentPool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:  '#FF0000', offsetX: -10, offsetY: -10, width: 20, height: 20});
			this.componentPool.createConfiguration("Green_Renderer", 'Box_Renderer').args({color:'#00FF00', offsetX: -10, offsetY: -10, width: 20, height: 20});
			this.componentPool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({color: '#0000FF', offsetX: -10, offsetY: -10, width: 20, height: 20});
			this.componentPool.createConfiguration("White_Renderer", 'Box_Renderer').args({color:'#FFFFFF', offsetX: -10, offsetY: -10, width: 20, height: 20});
		}
	});

	return new NestingBundle();
});

		

				