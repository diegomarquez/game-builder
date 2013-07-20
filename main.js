//TODO: Convert all the important things to modules
//Utility package
//TODO: Bootstrap file
	//Configure RequireJS
	//Load all the core files

//TODO: Simplify GameObject, 
//extend Delegate.

//TODO: Nestable GameObjects 
//follow the tranformation of their respective parents
//A nested gameObject is drawn in the same layer as it's parent and top of it
//Implement event bubbling

//TODO: GameObject Components
//Should be able to be executed during all the states a gameObject can assume

//TODO: Be able to configure hitArea.
//Stop using the cumbersome GameObjectUtils file
//Multiple hit areas for a single GameObject
//Hit area should follow the tranformation of it's owner.

//TODO: Get a better "inherit" method. (John Resig + http://theboywhocriedwoolf.com/js-nodegarden-particlewall/)

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

//TODO: //I Could setup the GameObjects in a way in which I can specify if they need an update or not. 
//That could reduce method calls greatly, since a lot of GameObjects don't use update at all.
//Same could be done with draw

//TODO: Add a brief description of each module in their respective files
//TODO: Create some testing scenarios for all of the modules. Those will serve as demos aswell

require(['domReady!', 'game'], function(doc, game) {

	game.on("pause", this, function() {
		console.log("Pause");
	});

	game.on("resume", this, function() {
		console.log("Resume");
	});

	game.create(document.getElementById('main'), document.getElementById('game'), function() {
		console.log("Create");
	});

});

//Aca van los callbacks para pausar todos los componenetes

// TimeOutFactory.pauseAllTimeOuts();
// ArrowKeyHandler.pause();
// SoundPlayer.pauseAll();

//Aca van los callbacks para re activar todos los componenetes

// TimeOutFactory.resumeAllTimeOuts();
// ArrowKeyHandler.resume();
// SoundPlayer.resumeAll();