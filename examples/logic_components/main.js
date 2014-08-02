/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [logic-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/logic-bundle.html)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;

	game.add_extension(require('basic-display-setup'));
	game.add_extension(require("activity-display"));
	
	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('logic-bundle').create();

		gb.add('Base_1', 'First', 'MainMiddle');
		gb.add('Base_2', 'First', 'MainMiddle');
		gb.add('Base_3', 'First', 'MainMiddle');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("logic-components has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("logic-components has regained focus");
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
