/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [game](@@game@@),
 * [gb](@@gb@@),
 * [activity-display](@@activity-display@@),
 * [prevent-keys-default](@@prevent-keys-default@@)
 * 
 */

/**
 * --------------------------------
 */
define(function(require){	
	var gb = require('gb');

	// Storing some references to avoid excesive typing
	var game = gb.game;

	game.add_extension(require("activity-display"));
	game.add_extension(require("prevent-keys-default"));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {	
		console.log("Welcome to Game-Builder!");
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("empty has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("empty has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Do stuff here that needs constant updating
		
		// this.delta => Time delta between updates
		// this.context => 2D Context where stuff is drawn
	});

	// This is the main setup that kicks off the whole thing
	game.create();
});
