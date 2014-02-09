/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [aspect-ratio-resize](@@aspect-ratio-resize@@),
 * [basic-layer-setup](@@basic-layer-setup@@),
 * [pause](@@pause@@),
 * [resume](@@resume@@),
 * [layering-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/layering-bundle.html),
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	// These extensions add some punch to the basic setup
	game.add_extension(require("aspect-ratio-resize"));
	game.add_extension(require("basic-layer-setup"));
	game.add_extension(require("pause"));
	game.add_extension(require("resume"));
	
	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('layering-bundle').create();

		gb.addToLayer('Front', 'Base_3');
		gb.addToLayer('Middle', 'Base_2');
		gb.addToLayer('Back', 'Base_1');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("extensions has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("extensions has regained focus");
	});

	// This is called when the **pause** method of [game](@@game@@) is called
	// This event is added to [game](@@game@@) when using the [puase](@@puase@@) extensions
	game.on(game.PAUSE, this, function() {
		console.log("extensions has been paused");
	});

	// This is called when the **resume** method of [game](@@game@@) is called
	// This event is added to [game](@@game@@) when using the [resume](@@resume@@) extensions
	game.on(game.RESUME, this, function() {
		console.log("extensions has been resumed");
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
