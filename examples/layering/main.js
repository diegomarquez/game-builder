/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [groups](@@groups@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [activity-display](@@activity-display@@),
 * [prevent-keys-default](@@prevent-keys-default@@),
 * [layering-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/nesting-bundle.html),
 * [keyboard](@@keyboard@@)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	// Storing some references to avoid excesive typing
	var game = gb.game;
	var groups = gb.groups;

	var keyboard = require('keyboard');

	game.add_extension(require('basic-display-setup'));
	game.add_extension(require("activity-display"));
	game.add_extension(require("prevent-keys-default"));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('layering-bundle').create();

		// Each [game-object](@@game-object@@) is added to a different updating
		// [group](@@group@@) and to a different [layer](@@layer@@) of the same [viewport](@@viewport@@)
		// The third argument is defined in [basic-display-setup](@@basic-display-setup@@)
		gb.add('Base_3', 'First', 'MainBack');
		gb.add('Base_2', 'Second', 'MainMiddle');
		gb.add('Base_1', 'Third', 'MainFront');

		// These are used to add back the stuff for update and rendering if you
		// remove them while trying out the example.
		// Check out the errors that are printed on console when there are no more [game-objects](@@game-object@@)
		// available in the [pools](@@pool@@). These won't break the app by themselves, but if you see them
		// in your own work, there probably is something fishy going on.
		keyboard.onKeyDown(keyboard.NUM_1, this, function() {
			gb.add('Base_3', 'First', 'MainBack');
		});

		keyboard.onKeyDown(keyboard.NUM_2, this, function() {
			gb.add('Base_2', 'Second', 'MainMiddle');
		});

		keyboard.onKeyDown(keyboard.NUM_3, this, function() {
			gb.add('Base_1', 'Third', 'MainFront');
		});

		keyboard.onKeyDown(keyboard.A, this, function() {
			// Stop calling update method on [game-objects](@@game-object@@) on the 'Third' [group](@@group@@)
			groups.stop_update('Third');
		});

		keyboard.onKeyDown(keyboard.S, this, function() {
			// Stop calling draw method on [game-objects](@@game-object@@) on the 'Third' [group](@@group@@)
			groups.stop_draw('Third');
		});

		keyboard.onKeyDown(keyboard.D, this, function() {
			// Resume all activity on the 'Third' [group](@@group@@)
			groups.resume('Third');
		});

		keyboard.onKeyDown(keyboard.Z, this, function() {
			// Clear all layers of game objects
			groups.all('clear');
		});

		// When a layer is removed it is gone for good, trying to add things
		// to it later will result in an error, printed in console. You can try it out, by adding
		// things to any of the layers after calling this method.
		keyboard.onKeyDown(keyboard.X, this, function() {
			// Remove all layers entirely. You will need to add more layers after doing this.
			groups.all('remove');
		});
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("layering has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("layering has regained focus");
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
