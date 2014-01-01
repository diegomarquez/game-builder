define(["delegate", "class"], function(Delegate) {

	var executeStateAction = function(stateId, action, args) {
		if (this.isBlocked || this.states == null) { return; }

		try {
			this.states[stateId][action](args);	
		} catch(e) {
			throw new Error("Error setting new state: " + e.message);
		}

		this.currentStateId = stateId;
	}

	var getStateId = function(stateIdOrName) {
		return this.stateIds[stateIdOrName.toString()]
	};

	var canNotMoveToNewState = function(state) {
		var changingStateId = getStateId.call(this, state.name)
		if (this.currentStateId != changingStateId) {
			return true;
		}
		
		if (this.isBlocked || this.states == null) { 
			return true; 
		}

		return false;
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
			executeStateAction.call(this, 0, 'start', args);
		},

		add: function(state) {
			var stateIndex = this.states.push(state) - 1
		
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
				if (canNotMoveToNewState.call(this, state)) { 
					return; 
				} 

				executeStateAction.call(this, this.currentStateId, 'complete', args.lastCompleteArgs);
				executeStateAction.call(this, getStateId.call(this, args.next), 'start', args.nextInitArgs);
			});

			this._super(state);
		}		
	});

	var FixedStateMachine = StateMachine.extend({
		init: function() {
			this._super();
		},

		add: function(state) {
			state.on('next', this, function(args) { 
				if (canNotMoveToNewState.call(this, state)) { 
					return; 
				}

				executeStateAction.call(this, this.currentStateId, 'complete', args.lastCompleteArgs);

				if (this.currentStateId < this.states.length) { this.currentStateId++; }			
				if (this.currentStateId == this.states.length) { this.currentStateId = 0; }

				executeStateAction.call(this, this.currentStateId, 'start', args.nextInitArgs);
			});

			state.on('previous', this, function(args) { 
				if (canNotMoveToNewState.call(this, state)) { 
					return; 
				}

				executeStateAction.call(this, this.currentStateId, 'complete', args.lastCompleteArgs);

				if (this.currentStateId >= 0) { this.currentStateId--; }			
				if (this.currentStateId < 0) { this.currentStateId = this.states.length-1; }

				executeStateAction.call(this, this.currentStateId, 'start', args.nextInitArgs);
			});

			return this._super(state);
		}		
	});

	var State = Delegate.extend({
		init: function(scope, name) { 
			this._super(); 
			this.scope = scope;
			this.name = name;
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