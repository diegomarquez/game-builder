define(function(require) {
	var state_machine_factory = require("state_machine_factory");
	var keyboard = require('keyboard');

	return function(name) {
		var state = state_machine_factory.createState(this, name);

		var onNext = function() {
			state.execute('next', {nextInitArgs:'Hello from state 2', lastCompleteArgs:'Good bye state 2'});
		};

		var onPrevious = function() {
			state.execute('previous', {nextInitArgs:'Hello from state 2', lastCompleteArgs:'Good bye state 2'});
		};

		var setupKeyboardCallbacks = function() {
			keyboard.onKeyUp(keyboard.A, this, onNext)
			keyboard.onKeyUp(keyboard.D, this, onPrevious);	
		};

		var removeKeyboardCallbacks = function() {
			keyboard.removeKeyUp(keyboard.A, this, onNext)
			keyboard.removeKeyUp(keyboard.D, this, onPrevious);	
		};

		//As you can see we are able to add as many 
		//functions to be executed for either start, complete or update.
		//These are execued in the order they were added.

		//For this particular example we are removing keyboard callbacks as soon as we leave a state
		//We don't want this callbacks to be executed while we are not in this state.

		state.addStartAction(function(args){
			console.log("Entering State 2")
			console.log(args)
		});

		state.addStartAction(setupKeyboardCallbacks);

		state.addCompleteAction(function(args){
			console.log("Exiting State 2")
			console.log(args)
		});

		state.addCompleteAction(removeKeyboardCallbacks);	

		return state;
	};
});			