/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [world](@@world@@),
 * [complex-display-setup](http://diegomarquez.github.io/game-builder/examples-docs/common_src/complex-display-setup.html),
 * [activity-display](@@activity-display@@),
 * [prevent-keys-default](@@prevent-keys-default@@),
 * [input-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/input-bundle.html),
 */

define(function(require){	
	var gb = require('gb');
	var world = require('world');

	gb.debug = true;

	// Storing some references to avoid excesive typing
	var game = gb.game;
	var keyboard = require('keyboard');
	var util = require('util');

	game.add_extension(require('complex-display-setup'));
	game.add_extension(require("activity-display"));
	game.add_extension(require("prevent-keys-default"));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('input-bundle').create();
		require('viewports-bundle').create();

		for (var i=0; i<20; i++) {
			var go = gb.add('Base_2', 'First', 'MainMiniFront');

			go.x = util.rand_f(20, world.getWidth() - 20);
			go.y = util.rand_f(20, world.getHeight() - 20);

			go.renderer.color = util.rand_color(); 
		} 
		 
		var minimapViewArea = gb.add('Frame', 'First', 'MiniFront');

		var v = gb.viewports.get('Main');  

		keyboard.onKeyDown(keyboard.DOWN, this, function() { 
			// Move the viewport
			v.y -= 10; 

			// Lock the viewport from going past the world bounds to the bottom
			if (v.y < -world.getHeight()+minimapViewArea.renderer.height) 
				v.y = -world.getHeight()+minimapViewArea.renderer.height;
			
			// Move the game object that represents the main viewport in the smaller viewport
			minimapViewArea.y = v.y*-1;
		});
		
		keyboard.onKeyDown(keyboard.UP, this, function() { 
			// Move the viewport
			v.y += 10; 

			// Lock the viewport from going past the world bounds to the top
			if (v.y > 0) v.y = 0;
			
			// Move the game object that represents the main viewport in the smaller viewport
			minimapViewArea.y = v.y*-1;
		});
		
		keyboard.onKeyDown(keyboard.RIGHT, this, function() { 
			// Move the viewport
			v.x -= 10; 

			// Lock the viewport from going past the world bounds to the right
			if (v.x < -world.getWidth()+minimapViewArea.renderer.width) 
				v.x = -world.getWidth()+minimapViewArea.renderer.width;

			// Move the game object that represents the main viewport in the smaller viewport
			minimapViewArea.x = v.x*-1;
		});
		
		keyboard.onKeyDown(keyboard.LEFT, this, function() { 
			// Move the viewport
			v.x += 10; 

			// Lock the viewport from going past the world bounds to the left
			if (v.x > 0) v.x = 0;
			
			// Move the game object that represents the main viewport in the smaller viewport
			minimapViewArea.x = v.x*-1;
		});
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("viewports has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("viewports has regained focus");
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