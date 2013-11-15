gjs.setModulePath('basic_game_object');

define(function(require) {
	var Bundle = require('bundle');

	var basic_game_object = require('basic_game_object'); 
	var bitmap_renderer = require('bitmap_renderer');

	//This are the different collider types available. Every type can collide against every type.
	var circle_collider = require('circle');
	var polygon_collider = require('polygon');
	var fixed_polygon_collider = require('fixed_polygon');

	var CollidersBundle = Bundle.extend({
		create: function() {
				//This is needed to setup polygon colliders.
				var vector_2D = require('vector_2D');		

				//Creating the pools for the colliders
				gjs.co_pool.createPool("Circle", circle_collider, 1);
				gjs.co_pool.createPool("Polygon", polygon_collider, 1);
				gjs.co_pool.createPool("Fixed_Polygon", fixed_polygon_collider, 1);

				//The circle collider is the simplest of the three. It's just a circle, it has a radius.
				gjs.co_pool.createConfiguration("Circle_1", 'Circle')
					.args({id:'Circle_Collider_ID', radius:10});
				
				//The polygon collider is defined by a set of points relative to the x and y coordinates of the game_object.
				//This collider WILL TRANSFORM if the parent rotates or scales. 
				gjs.co_pool.createConfiguration("Polygon_1", 'Polygon')
					.args({id:'Polygon_Collider_ID', points:[ new vector_2D(0, 0), new vector_2D(64, 0), new vector_2D(64, 64), new vector_2D(0, 64) ]});

				//The fixed_polygon collider is defined by a set of points relative to the center of the game_object.
				//This collider WILL NOT TRANSFORM if the parent rotates or scales. For that reason is is less expensive than the polygon collider.
				//In some cases it might just be enough.
				gjs.co_pool.createConfiguration("Fixed_Polygon_1", 'Fixed_Polygon')
					.args({id:'Fixed_Polygon_Collider_ID', points:[ new vector_2D(-10, -10), new vector_2D(10, -10), new vector_2D(10, 10), new vector_2D(-10, 10) ]});

				gjs.co_pool.createPool("Bitmap_Renderer", bitmap_renderer, 3);
				
				gjs.co_pool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: '../resources/images/80343865.jpg'});
				gjs.co_pool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path:'../resources/images/80343865.jpg'});

				gjs.go_pool.createPool("Base", basic_game_object, 3); 

				//When adding a collider component to a game_object, the game_object will need to define an onCollide method
				//Otherwise, you will get an error.
				//Might change in the future, haven't figured out what is the best way to do this yet
				
				//The 'debug' property of game_object will draw the colliders so it is easier to understand what is going on. It is false by default
				gjs.go_pool.createConfiguration("Base_1", "Base")
					.args({x: gjs.canvas.width/2 + 50, y: gjs.canvas.height/2 - 50, rotation_speed: -2, scaleX: 2, debug: true})
					.addComponent('Circle_1')
					.setRenderer('Pear_1');

				gjs.go_pool.createConfiguration("Base_2", "Base")
					.args({x: gjs.canvas.width/2 + 100, y: gjs.canvas.height/2, rotation_speed: 2, debug: true})
					.addComponent('Polygon_1')
					.setRenderer('Pear_2');

				gjs.go_pool.createConfiguration("Base_3", "Base")
					.args({x: gjs.canvas.width/2 + 50, y: gjs.canvas.height/2 + 50, rotation_speed: 1, debug: true})
					.addComponent('Fixed_Polygon_1')
					.setRenderer('Pear_1', { width: 20, height: 20 });
		}
	});

	return new CollidersBundle();
});

		

				