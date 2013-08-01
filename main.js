//Redo the little tests in this file so they work with the new root system

//TODO: Component: Collision
		//TODO: Object that will hold the collision pair configurations and later will be used by the colliders to ask with who they need to collide
		//TODO: Be able to configure hitArea.
		//TODO: Multiple hit areas for a single GameObject. Set a name so that a specific onCollide method can be added dynamically to a game_object on creation
		//TODO: Hit area should follow the tranformation of it's owner.
			//TODO: Usar el metodo transformPoint para manejar la posicion de los vertices de un poligono.
		
		//TODO: Some old code from game_object, might be usefull to remember it
			// this.collisionId;
			// this.checkingCollisions;

			// onCollide: function(other) {},
			// getColliderType: function() {},
			// getCollider: function() {},

			//GameObject.CIRCLE_COLLIDER = 0;
			//GameObject.POLYGON_COLLIDER = 1;

			//var collisionType = configuration.collisionType;

			//This id will be used for collision detection groups
			//pooledObject.collisionId = collisionType;

			//This sets if the object will check for collisions or not
			//pooledObject.checkingCollisions = (collisionType != "");

//TODO: Update main TODO in README.md

//Implement event bubbling

//TODO: Component of game.js: Auto-resize

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
		//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
		//Con ese nombre y el scope puede hacer percha esa referencia.

//TODO: Put all the things related to RequireJS in a proper folder

//TODO: Boilerplate
	//TODO: Bootstrap file
		//Configure RequireJS
		//Load all the core files
	//TODO: Ready made, empty files.
		//Pool creation
		//Configuration creation

//TODO: State machine that handles a closed object as a state with a start, update and finish

//Implement a very simple object to save to and load from the user's computer.
	//TODO: Basic data types.
	//TODO: Maybe JSON strings.

//TODO: Decouple drawing from game_object

//TODO: Optimizations
//TODO: Optimize drawing method.
	//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
	//This will not be possible where procedural animations take place.

//TODO: Make a Sublime extension to generate all the boilerplater code, associated with a game_object file
//TODO: Add a description for each module
//TODO: Create some testing scenarios for all of the modules. Those will serve as demos aswell

require(
	[
		'domReady!',
		'game',
		'test_game_objects/basic_game_object',
		'test_game_objects/basic_container',
		'test_components/test_component',
		'main_container',
		'keyboard',
		'draw'
	],

	function(doc, game, test, test_container, test_component, main_container, keyboard, draw) {

		main_container.setDefaultLayer(2);

		game.on("init", this, function() {
			console.log("Init");

			main_container.createTypePool("Base", test, 10);
			main_container.createTypePool("Container", test_container, 1);

			main_container.createComponentPool("Component", test_component, 1);

			main_container.createComponentConfiguration("Component_1", 'Component', {rotationSpeed:3})

			main_container.createObjectConfiguration("Base_1", "Base");
			main_container.createObjectConfiguration("Base_2", "Base").addComponent("Component_1");
			main_container.createObjectConfiguration("Container_1", "Container");
		});

		game.on("pause", this, function() {
			// TimeOutFactory.pauseAllTimeOuts();
			// ArrowKeyHandler.pause();
			// SoundPlayer.pauseAll();
			console.log("Pause");
		});

		game.on("resume", this, function() {
			// TimeOutFactory.resumeAllTimeOuts();
			// ArrowKeyHandler.resume();
			// SoundPlayer.resumeAll();
			console.log("Resume");
		});

		game.on("update", this, function() {
			main_container.update(game.delta, game.isPaused);
			main_container.draw(game.context);
		});

		keyboard.addUpCallback(keyboard.A, function() {
			var bla = main_container.add("Base_1", [
				(Math.random() * 200) + 20, 
				(Math.random() * 200) + 20,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);
		});

		keyboard.addUpCallback(keyboard.S, function() {
			main_container.add("Base_1", [100, 100,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);

			main_container.add("Base_1", [200, 200,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);

			main_container.add("Base_1", [300, 300,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);

			main_container.add("Base_1", [300, 100,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);

			main_container.add("Base_1", [100, 300,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);
		});

		var c;

		keyboard.addUpCallback(keyboard.D, function() {
			
			var c1 = main_container.add("Container_1");

			if(c1) {
				var go = main_container.add("Base_1", [50, 50, 2, "#ffff00"]);
				
				c = c1;
				c.add(go);
			}

			c.x = (Math.random() * 200) + 20;
			c.y = (Math.random() * 200) + 20;
		});

		keyboard.addUpCallback(keyboard.Z, function() {
			main_container.add("Base_2", [150, 150, 0, "#ffffff"]);
		});

		game.create(document.getElementById('main'), document.getElementById('game'));
	}
);