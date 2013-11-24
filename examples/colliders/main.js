//This example will be showing how to setup some colliders for our game_objects
//Nothing fancy here, no per pixel collision, no broad-phase of any sort and no projection.

//Only basic collision detection. Things overlap or they don't. That is it.

//You can setup collision pairs and choose between a circular or polygonal collider.
//Then the first collection of colliders in a pair will test against against the second collection for overlapping.

//Very basic, but get's the job done in a lot of cases. 
//Think you can do it better? Be my guest :) 
//Really, be a good person and do it better, because this is pretty lame.

//Anyway...

gjs.setModulePath('colliders_bundle');

define(function(require) {
		var main = function(){
			gjs.game.on("init", this, function() {
				//This pool setup bundle creates all the things this example will be using
				require('colliders_bundle').create();

				//This guy will be responsible for making everything work. And for setting collision pairs.
				//More on that later
				var collision_resolver = require('collision_resolver');

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
		};

		return new main()
	}
);