//This example will be about setting up a state machine 
//For this example all the code will be on this file.
//We will see how to split your state code across different files in
//another example.

//The main reason I use state machines when making games
//is that they are a neat way to separate related groups of code.
//You should do the same.

define(function(require) {
	var main = function() {
		gjs.game.on("init", this, function() {
			//The first thing to do is get a hold to a reference to the state_machine_factory.
			//This thing will let you instantiate different kinds of state machines and their states.
			var stateMachineFactory = require('state_machine_factory');

			//Will be using this module to control the navigation through the different states
			//of a state machine.
			var keyboard = require('keyboard');

			//This will create a loose state machine.
			//By loose I mean that every state in the state machine can stop execution and pass
			//control to any other state at any given point. Concerns are separated, but it's pretty
			//flexible. The down side is that each state needs to know the IDs of the other states.
			var looseStateMachine = stateMachineFactory.createLooseStateMachine(); 

			//The main purpose of this state machine is provide a simple way to define
			//sets of code with three actions, start, update and complete.
			//start get's called when entering the state and complete when exiting.
			//The update action has to be called manually when you think it is best.

			//Create some states
			var state_1 = stateMachineFactory.createState(this, 'state_1_name');
			var state_2 = stateMachineFactory.createState(this, 'state_2_name');
			var state_3 = stateMachineFactory.createState(this, 'state_3_name');

			//Add some actions to each phase of a state

			state_1.addStartAction(function(args) { 
				console.log('State 1 just started');
				console.log(args);
			});
			state_1.addCompleteAction(function(args) { 
				console.log('State 1 just completed'); 
				console.log(args);
			});

			state_2.addStartAction(function(args) { 
				console.log('State 2 just started');
				console.log(args); 
			});
			state_2.addCompleteAction(function(args) { 
				console.log('State 2 just completed'); 
				console.log(args);
			});

			state_3.addStartAction(function(args) { 
				console.log('State 3 just started');
				console.log(args); 
			});
			
			state_3.addCompleteAction(function(args) { 
				console.log('State 3 just completed');
				console.log(args); 
			});

			//Wiring up some really crud state change logic
			//Note that only the currently executing state 
			//can signal the state machine to change state.

			//If some other state does so, because of nefarious code, such as this example
			//nothing will happen.
			keyboard.onKeyUp(keyboard.A, this, function() {
				state_1.execute('change', {next:'state_2_name', nextInitArgs:'Hello from state 1', lastCompleteArgs:'Good bye state 1'});
			});

			keyboard.onKeyUp(keyboard.S, this, function() {
				state_2.execute('change', {next:'state_3_name', nextInitArgs:'Hello from state 2', lastCompleteArgs:'Good bye state 2'});
			});

			keyboard.onKeyUp(keyboard.D, this, function() {
				state_3.execute('change', {next:'state_1_name', nextInitArgs:'Hello from state 3', lastCompleteArgs:'Good bye state 3'});
			});

			//Finally this will add the states the into the state machine.
			looseStateMachine.add(state_1);
			looseStateMachine.add(state_2);
			looseStateMachine.add(state_3);

			//Don't forget to start the state machine if you don't none of this nonesense will work.
			looseStateMachine.start('State machine was started!');
		});
	};

	return new main()
});