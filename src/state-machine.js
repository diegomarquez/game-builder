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
 *
 * <p style='color:#AD071D'>Note: State machines may throw a custom error when trying to 
 * execute <strong>Initialization</strong> and <strong>Completion</strong> actions. 
 * This means there is something wrong in the callbacks registered 
 * with the state machine, rather than the state machine itself.</p> 
 */

/**
 * Encapsulation is good
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "class"], function(Delegate) {
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

		/**
		 * <p style='color:#AD071D'><strong>start</strong> Once the states have been added, call this method to go into
		 * the first state, optionally sending some arguments.</p>
		 * @param  {*} [args=null] Arguments to be sent to the initial state.
		 * @return {null}  
		 */
		start: function(args) {
			this.unblock();
			executeStateAction.call(this, 0, 'start', args);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>add</strong> Add state object to the state machine. 
		 * This method is redifined by the concrete implementations.</p>
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
		 * <p style='color:#AD071D'><strong>get</strong> Get a reference to a state.</p>
		 * @param  {String|Number} stateIdOrName State id or name
		 * @return {State} The requested state
		 */
		get: function(stateIdOrName) { 
			return this.states[getStateId.call(this, stateIdOrName)]; 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>block</strong> Blocks the state machine. While blocked no actions will be executed, 
		 * and state changes can not occur.</p>
		 * @return {null}
		 */
		block: function() { this.isBlocked = true; },
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>unblock</strong> Unblock the state machine. All behaviour returns to normal after
		 * executing this method.</p>
		 * @return {null}
		 */
		unblock: function() { this.isBlocked = false; },
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong> Execute the update actions of the state machine. </p>
		 * @return {null}
		 */
		update: function() {
			this.states[this.currentStateId].update(arguments);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>destroy</strong> Calls the destroy method of all the states registered,
		 * and nulls the main references. Set's the object up for garbage collection.</p>
		 * @return {null}
		 */
		destroy: function() {
			for (var i=0; i<this.states.length; i++) {
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
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>LooseStateMachine</strong> extends StateMachine</p>
	 */
	var LooseStateMachine = StateMachine.extend({
		init: function() {
			this._super();
		},

		/**
		 * <p style='color:#AD071D'><strong>add</strong> Add state object to the state machine.
		 * Setup the **change** delegate of the state, so it is able to pass control flow
		 * to another state.</p>
		 *
		 * When executing the **change** delegate an arguments is required to be passed. ej.
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
		 * @return {null}
		 */
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
		/**
		 * --------------------------------
		 */	
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

		/**
		 * <p style='color:#AD071D'><strong>add</strong> Add state object to the state machine.
		 * Setup the **next** and **previous** delegates of the state, so it is able to pass control flow
		 * to the corresponding states.</p>
		 *
		 * When executing the **next** and **previous** delegates an argument is optional. ej.
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
		 *  
		 * ```
		 * 
		 * @param {State} state State object to add
		 * @return {null}
		 */
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
		/**
		 * --------------------------------
		 */		
	});
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>State</strong> extends <a href=@@delegate@@>delegate</a></p>
	 */
	var State = Delegate.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong> Constructor method</p>
		 * @param  {Object} scope Scope to be used by all the callbacks registered with this state
		 * @param  {String} name  Name to later be able to retrieve a reference to the state if needed
		 * @return {null}
		 */
		init: function(scope, name) { 
			this._super(); 
			this.scope = scope;
			this.name = name;
		},

		// Use these methods to add callbacks to each of the three phases of a state.
		// These method are really just wrappers to the [delegate](@@delegate@@) this object is extending.
		// Just a way to type less stuff when adding callbacks.
		addStartAction: function(callback) { this.on('start', this.scope, callback); },
		addUpdateAction: function(callback) { this.on('update', this.scope, callback); },
		addCompleteAction: function(callback) { this.on('complete', this.scope, callback); },

		// Use these methods to remove callbacks from each of the three phases of a state.
		// These method are really just wrappers to the [delegate](@@delegate@@) this object is extending.
		// Just a way to type less stuff when adding callbacks.
		removeStartAction: function(callback) { this.remove('start', this.scope, callback); },
		removeUpdateAction: function(callback) { this.remove('update', this.scope, callback); },
		removeCompleteAction: function(callback) { this.remove('complete', this.scope, callback); },

		// You can use these methods to execute the actions associated with a state's phase,
		// usually you leave that to the state machine.
		// These method are really just wrappers to the [delegate](@@delegate@@) this object is extending.
		// Just a way to type less stuff when adding callbacks.
		start: function(args) { this.execute('start', args); },
		update: function(args) { this.execute('update', args); },
		complete: function(args) { this.execute('complete', args); },
	});
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>State Machine Factory</strong></p>
	 */
	var StateMachineFactory = {
		//Create a "loose" state machine
		createLooseStateMachine: function() { return new LooseStateMachine(); },
		//Create a "fixed" state machine
		createFixedStateMachine: function() { return new FixedStateMachine(); },
		//Create a state, send in the scope for the state and a name
		createState: function(scope, name) { return new State(scope, name); }
	};
	/**
	 * --------------------------------
	 */
	
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

	return StateMachineFactory;
});