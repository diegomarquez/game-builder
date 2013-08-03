//Setup to use root.js (DONE!)

//Have predefined layers (game_object_containers) as childs of root
	//Back
	//Middle
	//Front
	//Hud
	//Popup

//A layer to add things to may be supplied on the factory configuration, default is middle.

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

//TODO: Add dynamic creation of game_objects. With a posibility to save them a pool after they have been used.

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
		'factory',
		'root',
		'keyboard',
		'draw'
	],

	function(doc, game, test, test_container, test_component, factory, root, keyboard, draw) {

		game.on("init", this, function() {
			console.log("Init");

			factory.createGameObjectPool("Base", test, 10);
			factory.createGameObjectPool("Container", test_container, 1);

			factory.createComponentPool("Component", test_component, 5);
			factory.createComponentConfiguration("Component_1", 'Component', {rotationSpeed:3})
			factory.createComponentConfiguration("Component_2", 'Component', {rotationSpeed:10})

			factory.createGameObjectConfiguration("Base_1", "Base").args({x:50, y:50, rSpeed:3, color:'#00ff00'});
			factory.createGameObjectConfiguration("Base_2", "Base").addComponent("Component_1");

			factory.createGameObjectConfiguration("Container_1", "Container").addComponent("Component_2").addChild("Base_1");
			factory.createGameObjectConfiguration("Container_2", "Container");
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
			root.update(game.delta, game.isPaused);
			root.transformAndDraw(game.context);

			if(keyboard.isDown(keyboard.GAME_LEFT)) {
				root.x--
			}
			if(keyboard.isDown(keyboard.GAME_RIGHT)) {
				root.x++
			}
			if(keyboard.isDown(keyboard.GAME_UP)) {
				root.y--
			}
			if(keyboard.isDown(keyboard.GAME_DOWN)) {
				root.y++
			}
		});

		keyboard.addUpCallback(keyboard.C, function() {
			root.clear();

			console.log(factory.toString());
		});		

		keyboard.addUpCallback(keyboard.A, function() {
			var x = (Math.random() * game.canvas.width);
			var y = (Math.random() * game.canvas.height);

			var rSpeed = Math.random() * 3;
			var color = "#" + (Math.random().toString(16) + '000000').slice(2, 8);

			root.add(factory.get("Base_1")).start(x, y, rSpeed, color);
		});

		keyboard.addUpCallback(keyboard.S, function() {
			var x = (Math.random() * game.canvas.width);
			var y = (Math.random() * game.canvas.height);

			var rSpeed = Math.random() * 3;
			var color = "#" + (Math.random().toString(16) + '000000').slice(2, 8);

			root.add(factory.get("Base_2")).start(x, y, rSpeed, color);
		});

		keyboard.addUpCallback(keyboard.D, function() {
			var x = (Math.random() * game.canvas.width);
			var y = (Math.random() * game.canvas.height);

			root.add(factory.get("Container_1")).start(x, y);
		});

		var c;

		keyboard.addUpCallback(keyboard.Z, function() {
			var x = (Math.random() * game.canvas.width);
			var y = (Math.random() * game.canvas.height);

			c = factory.get("Container_2");

			root.add(c).start(x, y);
		});

		keyboard.addUpCallback(keyboard.X, function() {
			var x = 100;
			var y = 100;

			var rSpeed = Math.random() * 3;
			var color = "#" + (Math.random().toString(16) + '000000').slice(2, 8);

			var child = factory.get("Base_1");
			child.start(x, y, rSpeed, color);
			c.add(child)
		});

		game.create(document.getElementById('main'), document.getElementById('game'));
	}
);