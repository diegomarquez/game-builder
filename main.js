//Make a module out of ObjectsContiner.js
//main_container should be able to handle stray game_objects that are added to it.
//It is much less usefull than adding game_objects to a container though.

//Implement event bubbling

//TODO: Bootstrap file
//Configure RequireJS
//Load all the core files

//TODO: Be able to configure hitArea.
//Stop using the cumbersome GameObjectUtils file
//Multiple hit areas for a single GameObject
//Hit area should follow the tranformation of it's owner.

//TODO: Hacer que el add del ObjectContainer te devuelva el objeto que va a usar, con todo configurado menos la inicializacion. 
//De ahi puedo llamar directamente al init de ese objeto con los parametros que yo quiera, sin andar creado arrays intermedios.

//TODO: TimeoutFactory tiene que poder destruir las referencias que devuelve de su metodo 'get'
//Probablemente hay que pasarle entre los parametros el nombre de la variable donde estoy guardando el timer.
//Con ese nombre y el scope puede hacer percha esa referencia.

//TODO: Optimizations
//TODO: Optimize drawing method.
//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
//This will not be possible where procedural animations take place. Like the eye of the Boss or its tentacles. But things like Rockets and particles could be cached.
//TODO: Reduce memory Footprint.
//Reduce object pool sizes.

//TODO: Make a Sublime extension to generate all the boilerplater code, associated with an Object file
//TODO: Add a description for each Submodule
//TODO: Create some testing scenarios for all of the modules. Those will serve as demos aswell

//this.container = new ObjectsContainer(this.context).setDefaultLayer(2);
//	self.container.update(dt / 1000, self.manualSoftPause);
//	self.container.draw();

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
			var bla = main_container.add("Base_1", [(Math.random() * 200) + 20, (Math.random() * 200) + 20, Math.random() * 3]);
		});

		game.create(document.getElementById('main'), document.getElementById('game'));
	}
);