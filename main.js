//TODO: Implementar transformacion de los game_objects
	//Afanarme solo lo indispensable de EaselJS.
		//Afanar de Matrix2D.js
		//Agregar un objeto matrix a game_object
			//Las propiedades que manejan la transformacion en 2D de un objeto pasarian a ser setters y getters del objeto matrix que esta por debajo
		//Ver como se tienen que comportar los metodos de dibujado y update para aplicar correctamente las matrices
			//Ver como lo hacen DisplayObject.js y Container.js en EaselJS


//TODO: Plugins

	//Collision
		//TODO: Redo the collision handling, it should be decoupled from the main_container update loop
		//TODO: Be able to configure hitArea.
		//TODO: Stop using the cumbersome GameObjectUtils file
		//TODO: Multiple hit areas for a single GameObject
		//TODO: Hit area should follow the tranformation of it's owner.
			//Position

	//Auto-resize

//TODO: game_objects with a parent should not be updated or drawn in the main container


//TODO: Ready made, empty files
	//Pool creation
	//Configuration creation

//Implement event bubbling

//Implement a very simple object to save to and load from the user's computer.
	//TODO: Basic data types.
	//TODO: Maybe JSON strings.

//TODO: Bootstrap file
	//Configure RequireJS
	//Load all the core files

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
		//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
		//Con ese nombre y el scope puede hacer percha esa referencia.

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
		'keyboard'
	],

	function(doc, game, test, test_container, main_container, keyboard) {

		main_container.setDefaultLayer(2);

		game.on("init", this, function() {
			console.log("Init");

			main_container.createTypePool("Base", test, 10);

			main_container.createTypeConfiguration("Base_1", "Base");
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
				(Math.random() * 200) + 20, (Math.random() * 200) + 20,
				Math.random() * 3, "#" + (Math.random().toString(16) + '000000').slice(2, 8)
			]);
		});

		game.create(document.getElementById('main'), document.getElementById('game'));
	}
);