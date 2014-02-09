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
	var root = gb.root;
	var layers = gb.layers;

	var keyboard = require('keyboard');

	game.add_extension(require('basic-layer-setup'));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('layering-bundle').create();

		// Each [game-object](@@game-object@@) is added to a different [layer](@@layer@@)
		gb.addToLayer('Front', 'Base_3');
		gb.addToLayer('Middle', 'Base_2');
		gb.addToLayer('Back', 'Base_1');

		// These are used to add back the stuff to the layers if you
		// remove them while trying out the example.
		// Check out the errors that are printed on console when there are no more [game-objects](@@game-object@@)
		// available in the pools. These won't break the app by themselves, but if you see them
		// in your own work, there probably is something fishy going on.
		keyboard.onKeyDown(keyboard.NUM_1, this, function() {
			gb.addToLayer('Front', 'Base_3');
		});

		keyboard.onKeyDown(keyboard.NUM_2, this, function() {
			gb.addToLayer('Middle', 'Base_2');
		});

		keyboard.onKeyDown(keyboard.NUM_3, this, function() {
			gb.addToLayer('Back', 'Base_1');
		});

		keyboard.onKeyDown(keyboard.A, this, function() {
			// Stop calling update method on game objects on the 'Front' layer
			// Effectively pausing that layer.
			layers.stop_update('Front');
		});

		keyboard.onKeyDown(keyboard.S, this, function() {
			// Stop calling draw method on game objects on the 'Front' layer
			// Effectively making the layer invisible.
			layers.stop_draw('Front');
		});

		keyboard.onKeyDown(keyboard.D, this, function() {
			// Resume all activity on the 'Front'  layer
			layers.resume('Front');
		});

		keyboard.onKeyDown(keyboard.Z, this, function() {
			// Clear all layers of game objects
			layers.all('clear');
		});

		// When a layer is removed it is gone for good, trying to add things
		// to it later will result in an error, printed in console. You can try it out, by adding
		// things to any of the layers after calling this method.
		keyboard.onKeyDown(keyboard.X, this, function() {
			// Remove all layers entirely. You will need to add more layers after doing this.
			layers.all('remove');
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
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
