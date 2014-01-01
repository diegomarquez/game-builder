// fixed-state-machine's main entry point 

define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	var stateMachineFactory = require('state_machine');

	// This is the main initialization function
	game.on("init", this, function() {
		console.log("Welcome to Game-Builder!");

		//This will create a loose state machine.
		//By fixed I mean that the next and previous state of the current executing state
		//are well defined and can not be bi-passed, like with a loose state machine.
		//The good thing about this type of state machine is that it promotes less coupling
		//between states.
		var fixedStateMachine = stateMachineFactory.createFixedStateMachine(); 

		//The states are now in different files. 
		//Go check those out to see how they look.
		var state_1 = require('../../common_src/state_1');
		var state_2 = require('../../common_src/state_2');
		var state_3 = require('../../common_src/state_3');

		//Note: After starting the state machine. The last and first states will be connected
		// By the next() and previous() methods respectively.

		fixedStateMachine.add(state_1('state_1_name'));
		fixedStateMachine.add(state_2('state_2_name'));
		fixedStateMachine.add(state_3('state_3_name'));

		//Don't forget to start the state machine if you don't none of this nonesense will work.
		fixedStateMachine.start('State machine was started!');
	});

	// This is called when the canvas looses focus
	game.on("blur", this, function() {
		console.log("fixed-state-machine has lost focus");
	});

	// This is called when the canvas regains focus
	game.on("focus", this, function() {
		console.log("fixed-state-machine has regained focus");
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
