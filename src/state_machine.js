define(["require", "class"], function(require) {

	var setState = function(stateId, newStateInitArgs, lastStateCompleteArgs) {
		if (this.currentStateId != -1) {
			this.states[this.currentStateId].complete(lastStateCompleteArgs);
		}

		this.currentStateId = stateId;

		this.states[this.currentStateId].init(newStateInitArgs);
	};

	var StateMachine = Class.extend({
		init: function() {
			this.states = [];
			this.currentStateId = -1;
		},

		add: function(state) {
			var s = { init: state.init, update: state.update, complete: state.complete };
			return this.states.push(s) - 1;
		},

		get: function(stateId) { return this.states[stateId]; },
		block: function() { this.isBlocked = true; },
		unblock: function() { this.isBlocked = false; },

		update: function() {
			this.states[this.currentStateId].update(arguments);
		},

		destroy: function() {
			for (var i=0; i<this.states.length; i++) {
				this.states[i].destroy();
			}

			this.states.length = 0;
			this.states = null;
		}
	});

	var LooseStateMachine = StateMachine.extend({
		init: function() {
			this._super();
		},

		add: function(state) {
			state.on('change', this, function(args) { this.set(args.stateId, args.newStateInitArgs, args.lastStateCompleteArgs) });
			return this._super(state);
		},

		set: function(stateId, newStateInitArgs, lastStateCompleteArgs) {
			if (this.isBlocked || this.states == null) { return; }

			setState.call(this, stateId, newStateInitArgs, lastStateCompleteArgs);
		}		
	});

	var FixedStateMachine = StateMachine.extend({
		init: function() {
			this._super();
		},

		add: function(state) {
			state.on('next', this, function(args) { this.next(args.newStateInitArgs, args.lastStateCompleteArgs) });
			state.on('previous', this, function(args) { this.previous(args.newStateInitArgs, args.lastStateCompleteArgs) });
			return this._super(state);
		},

		next: function(newStateInitArgs, lastStateCompleteArgs) {
			if (this.currentStateId < this.states.length-1) {
				if (this.isBlocked || this.states == null) { return; }

				this.currentStateId++;	
				setState.call(this, this.currentStateId, newStateInitArgs, lastStateCompleteArgs);
			}	
		},

		previous: function(newStateInitArgs, lastStateCompleteArgs) {
			if (this.currentStateId > 0) {
				if (this.isBlocked || this.states == null) { return; }

				this.currentStateId--;
				setState.call(this, this.currentStateId, newStateInitArgs, lastStateCompleteArgs);	
			}
		}		
	});

	Delegate = require('delegate')

	var State = Delegate.extend({
		init: function(scope) { 
			this._super(); 
			this.scope = scope;
		},

		addStartAction: function(callback) { this.on('start', this.scope, callback); }
		addUpdateAction: function(callback) { this.on('update', this.scope, callback); }
		addCompleteAction: function(callback) { this.on('complete', this.scope, callback); }

		removeStartAction: function(callback) { this.remove('start', this.scope, callback); }
		removeUpdateAction: function(callback) { this.remove('update', this.scope, callback); }
		removeCompleteAction: function(callback) { this.remove('complete', this.scope, callback); }

		start: function(args) { this.execute('start', args); },
		update: function(args) { this.execute('update', args); },
		complete: function(args) { this.execute('complete', args); }
		
		destroy: function() { this.destroy(); }
	});


	var StateMachineFactory = {
		createLooseStateMachine: function() { return new LooseStateMachine(); }
		createFixedStateMachine: function() { return new FixedStateMachine(); }
		
		createState: function(scope) { return new State(scope); }
	};

	return StateMachineFactory;
});