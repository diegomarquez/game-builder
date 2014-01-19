// # game-object-nesting's main entry point 

/**
 * ### Modules at work in this example
 * [gb](@@gb@@)
 * [game](@@game@@)
 * [root](@@root@@)
 * [basic-layer-setup](@@basic-layer-setup@@)
 * [nesting-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/nesting-bundle.html)
 */

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	game.add_extension(require('basic-layer-setup'));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		// This object encapsulates the logic to setup pools of objects.
		// That code can seem rather messy, so it's cool to cram all together in the same place.
		require('nesting-bundle').create();

		// This helper method will add a [game-object](@@game-object@@) 
		// with the id specified in the second argument
		// to the layer specified in the first argument. It also calls the start method of the game object.
		// 
		// This method makes calls to [layers](@@layers@@) and [assembler](@@assembler@@)
		gb.addToLayer('Middle', 'Container_1');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("game-object-nesting has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("game-object-nesting has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
