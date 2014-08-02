/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [basic-display-setup](@@basic-display-setup@@),
 * [input-bundle](http://diegomarquez.github.io/game-builder/examples-docs/common_src/bundles/input-bundle.html),
 * [keyboard](@@keyboard@@),
 * [util](@@util@@)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var canvas = gb.canvas;
	
	var keyboard = require('keyboard');
	var util = require('util');

	game.add_extension(require('basic-display-setup'));
	game.add_extension(require("keyboard-lock"));
	game.add_extension(require("pause"));
	game.add_extension(require("resume"));
	game.add_extension(require("activity-display"));

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		require('input-bundle').create();

		//Key Down Events
		keyboard.onKeyDown(keyboard.A, this, function() { 
			console.log("A was pressed");

			// Adding the [game-object](@@game-object@@)
			var go = gb.add('Base_2', 'First', 'MainMiddle');

			// Modifying the [game-object](@@game-object@@) right after adding it to a [layer](@@layer@@).
			go.x = util.rand_f(20, canvas.width-20);
			go.y = util.rand_f(20, canvas.height-20);
			// In this case I know that the renderer I am using has a 'color' property.
			// If you write your own renderer this might not be available.
			go.renderer.color = util.rand_color(); 
		});
		
		keyboard.onKeyDown(keyboard.S, this, function() { 
			console.log("S was pressed");
			console.log('Pause');
			game.pause();
		});
		
		keyboard.onKeyDown(keyboard.D, this, function() { 
			console.log("D was pressed");
		});

		keyboard.onKeyDown(keyboard.GAME_BUTTON_PAUSE, this, function() { 
			console.log("GAME_BUTTON_PAUSE was pressed");
			console.log('Resume');
			game.resume(); 
		});

		// Key Up Events
		keyboard.onKeyUp(keyboard.A, this, function() { console.log("A was released") });
		keyboard.onKeyUp(keyboard.S, this, function() { console.log("S was released") });
		keyboard.onKeyUp(keyboard.D, this, function() { console.log("D was released") });
		keyboard.onKeyUp(keyboard.GAME_BUTTON_PAUSE, this, function() { console.log("GAME_BUTTON_PAUSE was released") });
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("keyboard has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("keyboard has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Do stuff here that needs constant updating
		
		// this.delta => Time delta between updates
		// this.context => 2D Context where stuff is drawn
		if(keyboard.isKeyDown(keyboard.A)){ console.log('A is down') }
		if(keyboard.isKeyDown(keyboard.S)){ console.log('S is down') }
		if(keyboard.isKeyDown(keyboard.D)){ console.log('D is down') }
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
