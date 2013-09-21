//TODO: Renderer
	//Can be attached to a game_object (DONE!)
		//Drawing API renderer. 
			//Contains the commands to draw something, lines, circles, etc. (DONE) 
			//Can be cached.
		//Bitmap rendering. Draws an image.

//TODO: Update main TODO in README.md

//TODO: Refactor folder structure, again

//=======================================//
//=======================================//
//=======================================//

//Implement event bubbling

//Figure out correct usage of centerX and centerY of game_object

//TODO: Component of game.js: Auto-resize

//TODO: assembler.js should be able to create objects dynamically and add them to the pool when done with them

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
//Con ese nombre y el scope puede hacer percha esa referencia.

//TODO: Boilerplate
	//TODO: Default main.js
	//TODO: Hook up project specific main.js with framework's bootstrap.js

//TODO: State machine that handles a closed object as a state with a start, update and finish

//TODO: Optimizations
//TODO: Optimize drawing method.
//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
//This will not be possible where procedural animations take place.

//TODO: Make a Sublime extension to generate all the boilerplater code, associated with a game_object file
//TODO: Add a description for each module
//TODO: Create some testing scenarios for all of the modules. Those will serve as demos aswell

//Implement a very simple object to save to and load from the user's computer.
	//TODO: Basic data types.
	//TODO: Maybe JSON strings.

define(['game',
		'collision/collision_resolver',
		'collision/circle_collider',
		'collision/polygon_collider',
		'collision/fixed_polygon_collider',
		'test_game_objects/basic_game_object',
		'test_game_objects/basic_container',
		'test_components/box_renderer',
		'assembler',
		'game_object_pool',
		'component_pool',
		'layers',
		'keyboard',
		'vector_2D'],

	function(game, collision_resolver, circle_collider, polygon_collider, fixed_polygon_collider, test, container, box_renderer, assembler, game_object_pool, component_pool, layers, keyboard, vector_2D) {

		var main = function(){};

		main.prototype.start = function() {
			game.on("init", this, function() {
				console.log("Init");

				component_pool.createPool("Collider_Circle", circle_collider, 5);
				component_pool.createPool("Collider_Polygon", polygon_collider, 5);
				component_pool.createPool("Collider_Fixed_Polygon", fixed_polygon_collider, 5);

				component_pool.createPool("Box_Renderer", box_renderer, 11);

				component_pool.createConfiguration("Collider_1", 'Collider_Circle');
				component_pool.createConfiguration("Collider_2", 'Collider_Polygon');
				component_pool.createConfiguration("Collider_3", 'Collider_Fixed_Polygon');

				component_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({color:'#FF0000'});
				component_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({color:'#00FF00'});
				component_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({color:'#0000FF'});
				component_pool.createConfiguration("White_Renderer", 'Box_Renderer').args({color:'#FFFFFF'});
				component_pool.createConfiguration("Yellow_Renderer", 'Box_Renderer').args({color:'#FFFF00'});

				game_object_pool.createPool("Base", test, 10);
				game_object_pool.createPool("Container", container, 1);

				game_object_pool.createConfiguration("Base_1", "Base")
					.args({x: 50, y: 50, rSpeed: 3})
					.addComponent('Collider_1', {id:'Green', radius:5})
					.setRenderer('Red_Renderer');

				game_object_pool.createConfiguration("Base_2", "Base")
					.args({x: 300, y: 300, rSpeed: 3 })
					.addComponent('Collider_1', {id:'Red', radius:10})
					.setRenderer('Green_Renderer');

				game_object_pool.createConfiguration("Base_3", "Base")
					.args({ x: 200, y: 200, rSpeed: 1, scaleX: 2})
					.addComponent('Collider_2', {id:'Red', points:[ new vector_2D(-10, -10), new vector_2D(10, -10), new vector_2D(10, 10), new vector_2D(-10, 10) ]})
					.setRenderer('Blue_Renderer');

				game_object_pool.createConfiguration("Base_4", "Base")
					.args({ x: 50, y: 50, rSpeed: 1})
					.addComponent('Collider_3', {id:'Green', points:[ new vector_2D(-10, -10), new vector_2D(10, -10), new vector_2D(10, 10), new vector_2D(-10, 10) ]})
					.setRenderer('White_Renderer');

				game_object_pool.createConfiguration("Container_1", "Container")
					.args({x: 100, y: 100})
					.addChild("Base_1")
					.setRenderer('Yellow_Renderer');

				collision_resolver.addCollisionPair('Green', 'Red');
			});

			game.on("pause", this, function() {
				console.log("Pause");
			});

			game.on("resume", this, function() {
				console.log("Resume");
			});

			var p = {}

			game.on("update", this, function() {
				if(!b1) return;

				if(keyboard.isDown(keyboard.GAME_RIGHT)) { b1.x++; }
				if(keyboard.isDown(keyboard.GAME_LEFT)) { b1.x--; }
				if(keyboard.isDown(keyboard.GAME_UP)) { b1.y--; }
				if(keyboard.isDown(keyboard.GAME_DOWN)) { b1.y++; }
			});

			keyboard.addUpCallback(keyboard.C, function() {
			
			});

			var b1;

			keyboard.addUpCallback(keyboard.A, function() {
				//b1 = layers.get('Back').add(assembler.get('Base_1'));
				//b1 = layers.get('Back').add(assembler.get('Container_1'));
				b1 = layers.get('Back').add(assembler.get('Base_4'));
				b1.start();				

				//layers.get('Back').add(assembler.get('Base_1')).start();
				//layers.get('Back').add(assembler.get('Base_2')).start();
			});

			keyboard.addUpCallback(keyboard.S, function() {
				layers.get('Back').add(assembler.get('Base_3')).start();
			});

			keyboard.addUpCallback(keyboard.D, function() {

			});

			keyboard.addUpCallback(keyboard.Z, function() {
				
			});
		}

		return new main()
	}
);