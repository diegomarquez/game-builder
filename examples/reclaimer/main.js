/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [layering-bundle](http://localhost:5000/examples-docs/common_src/bundles/layering-bundle.html)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var reclaimer = gb.reclaimer;

	game.add_extension(require('basic-display-setup'));
	game.add_extension(require("activity-display"));

	var keyboard = require('keyboard');

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");
		
		require('layering-bundle').create();

		gb.add('Base_1', 'First', 'MainFront');
		gb.add('Base_2', 'First', 'MainMiddle');
		gb.add('Base_3', 'First', 'MainBack');

		//These are used to add back the stuff to the layers if you
		//remove them while trying out the example.
		keyboard.onKeyDown(keyboard.A, this, function() {
			reclaimer.claimAll();

			gb.add('Base_1', 'First', 'MainFront');
			gb.add('Base_2', 'First', 'MainMiddle');
			gb.add('Base_3', 'First', 'MainBack');
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
		// Do stuff here that needs constant updating
		
		// this.delta => Time delta between updates
		// this.context => 2D Context where stuff is drawn
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
