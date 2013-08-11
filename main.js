//TODO: Polygon object with fixed vertex count and less expensive recalc method

//TODO: Component: Collision
	//TODO: Be able to configure hitArea.
	//TODO: Multiple hit areas for a single GameObject. Set a name so that a specific onCollide method can be added dynamically to a game_object on creation
	
//TODO: Renderer
	//Can be attached to anything. game_object and component
		//Drawing API renderer. Contains the commands to draw something. Can be cached.
		//Bitmap rendering. Draws an image.
	//Be able to turn off renderer through configuration

//TODO: Update main TODO in README.md

//=======================================//
//=======================================//
//=======================================//

//Implement event bubbling

//TODO: Component of game.js: Auto-resize

//TODO: Figure out something cool to better handle arguments sent to the start method of a game_object

//TODO: factory.js should be able to create objects dynamically and add them to the pool when done with them

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
//Con ese nombre y el scope puede hacer percha esa referencia.

//TODO: Boilerplate
	//TODO: Default main.js

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
		'factory',
		'layers',
		'keyboard',
		'vector_2D'],

	function(game, collision_resolver, circle_collider, polygon_collider, fixed_polygon_collider, test, container, factory, layers, keyboard, vector_2D) {

		var main = function(){};

		main.prototype.start = function() {
			game.on("init", this, function() {
				console.log("Init");

				collision_resolver.addCollisionPair('Green', 'Red');

				factory.createGameObjectPool("Base", test, 10);
				factory.createGameObjectPool("Container", container, 1);

				factory.createComponentPool("Collider_Circle", circle_collider, 5);
				factory.createComponentPool("Collider_Polygon", polygon_collider, 5);
				factory.createComponentPool("Collider_Fixed_Polygon", fixed_polygon_collider, 5);

				factory.createComponentConfiguration("Collider_1", 'Collider_Circle');
				factory.createComponentConfiguration("Collider_2", 'Collider_Polygon');
				factory.createComponentConfiguration("Collider_3", 'Collider_Fixed_Polygon');

				factory.createGameObjectConfiguration("Base_1", "Base").args({
					x: 50,
					y: 50,
					rSpeed: 3,
					color: '#00ff00'
				}).addComponent('Collider_1', {id:'Green', radius:5});

				factory.createGameObjectConfiguration("Base_2", "Base").args({
					x: 300,
					y: 300,
					rSpeed: 3,
					color: '#ff0000'
				}).addComponent('Collider_1', {id:'Red', radius:10});

				factory.createGameObjectConfiguration("Base_3", "Base").args({
					x: 200,
					y: 200,
					rSpeed: 1,
					color: '#ff00ff',
					scaleX: 2
				}).addComponent('Collider_2', {id:'Red', points:[
					new vector_2D(-10, -10),
					new vector_2D(10, -10),
					new vector_2D(10, 10),
					new vector_2D(-10, 10)
				]});

				factory.createGameObjectConfiguration("Base_4", "Base").args({
					x: 50,
					y: 50,
					rSpeed: 1,
					color: '#ff00ff'
				}).addComponent('Collider_3', {id:'Green', points:[
					new vector_2D(-10, -10),
					new vector_2D(10, -10),
					new vector_2D(10, 10),
					new vector_2D(-10, 10)
				]});

				factory.createGameObjectConfiguration("Container_1", "Container").args({
					x: 100,
					y: 100
				}).addChild("Base_1");

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

				if(keyboard.isDown(keyboard.GAME_RIGHT)) {
					b1.x++;
				}

				if(keyboard.isDown(keyboard.GAME_LEFT)) {
					b1.x--;	
				}

				if(keyboard.isDown(keyboard.GAME_UP)) {
					b1.y--;
				}

				if(keyboard.isDown(keyboard.GAME_DOWN)) {
					b1.y++;
				}
			});

			keyboard.addUpCallback(keyboard.C, function() {
			
			});

			var b1;

			keyboard.addUpCallback(keyboard.A, function() {
				//b1 = layers.get('Back').add(factory.get('Base_1'));
				//b1 = layers.get('Back').add(factory.get('Container_1'));
				b1 = layers.get('Back').add(factory.get('Base_4'));
				b1.start();				

				//layers.get('Back').add(factory.get('Base_1')).start();
				//layers.get('Back').add(factory.get('Base_2')).start();
			});

			keyboard.addUpCallback(keyboard.S, function() {
				layers.get('Back').add(factory.get('Base_3')).start();
			});

			keyboard.addUpCallback(keyboard.D, function() {

			});

			keyboard.addUpCallback(keyboard.Z, function() {
				
			});
		}

		return new main()
	}
);