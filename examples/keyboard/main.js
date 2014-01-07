// keyboard's main entry point 

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;
	var layers = gb.layers;
	var assembler = gb.assembler;
	var canvas = gb.canvas;
	
	var keyboard = require('keyboard');
	var util = require('util');

	game.add_extension(require('basic-layer-setup'));

	// This is the main initialization function
	game.on("init", this, function() {
		console.log("Welcome to Game-Builder!");

		require('input-bundle').create();

		//Key Down Events
		keyboard.onKeyDown(keyboard.A, this, function() { 
			console.log("A was pressed");

			// Since I want to do some stuff with this game object before displaying it
			// I don't use the short hand method in the gb object
			var go = assembler.get('Base_2');

			go.x = util.rand_f(20, canvas.width-20);
			go.y = util.rand_f(20, canvas.height-20);
			//In this case I know that the renderer I am using has a 'color' property.
			//If you write your own renderer this might not be available.
			go.renderer.color = util.rand_color(); 

			// Add and start the game object
			layers.get('Middle').add(go).start();
		});
		
		keyboard.onKeyDown(keyboard.S, this, function() { 
			console.log("S was pressed") 
		});
		
		keyboard.onKeyDown(keyboard.D, this, function() { console.log("D was pressed") });

		//Key Up Events
		keyboard.onKeyUp(keyboard.A, this, function() { console.log("A was released") });
		keyboard.onKeyUp(keyboard.S, this, function() { console.log("S was released") });
		keyboard.onKeyUp(keyboard.D, this, function() { console.log("D was released") });
	});

	// This is called when the canvas looses focus
	game.on("blur", this, function() {
		console.log("keyboard has lost focus");
	});

	// This is called when the canvas regains focus
	game.on("focus", this, function() {
		console.log("keyboard has regained focus");
	});

	// This is the main update loop
	game.on("update", this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);

		if(keyboard.isKeyDown(keyboard.A)){ console.log('A is down') }
		if(keyboard.isKeyDown(keyboard.S)){ console.log('S is down') }
		if(keyboard.isKeyDown(keyboard.D)){ console.log('D is down') }
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
