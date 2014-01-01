define(function(require) {
	var state_machine_factory = require("state_machine");
	var keyboard = require('keyboard');

	//Notice how a function is returned when defining a state.
	//The function receives the name of the state.

	//I do it this way because requireJS caches the result of a module definition.
	//If I just returned the value of state_machine_factory.createState, the module would
	//always return the same state, instead of acting like a factory.

	return function(name) {
		var state = state_machine_factory.createState(this, name);

		var onNext = function() {
			state.execute('next', {nextInitArgs:'Hello from state 1', lastCompleteArgs:'Good bye state 1'});
		};

		var onPrevious = function() {
			state.execute('previous', {nextInitArgs:'Hello from state 1', lastCompleteArgs:'Good bye state 1'});
		};

		var setupKeyboardCallbacks = function() {
			keyboard.onKeyUp(keyboard.A, this, onNext);
			keyboard.onKeyUp(keyboard.D, this, onPrevious);	
		};

		var removeKeyboardCallbacks = function() {
			keyboard.removeKeyUp(keyboard.A, this, onNext);
			keyboard.removeKeyUp(keyboard.D, this, onPrevious);	
		};

		//As you can see we are able to add as many 
		//functions to be executed for either start, complete or update.
		//These are execued in the order they were added.

		//For this particular example we are removing keyboard callbacks as soon as we leave a state
		//We don't want this callbacks to be executed while we are not in this state.

		state.addStartAction(function(args){
			console.log("Entering State 1");
			console.log(args);
		});

		state.addStartAction(setupKeyboardCallbacks);

		state.addCompleteAction(function(args){
			console.log("Exiting State 1");
			console.log(args);
		});

		state.addCompleteAction(removeKeyboardCallbacks);	

		return state;
	};
});			