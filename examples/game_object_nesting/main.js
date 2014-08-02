/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [nesting-bundle](file://localhost/Users/johndoe/game-builder-gh-pages/examples-docs/common_src/bundles/nesting-bundle.html)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	game.add_extension(require('basic-display-setup'));
	game.add_extension(require("activity-display"));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		// This object encapsulates the logic to setup pools of objects.
		// That code can seem rather messy, so it's cool to cram all together in the same place.
		require('nesting-bundle').create();

		// This helper method will add a [game-object](@@game-object@@) 
		// to the specified [group](@@group@@) and add it for rendering in the specified [viewports](@@viewport@@) 
		gb.add('Container_1', 'First', [{viewport:'Main', layer:'Back'}]);
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
		root.draw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
