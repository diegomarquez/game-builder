// colliders's main entry point 

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	game.add_extension(require('basic_layer_setup'));

	// This is the main initialization function
	game.on("init", this, function() {
		console.log("Welcome to Game-Builder!");

		require('colliders_bundle').create();

		//This guy will be responsible for making everything work. And for setting collision pairs.
		//More on that later
		var collision_resolver = require('collision_resolver');

		//Setting up collision pairs. The IDs used correspond to the ones in the colliders configuration.
		//All colliders with ID 'Circle_1' will check for overlapping against all colliders with ID 'Polygon_1'
		collision_resolver.addCollisionPair('Circle_Collider_ID', 'Polygon_Collider_ID');
		//All colliders with ID 'Circle_1' will check for overlapping against all colliders with ID 'Fixed_Polygon_1'
		collision_resolver.addCollisionPair('Circle_Collider_ID', 'Fixed_Polygon_Collider_ID');
		//All colliders with ID 'Fixed_Polygon_1' will check for overlapping against all colliders with ID 'Polygon_1'
		collision_resolver.addCollisionPair('Fixed_Polygon_Collider_ID', 'Polygon_Collider_ID');		

		gb.addToLayer('Middle', 'Base_1');
		gb.addToLayer('Middle', 'Base_2');
		gb.addToLayer('Middle', 'Base_3');
	});

	// This is called when the canvas looses focus
	game.on("blur", this, function() {
		console.log("colliders has lost focus");
	});

	// This is called when the canvas regains focus
	game.on("focus", this, function() {
		console.log("colliders has regained focus");
	});

	// This is the main update loop
	game.on("update", this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
