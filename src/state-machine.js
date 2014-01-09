/**
 * # state-machine.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 *
 * Depends of: 
 * [delegate](@@delegate@@)
 * [class](@@class@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module allows you to setup [finite state machines](http://en.wikipedia.org/wiki/Finite-state_machine).
 * It's a pretty useful pattern in game development, as it's a rather easy way to organize and coordinate different
 * pieces of code without abusing _'if'_ statements.
 * 
 * This module has three main responsibilities:
 *
 * ### 1. Provide a factory for creating state machines and their states.
 *
 * The factory is what this module actually exposes, nothing special about it.
 * 
 * ### 2. Provides 2 types of state machines.
 *
 * The first **"loose"** type, allows you to just go from state to state, with no restriction. 
 * It's pretty usefull, but states need to know about the other states in order to change control flow to them. 
 * That isn't so good, but it works for small bits of code.
 *
 * The second **"fixed"** type, lets you configure the order of execution of states. In these state machines, a state needs know
 * nothing about other states, which is a good thing. On it's insides, it just says it wants to go to the next state,
 * and stuff happens. No need to know identifiers of any sort. It's a bit more rigid, but could save some headaches if used in the proper
 * situation.
 *
 * ### 3. Provides a base class from which to extend your own states.
 * 
 * **States** have three main phases. **Initialization**, **Completion** and **Update**.
 * The first two are functions executed when entering and exiting a state. **Update** must be called in a loop.
 * All phases are optional. Ofcourse, having a state with no phases is a bit on the dumb side.
 */

/**
 * Encapsulation is good
 * --------------------------------
 */

/**
 * --------------------------------
 */
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

	/**
	 * <p style='color:#AD071D'><strong>StateMachine</strong></p>
	 */
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
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>LooseStateMachine</strong> extends StateMachine</p>
	 */
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
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>FixedStateMachine</strong> extends StateMachine</p>
	 */
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
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>State</strong> extends [delegate](@@delegate@@)</p>
	 */
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
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>State Machine Factory</strong> extends [delegate](@@delegate@@)</p>
	 */
	var StateMachineFactory = {
		createLooseStateMachine: function() { return new LooseStateMachine(); },
		createFixedStateMachine: function() { return new FixedStateMachine(); },
		
		createState: function(scope, name) { return new State(scope, name); }
	};
	/**
	 * --------------------------------
	 */

	return StateMachineFactory;
});