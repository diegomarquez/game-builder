define(function() {
	var StateMachine = function(scope) {
		this.states = [];
		this.scope = scope;
		this.currentStateId = -1;
	
		this.isBlocked = false;
	};

	StateMachine.prototype.add = function(init, update, complete) {
		var state = { init: init, update: update, complete: complete };
		return this.states.push(state) - 1;
	}

	StateMachine.prototype.set = function(stateId, newStateInitArgs, lastStateCompleteArgs) {
		if (this.isBlocked || this.states == null) {
			return;
		}

		if (this.currentStateId != -1 && this.states[this.currentStateId].complete) {
			this.states[this.currentStateId].complete.apply(this.scope, lastStateCompleteArgs);
		}

		this.currentStateId = stateId;

		if (this.states[this.currentStateId].init) {
			this.states[this.currentStateId].init.apply(this.scope, newStateInitArgs);
		}
	}

	StateMachine.prototype.get = function(stateId) {
		return this.states[stateId];
	}

	StateMachine.prototype.block = function() {
		this.isBlocked = true;
	}

	StateMachine.prototype.unblock = function() {
		this.isBlocked = false;
	}

	StateMachine.prototype.update = function() {
		if (this.states[this.currentStateId].update) {
			if (arguments.length == 0) {
				this.states[this.currentStateId].update.call(this.scope);
			} else {
				this.states[this.currentStateId].update.apply(this.scope, arguments);
			}
		}
	}

	StateMachine.prototype.destroy = function() {
		this.states.length = 0;
		this.states = null;
		this.scope = null;
		this.currentStateId = -1;
	}

	//This is what the module uses to create state machines where needed.
	var StateMachineFactory = {
		create: function(scope) {
			return new StateMachine(scope);
		}
	};

	return StateMachineFactory;
});