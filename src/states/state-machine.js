/**
 * # state-machine.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of:
 * [state](@@state@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module allows you to setup [finite state machines](http://en.wikipedia.org/wiki/Finite-state_machine).
 * It's a pretty useful pattern in game development, as it's a rather easy way to organize and coordinate different
 * pieces of code without abusing _'if'_ statements.
 *
 * The module provides 2 types of **state machines**
 *
 * The first **"loose"** type, allows you to just go from state to state, with no restriction.
 * It's pretty usefull, but states need to know about the other states in order to change control flow to them.
 * That isn't so good, but it works for small bits of code.
 *
 * The second **"fixed"** type, lets you configure the order of execution of states. In these state machines, a state needs know
 * nothing about other states, which is a good thing. On it's insides, it just says it wants to go to the next state,
 * and stuff happens. No need to know identifiers of any sort. It's a bit more rigid, but could save some headaches if used in the proper
 * situation.
 */

/**
 * Encapsulation is good
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["class", "state", "error-printer"], function(Class, State, ErrorPrinter) {
	var StateMachine = Class.extend({
		init: function() {
			this.stateIds = {}
			this.states = [];
			this.currentStateId = -1;
			this.block();
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Start the state machine.
		 *
		 * Once the states have been added, call this method to go into
		 * the first state, optionally sending some arguments.
		 *
		 * @param {Object} [args=null] Arguments to be sent to the initial state.
		 * @param {Number} [initState=null] State in which the state machine should start.
		 */
		start: function(args, initState) {
			this.unblock();
			executeStateAction.call(this, initState ? initState : 0, 'start', args);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>finish</strong></p>
		 *
		 * Finishes the execution of the current state.
		 *
		 * @param {Object} [args=null] Arguments to be sent to the completion callbacks of the current state.
		 */
		finish: function(args) {
			executeStateAction.call(this, this.currentStateId, 'complete', args);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Add a state object to the state machine.
		 *
		 * This method is redifined by the concrete implementations.
		 *
		 * @param {State} state State object to add
		 */
		add: function(state) {
			var stateIndex = this.states.push(state) - 1

			this.stateIds[state.name] = stateIndex;
			this.stateIds[stateIndex.toString()] = stateIndex;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>get</strong></p>
		 *
		 * Get a reference to a state.
		 *
		 * @param {String|Number} stateIdOrName State id or name
		 * @return {State} The requested state
		 */
		get: function(stateIdOrName) {
			return this.states[getStateId.call(this, stateIdOrName)];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>block</strong></p>
		 *
		 * Blocks the state machine.
		 *
		 * While blocked no actions will be executed,
		 * and state changes can not occur.
		 */
		block: function() {
			this.isBlocked = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>unblock</strong></p>
		 *
		 * Unblock the state machine.
		 *
		 * All behaviour returns to normal after executing this method.
		 */
		unblock: function() {
			this.isBlocked = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Execute the update actions of the state machine.
		 */
		update: function() {
			var state = this.states[this.currentStateId];

			state.update.apply(state, arguments);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>destroy</strong></p>
		 *
		 * Calls the destroy method of all the states registered.
		 *
		 * Nulls the main references. Sets the object up for garbage collection.
		 */
		destroy: function() {
			for (var i = 0; i < this.states.length; i++) {
				this.states[i].destroy();
			}

			this.states.length = 0;
			this.states = null;
		}
		/**
		 * --------------------------------
		 */
	});

	/**
	 * ## **LooseStateMachine** extends **StateMachine**
	 */
	var LooseStateMachine = StateMachine.extend({
		init: function() {
			this._super();
		},

		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Add a state object to the state machine.
		 *
		 * Setup the **change** event of the state, so it is able to pass control flow
		 * to another state.
		 *
		 * When executing the **change** event an argument is required to be passed. ej.
		 *
		 * ``` javascript
		 * state.execute('change', {
			// Name of the state to pass control to
			// This is required
			next: 'StateName'
			// This will be passed as arguments to the complete actions of the current state
			// This is optional
			lastCompleteArgs: {},
			// This will be passed as arguments to the start actions of the next state
			// This is optional
			nextInitArgs: {}
		 * });
		 * ```
		 *
		 * @param {State} state State object to add
		 */
		add: function(state) {
			state.on(state.CHANGE, this, function(args) {
				if (canNotMoveToNewState.call(this, state)) {
					return;
				}

				executeStateAction.call(this, this.currentStateId, 'complete', args.lastCompleteArgs);
				executeStateAction.call(this, getStateId.call(this, args.next), 'start', args.nextInitArgs);
			});

			this._super(state);
		}
		/**
		 * --------------------------------
		 */
	});

	/**
	 * ## **FixedStateMachine** extends **StateMachine**
	 */
	var FixedStateMachine = StateMachine.extend({
		init: function() {
			this._super();
		},

		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Add state object to the state machine.
		 *
		 * Setup the **next** and **previous** events of the state,
		 * so it is able to pass control flow to the corresponding states.
		 *
		 * When executing the **next** and **previous** events an argument is optional. ej.
		 *
		 * ``` javascript
		 * state.execute('next', {
			// This will be passed as arguments to the complete actions of the current state
			// This is optional
			lastCompleteArgs: {},
			// This will be passed as arguments to the start actions of the next state
			// This is optional
			nextInitArgs: {}
		 * });
		 * ```
		 *
		 * @param {State} state State object to add
		 */
		add: function(state) {
			state.on(state.NEXT, this, function(args) {
				if (canNotMoveToNewState.call(this, state)) {
					return;
				}

				executeStateAction.call(this, this.currentStateId, 'complete', args.lastCompleteArgs);

				if (this.currentStateId < this.states.length) {
					this.currentStateId++;
				}
				if (this.currentStateId == this.states.length) {
					this.currentStateId = 0;
				}

				executeStateAction.call(this, this.currentStateId, 'start', args.nextInitArgs);
			});

			state.on(state.PREVIOUS, this, function(args) {
				if (canNotMoveToNewState.call(this, state)) {
					return;
				}

				executeStateAction.call(this, this.currentStateId, 'complete', args.lastCompleteArgs);

				if (this.currentStateId >= 0) {
					this.currentStateId--;
				}
				if (this.currentStateId < 0) {
					this.currentStateId = this.states.length - 1;
				}

				executeStateAction.call(this, this.currentStateId, 'start', args.nextInitArgs);
			});

			return this._super(state);
		}
		/**
		 * --------------------------------
		 */
	});

	/**
	 * ## **State Machine Factory**
	 */
	var StateMachineFactory = {
		// Create a "loose" state machine
		createLooseStateMachine: function() {
			return new LooseStateMachine();
		},
		// Create a "fixed" state machine
		createFixedStateMachine: function() {
			return new FixedStateMachine();
		},
		// Create a state, send in the scope for the state and a name
		createState: function(scope, name) {
			return new State(scope, name);
		}
	};
	/**
	 * --------------------------------
	 */

	var executeStateAction = function(stateId, action, args) {
		if (this.isBlocked || this.states == null)
			return;

		this.states[stateId][action](args);
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

	return StateMachineFactory;
});
