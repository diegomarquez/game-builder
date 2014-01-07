// game-object-nesting's main entry point 

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	game.add_extension(require('basic-layer-setup'));

	// This is the main initialization function
	game.on("init", this, function() {
		console.log("Welcome to Game-Builder!");

		// This object encapsulates the logic to setup pools of objects.
		// Incase you though the first example was a bit crud.
		require('nesting-bundle').create();

		// This helper method will add a game object with the id specified in the second argument
		// to the layer specified in the first argument. It also calls the start method of the game object.
		gb.addToLayer('Middle', 'Container_1');
	});

	// This is called when the canvas looses focus
	game.on("blur", this, function() {
		console.log("game-object-nesting has lost focus");
	});

	// This is called when the canvas regains focus
	game.on("focus", this, function() {
		console.log("game-object-nesting has regained focus");
	});

	// This is the main update loop
	game.on("update", this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
