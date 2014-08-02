/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [rendering-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/rendering-bundle.html)
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

		require('rendering-bundle').create();

		gb.add('Base_1', 'First', 'MainMiddle');
		gb.add('Base_2', 'First', 'MainMiddle');
		gb.add('Base_3', 'First', 'MainMiddle');
		gb.add('Base_4', 'First', 'MainMiddle');

		gb.addText('Text_1', 'First', 'Text', 'MainMiddle');
		gb.addText('Text_2', 'First', 'Another text', 'MainMiddle');
		gb.addText('Text_3', 'First', 'Yet more text', 'MainMiddle');
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
		root.draw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
