define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			gjs.game.on("init", this, function() {
				
				//This example will be showing how to setup some colliders for our game_objects
				//Nothing fancy here, no per pixel collision, no broad-phase of any sort and no projection.

				//Only basic collision detection. Things overlap or they don't. That is it.

				//You can setup collision pairs and choose between a circular or polygonal collider.
				//Then the first collection of colliders in a pair will test against against the second collection for overlapping.

				//Very basic, but get's the job done in a lot of cases. 
				//Think you can do it better? Be my guest :) 
				//Really, be a good person and do it better, because this is pretty lame.

				//Anyway...

				//As usual this guys are here so we can see something
				var basic_game_object = require('../resources/basic_game_object'); 
				var bitmap_renderer = require('bitmap_renderer');

				//This are the different collider types available. Every type can collide against every type.
				var circle_collider = require('circle');
				var polygon_collider = require('polygon');
				var fixed_polygon_collider = require('fixed_polygon');

				//This guy will be responsible for making everything work. And for setting collision pairs.
				//More on that later
				var collision_resolver = require('collision_resolver');
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
				
				gjs.co_pool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: '../resources/80343865.jpg'});
				gjs.co_pool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path:'../resources/80343865.jpg'});

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

				//Setting up collision pairs. The IDs used correspond to the ones in the colliders configuration.
				//All colliders with ID 'Circle_1' will check for overlapping against all colliders with ID 'Polygon_1'
				collision_resolver.addCollisionPair('Circle_Collider_ID', 'Polygon_Collider_ID');
				//All colliders with ID 'Circle_1' will check for overlapping against all colliders with ID 'Fixed_Polygon_1'
				collision_resolver.addCollisionPair('Circle_Collider_ID', 'Fixed_Polygon_Collider_ID');
				//All colliders with ID 'Fixed_Polygon_1' will check for overlapping against all colliders with ID 'Polygon_1'
				collision_resolver.addCollisionPair('Fixed_Polygon_Collider_ID', 'Polygon_Collider_ID');		

				gjs.layers.get('Middle').add(gjs.assembler.get('Base_1')).start();
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();		
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_3')).start();
			});
		}

		return new main()
	}
);