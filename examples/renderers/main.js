/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [layers](@@layers@@),
 * [basic-layer-setup](@@basic-layer-setup@@),
 * [rendering-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/rendering-bundle.html)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;
	
	game.add_extension(require('basic-layer-setup'));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('rendering-bundle').create();

		gb.addToLayer('Middle', 'Base_1');
		gb.addToLayer('Middle', 'Base_2');
		gb.addToLayer('Middle', 'Base_3');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("renderers has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("renderers has regained focus");
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
