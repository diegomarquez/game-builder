define(["require", "class"], function(require) {

	var setState = function(stateId, newStateInitArgs, lastStateCompleteArgs) {
		if (this.isBlocked || this.states == null) { return; }

		if (this.currentStateId != -1) {
			this.states[this.currentStateId].complete(lastStateCompleteArgs);
		}

		this.currentStateId = stateId;

		this.states[this.currentStateId].start(newStateInitArgs);
	};

	var getStateId = function(stateIdOrName) {
		return this.stateIds[stateIdOrName.toString()]
	}

	var StateMachine = Class.extend({
		init: function() {
			this.stateIds = {}
			this.states = [];
			this.currentStateId = -1;
			this.block();
		},

		start: function(args) {
			this.unblock();
			setState.call(this, 0, args, null);
		},

		add: function(state) {
			var stateIndex = this.states.push(state) - 1
		
			state.owner = this;
			this.stateIds[state.name] = stateIndex;
			this.stateIds[stateIndex.toString()] = stateIndex;
		},

		get: function(stateIdOrName) { 
			return this.states[getStateId.call(this, stateIdOrName)]; 
		},

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
			state.on('change', this, function(args) { 
				var changingStateId = getStateId.call(this, state.name)
				if (this.currentStateId != changingStateId) return;

				setState.call(this, getStateId.call(this, args.next), args.nextInitArgs, args.lastCompleteArgs); 
			});

			this._super(state);
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

	var State = require('delegate').extend({
		init: function(scope, name) { 
			this._super(); 
			this.scope = scope;
			this.name = name;
			this.owner = null;
		},

		addStartAction: function(callback) { this.on('start', this.scope, callback); },
		addUpdateAction: function(callback) { this.on('update', this.scope, callback); },
		addCompleteAction: function(callback) { this.on('complete', this.scope, callback); },

		removeStartAction: function(callback) { this.remove('start', this.scope, callback); },
		removeUpdateAction: function(callback) { this.remove('update', this.scope, callback); },
		removeCompleteAction: function(callback) { this.remove('complete', this.scope, callback); },

		start: function(args) { this.execute('start', args); },
		update: function(args) { this.execute('update', args); },
		complete: function(args) { this.execute('complete', args); },
	});


	var StateMachineFactory = {
		createLooseStateMachine: function() { return new LooseStateMachine(); },
		createFixedStateMachine: function() { return new FixedStateMachine(); },
		
		createState: function(scope, name) { return new State(scope, name); }
	};

	return StateMachineFactory;
});