/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [colliders-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/colliders-bundle.html),
 * [collision-resolver](@@collision-resolver@@)
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

		require('colliders-bundle').create();

		//This guy will be responsible for making everything work.
		var collision_resolver = require('collision-resolver');

		//Setting up collision pairs. The IDs used correspond to the ones in the colliders configuration.
		//All colliders with ID 'Circle_1' will check for overlapping against all colliders with ID 'Polygon_1'
		collision_resolver.addCollisionPair('circle-collider_ID', 'polygon-collider_ID');
		//All colliders with ID 'Circle_1' will check for overlapping against all colliders with ID 'Fixed_Polygon_1'
		collision_resolver.addCollisionPair('circle-collider_ID', 'fixed-polygon-collider_ID');
		//All colliders with ID 'Fixed_Polygon_1' will check for overlapping against all colliders with ID 'Polygon_1'
		collision_resolver.addCollisionPair('fixed-polygon-collider_ID', 'polygon-collider_ID');		

		gb.add('Base_1', 'First', 'MainMiddle');
		gb.add('Base_2', 'First', 'MainMiddle');
		gb.add('Base_3', 'First', 'MainMiddle');
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("colliders has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("colliders has regained focus");
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
