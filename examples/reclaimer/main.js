/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [basic-layer-setup](@@basic-layer-setup@@),
 * [layering-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/layering-bundle.html)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;
	var reclaimer = gb.reclaimer;

	game.add_extension(require('basic-layer-setup'));

	var keyboard = require('keyboard');

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");
		
		require('layering-bundle').create();

		gb.addToLayer('Front', 'Base_1');
		gb.addToLayer('Middle', 'Base_2');
		gb.addToLayer('Back', 'Base_3');

		//These are used to add back the stuff to the layers if you
		//remove them while trying out the example.
		keyboard.onKeyDown(keyboard.A, this, function() {
			gb.addToLayer('Front', 'Base_1');
			gb.addToLayer('Middle', 'Base_2');
			gb.addToLayer('Back', 'Base_3');
		});

		keyboard.onKeyDown(keyboard.S, this, function() {
			reclaimer.claimAll();
		});

		keyboard.onKeyDown(keyboard.Z, this, function() {
			reclaimer.claimOnly('configuration', ['Base_2']);
		});

		keyboard.onKeyDown(keyboard.X, this, function() {
			reclaimer.claimOnly('type', ['Base']);
		});

		keyboard.onKeyDown(keyboard.C, this, function() {
			reclaimer.claimAllBut('configuration', ['Base_2']);
		});

		keyboard.onKeyDown(keyboard.P, this, function() {
			reclaimer.clearAllPools();
		});

		keyboard.onKeyDown(keyboard.O, this, function() {
			console.log( gb.goPool.toString() );
		});

		keyboard.onKeyDown(keyboard.I, this, function() {
			console.log( gb.coPool.toString() );
		});
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("reclaimer has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("reclaimer has regained focus");
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
