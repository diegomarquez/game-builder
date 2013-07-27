//TODO: Plugins
	//Collision
		//TODO: Objeto collidable, que contenga la logica de como colisionar, con quien colisionar y todo eso.
			//main_container ejecuta un evento donde va todo lo que queres hacer con un objeto despues del update
			//Dicho objeto esta ultra acoplado con la implementacion de deteccion de colision, pero no con main_container
		//TODO: Be able to configure hitArea.
		//TODO: Multiple hit areas for a single GameObject
		//TODO: Hit area should follow the tranformation of it's owner.
			//TODO: Usar el metodo transformPoint para manejar la posicion de los vertices de un poligono.

	//Auto-resize

//TODO: Boilerplate
	//TODO: Bootstrap file
		//Configure RequireJS
		//Load all the core files
	//TODO: Ready made, empty files.
		//Pool creation
		//Configuration creation

//Implement event bubbling

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
		//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
		//Con ese nombre y el scope puede hacer percha esa referencia.

//Implement a very simple object to save to and load from the user's computer.
	//TODO: Basic data types.
	//TODO: Maybe JSON strings.

//TODO: Optimizations
//TODO: Optimize drawing method.
	//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
	//This will not be possible where procedural animations take place. Like the eye of the Boss or its tentacles. But things like Rockets and particles could be cached.
//TODO: Reduce memory Footprint.

//TODO: Make a Sublime extension to generate all the boilerplater code, associated with a game_object file
//TODO: Add a description for each module
//TODO: Create some testing scenarios for all of the modules. Those will serve as demos aswell

require(
	[
		'domReady!',
		'game',
		'test_game_objects/basic_game_object',
		'test_game_objects/basic_container',
		'main_container',
		'keyboard',
		'draw'
	],

	function(doc, game, test, test_container, main_container, keyboard, draw) {

		main_container.setDefaultLayer(2);

		game.on("init", this, function() {
			console.log("Init");

			main_container.createTypePool("Base", test, 10);

			main_container.createTypePool("Container", test_container, 1);

			main_container.createTypeConfiguration("Base_1", "Base");
			main_container.createTypeConfiguration("Container_1", "Container");
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

			if(go) {
				draw.rectangle(game.context, go.getTransform().x, go.getTransform().y, 1, 1, null, '#00ff00', 1);
			}
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

		var go;

		keyboard.addUpCallback(keyboard.D, function() {
			var c = main_container.add("Container_1");

			go = main_container.add("Base_1", [50, 50, 2, "#ffff00"]);

			c.x = 100;
			c.y = 100;

			c.add(go);
		});

		

		game.create(document.getElementById('main'), document.getElementById('game'));
	}
);