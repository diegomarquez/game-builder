// game-object-creation's main entry point 

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;
	var assembler = gb.assembler;
	var gameObjectPool = gb.goPool;
	var componentPool = gb.coPool;
	var layers = gb.layers;
	var canvas = gb.canvas;

	//This piece of code takes care of creating a basic layer structure.
	//it adds 4 layers to work with, 'Back', 'Middle', 'Front' and 'Text'.
	//Each layer is on top of the previous one.
	//If your project needs more layers, you can replace this extension with one of your own.
	game.add_extension(require('basic-layer-setup'));
	
	var basic_game_object = require('basic-game-object'); 
	var box_renderer      = require('box-renderer');

	// This is the main initialization function
	game.on('init', this, function() {
		console.log('Welcome to Game-Builder!');

		//Create a 'box-renderer' components pool and give it the id 'box-renderer'
		componentPool.createPool('Box_Renderer', box_renderer);
		
		//Create a 'Red_Renderer' configuration for the components in the pool 'box-renderer'
		//When a component with with id 'Red_Renderer' is requested, it will take this arguments.
		//This particular render will draw a box with the specified parameters
		componentPool.createConfiguration('Red_Renderer', 'Box_Renderer')
			.args({	
				color:'#FF0000',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100,
			  });			
		
		//Create a 'basic-game-object' components pool and give it the id 'Base'.
		//The last arguments specifies the amount of objects to create in the pool. In this case 1.
		gameObjectPool.createPool('Base', basic_game_object, 1);

		//Create a 'Base_1' configuration for the components in the pool 'Base'
		//When a game-object with with id 'Base_1' is requested, it will take this arguments
		//NOTICE: The if being sent in through setRenderer(), it matches the one of the component configuration above.
		gameObjectPool.createConfiguration('Base_1', 'Base')
			.args({x:canvas.width/2, y:canvas.height/2, rotation_speed: 3})
			.setRenderer('Red_Renderer');

		// This fetches the game-object with id 'Base_1'. In the process it applies all the configurations we just set.
		var go = assembler.get('Base_1');
		// Add the game object to a rendering layer
		layers.get('Middle').add(go);

		// Start the game object. If this is not called, it is not updated not drawn.
		go.start();
	});

	// This is called when the canvas looses focus
	game.on('blur', this, function() {
		console.log('game-object-creation has lost focus');
	});

	// This is called when the canvas regains focus
	game.on('focus', this, function() {
		console.log('game-object-creation has regained focus');
	});

	// This is the main update loop
	game.on('update', this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});
