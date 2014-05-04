/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [game](@@game@@),
 * [gb](@@gb@@),
 * [root](@@root@@),
 * [game-object-pool](@@game-object-pool@@),
 * [component-pool](@@component-pool@@),
 * [assembler](@@assembler@@),
 * [layers](@@layers@@)
 * [extension](@@extension@@),
 * [basic-layer-setup](@@basic-layer-setup@@),
 * [basic-game-object](http://diegomarquez.github.io/game-builder/examples-docs/common_src/basic-game-object.html),
 * [box-renderer](http://diegomarquez.github.io/game-builder/examples-docs/common_src/box-renderer.html)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	// Storing some references to avoid excesive typing
	var game = gb.game;
	var root = gb.root;
	var assembler = gb.assembler;
	var gameObjectPool = gb.goPool;
	var componentPool = gb.coPool;
	var layers = gb.layers;
	var canvas = gb.canvas;

	// This piece of code takes care of creating a basic layer structure.
	// it adds 4 layers to work with, 'Back', 'Middle', 'Front' and 'Text'.
	// Each layer is on top of the previous one.
	// If your project needs more layers, you can replace this extension with one of your own.
	game.add_extension(require('basic-layer-setup'));
	game.add_extension(require("activity-display"));
	
	// Getting the prototype for [basic-game-object](http://diegomarquez.github.io/game-builder/examples-docs/common_src/basic-game-object.html)
	var basic_game_object = require('basic-game-object'); 
	// Getting the prototype for [box-renderer](http://diegomarquez.github.io/game-builder/examples-docs/common_src/box-renderer.html) component
	var box_renderer = require('box-renderer');

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log('Welcome to Game-Builder!');
		// Create a pool of [box-renderer](http://diegomarquez.github.io/game-builder/examples-docs/common_src/box-renderer.html) objects and give it the id **Box_Renderer**.
		// This is later used to create configurations for this type of objects.
		componentPool.createPool('Box_Renderer', box_renderer);
		
		// Create a **Red_Renderer** configuration for the components in the **Box_Renderer** pool.
		// When a [component](@@component@@) with with id **Red_Renderer** is requested, an object in the **Box_Renderer** pool
		// will be taken and have these agruments applied to it.
		// This particular render will draw a box with the specified parameters.
		componentPool.createConfiguration('Red_Renderer', 'Box_Renderer')
			.args({	
				color:'#FF0000',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100,
			  });			
		
		// Create a [basic-game-object](http://diegomarquez.github.io/game-builder/examples-docs/common_src/basic-game-object.html) pool and give it the id **Base**.
		// The last arguments specifies the amount of objects to create in the pool. In this case 1.
		gameObjectPool.createPool('Base', basic_game_object, 1);

		// Create a **Base_1** configuration for the [game-objects](@@game-object@@) in the pool **Base**
		// When a [game-object](@@game-object@@) with with id **Base_1** is requested, 
		// it will take this arguments.
		// **NOTICE: The id being sent in through setRenderer(), it matches the one of the component configuration above.**
		gameObjectPool.createConfiguration('Base_1', 'Base')
			.args({x:canvas.width/2, y:canvas.height/2, rotation_speed: 3})
			.setRenderer('Red_Renderer');

		// Use the [assembler](@@assembler@@) to put 
		// together the [game-object](@@game-object@@) with id **Base_1**. 
		// In the process it applies all the configurations we just set.
		var go = assembler.get('Base_1');
		// Use the [layers](@@layers@@) module to 
		// add the [game-object](@@game-object@@) to a rendering [layer](@@layer@@)
		layers.get('Middle').add(go);

		// Start the [game-object](@@game-object@@). 
		// If this is not called, it is not updated nor drawn.
		go.start();
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log('game-object-creation has lost focus');
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log('game-object-creation has regained focus');
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
