//An example on a different kind of state machine.
//The fixed_state_machine. There will be less comment rambling here.
//If you want to read that, go to the loose_state_machine example.

//In this example we will also see how to separate state code in different files.

define(function(require) {
	var main = function() {
		gjs.game.on("init", this, function() {
			var stateMachineFactory = require('state_machine_factory');

			//This will create a loose state machine.
			//By fixed I mean that the next and previous state of the current executing state
			//are well defined and can not be bi-passed, like with a loose state machine.
			//The good thing about this type of state machine is that it promotes less coupling
			//between states.
			var fixedStateMachine = stateMachineFactory.createFixedStateMachine(); 

			//The states are now in different files. 
			//Go check those out to see how they look.
			var state_1 = require('../resources/state_1');
			var state_2 = require('../resources/state_2');
			var state_3 = require('../resources/state_3');

			//Note: After starting the state machine. The last and first states will be connected
			// By the next() and previous() methods respectively.

			//What those require calls actually return are functions, that when called
			//will generate the state.

			//The point is that if you forget to type those () you would be adding a function
			//to the state machine, instead of an actual state. It doesn't work that way.
			fixedStateMachine.add(state_1('state_1_name'));
			fixedStateMachine.add(state_2('state_2_name'));
			fixedStateMachine.add(state_3('state_3_name'));

			//Don't forget to start the state machine if you don't none of this nonesense will work.
			fixedStateMachine.start('State machine was started!');
		});
	};

	return new main()
});