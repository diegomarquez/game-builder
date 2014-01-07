define(function(require) {
	var basic_game_object = require('basic-game-object'); 
	var bitmap_renderer = require('bitmap-renderer');

	//This are the different collider types available.
	var circle_collider = require('circle-collider');
	var polygon_collider = require('polygon-collider');
	var fixed_polygon_collider = require('fixed-polygon-collider');
	//This is needed to setup polygon colliders.
	var vector_2D = require('vector-2D');

	var CollidersBundle = require('bundle').extend({
		create: function() {
			//Creating the pools for the colliders
			this.componentPool.createPool("Circle", circle_collider);
			this.componentPool.createPool("Polygon", polygon_collider);
			this.componentPool.createPool("Fixed_Polygon", fixed_polygon_collider);

			//The circle collider is the simplest of the three. It's just a circle, it has a radius.
			this.componentPool.createConfiguration("Circle_1", 'Circle')
				.args({id:'circle-collider_ID', radius:10});
			
			//The polygon collider is defined by a set of points relative to the x and y coordinates of the game-object.
			//This collider WILL TRANSFORM if the parent rotates or scales. 
			this.componentPool.createConfiguration("Polygon_1", 'Polygon')
				.args({id:'polygon-collider_ID', points:[ new vector_2D(0, 0), new vector_2D(64, 0), new vector_2D(64, 64), new vector_2D(0, 64) ]});

			//The fixed_polygon collider is defined by a set of points relative to the center of the game-object.
			//This collider WILL NOT TRANSFORM if the parent rotates or scales. For that reason is is less expensive than the polygon collider.
			//In some cases it might just be enough.
			this.componentPool.createConfiguration("Fixed_Polygon_1", 'Fixed_Polygon')
				.args({id:'fixed-polygon-collider_ID', points:[ new vector_2D(-10, -10), new vector_2D(10, -10), new vector_2D(10, 10), new vector_2D(-10, 10) ]});

			this.componentPool.createPool("Bitmap_Renderer", bitmap_renderer);
			
			this.componentPool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: '../common_assets/images/80343865.jpg'});
			this.componentPool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path:'../common_assets/images/80343865.jpg'});

			this.gameObjectPool.createPool("Base", basic_game_object, 3); 

			//When adding a collider component to a game-object, the game-object will need to define an onCollide method
			//Otherwise, you will get an error.
			//Might change in the future, haven't figured out what is the best way to do this yet
			
			//The 'debug' property of game-object will draw the colliders so it is easier to understand what is going on. It is false by default
			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({x: this.canvas.width/2 + 50, y: this.canvas.height/2 - 50, rotation_speed: -2, scaleX: 2, debug: true})
				.addComponent('Circle_1')
				.setRenderer('Pear_1');

			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: this.canvas.width/2 + 100, y: this.canvas.height/2, rotation_speed: 2, debug: true})
				.addComponent('Polygon_1')
				.setRenderer('Pear_2');

			this.gameObjectPool.createConfiguration("Base_3", "Base")
				.args({x: this.canvas.width/2 + 50, y: this.canvas.height/2 + 50, rotation_speed: 1, debug: true})
				.addComponent('Fixed_Polygon_1')
				.setRenderer('Pear_1', { width: 20, height: 20 });
		}
	});

	return new CollidersBundle();
});

		

				