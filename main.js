//TODO: Convert all the important things to modules
//TODO: Bootstrap file to load all the base modules the framework is going to use.
	//Should be able to configure the some basic properties like dimentions of the canvas to be used

//TODO: Game Module
	//TODO: Something to set what methods need to be called when the game is paused for whatever reason

//TODO: Simplify GameObject, 
//extend Delegate.
//Polish delegate

//TODO: Nestable GameObjects 
//follow the tranformation of their respective parents
//A nested gameObject is drawn in the same layer as it's parent and top of it
//Implement event bubbling

//TODO: GameObject Components

//TODO: Be able to configure hitArea.
	//Stop using the cumbersome GameObjectUtils file
	//Multiple hit areas for a single GameObject
	//Hit area should follow the tranformation of it's owner.

//TODO: Get a better "inherit" method.
//One that supports _super properly.

//TODO:Single Utility Object, so that the global scope has less litter.

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

require.config({
	paths: {
		"timerFactory" : "scripts/timerFactory",
		"keyboard" : "scripts/keyboard",
	}
});

require(['domReady!', 'timerFactory', 'keyboard'], function(doc, timerFactory, keyboard) {


});