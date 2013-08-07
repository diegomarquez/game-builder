//TODO: Test collision detection
	//Translation, rotation and scaling according to parent matrix
		//Circle
		//Polygon
	//Draw hitarea

//TODO: Test specific configuration

//TODO: Component: Collision
	//TODO: Be able to configure hitArea.
	//TODO: Multiple hit areas for a single GameObject. Set a name so that a specific onCollide method can be added dynamically to a game_object on creation
	
//TODO: Component: Renderer
	//Drawing API renderer. Contains the commands to draw something. Can be cached.
	//Bitmap rendering. Draws an image.

//TODO: Update main TODO in README.md

//Implement event bubbling

//TODO: Component of game.js: Auto-resize

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
		'test_game_objects/basic_game_object',
		'test_game_objects/basic_container',
		'test_components/test_component',
		'factory',
		'layers',
		'keyboard'
	],

	function(game, collision_resolver, test, test_container, test_component, factory, layers, keyboard) {

		var main = function(){};

		main.prototype.start = function() {
			game.on("init", this, function() {
				console.log("Init");

				factory.createGameObjectPool("Base", test, 10);
				factory.createGameObjectPool("Container", test_container, 1);

				//factory.createComponentPool("Component", test_component, 5);
				
				// factory.createComponentConfiguration("Component_1", 'Component', {
				// 	rotationSpeed: 3
				// });
				// factory.createComponentConfiguration("Component_2", 'Component', {
				// 	rotationSpeed: 10
				// });

				factory.createGameObjectConfiguration("Base_1", "Base").args({
					x: 50,
					y: 50,
					rSpeed: 3,
					color: '#00ff00'
				});
				
				// factory.createGameObjectConfiguration("Base_2", "Base").addComponent("Component_1");
				// factory.createGameObjectConfiguration("Container_1", "Container").addComponent("Component_2").addChild("Base_1");
				// factory.createGameObjectConfiguration("Container_2", "Container");
			});

			game.on("pause", this, function() {
				console.log("Pause");
			});

			game.on("resume", this, function() {
				console.log("Resume");
			});

			game.on("update", this, function() {
				
			});

			keyboard.addUpCallback(keyboard.C, function() {
			
			});

			keyboard.addUpCallback(keyboard.A, function() {
			
			});

			keyboard.addUpCallback(keyboard.S, function() {
		
			});

			keyboard.addUpCallback(keyboard.D, function() {

			});

			keyboard.addUpCallback(keyboard.Z, function() {
				
			});
		}

		return new main()
	}
);