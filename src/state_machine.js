define(function(require) {
	var StateMachine = function(scope) {
		this.states = [];
		this.scope = scope;
		this.currentStateId = -1;
	
		this.isBlocked = false;
	};

	StateMachine.prototype.add = function(state) {
		var state = { init: state.init, update: state.update, complete: state.complete };
		return this.states.push(state) - 1;
	}

	StateMachine.prototype.set = function(stateId, newStateInitArgs, lastStateCompleteArgs) {
		if (this.isBlocked || this.states == null) { return; }

		if (this.currentStateId != -1 && this.states[this.currentStateId].complete) {
			this.states[this.currentStateId].complete.call(this.scope, lastStateCompleteArgs);
		}

		this.currentStateId = stateId;

		if (this.states[this.currentStateId].init) {
			this.states[this.currentStateId].init.call(this.scope, newStateInitArgs);
		}
	}

	StateMachine.prototype.get = function(stateId) { return this.states[stateId]; }
	StateMachine.prototype.block = function() { this.isBlocked = true; }
	StateMachine.prototype.unblock = function() { this.isBlocked = false; }

	StateMachine.prototype.update = function() {
		if (this.states[this.currentStateId].update) {
			this.states[this.currentStateId].update.call(this.scope, arguments);
		}
	}

	StateMachine.prototype.destroy = function() {
		for (var i=0; i<this.states.length; i++) {
			this.states[i].destroy();
		}

		this.states.length = 0;
		this.states = null;
		this.scope = null;
		this.currentStateId = -1;
	}

	Delegate = require('delegate')

	var State = Delegate.extend({
		init: function(scope) { 
			this._super(); 
			this.scope = scope;
		},

		addStart: function(callback) { this.on('start', this.scope, callback); }
		addUpdate: function(callback) { this.on('update', this.scope, callback); }
		addDestroy: function(callback) { this.on('complete', this.scope, callback); }

		removeStart: function(callback) { this.remove('start', this.scope, callback); }
		removeUpdate: function(callback) { this.remove('update', this.scope, callback); }
		removeDestroy: function(callback) { this.remove('complete', this.scope, callback); }

		start: function(args) { this.execute('start', args); },
		update: function(args) { this.execute('update', args); },
		complete: function(args) { this.execute('complete', args); }
		destroy: function() { this.destroy(); }
	});


	var StateMachineFactory = {
		createStateMachine: function(scope) { return new StateMachine(scope); }
		createState: function(scope) { return new State(scope); }
	};

	return StateMachineFactory;
});